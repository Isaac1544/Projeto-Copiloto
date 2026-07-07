# MVP KB Pack — Copiloto Clear IT

> Data de geração: 2026-07-06  
> Objetivo: adicionar ao Projeto Copiloto um conjunto de Bases de Conhecimento próprias para apoiar o planejamento e construção do MVP sem integração direta com FreshService.

## Fontes usadas

- `Gerenciamento de Incidentes com fluxograma.pdf`
- `Base de conhecimento exportada.xlsx`
- `Massa de dados exportada_Maio.xlsx`
- `Prints das telas de operação do analista no FreshService.pdf`
- `Caso de Uso_Alerta de Alto Uso de Disco em CVM.pdf`
- `Caso de Uso_ Falha no Cluster por Crash do Serviço Acropolis.pdf`
- `Projeto-Copiloto (5).zip`
- Links públicos citados no briefing: Freshservice API, Nutanix KB Portal e documentação Claude/Anthropic.

> Observação: links externos entram como referência, não como conteúdo garantido para RAG. Conteúdo protegido por login não deve ser raspado automaticamente.


## Direção do MVP

O MVP deve continuar sem integração ao FreshService no momento. O usuário/analista deve inserir manualmente ou importar de forma controlada o conteúdo de tickets/logs, passar por anonimização, consultar KB controlada e então usar Claude para gerar sugestão consultiva.

## Bases criadas

| Ordem | KB | Papel no MVP | Pasta |
|---|---|---|---|
| 1 | Processo de Gerenciamento de Incidentes | Regras de fluxo, papéis, priorização, N1/N2/N3, encerramento | `01-processo/` |
| 2 | Priorização Impacto x Urgência | Matriz P1–P5 e decisão de criticidade | `01-processo/` |
| 3 | Escalonamento N1/N2/N3 | Quando resolver, pedir dados, escalar ou acionar fornecedor | `01-processo/` |
| 4 | Operação FreshService | Modelo de tela/campos/fluxo sem integração | `02-operacao-freshservice/` |
| 5 | Padrão de Resposta ao Cliente | Estrutura de rascunhos revisáveis | `02-operacao-freshservice/` |
| 6 | Segurança, LGPD e Mascaramento | Pré-processamento obrigatório antes de IA | `03-seguranca/` |
| 7 | Nutanix Infraestrutura | Domínio técnico principal observado na KB e massa de tickets | `04-tecnica-nutanix/` |
| 8 | Prism/LCM/AOS/AHV/NKP | Subdomínios Nutanix úteis para classificação | `04-tecnica-nutanix/` |
| 9 | Hardware/Storage Nutanix | DIMM, disco, storage, CVM, data protection | `04-tecnica-nutanix/` |
| 10 | Caso CVM Alto Uso de Disco | Golden case resolvido | `05-casos-resolvidos/` |
| 11 | Caso Acropolis Crash | Golden case crítico | `05-casos-resolvidos/` |
| 12 | Histórico de Tickets Anonimizados | Modelo de preparo de massa histórica para RAG | `06-historico-tickets/` |
| 13 | Métricas e Avaliação do Copiloto | Scorecard para provar valor | `07-metricas/` |
| 14 | Fontes Externas e Fabricantes | Regras para uso controlado de Nutanix/vendor | `08-fontes-externas/` |
| 15 | Estratégia de Indexação RAG | Como organizar chunks, metadados e confiança | `09-rag/` |
| 16 | Runbooks MVP | Como transformar casos e artigos em runbooks seguros | `10-runbooks/` |

## Ordem recomendada de uso no MVP

1. `03-seguranca/kb-seguranca-lgpd-mascaramento.md`
2. `01-processo/kb-processo-gerenciamento-incidentes.md`
3. `01-processo/kb-escalonamento-n1-n2-n3.md`
4. `04-tecnica-nutanix/kb-nutanix-infraestrutura.md`
5. `05-casos-resolvidos/kb-caso-cvm-alto-uso-disco.md`
6. `05-casos-resolvidos/kb-caso-acropolis-crash.md`
7. `09-rag/kb-estrategia-indexacao-rag.md`
8. `07-metricas/kb-metricas-avaliacao-copiloto.md`

## Critérios para uma KB entrar no RAG

- Fonte identificada.
- Status conhecido: `Published`, `Draft`, `Aprovado`, `Pendente` ou `Externo`.
- Sem dados pessoais ou topologia identificável.
- Sem segredo, token ou credencial.
- Com indicação do nível onde é elegível: N1, N2, N3 ou fornecedor.
- Com recomendação de escalonamento quando a confiança for baixa.
- Com data/revisão quando disponível.
