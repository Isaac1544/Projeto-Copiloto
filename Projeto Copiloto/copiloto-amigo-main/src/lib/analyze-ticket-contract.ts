export type ConfidenceLevel = "low" | "medium" | "high";
export type AnalyzeTicketErrorCode =
  | "INVALID_INPUT"
  | "BLOCKED_CONTENT"
  | "PROVIDER_UNAVAILABLE"
  | "UPSTREAM_TIMEOUT"
  | "INVALID_MODEL_OUTPUT"
  | "UNEXPECTED_ERROR";

export interface AnalyzeTicketInput {
  title: string;
  description: string;
  category: string;
  priority: string;
  additionalContext?: string;
}

export interface AnalyzeTicketKnowledgeSource {
  title: string;
  reference: string;
  sourceType: string;
}

export interface AnalyzeTicketSanitizationSummary {
  status: "clean" | "masked";
  maskedFields: string[];
  alerts: string[];
}

export interface AnalyzeTicketAnalysis {
  ticket: AnalyzeTicketInput;
  summary: string;
  probableCause: string;
  recommendedSteps: string[];
  suggestedResponse: string;
  confidenceScore: number;
  confidenceLevel: ConfidenceLevel;
  safetyAlerts: string[];
  sources: AnalyzeTicketKnowledgeSource[];
  sanitization: AnalyzeTicketSanitizationSummary;
}

export interface AnalyzeTicketSuccessResponse {
  ok: true;
  analysis: AnalyzeTicketAnalysis;
}

export interface AnalyzeTicketErrorDetails {
  code: AnalyzeTicketErrorCode;
  message: string;
  retryable: boolean;
  safetyAlerts: string[];
  maskedFields: string[];
  blockedReason?: string;
}

export interface AnalyzeTicketErrorResponse {
  ok: false;
  error: AnalyzeTicketErrorDetails;
}

export type AnalyzeTicketResponse = AnalyzeTicketSuccessResponse | AnalyzeTicketErrorResponse;

export class AnalyzeTicketValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AnalyzeTicketValidationError";
  }
}

const LIMITS = {
  title: 140,
  description: 2000,
  category: 120,
  priority: 40,
  additionalContext: 3000,
  recommendedStep: 240,
  sourceTitle: 180,
  sourceReference: 180,
  sourceType: 60,
  safetyAlert: 240,
  errorMessage: 280,
} as const;

function asRecord(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new AnalyzeTicketValidationError(`${label} inválido.`);
  }
  return value as Record<string, unknown>;
}

function normalizeText(value: string) {
  return value.replace(/\r\n/g, "\n").trim();
}

function readRequiredString(
  source: Record<string, unknown>,
  key: string,
  label: string,
  maxLength: number,
) {
  const value = source[key];
  if (typeof value !== "string") {
    throw new AnalyzeTicketValidationError(`${label} deve ser texto.`);
  }
  const normalized = normalizeText(value);
  if (!normalized) {
    throw new AnalyzeTicketValidationError(`${label} é obrigatório.`);
  }
  if (normalized.length > maxLength) {
    throw new AnalyzeTicketValidationError(`${label} deve ter no máximo ${maxLength} caracteres.`);
  }
  return normalized;
}

function readOptionalString(
  source: Record<string, unknown>,
  key: string,
  label: string,
  maxLength: number,
) {
  const value = source[key];
  if (value == null) return undefined;
  if (typeof value !== "string") {
    throw new AnalyzeTicketValidationError(`${label} deve ser texto.`);
  }
  const normalized = normalizeText(value);
  if (!normalized) return undefined;
  if (normalized.length > maxLength) {
    throw new AnalyzeTicketValidationError(`${label} deve ter no máximo ${maxLength} caracteres.`);
  }
  return normalized;
}

function readStringArray(
  source: Record<string, unknown>,
  key: string,
  label: string,
  {
    maxItems = 10,
    minItems = 0,
    maxItemLength = LIMITS.safetyAlert,
  }: { maxItems?: number; minItems?: number; maxItemLength?: number } = {},
) {
  const value = source[key];
  if (!Array.isArray(value)) {
    throw new AnalyzeTicketValidationError(`${label} deve ser uma lista.`);
  }
  if (value.length < minItems) {
    throw new AnalyzeTicketValidationError(`${label} deve ter pelo menos ${minItems} item(ns).`);
  }
  if (value.length > maxItems) {
    throw new AnalyzeTicketValidationError(`${label} deve ter no máximo ${maxItems} item(ns).`);
  }
  return value.map((item, index) => {
    if (typeof item !== "string") {
      throw new AnalyzeTicketValidationError(`${label}[${index}] deve ser texto.`);
    }
    const normalized = normalizeText(item);
    if (!normalized) {
      throw new AnalyzeTicketValidationError(`${label}[${index}] não pode estar vazio.`);
    }
    if (normalized.length > maxItemLength) {
      throw new AnalyzeTicketValidationError(
        `${label}[${index}] deve ter no máximo ${maxItemLength} caracteres.`,
      );
    }
    return normalized;
  });
}

function readBoolean(source: Record<string, unknown>, key: string, label: string) {
  const value = source[key];
  if (typeof value !== "boolean") {
    throw new AnalyzeTicketValidationError(`${label} deve ser booleano.`);
  }
  return value;
}

function readNumber(source: Record<string, unknown>, key: string, label: string) {
  const value = source[key];
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new AnalyzeTicketValidationError(`${label} deve ser numérico.`);
  }
  return value;
}

function readOptionalShortString(
  source: Record<string, unknown>,
  key: string,
  label: string,
  maxLength: number,
) {
  const value = source[key];
  if (value == null) return undefined;
  if (typeof value !== "string") {
    throw new AnalyzeTicketValidationError(`${label} deve ser texto.`);
  }
  const normalized = normalizeText(value);
  if (!normalized) return undefined;
  if (normalized.length > maxLength) {
    throw new AnalyzeTicketValidationError(`${label} deve ter no máximo ${maxLength} caracteres.`);
  }
  return normalized;
}

export function confidenceScoreToLevel(confidenceScore: number): ConfidenceLevel {
  if (confidenceScore >= 80) return "high";
  if (confidenceScore >= 60) return "medium";
  return "low";
}

export function uniqueStrings(values: string[]) {
  return Array.from(new Set(values.map((value) => normalizeText(value)).filter(Boolean)));
}

export function validateAnalyzeTicketInput(value: unknown): AnalyzeTicketInput {
  const record = asRecord(value, "Payload");
  return {
    title: readRequiredString(record, "title", "Título", LIMITS.title),
    description: readRequiredString(record, "description", "Descrição", LIMITS.description),
    category: readRequiredString(record, "category", "Categoria", LIMITS.category),
    priority: readRequiredString(record, "priority", "Prioridade", LIMITS.priority),
    additionalContext: readOptionalString(
      record,
      "additionalContext",
      "Contexto adicional",
      LIMITS.additionalContext,
    ),
  };
}

function validateKnowledgeSource(value: unknown): AnalyzeTicketKnowledgeSource {
  const record = asRecord(value, "Fonte");
  return {
    title: readRequiredString(record, "title", "Título da fonte", LIMITS.sourceTitle),
    reference: readRequiredString(
      record,
      "reference",
      "Referência da fonte",
      LIMITS.sourceReference,
    ),
    sourceType: readRequiredString(record, "sourceType", "Tipo da fonte", LIMITS.sourceType),
  };
}

function validateSanitizationSummary(value: unknown): AnalyzeTicketSanitizationSummary {
  const record = asRecord(value, "Resumo de sanitização");
  const status = readRequiredString(record, "status", "Status de sanitização", 16);
  if (status !== "clean" && status !== "masked") {
    throw new AnalyzeTicketValidationError("Status de sanitização deve ser clean ou masked.");
  }
  return {
    status,
    maskedFields: readStringArray(record, "maskedFields", "Campos mascarados", {
      maxItems: 5,
      maxItemLength: 40,
    }),
    alerts: readStringArray(record, "alerts", "Alertas de sanitização", {
      maxItems: 10,
      maxItemLength: LIMITS.safetyAlert,
    }),
  };
}

function validateAnalysis(value: unknown): AnalyzeTicketAnalysis {
  const record = asRecord(value, "Análise");
  const confidenceScore = Math.round(
    readNumber(record, "confidenceScore", "Pontuação de confiança"),
  );
  if (confidenceScore < 0 || confidenceScore > 100) {
    throw new AnalyzeTicketValidationError("Pontuação de confiança deve estar entre 0 e 100.");
  }
  const confidenceLevel = readRequiredString(record, "confidenceLevel", "Faixa de confiança", 10);
  if (confidenceLevel !== "low" && confidenceLevel !== "medium" && confidenceLevel !== "high") {
    throw new AnalyzeTicketValidationError("Faixa de confiança deve ser low, medium ou high.");
  }

  const rawSources = record.sources;
  if (!Array.isArray(rawSources)) {
    throw new AnalyzeTicketValidationError("Fontes devem ser uma lista.");
  }

  return {
    ticket: validateAnalyzeTicketInput(record.ticket),
    summary: readRequiredString(record, "summary", "Resumo", 500),
    probableCause: readRequiredString(record, "probableCause", "Causa provável", 800),
    recommendedSteps: readStringArray(record, "recommendedSteps", "Passos recomendados", {
      minItems: 1,
      maxItems: 6,
      maxItemLength: LIMITS.recommendedStep,
    }),
    suggestedResponse: readRequiredString(record, "suggestedResponse", "Resposta sugerida", 2000),
    confidenceScore,
    confidenceLevel,
    safetyAlerts: readStringArray(record, "safetyAlerts", "Alertas de segurança", {
      maxItems: 10,
      maxItemLength: LIMITS.safetyAlert,
    }),
    sources: rawSources.map((source) => validateKnowledgeSource(source)),
    sanitization: validateSanitizationSummary(record.sanitization),
  };
}

function validateErrorDetails(value: unknown): AnalyzeTicketErrorDetails {
  const record = asRecord(value, "Erro");
  const code = readRequiredString(record, "code", "Código do erro", 40);
  const allowedCodes: AnalyzeTicketErrorCode[] = [
    "INVALID_INPUT",
    "BLOCKED_CONTENT",
    "PROVIDER_UNAVAILABLE",
    "UPSTREAM_TIMEOUT",
    "INVALID_MODEL_OUTPUT",
    "UNEXPECTED_ERROR",
  ];
  if (!allowedCodes.includes(code as AnalyzeTicketErrorCode)) {
    throw new AnalyzeTicketValidationError("Código do erro inválido.");
  }
  return {
    code: code as AnalyzeTicketErrorCode,
    message: readRequiredString(record, "message", "Mensagem do erro", LIMITS.errorMessage),
    retryable: readBoolean(record, "retryable", "Retryable"),
    safetyAlerts: readStringArray(record, "safetyAlerts", "Alertas de erro", {
      maxItems: 10,
      maxItemLength: LIMITS.safetyAlert,
    }),
    maskedFields: readStringArray(record, "maskedFields", "Campos mascarados", {
      maxItems: 5,
      maxItemLength: 40,
    }),
    blockedReason: readOptionalShortString(record, "blockedReason", "Motivo do bloqueio", 280),
  };
}

export function validateAnalyzeTicketResponse(value: unknown): AnalyzeTicketResponse {
  const record = asRecord(value, "Resposta");
  const ok = readBoolean(record, "ok", "Flag ok");
  if (ok) {
    return {
      ok: true,
      analysis: validateAnalysis(record.analysis),
    };
  }
  return {
    ok: false,
    error: validateErrorDetails(record.error),
  };
}
