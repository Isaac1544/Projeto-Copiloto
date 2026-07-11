---
title: "KB 14 — TypeScript e Vite no Copiloto"
category: "Technology Reference"
source_type: "Codigo do repositorio + documentacao oficial"
confidence: "Alta"
status: "Ativo"
tags: ["typescript", "vite", "build", "dev-server", "frontend"]
---

# KB 14 — TypeScript e Vite no Copiloto

## Objetivo

Explicar como TypeScript e Vite sustentam a experiencia de desenvolvimento e build do MVP.

## O que e TypeScript

TypeScript e a linguagem principal do projeto. Ele adiciona tipagem sobre JavaScript e ajuda a:

- reduzir erros de manutencao;
- deixar contratos mais claros;
- melhorar refatoracao;
- tornar a integracao frontend/backend mais segura.

## O que e Vite

Vite e o dev server e bundler do projeto. Ele e usado para:

- subir o ambiente local rapidamente;
- empacotar o app para producao;
- suportar o fluxo de `pnpm dev` e `pnpm build`.

## Onde isso aparece no projeto

- `copiloto-amigo-main/package.json`
- arquivos `.ts` e `.tsx` em `src/`
- scripts:
  - `pnpm dev`
  - `pnpm build`
  - `pnpm run verify:mvp`

## Por que isso faz sentido no MVP

TypeScript ajuda porque o projeto tem:

- varios modos de execucao;
- objetos de analise com estrutura definida;
- integracao entre frontend, backend e persistencia.

Vite ajuda porque o objetivo do MVP foi ganhar velocidade sem complicar demais o ambiente de desenvolvimento.

## Conceitos que merecem atencao

### Tipagem de contrato

O arquivo `src/lib/analyze-ticket-contract.ts` e um bom exemplo de como a tipagem ajuda a alinhar entrada e saida da analise.

### Build

O que roda localmente no `dev` nao e exatamente o mesmo processo do deploy. O deploy gera saida para Cloudflare.

### Variaveis `VITE_*`

Tudo o que o frontend precisa ler em runtime no build entra nesse grupo de variaveis.

## Riscos e cuidados

- se as tipagens se afastarem do modelo real do banco ou da UI, a manutencao fica confusa;
- se o build for gerado sem as variaveis corretas, o comportamento do modo de execucao pode mudar;
- o warning sobre `vite-tsconfig-paths` e um aviso tecnico de evolucao, nao necessariamente um bloqueio funcional.

## Como explicar para outra pessoa

`TypeScript ajuda a manter o codigo seguro e previsivel. Vite ajuda a rodar e empacotar o frontend com rapidez para desenvolvimento e deploy.`

## Fontes oficiais recomendadas

- [TypeScript](https://www.typescriptlang.org/docs/)
- [Vite](https://vite.dev/guide/)

