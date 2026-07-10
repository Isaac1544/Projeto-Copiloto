# Modelo de Domínio do MVP — Copiloto L1

> Versão: v2.0  
> Data: 2026-07-10  
> Objetivo: alinhar UI, backend, banco e KB ao mesmo vocabulário

## 1. Entidades principais

### Ticket de entrada

Representa o chamado informado pelo analista.

Campos canônicos atuais:

- `title`
- `description`
- `category`
- `priority`
- `additionalContext`

Observação:

- a interface já captura sinais mais ricos;
- parte deles ainda é compactada para esse contrato canônico.

### Análise do Copiloto

Resultado estruturado da `analyze-ticket`.

Campos principais:

- `summary`
- `probableCause`
- `recommendedSteps`
- `suggestedResponse`
- `confidenceScore`
- `confidenceLevel`
- `safetyAlerts`
- `sources`
- `sanitization`

### Decisão humana

Representa a ação final do analista sobre a sugestão.

Estados esperados:

- aceita
- editada
- rejeitada

### Evidência

Fonte curada usada para sustentar a análise.

Campos mínimos:

- título
- referência
- tipo da fonte

## 2. Regra de separação conceitual

O modelo precisa distinguir quatro coisas:

1. fato observado
2. hipótese ou identificação do problema
3. sugestão de resolução
4. decisão humana

Essa separação já aparece na tela de resultado e precisa continuar refletida no backend e na persistência.

## 3. Divergência atual

Hoje existe uma diferença entre:

- modelo mais rico da interface;
- contrato simplificado do backend;
- schema atual de persistência.

Isso não bloqueia o MVP, mas é uma dívida técnica real.

## 4. Direção recomendada

### Curto prazo

- manter o contrato atual estável;
- continuar usando `additionalContext` como apoio para sinais mais ricos;
- preservar a separação visual e lógica entre blocos da análise.

### Próximo passo

Expandir o modelo persistido para refletir explicitamente:

- domínio do serviço
- tipo de registro
- plataforma
- subdomínio
- prioridade operacional

## 5. Estados operacionais

Uma análise do MVP pode passar por:

1. criada
2. analisada
3. decidida

E a decisão humana pode ser:

1. aceita
2. editada
3. rejeitada

## 6. Regra de domínio central

A IA nunca fecha o caso sozinha.

O produto só fica coerente com o domínio real se:

- a análise for tratada como sugestão;
- a resposta ao cliente for tratada como rascunho;
- a decisão final for sempre humana e rastreável.
