import { Badge } from "@/components/ui/badge";
import type { DecisaoStatus, Prioridade } from "@/lib/mock-data";

export function DecisaoBadge({ status }: { status: DecisaoStatus }) {
  const map: Record<DecisaoStatus, string> = {
    Pendente: "bg-muted text-muted-foreground",
    Aceita: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
    Editada: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
    Rejeitada: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200",
  };
  return <Badge className={`${map[status]} border-transparent`}>{status}</Badge>;
}

export function PrioridadeBadge({ prioridade }: { prioridade: Prioridade }) {
  const map: Record<Prioridade, string> = {
    P1: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200",
    P2: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200",
    P3: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
    P4: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200",
    P5: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
    Baixa: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200",
    Média: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200",
    Alta: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200",
    Crítica: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200",
  };
  return <Badge className={`${map[prioridade]} border-transparent`}>{prioridade}</Badge>;
}
