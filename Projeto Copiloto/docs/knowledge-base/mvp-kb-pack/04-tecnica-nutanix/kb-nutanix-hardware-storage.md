# KB — Nutanix Hardware, Storage, CVM e Data Protection

> Tipo: Técnica / subdomínio  
> Uso no MVP: orientar classificação de incidentes de disco, memória, storage e proteção de dados.

## Objetivo

Apoiar o Copiloto em casos que envolvam saúde física/lógica do cluster, armazenamento, disco e CVM.

## Sinais técnicos

### Disco / CVM

- uso de `/home`;
- uso de `/home/log/audit`;
- filesystem acima de threshold;
- alerta de disco;
- CVM;
- lentidão em serviços de gerenciamento;
- risco de filesystem 100%.

### Memória / DIMM

- DIMM;
- CECC;
- RAS;
- hPPR;
- erro de memória;
- alerta de hardware.

### Storage / Data Protection

- snapshot;
- orphan snapshot;
- protection domain;
- data protection;
- backup;
- replicação;
- volume indisponível.

## Regras de recomendação

- Se disco em CVM está acima de threshold, recuperar caso CVM e KB relacionada.
- Se há erro de memória, classificar como hardware e recomendar validação N2/N3.
- Se há snapshot/data protection, verificar se há artigo publicado ou ticket histórico.
- Se houver risco de impacto em cluster, aumentar criticidade.

## Segurança

Comandos e scripts de fabricante devem ser exibidos como referência técnica apenas quando a fonte for validada e sempre com revisão humana. O Copiloto não executa comandos.

## Saída esperada

```json
{
  "subdomain": "storage | cvm_disk | memory | data_protection",
  "risk": "low | medium | high",
  "needs_escalation": true,
  "reason": "risco operacional ou necessidade de fornecedor"
}
```
