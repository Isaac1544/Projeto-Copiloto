import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { BookOpen, FileText, PlusCircle, Trash2 } from "lucide-react";
import { AppShell } from "@/components/copiloto/AppShell";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  appendAnalystKnowledgeItems,
  clearAnalystKnowledgeItems,
  createAnalystKnowledgeItem,
  readAnalystKnowledgeItems,
  removeAnalystKnowledgeItem,
  type AnalystKnowledgeItem,
} from "@/lib/analyst-knowledge";
import { importCsvAsKnowledgeItems } from "@/lib/csv-knowledge-import";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/base-conhecimento")({
  head: () => ({
    meta: [
      { title: "Base de conhecimento — Copiloto L1" },
      {
        name: "description",
        content: "Cadastre conteúdos de apoio para o Copiloto consultar nas análises do MVP.",
      },
    ],
  }),
  component: BaseConhecimentoPage,
});

function BaseConhecimentoPage() {
  const [items, setItems] = useState<AnalystKnowledgeItem[]>([]);
  const [titulo, setTitulo] = useState("");
  const [palavrasChave, setPalavrasChave] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setItems(readAnalystKnowledgeItems());
  }, []);

  const stats = useMemo(() => {
    const totalConteudo = items.reduce((acc, item) => acc + item.content.length, 0);
    return {
      totalBases: items.length,
      totalPalavrasChave: items.reduce((acc, item) => acc + item.keywords.length, 0),
      totalConteudo,
    };
  }, [items]);

  const handleAdicionarManual = () => {
    if (!titulo.trim() || !conteudo.trim()) {
      toast.error("Preencha o título e o conteúdo antes de adicionar a base.");
      return;
    }

    const next = appendAnalystKnowledgeItems([
      createAnalystKnowledgeItem({
        title: titulo,
        content: conteudo,
        keywordsText: palavrasChave,
        origin: "manual",
      }),
    ]);

    setItems(next);
    setTitulo("");
    setPalavrasChave("");
    setConteudo("");
    toast.success("Base adicionada. O Copiloto já pode usar esse conteúdo nas análises locais.");
  };

  const handleRemover = (id: string) => {
    const next = removeAnalystKnowledgeItem(id);
    setItems(next);
    toast.success("Base removida.");
  };

  const handleLimparTudo = () => {
    const next = clearAnalystKnowledgeItems();
    setItems(next);
    toast.success("Todas as bases locais foram removidas.");
  };

  const handleUploadArquivos = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (files.length === 0) return;

    setUploading(true);
    try {
      const imported = await Promise.all(
        files.map(async (file) => {
          const content = (await file.text()).trim();
          if (!content) return null;

          if (file.name.toLowerCase().endsWith(".csv")) {
            return importCsvAsKnowledgeItems(file.name, content);
          }

          return createAnalystKnowledgeItem({
            title: file.name.replace(/\.[^.]+$/, "") || file.name,
            content,
            origin: "upload",
            fileName: file.name,
          });
        }),
      );

      const csvResults = imported.filter(
        (item): item is ReturnType<typeof importCsvAsKnowledgeItems> =>
          Boolean(item) && !("id" in (item as object)),
      );
      const plainItems = imported.filter(
        (item): item is AnalystKnowledgeItem => Boolean(item) && "id" in (item as object),
      );
      const validItems = [...plainItems, ...csvResults.flatMap((result) => result.items)];

      if (validItems.length === 0) {
        toast.error("Nenhum arquivo com conteúdo legível foi importado.");
        return;
      }

      const next = appendAnalystKnowledgeItems(validItems);
      setItems(next);
      const skippedRows = csvResults.reduce((total, result) => total + result.skippedRows, 0);
      const truncatedCsv = csvResults.some((result) => result.truncated);
      const importedLabel =
        csvResults.length > 0
          ? `${validItems.length} caso(s) importado(s) a partir da base`
          : `${validItems.length} arquivo(s) importado(s)`;
      const details = [
        skippedRows > 0 ? `${skippedRows} linha(s) ignorada(s)` : null,
        truncatedCsv ? "limite de 120 casos por CSV aplicado" : null,
      ]
        .filter(Boolean)
        .join(" • ");

      toast.success(
        details
          ? `${importedLabel}. ${details}.`
          : `${importedLabel}. O Copiloto já pode consultar esse material.`,
      );
    } catch {
      toast.error("Não foi possível ler os arquivos enviados.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <AppShell>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Base de conhecimento</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Envie artigos, procedimentos e anotações para o Copiloto consultar nas análises do
            MVP.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/novo-atendimento">
            <PlusCircle className="mr-2 h-4 w-4" />
            Ir para análise
          </Link>
        </Button>
      </div>

      <Alert className="mb-6">
        <BookOpen className="h-4 w-4" />
        <AlertTitle>Como funciona neste MVP</AlertTitle>
        <AlertDescription>
          As bases enviadas aqui ficam salvas localmente neste navegador e já passam a ser
          consultadas pelo Copiloto no modo demonstração e no fallback local.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard label="Bases cadastradas" value={String(stats.totalBases)} />
        <StatCard label="Palavras-chave indexadas" value={String(stats.totalPalavrasChave)} />
        <StatCard label="Caracteres disponíveis" value={stats.totalConteudo.toLocaleString("pt-BR")} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Adicionar conteúdo manualmente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="Título da base" required>
                <Input
                  value={titulo}
                  onChange={(event) => setTitulo(event.target.value)}
                  placeholder="Ex.: Runbook de acesso VPN"
                  maxLength={120}
                />
              </Field>

              <Field label="Palavras-chave (opcional)">
                <Input
                  value={palavrasChave}
                  onChange={(event) => setPalavrasChave(event.target.value)}
                  placeholder="vpn, acesso remoto, autenticação, mfa"
                  maxLength={240}
                />
              </Field>

              <Field label="Conteúdo" required>
                <Textarea
                  value={conteudo}
                  onChange={(event) => setConteudo(event.target.value)}
                  placeholder="Cole aqui o artigo, procedimento, troubleshooting ou anotações do time."
                  rows={10}
                  maxLength={12000}
                />
              </Field>

              <Button type="button" onClick={handleAdicionarManual} className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar à base local
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Importar arquivos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Você pode importar `.txt`, `.md`, `.csv`, `.json` ou qualquer arquivo textual
                simples. Arquivos `.csv` são convertidos em casos resumidos para consulta, em vez
                de serem salvos como planilha bruta.
              </p>
              <Input
                type="file"
                multiple
                accept=".txt,.md,.csv,.json,.log,text/plain,text/markdown,application/json,text/csv"
                onChange={handleUploadArquivos}
                disabled={uploading}
              />
              <div className="rounded-md border border-dashed border-border bg-muted/40 p-4 text-sm text-muted-foreground">
                <div className="font-medium text-foreground">Dica operacional</div>
                <div className="mt-1">
                  Prefira subir runbooks, KBs internas, FAQs e anotações de troubleshooting já
                  higienizadas, sem segredos e sem dados pessoais.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <CardTitle className="text-base">Bases carregadas</CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleLimparTudo}
              disabled={items.length === 0}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Limpar tudo
            </Button>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="rounded-lg border border-border p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="truncate text-sm font-medium">{item.title}</div>
                          <Badge variant="secondary">
                            {item.origin === "upload" ? "Arquivo" : "Manual"}
                          </Badge>
                          {item.fileName && (
                            <Badge variant="outline" className="max-w-full truncate">
                              {item.fileName}
                            </Badge>
                          )}
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {item.content.length > 280
                            ? `${item.content.slice(0, 277).trimEnd()}...`
                            : item.content}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {item.keywords.slice(0, 8).map((keyword) => (
                            <Badge key={keyword} variant="outline">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                        <div className="mt-3 text-xs text-muted-foreground">
                          Atualizado em {formatarData(item.updatedAt)}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemover(item.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remover
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </div>
        <div className="mt-3 text-2xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-border py-14 text-center">
      <FileText className="mb-3 h-8 w-8 text-muted-foreground" />
      <div className="text-sm font-medium">Nenhuma base cadastrada ainda</div>
      <p className="mt-1 max-w-md text-xs text-muted-foreground">
        Adicione textos manualmente ou importe arquivos para o Copiloto usar como apoio nas
        próximas análises.
      </p>
    </div>
  );
}

function formatarData(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
