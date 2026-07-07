# KB — Processo de Gerenciamento de Incidentes

> Tipo: Processo  
> Uso no MVP: orientar fluxo do Copiloto antes de sugerir diagnóstico ou escalonamento.  
> Status: Base recomendada para MVP.  
> Fonte principal: `Gerenciamento de Incidentes com fluxograma.pdf`.

## Objetivo

Esta KB descreve como o Copiloto deve entender o processo de incidentes da Clear IT para apoiar o analista N1 sem pular etapas, sem automatizar ações críticas e sem sugerir solução fora da elegibilidade do N1.

## Conceito de incidente

Um incidente é qualquer evento fora da operação padrão de um serviço que causa ou pode causar interrupção ou redução da qualidade do serviço.

O objetivo do gerenciamento de incidentes é restaurar a operação normal o mais rápido possível, com o menor impacto possível ao negócio ou usuário, inclusive usando solução de contorno conhecida quando aplicável.

## Escopo do processo

O escopo inclui:

- detecção de incidentes;
- registro;
- categorização;
- atribuição;
- diagnóstico;
- resolução;
- encerramento;
- monitoramento, rastreamento e comunicação.

## Entradas do processo

O processo pode iniciar a partir de:

- relatos de usuários;
- alertas de ferramentas de monitoramento;
- eventos de segurança.

## Responsabilidades por nível

### Suporte N1

Responsabilidades principais:

- registrar/atualizar ticket no ITSM;
- identificar se é incidente;
- categorizar e priorizar;
- verificar se há fornecedor envolvido;
- identificar se é P1;
- consultar Base de Conhecimento;
- aplicar solução conhecida se elegível ao primeiro nível;
- comunicar solução ao usuário;
- encerrar incidente quando aplicável;
- escalar para N2 se não houver solução de contorno.

### Suporte N2

Responsabilidades principais:

- revisar e atualizar incidente;
- investigar e diagnosticar;
- buscar solução de contorno ou definitiva;
- avaliar necessidade de mudança;
- aplicar solução encontrada;
- testar eficácia;
- acionar N3/fabricante quando necessário.

### Suporte N3 / Fabricante

Responsabilidades principais:

- investigar casos especializados;
- diagnosticar problemas de fornecedor;
- orientar correções;
- comunicar ao N2 para aplicação e acompanhamento.

## Fluxo lógico para o Copiloto

```text
Receber ticket/log
↓
Verificar se é incidente ou requisição
↓
Classificar categoria, tipo e item
↓
Priorizar por impacto e urgência
↓
Verificar se envolve fornecedor
↓
Verificar se é P1
↓
Consultar KB
↓
Se erro conhecido e solução elegível ao N1 → sugerir procedimento revisável
↓
Se não houver evidência ou solução N1 → recomendar pedir dados ou escalar
↓
Gerar rascunho revisável
```

## Regras para o Copiloto

1. Não sugerir execução de solução sem evidência.
2. Não sugerir solução N1 se o processo exigir N2/N3.
3. Não confundir incidente com requisição de serviço.
4. Sempre indicar se faltam dados.
5. Sempre separar fatos, hipóteses e recomendação.
6. Sempre declarar confiança.
7. Sempre deixar resposta como rascunho revisável.

## Saída esperada do MVP ao consultar esta KB

```json
{
  "process_step": "classificar_priorizar_consultar_kb",
  "recommended_route": "resolve_n1 | ask_more_data | escalate_n2 | escalate_n3 | vendor",
  "reason": "justificativa baseada no processo",
  "human_review_required": true
}
```

## Pontos que ainda precisam de validação

- SLAs contratuais reais por cliente.
- Catálogo oficial de categorias/CTI do FreshService.
- Critérios contratuais que podem alterar prioridade padrão.
