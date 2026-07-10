# Deploy do MVP na Cloudflare

Este projeto já está configurado para buildar com alvo Cloudflare Workers via Nitro/TanStack Start.

## Pré-requisitos

- Conta gratuita na Cloudflare
- Projeto Supabase já configurado
- `.env.local` preenchido antes do build

Variáveis mínimas esperadas no build local:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_AUTH_BYPASS=true`
- `VITE_DEMO_MODE=false`

## Passo a passo

### 1. Entrar no diretório do projeto

```powershell
cd "C:\Users\isaac\Downloads\Projeto-Copiloto (1)\Projeto Copiloto\copiloto-amigo-main"
```

### 2. Garantir Node e pnpm no PATH da sessão

```powershell
$env:PATH="C:\Users\isaac\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;C:\Users\isaac\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin;$env:PATH"
```

### 3. Fazer login na Cloudflare

```powershell
& "C:\Users\isaac\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\pnpm.cmd" dlx wrangler login
```

O navegador vai abrir para autorizar o deploy.

### 4. Gerar o build de produção

```powershell
& "C:\Users\isaac\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\pnpm.cmd" build
```

### 5. Publicar o app

```powershell
& "C:\Users\isaac\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\pnpm.cmd" dlx wrangler deploy --config .output/server/wrangler.json
```

## Resultado esperado

Ao final do deploy, a Cloudflare retorna uma URL parecida com:

```text
https://isaac1544-projeto-copiloto.<subdominio>.workers.dev
```

Esse será o link público inicial do MVP.

## Domínio personalizado

Depois do deploy:

1. Abra o Worker no dashboard da Cloudflare.
2. Vá em `Settings` ou `Domains & Routes`.
3. Adicione um domínio personalizado.

## Observações

- O frontend já está em modo público sem login.
- As análises agora podem ser persistidas no Supabase por sessão pública do navegador.
- Se mudar variáveis `VITE_*`, gere um novo build antes de publicar novamente.
