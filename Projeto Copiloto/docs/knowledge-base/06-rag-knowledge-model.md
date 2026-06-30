---
title: "KB 06 — Modelo de Conhecimento para RAG"
category: "AI Architecture"
source_type: "Boas práticas de IA + requisitos do desafio"
confidence: "Média"
status: "Blueprint conceitual"
tags: ["RAG", "LLM", "retrieval", "knowledge-base", "IA"]
---

# KB 06 — Modelo de Conhecimento para RAG

## Objetivo

Descrever como a Knowledge Base poderá ser usada por um Copiloto de IA baseado em RAG (*Retrieval-Augmented Generation*).

## Definição

RAG é uma arquitetura em que a IA recupera documentos relevantes antes de gerar uma resposta. Isso reduz dependência de memória do modelo e ajuda a fundamentar as recomendações em fontes controladas.

## Fluxo conceitual

```text
Ticket + logs
    ↓
Anonimização
    ↓
Extração de termos técnicos
    ↓
Busca semântica e/ou textual
    ↓
Recuperação de documentos relevantes
    ↓
Geração de diagnóstico e resposta
    ↓
Analista revisa e decide
```

## Tipos de documentos indexáveis

- Artigos de solução.
- Tickets históricos anonimizados.
- Runbooks.
- Glossário técnico.
- Documentação de fabricantes resumida.
- Regras de atendimento.
- Procedimentos internos validados.

## Metadados recomendados

```yaml
title:
category:
source:
confidence:
last_review:
owner:
tags:
systems:
severity:
applicability:
```

## Estratégia de chunking

Os documentos devem ser quebrados em blocos pequenos, mas semanticamente completos.

Exemplo de blocos úteis:

- sintomas;
- possíveis causas;
- diagnóstico;
- solução;
- validação;
- rollback;
- referências.

## Critérios de confiança

| Confiança | Critério |
|---|---|
| Alta | Documento oficial, KB interna validada ou ticket real anonimizado |
| Média | Boa prática técnica ou documentação pública resumida |
| Baixa | Hipótese de projeto ou exemplo ilustrativo |

## Como evitar alucinação

O Copiloto deve:

- responder apenas com base em fontes recuperadas quando o assunto for operacional;
- indicar quando não houver evidência suficiente;
- solicitar mais dados quando o log estiver incompleto;
- separar fatos, hipóteses e recomendações;
- citar a origem da recomendação sempre que possível.

## Saída esperada do Copiloto

```text
Diagnóstico provável:
...

Evidências encontradas:
...

Fonte consultada:
...

Confiança:
Alta / Média / Baixa

Próximos passos:
...

Rascunho de resposta:
...
```

## Aplicação no projeto

Este modelo conecta o Business Context do Desafio B à futura implementação técnica do copiloto.

## Pontos para validação futura

- Ferramenta de embeddings.
- Banco vetorial.
- Política de retenção de dados.
- Campos sensíveis a anonimizar.
- Critérios formais de confiança.
