import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  ShieldAlert,
  BookOpen,
  CheckCircle2,
  PencilLine,
  XCircle,
  RotateCcw,
  Info,
  MessageSquare,
  Sparkles,
  ClipboardList,
  Lightbulb,
  ListChecks,
} from "lucide-react";
import { AppShell } from "@/components/copiloto/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCopiloto, formatarDataHora } from "@/lib/copiloto-store";
import {
  ANALISTA_LOGADO,
  SCORECARD_NOTAS,
  type Analise,
  type DecisaoStatus,
  type ScorecardAvaliacao,
  type ScorecardNota,
} from "@/lib/mock-data";
import { DecisaoBadge, PrioridadeBadge } from "@/components/copiloto/StatusBadge";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/resultado/$id")({
  head: () => ({
    meta: [
      { title: "Resultado do Copiloto — Copiloto L1" },
      { name: "description", content: "Sugestão estruturada gerada pelo Copiloto L1." },
    ],
  }),
  component: Resultado,
});

function Resultado() {
  const { id } = Route.useParams();
  const { getAnalise, registrarDecisao, reabrirDecisao, isLoading } = useCopiloto();
  const analise = getAnalise(id);
  const navigate = useNavigate();

  const [modo, setModo] = useState<"idle" | "editar" | "rejeitar" | "aceitar">("idle");
  const [comentario, setComentario] = useState("");
  const [textoEditado, setTextoEditado] = useState("");
  const [scorecard, setScorecard] = useState<ScorecardFormState>(emptyScorecardForm());

  if (isLoading) {
    return (
      <AppShell>
        <div className="mx-auto max-w-2xl text-sm text-muted-foreground">Carregando análise...</div>
      </AppShell>
    );
  }

  if (!analise) {
    return (
      <AppShell>
        <div className="mx-auto max-w-2xl">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Resultado não encontrado</AlertTitle>
            <AlertDescription>
              A análise solicitada não existe ou foi removida. Verifique o histórico.
            </AlertDescription>
          </Alert>
          <div className="mt-4 flex gap-2">
            <Button variant="outline" onClick={() => navigate({ to: "/historico" })}>
              Ir para histórico
            </Button>
            <Button onClick={() => navigate({ to: "/" })}>Voltar ao dashboard</Button>
          </div>
        </div>
      </AppShell>
    );
  }

  const { ticket, sugestao, decisao } = analise;
  const jaDecidido = decisao.status !== "Pendente";
  const fatosObservados = buildObservedFacts(analise);
  const resumoOperacional = buildOperationalSummary(analise);
  const faixaConfianca = getConfidenceLabel(sugestao.nivelConfianca);

  const iniciarEditar = () => {
    setTextoEditado(decisao.sugestaoEditada ?? sugestao.sugestaoResposta);
    setComentario(decisao.comentario ?? "");
    setScorecard(scorecardToForm(decisao.scorecard));
    setModo("editar");
  };

  const iniciarRejeitar = () => {
    setComentario(decisao.comentario ?? "");
    setScorecard(scorecardToForm(decisao.scorecard));
    setModo("rejeitar");
  };

  const iniciarAceitar = () => {
    setComentario("");
    setScorecard(scorecardToForm(decisao.scorecard));
    setModo("aceitar");
  };

  const confirmar = async (status: DecisaoStatus) => {
    if (status === "Rejeitada" && !comentario.trim()) {
      toast.error("Registre um comentário explicando o motivo da rejeição.");
      return;
    }
    if (status === "Editada" && !textoEditado.trim()) {
      toast.error("A sugestão editada não pode ficar vazia.");
      return;
    }
    const avaliacao = normalizeScorecard(scorecard);
    if (!avaliacao) {
      toast.error("Preencha o scorecard da decisão antes de concluir.");
      return;
    }
    try {
      await registrarDecisao(analise.id, {
        status,
        responsavel: ANALISTA_LOGADO,
        comentario: comentario.trim() || undefined,
        sugestaoEditada: status === "Editada" ? textoEditado.trim() : undefined,
        scorecard: avaliacao,
      });
      setModo("idle");
      setScorecard(emptyScorecardForm());
      toast.success(`Decisão registrada: ${status}.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha ao registrar decisão.");
    }
  };

  return (
    <AppShell>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/historico">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Voltar
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Sugestão do Copiloto
              </span>
            </div>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">{ticket.titulo}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <PrioridadeBadge prioridade={ticket.prioridade} />
          <DecisaoBadge status={decisao.status} />
        </div>
      </div>

      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertTitle>Sugestão gerada por IA. A decisão final é humana.</AlertTitle>
        <AlertDescription>
          Revise cuidadosamente antes de aceitar, editar ou rejeitar. O Copiloto não substitui o
          julgamento do analista.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {!jaDecidido && (
            <div className="rounded-md border-l-4 border-primary bg-primary/5 px-4 py-3 text-sm">
              <strong className="text-foreground">Decisão humana obrigatória.</strong>{" "}
              <span className="text-muted-foreground">
                Nenhuma resposta é enviada ao usuário sem que o analista aceite, edite ou rejeite a
                sugestão.
              </span>
            </div>
          )}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Leitura inicial do caso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="rounded-md border border-primary/20 bg-primary/5 p-4">
                <div className="mb-1 text-xs font-medium uppercase tracking-wide text-primary">
                  Síntese operacional do Copiloto
                </div>
                <p className="text-foreground">{sugestao.resumo}</p>
              </div>
              <Separator />
              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <dt className="text-xs uppercase text-muted-foreground">Domínio do serviço</dt>
                  <dd className="mt-1">{ticket.categoria}</dd>
                </div>
                {ticket.tipoTicket && (
                  <div>
                    <dt className="text-xs uppercase text-muted-foreground">Tipo de registro</dt>
                    <dd className="mt-1">{ticket.tipoTicket}</dd>
                  </div>
                )}
                {ticket.plataforma && (
                  <div>
                    <dt className="text-xs uppercase text-muted-foreground">Plataforma</dt>
                    <dd className="mt-1">{ticket.plataforma}</dd>
                  </div>
                )}
                {ticket.subdominio && (
                  <div>
                    <dt className="text-xs uppercase text-muted-foreground">Subdomínio</dt>
                    <dd className="mt-1">{ticket.subdominio}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-xs uppercase text-muted-foreground">Registrado em</dt>
                  <dd className="mt-1">{formatarDataHora(analise.criadoEm)}</dd>
                </div>
                {ticket.servicoAfetado && (
                  <div>
                    <dt className="text-xs uppercase text-muted-foreground">Serviço afetado</dt>
                    <dd className="mt-1">{ticket.servicoAfetado}</dd>
                  </div>
                )}
                {ticket.horarioOcorrencia && (
                  <div>
                    <dt className="text-xs uppercase text-muted-foreground">Horário informado</dt>
                    <dd className="mt-1">{ticket.horarioOcorrencia}</dd>
                  </div>
                )}
                <div className="sm:col-span-2">
                  <dt className="text-xs uppercase text-muted-foreground">Descrição original</dt>
                  <dd className="mt-1 whitespace-pre-wrap text-muted-foreground">
                    {ticket.descricao}
                  </dd>
                </div>
                {ticket.contextoAdicional && (
                  <div className="sm:col-span-2">
                    <dt className="text-xs uppercase text-muted-foreground">Contexto adicional</dt>
                    <dd className="mt-1 whitespace-pre-wrap text-muted-foreground">
                      {ticket.contextoAdicional}
                    </dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ClipboardList className="h-4 w-4 text-primary" />
                Fatos observados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <ul className="space-y-2">
                {fatosObservados.map((fato, index) => (
                  <li key={`${fato}-${index}`} className="rounded-md border bg-muted/30 px-3 py-2">
                    {fato}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground">
                Esta seção mostra somente o que foi informado no ticket ou recuperado como evidência
                rastreável nesta análise.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Lightbulb className="h-4 w-4 text-amber-600" />
                Identificação do problema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-amber-950 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-50">
                {sugestao.possivelCausa}
              </div>
              <div className="grid gap-2 sm:grid-cols-3">
                <div className="rounded-md border px-3 py-2">
                  <div className="text-xs uppercase text-muted-foreground">Confiança</div>
                  <div className="mt-1 font-medium">
                    {faixaConfianca} ({sugestao.nivelConfianca}%)
                  </div>
                </div>
                <div className="rounded-md border px-3 py-2">
                  <div className="text-xs uppercase text-muted-foreground">Evidências</div>
                  <div className="mt-1 font-medium">{sugestao.fontesConsultadas.length}</div>
                </div>
                <div className="rounded-md border px-3 py-2">
                  <div className="text-xs uppercase text-muted-foreground">Alertas</div>
                  <div className="mt-1 font-medium">{sugestao.alertasLgpd.length}</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Hipótese não é confirmação. Use os fatos, a confiança e os alertas para decidir se
                vale seguir, pedir mais dados ou escalar.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ListChecks className="h-4 w-4 text-emerald-600" />
                Sugestão de resolução
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-50">
                {resumoOperacional}
              </div>
              <ol className="list-decimal space-y-2 pl-5 text-sm">
                {sugestao.passosRecomendados.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ol>
              <p className="text-xs text-muted-foreground">
                Os passos abaixo representam a sugestão prática de resolução, incluindo pedido de
                dados adicionais ou escalonamento quando necessário.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Resposta sugerida ao cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-md border border-border bg-muted/40 p-4 text-sm whitespace-pre-wrap">
                {decisao.sugestaoEditada ?? sugestao.sugestaoResposta}
              </div>
              {decisao.sugestaoEditada && (
                <p className="text-xs text-muted-foreground">
                  Texto ajustado pelo analista responsável.
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                A sugestão evita instruções técnicas sensíveis diretamente ao usuário final.
              </p>
            </CardContent>
          </Card>

          {jaDecidido ? (
            <DecisaoJaRegistrada analise={analise} onRevisar={() => reabrirDecisao(analise.id)} />
          ) : (
            <Card className="border-primary/40 ring-1 ring-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <ShieldAlert className="h-4 w-4 text-primary" />
                  Decisão humana obrigatória
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {modo === "idle" && (
                  <div className="grid gap-2 sm:grid-cols-3">
                    <Button
                      onClick={iniciarAceitar}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Aceitar sugestão
                    </Button>
                    <Button variant="outline" onClick={iniciarEditar}>
                      <PencilLine className="mr-2 h-4 w-4" />
                      Editar sugestão
                    </Button>
                    <Button variant="outline" onClick={iniciarRejeitar}>
                      <XCircle className="mr-2 h-4 w-4" />
                      Rejeitar sugestão
                    </Button>
                  </div>
                )}

                {modo === "aceitar" && (
                  <div className="space-y-3">
                    <Label className="text-sm">Comentário (opcional)</Label>
                    <Textarea
                      rows={3}
                      value={comentario}
                      onChange={(e) => setComentario(e.target.value)}
                      placeholder="Ex.: Aplicado conforme sugerido, cliente confirmou resolução."
                    />
                    <ScorecardFields value={scorecard} onChange={setScorecard} />
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" onClick={() => setModo("idle")}>
                        Cancelar
                      </Button>
                      <Button onClick={() => confirmar("Aceita")}>Confirmar aceitação</Button>
                    </div>
                  </div>
                )}

                {modo === "editar" && (
                  <div className="space-y-3">
                    <Label className="text-sm">Sugestão editada</Label>
                    <Textarea
                      rows={5}
                      value={textoEditado}
                      onChange={(e) => setTextoEditado(e.target.value)}
                    />
                    <Label className="text-sm">Comentário (opcional)</Label>
                    <Textarea
                      rows={2}
                      value={comentario}
                      onChange={(e) => setComentario(e.target.value)}
                      placeholder="Ex.: Ajustei o tom e removi jargão técnico."
                    />
                    <ScorecardFields value={scorecard} onChange={setScorecard} />
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" onClick={() => setModo("idle")}>
                        Cancelar
                      </Button>
                      <Button onClick={() => confirmar("Editada")}>Salvar edição</Button>
                    </div>
                  </div>
                )}

                {modo === "rejeitar" && (
                  <div className="space-y-3">
                    <Label className="text-sm">
                      Comentário <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      rows={3}
                      value={comentario}
                      onChange={(e) => setComentario(e.target.value)}
                      placeholder="Explique brevemente o motivo da rejeição."
                    />
                    <ScorecardFields value={scorecard} onChange={setScorecard} />
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" onClick={() => setModo("idle")}>
                        Cancelar
                      </Button>
                      <Button variant="destructive" onClick={() => confirmar("Rejeitada")}>
                        Confirmar rejeição
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Nível de confiança</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-semibold">{sugestao.nivelConfianca}%</span>
                <span className="text-xs text-muted-foreground">{faixaConfianca}</span>
              </div>
              <Progress value={sugestao.nivelConfianca} className="mt-3" />
              <p className="mt-3 text-xs text-muted-foreground">
                Indicador estimado. Sempre valide antes de aplicar.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldAlert className="h-4 w-4 text-amber-600" />
                Alertas LGPD e segurança
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sugestao.alertasLgpd.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhum alerta identificado nesta análise.
                </p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {sugestao.alertasLgpd.map((a, i) => (
                    <li
                      key={i}
                      className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-amber-900 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-100"
                    >
                      {a}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BookOpen className="h-4 w-4 text-primary" />
                Fontes consultadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sugestao.fontesConsultadas.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhuma evidência curada foi recuperada nesta análise.
                </p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {sugestao.fontesConsultadas.map((f, i) => (
                    <li key={i} className="flex items-start justify-between gap-3">
                      <span>{f.titulo}</span>
                      <span className="shrink-0 text-xs text-muted-foreground">{f.referencia}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function DecisaoJaRegistrada({ analise, onRevisar }: { analise: Analise; onRevisar: () => void }) {
  const { decisao } = analise;
  const eventos = [...(analise.auditoria ?? [])].reverse();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Decisão registrada e auditoria</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex flex-wrap items-center gap-2">
          <DecisaoBadge status={decisao.status} />
          <span className="text-muted-foreground">
            por <strong className="text-foreground">{decisao.responsavel}</strong> em{" "}
            {formatarDataHora(decisao.dataHora)}
          </span>
        </div>
        {decisao.comentario && (
          <div className="rounded-md border border-border bg-muted/40 p-3">
            <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase text-muted-foreground">
              <MessageSquare className="h-3 w-3" />
              Comentário
            </div>
            <p className="whitespace-pre-wrap">{decisao.comentario}</p>
          </div>
        )}
        {decisao.scorecard && <ScorecardResumo scorecard={decisao.scorecard} />}
        {eventos.length > 0 && (
          <div className="pt-2">
            <div className="mb-2 text-xs font-medium uppercase text-muted-foreground">
              Histórico de decisões
            </div>
            <ol className="space-y-2 border-l border-border pl-4">
              {eventos.map((e, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[1.30rem] top-1.5 h-2 w-2 rounded-full bg-primary" />
                  <div className="flex flex-wrap items-center gap-2">
                    <DecisaoBadge status={e.status} />
                    <span className="text-xs text-muted-foreground">
                      {e.responsavel} • {formatarDataHora(e.dataHora)}
                    </span>
                  </div>
                  {e.comentario && (
                    <p className="mt-1 text-xs text-muted-foreground whitespace-pre-wrap">
                      {e.comentario}
                    </p>
                  )}
                  {e.scorecard && (
                    <div className="mt-2">
                      <ScorecardResumo scorecard={e.scorecard} compacto />
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </div>
        )}
        <div className="pt-2">
          <Button variant="outline" size="sm" onClick={onRevisar}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Revisar decisão
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ScorecardFields({
  value,
  onChange,
}: {
  value: ScorecardFormState;
  onChange: (value: ScorecardFormState) => void;
}) {
  return (
    <div className="space-y-3 rounded-md border border-border bg-muted/20 p-4">
      <div>
        <div className="text-sm font-medium">Scorecard da avaliação humana</div>
        <p className="text-xs text-muted-foreground">
          Registre como a sugestão performou em utilidade, evidência, segurança e escalonamento.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <ScorecardSelect
          label="Utilidade"
          value={value.utilidade}
          onChange={(next) => onChange({ ...value, utilidade: next })}
        />
        <ScorecardSelect
          label="Evidência"
          value={value.evidencia}
          onChange={(next) => onChange({ ...value, evidencia: next })}
        />
        <ScorecardSelect
          label="Segurança"
          value={value.seguranca}
          onChange={(next) => onChange({ ...value, seguranca: next })}
        />
        <ScorecardSelect
          label="Escalonamento"
          value={value.escalonamento}
          onChange={(next) => onChange({ ...value, escalonamento: next })}
        />
      </div>
    </div>
  );
}

function ScorecardSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: ScorecardFormValue;
  onChange: (value: ScorecardFormValue) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">
        {label} <span className="text-destructive">*</span>
      </Label>
      <Select
        value={value || undefined}
        onValueChange={(next) => onChange(next as ScorecardFormValue)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecione de 1 a 5" />
        </SelectTrigger>
        <SelectContent>
          {SCORECARD_NOTAS.map((nota) => (
            <SelectItem key={nota} value={String(nota)}>
              {scorecardOptionLabel(nota)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function ScorecardResumo({
  scorecard,
  compacto = false,
}: {
  scorecard: ScorecardAvaliacao;
  compacto?: boolean;
}) {
  const itens = [
    ["Utilidade", scorecard.utilidade],
    ["Evidência", scorecard.evidencia],
    ["Segurança", scorecard.seguranca],
    ["Escalonamento", scorecard.escalonamento],
  ] as const;

  return (
    <div className={`rounded-md border border-border bg-muted/20 ${compacto ? "p-2" : "p-3"}`}>
      <div className="mb-2 text-xs font-medium uppercase text-muted-foreground">
        Scorecard da decisão
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {itens.map(([label, nota]) => (
          <div key={label} className="rounded-md border bg-background px-3 py-2">
            <div className="text-[11px] uppercase text-muted-foreground">{label}</div>
            <div className="mt-1 text-sm font-medium">{scorecardOptionLabel(nota)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getConfidenceLabel(score: number) {
  if (score >= 80) return "Alta";
  if (score >= 60) return "Moderada";
  return "Baixa";
}

type ScorecardFormValue = `${ScorecardNota}` | "";
type ScorecardFormState = {
  utilidade: ScorecardFormValue;
  evidencia: ScorecardFormValue;
  seguranca: ScorecardFormValue;
  escalonamento: ScorecardFormValue;
};

function emptyScorecardForm(): ScorecardFormState {
  return {
    utilidade: "",
    evidencia: "",
    seguranca: "",
    escalonamento: "",
  };
}

function scorecardToForm(scorecard?: ScorecardAvaliacao): ScorecardFormState {
  if (!scorecard) {
    return emptyScorecardForm();
  }
  return {
    utilidade: String(scorecard.utilidade) as `${ScorecardNota}`,
    evidencia: String(scorecard.evidencia) as `${ScorecardNota}`,
    seguranca: String(scorecard.seguranca) as `${ScorecardNota}`,
    escalonamento: String(scorecard.escalonamento) as `${ScorecardNota}`,
  };
}

function normalizeScorecard(scorecard: ScorecardFormState): ScorecardAvaliacao | null {
  const notas = [
    scorecard.utilidade,
    scorecard.evidencia,
    scorecard.seguranca,
    scorecard.escalonamento,
  ];
  if (notas.some((nota) => !nota)) {
    return null;
  }
  return {
    utilidade: Number(scorecard.utilidade) as ScorecardNota,
    evidencia: Number(scorecard.evidencia) as ScorecardNota,
    seguranca: Number(scorecard.seguranca) as ScorecardNota,
    escalonamento: Number(scorecard.escalonamento) as ScorecardNota,
  };
}

function scorecardOptionLabel(nota: ScorecardNota) {
  const descricao =
    nota === 1
      ? "1 - Muito baixa"
      : nota === 2
        ? "2 - Baixa"
        : nota === 3
          ? "3 - Adequada"
          : nota === 4
            ? "4 - Boa"
            : "5 - Excelente";
  return descricao;
}

function buildObservedFacts(analise: Analise) {
  const { ticket, sugestao } = analise;
  const facts = [
    ticket.tipoTicket ? `Tipo de registro informado: ${ticket.tipoTicket}.` : null,
    `Domínio do serviço informado: ${ticket.categoria}.`,
    `Prioridade registrada: ${ticket.prioridade}.`,
    ticket.plataforma ? `Plataforma principal: ${ticket.plataforma}.` : null,
    ticket.subdominio ? `Subdomínio informado: ${ticket.subdominio}.` : null,
    ticket.servicoAfetado ? `Serviço afetado: ${ticket.servicoAfetado}.` : null,
    ticket.horarioOcorrencia
      ? `Horário informado da ocorrência: ${ticket.horarioOcorrencia}.`
      : null,
    sugestao.fontesConsultadas.length > 0
      ? `${sugestao.fontesConsultadas.length} evidência(s) curada(s) recuperada(s) para apoiar a análise.`
      : "Nenhuma evidência curada foi recuperada para este caso.",
  ];

  return facts.filter(Boolean) as string[];
}

function buildOperationalSummary(analise: Analise) {
  const { sugestao } = analise;

  if (sugestao.nivelConfianca < 60) {
    return "Priorize coleta complementar de dados e considere escalonamento antes de assumir a hipótese como suficiente.";
  }

  if (sugestao.fontesConsultadas.length === 0) {
    return "Siga os passos recomendados com cautela e valide o caso com mais contexto, pois a análise não recuperou evidências curadas.";
  }

  if (sugestao.alertasLgpd.length > 0) {
    return "A recomendação pode ser seguida, mas somente após revisar os alertas de segurança e confirmar que não haverá exposição indevida de dados.";
  }

  return "A análise está suficientemente estruturada para orientar a próxima ação do analista, mantendo revisão humana antes de qualquer comunicação final.";
}
