import { createFileRoute } from "@tanstack/react-router";
import {
  BookOpenText,
  ClipboardList,
  Rocket,
  TriangleAlert,
  Users,
  Wrench,
} from "lucide-react";
import { AppShell } from "@/components/copiloto/AppShell";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/_authenticated/manual")({
  component: ManualPage,
});

const TEAM_INFO = {
  groupName: "Log Mind",
  members: [
    "Isaac Vieira",
    "Grover Butron",
    "Arthur Pires",
    "Kaua Rodrigues",
    "Wilson Carlos",
  ],
} as const;

const principaisFuncionalidades = [
  "Abertura manual de chamados pelo analista com campos de operação e contexto adicional.",
  "Geração de análise server-side por meio da Edge Function analyze-ticket.",
  "Separação da sugestão em leitura inicial, fatos observados, identificação do problema, resolução e resposta ao cliente.",
  "Consulta a evidências curadas e base de conhecimento complementar enviada pelo analista.",
  "Registro de decisão humana com aceite, edição, rejeição e scorecard de avaliação.",
  "Histórico de análises para acompanhamento do uso do Copiloto.",
  "Modo público para validação do MVP sem depender de login bloqueante.",
];

const aindaNaoFunciona = [
  "Integração nativa com uma ferramenta ITSM externa ainda não está implementada no MVP.",
  "Busca vetorial/RAG persistido em nível mais robusto ainda não foi concluída.",
  "Fluxo de autenticação conectado existe, mas o uso principal do MVP ainda está no modo público.",
  "Envio automático de resposta ao cliente não está ativo; toda decisão continua manual.",
  "Observabilidade e monitoramento operacional de produção ainda precisam amadurecer.",
];

const proximosPassos = [
  "Consolidar a base de conhecimento persistida com melhor curadoria e governança.",
  "Aprimorar a qualidade das sugestões com busca mais precisa e menos dependência de fallback contextual.",
  "Reforçar autenticação, permissões e rastreabilidade para uma etapa posterior do produto.",
  "Evoluir integração com sistemas de atendimento e fluxos operacionais reais.",
  "Adicionar testes automatizados e observabilidade mais forte para produção.",
];

function ManualPage() {
  return (
    <AppShell>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <BookOpenText className="h-4 w-4" />
          Manual do sistema
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Manual do Copiloto L1</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Esta página resume o objetivo do sistema, o que já está funcionando no MVP, o que ainda
          não foi concluído e quais são os próximos passos recomendados.
        </p>
      </div>

      <Alert className="mb-6">
        <TriangleAlert className="h-4 w-4" />
        <AlertTitle>Manual resumido do MVP</AlertTitle>
        <AlertDescription>
          O Copiloto L1 é um MVP em evolução. Ele já apoia a análise do chamado, mas não substitui
          revisão humana nem representa a versão final do produto.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpenText className="h-4 w-4 text-primary" />
              Descrição do sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              O Copiloto L1 é um assistente para analistas de suporte. Ele recebe um chamado,
              organiza as informações, consulta evidências relevantes e gera uma sugestão
              estruturada para ajudar na triagem e no encaminhamento do caso.
            </p>
            <p>
              O sistema foi projetado para apoiar a decisão do analista com mais velocidade e
              consistência, separando o resultado em blocos claros: resumo do caso, hipótese do
              problema, próximos passos e resposta sugerida ao cliente.
            </p>
            <p>
              A lógica principal roda no backend, com integração a provedor de IA e regras de
              segurança, mantendo a decisão final sempre sob responsabilidade humana.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ClipboardList className="h-4 w-4 text-emerald-600" />
              Principais funcionalidades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {principaisFuncionalidades.map((item) => (
                <li key={item} className="rounded-md border bg-muted/20 px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Wrench className="h-4 w-4 text-amber-600" />
              O que ainda não está funcionando
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {aindaNaoFunciona.map((item) => (
                <li key={item} className="rounded-md border bg-amber-50/60 px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Rocket className="h-4 w-4 text-sky-600" />
              Próximos passos e evoluções
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 pl-5 text-sm text-muted-foreground">
              {proximosPassos.map((item) => (
                <li key={item} className="list-decimal">
                  {item}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4 text-violet-600" />
              Grupo e integrantes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Nome do grupo
              </div>
              <div className="mt-1 text-sm text-foreground">{TEAM_INFO.groupName}</div>
            </div>
            <Separator />
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Integrantes
              </div>
              <ul className="mt-2 space-y-2">
                {TEAM_INFO.members.map((member) => (
                  <li key={member} className="rounded-md border bg-muted/20 px-3 py-2">
                    {member}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
