import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  Activity,
  CheckCircle2,
  PencilLine,
  XCircle,
  ClipboardCheck,
  BarChart3,
  Clock3,
  ArrowRight,
  PlusCircle,
  Info,
} from "lucide-react";
import { AppShell } from "@/components/copiloto/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useCopiloto, formatarDataHora } from "@/lib/copiloto-store";
import { DecisaoBadge, PrioridadeBadge } from "@/components/copiloto/StatusBadge";
import { isDemoModeEnabled } from "@/lib/runtime-mode";

export const Route = createFileRoute("/_authenticated/")({
  component: Dashboard,
});

const MINUTOS_ECONOMIZADOS_POR_SUGESTAO_APROVEITADA = 7;

function Dashboard() {
  const { analises } = useCopiloto();
  const demoMode = isDemoModeEnabled();

  const stats = useMemo(() => {
    const total = analises.length;
    const aceitas = analises.filter((a) => a.decisao.status === "Aceita").length;
    const editadas = analises.filter((a) => a.decisao.status === "Editada").length;
    const rejeitadas = analises.filter((a) => a.decisao.status === "Rejeitada").length;
    const pendentes = analises.filter((a) => a.decisao.status === "Pendente").length;
    const decididas = total - pendentes;
    const aproveitadas = aceitas + editadas;
    const taxaAproveitamento = decididas > 0 ? Math.round((aproveitadas / decididas) * 100) : 0;
    const confiancaMedia =
      total > 0
        ? Math.round(
            analises.reduce((acc, analise) => acc + analise.sugestao.nivelConfianca, 0) / total,
          )
        : 0;
    const scorecards = analises.map((analise) => analise.decisao.scorecard).filter(Boolean);
    const scorecardMedio =
      scorecards.length > 0
        ? (
            scorecards.reduce(
              (acc, scorecard) =>
                acc +
                scorecard.utilidade +
                scorecard.evidencia +
                scorecard.seguranca +
                scorecard.escalonamento,
              0,
            ) /
            (scorecards.length * 4)
          ).toFixed(1)
        : "-";
    const tempoEconomizado = aproveitadas * MINUTOS_ECONOMIZADOS_POR_SUGESTAO_APROVEITADA;
    return {
      total,
      pendentes,
      aproveitadas,
      rejeitadas,
      taxaAproveitamento,
      confiancaMedia,
      scorecardMedio,
      tempoEconomizado,
    };
  }, [analises]);

  const ultimas = analises.slice(0, 5);

  const cards = [
    { label: "Atendimentos analisados", value: stats.total, icon: Activity, tone: "text-primary" },
    {
      label: "Pendentes de decisão",
      value: stats.pendentes,
      icon: Clock3,
      tone: "text-amber-600",
    },
    {
      label: "Sugestões aproveitadas",
      value: stats.aproveitadas,
      icon: ClipboardCheck,
      tone: "text-emerald-600",
    },
    {
      label: "Taxa de aproveitamento",
      value: `${stats.taxaAproveitamento}%`,
      icon: CheckCircle2,
      tone: "text-emerald-700",
    },
    {
      label: "Confiança média",
      value: stats.total > 0 ? `${stats.confiancaMedia}%` : "-",
      icon: BarChart3,
      tone: "text-indigo-600",
    },
    {
      label: "Scorecard médio",
      value: stats.scorecardMedio,
      icon: PencilLine,
      tone: "text-sky-600",
    },
    { label: "Rejeitadas", value: stats.rejeitadas, icon: XCircle, tone: "text-rose-600" },
    {
      label: "Tempo estimado poupado",
      value: `${stats.tempoEconomizado} min`,
      icon: ClipboardCheck,
      tone: "text-violet-600",
    },
  ];

  return (
    <AppShell>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Visão geral das análises do Copiloto L1. A decisão final é sempre humana.
          </p>
        </div>
        <Button asChild>
          <Link to="/novo-atendimento">
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo atendimento
          </Link>
        </Button>
      </div>

      {demoMode && (
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>Modo demonstração ativo</AlertTitle>
          <AlertDescription>
            Este MVP está acessível sem login e salva os dados localmente no navegador para
            facilitar validação do fluxo.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {c.label}
                </span>
                <c.icon className={`h-4 w-4 ${c.tone}`} />
              </div>
              <div className="mt-3 text-2xl font-semibold">{c.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Últimas análises</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link to="/historico">
              Ver histórico
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {ultimas.length === 0 ? (
            <EmptyDashboard />
          ) : (
            <ul className="divide-y divide-border">
              {ultimas.map((a) => (
                <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{a.ticket.titulo}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatarDataHora(a.criadoEm)}</span>
                      <span>•</span>
                      <span>{a.ticket.categoria}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <PrioridadeBadge prioridade={a.ticket.prioridade} />
                    <DecisaoBadge status={a.decisao.status} />
                    <Button asChild variant="outline" size="sm">
                      <Link to="/resultado/$id" params={{ id: a.id }}>
                        Abrir
                      </Link>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}

function EmptyDashboard() {
  return (
    <div className="rounded-md border border-dashed border-border py-10 text-center">
      <p className="text-sm text-muted-foreground">
        Nenhuma análise ainda. Crie um novo atendimento para começar.
      </p>
      <Button asChild className="mt-4">
        <Link to="/novo-atendimento">
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo atendimento
        </Link>
      </Button>
    </div>
  );
}
