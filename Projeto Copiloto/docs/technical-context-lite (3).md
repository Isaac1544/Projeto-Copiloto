# Technical Context — Copiloto para Analistas de Suporte L1 Clear IT

> **Versão:** v1.5 — Contexto técnico completo consolidado  
> **Data:** 2026-07-04  
> **Persona Onion responsável:** `@engineer` com sincronismo `@docs`  
> **Projeto:** Copiloto de IA para Analistas de Suporte L1 — Clear IT  
> **Fase atual:** PoC simples criada / validação pré-MVP  
> **Próxima fase:** MVP sem integração direta ao FreshService  
> **Regra Onion:** Nenhum código produtivo antes de plano técnico aprovado.

---

## 1. Resumo Técnico Executivo

Este documento define o contexto técnico atualizado para o Copiloto Clear IT.

A direção atual é:

1. validar a PoC simples já criada;
2. usar os aprendizados para planejar o MVP;
3. implementar o MVP sem integração com FreshService neste momento;
4. usar Claude como provedor de IA;
5. trabalhar apenas com entrada manual ou importação controlada;
6. processar somente dados anonimizados;
7. consultar KB controlada;
8. produzir diagnóstico, evidências, confiança, escalonamento e rascunho;
9. manter revisão humana obrigatória;
10. deixar integração FreshService como etapa futura pós-MVP.

---

## 2. Stack Tecnológica

### 2.1 Decisões confirmadas

| Item | Decisão |
|---|---|
| Provedor de IA | Claude |
| FreshService | Fora da arquitetura do MVP atual |
| Tipo de solução MVP | Aplicação controlada, sem integração produtiva |
| Dados de entrada | Manual ou importação controlada de conteúdo anonimizado |
| Revisão humana | Obrigatória |
| Envio automático ao cliente | Fora do escopo |
| Acesso produtivo Clear IT | Fora do escopo atual |

### 2.2 Ainda não decidido

| Item | Status |
|---|---|
| Linguagem de programação | Pendente |
| Framework frontend | Pendente |
| Framework backend | Pendente |
| Banco de dados | Pendente |
| Banco vetorial | Pendente |
| Modelo Claude específico | Pendente |
| Estratégia de embeddings | Pendente |
| Cloud/deploy | Pendente |
| Autenticação | Pendente |
| Observabilidade | Pendente |
| Política de retenção | Pendente |

### 2.3 Observação Onion

A PoC HTML simples foi gerada como artefato de validação. Ela não define a stack final do MVP. Ela apenas prova fluxo.

---

## 3. PoC Simples Criada

### 3.1 Objetivo

A PoC simples valida o fluxo mínimo antes do MVP:

```text
Ticket/log
↓
Mascaramento básico
↓
Extração de sinais técnicos
↓
Busca simulada em KB
↓
Diagnóstico provável
↓
Confiança
↓
Escalonamento
↓
Rascunho revisável
↓
Scorecard humano
```

### 3.2 Arquivos gerados na PoC

```text
poc-copiloto-clear-it/
├── README.md
├── poc-copiloto-clear-it.html
├── data/
│   ├── test-cases.json
│   └── scorecard-avaliacao.csv
└── docs/
    └── next-mvp-notes.md
```

### 3.3 O que a PoC implementa

- UI local em HTML;
- seleção de cenário;
- entrada manual;
- mascaramento básico em JavaScript;
- extração simples de sinais;
- busca simulada em KB embutida;
- diagnóstico provável;
- confiança;
- recomendação de escalonamento;
- rascunho de resposta;
- scorecard humano.

### 3.4 O que a PoC não implementa

- Claude real;
- FreshService;
- backend;
- banco;
- RAG real;
- autenticação;
- auditoria real;
- persistência;
- deploy;
- dados produtivos.

---

## 4. Arquitetura Lógica Planejada para o MVP

### 4.1 Arquitetura sem FreshService

```text
[Analista L1]
    |
    v
[Web UI do MVP]
    |
    v
[Input Validator]
    |
    v
[Data Sanitization Layer]
    |
    v
[Technical Signal Extractor]
    |
    v
[Retrieval / RAG Layer]
    |
    v
[Claude Inference Adapter]
    |
    v
[Guardrails & Confidence Evaluator]
    |
    v
[Human Review Workspace]
    |
    v
[Feedback & Audit Log]
```

### 4.2 Característica principal

O MVP não deve depender de FreshService.

O usuário poderá inserir manualmente o conteúdo de um ticket/log ou importar uma amostra controlada, desde que anonimizada ou submetida ao processo de sanitização.

---

## 5. Componentes Técnicos Planejados

### 5.1 Web UI do MVP

Responsável por permitir que o analista:

- cole texto do chamado;
- cole logs;
- envie arquivo controlado, se aprovado;
- visualize dados mascarados;
- veja evidências;
- revise diagnóstico;
- revise rascunho;
- registre avaliação.

Status: pendente.

---

### 5.2 Input Validator

Responsável por validar:

- tamanho da entrada;
- tipo de arquivo;
- formato mínimo;
- presença de conteúdo;
- possível presença de dados sensíveis;
- conteúdo inadequado para processamento.

Status: pendente.

---

### 5.3 Data Sanitization Layer

Responsável por remover ou mascarar:

- nomes de clientes;
- nomes de pessoas;
- e-mails;
- telefones;
- IPs identificáveis;
- hostnames;
- IDs de contrato;
- IDs de cliente;
- tokens;
- chaves;
- segredos;
- topologia de rede identificável;
- caminhos internos sensíveis.

Status: pendente.

Observação: a lista final precisa ser validada com Clear IT/Pulse Mais.

---

### 5.4 Technical Signal Extractor

Responsável por identificar sinais técnicos como:

- produto/serviço impactado;
- severidade;
- tipo de erro;
- componente afetado;
- termos técnicos relevantes;
- sintomas;
- padrões de log;
- necessidade de mais dados.

Status: pendente.

---

### 5.5 Retrieval / RAG Layer

Responsável por recuperar evidências em KB controlada.

Fontes candidatas:

- KB exportada;
- playbooks;
- artigos internos;
- procedimentos de workaround;
- casos históricos anonimizados;
- documentos autorizados de fabricantes;
- runbooks derivados dos casos de uso.

Status: pendente.

Questões em aberto:

- formato da KB;
- estratégia de chunking;
- embeddings;
- banco vetorial;
- ranking;
- filtro por fonte;
- atualização da base;
- validação de artigos.

---

### 5.6 Claude Inference Adapter

Responsável por encapsular chamadas ao Claude.

Deve garantir:

- envio apenas de conteúdo sanitizado;
- prompts controlados;
- instruções de não inventar;
- separação entre fato, hipótese e recomendação;
- retorno estruturado;
- tratamento de erro;
- política de timeout;
- logs seguros.

Status: pendente.

Ainda não definido:

- modelo Claude específico;
- API/plano;
- credenciais;
- retenção;
- região;
- limites de custo;
- limites de tokens.

---

### 5.7 Guardrails & Confidence Evaluator

Responsável por aplicar regras antes e depois da resposta do Claude.

Deve avaliar:

- evidência suficiente;
- confiança;
- necessidade de mais dados;
- necessidade de escalonamento;
- risco de resposta sem fonte;
- presença de dados sensíveis;
- aderência ao formato.

Status: pendente.

---

### 5.8 Human Review Workspace

Responsável por permitir revisão humana.

Deve exibir:

- entrada original ou sanitizada;
- resumo do incidente;
- evidências;
- diagnóstico provável;
- confiança;
- recomendação;
- rascunho;
- botões ou campos de avaliação.

Status: pendente.

---

### 5.9 Feedback & Audit Log

Responsável por registrar:

- caso analisado;
- versão sanitizada;
- fontes usadas;
- saída gerada;
- avaliação humana;
- se aceitou/editou/rejeitou;
- motivo da rejeição;
- timestamp;
- usuário avaliador, se houver autenticação.

Status: pendente.

Cuidado: logs não podem armazenar dados sensíveis indevidamente.

---

## 6. FreshService — Fora do MVP Atual

### 6.1 O que foi decidido

O MVP atual **não será integrado ao FreshService**.

### 6.2 O que isso significa tecnicamente

O MVP não deve:

- autenticar no FreshService;
- ler tickets via API;
- escrever comentários;
- alterar status;
- enviar respostas;
- buscar anexos;
- sincronizar categorias;
- abrir ou fechar chamados.

### 6.3 O que FreshService ainda representa

FreshService continua sendo:

- referência do processo real;
- referência de campos de ticket;
- referência para exemplos de entrada;
- sistema futuro potencial;
- origem provável de dados exportados e anonimizados;
- contexto de operação do analista.

### 6.4 Por que deixar fora agora

- reduz risco;
- reduz dependência de credenciais;
- evita acesso produtivo;
- respeita restrições do briefing;
- permite validar valor antes de integração;
- acelera planejamento do MVP;
- mantém escopo adequado para jovens/squad.

---

## 7. Contrato Conceitual de Entrada do MVP

Exemplo conceitual:

```json
{
  "case_id": "CASE-001",
  "source": "manual_input",
  "ticket_summary": "Resumo do incidente",
  "log_excerpt": "Trecho de log sanitizado",
  "attachments_summary": "Descrição opcional de anexos",
  "severity": "unknown | low | medium | high",
  "customer_visible": false,
  "sanitization_status": "pending | sanitized | blocked"
}
```

Observação: contrato final depende da stack e do formato real dos dados.

---

## 8. Contrato Conceitual de Saída do MVP

Exemplo conceitual:

```json
{
  "case_summary": "Resumo do incidente",
  "technical_signals": ["sinal 1", "sinal 2"],
  "evidence": [
    {
      "source_id": "KB-001",
      "title": "Artigo ou playbook",
      "relevance": "high"
    }
  ],
  "probable_diagnosis": "Diagnóstico provável",
  "confidence": "high | medium | low",
  "recommendation": "resolve | ask_more_data | escalate",
  "escalation_reason": "Motivo se aplicável",
  "customer_draft": "Rascunho revisável",
  "human_review_required": true
}
```

---

## 9. Regras de Prompt para Claude

O prompt do MVP deve orientar Claude a:

1. não inventar diagnóstico;
2. responder apenas com base em evidências;
3. declarar incerteza;
4. separar fatos de hipóteses;
5. recomendar pedir mais dados quando necessário;
6. recomendar escalonamento quando risco ou baixa confiança;
7. não expor dados sensíveis;
8. não gerar instruções perigosas;
9. não afirmar execução de ações;
10. gerar rascunho revisável;
11. respeitar padrão consultivo.

### Estrutura esperada da resposta

```text
Resumo do caso
Sinais técnicos encontrados
Evidências consultadas
Diagnóstico provável
Nível de confiança
Próximos passos
Recomendação de escalonamento
Rascunho para cliente
Observações para revisão humana
```

---

## 10. Política Técnica Inicial de Dados

### 10.1 Antes do Claude

Todo conteúdo deve passar por sanitização.

### 10.2 Dados a mascarar ou bloquear

| Categoria | Tratamento inicial |
|---|---|
| Nome de cliente | Mascarar |
| Nome de pessoa | Mascarar |
| E-mail | Mascarar |
| Telefone | Mascarar |
| IP identificável | Mascarar/generalizar |
| Hostname | Mascarar |
| ID de cliente | Mascarar |
| ID de contrato | Mascarar |
| Token/chave/segredo | Bloquear |
| Topologia identificável | Remover ou abstrair |
| Print com dados sensíveis | Usar apenas se tarjado |

### 10.3 Pendência

A lista oficial de dados sensíveis da Clear IT ainda precisa ser validada.

---

## 11. Regras de Confiança

### Alta

- evidência clara na KB;
- sinais técnicos consistentes;
- caso semelhante conhecido;
- próximo passo seguro;
- baixa ambiguidade.

### Média

- há evidência parcial;
- alguns sinais técnicos são compatíveis;
- requer validação humana;
- pode precisar de dados adicionais.

### Baixa

- log incompleto;
- sem evidência na KB;
- múltiplas hipóteses;
- risco alto;
- dados insuficientes;
- recomendação deve ser pedir mais dados ou escalar.

---

## 12. Regras de Escalonamento

O MVP deve recomendar escalonamento quando:

- confiança baixa;
- evidência insuficiente;
- risco operacional alto;
- possível impacto em cluster/infraestrutura crítica;
- necessidade de intervenção física;
- necessidade de confirmação L2/L3;
- log incompleto;
- workaround não validado;
- caso fora da KB;
- resposta ao cliente exigiria afirmação não comprovada.

---

## 13. Plano Técnico Ativo — MVP Sem FreshService

### Etapa 0 — Validar PoC simples

- Abrir PoC HTML.
- Testar 3 cenários.
- Coletar avaliação no scorecard.
- Registrar pontos úteis e falhas.
- Decidir se segue para MVP.

Status: pronta para execução.

---

### Etapa 1 — Fechar escopo MVP

- Confirmar formato de entrada.
- Confirmar KB inicial.
- Confirmar política de dados.
- Confirmar avaliadores.
- Confirmar critérios de sucesso.
- Confirmar modelo/acesso Claude.

Status: pendente.

---

### Etapa 2 — Definir arquitetura técnica

- Escolher stack.
- Escolher estratégia de RAG.
- Escolher armazenamento.
- Definir ambiente.
- Definir autenticação, se houver.
- Definir logs e auditoria.

Status: pendente.

---

### Etapa 3 — Implementar MVP incremental

Ordem sugerida:

1. UI de entrada.
2. Sanitização.
3. KB local/controlada.
4. Recuperação de evidências.
5. Integração Claude.
6. Guardrails.
7. Resultado estruturado.
8. Scorecard humano.
9. Auditoria básica.
10. Testes com casos controlados.

Status: pendente.

---

### Etapa 4 — Avaliação

- Testar com amostra controlada.
- Comparar respostas com avaliação humana.
- Medir utilidade.
- Medir segurança.
- Medir rastreabilidade.
- Medir esforço reduzido percebido.
- Registrar pontos para evolução.

Status: pendente.

---

### Etapa 5 — Pós-MVP

Somente depois do MVP validado, discutir:

- integração FreshService;
- API;
- autenticação;
- leitura de tickets;
- comentários;
- anexos;
- métricas operacionais reais;
- implantação controlada.

Status: futuro.

---

## 14. Critérios Técnicos de Aceite do MVP

### TC-001 — Sem FreshService

O sistema deve funcionar sem qualquer chamada a FreshService.

### TC-002 — Sanitização antes de IA

Nenhuma chamada a Claude pode ocorrer antes da etapa de sanitização.

### TC-003 — Bloqueio de segredo

Se tokens, chaves ou credenciais forem detectados, o sistema deve bloquear o envio.

### TC-004 — Evidência obrigatória

Toda resposta deve listar evidências usadas ou declarar ausência de evidência.

### TC-005 — Incerteza explícita

Quando a confiança for baixa, o sistema deve pedir mais dados ou escalar.

### TC-006 — Rascunho não automático

Resposta ao cliente deve ser rascunho revisável, sem envio automático.

### TC-007 — Feedback humano

O usuário deve conseguir avaliar a resposta.

### TC-008 — Auditoria segura

O sistema deve registrar uso de forma segura, sem expor dados sensíveis.

---

## 15. Riscos Técnicos

| Risco | Impacto | Mitigação |
|---|---|---|
| Claude receber dado sensível | Alto | Sanitização obrigatória e bloqueio. |
| Diagnóstico inventado | Alto | Guardrails, evidências e baixa confiança. |
| KB desatualizada | Médio/Alto | Validação da KB antes do MVP. |
| Falta de baseline | Médio | MVP mede utilidade antes de prometer redução. |
| Escopo crescer para FreshService | Alto | Manter integração fora do MVP. |
| Dados exportados inconsistentes | Médio | Normalização e validação de entrada. |
| Resposta inadequada ao cliente | Médio | Rascunho sempre revisável. |
| Custo/limite Claude indefinido | Médio | Definir modelo e limites antes da implementação. |

---

## 16. Pendências Técnicas

| ID | Pendência | Status |
|---|---|---|
| P-TECH-001 | Modelo Claude específico | Pendente |
| P-TECH-002 | Forma de acesso/API Claude | Pendente |
| P-TECH-003 | Política de retenção Claude | Pendente |
| P-TECH-004 | Stack MVP | Pendente |
| P-TECH-005 | Banco ou armazenamento | Pendente |
| P-TECH-006 | Banco vetorial/embeddings | Pendente |
| P-TECH-007 | Ambiente de execução | Pendente |
| P-TECH-008 | Autenticação | Pendente |
| P-TECH-009 | Política de logs | Pendente |
| P-TECH-010 | KB aprovada para indexação | Pendente |
| P-TECH-011 | Formato de entrada | Pendente |
| P-TECH-012 | Lista oficial de dados sensíveis | Pendente |
| P-TECH-013 | Critério técnico de sucesso do MVP | Pendente |
| P-TECH-014 | Plano de testes | Pendente |

---

## 17. Fora de Escopo Técnico Atual

### Fora da PoC

- backend;
- Claude real;
- RAG real;
- FreshService;
- deploy;
- autenticação;
- persistência.

### Fora do MVP

- integração FreshService;
- escrita em tickets;
- leitura automática;
- envio automático;
- execução de comandos;
- acesso produtivo;
- scraping não autorizado;
- dados reais não anonimizados.

---

## 18. Arquivos de Referência

Arquivos gerados ou usados no ciclo:

```text
poc-copiloto-clear-it/
├── README.md
├── poc-copiloto-clear-it.html
├── data/test-cases.json
├── data/scorecard-avaliacao.csv
└── docs/next-mvp-notes.md

onion-contexts-poc-mvp-sem-freshservice/
└── docs/
    ├── business-context-lite.md
    └── technical-context-lite.md
```

---

## 19. Próxima Ação Recomendada

A próxima ação Onion é:

```text
@engineer plan MVP sem FreshService
```

Esse plano deve detalhar:

- arquitetura escolhida;
- arquivos a criar;
- ordem de implementação;
- critérios de teste;
- riscos;
- validações;
- o que ainda precisa de aprovação.

Não iniciar código produtivo antes dessa aprovação.

---

## 20. Controle Anti-Alucinação

Este documento não inventa:

- linguagem;
- framework;
- banco;
- cloud;
- embeddings;
- modelo Claude;
- custos;
- API keys;
- endpoints FreshService;
- metas numéricas;
- credenciais;
- baselines.

Tudo que não está validado permanece como pendência.
