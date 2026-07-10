# Pipeline de Segurança e LGPD do MVP — Copiloto L1

> Versão: v2.0  
> Data: 2026-07-10  
> Objetivo: registrar a política mínima de detecção, mascaramento e bloqueio antes da IA

## 1. Regra central

Nenhum conteúdo deve seguir para análise automática antes de passar por:

1. detecção
2. decisão de segurança
3. mascaramento ou bloqueio
4. registro mínimo do resultado

## 2. O que já existe hoje

A `analyze-ticket` já faz:

- bloqueio de private key
- bloqueio de bearer token
- bloqueio de `api_key`, `token`, `secret`, `client_secret` e `access_token`
- bloqueio de senha
- bloqueio de `sb_secret`
- mascaramento de e-mail
- mascaramento de CPF
- mascaramento de telefone

## 3. Resultado esperado da sanitização

Para cada análise, o sistema deve conseguir indicar:

- se o conteúdo foi bloqueado;
- quais campos foram mascarados;
- quais alertas de sanitização foram gerados.

## 4. Casos de bloqueio

O conteúdo deve ser bloqueado quando houver:

- segredo explícito
- token de autenticação
- senha
- chave privada
- credencial sensível não tratada

## 5. Casos de mascaramento

O conteúdo pode seguir, com máscara, quando houver:

- e-mail identificável
- CPF identificável
- telefone identificável

## 6. Lacunas atuais

Ainda falta evoluir:

- política mais ampla antes da persistência;
- cobertura para outros identificadores pessoais;
- classificação mais explícita de risco;
- auditoria operacional mais forte sobre conteúdo bloqueado.

## 7. Regra de repositório

- `data/raw/` não entra no Git;
- `.env` e secrets não entram no Git;
- só material anonimizado pode entrar em `data/processed/`.

## 8. Regra de produto

Mesmo quando o conteúdo não for bloqueado:

- a IA continua sendo consultiva;
- a resposta ao cliente continua sendo rascunho;
- a decisão final continua sendo humana.
