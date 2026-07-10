# Deploy do MVP na Cloudflare

Este app já builda para Cloudflare Workers via TanStack Start / Nitro.

## Pré-requisitos

- conta Cloudflare
- projeto Supabase configurado
- `.env.local` preenchido quando o build depender de Supabase no frontend

## Variáveis mínimas no build

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_DEMO_MODE`
- `VITE_AUTH_BYPASS`

## Passo a passo

### 1. Entrar na pasta do app

```bash
cd copiloto-amigo-main
```

### 2. Instalar dependências

```bash
pnpm install
```

Alternativa:

```bash
npm install
```

### 3. Autenticar no Wrangler

```bash
pnpm dlx wrangler login
```

### 4. Gerar build de produção

```bash
pnpm build
```

### 5. Publicar

```bash
pnpm dlx wrangler deploy --config .output/server/wrangler.json
```

## URL pública atual conhecida

- [isaac1544-projeto-copiloto.copilotoisaac.workers.dev](https://isaac1544-projeto-copiloto.copilotoisaac.workers.dev)

## Observações

- se mudar qualquer variável `VITE_*`, gere novo build antes do deploy;
- o backend de análise continua no Supabase;
- o deploy web não substitui o deploy da Edge Function `analyze-ticket`.
