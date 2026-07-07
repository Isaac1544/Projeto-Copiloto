# KB — Runbooks Seguros para o MVP

> Tipo: Runbook / execução controlada  
> Uso no MVP: transformar conhecimento técnico em próximos passos revisáveis.

## Objetivo

Definir como o MVP deve apresentar runbooks sem executar ações automaticamente.

## Regra central

O Copiloto nunca executa comandos. Ele pode sugerir próximos passos revisáveis, com evidência e nível de risco.

## Template de runbook

```md
# Runbook — [Nome]

## Quando usar
[Sinais e condições]

## Quando não usar
[Contraindicações]

## Evidências mínimas
[Logs, prints, métricas]

## Risco
[Baixo/Médio/Alto]

## Nível elegível
[N1/N2/N3/Fornecedor]

## Passos recomendados
1. [Coleta de evidência]
2. [Validação]
3. [Consulta de KB]
4. [Escalonamento se necessário]

## Mensagem ao cliente
[Rascunho revisável]

## Auditoria
[O que registrar]
```

## Runbook candidato — CVM alto uso de disco

- Nível: N1/N2 conforme política.
- Risco: médio.
- Evidências mínimas: partição, percentual, CVM afetada, impacto.
- Próximo passo: consultar KB aprovada antes de qualquer limpeza.
- Escalonar se: filesystem próximo de 100%, impacto em cluster, falta de KB aprovada.

## Runbook candidato — Acropolis crash

- Nível: N2/N3/Fornecedor.
- Risco: alto.
- Evidências mínimas: logs, status de cluster, VMs impactadas, mensagens de erro.
- Próximo passo: coletar evidências e escalar.
- Escalonar se: cluster degradado, VM indisponível, crash loop, falha recorrente.

## Guardrails

- Comando só aparece se fonte for aprovada.
- Script de fabricante exige validação humana.
- Dados sensíveis devem estar mascarados.
- Em dúvida, pedir mais dados.
