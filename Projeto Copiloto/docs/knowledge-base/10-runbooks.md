---
title: "KB 10 — Runbooks"
category: "Operations"
source_type: "Template + boas práticas"
confidence: "Baixa como conteúdo operacional; Alta como modelo"
status: "Modelo inicial"
tags: ["runbook", "procedimento", "operação", "L1", "L2"]
---

# KB 10 — Runbooks

## Objetivo

Definir um modelo de runbook para procedimentos operacionais que poderão ser usados pelo Copiloto.

## Importante

Este documento não representa procedimentos reais da Clear IT. Ele fornece uma estrutura para futura validação.

## Estrutura recomendada

```markdown
# Nome do Runbook

## Objetivo

## Quando usar

## Quando não usar

## Pré-requisitos

## Dados necessários

## Passos

## Validação

## Rollback

## Riscos

## Critérios de escalonamento

## Fontes
```

## Exemplo ilustrativo

> Exemplo genérico, não operacional.

```markdown
# Reinício controlado de serviço

## Quando usar
Quando houver evidência de falha em um serviço específico e autorização operacional.

## Pré-requisitos
- Identificar o serviço.
- Confirmar janela ou permissão.
- Registrar evidências.

## Passos
1. Verificar status.
2. Registrar evidência.
3. Reiniciar serviço conforme procedimento aprovado.
4. Validar retorno.

## Rollback
Escalar para L2/L3 se o serviço não retornar.

## Observação
Procedimentos reais dependem de validação interna.
```

## Relação com o Copiloto

O Copiloto pode sugerir um runbook aplicável, mas não deve executar ações automaticamente.
