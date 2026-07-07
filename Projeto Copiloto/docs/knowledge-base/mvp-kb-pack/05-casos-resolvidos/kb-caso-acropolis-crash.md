# KB — Caso Resolvido: Crash do Serviço Acropolis

> Tipo: Caso resolvido crítico / Golden case  
> Uso no MVP: teste e referência para incidentes críticos Nutanix/AOS/Acropolis.  
> Fonte: `Caso de Uso_ Falha no Cluster por Crash do Serviço Acropolis.pdf`.

## Resumo executivo

- **Problema:** nó do cluster Nutanix parou de responder e VMs ficaram indisponíveis.
- **Categoria:** Infraestrutura / Virtualização / Cluster Nutanix.
- **Severidade:** Crítica / Sev 1.
- **Impacto:** indisponibilidade de VMs críticas e impossibilidade de gerenciamento da infraestrutura virtual.
- **Causa raiz:** duplicidade de registro `memory_model` na tabela IDF após instabilidade de rede, causando crash loop do serviço Acropolis.
- **Solução aplicada no caso real:** script corretivo fornecido pela fabricante para saneamento da tabela IDF.
- **Prevenção:** upgrade para AOS 6.10.1.7 ou superior, ou AOS 7.0.

## Sinais de entrada

Associar a este caso quando houver:

- Acropolis;
- APLOS;
- cluster health degraded;
- crash loop;
- nó sem reportar métricas;
- CPU 0%;
- memória 0%;
- VM inacessível;
- console indisponível;
- `memory_model`;
- `2 == 1 failed`;
- IDF;
- instabilidade de rede antes do incidente.

## Diagnóstico provável

Possível falha do serviço Acropolis por inconsistência interna em registros de `memory_model`, com impacto em cluster/hosts/VMs.

## Recomendação segura

- Tratar como caso crítico.
- Coletar evidências mínimas.
- Validar impacto em VMs e cluster.
- Consultar KB/fabricante.
- Escalar para N2/N3/fabricante.
- Não executar script corretivo sem validação especializada.

## Rascunho revisável

```text
Olá,

Recebemos o chamado e identificamos sinais compatíveis com falha crítica em componente de cluster Nutanix, possivelmente associada ao serviço Acropolis.

Como há risco de impacto em VMs e gerenciamento do cluster, recomendamos validação técnica especializada antes de qualquer ação corretiva.

Próximos passos:
- coletar logs e evidências do cluster;
- validar saúde do nó afetado;
- verificar histórico de instabilidade de rede;
- acionar equipe N2/N3 ou fabricante, conforme necessidade.

Esta resposta é um rascunho e deve ser revisada pelo analista responsável antes do envio.
```

## Nível de confiança

- **Alta:** há logs com `memory_model`, `2 == 1 failed`, crash loop e impacto confirmado.
- **Média:** há Acropolis/cluster degradado, mas faltam logs.
- **Baixa:** relato genérico de cluster sem evidência.

## Regra de escalonamento

Este caso normalmente deve recomendar escalonamento porque envolve cluster, VMs e possível intervenção de fabricante.
