import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Sparkles, Eraser, AlertCircle, BookOpen } from "lucide-react";
import { AppShell } from "@/components/copiloto/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CATEGORIAS,
  PLATAFORMAS,
  PRIORIDADES,
  SUBDOMINIOS_NUTANIX,
  TIPOS_TICKET,
  type Categoria,
  type Plataforma,
  type Prioridade,
  type Ticket,
  type TipoTicket,
  type SubdominioNutanix,
} from "@/lib/mock-data";
import { useCopiloto } from "@/lib/copiloto-store";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/novo-atendimento")({
  head: () => ({
    meta: [
      { title: "Novo atendimento — Copiloto L1" },
      {
        name: "description",
        content: "Registre um novo atendimento para análise assistida pelo Copiloto L1.",
      },
    ],
  }),
  component: NovoAtendimento,
});

interface FormState {
  titulo: string;
  descricao: string;
  tipoTicket: TipoTicket | "";
  categoria: Categoria | "";
  plataforma: Plataforma | "";
  subdominio: string;
  servicoAfetado: string;
  horarioOcorrencia: string;
  prioridade: Prioridade | "";
  contextoAdicional: string;
}

const estadoInicial: FormState = {
  titulo: "",
  descricao: "",
  tipoTicket: "",
  categoria: "",
  plataforma: "",
  subdominio: "",
  servicoAfetado: "",
  horarioOcorrencia: "",
  prioridade: "",
  contextoAdicional: "",
};

function NovoAtendimento() {
  const navigate = useNavigate();
  const { criarAnalise } = useCopiloto();
  const [form, setForm] = useState<FormState>(estadoInicial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [loading, setLoading] = useState(false);
  const [erroAnalise, setErroAnalise] = useState<string | null>(null);

  const validar = (): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.titulo.trim()) e.titulo = "Informe o título do chamado.";
    if (!form.descricao.trim()) e.descricao = "Descreva o problema relatado.";
    if (!form.tipoTicket) e.tipoTicket = "Selecione o tipo de registro.";
    if (!form.categoria) e.categoria = "Selecione uma categoria.";
    if (!form.plataforma) e.plataforma = "Selecione a plataforma principal.";
    if (form.plataforma === "Nutanix" && !form.subdominio) {
      e.subdominio = "Selecione o subdomínio Nutanix.";
    }
    if (!form.prioridade) e.prioridade = "Selecione a prioridade.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAnalisar = async () => {
    setErroAnalise(null);
    if (!validar()) {
      toast.error("Preencha os campos obrigatórios antes de continuar.");
      return;
    }
    setLoading(true);
    const ticket: Ticket = {
      titulo: form.titulo.trim(),
      descricao: form.descricao.trim(),
      tipoTicket: form.tipoTicket as TipoTicket,
      categoria: form.categoria as Categoria,
      plataforma: form.plataforma as Plataforma,
      subdominio:
        form.plataforma === "Nutanix"
          ? (form.subdominio as SubdominioNutanix)
          : form.subdominio.trim() || undefined,
      servicoAfetado: form.servicoAfetado.trim() || undefined,
      horarioOcorrencia: form.horarioOcorrencia || undefined,
      prioridade: form.prioridade as Prioridade,
      contextoAdicional: form.contextoAdicional.trim() || undefined,
    };
    try {
      const nova = await criarAnalise(ticket);
      toast.success("Sugestão do Copiloto gerada. Revise antes de decidir.");
      navigate({ to: "/resultado/$id", params: { id: nova.id } });
    } catch (err) {
      setErroAnalise(
        err instanceof Error
          ? err.message
          : "Não foi possível concluir a análise no momento. Tente novamente em instantes.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLimpar = () => {
    setForm(estadoInicial);
    setErrors({});
    setErroAnalise(null);
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Novo atendimento</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Informe o contexto do chamado para gerar uma sugestão estruturada.
          </p>
        </div>

        {erroAnalise && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Falha na análise</AlertTitle>
            <AlertDescription>{erroAnalise}</AlertDescription>
          </Alert>
        )}

        <Alert className="mb-6">
          <BookOpen className="h-4 w-4" />
          <AlertTitle>Quer enriquecer a análise?</AlertTitle>
          <AlertDescription>
            Você pode cadastrar artigos, runbooks e anotações em{" "}
            <Link to="/base-conhecimento" className="font-medium underline">
              Base de conhecimento
            </Link>{" "}
            para o Copiloto usar como apoio nas próximas sugestões.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Dados do chamado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <Field label="Título do chamado" required error={errors.titulo}>
              <Input
                value={form.titulo}
                onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
                placeholder="Ex.: Não consigo acessar o e-mail corporativo"
                disabled={loading}
                maxLength={140}
              />
            </Field>

            <Field label="Descrição do problema" required error={errors.descricao}>
              <Textarea
                value={form.descricao}
                onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))}
                placeholder="Descreva sintomas, mensagens de erro, impacto observado e evidências já coletadas."
                rows={5}
                disabled={loading}
                maxLength={2000}
              />
            </Field>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Tipo de registro" required error={errors.tipoTicket}>
                <Select
                  value={form.tipoTicket || undefined}
                  onValueChange={(v) => setForm((f) => ({ ...f, tipoTicket: v as TipoTicket }))}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {TIPOS_TICKET.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Prioridade" required error={errors.prioridade}>
                <Select
                  value={form.prioridade || undefined}
                  onValueChange={(v) => setForm((f) => ({ ...f, prioridade: v as Prioridade }))}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORIDADES.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Domínio do serviço" required error={errors.categoria}>
                <Select
                  value={form.categoria || undefined}
                  onValueChange={(v) => setForm((f) => ({ ...f, categoria: v as Categoria }))}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIAS.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Plataforma principal" required error={errors.plataforma}>
                <Select
                  value={form.plataforma || undefined}
                  onValueChange={(v) =>
                    setForm((f) => ({
                      ...f,
                      plataforma: v as Plataforma,
                      subdominio: v === "Nutanix" ? f.subdominio : "",
                    }))
                  }
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {PLATAFORMAS.map((plataforma) => (
                      <SelectItem key={plataforma} value={plataforma}>
                        {plataforma}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field
                label="Subdomínio técnico"
                required={form.plataforma === "Nutanix"}
                error={errors.subdominio}
              >
                {form.plataforma === "Nutanix" ? (
                  <Select
                    value={form.subdominio || undefined}
                    onValueChange={(v) =>
                      setForm((f) => ({ ...f, subdominio: v as SubdominioNutanix }))
                    }
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {SUBDOMINIOS_NUTANIX.map((subdominio) => (
                        <SelectItem key={subdominio} value={subdominio}>
                          {subdominio}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    value={form.subdominio}
                    onChange={(e) => setForm((f) => ({ ...f, subdominio: e.target.value }))}
                    placeholder="Opcional para plataformas não Nutanix"
                    disabled={loading}
                    maxLength={80}
                  />
                )}
              </Field>

              <Field label="Serviço afetado ou componente">
                <Input
                  value={form.servicoAfetado}
                  onChange={(e) => setForm((f) => ({ ...f, servicoAfetado: e.target.value }))}
                  placeholder="Ex.: cluster produção, VPN, Outlook, backup job"
                  disabled={loading}
                  maxLength={120}
                />
              </Field>
            </div>

            <Field label="Horário da ocorrência (opcional)">
              <Input
                type="datetime-local"
                value={form.horarioOcorrencia}
                onChange={(e) => setForm((f) => ({ ...f, horarioOcorrencia: e.target.value }))}
                disabled={loading}
              />
            </Field>

            <Field label="Contexto adicional (opcional)">
              <Textarea
                value={form.contextoAdicional}
                onChange={(e) => setForm((f) => ({ ...f, contextoAdicional: e.target.value }))}
                placeholder="Tentativas anteriores, comportamento intermitente, evidências já validadas e observações do analista. Evite dados pessoais sensíveis."
                rows={4}
                disabled={loading}
                maxLength={2000}
              />
            </Field>

            <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={handleLimpar} disabled={loading}>
                <Eraser className="mr-2 h-4 w-4" />
                Limpar formulário
              </Button>
              <Button type="button" onClick={handleAnalisar} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analisando com o Copiloto...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Analisar com o Copiloto
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
