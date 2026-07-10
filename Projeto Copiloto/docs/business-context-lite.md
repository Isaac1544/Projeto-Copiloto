# Business Context — Copiloto para Analistas de Suporte L1 Clear IT

> Versão: v7.0  
> Data: 2026-07-10  
> Responsável: `@product`  
> Estado atual: MVP navegável, acessível publicamente para validação controlada e já conectado a um backend de análise server-side  
> Próximo foco: consolidar corpus, qualidade das respostas e critérios operacionais de uso real

## 1. Visão do produto

O Copiloto é um apoio consultivo para analistas de suporte L1. Ele não decide no lugar do analista e não responde automaticamente ao cliente final.

Seu papel é:

1. entender o chamado;
2. destacar fatos observados;
3. apontar o problema provável;
4. sugerir um caminho de resolução seguro;
5. recomendar pedido de mais dados ou escalonamento quando necessário;
6. gerar um rascunho revisável para o cliente;
7. registrar a decisão humana para aprendizado e auditoria.

## 2. Problema de negócio

O processo atual de atendimento ainda depende de busca manual em múltiplas fontes, interpretação humana de casos semelhantes e forte apoio de analistas mais experientes.

As dores principais continuam sendo:

- triagem lenta;
- dificuldade de analistas juniores em casos mais técnicos;
- baixo reaproveitamento do conhecimento já resolvido;
- respostas pouco padronizadas;
- escalonamentos desnecessários;
- tempo alto gasto com interpretação de logs, alertas e evidências dispersas.

## 3. Valor esperado do MVP

O MVP precisa provar, de forma simples e controlada, que o Copiloto pode:

- reduzir o esforço inicial de triagem;
- apoiar melhor o L1 em incidentes recorrentes;
- aumentar a consistência das respostas;
- melhorar o uso da base de conhecimento;
- orientar quando pedir mais evidência e quando escalar;
- manter o humano no controle.

## 4. Estado atual do produto

Hoje o produto já existe em formato utilizável.

O que já está disponível:

- dashboard;
- abertura manual de novo atendimento;
- análise estruturada;
- resultado com blocos separados;
- histórico;
- decisão humana;
- scorecard operacional;
- base de conhecimento curada mínima;
- deploy público para navegação do MVP.

O que ainda está em amadurecimento:

- qualidade e abrangência do corpus;
- padronização mais forte da resposta ao cliente;
- governança final da política LGPD;
- validação operacional com casos reais anonimizados em volume maior.

## 5. Escopo confirmado do MVP

Permanece confirmado:

- sem integração direta com FreshService nesta etapa;
- com revisão humana obrigatória;
- com backend server-side para IA;
- com fontes rastreáveis;
- com uso de conteúdo controlado e anonimizado;
- com recomendação de resolução, pedido de dados ou escalonamento.

## 6. Forma atual de acesso

Para acelerar a validação do MVP, o produto está operando com acesso público controlado.

Isso significa:

- o usuário pode abrir a aplicação sem bloqueio inicial por login;
- a experiência principal do fluxo já pode ser demonstrada;
- essa escolha é temporária e orientada a validação rápida;
- ela não altera a regra de que a decisão final continua humana.

## 7. Regras de negócio que seguem obrigatórias

1. A IA é consultiva.
2. O analista humano decide.
3. Nenhuma resposta deve ser enviada automaticamente ao cliente.
4. Dados sensíveis devem ser mascarados ou bloqueados antes da IA.
5. Fatos, hipótese e recomendação não devem ser confundidos.
6. Casos com pouca evidência devem sinalizar baixa confiança.
7. Casos de risco devem priorizar pedido de mais dados ou escalonamento.

## 8. Indicadores de valor

Os indicadores continuam sendo os mesmos já mapeados no projeto:

- TMA;
- TMR / MTTR;
- cumprimento de SLA;
- FCR;
- taxa de escalonamento;
- taxa de reabertura;
- CSAT / NPS.

Observação:

- o MVP ainda não estabelece metas quantitativas oficiais;
- a etapa atual é de validação de utilidade e aderência do fluxo.

## 9. Decisões de produto registradas

| ID | Decisão | Status |
|---|---|---|
| DEC-BIZ-001 | O produto é um Copiloto consultivo para L1 | Confirmada |
| DEC-BIZ-002 | O MVP segue sem integração direta com FreshService | Confirmada |
| DEC-BIZ-003 | A decisão final continua humana | Confirmada |
| DEC-BIZ-004 | A resposta ao cliente é sempre rascunho revisável | Confirmada |
| DEC-BIZ-005 | O MVP pode operar temporariamente em modo público para acelerar validação | Confirmada |
| DEC-BIZ-006 | O provedor preferencial do MVP continua sendo Claude, sem impedir flexibilidade técnica no backend | Confirmada |

## 10. Backlog de produto por tema

### Já entregue no MVP

- fluxo principal navegável;
- modo público para demonstração e validação;
- resposta estruturada com separação visual clara;
- registro de decisão humana;
- scorecard operacional;
- deploy público inicial.

### Ainda precisa evoluir

- qualidade da recomendação baseada em corpus mais rico;
- governança mais forte da base de conhecimento;
- política operacional de anonimização e bloqueio;
- maior aderência do texto sugerido ao padrão de comunicação do atendimento;
- critérios formais para transição de validação para uso controlado mais amplo.

## 11. Pendências de produto

1. Definir corpus inicial oficial que entra no uso operacional.
2. Definir o padrão de comunicação oficial para as respostas sugeridas ao cliente.
3. Fechar critérios de aceite da fase de validação controlada.
4. Estabelecer amostra mais ampla de casos reais anonimizados para avaliação.
5. Confirmar quando o login volta a ser obrigatório.

## 12. Próximas ações recomendadas

1. melhorar qualidade das respostas com base de conhecimento mais útil;
2. consolidar o provedor principal em ambiente remoto estável;
3. validar o fluxo com mais casos anonimizados;
4. medir utilidade percebida do Copiloto pelo analista;
5. decidir o endurecimento do acesso e da autenticação após a validação do MVP.
