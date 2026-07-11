---
title: "KB 17 — Tailwind CSS e Radix UI no Copiloto"
category: "Technology Reference"
source_type: "Codigo do repositorio + documentacao oficial"
confidence: "Alta"
status: "Ativo"
tags: ["tailwind", "radix-ui", "design-system", "ui", "frontend"]
---

# KB 17 — Tailwind CSS e Radix UI no Copiloto

## Objetivo

Explicar como a camada visual do MVP foi montada e qual e o papel de Tailwind CSS e Radix UI.

## O que e Tailwind CSS

Tailwind CSS e a base de estilizacao do projeto. Ele permite escrever estilos com classes utilitarias, acelerando:

- criacao de layout;
- espacamento;
- tipografia;
- cores;
- estados visuais.

## O que e Radix UI

Radix UI fornece primitives acessiveis de componentes como:

- dialog;
- select;
- tabs;
- accordion;
- tooltip;
- popover.

No projeto, ele ajuda a construir uma UI mais consistente sem reinventar comportamento de componente toda vez.

## Por que essa combinacao faz sentido

Para um MVP, essa dupla entrega:

- velocidade de interface;
- boa base de acessibilidade;
- menor custo de implementacao;
- facilidade de ajustar a aparencia depois.

## Onde isso aparece no projeto

- dependencias em `copiloto-amigo-main/package.json`
- componentes da interface em `src/components/` e rotas do app

## Como usar isso com seguranca no projeto

- manter padrao visual existente;
- evitar criar estilos soltos sem necessidade;
- preferir reutilizar componentes em vez de duplicar estrutura;
- tratar alteracoes visuais junto com comportamento quando a tela depende de estado do copiloto.

## Riscos e cuidados

- uma interface bonita nao corrige problemas de dominio;
- alterar muito a UI sem entender a store pode quebrar fluxo;
- misturar logica de negocio demais dentro do componente visual piora manutencao.

## Como explicar para outra pessoa

`Tailwind acelera a construcao visual. Radix fornece a base de componentes acessiveis e mais solidos para a interface do MVP.`

## Fontes oficiais recomendadas

- [Tailwind CSS](https://tailwindcss.com/docs)
- [Radix UI Primitives](https://www.radix-ui.com/primitives/docs/overview/introduction)

