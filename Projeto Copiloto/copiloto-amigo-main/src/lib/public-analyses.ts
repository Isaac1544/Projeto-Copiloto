import type { AnalyzeTicketAnalysis } from "./analyze-ticket-contract";
import type { ScorecardAvaliacao, Ticket } from "./mock-data";

export interface PublicAnalysisRow {
  id: string;
  user_id: string | null;
  public_session_id: string | null;
  ticket_title: string;
  ticket_description: string;
  category: string;
  priority: string;
  additional_context: string | null;
  ticket_payload: Ticket | null;
  ai_summary: string | null;
  probable_cause: string | null;
  recommended_steps: string[];
  suggested_response: string | null;
  confidence: number;
  safety_alerts: string[];
  status: string;
  created_at: string;
  updated_at: string;
}

export interface PublicDecisionRow {
  id: string;
  analysis_id: string;
  user_id: string | null;
  actor_label: string | null;
  decision: string;
  edited_response: string | null;
  comment: string | null;
  decided_at: string;
}

export interface PublicSourceRow {
  id: string;
  analysis_id: string;
  title: string;
  source_type: string;
  reference: string;
  relevance: number;
}

export interface PublicSnapshot {
  analyses: PublicAnalysisRow[];
  decisions: PublicDecisionRow[];
  sources: PublicSourceRow[];
}

type PublicActionResponse = {
  ok: true;
  analysisId?: string;
  snapshot: PublicSnapshot;
};

type PublicErrorResponse = {
  ok: false;
  error: {
    message: string;
  };
};

function getSupabaseUrl() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (!supabaseUrl) {
    throw new Error("VITE_SUPABASE_URL não configurado para persistência pública.");
  }

  return supabaseUrl;
}

function getPublishableKey() {
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!publishableKey) {
    throw new Error(
      "VITE_SUPABASE_PUBLISHABLE_KEY não configurado para persistência pública.",
    );
  }

  return publishableKey;
}

async function invokePublicAnalyses(body: Record<string, unknown>) {
  const response = await fetch(`${getSupabaseUrl()}/functions/v1/public-analyses`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      apikey: getPublishableKey(),
      Authorization: `Bearer ${getPublishableKey()}`,
    },
    body: JSON.stringify(body),
  });

  const payload = (await response.json().catch(() => null)) as
    | PublicActionResponse
    | PublicErrorResponse
    | null;

  if (!response.ok || !payload) {
    const message =
      payload && !payload.ok
        ? payload.error.message
        : `Falha HTTP ${response.status} ao persistir dados públicos.`;
    throw new Error(message);
  }

  if (!payload.ok) {
    throw new Error(payload.error.message);
  }

  return payload;
}

export async function fetchPublicAnalises(sessionId: string) {
  const payload = await invokePublicAnalyses({
    action: "list",
    sessionId,
  });

  return payload.snapshot;
}

export async function createPublicAnalise(input: {
  sessionId: string;
  ticket: Ticket;
  analysis: AnalyzeTicketAnalysis;
}) {
  return invokePublicAnalyses({
    action: "create",
    sessionId: input.sessionId,
    ticket: input.ticket,
    analysis: input.analysis,
  });
}

export async function registerPublicDecision(input: {
  sessionId: string;
  analysisId: string;
  status: string;
  responsavel: string;
  comentario?: string;
  sugestaoEditada?: string;
  scorecard?: ScorecardAvaliacao;
  commentPayload?: string;
}) {
  return invokePublicAnalyses({
    action: "decide",
    sessionId: input.sessionId,
    analysisId: input.analysisId,
    decision: {
      status: input.status,
      responsavel: input.responsavel,
      comentario: input.comentario,
      sugestaoEditada: input.sugestaoEditada,
      scorecard: input.scorecard,
      commentPayload: input.commentPayload,
    },
  });
}

export async function reopenPublicDecision(input: {
  sessionId: string;
  analysisId: string;
  responsavel: string;
}) {
  return invokePublicAnalyses({
    action: "reopen",
    sessionId: input.sessionId,
    analysisId: input.analysisId,
    responsavel: input.responsavel,
  });
}
