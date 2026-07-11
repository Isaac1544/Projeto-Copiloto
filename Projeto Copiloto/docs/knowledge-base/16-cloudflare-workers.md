---
title: "KB 16 — Cloudflare Workers no Copiloto"
category: "Technology Reference"
source_type: "Codigo do repositorio + documentacao oficial"
confidence: "Alta"
status: "Ativo"
tags: ["cloudflare", "workers", "deploy", "frontend", "wrangler"]
---

# KB 16 — Cloudflare Workers no Copiloto

## Objetivo

Explicar por que o frontend do MVP foi publicado em Cloudflare Workers e o que isso significa na pratica.

## Papel do Cloudflare no projeto

O Cloudflare esta sendo usado como camada de deploy do frontend publico.

Isso entrega:

- uma URL externa acessivel;
- deploy rapido;
- validacao do MVP por outras pessoas;
- separacao entre publicacao web e backend de IA.

## O que esta publicado

O deploy publico conhecido do MVP esta em:

- [https://isaac1544-projeto-copiloto.copilotoisaac.workers.dev](https://isaac1544-projeto-copiloto.copilotoisaac.workers.dev)

## O que e importante entender

Cloudflare Workers, neste contexto, nao substitui o backend do Supabase.

A separacao correta e:

- Cloudflare publica o frontend;
- Supabase executa a analise e persiste dados.

## Como o deploy funciona

Fluxo simplificado:

1. build do app com TanStack Start / Nitro;
2. geracao da saida de producao;
3. deploy via Wrangler.

Documento relacionado:

- `copiloto-amigo-main/docs/deploy-cloudflare.md`

## Comandos mais comuns

```bash
pnpm build
pnpm dlx wrangler deploy --config .output/server/wrangler.json
```

## Cuidados praticos

- mudar variavel `VITE_*` exige novo build;
- deploy do frontend nao atualiza automaticamente a Edge Function;
- link publico funcional nao garante que a IA esteja bem configurada;
- um resultado pode nao existir mesmo com o site no ar.

## Como explicar para outra pessoa

`O Cloudflare e a camada de publicacao do frontend. Ele deixa o MVP acessivel pela web, mas a inteligencia do backend continua no Supabase.`

## Fontes oficiais recomendadas

- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/)

