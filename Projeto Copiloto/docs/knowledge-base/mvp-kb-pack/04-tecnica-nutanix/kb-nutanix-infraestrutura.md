# KB — Nutanix Infraestrutura

> Tipo: Técnica / domínio principal  
> Uso no MVP: classificar e recuperar evidências sobre incidentes Nutanix.  
> Fontes: `Base de conhecimento exportada.xlsx`, `Massa de dados exportada_Maio.xlsx`, casos de uso e projeto zipado.

## Por que Nutanix deve ser foco inicial

A massa de tickets de maio contém forte concentração em Nutanix, e a base exportada também possui maioria de artigos na pasta Nutanix.

### Distribuição observada na massa de tickets

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

### Subcategorias Nutanix observadas

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

## Artigos de KB relevantes exportados

| Pasta | Título | Status | Aprovação | Ticket associado |
| --- | --- | --- | --- | --- |
| Fortinet | Criação de VPN-IPSEC -  FORTIGATE - KB 33000052297 | Published |  |  |
| Nutanix | Nutanix - Server Not Reachable — KB-33000052092 | Published |  |  |
| Nutanix | Disk Space Usage High for /home/log/audit on PCVM XXX.XXX.XXX.XXX — KB 33000055061 | Draft |  |  |
| Manuais | Guia para abertura de chamados na Freshservice | Published |  | INC-939 |
| Juniper | Criação e Configuração de VLAN porta trunk no Juniper — KB-33000035867 | Published |  | MI-1139 |
| Veeam | Atualização do PostgreSQL — KB-33000037062 | Published |  |  |
| Veeam | Ativar 'Application-Aware Processing' — KB-33000045411 | Published |  | INC-1084 |
| Nutanix | Diagnóstico e Tratamento de Erro de Memória (DIMM RAS / hPPR) — KB-33000052573 | Draft |  |  |
| Nutanix | Configuração de SSH sem senha em cluster Nutanix — KB-33000053283 | Draft |  |  |
| Nutanix | LCM Connectivity Issue — KB-33000034773 | Published |  |  |
| Nutanix | Migrar OVS bridge br0 de um Virtual Switch no Nutanix — KB-33000034774 | Published |  |  |
| Nutanix | Apagar Orphan Snapshot — KB-33000034847 | Published |  | INC-1084 |
| Nutanix | Mudar Todas as Senhas SSH em um Cluster Nutanix — KB-33000034857 | Published |  |  |
| Nutanix | Criação do Cluster NKP no Nutanix — Passo a passo com explicações — KB-33000035503 | Published |  |  |
| Nutanix | Troubleshoot de Falhas Intermitentes na API e Erro 'Certificate has Expired' no NKP — KB-33000053125 | Draft |  |  |
| Nutanix | Renovação e Atualização de Certificados do Control Plane no NKP — KB-33000053128 | Published |  |  |
| Nutanix | Tasks Travadas (Stuck Tasks) no Nutanix — KB-33000053338 | Published |  |  |
| Nutanix | Desregistro (Unregister) de Cluster e Prism Central: Fluxos Padrão e Forçado — KB-33000053435 | Published | Approved |  |
| Nutanix | Remover Cluster da Blacklist para Registro no Prism Central - KB-33000053642 | Published | Approved |  |
| Nutanix | Procedimento de Recuperação Completa de Nó: Phoenix, CVM Ring e Metadata Store | Draft |  |  |
| Nutanix | Troubleshooting Prometheus Pod CrashLoop on PC 2024.x (CMSP WAL Corruption) -  KB-33000054045 | Published | Approved |  |
| Nutanix | Resolving 'Unhealthy' ClusterWorkflow Status Post-Service Recovery via mspctl — KB-33000054046 | Published | Approved |  |
| Nutanix | Restabelecimento do Módulo de Infraestrutura (pc.7.5.1.4) - KB-33000055268 | Published | Approved | INC-1324 |

## Agrupamentos técnicos sugeridos

### Prism / Management

Usar quando o ticket mencionar:

- Prism Central;
- Prism Element;
- autenticação;
- licenciamento;
- cluster registration;
- cluster unregister;
- console;
- gestão centralizada.

### LCM / Lifecycle Manager

Usar quando mencionar:

- inventory;
- atualização;
- pre-check;
- connectivity issue;
- update failure.

### AOS

Usar quando mencionar:

- cluster indisponível;
- Acropolis;
- task stuck;
- serviço em crash;
- bug de versão;
- upgrade.

### AHV

Usar quando mencionar:

- host;
- hypervisor;
- remoção de cluster;
- VM;
- console indisponível.

### Hardware / Storage

Usar quando mencionar:

- DIMM;
- memória;
- disco;
- CVM;
- /home;
- storage;
- data protection;
- snapshot.

### NKP / Kubernetes

Usar quando mencionar:

- NKP;
- Kommander;
- certificado expirado;
- pod;
- kubectl;
- cluster Kubernetes.

## Regras de uso no MVP

1. Não sugerir comando técnico sem evidência e revisão.
2. Não executar nada automaticamente.
3. Sempre indicar fonte da evidência.
4. Se o artigo estiver `Draft`, marcar confiança menor.
5. Se depender de fabricante, recomendar validação N2/N3.
6. Se houver impacto em cluster produtivo, tratar como risco alto.
7. Se houver baixa evidência, pedir mais dados.

## Saída esperada

```json
{
  "domain": "Nutanix",
  "subdomain": "AOS | Prism | LCM | AHV | Hardware | NKP | Storage",
  "evidence": ["KB-...", "caso de uso...", "ticket histórico..."],
  "confidence": "Alta | Média | Baixa",
  "recommendation": "triage_n1 | ask_more_data | escalate_n2 | vendor"
}
```
