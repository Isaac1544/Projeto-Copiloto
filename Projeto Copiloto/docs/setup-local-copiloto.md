# Setup Local e Deploy Inicial — Copiloto L1

> Versão: v2.0  
> Data: 2026-07-10  
> Objetivo: documentar o caminho mais curto para rodar o MVP localmente e ativar o backend real no Supabase

## 1. Estratégia recomendada

Use esta ordem:

1. validar o frontend em modo demonstração;
2. validar o app em modo público com Supabase;
3. publicar ou revisar a Edge Function `analyze-ticket`;
4. testar com `ALLOW_MOCK_ANALYSIS=true`;
5. ativar o provedor real de IA;
6. só depois endurecer login e operação.

## 2. Pré-requisitos

- Node.js 20+
- npm ou pnpm
- acesso ao projeto Supabase
- Supabase CLI autenticado
- variáveis do frontend preenchidas quando o modo conectado for usado

## 3. Arquivo base de ambiente

Use como referência:

- [`copiloto-amigo-main/.env.example`](../copiloto-amigo-main/.env.example)

## 4. Modos locais

### 4.1 Demonstração

Mais rápido para abrir o MVP.

Exemplo:

```env
VITE_DEMO_MODE=true
VITE_AUTH_BYPASS=true
```

Resultado:

- sem dependência de login;
- sem dependência de Supabase no frontend;
- persistência local no navegador.

### 4.2 Público

Usado para validar o backend real sem exigir login.

Exemplo:

```env
VITE_DEMO_MODE=false
VITE_AUTH_BYPASS=true
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx
```

### 4.3 Conectado

Usado quando o login Supabase deve ficar ativo.

Exemplo:

```env
VITE_DEMO_MODE=false
VITE_AUTH_BYPASS=false
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx
```

## 5. Instalação e execução local

Dentro de `copiloto-amigo-main/`:

```bash
npm install
npm run dev
```

Ou:

```bash
pnpm install
pnpm dev
```

Verificação mínima:

```bash
pnpm run verify:mvp
```

Smoke test da função:

```bash
pnpm run smoke:analyze-ticket
```

## 6. Deploy da Edge Function

Dentro de `copiloto-amigo-main/`:

```bash
supabase login
supabase link --project-ref <project-ref>
supabase functions deploy analyze-ticket
```

## 7. Secrets do backend

### 7.1 Fallback controlado

```bash
supabase secrets set ALLOW_MOCK_ANALYSIS=true
```

### 7.2 Claude / Anthropic

```bash
supabase secrets set LLM_PROVIDER=anthropic
supabase secrets set ANTHROPIC_API_KEY=...
supabase secrets set ANTHROPIC_MODEL=claude-sonnet-4-20250514
supabase secrets set ALLOW_MOCK_ANALYSIS=false
```

### 7.3 OpenAI

```bash
supabase secrets set LLM_PROVIDER=openai
supabase secrets set OPENAI_API_KEY=...
supabase secrets set OPENAI_MODEL=<modelo>
supabase secrets set ALLOW_MOCK_ANALYSIS=false
```

### 7.4 Gemini

```bash
supabase secrets set LLM_PROVIDER=gemini
supabase secrets set GEMINI_API_KEY=...
supabase secrets set GEMINI_MODEL=<modelo>
supabase secrets set ALLOW_MOCK_ANALYSIS=false
```

Regra importante:

- nenhuma chave de IA vai no frontend;
- tudo fica no Supabase.

## 8. Checklist rápido

1. abrir o app;
2. criar um novo atendimento;
3. gerar análise;
4. validar se existem:
   - fatos observados;
   - identificação do problema;
   - sugestão de resolução;
   - resposta ao cliente;
   - fontes consultadas;
5. aceitar, editar ou rejeitar a sugestão;
6. conferir o histórico.

## 9. Deploy web público

O passo a passo do deploy web está em:

- [`copiloto-amigo-main/docs/deploy-cloudflare.md`](../copiloto-amigo-main/docs/deploy-cloudflare.md)

Deploy atual conhecido:

- [isaac1544-projeto-copiloto.copilotoisaac.workers.dev](https://isaac1544-projeto-copiloto.copilotoisaac.workers.dev)
