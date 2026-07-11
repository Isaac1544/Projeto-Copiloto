---
title: "KB 13 — React e TanStack Start no Copiloto"
category: "Technology Reference"
source_type: "Codigo do repositorio + documentacao oficial"
confidence: "Alta"
status: "Ativo"
tags: ["react", "tanstack-start", "frontend", "routing", "ui"]
---

# KB 13 — React e TanStack Start no Copiloto

## Objetivo

Explicar por que React e TanStack Start foram usados no MVP e como eles aparecem na implementacao real do projeto.

## O que e React

React e a biblioteca usada para construir a interface do usuario. No projeto, ele sustenta:

- formularios;
- dashboard;
- tela de resultado;
- historico;
- componentes reutilizaveis da interface.

## O que e TanStack Start

TanStack Start e o framework de aplicacao usado por cima do React. Ele ajuda a organizar:

- rotas;
- estrutura do app;
- rendering;
- build para deploy.

No MVP, ele e a base que permite ter uma aplicacao web mais organizada do que um frontend React solto.

## Papel dessas tecnologias no Copiloto

No projeto, React e TanStack Start fazem o trabalho de:

- receber os dados do chamado;
- controlar navegacao entre telas;
- renderizar a analise do copiloto;
- suportar o fluxo entre dashboard, novo atendimento, resultado e historico.

## Onde aparecem no repositorio

- `copiloto-amigo-main/src/routes/_authenticated/index.tsx`
- `copiloto-amigo-main/src/routes/_authenticated/novo-atendimento.tsx`
- `copiloto-amigo-main/src/routes/_authenticated/resultado.$id.tsx`
- `copiloto-amigo-main/src/routes/_authenticated/historico.tsx`
- `copiloto-amigo-main/src/routes/auth.tsx`

## Conceitos que voce precisa entender

### Rotas

Cada tela principal do app e representada por um arquivo de rota.

### Componentizacao

A UI e dividida em partes reutilizaveis para manter consistencia e reduzir repeticao.

### Estado reativo

Quando o ticket muda, ou quando a analise termina, a interface reage e atualiza a tela.

## O que isso resolve no MVP

Essas tecnologias permitem:

- velocidade de desenvolvimento;
- separacao melhor entre telas e logica;
- manutencao mais simples;
- deploy compativel com o modelo atual do projeto.

## Limites e cuidados

- React por si so nao resolve dominio de negocio; por isso a store do Copiloto e tao importante.
- Se a logica de negocio for parar demais dentro das telas, o projeto fica dificil de manter.
- O app tem modos diferentes de execucao, entao nem todo problema aparente vem da UI.

## Como explicar para outra pessoa

`React cuida da interface. TanStack Start organiza a aplicacao, as rotas e a forma como ela sobe e e publicada.`

## O que estudar depois deste artigo

- `19-react-query-store-runtime-modes.md`
- `outputs/guia_de_dominio_projeto_copiloto.md`

## Fontes oficiais recomendadas

- [React](https://react.dev/)
- [TanStack Start](https://tanstack.com/start/latest)

