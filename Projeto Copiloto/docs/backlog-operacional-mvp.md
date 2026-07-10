# Backlog Operacional do MVP — Copiloto L1

> Versão: v2.0  
> Data: 2026-07-10  
> Objetivo: registrar o que já foi fechado no MVP e o que ainda falta para endurecer a operação

## Legenda

- `A Fazer`: ainda não começou
- `Parcial`: existe, mas ainda precisa amadurecer
- `Concluído`: suficiente para o escopo atual do MVP

## B1 — Alinhamento do repositório

| ID | Item | Status |
|---|---|---|
| B1-01 | Sincronizar README com o estado real do app | Concluído |
| B1-02 | Sincronizar contexto técnico com o código atual | Concluído |
| B1-03 | Sincronizar contexto de negócio com o MVP real | Concluído |
| B1-04 | Organizar links e docs para uso no GitHub | Concluído |
| B1-05 | Ignorar artefatos locais no Git | Concluído |

## B2 — Fluxo do analista

| ID | Item | Status |
|---|---|---|
| B2-01 | Dashboard | Concluído |
| B2-02 | Novo atendimento | Concluído |
| B2-03 | Tela de resultado estruturada | Concluído |
| B2-04 | Histórico | Concluído |
| B2-05 | Decisão humana | Concluído |
| B2-06 | Scorecard operacional | Concluído |

## B3 — Backend e IA

| ID | Item | Status |
|---|---|---|
| B3-01 | Edge Function `analyze-ticket` | Concluído |
| B3-02 | Contrato validado de entrada e saída | Concluído |
| B3-03 | Fallback controlado | Concluído |
| B3-04 | Seleção de provedor por `LLM_PROVIDER` | Concluído |
| B3-05 | Operação estável com provedor definitivo no ambiente remoto | Parcial |

## B4 — Segurança e LGPD

| ID | Item | Status |
|---|---|---|
| B4-01 | Bloqueio de segredo, token, senha e chave | Concluído |
| B4-02 | Mascaramento básico de PII | Concluído |
| B4-03 | Política expandida de sanitização antes da persistência | Parcial |
| B4-04 | Política final de uso de dados para operação real | Parcial |

## B5 — Base de conhecimento e evidências

| ID | Item | Status |
|---|---|---|
| B5-01 | Recuperação mínima de evidências curadas | Concluído |
| B5-02 | Corpus inicial persistido em banco | Parcial |
| B5-03 | Ranking mais robusto de evidências | Parcial |
| B5-04 | Governança do corpus aprovado para o MVP | Parcial |

## B6 — Operação

| ID | Item | Status |
|---|---|---|
| B6-01 | Modo demonstração | Concluído |
| B6-02 | Modo público sem login | Concluído |
| B6-03 | Modo conectado com login | Concluído |
| B6-04 | Deploy web público | Concluído |
| B6-05 | Validação operacional com amostra mais ampla de casos | Parcial |

## Próximas prioridades

1. estabilizar o provedor principal no ambiente remoto;
2. consolidar corpus persistido e evidências mais úteis;
3. reforçar política de sanitização;
4. decidir quando o login volta a ser obrigatório;
5. ampliar a rodada de validação com casos anonimizados.
