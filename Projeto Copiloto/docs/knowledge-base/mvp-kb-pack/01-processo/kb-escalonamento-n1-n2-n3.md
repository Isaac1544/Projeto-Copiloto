# KB — Escalonamento N1 / N2 / N3 / Fornecedor

> Tipo: Processo / decisão  
> Uso no MVP: decidir quando resolver em N1, pedir mais dados, escalar para N2/N3 ou acionar fornecedor.  
> Fontes: processo de incidentes, briefing, prints FreshService e casos de uso.

## Objetivo

Ajudar o Copiloto a recomendar o próximo encaminhamento sem automatizar ações no FreshService.

## Quando o N1 pode seguir

O N1 pode seguir quando:

- há erro conhecido;
- existe solução documentada na KB;
- a solução é elegível ao primeiro nível;
- risco é baixo ou controlado;
- não há necessidade de mudança emergencial;
- evidências são suficientes;
- o procedimento não exige fabricante.

## Quando pedir mais dados

Pedir mais dados quando:

- log está incompleto;
- não há horário da ocorrência;
- não há serviço afetado;
- não há evidência técnica;
- o cliente relata “erro genérico”;
- não há print, código, evento ou componente afetado;
- não é possível diferenciar incidente de requisição.

## Quando escalar para N2

Escalar para N2 quando:

- N1 não encontra workaround documentado;
- há necessidade de diagnóstico técnico especializado;
- há risco de impacto relevante;
- há dúvida de categorização/prioridade;
- a solução exige alteração técnica controlada;
- há possível problema de cluster, storage, backup ou rede.

## Quando escalar para N3 / fabricante

Escalar para N3/fabricante quando:

- o incidente envolve bug ou comportamento de produto;
- há script corretivo de fabricante;
- o procedimento exige suporte especializado;
- há instabilidade crítica de cluster;
- há necessidade de confirmação de causa raiz pelo vendor;
- o caso depende de KB protegida/autorizada.

## Regras anti-alucinação

- Não afirmar que escalou no FreshService.
- Não afirmar que abriu chamado no fabricante.
- Não sugerir comando ou script sem revisão humana.
- Não inventar KB externa.
- Não usar conteúdo de fabricante protegido por login como se estivesse disponível.

## Saída esperada

```json
{
  "route": "n1 | ask_more_data | n2 | n3_vendor",
  "reason": "motivo baseado em evidência",
  "confidence": "Alta | Média | Baixa",
  "human_review_required": true
}
```
