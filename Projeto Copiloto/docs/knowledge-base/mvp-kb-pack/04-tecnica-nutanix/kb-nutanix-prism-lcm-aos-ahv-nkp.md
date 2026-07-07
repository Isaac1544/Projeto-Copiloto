# KB — Nutanix Prism, LCM, AOS, AHV e NKP

> Tipo: Técnica / taxonomia  
> Uso no MVP: classificar incidentes Nutanix por subdomínio e recuperar evidências corretas.

## Objetivo

Organizar a terminologia Nutanix mais recorrente para o Copiloto classificar tickets e logs.

## Prism

Termos relacionados:

- Prism Central;
- Prism Element;
- licenciamento;
- registro/desregistro de cluster;
- autenticação;
- console;
- gestão centralizada.

Sinais de ticket:

- “não consigo autenticar o Nutanix pelo browser”;
- “falha ao adicionar cluster ao Prism Central”;
- “retirada do Prism Central”;
- “dúvida sobre licenciamento”.

## LCM

Termos relacionados:

- Lifecycle Manager;
- inventory;
- pre-check;
- connectivity issue;
- update failure.

Sinais de ticket:

- “falha na execução do Inventory LCM”;
- “falha durante atualização”;
- “LCM Pre-check Failure”.

## AOS / Acropolis

Termos relacionados:

- AOS;
- Acropolis;
- APLOS;
- crash loop;
- clusterWorkflow;
- service recovery;
- task stuck.

Sinais de ticket:

- “cluster indisponível”;
- “task stuck”;
- “serviço Acropolis em crash”;
- “ClusterWorkflow unhealthy”.

## AHV

Termos relacionados:

- hypervisor;
- host;
- VM;
- console;
- remoção de cluster.

Sinais de ticket:

- “host preso no processo de remoção”;
- “VM inacessível”;
- “console indisponível”.

## NKP / Kubernetes

Termos relacionados:

- NKP;
- Kommander;
- kubectl;
- certificado;
- pod CrashLoop;
- control plane.

Sinais de ticket:

- “problemas no NKP”;
- “certificate has expired”;
- “kubectl describe”;
- “Prometheus Pod CrashLoop”.

## Regra de confiança

- Se houver artigo published e evidência clara: confiança alta.
- Se houver artigo draft ou evidência parcial: confiança média.
- Se houver apenas termo genérico sem log: confiança baixa.
