# Business Context — Copiloto para Analistas de Suporte L1 Clear IT

> **Versão:** v6.0 — Contexto completo consolidado  
> **Data:** 2026-07-04  
> **Persona Onion responsável:** `@product` com sincronismo `@docs`  
> **Projeto:** Copiloto de IA para Analistas de Suporte L1 — Clear IT  
> **Fase atual:** PoC simples concluída/gerada como etapa anterior ao MVP  
> **Próxima fase planejada:** MVP sem integração direta com FreshService  
> **Regra Onion:** Produto antes de Engenharia; Engenharia antes de código.

---

## 1. Visão do Produto

O produto proposto é um **Copiloto de IA consultivo para Analistas de Suporte L1** da Clear IT.

A proposta é apoiar o analista durante a triagem e diagnóstico inicial de incidentes, especialmente quando há necessidade de interpretar tickets, logs, alertas, histórico de casos, procedimentos internos, playbooks e bases de conhecimento.

O Copiloto deve ajudar o analista a:

1. interpretar a descrição do chamado e logs anexados;
2. identificar sinais técnicos relevantes;
3. consultar uma base de conhecimento controlada;
4. sugerir diagnóstico provável com evidências;
5. indicar nível de confiança;
6. recomendar resolução, pedido de mais dados ou escalonamento;
7. gerar rascunho de resposta para revisão humana;
8. registrar feedback humano para melhoria posterior.

O produto **não substitui o analista**. A IA atua como apoio consultivo. A decisão final continua sendo humana.

---

## 2. Contexto Atual do Processo

Atualmente, quando um cliente abre chamado no FreshService, o analista de suporte recebe o ticket e realiza triagem manual.

O fluxo atual envolve:

- leitura do chamado;
- identificação do tipo de incidente;
- consulta manual a bases de conhecimento;
- consulta a FAQs, playbooks e procedimentos;
- pesquisa em históricos de casos semelhantes;
- consulta a bases externas de fabricantes quando aplicável;
- elaboração manual da resposta ao cliente;
- registro da solução no FreshService ou outro repositório;
- em casos específicos, abertura de chamado junto à fabricante;
- eventual escalonamento para L2/L3.

O briefing confirma que esse processo é crítico para continuidade dos serviços, SLAs, satisfação do cliente, retenção e reputação da empresa.

---

## 3. Áreas e Usuários Impactados

### 3.1 Usuário principal

- Analistas de Suporte L1.

### 3.2 Usuários indiretos

- Analistas L2/L3;
- coordenação de suporte;
- lideranças de Serviços/Governança;
- clientes atendidos;
- áreas de Produtos/Projetos em casos recorrentes ou estruturais.

### 3.3 Responsáveis do desafio citados no briefing

- Responsável Executivo: Alexandre Guidorzi — Head de Serviços e Governança.
- Responsável Operacional: Ana Paula Costa — Coordenadora de Suporte e Governança.

Observação: a interação com a Clear IT deve ser mediada pela Pulse Mais e pelo Consultor Executivo designado. Responsáveis da Clear IT podem ser acionados pontualmente para validações assíncronas.

---

## 4. Dores do Cliente

### D-01 — Busca manual em múltiplas fontes

O analista precisa navegar entre FreshService, KBs internas, documentos, playbooks, PDFs, wikis, históricos de casos e bases de fabricantes.

**Impacto:** maior tempo de triagem e maior risco de perda de informação relevante.

---

### D-02 — Dificuldade de analistas juniores

Analistas L1, especialmente os mais novos, têm dificuldade para encontrar rapidamente o caminho correto para diagnóstico em incidentes de infraestrutura complexa.

**Impacto:** maior dependência de analistas experientes e aumento de escalonamentos.

---

### D-03 — Conhecimento pouco reaproveitado

Casos similares já resolvidos nem sempre são facilmente encontrados. Parte do conhecimento fica retida em históricos antigos ou conhecimento tribal.

**Impacto:** retrabalho e diagnóstico começando do zero.

---

### D-04 — Respostas heterogêneas

Respostas construídas manualmente podem variar muito entre analistas.

**Impacto:** experiência inconsistente para o cliente e risco de comunicação técnica imprecisa.

---

### D-05 — Escalonamentos desnecessários

Quando o L1 não encontra informação suficiente, precisa escalar. Parte desses escalonamentos pode ocorrer por falta de acesso rápido à evidência já existente.

**Impacto:** sobrecarga L2/L3 e maior TMR/MTTR.

---

### D-06 — Interpretação de logs e alertas consome tempo

Logs brutos e alertas de monitoramento exigem leitura, interpretação e correlação com documentação.

**Impacto:** triagem lenta e maior risco de erro em incidentes complexos.

---

## 5. Valor Esperado

A solução deve gerar valor ao:

- reduzir esforço manual de busca;
- apoiar analistas L1 na triagem;
- padronizar diagnóstico e comunicação;
- reaproveitar conhecimento já existente;
- reduzir escalonamentos desnecessários;
- aumentar assertividade das respostas;
- melhorar capacidade de resolução no primeiro nível;
- criar trilha de evidência para auditoria e aprendizado.

---

## 6. Indicadores de Valor

Indicadores mencionados no briefing:

- TMR / MTTR — Tempo Médio de Resolução;
- TMA — Tempo Médio de Atendimento;
- cumprimento de SLA;
- volume de tickets por analista;
- taxa de reabertura;
- CSAT / NPS;
- FCR — First Call Resolution;
- taxa de escalonamento para L2/L3.

### Observação importante

O briefing confirma quais indicadores são relevantes, mas **não fornece baselines atuais nem metas numéricas**.

Portanto, o projeto não deve prometer reduções quantitativas específicas sem dados de referência.

---

## 7. Decisões Confirmadas

| ID | Decisão | Status | Fonte / Observação |
|---|---|---|---|
| DEC-BIZ-001 | A solução será um Copiloto consultivo para L1. | Confirmada | Briefing e alinhamento de projeto. |
| DEC-BIZ-002 | A PoC é uma etapa anterior ao MVP. | Confirmada | Decisão do usuário. |
| DEC-BIZ-003 | O MVP será planejado sem integração direta ao FreshService neste momento. | Confirmada | Decisão do usuário. |
| DEC-BIZ-004 | FreshService é o sistema central do processo atual. | Confirmada | Briefing. |
| DEC-BIZ-005 | FreshService será referência de processo, não integração técnica obrigatória do MVP. | Confirmada | Decisão do usuário + restrições do briefing. |
| DEC-BIZ-006 | O provedor de IA será Claude. | Confirmada | Decisão do usuário. |
| DEC-BIZ-007 | Dados sensíveis devem ser anonimizados antes de processamento por IA. | Confirmada | Briefing. |
| DEC-BIZ-008 | A IA não deve enviar resposta automaticamente ao cliente. | Confirmada | Caráter consultivo definido no briefing. |
| DEC-BIZ-009 | A decisão final continua humana. | Confirmada | Briefing + regra de revisão humana. |
| DEC-BIZ-010 | O MVP deve validar uso operacional controlado antes de qualquer integração produtiva. | Confirmada | Decisão de escopo. |

---

## 8. Materiais Disponíveis para PoC/MVP

O briefing informa que poderão apoiar o projeto:

- fluxogramas do processo atual de atendimento L1 a L3;
- massa de dados exportada com exemplos de chamados e logs estritamente anonimizada;
- base de conhecimento exportada;
- playbooks;
- artigos internos;
- procedimentos de workaround;
- prints das telas do FreshService com dados sensíveis tarjados;
- exemplos de casos de uso de incidentes comuns;
- caso de uso: Alerta de Alto Uso de Disco em CVM;
- caso de uso: Falha no Cluster por Crash do Serviço Acropolis.

### Observação

A disponibilidade desses materiais não significa que todos já estão aprovados para uso no MVP. A seleção final deve ser validada.

---

## 9. Escopo da PoC Simples

A PoC simples foi criada como validação local e controlada antes do MVP.

### Objetivo da PoC

Validar se o fluxo mínimo do Copiloto faz sentido para apoiar L1:

```text
Ticket/log
↓
Mascaramento básico
↓
Extração de sinais técnicos
↓
Busca simulada em KB controlada
↓
Diagnóstico provável
↓
Nível de confiança
↓
Recomendação de escalonamento
↓
Rascunho revisável
↓
Avaliação humana
```

### A PoC simples inclui

- interface HTML local;
- entrada manual de ticket/log;
- exemplos baseados nos casos do briefing;
- mascaramento básico em navegador;
- KB simulada/local;
- diagnóstico baseado em correspondência simples;
- confiança Alta/Média/Baixa;
- recomendação de escalonamento;
- rascunho revisável;
- scorecard humano;
- casos de teste em JSON;
- scorecard em CSV;
- notas para MVP.

### A PoC simples não inclui

- integração com FreshService;
- chamada real ao Claude;
- dados produtivos;
- banco vetorial;
- autenticação;
- persistência;
- auditoria real;
- execução de comandos;
- envio automático ao cliente.

---

## 10. Critérios de Sucesso da PoC

A PoC pode ser considerada suficiente para avançar ao planejamento do MVP se, em amostra controlada, demonstrar que:

1. o analista entende o fluxo;
2. a entrada manual de ticket/log é viável para demonstração;
3. o mascaramento reduz risco de exposição de dados;
4. o Copiloto retorna diagnóstico útil ou parcialmente útil;
5. a resposta inclui evidência rastreável;
6. o nível de confiança ajuda a decidir;
7. a recomendação de escalonamento é compreensível;
8. o rascunho de resposta é aproveitável com revisão humana;
9. não há exposição de dados sensíveis;
10. o time considera que vale evoluir para MVP.

Critério sugerido: pelo menos 70% dos casos avaliados como úteis ou parcialmente úteis, sempre com revisão humana.

Esse número é uma sugestão operacional para avaliação da PoC, não uma meta oficial da Clear IT.

---

## 11. Escopo Planejado do MVP Sem FreshService

O MVP será a próxima etapa após validação da PoC.

### Objetivo do MVP

Criar uma primeira versão utilizável do Copiloto em ambiente controlado, sem integração direta ao FreshService, capaz de apoiar o analista L1 em casos reais ou simulados com dados anonimizados.

### O MVP deve incluir

- interface web para analista;
- entrada manual de ticket/log;
- possibilidade de importar arquivo ou texto exportado, se aprovado;
- anonimização mais robusta;
- uso de Claude como provedor de IA;
- busca em KB controlada;
- RAG ou mecanismo equivalente de recuperação de evidências;
- geração de diagnóstico provável;
- evidências citadas;
- confiança;
- recomendação de resolução, pedido de mais dados ou escalonamento;
- rascunho de resposta revisável;
- registro de avaliação humana;
- histórico/auditoria básica de uso;
- separação clara entre sugestão da IA e decisão humana.

### O MVP não deve incluir agora

- leitura automática de tickets no FreshService;
- escrita automática no FreshService;
- comentários automáticos em tickets;
- envio de resposta ao cliente;
- sincronização de anexos;
- integração produtiva via API;
- acesso a ambiente produtivo da Clear IT;
- uso de dados reais não anonimizados.

---

## 12. FreshService no Projeto

FreshService permanece muito importante no contexto de negócio, mas não será integrado no MVP atual.

### Papel do FreshService agora

- sistema de referência do processo real;
- origem conceitual dos tickets;
- inspiração para campos de entrada;
- fonte futura possível de integração;
- referência para padrão de comunicação e registro.

### O que fica para etapa futura

- autenticação via FreshService;
- leitura de tickets via API;
- escrita de comentários;
- anexos;
- sincronização de status;
- categorização automática;
- roteamento automático;
- integração produtiva completa.

### Motivo da exclusão do MVP atual

- briefing restringe acesso produtivo direto;
- API depende de validação, permissões e segurança;
- foco atual é provar o valor do fluxo;
- integração aumentaria escopo e risco prematuramente;
- o MVP sem FreshService permite avançar com segurança.

---

## 13. Backlog de Épicos e Features

| ID | Épico / Feature | Status | Observações |
|---|---|---|---|
| F-001 | PoC simples local | Gerada | HTML local sem dependências, criada como etapa pré-MVP. |
| F-002 | Casos de teste da PoC | Gerada | Inclui CVM, Acropolis e caso inconclusivo. |
| F-003 | Scorecard de avaliação humana | Gerada | CSV e UI simples na PoC. |
| F-004 | Definição do MVP sem FreshService | Pronto para Planejamento | Decisão confirmada pelo usuário. |
| F-005 | Interface web do MVP | A Fazer | Entrada manual/importação controlada. |
| F-006 | Anonimização robusta | A Fazer | Deve mascarar PII, cliente e topologia identificável. |
| F-007 | Integração com Claude | A Fazer | Provedor confirmado; modelo/acesso pendentes. |
| F-008 | KB controlada / RAG | A Fazer | Fonte exata e mecanismo técnico pendentes. |
| F-009 | Diagnóstico com evidências | A Fazer | Deve citar evidências recuperadas. |
| F-010 | Confiança e guardrails | A Fazer | Alta/Média/Baixa + bloqueio de alucinação. |
| F-011 | Recomendação de escalonamento | A Fazer | Resolver, pedir dados ou escalar. |
| F-012 | Rascunho revisável | A Fazer | Sem envio automático ao cliente. |
| F-013 | Feedback humano | A Fazer | Aceito/editado/rejeitado e motivo. |
| F-014 | Auditoria básica | A Fazer | Registro seguro, sem dados sensíveis expostos. |
| F-015 | Integração FreshService | Futuro / Fora do MVP atual | Somente pós-MVP, se validada. |

---

## 14. Especificação Ativa — MVP Sem FreshService

### História de usuário principal

Como **analista de suporte L1**, quero inserir ou importar de forma controlada um ticket/log anonimizado em um Copiloto, para receber diagnóstico provável, evidências, nível de confiança, recomendação de escalonamento e rascunho de resposta, reduzindo o esforço de triagem sem perder revisão humana.

---

## 15. Critérios de Aceite do MVP

### AC-001 — Entrada controlada

Dado que sou analista L1, quando inserir texto de ticket/log ou arquivo permitido, então o sistema deve aceitar a entrada sem depender de integração com FreshService.

### AC-002 — Anonimização

Dado que a entrada pode conter dados sensíveis, quando o conteúdo for processado, então o sistema deve aplicar mascaramento antes de qualquer chamada ao Claude.

### AC-003 — Bloqueio de dados sensíveis

Dado que o conteúdo contenha PII, cliente identificável, segredo, token ou topologia sensível não mascarada, então o sistema deve bloquear ou sinalizar antes de enviar para IA.

### AC-004 — Recuperação de evidências

Dado que exista KB controlada relevante, quando o caso for analisado, então o sistema deve retornar evidências rastreáveis usadas na sugestão.

### AC-005 — Diagnóstico provável

Dado um ticket/log com evidência suficiente, quando o Copiloto responder, então deve apresentar diagnóstico provável separado de fatos confirmados.

### AC-006 — Confiança

Dado que o Copiloto gere uma sugestão, então deve informar confiança Alta, Média ou Baixa com justificativa.

### AC-007 — Escalonamento

Dado que a confiança seja baixa, que faltem evidências ou que o caso exija confirmação L2/L3, então o Copiloto deve recomendar pedir mais dados ou escalar.

### AC-008 — Rascunho revisável

Dado que exista diagnóstico e próximos passos, quando o Copiloto gerar resposta ao cliente, então o texto deve aparecer como rascunho, nunca como envio automático.

### AC-009 — Revisão humana

Dado que o analista revise a sugestão, então o sistema deve permitir classificar como aceita, editada ou rejeitada.

### AC-010 — Sem FreshService

Dado o escopo atual do MVP, quando o sistema for usado, então ele não deve ler, escrever ou sincronizar dados diretamente com FreshService.

---

## 16. Regras de Negócio

1. A IA é consultiva.
2. O analista humano decide.
3. Nenhum dado sensível deve ser enviado ao Claude sem anonimização.
4. O MVP não terá integração FreshService.
5. FreshService é referência de processo, não componente técnico do MVP.
6. Bases externas só podem ser usadas se públicas, autorizadas ou previamente exportadas.
7. A solução deve diferenciar fatos, hipóteses e recomendações.
8. Diagnóstico sem evidência suficiente deve gerar baixa confiança.
9. A resposta ao cliente deve ser rascunho revisável.
10. Toda saída deve conter evidências ou justificar ausência de evidência.
11. Casos críticos devem recomendar escalonamento ou validação L2/L3.
12. Métricas quantitativas só podem ser prometidas após baseline.

---

## 17. Pendências de Produto

| ID | Pendência | Status | Observação |
|---|---|---|---|
| P-BIZ-001 | Baseline de MTTR/TMR | Pendente | Necessário para medir redução real. |
| P-BIZ-002 | Baseline de FCR | Pendente | Necessário para medir aumento de resolução no primeiro contato. |
| P-BIZ-003 | Baseline de escalonamento L2/L3 | Pendente | Necessário para medir redução real. |
| P-BIZ-004 | Critério formal PoC → MVP | Parcial | Sugestão de 70% ainda precisa validação. |
| P-BIZ-005 | Lista oficial de dados sensíveis | Pendente | A política inicial precisa ser validada. |
| P-BIZ-006 | Seleção oficial da KB | Pendente | Quais artigos/playbooks entram no MVP. |
| P-BIZ-007 | Avaliadores técnicos | Pendente | Quem aprova a qualidade das respostas. |
| P-BIZ-008 | Escopo de casos do MVP | Parcial | Dois casos já citados; amostra completa pendente. |
| P-BIZ-009 | Padrão oficial de comunicação ao cliente | Pendente | Necessário para rascunhos mais fiéis. |

---

## 18. Fora de Escopo Atual

### Fora da PoC

- Claude real;
- FreshService;
- produção;
- dados reais;
- banco vetorial;
- autenticação;
- auditoria real.

### Fora do MVP atual

- integração FreshService;
- envio automático;
- execução de comandos;
- alteração de tickets;
- acesso produtivo;
- automação de roteamento;
- scraping não autorizado de bases externas;
- processamento de dados não anonimizados.

---

## 19. Próximas Ações Recomendadas

1. Validar a PoC simples com 3 a 10 casos.
2. Registrar feedback humano no scorecard.
3. Confirmar quais itens da KB entram no MVP.
4. Confirmar formato de entrada do MVP.
5. Confirmar política de anonimização.
6. Planejar `@engineer plan` do MVP sem FreshService.
7. Só então iniciar implementação.

---

## 20. Controle Anti-Alucinação

Este documento não define fatos que ainda não foram confirmados.

Não foram definidos:

- stack de implementação;
- modelo Claude específico;
- custos;
- cloud;
- banco de dados;
- banco vetorial;
- metas numéricas oficiais;
- credenciais;
- endpoints FreshService;
- artigos específicos da KB;
- política final de retenção de dados.

Esses pontos permanecem pendentes até validação.
