# KB — Operação FreshService como Referência de Processo

> Tipo: Operação / UI / processo  
> Uso no MVP: orientar a interface e os campos simulados do Copiloto, sem integrar ao FreshService.  
> Fonte principal: `Prints das telas de operação do analista no FreshService.pdf`.

## Objetivo

Esta KB documenta quais elementos do FreshService são úteis para desenhar o MVP sem integração direta.

## Elementos observados nos prints

Os prints mostram uma tela de ticket com:

- ID do ticket;
- título/assunto;
- descrição;
- conversas;
- notas privadas;
- respostas do analista;
- anexos/imagens;
- status;
- origem;
- tipo;
- grupo;
- resolução;
- tempo gasto;
- informações de contato;
- responder;
- associar;
- colaborar via Teams;
- escalonamento;
- pendência fabricante.

## Campos úteis para o MVP

O MVP pode simular/importar os seguintes campos:

| Campo | Uso no Copiloto |
|---|---|
| `ticket_id` | Identificação interna mascarada |
| `title` | Classificação inicial |
| `description` | Entrada principal para análise |
| `conversation_history` | Contexto e evolução |
| `private_notes` | Evidências internas, com cuidado de dados |
| `status` | Contexto operacional |
| `origin` | Portal, e-mail ou outro |
| `type` | Incidente ou requisição |
| `group` | Grupo responsável |
| `resolution_note` | Aprendizado de histórico |
| `attachments_summary` | Descrição de prints/logs sem dados sensíveis |

## Como usar sem integração

O MVP não deve ler FreshService automaticamente. O analista pode:

1. copiar a descrição;
2. colar histórico relevante;
3. anexar trecho de log já sanitizado;
4. informar status e grupo manualmente;
5. receber sugestão do Copiloto;
6. revisar e copiar rascunho para o FreshService, se aprovado.

## Regras

- Não gravar automaticamente no FreshService.
- Não alterar status.
- Não enviar resposta.
- Não ler anexos produtivos.
- Não armazenar contato do cliente sem mascaramento.
- Não incluir links internos sensíveis no prompt para Claude.

## Interface sugerida para o MVP

```text
[Descrição do chamado]
[Histórico / conversas relevantes]
[Logs / anexos sanitizados]
[Categoria / subcategoria]
[Prioridade atual]
[Grupo atual]
[Botão: Analisar]
[Resultado: diagnóstico, evidências, confiança, escalonamento, rascunho]
```
