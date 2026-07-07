# KB — Priorização por Impacto e Urgência

> Tipo: Processo / decisão  
> Uso no MVP: calcular prioridade sugerida e explicar criticidade.  
> Fonte principal: `Gerenciamento de Incidentes com fluxograma.pdf`.

## Objetivo

Esta KB orienta o Copiloto a sugerir prioridade inicial de incidente com base em impacto e urgência, sem substituir a validação humana.

## Impacto

- **Alto:** serviço crítico parado, muitos usuários impactados ou perda financeira imediata.
- **Médio:** departamento afetado ou impacto relevante, mas não crítico.
- **Baixo:** um único usuário ou impacto mínimo.

## Urgência

- **Alta:** precisa ser tratado imediatamente.
- **Média:** pode aguardar dentro do mesmo dia ou algumas horas.
- **Baixa:** pode ser agendado para dias ou semanas.

## Matriz de prioridade

| Impacto \ Urgência | Alta | Média | Baixa |
|---|---|---|---|
| Alto | P1 / Crítica | P2 / Alta | P3 / Média |
| Médio | P2 / Alta | P3 / Média | P4 / Baixa |
| Baixo | P3 / Média | P4 / Baixa | P5 / Planejada |

## Regras para o MVP

1. A prioridade sugerida deve ser explicável.
2. Se impacto ou urgência não forem inferíveis, pedir mais dados.
3. A prioridade sugerida não deve sobrescrever regra contratual.
4. Casos com indisponibilidade de VMs produtivas, cluster degradado ou risco operacional devem ser tratados com cautela e possível P1/P2.
5. Casos sem indisponibilidade imediata, mas com risco de degradação, podem ser média severidade, dependendo do ambiente.

## Exemplo de saída

```json
{
  "impact": "Médio",
  "urgency": "Média",
  "suggested_priority": "P3",
  "confidence": "Média",
  "reason": "há risco de degradação, mas não há indisponibilidade confirmada"
}
```

## Pendências

- Contratos podem divergir da matriz padrão.
- Baselines e SLAs reais não estão definidos nesta KB.
