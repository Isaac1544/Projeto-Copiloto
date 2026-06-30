---
title: "KB 07 — Source Map"
category: "Governance"
source_type: "Rastreabilidade"
confidence: "Alta para o método; variável por item"
status: "Inicial"
tags: ["rastreabilidade", "fontes", "governança", "anti-alucinação"]
---

# KB 07 — Source Map

## Objetivo

Registrar a origem das informações usadas no projeto para reduzir risco de alucinação e facilitar auditoria.

## Matriz inicial de fontes

| Informação | Fonte | Confiança | Observação |
|---|---|---:|---|
| O desafio envolve um Copiloto para analistas L1 | Briefing Desafio B | Alta | Informação central do PDF |
| O Copiloto deve interpretar logs | Briefing Desafio B | Alta | Requisito explícito |
| O Copiloto deve gerar rascunhos de resposta | Briefing Desafio B | Alta | Requisito explícito |
| O uso da IA deve ser consultivo | Briefing Desafio B | Alta | Restrição explícita |
| Dados sensíveis devem ser anonimizados | Briefing Desafio B | Alta | Restrição explícita |
| FreshService oferece recursos ITSM | Documentação Freshworks/Freshservice | Alta | Validar versão/plano no projeto |
| FreshService possui APIs | Documentação de API Freshservice | Alta | A integração produtiva depende de acesso |
| ITIL orienta práticas como incidente, problema e mudança | Fontes ITSM/ITIL públicas | Média | Usar como referência conceitual |
| Processo interno detalhado da Clear IT | Não disponível | Não assumir | Exigir validação com a empresa |
| Tickets reais da Clear IT | Não disponível | Não assumir | Usar apenas se fornecidos e anonimizados |
| Runbooks internos da Clear IT | Não disponível | Não assumir | Criar templates, não procedimentos reais |

## Regras de uso

- Informação sem fonte não deve virar fato.
- Informação pública deve ser marcada como pública.
- Informação inferida deve ser marcada como hipótese.
- Processos internos só devem ser documentados como reais após validação.

## Fontes públicas consultáveis

- Site institucional da Clear IT.
- Documentação oficial do Freshservice.
- Documentação Freshservice API.
- Materiais públicos de ITSM/ITIL.
- Documentações oficiais dos fabricantes relevantes.
