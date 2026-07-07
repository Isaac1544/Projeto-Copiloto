# KB — Segurança, LGPD e Mascaramento

> Tipo: Segurança / Compliance  
> Uso no MVP: bloquear ou sanitizar conteúdo antes de qualquer envio ao Claude.  
> Fontes: briefing completo, restrições do projeto e diretriz de revisão humana.

## Objetivo

Garantir que o Copiloto não envie dados sensíveis, PII ou topologia identificável para IA sem anonimização.

## Regra central

Nenhum conteúdo deve ser enviado ao Claude antes de passar por validação e sanitização.

## Categorias a mascarar

| Categoria | Exemplo | Tratamento |
|---|---|---|
| Nome de cliente | Prefeitura X, Banco Y | `[CLIENT_MASKED]` |
| Nome de pessoa | Fulano Silva | `[PERSON_MASKED]` |
| E-mail | nome@dominio.com | `[EMAIL_MASKED]` |
| Telefone | +55 11 99999-8888 | `[PHONE_MASKED]` |
| IP | 10.20.30.40 | `[IP_MASKED]` ou generalizar |
| Hostname | cvm-prod-01 | `[HOST_MASKED]` |
| ID de ticket | INC-1177 | `[TICKET_ID_MASKED]` |
| Contrato | SUB356 | `[CONTRACT_MASKED]` |
| Topologia | mapa de rede, nomes de clusters | abstrair/remover |
| Token/chave | sk-..., api_key=... | bloquear |
| Prints | tela com dados visíveis | usar só se tarjado |
| Logs | com usuário, host, IP, token | sanitizar antes |

## Fluxo obrigatório

```text
Entrada
↓
Detecção de dados sensíveis
↓
Mascaramento ou bloqueio
↓
Validação humana opcional
↓
Consulta à KB
↓
Claude
```

## Condições de bloqueio

Bloquear o envio para IA quando houver:

- token, senha, chave ou segredo;
- credencial de portal;
- certificado privado;
- dados bancários;
- topologia completa identificável;
- print sem tarja;
- informação de cliente não anonimizada;
- log com dados pessoais sem mascaramento.

## Saída esperada

```json
{
  "sanitization_status": "sanitized | blocked | needs_review",
  "masked_fields": ["email", "ip", "hostname"],
  "can_send_to_claude": false,
  "reason": "possible secret detected"
}
```

## Pendência

A lista oficial de dados sensíveis deve ser validada pela Clear IT/Pulse Mais antes do MVP.
