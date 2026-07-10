import { createClient } from "npm:@supabase/supabase-js@2";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
};

type TicketPayload = {
  titulo: string;
  descricao: string;
  categoria: string;
  prioridade: string;
  tipoTicket?: string;
  plataforma?: string;
  subdominio?: string;
  servicoAfetado?: string;
  horarioOcorrencia?: string;
  contextoAdicional?: string;
};

type AnalysisPayload = {
  ticket: {
    title: string;
    description: string;
    category: string;
    priority: string;
    additionalContext?: string;
  };
  summary: string;
  probableCause: string;
  recommendedSteps: string[];
  suggestedResponse: string;
  confidenceScore: number;
  safetyAlerts: string[];
  sources: Array<{
    title: string;
    reference: string;
    sourceType: string;
  }>;
};

type DecisionPayload = {
  status: string;
  responsavel: string;
  comentario?: string;
  sugestaoEditada?: string;
  commentPayload?: string;
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: CORS_HEADERS,
  });
}

function errorResponse(message: string, status = 400) {
  return jsonResponse(
    {
      ok: false,
      error: { message },
    },
    status,
  );
}

function getAdminClient() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não configurados.");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function readString(value: unknown, field: string) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${field} é obrigatório.`);
  }

  return value.trim();
}

function readSessionId(value: unknown) {
  const sessionId = readString(value, "sessionId");
  if (!/^[a-z0-9-]{12,120}$/i.test(sessionId)) {
    throw new Error("sessionId inválido.");
  }

  return sessionId;
}

function readTicketPayload(value: unknown): TicketPayload {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("ticket inválido.");
  }

  const ticket = value as Record<string, unknown>;
  return {
    titulo: readString(ticket.titulo, "ticket.titulo"),
    descricao: readString(ticket.descricao, "ticket.descricao"),
    categoria: readString(ticket.categoria, "ticket.categoria"),
    prioridade: readString(ticket.prioridade, "ticket.prioridade"),
    tipoTicket: typeof ticket.tipoTicket === "string" ? ticket.tipoTicket : undefined,
    plataforma: typeof ticket.plataforma === "string" ? ticket.plataforma : undefined,
    subdominio: typeof ticket.subdominio === "string" ? ticket.subdominio : undefined,
    servicoAfetado:
      typeof ticket.servicoAfetado === "string" ? ticket.servicoAfetado : undefined,
    horarioOcorrencia:
      typeof ticket.horarioOcorrencia === "string" ? ticket.horarioOcorrencia : undefined,
    contextoAdicional:
      typeof ticket.contextoAdicional === "string" ? ticket.contextoAdicional : undefined,
  };
}

function readAnalysisPayload(value: unknown): AnalysisPayload {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("analysis inválido.");
  }

  const analysis = value as Record<string, unknown>;
  const ticket = analysis.ticket;
  if (!ticket || typeof ticket !== "object" || Array.isArray(ticket)) {
    throw new Error("analysis.ticket inválido.");
  }

  const normalizedTicket = ticket as Record<string, unknown>;
  const recommendedSteps = Array.isArray(analysis.recommendedSteps)
    ? analysis.recommendedSteps.filter((item): item is string => typeof item === "string")
    : [];
  const safetyAlerts = Array.isArray(analysis.safetyAlerts)
    ? analysis.safetyAlerts.filter((item): item is string => typeof item === "string")
    : [];
  const sources = Array.isArray(analysis.sources)
    ? analysis.sources
        .filter((item) => item && typeof item === "object" && !Array.isArray(item))
        .map((item) => {
          const source = item as Record<string, unknown>;
          return {
            title: readString(source.title, "analysis.sources.title"),
            reference: readString(source.reference, "analysis.sources.reference"),
            sourceType: readString(source.sourceType, "analysis.sources.sourceType"),
          };
        })
    : [];

  return {
    ticket: {
      title: readString(normalizedTicket.title, "analysis.ticket.title"),
      description: readString(normalizedTicket.description, "analysis.ticket.description"),
      category: readString(normalizedTicket.category, "analysis.ticket.category"),
      priority: readString(normalizedTicket.priority, "analysis.ticket.priority"),
      additionalContext:
        typeof normalizedTicket.additionalContext === "string"
          ? normalizedTicket.additionalContext
          : undefined,
    },
    summary: readString(analysis.summary, "analysis.summary"),
    probableCause: readString(analysis.probableCause, "analysis.probableCause"),
    recommendedSteps,
    suggestedResponse: readString(analysis.suggestedResponse, "analysis.suggestedResponse"),
    confidenceScore:
      typeof analysis.confidenceScore === "number"
        ? Math.max(0, Math.min(100, Math.round(analysis.confidenceScore)))
        : 0,
    safetyAlerts,
    sources,
  };
}

function readDecisionPayload(value: unknown): DecisionPayload {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("decision inválido.");
  }

  const decision = value as Record<string, unknown>;
  return {
    status: readString(decision.status, "decision.status"),
    responsavel: readString(decision.responsavel, "decision.responsavel"),
    comentario: typeof decision.comentario === "string" ? decision.comentario : undefined,
    sugestaoEditada:
      typeof decision.sugestaoEditada === "string" ? decision.sugestaoEditada : undefined,
    commentPayload:
      typeof decision.commentPayload === "string" ? decision.commentPayload : undefined,
  };
}

async function loadSnapshot(
  supabaseAdmin: ReturnType<typeof getAdminClient>,
  sessionId: string,
) {
  const { data: analyses, error: analysesError } = await supabaseAdmin
    .from("ticket_analyses")
    .select("*")
    .eq("public_session_id", sessionId)
    .order("created_at", { ascending: false });

  if (analysesError) {
    throw analysesError;
  }

  const analysisIds = (analyses ?? []).map((item) => item.id);

  const { data: decisions, error: decisionsError } =
    analysisIds.length === 0
      ? { data: [], error: null }
      : await supabaseAdmin
          .from("human_decisions")
          .select("*")
          .in("analysis_id", analysisIds)
          .order("decided_at", { ascending: false });

  if (decisionsError) {
    throw decisionsError;
  }

  const { data: sources, error: sourcesError } =
    analysisIds.length === 0
      ? { data: [], error: null }
      : await supabaseAdmin.from("knowledge_sources").select("*").in("analysis_id", analysisIds);

  if (sourcesError) {
    throw sourcesError;
  }

  return {
    analyses: analyses ?? [],
    decisions: decisions ?? [],
    sources: sources ?? [],
  };
}

async function assertSessionOwnsAnalysis(
  supabaseAdmin: ReturnType<typeof getAdminClient>,
  sessionId: string,
  analysisId: string,
) {
  const { data, error } = await supabaseAdmin
    .from("ticket_analyses")
    .select("id")
    .eq("id", analysisId)
    .eq("public_session_id", sessionId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("Análise não encontrada para esta sessão pública.");
  }
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  if (request.method !== "POST") {
    return errorResponse("A função public-analyses aceita apenas POST.", 405);
  }

  try {
    const body = await request.json();
    const payload =
      body && typeof body === "object" && !Array.isArray(body)
        ? (body as Record<string, unknown>)
        : null;

    if (!payload) {
      return errorResponse("Corpo da requisição inválido.");
    }

    const action = readString(payload.action, "action");
    const sessionId = readSessionId(payload.sessionId);
    const supabaseAdmin = getAdminClient();

    if (action === "list") {
      const snapshot = await loadSnapshot(supabaseAdmin, sessionId);
      return jsonResponse({ ok: true, sessionId, snapshot });
    }

    if (action === "create") {
      const ticket = readTicketPayload(payload.ticket);
      const analysis = readAnalysisPayload(payload.analysis);

      const { data: analysisRow, error: insertError } = await supabaseAdmin
        .from("ticket_analyses")
        .insert({
          user_id: null,
          public_session_id: sessionId,
          ticket_title: analysis.ticket.title,
          ticket_description: analysis.ticket.description,
          category: analysis.ticket.category,
          priority: analysis.ticket.priority,
          additional_context: analysis.ticket.additionalContext ?? null,
          ticket_payload: ticket,
          ai_summary: analysis.summary,
          probable_cause: analysis.probableCause,
          recommended_steps: analysis.recommendedSteps,
          suggested_response: analysis.suggestedResponse,
          confidence: analysis.confidenceScore,
          safety_alerts: analysis.safetyAlerts,
          status: "Pendente",
        })
        .select("id")
        .single();

      if (insertError) {
        throw insertError;
      }

      if (analysis.sources.length > 0) {
        const { error: sourcesError } = await supabaseAdmin.from("knowledge_sources").insert(
          analysis.sources.map((source) => ({
            analysis_id: analysisRow.id,
            user_id: null,
            title: source.title,
            source_type: source.sourceType,
            reference: source.reference,
            relevance: 0,
          })),
        );

        if (sourcesError) {
          throw sourcesError;
        }
      }

      const snapshot = await loadSnapshot(supabaseAdmin, sessionId);
      return jsonResponse({
        ok: true,
        sessionId,
        analysisId: analysisRow.id,
        snapshot,
      });
    }

    if (action === "decide") {
      const analysisId = readString(payload.analysisId, "analysisId");
      const decision = readDecisionPayload(payload.decision);

      await assertSessionOwnsAnalysis(supabaseAdmin, sessionId, analysisId);

      const { error: decisionError } = await supabaseAdmin.from("human_decisions").insert({
        analysis_id: analysisId,
        user_id: null,
        actor_label: decision.responsavel,
        decision: decision.status,
        edited_response: decision.sugestaoEditada ?? null,
        comment: decision.commentPayload ?? decision.comentario ?? null,
      });

      if (decisionError) {
        throw decisionError;
      }

      const { error: statusError } = await supabaseAdmin
        .from("ticket_analyses")
        .update({ status: decision.status })
        .eq("id", analysisId)
        .eq("public_session_id", sessionId);

      if (statusError) {
        throw statusError;
      }

      const snapshot = await loadSnapshot(supabaseAdmin, sessionId);
      return jsonResponse({ ok: true, sessionId, snapshot });
    }

    if (action === "reopen") {
      const analysisId = readString(payload.analysisId, "analysisId");
      const responsavel =
        typeof payload.responsavel === "string" && payload.responsavel.trim()
          ? payload.responsavel.trim()
          : "Analista";

      await assertSessionOwnsAnalysis(supabaseAdmin, sessionId, analysisId);

      const { error: decisionError } = await supabaseAdmin.from("human_decisions").insert({
        analysis_id: analysisId,
        user_id: null,
        actor_label: responsavel,
        decision: "Pendente",
        comment: "Decisão reaberta para nova revisão.",
      });

      if (decisionError) {
        throw decisionError;
      }

      const { error: reopenError } = await supabaseAdmin
        .from("ticket_analyses")
        .update({ status: "Pendente" })
        .eq("id", analysisId)
        .eq("public_session_id", sessionId);

      if (reopenError) {
        throw reopenError;
      }

      const snapshot = await loadSnapshot(supabaseAdmin, sessionId);
      return jsonResponse({ ok: true, sessionId, snapshot });
    }

    return errorResponse("Ação não suportada.", 400);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Falha inesperada ao processar persistência pública.";
    return errorResponse(message, 500);
  }
});
