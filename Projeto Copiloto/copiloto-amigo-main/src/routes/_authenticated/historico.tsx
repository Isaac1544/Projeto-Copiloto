import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PlusCircle, Search, Inbox } from "lucide-react";
import { AppShell } from "@/components/copiloto/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCopiloto, formatarDataHora } from "@/lib/copiloto-store";
import { DecisaoBadge, PrioridadeBadge } from "@/components/copiloto/StatusBadge";

export const Route = createFileRoute("/_authenticated/historico")({
  head: () => ({
    meta: [
      { title: "Histórico — Copiloto L1" },
      { name: "description", content: "Histórico de análises assistidas pelo Copiloto L1." },
    ],
  }),
  component: Historico,
});

function Historico() {
  const { analises } = useCopiloto();
  const [busca, setBusca] = useState("");
  const [filtroDecisao, setFiltroDecisao] = useState<string>("todas");

  const filtradas = useMemo(() => {
    const q = busca.trim().toLowerCase();
    return analises.filter((a) => {
      if (filtroDecisao !== "todas" && a.decisao.status !== filtroDecisao) return false;
      if (!q) return true;
      return (
        a.ticket.titulo.toLowerCase().includes(q) ||
        a.ticket.categoria.toLowerCase().includes(q) ||
        a.decisao.responsavel.toLowerCase().includes(q)
      );
    });
  }, [analises, busca, filtroDecisao]);

  return (
    <AppShell>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Histórico</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Todas as análises geradas pelo Copiloto e as respectivas decisões humanas.
          </p>
        </div>
        <Button asChild>
          <Link to="/novo-atendimento">
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo atendimento
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <div className="relative min-w-64 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por título, categoria ou responsável"
                className="pl-9"
              />
            </div>
            <Select value={filtroDecisao} onValueChange={setFiltroDecisao}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as decisões</SelectItem>
                <SelectItem value="Pendente">Pendentes</SelectItem>
                <SelectItem value="Aceita">Aceitas</SelectItem>
                <SelectItem value="Editada">Editadas</SelectItem>
                <SelectItem value="Rejeitada">Rejeitadas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {analises.length === 0 ? (
            <EmptyState
              titulo="Nenhuma análise registrada"
              descricao="Assim que você criar um novo atendimento, ele aparecerá aqui."
            />
          ) : filtradas.length === 0 ? (
            <EmptyState
              titulo="Nenhum resultado para os filtros aplicados"
              descricao="Ajuste a busca ou o filtro de decisão para ver mais análises."
            />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Decisão</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtradas.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                        {formatarDataHora(a.criadoEm)}
                      </TableCell>
                      <TableCell className="max-w-sm truncate font-medium">
                        {a.ticket.titulo}
                      </TableCell>
                      <TableCell>{a.ticket.categoria}</TableCell>
                      <TableCell>
                        <PrioridadeBadge prioridade={a.ticket.prioridade} />
                      </TableCell>
                      <TableCell>
                        <DecisaoBadge status={a.decisao.status} />
                      </TableCell>
                      <TableCell className="text-sm">{a.decisao.responsavel}</TableCell>
                      <TableCell className="text-right">
                        <Button asChild size="sm" variant="outline">
                          <Link to="/resultado/$id" params={{ id: a.id }}>
                            Abrir detalhe
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}

function EmptyState({ titulo, descricao }: { titulo: string; descricao: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-border py-14 text-center">
      <Inbox className="mb-3 h-8 w-8 text-muted-foreground" />
      <div className="text-sm font-medium">{titulo}</div>
      <p className="mt-1 max-w-md text-xs text-muted-foreground">{descricao}</p>
    </div>
  );
}