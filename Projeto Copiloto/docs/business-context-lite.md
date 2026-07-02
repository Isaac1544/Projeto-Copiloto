# Business Context v3 — Desafio B: Copiloto para Analistas de Suporte

> **Versão:** 3.0 Consolidada  
> **Data:** 2026-06-25  
> **Status:** Aprovado para iniciar o Technical Context  
> **Persona responsável:** @product  
> **Objetivo:** Consolidar a visão de produto antes do planejamento técnico, preservando rastreabilidade, critérios de aceite, premissas, riscos e indicadores de sucesso.

---

## Classificação das Informações

- ✅ **Confirmado:** Informação derivada do briefing, kick-off ou consenso de produto.
- 🟡 **Hipótese:** Suposição a validar em descoberta, protótipo ou MVP.
- 🔵 **Decisão de Produto:** Diretriz assumida para orientar escopo e implementação.
- ⚠️ **Pendente:** Item que exige validação adicional antes ou durante o Technical Context.

---

# 1. Resumo Executivo

## 1.1 Problema de Negócio

✅ Analistas de suporte L1 gastam tempo excessivo pesquisando conhecimento distribuído entre tickets antigos, documentação, bases de conhecimento e informações de fabricantes para interpretar logs, diagnosticar incidentes e responder clientes.

Esse cenário gera:

- aumento de MTTR/TMR;
- aumento de TMA;
- retrabalho;
- escalonamentos desnecessários para L2/L3;
- respostas pouco padronizadas;
- dependência excessiva de especialistas;
- perda de conhecimento reutilizável.

## 1.2 Visão do Produto

🔵 Construir um **Copiloto de IA para Analistas de Suporte**, alinhado ao fluxo do FreshService, que atue como **conselheiro técnico durante a triagem de chamados**.

O Copiloto deve apoiar o analista na interpretação de logs, recuperação de conhecimento, identificação de tickets semelhantes, sugestão de diagnóstico provável e geração de rascunho de resposta, mantendo sempre a decisão final com o humano.

## 1.3 Proposta de Valor

Transformar a busca passiva e manual por conhecimento em entrega ativa de recomendações contextualizadas, com evidências e fontes rastreáveis.

Valor esperado:

- maior autonomia do Analista L1;
- menor dependência de especialistas;
- diagnóstico inicial mais rápido;
- comunicação mais consistente com o cliente;
- melhor aproveitamento da base histórica de tickets e KB;
- redução de escalonamentos evitáveis.

## 1.4 Objetivos Estratégicos

✅ O produto deve contribuir para:

- reduzir MTTR/TMR;
- reduzir TMA;
- aumentar FCR;
- reduzir escalonamentos indevidos;
- reduzir reabertura de chamados;
- melhorar cumprimento de SLA;
- melhorar CSAT/NPS;
- aumentar padronização das respostas;
- preservar conformidade com LGPD e governança interna.

---

# 2. Stakeholders

| Perfil | Interesse Principal | Valor Esperado |
|---|---|---|
| Analista L1 | Resolver chamados com mais autonomia e velocidade | Diagnóstico inicial, evidências, casos similares e rascunho de resposta |
| Analista L2/L3 | Receber apenas casos realmente complexos | Menos escalonamentos indevidos e melhor contexto nos casos escalados |
| Gestor de Suporte | Melhorar produtividade, SLA e qualidade operacional | Indicadores melhores, padronização e rastreabilidade |
| Cliente Final | Receber respostas rápidas, claras e precisas | Menor tempo de espera e comunicação mais consistente |
| Compliance/Segurança | Garantir uso seguro da IA e proteção de dados | LGPD, mascaramento, auditoria e explicabilidade |

---

# 3. Personas

## 3.1 Analista L1

✅ **Responsabilidades**

- Triar chamados.
- Interpretar sintomas e logs iniciais.
- Buscar informações em KB, tickets e documentação.
- Comunicar status e solução ao cliente.
- Escalar quando necessário.

✅ **Dores**

- Pesquisa manual em múltiplas fontes.
- Dificuldade para interpretar logs.
- Dependência de especialistas.
- Falta de padronização nas respostas.
- Pouca reutilização de conhecimento histórico.

✅ **Necessidades**

- Diagnóstico inicial rápido.
- Evidências claras.
- Casos semelhantes.
- Sugestão de próximos passos.
- Rascunho de resposta revisável.
- Indicação de quando escalar.

## 3.2 Analista L2/L3

✅ **Responsabilidades**

- Atuar em incidentes complexos.
- Apoiar L1 em casos que exigem profundidade técnica.
- Validar padrões recorrentes e soluções reutilizáveis.

✅ **Dores**

- Recebimento de escalonamentos incompletos ou indevidos.
- Retrabalho na investigação inicial.
- Falta de contexto estruturado vindo do L1.

✅ **Necessidades**

- Escalonamentos com evidências.
- Histórico de investigação inicial.
- Indicação clara do motivo do escalonamento.

## 3.3 Gestor de Suporte

✅ **Responsabilidades**

- Acompanhar produtividade.
- Garantir SLA.
- Melhorar qualidade de atendimento.
- Reduzir gargalos operacionais.

✅ **Dores**

- Alto MTTR/TMA.
- Baixo FCR.
- Falta de padronização.
- Conhecimento concentrado em poucas pessoas.

✅ **Necessidades**

- Indicadores de uso e impacto.
- Redução de escalonamentos.
- Melhoria de consistência operacional.
- Governança sobre recomendações da IA.

## 3.4 Cliente Final

✅ **Interesse**

- Receber respostas mais rápidas, claras e confiáveis.

✅ **Impacto Esperado**

- Menos espera.
- Melhor clareza na comunicação.
- Menor necessidade de reabrir chamados.

---

# 4. Dores do Cliente

| ID | Dor | Descrição | Impacto |
|---|---|---|---|
| D-01 | Busca manual em múltiplas fontes | Analista precisa consultar KB, tickets, docs e colegas separadamente | Aumenta MTTR/TMA |
| D-02 | Conhecimento concentrado em especialistas | Soluções ficam na experiência de L2/L3 ou em tickets antigos | Aumenta dependência e escalonamentos |
| D-03 | Interpretação difícil de logs | Logs longos ou incompletos dificultam diagnóstico inicial | Aumenta erro e retrabalho |
| D-04 | Respostas pouco padronizadas | Cada analista responde de forma diferente | Afeta qualidade e CSAT |
| D-05 | Escalonamentos incompletos | L2/L3 recebe casos sem contexto suficiente | Gera retrabalho |
| D-06 | Baixa rastreabilidade de recomendações | Falta clareza sobre origem de diagnóstico ou sugestão | Reduz confiança e auditabilidade |

---

# 5. Hipóteses de Produto

| ID | Hipótese | Como Validar |
|---|---|---|
| H-01 | A investigação inicial é a etapa mais demorada do atendimento L1 | Medir tempo de triagem antes/depois do protótipo |
| H-02 | O conhecimento reutilizável está concentrado em tickets antigos e KB | Amostrar tickets resolvidos e mapear recorrência |
| H-03 | Recomendações com evidências reduzem escalonamentos indevidos | Comparar taxa de escalonamento com/sem Copiloto |
| H-04 | Rascunhos padronizados reduzem TMA e melhoram consistência | Avaliar tempo de resposta e qualidade percebida |
| H-05 | Exibir confiança e limitações aumenta a adoção pelos analistas | Testes com usuários e coleta qualitativa |
| H-06 | Logs incompletos exigirão solicitação de dados adicionais | Avaliar frequência de respostas “contexto insuficiente” |

---

# 6. Jornada Atual

✅ Fluxo atual resumido:

1. Cliente abre chamado.
2. Analista L1 lê o ticket.
3. Analista interpreta logs manualmente.
4. Analista pesquisa na KB.
5. Analista pesquisa tickets antigos.
6. Analista consulta colegas ou especialistas.
7. Analista responde ao cliente ou escala para L2/L3.

## Problemas da Jornada Atual

- Alta fricção na investigação.
- Busca distribuída.
- Diagnóstico inicial inconsistente.
- Pouca rastreabilidade da origem das respostas.
- Escalonamento pode ocorrer antes de esgotar conhecimento disponível.

---

# 7. Jornada Futura

🔵 Fluxo futuro desejado:

1. Cliente abre chamado.
2. Analista L1 envia ou seleciona logs/contexto do ticket.
3. Copiloto interpreta eventos relevantes.
4. Copiloto consulta KB e tickets semelhantes.
5. Copiloto sugere diagnóstico provável.
6. Copiloto apresenta evidências, fontes e nível de confiança.
7. Copiloto sugere próximos passos ou escalonamento quando apropriado.
8. Copiloto gera rascunho de resposta.
9. Analista revisa, decide e envia.

## Princípio Central

🔵 A IA **apoia a decisão**, mas não substitui o analista.

---

# 8. Escopo do MVP

## 8.1 Incluído no MVP

✅ O MVP deve contemplar:

- interpretação de logs em texto;
- identificação de mensagens relevantes;
- indicação de severidade;
- busca em base de conhecimento;
- busca por tickets semelhantes;
- exibição de fontes consultadas;
- sugestão de diagnóstico provável;
- indicação de nível de confiança;
- explicação das evidências utilizadas;
- rascunho de resposta para o cliente;
- sugestão de escalonamento quando a confiança for baixa ou o caso exigir L2/L3;
- solicitação de dados adicionais quando o contexto for insuficiente;
- preservação da decisão humana;
- conformidade básica com LGPD.

## 8.2 Incluído Condicionalmente

⚠️ A sugestão de categorização poderá entrar no MVP apenas se houver:

- taxonomia oficial de categorias;
- campos estruturados disponíveis;
- exemplos históricos suficientes;
- validação com o gestor de suporte.

Caso essas condições não sejam atendidas, a categorização deve ir para o backlog pós-MVP.

## 8.3 Fora do Escopo do MVP

🔵 O MVP não deve contemplar:

- execução automática de ações;
- resposta direta ao cliente sem revisão humana;
- alterações em infraestrutura;
- integração produtiva completa com FreshService;
- automação de correções;
- atualização automática de tickets sem aprovação;
- substituição de fluxos formais de escalonamento;
- treinamento autônomo com dados sensíveis sem governança.

---

# 9. Critérios de Sucesso

| ID | Critério | Resultado Esperado |
|---|---|---|
| CS-01 | Apoiar interpretação de logs | Mensagens relevantes, severidade e hipótese inicial são apresentadas |
| CS-02 | Localizar conhecimento relevante | KB e tickets similares aparecem com fontes rastreáveis |
| CS-03 | Gerar respostas consistentes | Rascunhos seguem tom e estrutura esperados |
| CS-04 | Preservar decisão humana | Nenhuma resposta ou ação é executada sem aprovação |
| CS-05 | Respeitar LGPD | Dados sensíveis são tratados com cuidado e mascaramento quando aplicável |
| CS-06 | Explicar recomendações | Diagnóstico vem acompanhado de evidências, confiança e limitações |
| CS-07 | Reduzir escalonamentos indevidos | Casos simples recorrentes são resolvidos pelo L1 com apoio |
| CS-08 | Melhorar experiência do analista | Analista percebe redução de esforço de pesquisa |

---

# 10. Requisitos Funcionais

## RF-01 — Interpretar Logs

✅ O sistema deve permitir que o analista envie logs em texto para análise.

### Comportamento Esperado

- Receber logs em texto livre.
- Identificar mensagens relevantes.
- Destacar erros, alertas e eventos críticos.
- Indicar severidade.
- Sugerir possível causa.
- Informar quando o contexto for insuficiente.

### Saída Esperada

- resumo do log;
- eventos relevantes;
- severidade;
- hipótese inicial;
- dados faltantes, se houver.

---

## RF-02 — Recuperar Conhecimento

✅ O sistema deve consultar fontes de conhecimento para apoiar a investigação.

### Fontes Previstas

- base de conhecimento;
- tickets antigos;
- documentação operacional disponível;
- registros de soluções recorrentes.

### Comportamento Esperado

- Buscar conteúdos relacionados ao problema.
- Recuperar tickets semelhantes.
- Exibir fontes utilizadas.
- Indicar grau de relevância.
- Diferenciar evidência forte de referência fraca.

### Saída Esperada

- lista de fontes;
- trechos ou resumos relevantes;
- tickets similares;
- relação entre fonte e diagnóstico.

---

## RF-03 — Sugerir Diagnóstico Provável

✅ O sistema deve sugerir diagnóstico com base nos logs e no conhecimento recuperado.

### Comportamento Esperado

- Apresentar hipótese principal.
- Indicar nível de confiança.
- Explicar evidências.
- Listar hipóteses alternativas quando apropriado.
- Informar limitações.

### Saída Esperada

- diagnóstico provável;
- confiança;
- evidências;
- hipóteses alternativas;
- limitação ou incerteza.

---

## RF-04 — Gerar Rascunho de Resposta

✅ O sistema deve gerar um rascunho de resposta para o cliente.

### Comportamento Esperado

- Gerar texto claro e revisável.
- Manter tom profissional.
- Evitar prometer ações não confirmadas.
- Separar o que é diagnóstico provável do que é conclusão confirmada.
- Permitir revisão humana antes do envio.

### Saída Esperada

- rascunho de resposta;
- pontos que exigem validação;
- linguagem adequada ao cliente.

---

## RF-05 — Recomendar Escalonamento

✅ O sistema deve recomendar escalonamento quando o caso exigir apoio de L2/L3.

### Condições de Escalonamento

- baixa confiança no diagnóstico;
- ausência de dados suficientes;
- severidade alta;
- indício de incidente complexo;
- necessidade de permissão ou ação fora do escopo L1;
- recorrência crítica sem solução conhecida.

### Saída Esperada

- recomendação de escalar ou não escalar;
- justificativa;
- evidências;
- dados que devem acompanhar o escalonamento.

---

## RF-06 — Solicitar Dados Adicionais

✅ O sistema deve informar quando o contexto é insuficiente.

### Comportamento Esperado

- Identificar lacunas nos logs ou no ticket.
- Solicitar informações complementares.
- Sugerir perguntas ao cliente ou ao solicitante.
- Evitar diagnóstico assertivo sem evidência mínima.

### Saída Esperada

- lista de dados faltantes;
- perguntas recomendadas;
- justificativa da necessidade.

---

## RF-07 — Sugerir Categorização

⚠️ Requisito condicional.

### Condição para Entrar no MVP

Este requisito só deve entrar no MVP se houver taxonomia oficial de categorias e exemplos históricos suficientes.

### Comportamento Esperado

- Sugerir categoria do ticket.
- Indicar confiança.
- Exibir critérios usados.
- Permitir revisão humana.

---

# 11. Requisitos Não Funcionais

| ID | Requisito | Descrição |
|---|---|---|
| RNF-01 | LGPD | Tratar dados pessoais e sensíveis conforme políticas aplicáveis |
| RNF-02 | Mascaramento | Mascarar dados sensíveis quando necessário |
| RNF-03 | Segurança | Proteger acesso a tickets, KB e logs |
| RNF-04 | Rastreabilidade | Registrar fontes usadas e recomendações geradas |
| RNF-05 | Explicabilidade | Explicar diagnóstico, evidências e limitações |
| RNF-06 | Auditabilidade | Permitir revisão posterior das recomendações |
| RNF-07 | Baixa alucinação | Evitar respostas sem fonte ou sinalizar incerteza |
| RNF-08 | Usabilidade | Resposta deve ser clara para uso operacional pelo L1 |
| RNF-09 | Performance | Tempo de resposta deve ser compatível com atendimento de suporte |
| RNF-10 | Observabilidade | Medir uso, taxa de aceitação e falhas de recuperação |

---

# 12. Regras de Negócio

| ID | Regra | Classificação |
|---|---|---|
| RN-01 | A IA atua como copiloto consultivo, não como agente autônomo | 🔵 |
| RN-02 | O analista mantém a decisão final | 🔵 |
| RN-03 | A IA não responde diretamente ao cliente | 🔵 |
| RN-04 | A IA não executa ações em infraestrutura | 🔵 |
| RN-05 | Recomendações devem indicar origem quando possível | ✅ |
| RN-06 | Diagnósticos devem indicar confiança e limitações | ✅ |
| RN-07 | Quando faltar contexto, a IA deve solicitar mais dados | ✅ |
| RN-08 | Escalonamentos devem considerar confiança, severidade e escopo L1 | ✅ |
| RN-09 | Dados sensíveis devem ser protegidos ou mascarados | ✅ |
| RN-10 | O analista deve revisar todo rascunho antes do envio | 🔵 |
| RN-11 | A ausência de evidência deve ser explicitada | 🔵 |
| RN-12 | A IA deve diferenciar hipótese, evidência e conclusão | 🔵 |

---

# 13. Histórias de Usuário

## HU-01 — Interpretar Logs

**Como** Analista L1,  
**quero** enviar logs ao Copiloto,  
**para** entender rapidamente eventos relevantes e reduzir o tempo de diagnóstico inicial.

### Critérios de Aceite

- Dado um log em texto, quando o analista solicitar apoio, então o sistema deve destacar mensagens relevantes.
- Dado um log com erro identificável, quando a análise for concluída, então o sistema deve indicar severidade.
- Dado um log incompleto, quando não houver evidência suficiente, então o sistema deve informar contexto insuficiente.
- Dado um log analisado, então a resposta deve diferenciar evidência de hipótese.

---

## HU-02 — Recuperar Conhecimento

**Como** Analista L1,  
**quero** receber artigos de KB e tickets semelhantes,  
**para** reutilizar conhecimento existente durante a triagem.

### Critérios de Aceite

- Dado um ticket com contexto, quando o Copiloto buscar conhecimento, então deve retornar fontes relevantes.
- Dado um ticket semelhante encontrado, então o sistema deve indicar por que ele é semelhante.
- Dado conhecimento recuperado, então o sistema deve exibir a origem.
- Dado que nenhuma fonte relevante seja encontrada, então o sistema deve informar essa limitação.

---

## HU-03 — Receber Diagnóstico Provável

**Como** Analista L1,  
**quero** receber uma hipótese de diagnóstico com evidências,  
**para** decidir o próximo passo com mais segurança.

### Critérios de Aceite

- Dado um ticket com log e contexto, quando o analista solicitar apoio, então o sistema apresenta diagnóstico provável.
- A resposta deve informar nível de confiança.
- A resposta deve explicar evidências usadas.
- A resposta deve informar limitações.
- Quando aplicável, a resposta deve sugerir hipóteses alternativas.

---

## HU-04 — Gerar Rascunho de Resposta

**Como** Analista L1,  
**quero** receber um rascunho de resposta ao cliente,  
**para** comunicar o andamento ou solução de forma mais rápida e padronizada.

### Critérios de Aceite

- O rascunho deve ser claro, profissional e revisável.
- O rascunho não deve afirmar conclusões sem evidência.
- O rascunho deve indicar quando há necessidade de dados adicionais.
- O envio final deve depender da aprovação humana.

---

## HU-05 — Recomendar Escalonamento

**Como** Analista L1,  
**quero** saber quando devo escalar um chamado,  
**para** evitar escalonamentos indevidos e garantir tratamento adequado para casos complexos.

### Critérios de Aceite

- O sistema deve recomendar escalonamento quando a confiança for baixa.
- O sistema deve recomendar escalonamento quando houver severidade alta ou escopo fora do L1.
- A recomendação deve incluir justificativa.
- A recomendação deve listar dados que devem acompanhar o escalonamento.

---

# 14. Cenário BDD Principal

```gherkin
Feature: Copiloto para triagem de chamados de suporte

  Scenario: Apoiar Analista L1 na investigação de ticket com log
    Given um ticket com descrição e log técnico
    When o analista solicitar apoio ao Copiloto
    Then o sistema deve apresentar um resumo do log
    And deve destacar mensagens relevantes
    And deve recuperar fontes da KB e tickets semelhantes quando disponíveis
    And deve sugerir um diagnóstico provável
    And deve informar nível de confiança
    And deve explicar as evidências utilizadas
    And deve explicitar limitações ou dados faltantes
    And deve gerar um rascunho de resposta revisável
    And não deve executar ações nem responder diretamente ao cliente
```

---

# 15. Rastreabilidade

| Dor | Requisito | Funcionalidade | Critério de Sucesso |
|---|---|---|---|
| D-01 Busca manual em múltiplas fontes | RF-02 | Recuperação de KB e tickets | CS-02 |
| D-02 Conhecimento concentrado | RF-02, RF-03 | Casos semelhantes e diagnóstico | CS-02, CS-07 |
| D-03 Interpretação difícil de logs | RF-01 | Análise de logs | CS-01 |
| D-04 Respostas pouco padronizadas | RF-04 | Rascunho de resposta | CS-03 |
| D-05 Escalonamentos incompletos | RF-05, RF-06 | Recomendação de escalonamento e dados faltantes | CS-07 |
| D-06 Baixa rastreabilidade | RF-02, RF-03, RNF-04 | Fontes, evidências e confiança | CS-06 |

---

# 16. Backlog de Épicos e Features

| ID | Épico/Feature | Status | Responsável | Observações |
|---|---|---|---|---|
| F-01 | Interpretação de logs | Pronto para Tech Context | @engineer | Base do MVP |
| F-02 | Recuperação de KB | Pronto para Tech Context | @engineer | Depende da estrutura da KB |
| F-03 | Recuperação de tickets semelhantes | Pronto para Tech Context | @engineer | Depende de acesso/histórico |
| F-04 | Diagnóstico provável com confiança | Pronto para Tech Context | @engineer | Deve ser explicável |
| F-05 | Rascunho de resposta ao cliente | Pronto para Tech Context | @engineer | Revisão humana obrigatória |
| F-06 | Recomendação de escalonamento | Pronto para Tech Context | @engineer | Usar confiança, severidade e escopo |
| F-07 | Solicitação de dados adicionais | Pronto para Tech Context | @engineer | Evitar conclusões sem contexto |
| F-08 | Sugestão de categorização | Condicional | @product | Depende de taxonomia e exemplos históricos |
| F-09 | Integração produtiva completa FreshService | Pós-MVP | — | Fora do escopo do MVP |
| F-10 | Automação de ações corretivas | Fora do escopo | — | Não permitido nesta fase |

---

# 17. KPIs e Métricas de Produto

## 17.1 KPIs Principais

| KPI | Objetivo | Direção Esperada |
|---|---|---|
| MTTR/TMR | Medir tempo total de resolução | Reduzir |
| TMA | Medir tempo médio de atendimento | Reduzir |
| FCR | Medir resolução no primeiro contato/nível | Aumentar |
| Escalonamentos | Medir volume de chamados enviados para L2/L3 | Reduzir indevidos |
| Reabertura de chamados | Medir qualidade da resolução | Reduzir |
| SLA | Medir cumprimento de prazos | Aumentar cumprimento |
| CSAT | Medir satisfação do cliente | Aumentar |
| NPS | Medir percepção geral de valor | Aumentar |

## 17.2 Métricas Operacionais do Copiloto

| Métrica | Objetivo |
|---|---|
| Taxa de uso por analista | Medir adoção |
| Taxa de aceitação de rascunhos | Medir utilidade da comunicação |
| Taxa de diagnóstico útil | Medir qualidade percebida |
| Taxa de resposta com fonte | Medir rastreabilidade |
| Taxa de contexto insuficiente | Medir qualidade dos dados de entrada |
| Tempo de resposta do Copiloto | Medir viabilidade operacional |
| Feedback positivo/negativo por recomendação | Melhorar produto e governança |

---

# 18. Riscos

| ID | Risco | Impacto | Mitigação |
|---|---|---|---|
| R-01 | Baixa qualidade da KB | Recomendações fracas ou incorretas | Curadoria, ranking de fontes e sinalização de confiança |
| R-02 | Logs incompletos | Diagnóstico impreciso | RF-06: solicitar dados adicionais |
| R-03 | Resistência dos usuários | Baixa adoção | UX simples, explicabilidade e piloto com L1 |
| R-04 | Limitações das APIs do FreshService | Integração limitada | MVP desacoplado e integração produtiva pós-MVP |
| R-05 | Dados sensíveis nos logs | Risco LGPD | Mascaramento, políticas de retenção e controle de acesso |
| R-06 | Alucinação da IA | Perda de confiança | RAG com fontes, confiança e limitações explícitas |
| R-07 | Escalonamento incorreto | Retrabalho ou atraso | Regras de confiança, severidade e revisão humana |
| R-08 | Base histórica pouco padronizada | Similaridade ruim | Normalização, metadados e avaliação de relevância |

---

# 19. Premissas

| ID | Premissa |
|---|---|
| P-01 | Haverá acesso a uma base de conhecimento ou amostra representativa para o MVP |
| P-02 | Haverá histórico de tickets suficiente para buscar casos semelhantes |
| P-03 | Analistas revisarão respostas antes de enviar ao cliente |
| P-04 | O MVP poderá ser validado inicialmente sem integração produtiva completa |
| P-05 | APIs ou exportações do FreshService estarão disponíveis para evolução futura |
| P-06 | A organização aceitará um modelo consultivo com decisão humana obrigatória |
| P-07 | Haverá diretrizes mínimas de LGPD, segurança e mascaramento |
| P-08 | O gestor de suporte participará da validação dos critérios de sucesso |

---

# 20. Itens Pendentes

| ID | Pendência | Impacto | Responsável Sugerido |
|---|---|---|---|
| Pend-01 | Estrutura da KB da Clear IT | Define estratégia de recuperação | Produto + Engenharia |
| Pend-02 | Tipos de logs mais frequentes | Define parsing e prompts de análise | Produto + Suporte |
| Pend-03 | Fluxo L1 → L2/L3 | Define regra de escalonamento | Produto + Operação |
| Pend-04 | Categorias mais frequentes | Define viabilidade de categorização | Produto + Gestão |
| Pend-05 | Templates oficiais de resposta | Define qualidade dos rascunhos | Produto + Gestão |
| Pend-06 | Política de mascaramento de dados | Define requisitos de segurança | Compliance + Engenharia |
| Pend-07 | Amostra de tickets históricos | Define validação de similaridade | Operação + Engenharia |
| Pend-08 | Critérios mínimos de confiança | Define regra de diagnóstico e escalonamento | Produto + Engenharia |

---

# 21. Decisões de Produto

| ID | Decisão | Justificativa |
|---|---|---|
| DP-01 | O Copiloto será consultivo | Reduz risco operacional e preserva decisão humana |
| DP-02 | O foco inicial será Analista L1 | Maior impacto em triagem, MTTR/TMA e escalonamento |
| DP-03 | A IA não substituirá o analista | Necessário para governança, qualidade e aceitação |
| DP-04 | Conhecimento será tratado como ativo central | KB e tickets históricos são a base de valor do produto |
| DP-05 | Evidências e fontes serão obrigatórias quando disponíveis | Aumenta confiança e auditabilidade |
| DP-06 | Diagnóstico deve sempre indicar confiança | Evita falsa certeza |
| DP-07 | Integração produtiva completa será pós-MVP | Reduz risco e acelera validação |
| DP-08 | Categorização será condicional | Depende de taxonomia e dados históricos |
| DP-09 | Escalonamento será recomendado, não executado | Mantém controle operacional com o analista |
| DP-10 | Rascunhos sempre exigirão revisão humana | Evita comunicação incorreta ao cliente |

---

# 22. Roadmap

## Fase 1 — Descoberta e Validação

- Consolidar contexto de negócio.
- Validar dores com analistas e gestor.
- Levantar fontes disponíveis.
- Confirmar tipos de logs e templates oficiais.

## Fase 2 — Protótipo

- Criar fluxo simulado de análise de ticket.
- Testar interpretação de logs.
- Testar recuperação de KB/tickets com amostra.
- Validar formato de resposta com L1.

## Fase 3 — MVP

- Implementar análise de logs.
- Implementar recuperação de conhecimento.
- Implementar diagnóstico provável com confiança.
- Implementar rascunho de resposta.
- Implementar recomendação de escalonamento.
- Implementar feedback básico do analista.

## Fase 4 — Validação Operacional

- Medir KPIs.
- Coletar feedback qualitativo.
- Avaliar redução de esforço de pesquisa.
- Ajustar critérios de confiança.
- Priorizar backlog pós-MVP.

## Fase 5 — Evolução Pós-MVP

- Integração produtiva completa com FreshService.
- Categorização automática, se validada.
- Métricas avançadas.
- Curadoria assistida de KB.
- Painel gerencial.

---

# 23. Glossário

| Termo | Definição |
|---|---|
| KB | Knowledge Base, base de conhecimento |
| RAG | Retrieval-Augmented Generation, geração aumentada por recuperação de fontes |
| MTTR | Mean Time To Resolution, tempo médio até resolver |
| TMR | Tempo Médio de Resolução |
| TMA | Tempo Médio de Atendimento |
| FCR | First Contact Resolution ou resolução no primeiro contato/nível |
| SLA | Service Level Agreement, acordo de nível de serviço |
| CSAT | Customer Satisfaction Score |
| NPS | Net Promoter Score |
| L1 | Suporte de primeiro nível |
| L2/L3 | Suporte de segundo/terceiro nível |
| FreshService | Plataforma de gestão de tickets mencionada no discovery |
| Copiloto | IA consultiva que apoia, mas não decide nem executa ações |

---

# 24. Autoavaliação do Kick-off

## Nota Geral

**4.8 / 5**

## Pontos Fortes

- Problema de negócio claro e recorrente.
- Personas e dores bem delimitadas.
- MVP com escopo consultivo e seguro.
- Critérios de aceite mais testáveis.
- Rastreabilidade entre dores, requisitos e funcionalidades.
- KPIs, riscos e premissas reincorporados.
- Decisões de produto explícitas antes da engenharia.

## Oportunidades de Melhoria

- Validar estrutura real da KB da Clear IT.
- Obter amostra representativa de logs e tickets.
- Definir taxonomia oficial para categorização.
- Confirmar templates oficiais de resposta.
- Definir thresholds de confiança para diagnóstico e escalonamento.

## Ações Corretivas

- Levantar fontes reais disponíveis para o MVP.
- Refinar requisitos técnicos de RAG no Technical Context.
- Criar matriz de severidade e confiança.
- Validar fluxo L1 → L2/L3 com operação.
- Definir política mínima de LGPD e mascaramento.

---

# 25. Status Final

✅ **Produto aprovado para iniciar o Technical Context.**

## Validação de Escopo — Sprint 1

- **Escopo aprovado em:** 2026-06-25
- **Aprovado por:** [ Beatriz Gadelha e ]
- **Papel do aprovador:** [ Avaliador do Projeto, Representante do Cliente ]
- **Status da validação:** Aprovado com ajustes menores

### Itens dentro do escopo do MVP

- Interpretação de logs em texto
- Recuperação de KB e tickets similares
- Diagnóstico provável com confiança e evidências
- Rascunho de resposta ao cliente
- Recomendação de escalonamento
- Solicitação de dados adicionais
- Conformidade básica com LGPD

### Itens fora do escopo do MVP

- Execução automática de ações
- Resposta direta ao cliente sem revisão humana
- Integração produtiva completa com FreshService
- Alterações em infraestrutura
- Treinamento autônomo com dados sensíveis
- Automação de ações corretivas

### Restrições confirmadas

- RN-01 — Copiloto consultivo
- RN-02 — Analista mantém a decisão final
- RN-03 — IA não responde diretamente ao cliente
- RN-09 — Dados sensíveis devem ser protegidos ou mascarados
- RN-10 — Rascunhos exigem revisão humana

### Próxima revisão

A próxima revisão de escopo deve ocorrer ao iniciar o Technical Context / PoC.

## Condições para Engenharia

O `@engineer` pode iniciar o `technical-context-lite.md`, considerando:

- a IA deve ser consultiva;
- a decisão final é sempre humana;
- execução automática está fora do escopo;
- resposta direta ao cliente sem revisão está fora do escopo;
- integração produtiva completa com FreshService é pós-MVP;
- RAG com fontes, confiança e evidências é essencial;
- LGPD, segurança, mascaramento e rastreabilidade devem entrar desde o desenho técnico.

## Próxima Ação Recomendada

Ativar **@engineer** para criar o plano técnico inicial, cobrindo:

1. arquitetura lógica do Copiloto;
2. estratégia de RAG para KB e tickets;
3. fluxo de análise de logs;
4. modelo de confiança e evidências;
5. requisitos de segurança, LGPD e rastreabilidade;
6. plano de implementação incremental do MVP.
