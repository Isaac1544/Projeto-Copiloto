---
title: "KB 15 — Supabase e Edge Functions no Copiloto"
category: "Technology Reference"
source_type: "Codigo do repositorio + documentacao oficial"
confidence: "Alta"
status: "Ativo"
tags: ["supabase", "edge-functions", "backend", "auth", "database"]
---

# KB 15 — Supabase e Edge Functions no Copiloto

## Objetivo

Explicar o papel do Supabase no MVP e por que ele e uma das pecas mais importantes da arquitetura.

## O que o Supabase faz neste projeto

No Copiloto, o Supabase cumpre varios papeis ao mesmo tempo:

- backend server-side;
- armazenamento de segredos;
- persistencia de dados;
- autenticacao, quando o modo conectado e usado;
- ponto seguro para chamar o provedor de IA.

## O que sao Edge Functions

Edge Functions sao funcoes server-side usadas para executar logica de backend sem expor segredos ao navegador.

No projeto, elas sao usadas para:

- receber o ticket;
- sanitizar dados;
- buscar evidencias;
- chamar o provedor de IA;
- devolver resposta estruturada ao frontend.

## Funcoes principais do projeto

### `analyze-ticket`

Arquivo:

- `copiloto-amigo-main/supabase/functions/analyze-ticket/index.ts`

Responsabilidade:

- motor principal da analise do chamado.

### `public-analyses`

Arquivo:

- `copiloto-amigo-main/supabase/functions/public-analyses/index.ts`

Responsabilidade:

- dar suporte ao modo publico do MVP.

## Por que o Supabase faz sentido aqui

Ele foi uma boa escolha para o MVP porque concentra:

- autenticacao;
- banco;
- segredos;
- funcoes;
- integracao relativamente rapida.

Isso reduz o custo de montar um backend do zero.

## Variaveis e segredos que importam

No frontend:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

No backend:

- `LLM_PROVIDER`
- `ALLOW_MOCK_ANALYSIS`
- chaves e modelos do provedor escolhido

## Onde investigar problemas

Se a analise nao estiver vindo como esperado, vale olhar:

- `src/lib/analyze-ticket.ts`
- `src/lib/public-analyses.ts`
- `supabase/functions/analyze-ticket/index.ts`
- `supabase/functions/public-analyses/index.ts`

## Riscos e cuidados

- se os secrets nao estiverem corretos, a IA pode nao responder;
- se o projeto estiver em modo publico, o fluxo sem login precisa ser entendido antes de concluir que a auth esta quebrada;
- se a funcao estiver deployada mas mal configurada, o frontend pode parecer funcional, mas a qualidade da analise cair.

## Como explicar para outra pessoa

`O Supabase e o backend operacional do MVP. Ele guarda segredos, hospeda as funcoes de analise e faz a ponte segura entre o frontend e a IA.`

## Fontes oficiais recomendadas

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)

