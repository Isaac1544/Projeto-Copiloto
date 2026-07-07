# KB — Fontes Externas e Fabricantes

> Tipo: Governança de fontes  
> Uso no MVP: controlar quando e como usar referências de fabricante.  
> Fontes: briefing, Portal Nutanix, Freshservice API Docs e documentação Claude.

## Objetivo

Evitar que o Copiloto afirme ter acessado ou usado conteúdo externo protegido sem autorização.

## Fontes externas citadas

### Nutanix KB Portal

Usado como referência de fabricante para casos técnicos Nutanix.

Regras:

- não fazer scraping automático;
- não assumir acesso a conteúdo protegido por login;
- usar artigos exportados/autorizados;
- citar ID ou título quando conhecido;
- recomendar consulta humana quando necessário.

### Freshservice API Docs

Usado como referência futura para integração.

Regras:

- fora da PoC;
- fora do MVP atual;
- não definir endpoints sem validação;
- não assumir credenciais;
- não prometer escrita/leitura automática.

### Claude / Anthropic Docs

Usado para futura integração Claude.

Regras:

- enviar apenas dados sanitizados;
- usar prompts controlados;
- registrar política de retenção;
- não escolher modelo sem validação;
- aplicar guardrails.

## Classificação de fonte

| Tipo | Pode entrar no MVP? | Observação |
|---|---|---|
| KB interna publicada | Sim | Preferencial |
| KB interna draft | Com cautela | Confiança menor |
| Caso resolvido validado | Sim | Excelente para golden cases |
| Ticket histórico | Após anonimização | Precisa limpeza |
| Print FreshService | Só tarjado | Uso para UI/processo |
| Portal fabricante público | Referência | Não depender de scraping |
| Conteúdo com login | Não direto | Exigir exportação/autorização |

## Saída esperada no Copiloto

```json
{
  "external_source_used": false,
  "external_reference": "Nutanix KB-1540",
  "access_status": "reference_only",
  "human_validation_required": true
}
```
