# Projeto Copiloto — Clear IT

Copiloto consultivo para analistas de suporte L1, com foco em triagem, evidências, recomendação de resolução, escalonamento responsável e resposta revisável ao cliente.

## Estado atual

O repositório está organizado em duas frentes:

- `copiloto-amigo-main/`: aplicação web principal do MVP.
- `docs/`, `data/` e `docs/knowledge-base/`: contexto de negócio, contexto técnico, backlog, corpus curado e dados anonimizados de apoio.

O MVP já permite:

- abrir o fluxo principal sem login, em modo público;
- registrar atendimentos manualmente;
- gerar análise server-side via Supabase Edge Function;
- recuperar evidências curadas da base de conhecimento;
- separar fatos observados, identificação do problema, sugestão de resolução e resposta ao cliente;
- registrar decisão humana e scorecard operacional;
- consultar histórico e métricas do uso.

## Links atuais

- Deploy público atual: [isaac1544-projeto-copiloto.copilotoisaac.workers.dev](https://isaac1544-projeto-copiloto.copilotoisaac.workers.dev)
- Deploy legado do Lovable: [copiloto-amigo.lovable.app](https://copiloto-amigo.lovable.app)

## Arquitetura resumida

```text
Frontend TanStack Start / React
        ↓
Supabase Auth / sessão pública controlada
        ↓
Supabase Edge Function analyze-ticket
        ↓
LLM_PROVIDER = anthropic | openai | gemini
        ↓
Supabase Postgres + trilha de decisão humana
```

Observações:

- o modelo nunca é chamado diretamente do navegador;
- a escolha do provedor fica no Supabase via `LLM_PROVIDER`;
- a recomendação atual do MVP continua sendo Anthropic / Claude, mas o backend já suporta OpenAI e Gemini;
- `data/raw/` está fora do versionamento e não deve ser compartilhado.

## Modos de uso

### Demonstração

Usado quando o time quer navegar rapidamente, sem depender de Supabase configurado no frontend.

### Acesso público

Usado quando o app precisa ficar acessível com backend real, mas sem exigir login durante a validação do MVP.

### Conectado

Usado quando o fluxo completo com autenticação Supabase precisa ser validado.

## Estrutura do repositório

```text
Projeto Copiloto/
├── README.md
├── ONION-MASTER-PROMPT.md
├── copiloto-amigo-main/
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

## Documentos principais

- Negócio: [docs/business-context-lite.md](docs/business-context-lite.md)
- Técnico: [docs/technical-context-lite.md](docs/technical-context-lite.md)
- Backlog operacional: [docs/backlog-operacional-mvp.md](docs/backlog-operacional-mvp.md)
- Modelo de domínio: [docs/domain-model-mvp.md](docs/domain-model-mvp.md)
- Corpus e RAG: [docs/knowledge-corpus-mvp.md](docs/knowledge-corpus-mvp.md)
- Segurança e LGPD: [docs/security-pipeline-mvp.md](docs/security-pipeline-mvp.md)
- Setup local: [docs/setup-local-copiloto.md](docs/setup-local-copiloto.md)
- Operação e versionamento: [docs/operacao-versionamento-mvp.md](docs/operacao-versionamento-mvp.md)
- Deploy Cloudflare: [copiloto-amigo-main/docs/deploy-cloudflare.md](copiloto-amigo-main/docs/deploy-cloudflare.md)

## Onde mexer em cada tipo de mudança

- fluxo, telas, backend do app e integração Supabase: `copiloto-amigo-main/`
- decisões de produto, backlog e operação: `docs/`
- corpus aprovado e dados anonimizados: `data/processed/` e `docs/knowledge-base/`

## Regras de segurança

- nunca versionar `.env`, chaves, tokens ou segredos;
- nunca versionar `data/raw/`;
- só manter em `data/processed/` material anonimizado e aprovado;
- toda análise gerada por IA exige revisão humana antes de qualquer comunicação final.
