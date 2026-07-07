# KB — Histórico de Tickets Anonimizados

> Tipo: Histórico operacional / preparação para RAG  
> Uso no MVP: buscar casos parecidos e padrões de atendimento.  
> Fonte: `Massa de dados exportada_Maio.xlsx`.

## Objetivo

Esta KB define como a massa histórica de tickets deve ser tratada antes de entrar no MVP.

## Resumo da massa analisada

Total observado: **98 registros**.

### Tipos

| Tipo | Qtd. |
| --- | --- |
| Service Request | 57 |
| Incident | 41 |

### Categorias

| Categoria | Qtd. tickets |
| --- | --- |
| Nutanix | 33 |
| Outros | 33 |
| Não informado | 6 |
| Odoo | 4 |
| Fortinet | 3 |
| Commvault | 3 |
| Veeam | 3 |
| Exagrid | 3 |
| Sharepoint | 3 |
| Sentinel One | 2 |
| Windows | 2 |
| Arista | 1 |
| Monitor | 1 |
| Office 365 | 1 |

### Prioridades

| Prioridade | Qtd. |
| --- | --- |
| P3 | 49 |
| P4 | 32 |
| P2 | 10 |
| P1 | 7 |

### Subcategorias Nutanix

| Subcategoria Nutanix | Qtd. |
| --- | --- |
| Prism (Management) | 11 |
| LCM (Lifecycle Manager) | 7 |
| AOS | 5 |
| Hardware | 4 |
| AHV | 2 |
| Services (Files/Objects) | 1 |
| Data Protection | 1 |
| NKP (Kubernetes) | 1 |
| Não informado | 1 |

## Campos úteis para RAG

- Categoria.
- Subcategoria.
- Assunto.
- Descrição.
- Tipo.
- Prioridade.
- Urgência.
- Grupo.
- Nota de resolução.
- Tempo de primeira resposta.
- Tempo de resolução.
- SLA aplicado.
- Status de resolução.

## Campos que exigem mascaramento

- Empresa.
- E-mail do requisitante.
- Nome do requisitante.
- Localização do requisitante.
- IDs internos.
- Links internos.
- Telefones.
- IPs.
- Hostnames.
- Contratos.
- Qualquer dado pessoal ou topologia.

## Regra de qualidade

Não usar tickets crus diretamente no Claude.

Antes de indexar:

1. remover PII;
2. remover cliente/topologia identificável;
3. separar incidentes de requisições;
4. descartar tickets sem resolução útil;
5. marcar fonte, categoria, subcategoria, prioridade e grupo;
6. transformar em `caso resumido`;
7. revisar amostra humana.

## Template de caso anonimizado

```md
# Ticket Histórico Anonimizado — [ID interno mascarado]

## Categoria
[Nutanix / Fortinet / Veeam / etc.]

## Subcategoria
[Prism / LCM / AOS / etc.]

## Tipo
[Incident / Service Request]

## Sintoma
[Descrição resumida sem dados sensíveis]

## Evidências
[Logs sanitizados / prints tarjados / notas]

## Resolução
[Nota de resolução limpa]

## Escalonamento
[N1 / N2 / N3 / fornecedor]

## Lições aprendidas
[Como reutilizar no futuro]
```

## Uso no MVP

O Copiloto deve usar esta base para responder:

- “já houve caso parecido?”
- “qual resolução foi usada?”
- “é caso de N1 ou escalonamento?”
- “qual evidência falta?”
