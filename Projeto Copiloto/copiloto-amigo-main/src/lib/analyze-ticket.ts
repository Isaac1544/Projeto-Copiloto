import {
  buildAnalystKnowledgeContext,
  retrieveAnalystKnowledgeEvidence,
  type AnalystKnowledgeEvidence,
} from "./analyst-knowledge";
import { gerarSugestaoMock, montarContextoAnalise, type Ticket } from "./mock-data";
import {
  AnalyzeTicketValidationError,
  confidenceScoreToLevel,
  uniqueStrings,
  validateAnalyzeTicketInput,
  type AnalyzeTicketAnalysis,
  type AnalyzeTicketErrorResponse,
  type AnalyzeTicketSuccessResponse,
  validateAnalyzeTicketResponse,
} from "./analyze-ticket-contract";
import { isDemoModeEnabled } from "./runtime-mode";

function getAnalyzeTicketEndpoint() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (!supabaseUrl) {
    throw new Error("VITE_SUPABASE_URL não configurado para chamar analyze-ticket.");
  }
  return `${supabaseUrl}/functions/v1/analyze-ticket`;
}

function getPublishableKey() {
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!publishableKey) {
    throw new Error("VITE_SUPABASE_PUBLISHABLE_KEY não configurado para chamar analyze-ticket.");
  }
  return publishableKey;
}

function buildRemoteAnalysisErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message.trim() : String(error ?? "").trim();

  if (!message) {
    return "Não foi possível gerar a análise no backend configurado.";
  }

  const lowered = message.toLowerCase();
  if (lowered.includes("failed to fetch") || lowered === "fetch") {
    return "Não foi possível conectar ao backend de análise. Verifique o deploy da função analyze-ticket e a configuração do Supabase.";
  }

  return message;
}

function extractRemoteErrorMessageFromBody(body: unknown) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return null;
  }

  const record = body as Record<string, unknown>;
  if (record.ok !== false) {
    return null;
  }

  const error = record.error;
  if (!error || typeof error !== "object" || Array.isArray(error)) {
    return null;
  }

  const errorRecord = error as Record<string, unknown>;
  const message =
    typeof errorRecord.message === "string" ? errorRecord.message.trim() : "";

  if (!message) {
    return "O backend retornou um erro sem mensagem legível.";
  }

  if (message.length <= 280) {
    return message;
  }

  return `${message.slice(0, 279)}…`;
}

async function invokeAnalyzeTicketRemotely(payload: ReturnType<typeof validateAnalyzeTicketInput>) {
  const endpoint = getAnalyzeTicketEndpoint();
  const publishableKey = getPublishableKey();

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      apikey: publishableKey,
      Authorization: `Bearer ${publishableKey}`,
    },
    body: JSON.stringify(payload),
  });

  const body = (await response.json().catch(() => null)) as
    AnalyzeTicketSuccessResponse | AnalyzeTicketErrorResponse | null;

  if (!response.ok) {
    const functionalMessage =
      extractRemoteErrorMessageFromBody(body) ?? `HTTP ${response.status} ao chamar analyze-ticket.`;
    throw new Error(functionalMessage);
  }

  let validated: ReturnType<typeof validateAnalyzeTicketResponse>;
  try {
    validated = validateAnalyzeTicketResponse(body);
  } catch (error) {
    const fallbackMessage =
      extractRemoteErrorMessageFromBody(body) ??
      "O backend retornou uma resposta de erro fora do contrato esperado.";
    if (error instanceof AnalyzeTicketValidationError) {
      throw new Error(fallbackMessage);
    }
    throw new Error(buildRemoteAnalysisErrorMessage(error) || fallbackMessage);
  }

  if (!validated.ok) {
    throw new Error(validated.error.message);
  }

  return validated.analysis;
}

function buildInputPayload(ticket: Ticket) {
  const basePayload = validateAnalyzeTicketInput({
    title: ticket.titulo,
    description: ticket.descricao,
    category: ticket.categoria,
    priority: ticket.prioridade,
    additionalContext: montarContextoAnalise(ticket),
  });
  const analystEvidence = retrieveAnalystKnowledgeEvidence(basePayload);
  const analystContext = buildAnalystKnowledgeContext(analystEvidence);
  const additionalContext = [basePayload.additionalContext, analystContext]
    .filter(Boolean)
    .join("\n\n");

  const payload = validateAnalyzeTicketInput({
    ...basePayload,
    additionalContext: additionalContext || undefined,
  });

  return {
    payload,
    analystEvidence,
  };
}

function mergeAnalystEvidence(
  analysis: AnalyzeTicketAnalysis,
  analystEvidence: AnalystKnowledgeEvidence[],
) {
  if (analystEvidence.length === 0) return analysis;

  const sources = uniqueStrings(
    [...analystEvidence, ...analysis.sources].map((source) =>
      JSON.stringify({
        title: source.title,
        reference: source.reference,
        sourceType: source.sourceType,
      }),
    ),
  ).map((entry) => JSON.parse(entry) as AnalyzeTicketAnalysis["sources"][number]);

  return {
    ...analysis,
    sources,
    safetyAlerts: uniqueStrings([
      ...analysis.safetyAlerts,
      "Base de conhecimento enviada pelo analista foi considerada como contexto complementar.",
    ]),
  };
}

function buildMockAnalysis(ticket: Ticket): AnalyzeTicketAnalysis {
  const { payload, analystEvidence } = buildInputPayload(ticket);
  const sugestao = gerarSugestaoMock(ticket);
  const analystGuidance = analystEvidence.flatMap((item) => item.guidance).slice(0, 2);
  const recommendedSteps = uniqueStrings([
    ...analystGuidance,
    ...sugestao.passosRecomendados,
  ]).slice(0, 5);
  const confidenceScore = Math.min(
    95,
    sugestao.nivelConfianca + (analystEvidence.length > 0 ? 4 : 0),
  );
  const evidenceSources = analystEvidence.map((item) => ({
    title: item.title,
    reference: item.reference,
    sourceType: item.sourceType,
  }));
  const fallbackSources = sugestao.fontesConsultadas.map((fonte) => ({
    title: fonte.titulo,
    reference: fonte.referencia,
    sourceType: "demo-kb",
  }));
  const sources = [...evidenceSources, ...fallbackSources].slice(0, 5);
  const safetyAlerts = uniqueStrings([
    ...sugestao.alertasLgpd,
    "Modo demonstração ativo: esta análise foi gerada localmente e não veio do provedor de IA configurado.",
    ...(analystEvidence.length > 0
      ? ["Base de conhecimento enviada pelo analista foi consultada nesta análise local."]
      : []),
  ]);

  return {
    ticket: payload,
    summary: sugestao.resumo,
    probableCause: sugestao.possivelCausa,
    recommendedSteps,
    suggestedResponse: sugestao.sugestaoResposta,
    confidenceScore,
    confidenceLevel: confidenceScoreToLevel(confidenceScore),
    safetyAlerts,
    sources,
    sanitization: {
      status: "clean",
      maskedFields: [],
      alerts: ["Modo demonstração ativo: análise gerada localmente para validação do fluxo."],
    },
  };
}

export async function invokeAnalyzeTicket(ticket: Ticket): Promise<AnalyzeTicketAnalysis> {
  const { payload, analystEvidence } = buildInputPayload(ticket);

  if (isDemoModeEnabled()) {
    return buildMockAnalysis(ticket);
  }

  try {
    const analysis = await invokeAnalyzeTicketRemotely(payload);
    return mergeAnalystEvidence(analysis, analystEvidence);
  } catch (error) {
    console.error("Falha ao usar analyze-ticket server-side.", error);
    throw new Error(buildRemoteAnalysisErrorMessage(error));
  }
}
