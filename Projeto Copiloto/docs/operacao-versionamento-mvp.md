# Operação e Versionamento do MVP — Copiloto L1

> Versão: v2.0  
> Data: 2026-07-10  
> Objetivo: deixar claro como operar o MVP e onde cada tipo de mudança deve acontecer

## 1. Fontes de verdade

O MVP hoje tem três camadas principais:

1. Aplicação web  
   Pasta oficial: [`../copiloto-amigo-main/`](../copiloto-amigo-main/)

2. Documentação e governança  
   Pasta oficial: [`./`](./)

3. Estado remoto  
   Supabase e Cloudflare

## 2. Modos de operação

### Demonstração

Use quando:

- o objetivo é validar UX rapidamente;
- não há Supabase configurado no frontend;
- o time quer navegação imediata.

### Acesso público

Use quando:

- o backend real já está ativo;
- o MVP precisa ficar acessível sem login inicial;
- a prioridade é validar o fluxo completo com menos atrito.

### Conectado

Use quando:

- o login Supabase precisa ser obrigatório;
- a validação por usuário passa a ser importante;
- a operação já exige mais controle.

## 3. O que atualizar em cada mudança

### Mudança de interface ou fluxo

Atualizar:

- `copiloto-amigo-main/`
- `docs/backlog-operacional-mvp.md`

### Mudança de arquitetura, provider, Supabase ou Cloudflare

Atualizar:

- `copiloto-amigo-main/`
- `docs/technical-context-lite.md`
- `docs/setup-local-copiloto.md`

### Mudança de escopo do produto

Atualizar:

- `docs/business-context-lite.md`
- `docs/backlog-operacional-mvp.md`
- `docs/technical-context-lite.md`

### Mudança de corpus, KB ou política de uso de dados

Atualizar:

- `docs/knowledge-corpus-mvp.md`
- `docs/security-pipeline-mvp.md`
- `data/processed/` ou `docs/knowledge-base/`

## 4. Regra prática de versionamento

- código do app vai em `copiloto-amigo-main/`;
- documentação de decisão vai em `docs/`;
- dados brutos ficam fora do Git;
- dados processados só entram se estiverem anonimizados e aprovados.

## 5. Critério mínimo de pronto para uso controlado

1. o app abre em modo demonstração;
2. o app também funciona em modo público ou conectado;
3. a função `analyze-ticket` responde com fallback ou provedor real;
4. o resultado pode ser aceito, editado ou rejeitado;
5. o histórico e o scorecard ficam utilizáveis;
6. `pnpm run verify:mvp` passa localmente.

## 6. Ordem operacional recomendada

1. validar local em demonstração;
2. validar backend em público;
3. ativar provedor real;
4. consolidar corpus;
5. endurecer autenticação quando a validação do MVP estiver estável.
