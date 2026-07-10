# Corpus e Estratégia de RAG do MVP — Copiloto L1

> Versão: v2.0  
> Data: 2026-07-10  
> Objetivo: definir o corpus inicial e a estratégia prática de evidências do MVP

## 1. Regra central

O MVP deve começar com corpus pequeno, confiável e auditável.

Prioridades:

1. fonte identificável
2. conteúdo útil para triagem
3. aderência ao domínio do suporte
4. rastreabilidade

## 2. Fontes candidatas

O projeto hoje já possui material em:

- `docs/knowledge-base/`
- `data/processed/`

Essas duas áreas formam a base mais segura para o corpus inicial.

## 3. O que entra no MVP

Entra primeiro:

- KBs operacionais curadas
- orientações de incidentes
- regras de escalonamento
- artigos de segurança e mascaramento
- tickets anonimizados aprovados para uso como referência

## 4. O que não entra

Não entra no corpus operacional:

- `data/raw/`
- exportações brutas
- anexos sensíveis
- conteúdo sem anonimização ou sem aprovação

## 5. Estratégia atual

Hoje o backend já faz recuperação mínima de evidências curadas.

Isso é suficiente para o MVP inicial, mas ainda não é uma camada completa de corpus persistido.

## 6. Próxima evolução recomendada

1. consolidar uma tabela persistida de corpus no Supabase;
2. classificar cada item por tipo, origem e nível de confiança;
3. registrar quais fontes foram usadas em cada análise;
4. evoluir o ranking antes de pensar em vetor.

## 7. Regra para pgvector

Embeddings e busca vetorial só devem entrar se:

- a busca simples ficar fraca com frequência;
- o volume de corpus crescer;
- a avaliação do MVP mostrar necessidade real.

## 8. Saída esperada no produto

Toda resposta do Copiloto deve indicar:

- quais fontes foram consideradas;
- quando a evidência é insuficiente;
- quando a hipótese depende de validação adicional.
