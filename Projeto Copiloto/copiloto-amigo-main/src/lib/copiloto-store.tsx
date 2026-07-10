import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { invokeAnalyzeTicket } from "./analyze-ticket";
import {
  createPublicAnalise,
  fetchPublicAnalises,
  registerPublicDecision,
  reopenPublicDecision,
  type PublicSnapshot,
} from "./public-analyses";
import { getPublicSessionId } from "./public-session";
import {
  ANALISTA_LOGADO,
  analisesIniciais,
  extrairComentarioDecisao,
  extrairContextoAnalise,
  montarComentarioDecisao,
  type Analise,
  type Categoria,
  type DecisaoStatus,
  type Prioridade,
  type ScorecardAvaliacao,
  type Ticket,
} from "./mock-data";
import { isAuthBypassEnabled, isDemoModeEnabled } from "./runtime-mode";

// Passthrough provider (kept for compatibility with the previous store surface).
export function CopilotoProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

interface AnalysisRow {
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

interface DecisionRow {
  id: string;
  analysis_id: string;
  user_id: string | null;
  actor_label: string | null;
  decision: string;
  edited_response: string | null;
  comment: string | null;
  decided_at: string;
}

interface SourceRow {
  id: string;
  analysis_id: string;
  title: string;
  source_type: string;
  reference: string;
  relevance: number;
}

const EMPTY_ANALISES: Analise[] = [];
const DEMO_STORAGE_KEY = "copiloto-l1.demo.analises.v1";

function cloneAnalises(items: Analise[]) {
  return JSON.parse(JSON.stringify(items)) as Analise[];
}

function getDemoSeed() {
  return cloneAnalises(analisesIniciais);
}

function readDemoAnalises(): Analise[] {
  const seed = getDemoSeed();
  if (typeof window === "undefined") return seed;

  try {
    const raw = window.localStorage.getItem(DEMO_STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Analise[]) : seed;
  } catch {
    return seed;
  }
}

function persistDemoAnalises(analises: Analise[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(analises));
}

function upsertLocalAnalise(analise: Analise) {
  const current = readDemoAnalises();
  const next = [analise, ...current.filter((item) => item.id !== analise.id)];
  persistDemoAnalises(next);
  return next;
}

function registrarDecisaoLocal(
  analises: Analise[],
  id: string,
  input: {
    status: DecisaoStatus;
    responsavel: string;
    comentario?: string;
    sugestaoEditada?: string;
    scorecard?: ScorecardAvaliacao;
  },
) {
  const dataHora = new Date().toISOString();
  return analises.map((analise) => {
    if (analise.id !== id) return analise;
    const evento = {
      status: input.status,
      responsavel: input.responsavel,
      dataHora,
      comentario: input.comentario,
      sugestaoEditada: input.sugestaoEditada,
      scorecard: input.scorecard,
    };
    return {
      ...analise,
      decisao: evento,
      auditoria: [...(analise.auditoria ?? []), evento],
    };
  });
}

function reabrirDecisaoLocal(analises: Analise[], id: string) {
  const dataHora = new Date().toISOString();
  return analises.map((analise) => {
    if (analise.id !== id) return analise;
    const evento = {
      status: "Pendente" as DecisaoStatus,
      responsavel: ANALISTA_LOGADO,
      dataHora,
      comentario: "Decisão reaberta para nova revisão.",
    };
    return {
      ...analise,
      decisao: {
        status: "Pendente",
        responsavel: "-",
        dataHora,
      },
      auditoria: [...(analise.auditoria ?? []), evento],
    };
  });
}

function buildAnaliseLocal(
  ticket: Ticket,
  analysis: Awaited<ReturnType<typeof invokeAnalyzeTicket>>,
): Analise {
  return {
    id: `demo-${Date.now()}`,
    criadoEm: new Date().toISOString(),
    ticket,
    sugestao: {
      resumo: analysis.summary,
      possivelCausa: analysis.probableCause,
      passosRecomendados: analysis.recommendedSteps,
      sugestaoResposta: analysis.suggestedResponse,
      nivelConfianca: analysis.confidenceScore,
      alertasLgpd: analysis.safetyAlerts,
      fontesConsultadas: analysis.sources.map((source) => ({
        titulo: source.title,
        referencia: source.reference,
      })),
    },
    decisao: {
      status: "Pendente",
      responsavel: "-",
      dataHora: new Date().toISOString(),
    },
    auditoria: [],
  };
}

function mapSnapshotToAnalises(snapshot: PublicSnapshot, responsavel = "Analista público") {
  return snapshot.analyses.map((analysis) =>
    rowToAnalise(analysis, snapshot.decisions, snapshot.sources, responsavel),
  );
}

function shouldFallbackToLocal(error: unknown) {
  if (isDemoModeEnabled()) return true;
  const message = error instanceof Error ? error.message : String(error ?? "");
  return [
    "Failed to fetch",
    "fetch",
    "relation",
    "schema cache",
    "permission denied",
    "JWT",
    "row-level security",
    "not found",
    "does not exist",
    "violates",
    "Database error",
  ].some((chunk) => message.toLowerCase().includes(chunk.toLowerCase()));
}

function rowToAnalise(
  a: AnalysisRow,
  decisions: DecisionRow[],
  sources: SourceRow[],
  responsavel: string,
): Analise {
  const ticketPayload = a.ticket_payload;
  const contexto = extrairContextoAnalise(a.additional_context ?? undefined);
  const decs = decisions.filter((d) => d.analysis_id === a.id);
  const latest = decs[0];
  const latestDecision = latest ? extrairComentarioDecisao(latest.comment ?? undefined) : null;
  const status = (a.status as DecisaoStatus) ?? "Pendente";
  const ticketCategoria =
    ticketPayload?.categoria ?? ((contexto.dominioServico ?? a.category) as Categoria);
  const ticketPrioridade = ticketPayload?.prioridade ?? (a.priority as Prioridade);
  return {
    id: a.id,
    criadoEm: a.created_at,
    ticket: {
      titulo: ticketPayload?.titulo ?? a.ticket_title,
      descricao: ticketPayload?.descricao ?? a.ticket_description,
      categoria: ticketCategoria,
      prioridade: ticketPrioridade,
      tipoTicket: ticketPayload?.tipoTicket ?? contexto.tipoTicket,
      plataforma: ticketPayload?.plataforma ?? contexto.plataforma,
      subdominio: ticketPayload?.subdominio ?? contexto.subdominio,
      servicoAfetado: ticketPayload?.servicoAfetado ?? contexto.servicoAfetado,
      horarioOcorrencia: ticketPayload?.horarioOcorrencia ?? contexto.horarioOcorrencia,
      contextoAdicional: ticketPayload?.contextoAdicional ?? contexto.contextoLivre,
    },
    sugestao: {
      resumo: a.ai_summary ?? "",
      possivelCausa: a.probable_cause ?? "",
      passosRecomendados: a.recommended_steps ?? [],
      sugestaoResposta: a.suggested_response ?? "",
      nivelConfianca: a.confidence,
      alertasLgpd: a.safety_alerts ?? [],
      fontesConsultadas: sources
        .filter((s) => s.analysis_id === a.id)
        .map((s) => ({ titulo: s.title, referencia: s.reference })),
    },
    decisao:
      status === "Pendente" || !latest
        ? { status: "Pendente", responsavel: "-", dataHora: a.updated_at }
        : {
            status: (latest.decision as DecisaoStatus) ?? "Pendente",
            responsavel: latest.actor_label ?? responsavel,
            dataHora: latest.decided_at,
            comentario: latestDecision?.comentarioLivre,
            sugestaoEditada: latest.edited_response ?? undefined,
            scorecard: latestDecision?.scorecard,
          },
    auditoria: decs
      .slice()
      .reverse()
      .map((d) => {
        const metadata = extrairComentarioDecisao(d.comment ?? undefined);
        return {
          status: (d.decision as DecisaoStatus) ?? "Pendente",
          responsavel: d.actor_label ?? responsavel,
          dataHora: d.decided_at,
          comentario: metadata.comentarioLivre,
          sugestaoEditada: d.edited_response ?? undefined,
          scorecard: metadata.scorecard,
        };
      }),
  };
}

async function fetchAllForUser(): Promise<Analise[]> {
  if (isDemoModeEnabled()) {
    return readDemoAnalises();
  }

  if (isAuthBypassEnabled()) {
    try {
      const snapshot = await fetchPublicAnalises(getPublicSessionId());
      return mapSnapshotToAnalises(snapshot);
    } catch (error) {
      console.warn(
        "Falha ao carregar dados públicos do Supabase. Aplicando fallback local.",
        error,
      );
      return readDemoAnalises();
    }
  }

  try {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) return [];
    const responsavel =
      (user.user_metadata?.full_name as string | undefined) ?? user.email ?? "Analista";
    const [analysesRes, decisionsRes, sourcesRes] = await Promise.all([
      supabase.from("ticket_analyses").select("*").order("created_at", { ascending: false }),
      supabase.from("human_decisions").select("*").order("decided_at", { ascending: false }),
      supabase.from("knowledge_sources").select("*"),
    ]);
    if (analysesRes.error) throw analysesRes.error;
    if (decisionsRes.error) throw decisionsRes.error;
    if (sourcesRes.error) throw sourcesRes.error;
    const analyses = (analysesRes.data ?? []) as AnalysisRow[];
    const decisions = (decisionsRes.data ?? []) as DecisionRow[];
    const sources = (sourcesRes.data ?? []) as SourceRow[];
    return analyses.map((a) => rowToAnalise(a, decisions, sources, responsavel));
  } catch (error) {
    if (!shouldFallbackToLocal(error)) throw error;
    console.warn("Falha ao carregar dados do Supabase. Aplicando fallback local.", error);
    return readDemoAnalises();
  }
}

export function useCopiloto() {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["copiloto", "analises"],
    queryFn: fetchAllForUser,
    staleTime: 30_000,
  });
  const analises = query.data ?? EMPTY_ANALISES;

  const invalidate = useCallback(() => {
    qc.invalidateQueries({ queryKey: ["copiloto", "analises"] });
  }, [qc]);

  const setAnalisesCache = useCallback(
    (updater: Analise | ((current: Analise[]) => Analise[])) => {
      qc.setQueryData<Analise[]>(["copiloto", "analises"], (current) => {
        const next = current ?? [];
        if (typeof updater === "function") {
          return updater(next);
        }
        return [updater, ...next.filter((item) => item.id !== updater.id)];
      });
    },
    [qc],
  );

  const criarAnalise = useCallback(
    async (ticket: Ticket): Promise<Analise> => {
      if (isDemoModeEnabled()) {
        const analiseProcessada = await invokeAnalyzeTicket(ticket);
        const analise = buildAnaliseLocal(ticket, analiseProcessada);
        const next = upsertLocalAnalise(analise);
        setAnalisesCache(() => next);
        return analise;
      }

      if (isAuthBypassEnabled()) {
        try {
          const analiseProcessada = await invokeAnalyzeTicket(ticket);
          const response = await createPublicAnalise({
            sessionId: getPublicSessionId(),
            ticket,
            analysis: analiseProcessada,
          });
          const next = mapSnapshotToAnalises(response.snapshot);
          setAnalisesCache(() => next);
          const created = next.find((item) => item.id === response.analysisId);
          if (!created) {
            throw new Error("Análise criada, mas não encontrada no retorno da sessão pública.");
          }
          return created;
        } catch (error) {
          console.warn("Falha ao persistir análise pública. Salvando localmente.", error);
          const analise = buildAnaliseLocal(ticket, await invokeAnalyzeTicket(ticket));
          const next = upsertLocalAnalise(analise);
          setAnalisesCache(() => next);
          return analise;
        }
      }

      try {
        const { data: userData } = await supabase.auth.getUser();
        const user = userData.user;
        if (!user) throw new Error("Sessão expirada. Faça login novamente.");
        const analiseProcessada = await invokeAnalyzeTicket(ticket);
        const sugestao = {
          resumo: analiseProcessada.summary,
          possivelCausa: analiseProcessada.probableCause,
          passosRecomendados: analiseProcessada.recommendedSteps,
          sugestaoResposta: analiseProcessada.suggestedResponse,
          nivelConfianca: analiseProcessada.confidenceScore,
          alertasLgpd: analiseProcessada.safetyAlerts,
          fontesConsultadas: analiseProcessada.sources.map((source) => ({
            titulo: source.title,
            referencia: source.reference,
          })),
        };

        const { data, error } = await supabase
          .from("ticket_analyses")
          .insert({
            user_id: user.id,
            ticket_title: analiseProcessada.ticket.title,
            ticket_description: analiseProcessada.ticket.description,
            category: analiseProcessada.ticket.category,
            priority: analiseProcessada.ticket.priority,
            additional_context: analiseProcessada.ticket.additionalContext ?? null,
            ticket_payload: ticket,
            ai_summary: sugestao.resumo,
            probable_cause: sugestao.possivelCausa,
            recommended_steps: sugestao.passosRecomendados,
            suggested_response: sugestao.sugestaoResposta,
            confidence: sugestao.nivelConfianca,
            safety_alerts: sugestao.alertasLgpd,
            status: "Pendente",
          })
          .select("*")
          .single();
        if (error) throw error;
        const row = data as AnalysisRow;
        const insertedSources =
          analiseProcessada.sources.length > 0
            ? analiseProcessada.sources.map((source) => ({
                analysis_id: row.id,
                user_id: user.id,
                title: source.title,
                source_type: source.sourceType,
                reference: source.reference,
                relevance: 0,
              }))
            : [];

        if (sugestao.fontesConsultadas.length > 0) {
          const { error: sourcesError } = await supabase
            .from("knowledge_sources")
            .insert(insertedSources);
          if (sourcesError) throw sourcesError;
        }

        const analise = rowToAnalise(
          row,
          [],
          insertedSources.map((source) => ({
            id: "",
            analysis_id: row.id,
            title: source.title,
            source_type: source.source_type,
            reference: source.reference,
            relevance: source.relevance,
          })),
          user.email ?? "Analista",
        );
        setAnalisesCache(analise);
        invalidate();
        return analise;
      } catch (error) {
        if (!shouldFallbackToLocal(error)) throw error;
        console.warn("Falha ao persistir análise no Supabase. Salvando localmente.", error);
        const analise = buildAnaliseLocal(ticket, await invokeAnalyzeTicket(ticket));
        const next = upsertLocalAnalise(analise);
        setAnalisesCache(() => next);
        return analise;
      }
    },
    [invalidate, setAnalisesCache],
  );

  const registrarDecisao = useCallback(
    async (
      id: string,
      input: {
        status: DecisaoStatus;
        responsavel: string;
        comentario?: string;
        sugestaoEditada?: string;
        scorecard?: ScorecardAvaliacao;
      },
    ) => {
      if (isDemoModeEnabled()) {
        const current = readDemoAnalises();
        const next = registrarDecisaoLocal(current, id, input);
        persistDemoAnalises(next);
        setAnalisesCache(() => next);
        return;
      }

      if (isAuthBypassEnabled()) {
        try {
          const response = await registerPublicDecision({
            sessionId: getPublicSessionId(),
            analysisId: id,
            status: input.status,
            responsavel: input.responsavel,
            comentario: input.comentario,
            sugestaoEditada: input.sugestaoEditada,
            scorecard: input.scorecard,
            commentPayload:
              montarComentarioDecisao({
                comentario: input.comentario,
                scorecard: input.scorecard,
              }) ?? undefined,
          });
          setAnalisesCache(() => mapSnapshotToAnalises(response.snapshot));
          return;
        } catch (error) {
          console.warn("Falha ao registrar decisão pública. Salvando localmente.", error);
          const current = readDemoAnalises();
          const next = registrarDecisaoLocal(current, id, input);
          persistDemoAnalises(next);
          setAnalisesCache(() => next);
          return;
        }
      }

      try {
        const { data: userData } = await supabase.auth.getUser();
        const user = userData.user;
        if (!user) throw new Error("Sessão expirada. Faça login novamente.");
        const { error: insErr } = await supabase.from("human_decisions").insert({
          analysis_id: id,
          user_id: user.id,
          decision: input.status,
          actor_label: input.responsavel,
          edited_response: input.sugestaoEditada ?? null,
          comment:
            montarComentarioDecisao({
              comentario: input.comentario,
              scorecard: input.scorecard,
            }) ?? null,
        });
        if (insErr) throw insErr;
        const { error: updErr } = await supabase
          .from("ticket_analyses")
          .update({ status: input.status })
          .eq("id", id);
        if (updErr) throw updErr;
        invalidate();
      } catch (error) {
        if (!shouldFallbackToLocal(error)) throw error;
        console.warn("Falha ao registrar decisão no Supabase. Salvando localmente.", error);
        const current = readDemoAnalises();
        const next = registrarDecisaoLocal(current, id, input);
        persistDemoAnalises(next);
        setAnalisesCache(() => next);
      }
    },
    [invalidate, setAnalisesCache],
  );

  const reabrirDecisao = useCallback(
    async (id: string) => {
      if (isDemoModeEnabled()) {
        const current = readDemoAnalises();
        const next = reabrirDecisaoLocal(current, id);
        persistDemoAnalises(next);
        setAnalisesCache(() => next);
        return;
      }

      if (isAuthBypassEnabled()) {
        try {
          const response = await reopenPublicDecision({
            sessionId: getPublicSessionId(),
            analysisId: id,
            responsavel: ANALISTA_LOGADO,
          });
          setAnalisesCache(() => mapSnapshotToAnalises(response.snapshot));
          return;
        } catch (error) {
          console.warn("Falha ao reabrir decisão pública. Salvando localmente.", error);
          const current = readDemoAnalises();
          const next = reabrirDecisaoLocal(current, id);
          persistDemoAnalises(next);
          setAnalisesCache(() => next);
          return;
        }
      }

      try {
        const { data: userData } = await supabase.auth.getUser();
        const user = userData.user;
        if (!user) throw new Error("Sessão expirada.");
        await supabase.from("human_decisions").insert({
          analysis_id: id,
          user_id: user.id,
          decision: "Pendente",
          comment: "Decisão reaberta para nova revisão.",
        });
        await supabase.from("ticket_analyses").update({ status: "Pendente" }).eq("id", id);
        invalidate();
      } catch (error) {
        if (!shouldFallbackToLocal(error)) throw error;
        console.warn("Falha ao reabrir decisão no Supabase. Salvando localmente.", error);
        const current = readDemoAnalises();
        const next = reabrirDecisaoLocal(current, id);
        persistDemoAnalises(next);
        setAnalisesCache(() => next);
      }
    },
    [invalidate, setAnalisesCache],
  );

  return useMemo(
    () => ({
      analises,
      isLoading: query.isLoading,
      isError: query.isError,
      error: query.error as Error | null,
      getAnalise: (id: string) => analises.find((a) => a.id === id),
      criarAnalise,
      registrarDecisao,
      reabrirDecisao,
    }),
    [
      analises,
      query.isLoading,
      query.isError,
      query.error,
      criarAnalise,
      registrarDecisao,
      reabrirDecisao,
    ],
  );
}

// Helpers de formatação pt-BR.
export function formatarDataHora(iso: string) {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "-";
  }
}

export function formatarData(iso: string) {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
  } catch {
    return "-";
  }
}
