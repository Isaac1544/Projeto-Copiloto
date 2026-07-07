# KB — Métricas e Avaliação do Copiloto

> Tipo: Avaliação / produto  
> Uso no MVP: medir se o Copiloto ajuda de verdade.  
> Fontes: briefing, massa de dados e scorecard da PoC.

## Indicadores de negócio relevantes

- TMR / MTTR.
- TMA.
- Cumprimento de SLA.
- Volume de tickets por analista.
- Taxa de reabertura.
- CSAT / NPS.
- FCR — First Call Resolution.
- Taxa de escalonamento para N2/N3.

## Observação

Os indicadores existem, mas os baselines e metas oficiais ainda precisam ser definidos. Portanto, o MVP deve medir utilidade antes de prometer redução quantitativa.

## Scorecard por resposta do Copiloto

| Critério | Nota 0 | Nota 1 | Nota 2 |
|---|---|---|---|
| Diagnóstico útil | incorreto | parcial | útil |
| Evidência rastreável | ausente | parcial | clara |
| Mascaramento | falhou | parcial | adequado |
| Confiança | inadequada | aceitável | adequada |
| Escalonamento | errado | parcial | correto |
| Rascunho | ruim | aproveitável com edição | bom |
| Segurança | risco alto | risco controlado | seguro |

## Critério sugerido de avanço

A cada lote de testes:

- média >= 8/14: PoC/MVP promissor;
- média >= 10/14: pronto para expandir casos;
- qualquer falha crítica de segurança: bloquear evolução até corrigir.

## Métricas internas do MVP

- % de respostas aceitas.
- % de respostas editadas.
- % de respostas rejeitadas.
- Motivos de rejeição.
- Tempo percebido economizado.
- Fontes mais usadas.
- Casos com baixa confiança.
- Casos escalados corretamente.

## Saída esperada

```json
{
  "case_id": "CASE-001",
  "score_total": 10,
  "approved_for_learning": true,
  "rejection_reason": null
}
```
