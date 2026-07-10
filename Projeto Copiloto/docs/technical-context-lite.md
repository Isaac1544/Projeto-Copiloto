# Technical Context — Copiloto para Analistas de Suporte L1 Clear IT

> Versão: v3.0  
> Data: 2026-07-10  
> Responsável: `@engineer`  
> Estado atual: MVP funcional com frontend publicado, Edge Function ativa, sessão pública controlada e documentação sincronizada com o código  
> Próximo foco técnico: consolidar corpus persistido, validar operação com provedor escolhido e reduzir dívida de organização entre UI, contrato e banco

## 1. Resumo executivo

O projeto já não está mais em fase apenas conceitual. Hoje existe uma aplicação funcional em `copiloto-amigo-main/`, publicada em Cloudflare Workers, com backend de análise no Supabase e fluxo principal do analista utilizável.

O objetivo técnico do MVP é:

1. receber um chamado manualmente;
2. sanitizar a entrada antes da IA;
3. recuperar evidências curadas;
4. gerar uma recomendação estruturada server-side;
5. expor o resultado para revisão humana;
6. registrar decisão e scorecard operacional.

## 2. Estrutura atual do repositório

```text
Projeto Copiloto/
├── README.md
├── ONION-MASTER-PROMPT.md
├── copiloto-amigo-main/
│   ├── docs/
│   ├── public/
│   ├── scripts/
│   ├── src/
│   └── supabase/
├── data/
│   ├── processed/
│   └── raw/
└── docs/
    ├── backlog-operacional-mvp.md
    ├── business-context-lite.md
    ├── domain-model-mvp.md
    ├── knowledge-corpus-mvp.md
    ├── operacao-versionamento-mvp.md
    ├── security-pipeline-mvp.md
    ├── setup-local-copiloto.md
    ├── technical-context-lite.md
    ├── knowledge-base/
    └── sessions/
```

Decisão prática:

- a pasta principal de desenvolvimento do produto é `copiloto-amigo-main/`;
- a raiz do repositório concentra documentação, corpus e governança do MVP;
- `data/raw/` permanece local e fora do Git;
- `data/processed/` pode ser versionado apenas com material anonimizado e aprovado.

## 3. Estado atual do app

O app já entrega:

- frontend em React + TypeScript sobre TanStack Start;
- build com Vite/Nitro para Cloudflare Workers;
- modo demonstração;
- modo público sem login bloqueante;
- modo conectado com Supabase;
- dashboard;
- novo atendimento;
- resultado da análise;
- histórico;
- persistência de análises;
- persistência de decisão humana;
- scorecard operacional;
- Edge Function `analyze-ticket`;
- recuperação mínima de evidências curadas;
- fallback controlado quando o provedor não está disponível.

Ainda falta consolidar:

- corpus persistido em banco para KB/RAG;
- alinhamento completo entre modelo de tela, contrato e banco;
- revisão mais forte da sanitização antes da persistência;
- validação operacional estável do provedor definitivo em produção;
- suíte de testes automatizados além do `verify:mvp`.

## 4. Stack técnica confirmada

| Camada | Decisão atual |
|---|---|
| Frontend | React + TypeScript |
| Framework app | TanStack Start |
| Build | Vite |
| Deploy web | Cloudflare Workers |
| UI | Tailwind + componentes gerados pelo stack do Lovable |
| Backend de análise | Supabase Edge Functions |
| Banco | Supabase Postgres |
| Sessão/Auth | Supabase Auth e modo público controlado |
| Provedor de IA | Seleção por `LLM_PROVIDER` |
| Provedores suportados | `anthropic`, `openai`, `gemini` |

## 5. Arquitetura lógica

```text
Analista
  ↓
Frontend web
  ↓
Modo de execução:
  - Demonstração
  - Acesso público
  - Conectado
  ↓
Supabase Edge Function analyze-ticket
  ↓
Sanitização + regras de bloqueio
  ↓
Recuperação de evidências curadas
  ↓
LLM provider configurado no Supabase
  ↓
Resposta estruturada
  ↓
Persistência + decisão humana + scorecard
```

## 6. Modos de execução

### 6.1 Demonstração

Ativado quando:

- `VITE_DEMO_MODE=true`; ou
- o frontend não tem `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`.

Comportamento:

- sem dependência de Supabase no frontend;
- persistência local no navegador;
- útil para UX, apresentação e fluxo básico.

### 6.2 Acesso público

Ativado quando:

- Supabase está configurado; e
- `VITE_AUTH_BYPASS=true`.

Comportamento:

- app acessível sem login bloqueante;
- backend real continua ativo;
- útil para acelerar validação do MVP.

### 6.3 Conectado

Ativado quando:

- Supabase está configurado; e
- `VITE_DEMO_MODE=false`; e
- `VITE_AUTH_BYPASS=false`.

Comportamento:

- fluxo com autenticação real;
- persistência real por usuário;
- adequado para etapa posterior de endurecimento operacional.

## 7. Contrato técnico atual

O contrato canônico entre frontend e `analyze-ticket` hoje é enxuto:

```ts
type AnalyzeTicketInput = {
  title: string;
  description: string;
  category: string;
  priority: string;
  additionalContext?: string;
}
```

Observação importante:

- a UI já trabalha com campos mais ricos de operação;
- parte desses campos hoje é consolidada em `category`, `priority` e `additionalContext`;
- isso funciona para o MVP, mas ainda é um ponto técnico a evoluir.

## 8. Backend de análise

Arquivo principal:

- `copiloto-amigo-main/supabase/functions/analyze-ticket/index.ts`

A função já implementa:

- validação de payload;
- bloqueio de segredo, senha, token e chave;
- mascaramento básico de e-mail, CPF e telefone;
- seleção de provedor por `LLM_PROVIDER`;
- compatibilidade com Anthropic, OpenAI e Gemini;
- timeout defensivo;
- fallback controlado quando `ALLOW_MOCK_ANALYSIS=true`;
- validação do formato de resposta do modelo.

Variáveis de backend relevantes:

- `LLM_PROVIDER`
- `ALLOW_MOCK_ANALYSIS`
- `ANTHROPIC_API_KEY`
- `ANTHROPIC_MODEL`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `GEMINI_API_KEY`
- `GEMINI_MODEL`

## 9. Persistência e estado

O MVP já persiste:

- análises;
- fontes consultadas;
- decisões humanas;
- scorecard operacional.

Também existe suporte a armazenamento público/local para o modo sem login, permitindo navegação rápida mesmo antes de autenticação formal.

## 10. Deploy atual

Estado conhecido do deploy web:

- URL pública principal: [isaac1544-projeto-copiloto.copilotoisaac.workers.dev](https://isaac1544-projeto-copiloto.copilotoisaac.workers.dev)
- origem do frontend: build de `copiloto-amigo-main/`
- destino: Cloudflare Workers via saída Nitro/TanStack Start

Estado conhecido do backend:

- projeto Supabase vinculado ao workspace;
- Edge Function `analyze-ticket` já publicada ao menos para uso do MVP;
- comportamento final depende dos secrets ativos no ambiente remoto.

## 11. Riscos técnicos atuais

1. O modelo de domínio da UI ainda é mais rico do que o contrato canônico do backend.
2. O corpus de evidências ainda é mínimo e não persistido como base operacional robusta.
3. A sanitização atual cobre o essencial, mas não fecha toda a política LGPD do produto.
4. O modo público acelera o MVP, mas não substitui a futura validação com autenticação forte.
5. Parte da documentação anterior estava com caminhos locais e precisava ser normalizada para GitHub.

## 12. Prioridades técnicas imediatas

1. consolidar o corpus inicial em estrutura persistida;
2. alinhar contrato de análise, modelo de tela e schema do banco;
3. decidir e estabilizar o provedor principal de IA para o ambiente produtivo controlado;
4. fortalecer a trilha de sanitização antes da persistência e da análise;
5. reduzir dívida operacional de docs, setup e versionamento.

## 13. Decisões técnicas registradas

| ID | Decisão | Status |
|---|---|---|
| TD-01 | O app principal do MVP fica em `copiloto-amigo-main/` | Confirmada |
| TD-02 | O backend de análise roda em Supabase Edge Functions | Confirmada |
| TD-03 | O frontend público do MVP roda em Cloudflare Workers | Confirmada |
| TD-04 | O navegador nunca fala direto com o provedor de IA | Confirmada |
| TD-05 | O provedor é selecionado via `LLM_PROVIDER` | Confirmada |
| TD-06 | Anthropic/Claude segue como caminho preferencial do MVP, sem bloquear fallback para OpenAI ou Gemini | Confirmada |
| TD-07 | `data/raw/` não entra em Git | Confirmada |
| TD-08 | O MVP pode operar temporariamente sem login via `VITE_AUTH_BYPASS=true` | Confirmada |
