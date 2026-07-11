---
title: "KB 18 — Provedores de IA e Camada de Analise no Backend"
category: "AI Integration"
source_type: "Codigo do repositorio + documentacao oficial"
confidence: "Alta"
status: "Ativo"
tags: ["llm", "anthropic", "openai", "gemini", "prompt", "backend"]
---

# KB 18 — Provedores de IA e Camada de Analise no Backend

## Objetivo

Explicar como a IA entra no projeto e por que o backend foi preparado para suportar mais de um provedor.

## Papel da IA no Copiloto

A IA e usada para:

- interpretar o ticket;
- cruzar ticket com evidencias recuperadas;
- sugerir identificacao do problema;
- propor proximos passos;
- redigir uma resposta inicial ao cliente;
- explicitar confianca e alertas.

## Provedores suportados

O backend ja foi preparado para suportar:

- Anthropic
- OpenAI
- Gemini

A selecao e feita por:

- `LLM_PROVIDER`

## Onde isso mora no codigo

Arquivo principal:

- `copiloto-amigo-main/supabase/functions/analyze-ticket/index.ts`

Esse arquivo contem:

- selecao de provedor;
- construcao do prompt;
- schemas de resposta;
- sanitizacao;
- normalizacao;
- fallback controlado.

## Por que a IA roda no backend

A IA nao roda direto no navegador por quatro motivos principais:

1. proteger segredos;
2. mascarar dados antes do envio;
3. controlar provedor e modelo por configuracao;
4. normalizar a saida para a interface.

## O que e normalizacao da resposta

Cada provedor pode responder de maneira um pouco diferente. A camada de normalizacao existe para transformar isso em um formato unico do produto.

No resultado, isso vira campos como:

- sintese;
- identificacao do problema;
- sugestao de resolucao;
- resposta ao cliente;
- score de confianca;
- alertas.

## O que e fallback nesta camada

Fallback e a resposta alternativa quando o caminho principal de analise nao se comporta como esperado.

Ele existe para evitar quebrar completamente o uso do MVP, mas tambem pode reduzir a qualidade da resposta.

## Cuidados importantes

- IA nao substitui decisao humana;
- sem contexto bom, a resposta perde qualidade;
- sem base de conhecimento curada, a analise tende a ficar mais generica;
- se a configuracao do provedor estiver incompleta, o sistema pode degradar.

## Como explicar para outra pessoa

`O backend escolhe o provedor de IA, monta o prompt, aplica filtros de seguranca e transforma o retorno do modelo em uma sugestao padronizada para o analista.`

## Fontes oficiais recomendadas

- [Anthropic API](https://docs.anthropic.com/en/api/messages)
- [OpenAI API](https://platform.openai.com/docs/api-reference/responses)
- [Google Gemini API](https://ai.google.dev/gemini-api/docs/openai)

