---
title: "KB 12 — Visao Geral da Stack do MVP"
category: "Technology Reference"
source_type: "Codigo do repositorio + documentacao oficial"
confidence: "Alta"
status: "Ativo"
tags: ["stack", "react", "supabase", "cloudflare", "vite", "typescript"]
---

# KB 12 — Visao Geral da Stack do MVP

## Objetivo

Consolidar, em um unico artigo, quais tecnologias sustentam o MVP do Copiloto e qual e o papel de cada uma.

## Stack confirmada no projeto

| Camada | Tecnologia | Papel no MVP |
|---|---|---|
| Frontend | React 19 | Construir a interface |
| App framework | TanStack Start | Organizar rotas, rendering e build do app |
| Linguagem | TypeScript | Tipagem e manutencao do codigo |
| Dev server / build | Vite | Desenvolvimento local e empacotamento |
| UI | Tailwind CSS | Estilizacao utilitaria |
| UI primitives | Radix UI | Componentes acessiveis de base |
| Estado remoto | React Query | Cache, sincronizacao e invalidacao |
| Estado de dominio | Store propria do Copiloto | Fluxo operacional das analises |
| Backend | Supabase Edge Functions | Analise server-side e endpoints do MVP |
| Banco / sessao | Supabase | Persistencia, auth e segredos |
| Deploy web | Cloudflare Workers | Publicacao do frontend |
| Provedor de IA | Anthropic / OpenAI / Gemini | Geracao da analise |

## Como essas tecnologias se encaixam

```text
Analista
  -> React / TanStack Start
  -> Store do Copiloto + React Query
  -> Supabase Edge Function
  -> Provedor de IA
  -> Resultado estruturado
  -> Decisao humana
```

## Onde isso aparece no repositorio

- `copiloto-amigo-main/package.json`: dependencias e scripts
- `copiloto-amigo-main/src/routes/`: telas e rotas
- `copiloto-amigo-main/src/lib/`: logica de negocio do frontend
- `copiloto-amigo-main/supabase/functions/`: backend do MVP
- `copiloto-amigo-main/docs/deploy-cloudflare.md`: deploy do frontend

## Ordem recomendada para estudar a stack

1. React + TanStack Start
2. TypeScript + Vite
3. Supabase + Edge Functions
4. Cloudflare Workers
5. Tailwind + Radix UI
6. Provedores de IA e normalizacao da resposta
7. React Query + runtime modes do projeto

## Artigos relacionados desta trilha

- `13-react-tanstack-start.md`
- `14-typescript-vite.md`
- `15-supabase-edge-functions.md`
- `16-cloudflare-workers.md`
- `17-tailwind-radix-ui.md`
- `18-llm-backend-providers.md`
- `19-react-query-store-runtime-modes.md`

## Pergunta que este artigo ajuda a responder

`Quais tecnologias compoem o MVP e por que cada uma delas esta aqui?`

## Fontes

- `README.md`
- `docs/technical-context-lite.md`
- `copiloto-amigo-main/package.json`

