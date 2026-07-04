# Business Context v4.1 — Desafio B: Copiloto para Analistas de Suporte

> **Versão:** 4.1 — Consolidação final de Produto; v4 como base, incorporando objetivos estratégicos, hipóteses e critérios de sucesso da v3  
> **Data:** 2026-07-04  
> **Status:** Pronto para validação final de Produto e encaminhamento ao `@engineer`  
> **Persona responsável:** `@product` / `@docs Sync`  
> **Regra Onion:** Produto antes de Engenharia; Engenharia antes de código.  
> **Nota anti-alucinação:** Este documento separa informações **confirmadas**, **parcialmente confirmadas** e **pendentes**. Nenhuma meta numérica foi inventada.
> **Nota v4.1:** Esta versão preserva a abordagem de PoC consultiva da v4 e reincorpora da v3 os blocos de objetivos estratégicos, hipóteses de produto e critérios de sucesso para fortalecer rastreabilidade e verificabilidade.

---

## Classificação das Informações

- ✅ **Confirmado:** Informação presente no briefing completo, no pacote do projeto ou informada diretamente pelo usuário.
- 🟡 **Parcialmente confirmado:** Informação com evidência suficiente para orientar a PoC, mas ainda dependente de validação operacional.
- 🔵 **Decisão de Produto:** Diretriz assumida para orientar o escopo.
- ⚠️ **Pendente:** Item ainda não confirmado por fonte disponível.
- 🚫 **Fora do escopo atual:** Item não recomendado para PoC/MVP inicial.

---

# 1. Resumo Executivo

## 1.1 Problema de Negócio

✅ Analistas de suporte L1 da área de Serviços da Clear IT gastam tempo relevante interpretando tickets e logs, pesquisando em múltiplas fontes e reconstruindo diagnósticos que podem já existir em bases internas, tickets anteriores, playbooks, PDFs, wikis ou documentações de fabricantes.

O briefing completo reforça que o fluxo atual envolve:

- abertura de chamado no FreshService;
- triagem inicial pelo analista;
- leitura da descrição do problema;
- busca em base de conhecimento;
- consulta a FAQs, procedimentos internos e externos;
- pesquisa em histórico de casos semelhantes;
- elaboração de resposta ao cliente;
- registro da solução no FreshService ou em outro repositório;
- em casos específicos, abertura de chamados na fabricante.

## 1.2 Dores confirmadas

✅ As dores centrais são:

1. **Busca manual em múltiplas fontes:** FreshService, KB interna, playbooks, PDFs, wikis, tickets históricos e documentação de fabricantes.
2. **Interpretação lenta de logs:** leitura de logs brutos e alertas consome tempo da equipe.
3. **Conhecimento disperso ou tribal:** parte do conhecimento fica em tickets antigos ou na experiência de especialistas.
4. **Curva de aprendizado longa para L1:** analistas juniores têm dificuldade para encontrar rapidamente o caminho correto de diagnóstico.
5. **Respostas heterogêneas:** comunicação técnica ao cliente varia entre analistas.
6. **Escalonamentos evitáveis:** parte dos chamados é escalada porque o L1 não encontra evidência, procedimento ou confiança suficiente.
7. **Baixo reaproveitamento de conhecimento:** casos semelhantes são pesquisados e resolvidos do zero.

## 1.3 Visão do Produto

🔵 Construir uma **PoC consultiva de Copiloto de IA para Analistas de Suporte L1**, alinhada ao fluxo do FreshService, que apoie a triagem de chamados por meio de:

- interpretação de tickets e logs anonimizados;
- recuperação de conhecimento em KB controlada;
- identificação de evidências e casos semelhantes;
- sugestão de diagnóstico provável;
- indicação de nível de confiança;
- recomendação de coleta de dados adicionais;
- recomendação de escalonamento quando necessário;
- geração de rascunho de resposta para revisão humana.

A IA **não substitui o analista**. A decisão final continua com a pessoa responsável pelo atendimento.

## 1.4 Proposta de Valor

Transformar a busca passiva e manual por conhecimento em uma entrega ativa de recomendações contextualizadas, rastreáveis e seguras.

Valor esperado:

- reduzir esforço de triagem;
- acelerar diagnóstico inicial;
- aumentar autonomia de analistas L1;
- reduzir dependência de especialistas para casos conhecidos;
- padronizar comunicação técnica;
- melhorar reaproveitamento da KB e de casos históricos;
- reduzir escalonamentos desnecessários;
- apoiar cumprimento de SLA e qualidade percebida pelo cliente.

## 1.5 Objetivos Estratégicos

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

⚠️ Estes objetivos são direcionadores estratégicos. Metas quantitativas específicas dependem de baseline operacional fornecido pela Clear IT.

## 1.6 Pergunta principal do desafio

✅ Como apoiar analistas de suporte L1 com um Copiloto de IA alinhado ao FreshService que interprete logs, consolide conhecimento técnico, sugira diagnósticos precisos e gere rascunhos de resposta, reduzindo MTTR/TMR e escalonamentos desnecessários?

---

# 2. Stakeholders e Público Impactado

| Perfil | Interesse Principal | Valor Esperado | Status |
|---|---|---|---|
| Analista L1 | Resolver chamados com mais autonomia e velocidade | Diagnóstico provável, evidências, próximos passos e rascunho de resposta | ✅ Confirmado |
| Analista L2/L3 | Receber casos realmente complexos e melhor contextualizados | Menos escalonamentos indevidos e handoff mais claro | ✅ Confirmado |
| Líderes/Coordenação de Suporte | Melhorar produtividade, SLA e qualidade operacional | Indicadores melhores, padronização e rastreabilidade | ✅ Confirmado |
| Cliente Final | Receber respostas mais rápidas e consistentes | Menor tempo de indisponibilidade e comunicação mais clara | ✅ Confirmado |
| Pulse Mais / Consultor Executivo | Mediar validações e contato com Clear IT | Governança do desafio e validação assíncrona | ✅ Confirmado |
| Compliance/Segurança | Garantir confidencialidade, LGPD e uso seguro da IA | Anonimização, controle de dados e auditoria | ✅ Confirmado |

---

# 3. Personas

## 3.1 Analista L1

✅ **Responsabilidades**

- Receber e triagem inicial de tickets.
- Interpretar sintomas, logs e alertas.
- Buscar informações em KB, tickets, playbooks e documentação.
- Elaborar comunicação técnica ao cliente.
- Escalar quando faltar evidência, procedimento, autorização ou confiança suficiente.

✅ **Dores**

- Pesquisa manual.
- Dificuldade para interpretar logs.
- Dependência de especialistas.
- Falta de padronização na resposta.
- Pouca visibilidade de soluções anteriores.
- Risco de escalonamento indevido.

✅ **Necessidades**

- Evidências claras.
- Diagnóstico provável com confiança.
- Casos semelhantes.
- Próximos passos consultivos.
- Critério de escalonamento.
- Rascunho de resposta revisável.

## 3.2 Analista L2/L3

✅ **Responsabilidades**

- Atuar em incidentes complexos.
- Confirmar diagnósticos quando L1 não tem evidência suficiente.
- Apoiar intervenção técnica ou física quando necessário.
- Contribuir para formalização de conhecimento.

✅ **Necessidades**

- Receber casos com contexto.
- Saber o que o L1 já tentou.
- Reduzir interrupções por dúvidas repetitivas.
- Melhorar qualidade do handoff.

## 3.3 Gestor de Suporte

✅ **Responsabilidades**

- Acompanhar produtividade, SLA, qualidade e escalonamentos.
- Garantir padronização do atendimento.
- Melhorar aproveitamento da base de conhecimento.

✅ **Necessidades**

- Métricas claras.
- Evolução de performance do L1.
- Redução de retrabalho.
- Evidência de valor antes de avançar para MVP/produto.

---

# 4. Jornada Atual

```text
Cliente abre chamado no FreshService
    ↓
Analista L1 lê descrição e anexos
    ↓
Analista interpreta sintomas/logs manualmente
    ↓
Analista consulta KB interna, FAQs, playbooks, PDFs, wikis e bases externas
    ↓
Analista busca tickets semelhantes ou conhecimento informal
    ↓
Analista monta diagnóstico inicial
    ↓
Analista responde cliente ou escala para L2/L3
    ↓
Solução é registrada no FreshService ou repositório de conhecimento
```

## Problemas da Jornada Atual

- Alto esforço manual.
- Múltiplas abas e fontes.
- Baixa descoberta de soluções anteriores.
- Risco de diagnóstico impreciso.
- Vai-e-vem com cliente por falta de informação.
- Escalonamento para confirmar diagnósticos.
- Conhecimento formalizado de forma irregular.

---

# 5. Jornada Futura da PoC

```text
Ticket/log anonimizado é inserido no fluxo da PoC
    ↓
Copiloto aplica validação e mascaramento de dados
    ↓
Copiloto extrai sintomas, erros, componentes e sinais técnicos
    ↓
Copiloto consulta KB controlada e documentos autorizados
    ↓
Copiloto recupera evidências e possíveis casos semelhantes
    ↓
Claude gera análise consultiva com base nas evidências
    ↓
Copiloto apresenta diagnóstico provável, confiança e limites da análise
    ↓
Copiloto recomenda resolver, pedir mais dados ou escalar
    ↓
Copiloto gera rascunho de resposta
    ↓
Analista humano revisa, edita e decide
```

## Princípio Central

🔵 **IA recomenda. Humano decide.**

A PoC deve provar o fluxo de inteligência e sugestão, sem automatizar resposta ao cliente, sem alterar tickets produtivos e sem executar comandos.

---

# 6. Escopo da PoC

## 6.1 Incluído

✅ A PoC deve incluir:

- uso de tickets/logs anonimizados;
- uso de KB exportada e/ou controlada;
- uso de Claude como provedor de IA;
- interpretação de ticket/log;
- recuperação de evidências;
- diagnóstico provável;
- nível de confiança;
- recomendação de escalonamento;
- solicitação de dados adicionais;
- rascunho de resposta para revisão;
- avaliação humana do resultado;
- registro de aceito/editado/rejeitado;
- validação dos dois casos de uso citados no briefing, se os materiais forem disponibilizados.

## 6.2 Casos de uso prioritários

✅ O briefing completo cita dois casos que devem virar cenários oficiais da PoC:

1. **Alerta de Alto Uso de Disco em CVM.**
2. **Falha no Cluster por Crash do Serviço Acropolis.**

Para cada caso, a PoC deve demonstrar:

- entrada do ticket/log;
- mascaramento;
- sinais técnicos extraídos;
- evidências recuperadas;
- diagnóstico provável;
- nível de confiança;
- recomendação de resolução, coleta de dados ou escalonamento;
- rascunho de resposta ao cliente.

## 6.3 Incluído condicionalmente

🟡 Pode entrar se houver autorização, documentação e dados suficientes:

- consulta a massa exportada de tickets históricos;
- uso de prints do FreshService com tarjas;
- uso de artigos internos exportados;
- uso de documentação de fabricante previamente autorizada;
- simulação fiel do fluxo do FreshService.

## 6.4 Fora do escopo da PoC

🚫 Não entra na PoC:

- acesso direto ao FreshService produtivo por participantes externos;
- escrita automática em tickets reais;
- envio automático de resposta ao cliente;
- execução automática de comandos;
- alteração de infraestrutura;
- uso de dados reais não anonimizados;
- scraping não autorizado de bases externas;
- promessa de redução quantitativa de MTTR sem baseline.

---

# 7. Requisitos Funcionais

## RF-01 — Interpretar ticket/log

O Copiloto deve receber um ticket/log anonimizado e extrair:

- resumo do incidente;
- sintomas;
- mensagens de erro;
- componente/serviço afetado, quando disponível;
- severidade aparente;
- dados ausentes;
- sinais que indiquem necessidade de escalonamento.

## RF-02 — Mascarar ou bloquear dados sensíveis

Antes de enviar conteúdo ao Claude, o Copiloto deve aplicar uma camada de sanitização.

Categorias iniciais a proteger:

- nomes de clientes;
- nomes de pessoas;
- e-mails;
- telefones;
- IDs de cliente, contrato ou ticket;
- IPs, hostnames e topologias identificáveis;
- tokens, chaves, segredos e credenciais;
- anexos ou prints sem tarja;
- qualquer PII ou dado real de cliente.

⚠️ A lista oficial de campos sensíveis ainda precisa ser validada pela Clear IT.

## RF-03 — Recuperar conhecimento

O Copiloto deve buscar evidências em fontes autorizadas:

- KB exportada;
- playbooks;
- artigos internos;
- procedimentos de workaround;
- runbooks validados;
- tickets históricos anonimizados;
- documentação de fabricante previamente autorizada.

## RF-04 — Sugerir diagnóstico provável

O Copiloto deve gerar diagnóstico provável com:

- evidências;
- fontes;
- hipóteses alternativas, quando existirem;
- limitações da análise;
- confiança Alta, Média ou Baixa.

## RF-05 — Recomendar escalonamento

O Copiloto deve recomendar escalonamento quando:

- não houver evidência suficiente;
- a confiança for baixa;
- faltar dado essencial;
- o caso exigir autorização/intervenção física;
- o caso envolver risco operacional alto;
- houver falha crítica sem procedimento validado;
- o histórico indicar necessidade de L2/L3.

## RF-06 — Solicitar dados adicionais

Quando o ticket/log estiver incompleto, o Copiloto deve pedir dados adicionais em vez de inventar diagnóstico.

## RF-07 — Gerar rascunho de resposta

O Copiloto deve gerar rascunho técnico, claro e revisável, respeitando:

- padrão de comunicação oficial do atendimento;
- evidências encontradas;
- limites da análise;
- orientação de próximo passo;
- linguagem adequada ao cliente.

## RF-08 — Registrar avaliação humana

A PoC deve registrar, no mínimo:

- caso analisado;
- saída do Copiloto;
- avaliação humana;
- status: aceito, editado, rejeitado;
- motivo da edição/rejeição;
- observações de segurança ou qualidade.

---

# 8. Requisitos Não Funcionais

| ID | Requisito | Descrição | Status |
|---|---|---|---|
| RNF-01 | Segurança | Nenhum dado sensível deve ser enviado ao Claude antes de anonimização | ✅ Confirmado |
| RNF-02 | LGPD | PII e topologia identificável não devem trafegar em ambientes não homologados | ✅ Confirmado |
| RNF-03 | Rastreabilidade | Toda recomendação deve apontar evidência/fonte quando possível | ✅ Confirmado |
| RNF-04 | Revisão humana | Respostas são rascunhos, não envio automático | ✅ Confirmado |
| RNF-05 | Explicabilidade | A resposta deve separar fato, hipótese, evidência e limitação | ✅ Confirmado |
| RNF-06 | Não automação crítica | O Copiloto não executa comandos nem corrige infraestrutura | ✅ Confirmado |
| RNF-07 | Controle de fonte | Só usar KB/documentos autorizados | ✅ Confirmado |
| RNF-08 | Métricas | Avaliação precisa considerar utilidade, segurança e evidência | ✅ Confirmado |
| RNF-09 | Integração futura | FreshService API depende de permissões, credenciais e homologação | 🟡 Parcial |

---

# 9. Histórias de Usuário

## HU-01 — Analisar ticket/log

**Como** analista L1,  
**quero** inserir um ticket/log anonimizado no Copiloto,  
**para** receber um resumo técnico inicial e entender quais sinais são relevantes.

### Critérios de aceite

- O Copiloto resume o incidente sem expor dados sensíveis.
- O Copiloto identifica sintomas e dados ausentes.
- O Copiloto não afirma causa raiz sem evidência.
- O Copiloto informa limitações da análise.

## HU-02 — Recuperar evidências

**Como** analista L1,  
**quero** receber evidências de KB, playbooks, runbooks ou tickets históricos anonimizados,  
**para** não resolver casos recorrentes do zero.

### Critérios de aceite

- Cada recomendação operacional deve apontar fonte ou indicar ausência de evidência.
- O Copiloto diferencia fonte validada, documentação pública e hipótese.
- Conteúdos de fabricante só são usados quando autorizados ou previamente exportados.

## HU-03 — Receber diagnóstico provável

**Como** analista L1,  
**quero** receber um diagnóstico provável com confiança,  
**para** decidir se sigo com o atendimento, peço mais dados ou escalo.

### Critérios de aceite

- A saída contém diagnóstico provável, evidências e confiança.
- Confiança baixa gera recomendação de cautela.
- Dados insuficientes geram pedido de informação, não conclusão inventada.

## HU-04 — Gerar rascunho de resposta

**Como** analista L1,  
**quero** receber um rascunho de resposta ao cliente,  
**para** acelerar a comunicação mantendo revisão humana.

### Critérios de aceite

- O rascunho é claro e revisável.
- O rascunho não promete solução sem confirmação.
- O rascunho respeita a diretriz consultiva e o padrão oficial de comunicação.
- O analista pode aceitar, editar ou rejeitar.

## HU-05 — Recomendar escalonamento

**Como** analista L1,  
**quero** que o Copiloto recomende escalonamento quando não houver informação suficiente,  
**para** evitar risco operacional e melhorar o handoff para L2/L3.

### Critérios de aceite

- Escalonamento é sugerido quando faltam evidência, dados, procedimento ou confiança.
- A recomendação explica o motivo.
- A saída lista o que deve ser enviado ao L2/L3.

---

# 10. Regras de Negócio

| ID | Regra | Status |
|---|---|---|
| RN-01 | O Copiloto é consultivo; a decisão final é humana | ✅ Confirmado |
| RN-02 | Nenhum dado real de cliente, PII ou topologia identificável deve ir para ambiente não homologado | ✅ Confirmado |
| RN-03 | Dados sensíveis devem ser anonimizados antes de compartilhar com squads ou processar por IA | ✅ Confirmado |
| RN-04 | Participantes externos não terão credenciais diretas ao FreshService produtivo sem supervisão | ✅ Confirmado |
| RN-05 | A PoC deve comprovar fluxo de inteligência e sugestão, não integração nativa completa | ✅ Confirmado |
| RN-06 | Integração FreshService é futura e depende de API, permissões e homologação | 🟡 Parcial |
| RN-07 | Documentação de fabricante deve ser usada apenas quando pública, autorizada ou exportada | 🟡 Parcial |
| RN-08 | O Copiloto não deve executar ações técnicas automaticamente | ✅ Confirmado |
| RN-09 | Métricas quantitativas dependem de baseline; não inventar números | ✅ Confirmado |
| RN-10 | Claude é o provedor de IA definido pelo usuário para este projeto | ✅ Confirmado |

---

# 11. KPIs e Métricas

## 11.1 Indicadores de negócio confirmados

- TMA/TMR.
- MTTR.
- SLA de atendimento e resolução.
- Volume de tickets por analista.
- Taxa de reabertura.
- CSAT/NPS.
- First Call Resolution (FCR).
- Taxa de escalonamento para L2/L3.
- Proporção de incidentes resolvidos pelo Nível 1.
- Feedback qualitativo da equipe de suporte.

## 11.2 Métricas da PoC

Como os baselines reais ainda não foram fornecidos, a PoC deve medir:

- percentual de casos com diagnóstico útil;
- percentual de respostas com evidência rastreável;
- percentual de casos em que o Copiloto pediu mais dados corretamente;
- percentual de casos em que o escalonamento foi recomendado de forma adequada;
- taxa de rascunhos aceitos, editados e rejeitados;
- ocorrências de exposição de dados sensíveis;
- avaliação qualitativa por L1/L2/L3, Pulse Mais ou consultor.

## 11.3 Critério inicial de sucesso da PoC

🔵 Critério inicial proposto, sujeito à validação:

> A PoC será considerada positiva se, em uma amostra de casos anonimizados, o Copiloto produzir análise útil, evidência rastreável, recomendação de próximo passo e rascunho revisável na maioria dos casos avaliados, sem expor dados sensíveis e sem inventar diagnóstico quando faltarem evidências.

⚠️ O percentual exato de aprovação deve ser definido com o cliente/consultor, pois não há baseline ou meta numérica oficial nos materiais analisados.

---

## 11.4 Critérios de Sucesso da PoC

| ID | Critério | Resultado Esperado | Status |
|---|---|---|---|
| CS-01 | Apoiar interpretação de logs | Mensagens relevantes, severidade e hipótese inicial são apresentadas | ✅ Confirmado |
| CS-02 | Localizar conhecimento relevante | KB, runbooks, playbooks ou tickets similares aparecem com fontes rastreáveis | ✅ Confirmado |
| CS-03 | Gerar respostas consistentes | Rascunhos seguem tom, estrutura e limites esperados para revisão humana | ✅ Confirmado |
| CS-04 | Preservar decisão humana | Nenhuma resposta ou ação é executada sem aprovação do analista | ✅ Confirmado |
| CS-05 | Respeitar LGPD e segurança | Dados sensíveis são bloqueados, mascarados ou tratados conforme política validada | ✅ Confirmado |
| CS-06 | Explicar recomendações | Diagnóstico vem acompanhado de evidências, confiança e limitações | ✅ Confirmado |
| CS-07 | Reduzir escalonamentos indevidos | Casos simples ou recorrentes são resolvidos pelo L1 com apoio, quando houver evidência suficiente | 🟡 Parcial |
| CS-08 | Melhorar experiência do analista | Analista percebe redução de esforço de pesquisa e maior clareza na triagem | 🟡 Parcial |

⚠️ Os critérios CS-07 e CS-08 dependem de avaliação com amostra real ou controlada, definição de baseline e validação humana por L1/L2/L3.

# 12. Hipóteses de Produto

| ID | Hipótese | Como Validar | Status |
|---|---|---|---|
| H-01 | A investigação inicial é uma das etapas mais demoradas do atendimento L1 | Medir tempo de triagem antes/depois da PoC ou comparar com amostra histórica | 🟡 A validar |
| H-02 | O conhecimento reutilizável está concentrado em tickets antigos, KB, playbooks e experiência de especialistas | Amostrar tickets resolvidos e mapear recorrência, fonte usada e reaproveitamento possível | 🟡 A validar |
| H-03 | Recomendações com evidências reduzem escalonamentos indevidos | Comparar decisões de escalar/não escalar com avaliação de L2/L3 em casos controlados | 🟡 A validar |
| H-04 | Rascunhos padronizados reduzem esforço de comunicação e melhoram consistência | Avaliar tempo de elaboração, taxa de edição e qualidade percebida dos rascunhos | 🟡 A validar |
| H-05 | Exibir confiança, evidências e limitações aumenta a adoção pelos analistas | Testes com usuários, entrevistas e coleta de aceito/editado/rejeitado | 🟡 A validar |
| H-06 | Logs ou tickets incompletos exigirão solicitação recorrente de dados adicionais | Medir frequência de respostas com “contexto insuficiente” e qualidade das perguntas sugeridas | 🟡 A validar |

🔵 Estas hipóteses orientam o desenho experimental da PoC. Elas não devem ser tratadas como promessas de resultado antes de baseline e validação operacional.

---

# 13. Backlog de Épicos e Features

| ID | Épico / Feature | Status | Observação |
|---|---|---|---|
| E-01 | PoC consultiva do Copiloto L1 | Pronto para planejamento técnico | Escopo validado com briefing completo |
| F-01 | Ingestão de ticket/log anonimizado | Pronto para Dev após aprovação técnica | Sem FreshService produtivo |
| F-02 | Camada de mascaramento/sanitização | Pronto para Dev após aprovação técnica | Obrigatória antes de Claude |
| F-03 | Busca em KB controlada/RAG | Pronto para Dev após aprovação técnica | Usar documentos autorizados |
| F-04 | Geração de diagnóstico provável com confiança | Pronto para Dev após aprovação técnica | Baseado em evidências |
| F-05 | Recomendação de escalonamento | Pronto para Dev após aprovação técnica | Falta de evidência/dados/confiança |
| F-06 | Rascunho de resposta revisável | Pronto para Dev após aprovação técnica | Humano aprova |
| F-07 | Scorecard de avaliação humana | Pronto para Dev após aprovação técnica | Aceito/editado/rejeitado |
| F-08 | Integração FreshService API | Futuro / Condicional | Depende de credenciais, permissões e homologação |
| F-09 | Uso automático de KB externa de fabricante | Futuro / Condicional | Pode exigir autenticação/autorização |

---

# 14. Materiais Disponíveis para a PoC

✅ O briefing informa que poderão apoiar o desenvolvimento:

- fluxogramas do processo atual de atendimento L1 ao L3;
- massa de dados exportada com exemplos de chamados e logs estritamente anonimizada;
- base de conhecimento exportada;
- playbooks;
- artigos internos;
- procedimentos de workaround;
- prints do FreshService com tarjas em dados sensíveis;
- exemplos de casos de uso de incidentes comuns.

🟡 O pacote `Projeto-Copiloto (4).zip` já contém uma estrutura Onion com:

- `docs/business-context-lite.md`;
- `docs/technical-context-lite.md`;
- `docs/onion-cycles.md`;
- KBs sobre Clear IT, FreshService, ITIL, processo de atendimento, análise de logs, RAG, source map, prompt engineering, vendors, runbooks e glossário;
- templates de artigo, runbook e ticket.

---

# 15. Pendências Atuais

| ID | Pendência | Status | Próxima ação |
|---|---|---|---|
| P-01 | Provedor de IA | ✅ Respondido | Claude definido pelo usuário |
| P-02 | Dados reais podem ser usados? | ✅ Respondido | Apenas anonimizados e em ambiente permitido |
| P-03 | Quais dados mascarar? | 🟡 Parcial | Validar lista oficial com Clear IT |
| P-04 | Ambiente de execução da PoC | ⚠️ Pendente | Definir ambiente homologado/controlado |
| P-05 | Documentos de KB que entram | 🟡 Parcial | Selecionar artigos, playbooks e runbooks aprovados |
| P-06 | KB validada e atualizada? | ⚠️ Pendente | Responsável Clear IT/Pulse Mais precisa validar |
| P-07 | Tickets/logs usados | 🟡 Parcial | Usar massa exportada anonimizada; confirmar formato |
| P-08 | Avaliadores técnicos | 🟡 Parcial | Definir L1/L2/L3, Pulse Mais e consultor avaliadores |
| P-09 | Metas de aprovação | ⚠️ Pendente | Definir baseline e critérios quantitativos |
| P-10 | Modelo/plano Claude | ⚠️ Pendente | Definir modelo, política de retenção e forma de acesso |
| P-11 | FreshService API | 🟡 Parcial | Integração futura depende de credenciais/permissões |
| P-12 | Uso de KB externa Nutanix/fabricantes | 🟡 Parcial | Usar só fonte pública/autorizada/exportada |

---

# 16. Decisões de Produto

| ID | Decisão | Justificativa | Status |
|---|---|---|---|
| DP-01 | Priorizar PoC consultiva antes de MVP produtivo | Reduz risco e respeita restrições de acesso/dados | ✅ Confirmada |
| DP-02 | Claude será o provedor de IA | Decisão informada pelo usuário | ✅ Confirmada |
| DP-03 | FreshService é referência do fluxo, não integração obrigatória da PoC | Briefing restringe acesso produtivo e condiciona APIs | ✅ Confirmada |
| DP-04 | Dados precisam ser anonimizados antes da IA | Briefing exige confidencialidade, LGPD e mascaramento | ✅ Confirmada |
| DP-05 | Humano revisa todas as respostas | Assistente tem caráter consultivo | ✅ Confirmada |
| DP-06 | Dois casos do briefing viram cenários prioritários | São exemplos concretos fornecidos no material | ✅ Confirmada |
| DP-07 | Métricas quantitativas dependem de baseline | Não há números atuais no material analisado | ✅ Confirmada |

---

# 17. Roadmap

## Fase 1 — Validação de Escopo e Dados

- Confirmar ambiente de PoC.
- Confirmar modelo/plano Claude.
- Confirmar política de retenção e logs.
- Selecionar documentos da KB.
- Definir lista de dados sensíveis.
- Receber massa anonimizada de tickets/logs.

## Fase 2 — PoC Consultiva

- Implementar fluxo com entrada manual ou dataset controlado.
- Rodar os dois casos prioritários.
- Avaliar respostas com scorecard.
- Ajustar prompts, guardrails e critérios de escalonamento.

## Fase 3 — MVP Consultivo

- Evoluir UX.
- Ampliar base de casos.
- Melhorar RAG.
- Registrar feedback humano.
- Medir indicadores com amostra maior.

## Fase 4 — Piloto Integrado Limitado

- Avaliar integração FreshService via API.
- Validar credenciais e permissões.
- Testar leitura controlada e, se autorizado, escrita supervisionada.
- Submeter a homologação de segurança.

---

# 18. Status Final

✅ O Business Context v4.1 foi consolidado com:

- briefing completo;
- decisão de Claude;
- escopo de PoC consultiva;
- restrições de LGPD;
- FreshService como referência de fluxo;
- integração produtiva como futura;
- dois casos de uso prioritários;
- materiais disponíveis;
- pendências restantes sem inventar respostas;
- objetivos estratégicos recuperados da v3;
- hipóteses de produto recuperadas e adaptadas para PoC;
- critérios de sucesso objetivos para orientar validação.

## Próxima Ação Recomendada

Acionar `@engineer` para validar o `technical-context-lite.md` v1.3 e, somente após aprovação, iniciar plano de implementação da PoC.

---

# 19. Registro de Consolidação v4.1

## Fontes consolidadas

- **Base principal:** Business Context v4.
- **Blocos recuperados da v3:** Objetivos Estratégicos, Hipóteses de Produto e Critérios de Sucesso.
- **Diretriz de consolidação:** manter o escopo disciplinado de PoC consultiva, evitando regressão para um MVP amplo ou produtivo prematuro.

## Resultado da consolidação

A v4.1 passa a ser a fonte de verdade recomendada para Produto porque combina:

- a precisão, segurança e concretude da v4;
- a rastreabilidade estratégica da v3;
- hipóteses explícitas para orientar experimentação;
- critérios de sucesso claros para avaliação da PoC;
- proteção contra metas numéricas inventadas sem baseline.

## Quem tem a vez

`@product` deve validar esta versão com stakeholders.  
Após validação, `@engineer` pode iniciar ou revisar o `technical-context-lite.md` com base neste documento.