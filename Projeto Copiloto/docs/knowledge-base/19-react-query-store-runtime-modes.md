---
title: "KB 19 — React Query, Store do Copiloto e Runtime Modes"
category: "Technology Reference"
source_type: "Codigo do repositorio + documentacao oficial"
confidence: "Alta"
status: "Ativo"
tags: ["react-query", "state-management", "runtime-mode", "public-session", "frontend"]
---

# KB 19 — React Query, Store do Copiloto e Runtime Modes

## Objetivo

Explicar a camada de estado do frontend, que e uma das partes mais importantes para entender o comportamento real do MVP.

## Pecas principais

### React Query

Ajuda com:

- cache de dados;
- invalidacao;
- sincronizacao de leituras;
- experiencia mais estavel na interface.

### Store do Copiloto

Arquivo principal:

- `copiloto-amigo-main/src/lib/copiloto-store.tsx`

Ela concentra a logica de negocio do frontend:

- criar analise;
- buscar historico;
- registrar decisao;
- reabrir decisao;
- escolher entre caminhos local, publico e conectado.

### Runtime Modes

Arquivo:

- `copiloto-amigo-main/src/lib/runtime-mode.ts`

Ele define como o app se comporta em funcao do ambiente.

## Modos de execucao

- Demonstracao
- Acesso publico
- Conectado

Esses modos influenciam:

- se o app depende de Supabase;
- se o login bloqueia ou nao;
- onde a analise e persistida;
- como o historico e recuperado.

## Sessao publica

Arquivo:

- `copiloto-amigo-main/src/lib/public-session.ts`

Esse arquivo cria um identificador de sessao publica no navegador, usado para:

- manter continuidade de uso;
- associar analises a uma mesma sessao;
- viabilizar historico sem login tradicional.

## Por que essa camada e tao importante

Muitos comportamentos que parecem "bug de IA" ou "bug de login" na verdade nascem aqui:

- caminho errado de execucao;
- analise indo para fallback local;
- historico vindo da sessao publica em vez do usuario autenticado;
- leitura de ambiente diferente da esperada.

## Como explicar para outra pessoa

`React Query cuida do cache e da sincronizacao. A store do Copiloto cuida da logica de negocio. Os runtime modes decidem se o sistema esta em demo, publico ou conectado.`

## O que estudar junto com este artigo

- `13-react-tanstack-start.md`
- `15-supabase-edge-functions.md`
- `outputs/guia_de_dominio_projeto_copiloto.md`

## Fontes oficiais recomendadas

- [TanStack Query](https://tanstack.com/query/latest)

