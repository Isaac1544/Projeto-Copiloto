import {
  AnalyzeTicketValidationError,
  confidenceScoreToLevel,
  uniqueStrings,
  validateAnalyzeTicketInput,
  type AnalyzeTicketAnalysis,
  type AnalyzeTicketErrorCode,
  type AnalyzeTicketErrorResponse,
  type AnalyzeTicketInput,
  type AnalyzeTicketKnowledgeSource,
  type AnalyzeTicketSuccessResponse,
} from "../../../src/lib/analyze-ticket-contract.ts";
import {
  buildEvidencePromptContext,
  buildRuleBasedFallbackAnalysis,
  retrieveKnowledgeEvidence,
  type RankedKnowledgeEvidence,
} from "./knowledge-corpus.ts";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
};

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
const OPENAI_API_URL = "https://api.openai.com/v1/responses";
const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const DEFAULT_TIMEOUT_MS = 25_000;

type ProviderName = "gemini" | "openai" | "anthropic";

const OPENAI_ANALYSIS_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "summary",
    "probableCause",
    "recommendedSteps",
    "suggestedResponse",
    "confidenceScore",
    "safetyAlerts",
  ],
  properties: {
    summary: {
      type: "string",
      description: "Resumo curto do caso para o analista.",
    },
    probableCause: {
      type: "string",
      description: "Hipótese principal baseada apenas nas evidências disponíveis.",
    },
    recommendedSteps: {
      type: "array",
      description: "Passos curtos e objetivos para o analista seguir.",
      minItems: 2,
      maxItems: 5,
      items: {
        type: "string",
      },
    },
    suggestedResponse: {
      type: "string",
      description: "Mensagem sugerida em pt-BR para o cliente.",
    },
    confidenceScore: {
      type: "integer",
      minimum: 0,
      maximum: 100,
      description: "Nível de confiança inteiro entre 0 e 100.",
    },
    safetyAlerts: {
      type: "array",
      description: "Alertas de segurança, lacunas ou limitações da análise.",
      items: {
        type: "string",
      },
    },
  },
} as const;

const BLOCKED_PATTERNS = [
  {
    pattern: /-----BEGIN [A-Z ]+PRIVATE KEY-----/i,
    reason: "Chaves privadas ou certificados não podem seguir para análise automática.",
  },
  {
    pattern: /\bbearer\s+[a-z0-9._\-=/+]+/i,
    reason: "Tokens de autenticação não podem seguir para análise automática.",
  },
  {
    pattern: /\b(?:api[_ -]?key|token|secret|client_secret|access_token)\s*[:=]\s*\S+/i,
    reason: "Segredos, tokens ou chaves de API precisam ser removidos do texto antes da análise.",
  },
  {
    pattern: /\b(?:senha|password)\s*[:=]\s*\S+/i,
    reason: "Senhas não podem ser enviadas para a análise automática.",
  },
  {
    pattern: /\bsb_secret_[a-z0-9]+/i,
    reason: "Credenciais secretas do Supabase não podem ser enviadas para a análise automática.",
  },
];

const MASKING_RULES = [
  {
    fieldToken: "[EMAIL_MASKED]",
    fieldName: "description",
    pattern: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi,
    alert: "E-mails identificáveis foram mascarados antes do envio ao modelo.",
  },
  {
    fieldToken: "[CPF_MASKED]",
    fieldName: "description",
    pattern: /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g,
    alert: "CPFs identificáveis foram mascarados antes do envio ao modelo.",
  },
  {
    fieldToken: "[PHONE_MASKED]",
    fieldName: "description",
    pattern: /\b(?:\+55\s?)?(?:\(?\d{2}\)?\s?)?\d{4,5}-?\d{4}\b/g,
    alert: "Telefones identificáveis foram mascarados antes do envio ao modelo.",
  },
];

type ProviderDraft = {
  summary: string;
  probableCause: string;
  recommendedSteps: string[];
  suggestedResponse: string;
  confidenceScore: number;
  safetyAlerts: string[];
};

type SanitizationResult =
  | {
      blocked: true;
      maskedFields: string[];
      alerts: string[];
      blockedReason: string;
    }
  | {
      blocked: false;
      ticket: AnalyzeTicketInput;
      maskedFields: string[];
      alerts: string[];
    };

function jsonResponse(
  body: AnalyzeTicketSuccessResponse | AnalyzeTicketErrorResponse,
  status = 200,
) {
  return new Response(JSON.stringify(body), {
    status,
    headers: CORS_HEADERS,
  });
}

function errorResponse({
  code,
  message,
  retryable,
  safetyAlerts = [],
  maskedFields = [],
  blockedReason,
}: {
  code: AnalyzeTicketErrorCode;
  message: string;
  retryable: boolean;
  safetyAlerts?: string[];
  maskedFields?: string[];
  blockedReason?: string;
}) {
  return jsonResponse({
    ok: false,
    error: {
      code,
      message,
      retryable,
      safetyAlerts,
      maskedFields,
      blockedReason,
    },
  });
}

function normalizeText(value: string) {
  return value.replace(/\r\n/g, "\n").trim();
}

function sanitizeField(fieldName: keyof AnalyzeTicketInput, value: string | undefined) {
  if (!value) {
    return {
      value,
      masked: false,
      alerts: [] as string[],
    };
  }

  let nextValue = value;
  const alerts: string[] = [];
  let masked = false;

  for (const rule of MASKING_RULES) {
    const previous = nextValue;
    nextValue = nextValue.replace(rule.pattern, rule.fieldToken);
    if (nextValue !== previous) {
      masked = true;
      alerts.push(rule.alert);
    }
  }

  return {
    value: normalizeText(nextValue),
    masked,
    alerts,
    fieldName,
  };
}

function sanitizeInput(input: AnalyzeTicketInput): SanitizationResult {
  const joined = [input.title, input.description, input.additionalContext ?? ""].join("\n");
  for (const blocked of BLOCKED_PATTERNS) {
    if (blocked.pattern.test(joined)) {
      return {
        blocked: true,
        maskedFields: [],
        alerts: ["O texto contém segredo, senha, token ou credencial sensível e foi bloqueado."],
        blockedReason: blocked.reason,
      };
    }
  }

  const title = sanitizeField("title", input.title);
  const description = sanitizeField("description", input.description);
  const additionalContext = sanitizeField("additionalContext", input.additionalContext);

  const maskedFields = [
    ...(title.masked ? ["title"] : []),
    ...(description.masked ? ["description"] : []),
    ...(additionalContext.masked ? ["additionalContext"] : []),
  ];

  return {
    blocked: false,
    ticket: {
      ...input,
      title: title.value ?? input.title,
      description: description.value ?? input.description,
      additionalContext: additionalContext.value,
    },
    maskedFields,
    alerts: uniqueStrings([...title.alerts, ...description.alerts, ...additionalContext.alerts]),
  };
}

function buildFallbackAnalysis(
  ticket: AnalyzeTicketInput,
  sanitizationAlerts: string[],
  evidence: RankedKnowledgeEvidence[],
  provider: ProviderName,
): AnalyzeTicketAnalysis {
  const fallback = buildRuleBasedFallbackAnalysis(ticket, sanitizationAlerts, evidence);
  const safetyAlerts = uniqueStrings([
    ...fallback.safetyAlerts,
    `Modo de contingência ativo: o provedor ${getProviderLabel(provider)} não foi configurado nesta função.`,
  ]);

  return {
    ticket,
    summary: fallback.summary,
    probableCause: fallback.probableCause,
    recommendedSteps: fallback.recommendedSteps,
    suggestedResponse: fallback.suggestedResponse,
    confidenceScore: fallback.confidenceScore,
    confidenceLevel: confidenceScoreToLevel(fallback.confidenceScore),
    safetyAlerts,
    sources: evidence.map((item) => ({
      title: item.title,
      reference: item.reference,
      sourceType: item.sourceType,
    })),
    sanitization: {
      status: sanitizationAlerts.length > 0 ? "masked" : "clean",
      maskedFields: [],
      alerts: sanitizationAlerts,
    },
  };
}

function buildPrompt(
  ticket: AnalyzeTicketInput,
  sanitizationAlerts: string[],
  evidence: RankedKnowledgeEvidence[],
) {
  const context = [
    "Você é o Copiloto L1 da Clear IT.",
    "Responda sempre em pt-BR.",
    "Você apoia um analista humano; nunca fale como decisor final.",
    "Nunca peça senha, token, chave ou segredo ao cliente.",
    "Use somente as evidências fornecidas; não invente fontes nem afirme consulta externa inexistente.",
    "Se faltarem dados, deixe isso explícito na hipótese e reduza a confiança.",
    "Seu foco é identificar o problema provável, sugerir um caminho de resolução seguro e redigir uma resposta útil para o cliente.",
    "Quando a evidência não for suficiente para resolver, recomende explicitamente quais dados pedir ou quando escalar.",
    "Quando houver indício de risco, impacto alto, ausência de workaround documentado ou necessidade técnica especializada, recomende escalonamento.",
    "Evite respostas genéricas. Seja específico sobre o que foi entendido do chamado, o que ainda falta confirmar e o que o analista deve fazer a seguir.",
    "Retorne JSON puro, sem markdown, com as chaves:",
    "summary, probableCause, recommendedSteps, suggestedResponse, confidenceScore, safetyAlerts.",
    "summary deve resumir o caso em linguagem operacional clara.",
    "probableCause deve funcionar como identificação do problema provável, deixando claro quando ainda é hipótese.",
    "recommendedSteps deve representar a sugestão de resolução, com entre 2 e 5 itens curtos, específicos e seguros.",
    "Se não houver resolução fechada, os passos devem priorizar coleta de evidências, validação e escalonamento responsável.",
    "suggestedResponse deve ser um rascunho um pouco mais elaborado para o cliente, com contexto, próximo passo e expectativa realista, sem prometer solução não validada.",
    "confidenceScore deve ser inteiro de 0 a 100.",
  ].join("\n");

  const ticketText = [
    `Título: ${ticket.title}`,
    `Descrição: ${ticket.description}`,
    `Categoria: ${ticket.category}`,
    `Prioridade: ${ticket.priority}`,
    `Contexto adicional: ${ticket.additionalContext ?? "não informado"}`,
    `Alertas prévios de sanitização: ${sanitizationAlerts.join(" | ") || "nenhum"}`,
    "",
    "Evidências de KB recuperadas:",
    buildEvidencePromptContext(evidence),
  ].join("\n");

  return { system: context, user: ticketText };
}

function getProviderLabel(provider: ProviderName) {
  if (provider === "gemini") return "Gemini";
  if (provider === "openai") return "OpenAI";
  return "Anthropic";
}

function getConfiguredProvider():
  | ProviderName
  | {
      kind: "error";
      response: AnalyzeTicketErrorResponse;
    } {
  const rawProvider = normalizeText(Deno.env.get("LLM_PROVIDER") ?? "openai").toLowerCase();
  if (rawProvider === "gemini" || rawProvider === "openai" || rawProvider === "anthropic") {
    return rawProvider;
  }

  return {
    kind: "error",
    response: {
      ok: false,
      error: {
        code: "PROVIDER_UNAVAILABLE",
        message: "LLM_PROVIDER inválido no Supabase. Use 'gemini', 'openai' ou 'anthropic'.",
        retryable: false,
        safetyAlerts: [],
        maskedFields: [],
      },
    },
  };
}

function buildProviderUnavailableError(
  provider: ProviderName,
  sanitizationAlerts: string[],
  missingConfig: string[],
): AnalyzeTicketErrorResponse {
  return {
    ok: false,
    error: {
      code: "PROVIDER_UNAVAILABLE",
      message: `A função analyze-ticket está ativa, mas ainda faltam ${missingConfig.join(", ")} no Supabase para usar ${getProviderLabel(provider)}.`,
      retryable: false,
      safetyAlerts: sanitizationAlerts,
      maskedFields: [],
    },
  };
}

async function callConfiguredProvider(
  ticket: AnalyzeTicketInput,
  sanitizationAlerts: string[],
  evidence: RankedKnowledgeEvidence[],
): Promise<ProviderDraft | { kind: "error"; response: AnalyzeTicketErrorResponse }> {
  const allowMock = Deno.env.get("ALLOW_MOCK_ANALYSIS") === "true";
  const configuredProvider = getConfiguredProvider();

  if (typeof configuredProvider !== "string") {
    return configuredProvider;
  }

  if (configuredProvider === "gemini") {
    return callGemini(ticket, sanitizationAlerts, evidence, allowMock);
  }

  if (configuredProvider === "openai") {
    return callOpenAI(ticket, sanitizationAlerts, evidence, allowMock);
  }

  return callAnthropic(ticket, sanitizationAlerts, evidence, allowMock);
}

async function callGemini(
  ticket: AnalyzeTicketInput,
  sanitizationAlerts: string[],
  evidence: RankedKnowledgeEvidence[],
  allowMock: boolean,
): Promise<ProviderDraft | { kind: "error"; response: AnalyzeTicketErrorResponse }> {
  const apiKey = Deno.env.get("GEMINI_API_KEY");
  const model = Deno.env.get("GEMINI_MODEL");
  const missingConfig = [...(apiKey ? [] : ["GEMINI_API_KEY"]), ...(model ? [] : ["GEMINI_MODEL"])];

  if (missingConfig.length > 0) {
    if (allowMock) {
      const fallback = buildFallbackAnalysis(ticket, sanitizationAlerts, evidence, "gemini");
      return {
        summary: fallback.summary,
        probableCause: fallback.probableCause,
        recommendedSteps: fallback.recommendedSteps,
        suggestedResponse: fallback.suggestedResponse,
        confidenceScore: fallback.confidenceScore,
        safetyAlerts: fallback.safetyAlerts,
      };
    }

    return {
      kind: "error",
      response: buildProviderUnavailableError("gemini", sanitizationAlerts, missingConfig),
    };
  }

  const { system, user } = buildPrompt(ticket, sanitizationAlerts, evidence);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "ticket_analysis",
            strict: true,
            schema: OPENAI_ANALYSIS_SCHEMA,
          },
        },
      }),
      signal: controller.signal,
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      const message =
        extractProviderErrorMessage(payload) ??
        "O provedor de IA retornou uma falha ao processar o chamado.";
      return {
        kind: "error",
        response: {
          ok: false,
          error: {
            code: "PROVIDER_UNAVAILABLE",
            message,
            retryable: response.status >= 500 || response.status === 429,
            safetyAlerts: sanitizationAlerts,
            maskedFields: [],
          },
        },
      };
    }

    try {
      const parsedDraft = extractGeminiParsedDraft(payload);
      const draft = parsedDraft
        ? validateProviderDraft(parsedDraft)
        : validateProviderDraft(parseJsonFragment(extractGeminiMessageText(payload)));
      return draft;
    } catch {
      return {
        kind: "error",
        response: {
          ok: false,
          error: {
            code: "INVALID_MODEL_OUTPUT",
            message:
              "A IA respondeu fora do contrato esperado e a análise foi descartada com segurança.",
            retryable: true,
            safetyAlerts: sanitizationAlerts,
            maskedFields: [],
          },
        },
      };
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return {
        kind: "error",
        response: {
          ok: false,
          error: {
            code: "UPSTREAM_TIMEOUT",
            message: "A análise demorou além do limite configurado. Tente novamente em instantes.",
            retryable: true,
            safetyAlerts: sanitizationAlerts,
            maskedFields: [],
          },
        },
      };
    }

    return {
      kind: "error",
      response: {
        ok: false,
        error: {
          code: "UNEXPECTED_ERROR",
          message: "Ocorreu uma falha inesperada ao chamar o provedor de IA.",
          retryable: true,
          safetyAlerts: sanitizationAlerts,
          maskedFields: [],
        },
      },
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

async function callOpenAI(
  ticket: AnalyzeTicketInput,
  sanitizationAlerts: string[],
  evidence: RankedKnowledgeEvidence[],
  allowMock: boolean,
): Promise<ProviderDraft | { kind: "error"; response: AnalyzeTicketErrorResponse }> {
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  const model = Deno.env.get("OPENAI_MODEL");
  const missingConfig = [...(apiKey ? [] : ["OPENAI_API_KEY"]), ...(model ? [] : ["OPENAI_MODEL"])];

  if (missingConfig.length > 0) {
    if (allowMock) {
      const fallback = buildFallbackAnalysis(ticket, sanitizationAlerts, evidence, "openai");
      return {
        summary: fallback.summary,
        probableCause: fallback.probableCause,
        recommendedSteps: fallback.recommendedSteps,
        suggestedResponse: fallback.suggestedResponse,
        confidenceScore: fallback.confidenceScore,
        safetyAlerts: fallback.safetyAlerts,
      };
    }

    return {
      kind: "error",
      response: buildProviderUnavailableError("openai", sanitizationAlerts, missingConfig),
    };
  }

  const { system, user } = buildPrompt(ticket, sanitizationAlerts, evidence);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        max_output_tokens: 900,
        text: {
          format: {
            type: "json_schema",
            name: "ticket_analysis",
            strict: true,
            schema: OPENAI_ANALYSIS_SCHEMA,
          },
        },
        input: [
          {
            role: "system",
            content: [{ type: "input_text", text: system }],
          },
          {
            role: "user",
            content: [{ type: "input_text", text: user }],
          },
        ],
      }),
      signal: controller.signal,
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      const message =
        extractProviderErrorMessage(payload) ??
        "O provedor de IA retornou uma falha ao processar o chamado.";
      return {
        kind: "error",
        response: {
          ok: false,
          error: {
            code: "PROVIDER_UNAVAILABLE",
            message,
            retryable: response.status >= 500 || response.status === 429,
            safetyAlerts: sanitizationAlerts,
            maskedFields: [],
          },
        },
      };
    }

    try {
      const parsedDraft = extractOpenAIParsedDraft(payload);
      const draft = parsedDraft
        ? validateProviderDraft(parsedDraft)
        : validateProviderDraft(parseJsonFragment(extractOpenAIText(payload)));
      return draft;
    } catch {
      return {
        kind: "error",
        response: {
          ok: false,
          error: {
            code: "INVALID_MODEL_OUTPUT",
            message:
              "A IA respondeu fora do contrato esperado e a análise foi descartada com segurança.",
            retryable: true,
            safetyAlerts: sanitizationAlerts,
            maskedFields: [],
          },
        },
      };
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return {
        kind: "error",
        response: {
          ok: false,
          error: {
            code: "UPSTREAM_TIMEOUT",
            message: "A análise demorou além do limite configurado. Tente novamente em instantes.",
            retryable: true,
            safetyAlerts: sanitizationAlerts,
            maskedFields: [],
          },
        },
      };
    }

    return {
      kind: "error",
      response: {
        ok: false,
        error: {
          code: "UNEXPECTED_ERROR",
          message: "Ocorreu uma falha inesperada ao chamar o provedor de IA.",
          retryable: true,
          safetyAlerts: sanitizationAlerts,
          maskedFields: [],
        },
      },
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

async function callAnthropic(
  ticket: AnalyzeTicketInput,
  sanitizationAlerts: string[],
  evidence: RankedKnowledgeEvidence[],
  allowMock: boolean,
): Promise<ProviderDraft | { kind: "error"; response: AnalyzeTicketErrorResponse }> {
  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
  const model = Deno.env.get("ANTHROPIC_MODEL");
  const missingConfig = [
    ...(apiKey ? [] : ["ANTHROPIC_API_KEY"]),
    ...(model ? [] : ["ANTHROPIC_MODEL"]),
  ];

  if (missingConfig.length > 0) {
    if (allowMock) {
      const fallback = buildFallbackAnalysis(ticket, sanitizationAlerts, evidence, "anthropic");
      return {
        summary: fallback.summary,
        probableCause: fallback.probableCause,
        recommendedSteps: fallback.recommendedSteps,
        suggestedResponse: fallback.suggestedResponse,
        confidenceScore: fallback.confidenceScore,
        safetyAlerts: fallback.safetyAlerts,
      };
    }

    return {
      kind: "error",
      response: buildProviderUnavailableError("anthropic", sanitizationAlerts, missingConfig),
    };
  }

  const { system, user } = buildPrompt(ticket, sanitizationAlerts, evidence);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: 900,
        system,
        messages: [{ role: "user", content: user }],
      }),
      signal: controller.signal,
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      const message =
        extractProviderErrorMessage(payload) ??
        "O provedor de IA retornou uma falha ao processar o chamado.";
      return {
        kind: "error",
        response: {
          ok: false,
          error: {
            code: "PROVIDER_UNAVAILABLE",
            message,
            retryable: response.status >= 500 || response.status === 429,
            safetyAlerts: sanitizationAlerts,
            maskedFields: [],
          },
        },
      };
    }

    try {
      const text = extractAnthropicText(payload);
      const draft = validateProviderDraft(parseJsonFragment(text));
      return draft;
    } catch (error) {
      const detail = error instanceof Error ? ` Detalhe técnico: ${error.message}` : "";
      const textPreview = (() => {
        try {
          const text = extractAnthropicText(payload);
          return normalizeText(text).slice(0, 220);
        } catch {
          return "sem preview";
        }
      })();
      return {
        kind: "error",
        response: {
          ok: false,
          error: {
            code: "INVALID_MODEL_OUTPUT",
            message: `A IA respondeu fora do contrato esperado e a análise foi descartada com segurança.${detail} Preview: ${textPreview}`,
            retryable: true,
            safetyAlerts: sanitizationAlerts,
            maskedFields: [],
          },
        },
      };
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return {
        kind: "error",
        response: {
          ok: false,
          error: {
            code: "UPSTREAM_TIMEOUT",
            message: "A análise demorou além do limite configurado. Tente novamente em instantes.",
            retryable: true,
            safetyAlerts: sanitizationAlerts,
            maskedFields: [],
          },
        },
      };
    }
    return {
      kind: "error",
      response: {
        ok: false,
        error: {
          code: "UNEXPECTED_ERROR",
          message: "Ocorreu uma falha inesperada ao chamar o provedor de IA.",
          retryable: true,
          safetyAlerts: sanitizationAlerts,
          maskedFields: [],
        },
      },
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

function extractProviderErrorMessage(payload: unknown) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return null;
  const record = payload as Record<string, unknown>;
  const error = record.error;
  if (!error || typeof error !== "object" || Array.isArray(error)) return null;
  const errorRecord = error as Record<string, unknown>;
  return typeof errorRecord.message === "string" ? normalizeText(errorRecord.message) : null;
}

function extractAnthropicText(payload: unknown) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("Resposta do provedor fora do formato esperado.");
  }
  const record = payload as Record<string, unknown>;
  const content = record.content;
  if (!Array.isArray(content)) {
    throw new Error("Resposta do provedor sem blocos de conteúdo.");
  }
  const text = content
    .map((block) => {
      if (!block || typeof block !== "object" || Array.isArray(block)) return "";
      const blockRecord = block as Record<string, unknown>;
      return typeof blockRecord.text === "string" ? blockRecord.text : "";
    })
    .join("\n")
    .trim();

  if (!text) {
    throw new Error("O provedor não retornou texto analisável.");
  }
  return text;
}

function extractOpenAIText(payload: unknown) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("Resposta do provedor fora do formato esperado.");
  }

  const record = payload as Record<string, unknown>;
  if (typeof record.output_text === "string" && normalizeText(record.output_text)) {
    return normalizeText(record.output_text);
  }

  const output = record.output;
  if (!Array.isArray(output)) {
    throw new Error("Resposta do provedor sem blocos de conteúdo.");
  }

  const text = output
    .flatMap((item) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) return [];
      const itemRecord = item as Record<string, unknown>;
      const content = itemRecord.content;
      if (!Array.isArray(content)) return [];

      return content.map((block) => {
        if (!block || typeof block !== "object" || Array.isArray(block)) return "";
        const blockRecord = block as Record<string, unknown>;
        if (typeof blockRecord.text === "string") {
          return blockRecord.text;
        }
        const nestedText = blockRecord.text;
        if (nestedText && typeof nestedText === "object" && !Array.isArray(nestedText)) {
          const nestedRecord = nestedText as Record<string, unknown>;
          return typeof nestedRecord.value === "string" ? nestedRecord.value : "";
        }
        return "";
      });
    })
    .join("\n")
    .trim();

  if (!text) {
    throw new Error("O provedor não retornou texto analisável.");
  }

  return text;
}

function extractOpenAIParsedDraft(payload: unknown) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return null;
  }

  const record = payload as Record<string, unknown>;
  const directParsed = record.output_parsed;
  if (directParsed && typeof directParsed === "object" && !Array.isArray(directParsed)) {
    return directParsed;
  }

  const output = record.output;
  if (!Array.isArray(output)) {
    return null;
  }

  for (const item of output) {
    if (!item || typeof item !== "object" || Array.isArray(item)) continue;
    const itemRecord = item as Record<string, unknown>;
    const content = itemRecord.content;
    if (!Array.isArray(content)) continue;

    for (const block of content) {
      if (!block || typeof block !== "object" || Array.isArray(block)) continue;
      const blockRecord = block as Record<string, unknown>;
      const parsed = blockRecord.parsed;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed;
      }
    }
  }

  return null;
}

function extractGeminiParsedDraft(payload: unknown) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return null;
  }

  const record = payload as Record<string, unknown>;
  const choices = record.choices;
  if (!Array.isArray(choices) || choices.length === 0) {
    return null;
  }

  const firstChoice = choices[0];
  if (!firstChoice || typeof firstChoice !== "object" || Array.isArray(firstChoice)) {
    return null;
  }

  const firstChoiceRecord = firstChoice as Record<string, unknown>;
  const message = firstChoiceRecord.message;
  if (!message || typeof message !== "object" || Array.isArray(message)) {
    return null;
  }

  const messageRecord = message as Record<string, unknown>;
  const parsed = messageRecord.parsed;
  if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
    return parsed;
  }

  return null;
}

function extractGeminiMessageText(payload: unknown) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("Resposta do provedor fora do formato esperado.");
  }

  const record = payload as Record<string, unknown>;
  const choices = record.choices;
  if (!Array.isArray(choices) || choices.length === 0) {
    throw new Error("Resposta do provedor sem escolhas.");
  }

  const firstChoice = choices[0];
  if (!firstChoice || typeof firstChoice !== "object" || Array.isArray(firstChoice)) {
    throw new Error("Resposta do provedor sem formato de choice válido.");
  }

  const firstChoiceRecord = firstChoice as Record<string, unknown>;
  const message = firstChoiceRecord.message;
  if (!message || typeof message !== "object" || Array.isArray(message)) {
    throw new Error("Resposta do provedor sem message válido.");
  }

  const messageRecord = message as Record<string, unknown>;
  const content = messageRecord.content;
  if (typeof content === "string" && normalizeText(content)) {
    return normalizeText(content);
  }

  throw new Error("O provedor não retornou texto analisável.");
}

function parseJsonFragment(text: string) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const jsonCandidate =
    fenced?.[1]?.trim() ?? text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1).trim();
  if (!jsonCandidate.startsWith("{") || !jsonCandidate.endsWith("}")) {
    throw new Error("A IA não retornou JSON válido.");
  }
  return JSON.parse(jsonCandidate);
}

function validateProviderDraft(value: unknown): ProviderDraft {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Saída da IA fora do formato esperado.");
  }
  const record = value as Record<string, unknown>;

  const summary = readNonEmptyString(record, "summary");
  const probableCause = readNonEmptyString(record, "probableCause");
  const suggestedResponse = readNonEmptyString(record, "suggestedResponse");
  const confidenceRaw = record.confidenceScore;
  const stepsRaw = record.recommendedSteps;
  const alertsRaw = record.safetyAlerts ?? [];

  if (typeof confidenceRaw !== "number" || !Number.isFinite(confidenceRaw)) {
    throw new Error("confidenceScore precisa ser numérico.");
  }
  if (!Array.isArray(stepsRaw) || stepsRaw.length === 0) {
    throw new Error("recommendedSteps precisa ter pelo menos um item.");
  }
  if (!Array.isArray(alertsRaw)) {
    throw new Error("safetyAlerts precisa ser uma lista.");
  }

  return {
    summary,
    probableCause,
    suggestedResponse,
    confidenceScore: Math.max(0, Math.min(100, Math.round(confidenceRaw))),
    recommendedSteps: stepsRaw
      .map((step, index) => {
        if (typeof step !== "string") {
          throw new Error(`recommendedSteps[${index}] precisa ser texto.`);
        }
        const normalized = normalizeText(step);
        if (!normalized) {
          throw new Error(`recommendedSteps[${index}] não pode ficar vazio.`);
        }
        return normalized;
      })
      .slice(0, 6),
    safetyAlerts: alertsRaw
      .map((alert, index) => {
        if (typeof alert !== "string") {
          throw new Error(`safetyAlerts[${index}] precisa ser texto.`);
        }
        return normalizeText(alert);
      })
      .filter(Boolean)
      .slice(0, 10),
  };
}

function readNonEmptyString(source: Record<string, unknown>, key: string) {
  const value = source[key];
  if (typeof value !== "string") {
    throw new Error(`${key} precisa ser texto.`);
  }
  const normalized = normalizeText(value);
  if (!normalized) {
    throw new Error(`${key} não pode ficar vazio.`);
  }
  return normalized;
}

function buildSuccessResponse(
  ticket: AnalyzeTicketInput,
  sanitizedFields: string[],
  sanitizationAlerts: string[],
  draft: ProviderDraft,
  sources: AnalyzeTicketKnowledgeSource[],
): AnalyzeTicketSuccessResponse {
  const confidenceScore = Math.max(0, Math.min(100, Math.round(draft.confidenceScore)));
  return {
    ok: true,
    analysis: {
      ticket,
      summary: draft.summary,
      probableCause: draft.probableCause,
      recommendedSteps: draft.recommendedSteps,
      suggestedResponse: draft.suggestedResponse,
      confidenceScore,
      confidenceLevel: confidenceScoreToLevel(confidenceScore),
      safetyAlerts: uniqueStrings([...sanitizationAlerts, ...draft.safetyAlerts]),
      sources,
      sanitization: {
        status: sanitizedFields.length > 0 ? "masked" : "clean",
        maskedFields: sanitizedFields,
        alerts: sanitizationAlerts,
      },
    },
  };
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  if (request.method !== "POST") {
    return errorResponse({
      code: "INVALID_INPUT",
      message: "A função analyze-ticket aceita apenas requisições POST.",
      retryable: false,
    });
  }

  try {
    const rawBody = await request.json();
    const input = validateAnalyzeTicketInput(rawBody);
    const sanitization = sanitizeInput(input);

    if (sanitization.blocked) {
      return errorResponse({
        code: "BLOCKED_CONTENT",
        message:
          "O chamado contém conteúdo sensível que precisa ser removido antes da análise automática.",
        retryable: false,
        safetyAlerts: sanitization.alerts,
        maskedFields: sanitization.maskedFields,
        blockedReason: sanitization.blockedReason,
      });
    }

    const evidence = retrieveKnowledgeEvidence(sanitization.ticket, sanitization.alerts);
    const providerResult = await callConfiguredProvider(
      sanitization.ticket,
      sanitization.alerts,
      evidence,
    );

    if ("kind" in providerResult) {
      return jsonResponse(providerResult.response);
    }

    const response = buildSuccessResponse(
      sanitization.ticket,
      sanitization.maskedFields,
      sanitization.alerts,
      providerResult,
      evidence.map((item) => ({
        title: item.title,
        reference: item.reference,
        sourceType: item.sourceType,
      })),
    );

    return jsonResponse(response);
  } catch (error) {
    if (error instanceof AnalyzeTicketValidationError) {
      return errorResponse({
        code: "INVALID_INPUT",
        message: error.message,
        retryable: false,
      });
    }

    if (error instanceof SyntaxError) {
      return errorResponse({
        code: "INVALID_INPUT",
        message: "O corpo da requisição não está em JSON válido.",
        retryable: false,
      });
    }

    if (error instanceof Error) {
      return errorResponse({
        code: "INVALID_MODEL_OUTPUT",
        message:
          "A IA respondeu fora do contrato esperado e a análise foi descartada com segurança.",
        retryable: true,
      });
    }

    return errorResponse({
      code: "UNEXPECTED_ERROR",
      message: "Falha inesperada ao processar a análise.",
      retryable: true,
    });
  }
});
