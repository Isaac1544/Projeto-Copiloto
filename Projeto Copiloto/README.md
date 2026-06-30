# Projeto Copiloto

Repositório de documentação e especificação do **Copiloto para Analistas de Suporte**, organizado no padrão **Onion Portable / Spec-as-Code**.

## Objetivo

Centralizar a visão de produto, o planejamento técnico inicial e a base de conhecimento do projeto para facilitar evolução, versionamento e uso com GitHub/Copilot.

## Estrutura

```text
Projeto Copiloto/
├── README.md
├── .gitignore
├── ONION-MASTER-PROMPT.md
└── docs/
    ├── business-context-lite.md
    ├── technical-context-lite.md
    ├── onion-cycles.md
    ├── knowledge-base/
    └── sessions/
        └── README.md
```

## Documentos principais

- `docs/business-context-lite.md` — contexto de negócio ativo do projeto.
- `docs/technical-context-lite.md` — contexto técnico em template, ainda não preenchido.
- `docs/onion-cycles.md` — ciclos de Produto, Engenharia, Knowledge Base e Sync.
- `docs/knowledge-base/` — base de conhecimento consolidada.
- `docs/sessions/README.md` — índice para registrar sessões futuras.
- `ONION-MASTER-PROMPT.md` — prompt mestre do Onion Portable para orientar agentes de IA.

## Como subir no GitHub

```bash
git init
git add .
git commit -m "Initial commit - Projeto Copiloto"
git branch -M main
git remote add origin <URL_DO_SEU_REPOSITORIO>
git push -u origin main
```

## Observações

- O arquivo `business-context-v3-desafio-b.md` foi consolidado como `docs/business-context-lite.md`.
- O `technical-context-lite.md` foi mantido sem preenchimento técnico, conforme solicitado.
- Arquivos duplicados e opcionais foram removidos para deixar o repositório mais limpo.
