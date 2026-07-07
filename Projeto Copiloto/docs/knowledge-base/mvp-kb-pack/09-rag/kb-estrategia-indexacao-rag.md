# KB — Estratégia de Indexação RAG para o MVP

> Tipo: Engenharia de conhecimento  
> Uso no MVP: orientar como transformar documentos em chunks recuperáveis.

## Objetivo

Definir um modelo simples e seguro para indexar conhecimento no MVP.

## Princípios

1. Cada chunk deve ter fonte.
2. Cada chunk deve ter tipo.
3. Cada chunk deve ter nível de confiança.
4. Cada chunk deve indicar elegibilidade: N1, N2, N3 ou fornecedor.
5. Chunks com dados sensíveis não entram.
6. Chunks `Draft` entram com confiança menor ou ficam fora até validação.
7. Saída do Copiloto sempre deve citar evidência.

## Tipos de documento

| Tipo | Exemplo | Confiança inicial |
|---|---|---|
| Processo | Gerenciamento de Incidentes | Alta |
| Artigo publicado | KB interna Published | Alta |
| Artigo draft | KB interna Draft | Média/Baixa |
| Caso resolvido | CVM / Acropolis | Alta se validado |
| Ticket histórico | Ticket anonimizado | Média |
| Print de tela | FreshService tarjado | Média |
| Fonte externa | Nutanix/Freshservice Docs | Referencial |

## Metadados mínimos

```json
{
  "doc_id": "kb-caso-cvm-alto-uso-disco",
  "title": "Caso CVM Alto Uso de Disco",
  "source_file": "Caso de Uso_Alerta de Alto Uso de Disco em CVM.pdf",
  "source_type": "resolved_case",
  "status": "validated | draft | pending",
  "domain": "Nutanix",
  "subdomain": "CVM / Storage",
  "eligible_level": "N1 | N2 | N3 | vendor",
  "sensitive_data": false,
  "last_review": "YYYY-MM-DD"
}
```

## Estratégia de chunking

### Processo

Chunks por etapa:

- conceito de incidente;
- entradas;
- papéis;
- priorização;
- fluxo N1;
- fluxo N2/N3;
- comunicação;
- indicadores.

### Artigos técnicos

Chunks por seção:

- sintoma;
- causa provável;
- evidência;
- procedimento;
- risco;
- escalonamento;
- prevenção.

### Tickets históricos

Chunks resumidos:

- sintoma;
- evidência;
- resolução;
- grupo responsável;
- escalonamento;
- resultado.

## Ranking sugerido

Priorizar:

1. caso resolvido validado;
2. artigo publicado;
3. processo oficial;
4. ticket histórico anonimizado;
5. fonte externa referencial;
6. artigo draft.

## Regra de resposta

Se a melhor evidência tiver baixa confiança, o Copiloto deve pedir mais dados ou recomendar escalonamento.
