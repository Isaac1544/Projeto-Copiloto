# Guia de Dominio Completo do Projeto Copiloto

## 1. Resumo executivo em linguagem simples

O projeto Copiloto L1 e um assistente para analistas de suporte. Ele recebe um chamado, consulta contexto adicional, usa IA no backend e devolve uma sugestao estruturada para apoiar a triagem do caso.

O sistema foi desenhado para:

- ajudar o analista a entender o problema mais rapido;
- sugerir proximos passos operacionais;
- indicar quando pedir mais evidencias;
- indicar quando escalar;
- sugerir uma resposta inicial ao cliente;
- manter revisao humana obrigatoria.

Em uma frase:

`O Copiloto L1 e uma camada de apoio operacional para analistas de suporte, nao uma automacao cega de resposta.`

## 2. Qual problema de negocio ele resolve

No atendimento de suporte, o analista normalmente perde tempo com cinco atividades repetitivas:

1. ler uma descricao incompleta;
2. tentar identificar o tipo de problema;
3. buscar casos parecidos ou KB manualmente;
4. decidir se resolve, pede mais dados ou escala;
5. redigir uma resposta inicial coerente para o usuario.

O Copiloto tenta transformar esse trabalho em um fluxo mais padronizado, rapido e defensavel.

## 3. Qual e a proposta de valor do MVP

O MVP nao busca resolver tudo. Ele busca provar que e possivel:

- abrir um chamado de forma simples;
- enriquecer o caso com base de conhecimento;
- gerar uma analise orientada por IA;
- separar claramente fatos, hipotese, resolucao e resposta ao cliente;
- manter registro da decisao humana;
- tornar o projeto acessivel publicamente para validacao.

## 4. O que o MVP ja entrega hoje

Hoje o MVP ja consegue:

- rodar com frontend funcional publicado;
- operar em modo publico temporario, sem login obrigatorio;
- cadastrar um novo atendimento manualmente;
- recuperar evidencias de uma base de conhecimento local/importada;
- chamar uma Edge Function no Supabase para analisar o caso;
- usar provedor de IA configurado no backend;
- exibir resultado estruturado para o analista;
- registrar decisao humana de aceitar, editar, rejeitar ou reabrir;
- consultar historico.

## 5. O que o MVP nao pretende resolver ainda

Ainda nao faz parte da promessa atual do MVP:

- automacao completa do atendimento sem revisao humana;
- integracao nativa com ferramenta ITSM externa;
- busca vetorial completa em escala de producao;
- fluxo de autenticacao final estabilizado para todos os perfis;
- governanca de multiempresa ou multitenancy madura;
- observabilidade de producao no nivel de produto consolidado.

## 6. Principios funcionais do projeto

O projeto foi montado com alguns principios centrais:

- a decisao final sempre e humana;
- o frontend nao chama o modelo diretamente;
- o backend controla provedor, prompt e seguranca;
- base de conhecimento influencia a qualidade;
- o sistema pode funcionar em modos diferentes, conforme maturidade do ambiente;
- o MVP prioriza funcionamento e validacao sobre sofisticacao arquitetural completa.

## 7. Frase tecnica que resume a arquitetura

`Frontend React/TanStack Start publicado em Cloudflare, com backend de analise em Supabase Edge Functions, persistencia em Supabase e selecao de provedor de IA via configuracao no backend.`

## 8. Arquitetura ponta a ponta

Fluxo principal:

```text
Analista
  -> Frontend React / TanStack Start
  -> Store do Copiloto
  -> Enriquecimento com base local
  -> Edge Function analyze-ticket
  -> Recuperacao de evidencias
  -> Prompt + provedor configurado
  -> Normalizacao da resposta
  -> Persistencia / sessao publica
  -> Tela de resultado
  -> Decisao humana
```

## 9. Quais tecnologias foram confirmadas

- Frontend: React 19
- Linguagem principal: TypeScript
- Framework app: TanStack Start
- Bundler / dev server: Vite
- Build de deploy: Nitro para Cloudflare Workers
- UI: Tailwind CSS + Radix UI
- Estado de dados: React Query + store propria
- Backend: Supabase Edge Functions
- Banco: Supabase Postgres
- Auth / sessao: Supabase Auth e sessao publica controlada
- Provedores de IA suportados: Anthropic, OpenAI e Gemini

## 10. Onde o projeto esta publicado

Links mais importantes:

- deploy publico atual: [https://isaac1544-projeto-copiloto.copilotoisaac.workers.dev](https://isaac1544-projeto-copiloto.copilotoisaac.workers.dev)
- deploy legado do Lovable: [https://copiloto-amigo.lovable.app](https://copiloto-amigo.lovable.app)

## 11. Estrutura do repositorio

Mapa conceitual do repositorio:

- `copiloto-amigo-main/`: aplicacao principal do MVP
- `docs/`: documentacao de negocio, tecnica, backlog e operacao
- `docs/knowledge-base/`: material de conhecimento curado
- `data/processed/`: dados anonimizados e tratados
- `data/raw/`: dados brutos, fora do versionamento
- `outputs/`: arquivos gerados para apoio, resumos e importacoes

## 12. O que existe dentro de `copiloto-amigo-main`

Essa pasta e o coracao do produto. Ela concentra:

- o frontend;
- a camada de integracao com Supabase;
- a store principal do sistema;
- o contrato entre frontend e backend;
- as funcoes do Supabase;
- scripts de validacao do MVP.

## 13. Telas principais do sistema

Arquivos de rota mais importantes:

- `src/routes/_authenticated/index.tsx`: dashboard
- `src/routes/_authenticated/novo-atendimento.tsx`: formulario principal de abertura de chamado
- `src/routes/_authenticated/resultado.$id.tsx`: pagina do resultado do copiloto
- `src/routes/_authenticated/historico.tsx`: historico das analises
- `src/routes/_authenticated/base-conhecimento.tsx`: entrada para a base de conhecimento no frontend
- `src/routes/auth.tsx`: rota de autenticacao

## 14. O que cada tela representa no negocio

- Dashboard: ponto de entrada e visao geral
- Novo atendimento: tela onde nasce a analise
- Resultado: tela mais importante do MVP, onde a sugestao da IA e interpretada
- Historico: memoria operacional das analises
- Base de conhecimento: local onde o analista injeta conhecimento complementar
- Auth: porta para o modo conectado, quando o login estiver em uso

## 15. Arquivo mais importante do frontend

O arquivo mais importante, do ponto de vista funcional, e:

- `src/lib/copiloto-store.tsx`

Ele centraliza boa parte da inteligencia operacional do app:

- leitura das analises;
- carga de historico;
- criacao de nova analise;
- integracao com modo demo;
- integracao com modo publico;
- integracao com modo conectado;
- fallback local quando o remoto falha;
- registro e reabertura de decisao humana.

Se alguem perguntar "onde o app realmente se organiza?", a melhor resposta costuma comecar por esse arquivo.

## 16. Como nasce uma nova analise

Quando o analista abre um novo caso:

1. o formulario coleta os campos do chamado;
2. a store transforma isso em um objeto de ticket;
3. `src/lib/analyze-ticket.ts` monta o payload de analise;
4. a base local do analista e consultada para recuperar evidencias;
5. o payload vai para a Edge Function `analyze-ticket`;
6. a funcao devolve um objeto padronizado;
7. o resultado e salvo e renderizado na tela de resultado.

## 17. O que faz `src/lib/analyze-ticket.ts`

Esse arquivo funciona como ponte entre frontend e backend. Ele:

- valida o payload de entrada;
- monta o contexto final do ticket;
- injeta base de conhecimento adicional do analista;
- chama a Edge Function remota;
- trata erros;
- cai em fallback local quando necessario.

Esse e um dos primeiros arquivos a investigar quando:

- a resposta parece generica demais;
- a chamada remota falha;
- existe suspeita de fallback;
- o resultado nao bate com o esperado.

## 18. O que significa fallback neste projeto

Fallback, aqui, significa que o sistema nao conseguiu usar o caminho principal de analise remota e precisou recorrer a uma resposta alternativa, mais simples.

Esse fallback pode acontecer por motivos como:

- provedor indisponivel;
- segredo ausente no Supabase;
- erro na chamada HTTP;
- timeout;
- configuracao de modo mock;
- falha no fluxo remoto seguida de degradacao controlada.

Em outras palavras:

`quando a IA real nao responde corretamente, o sistema tenta nao quebrar a experiencia do analista.`

## 19. O que faz a Edge Function `analyze-ticket`

Arquivo principal:

- `supabase/functions/analyze-ticket/index.ts`

Responsabilidades:

- validar o contrato tecnico do ticket;
- sanitizar entrada;
- bloquear segredos ou dados indevidos;
- mascarar e-mails, telefones e outros dados identificaveis;
- recuperar evidencias do corpus;
- construir prompt para o modelo;
- selecionar o provedor configurado;
- chamar Anthropic, OpenAI ou Gemini;
- normalizar a resposta do modelo;
- devolver um objeto consistente para o frontend.

## 20. O que faz `knowledge-corpus.ts`

Arquivo:

- `supabase/functions/analyze-ticket/knowledge-corpus.ts`

Ele concentra a camada de recuperacao de conhecimento do backend. Em termos praticos, ele ajuda a:

- localizar evidencias relevantes;
- montar contexto para o prompt;
- gerar fallback baseado em regras quando necessario.

## 21. O que faz a funcao `public-analyses`

Arquivo:

- `supabase/functions/public-analyses/index.ts`

Ela existe para viabilizar o modo publico do MVP. Isso significa:

- usar o sistema sem depender do login completo;
- persistir analises relacionadas a uma sessao publica;
- manter historico publico controlado para validacao.

## 22. Como o modo publico funciona

O modo publico foi criado para tornar o MVP facilmente acessivel. Em vez de exigir login imediato, o sistema usa uma sessao publica controlada.

Arquivo relacionado:

- `src/lib/public-session.ts`

Esse arquivo cria e reaproveita um identificador de sessao publica armazenado no navegador. Isso permite:

- manter continuidade de uso no browser;
- associar analises a uma mesma sessao;
- viabilizar historico publico sem autenticar o usuario final.

## 23. Como o sistema escolhe entre demo, publico e conectado

Arquivo:

- `src/lib/runtime-mode.ts`

Regras principais:

- se `VITE_DEMO_MODE=true`, o modo e Demonstracao;
- se `VITE_DEMO_MODE` nao estiver forcado e Supabase nao estiver configurado, o modo tambem vira Demonstracao;
- se Supabase estiver configurado e `VITE_AUTH_BYPASS=true`, o modo e Acesso publico;
- caso contrario, o modo e Conectado.

Essa logica e importante porque ela explica por que o sistema muda de comportamento entre ambientes.

## 24. Variaveis mais importantes do frontend

As variaveis mais relevantes para o frontend hoje sao:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_DEMO_MODE`
- `VITE_AUTH_BYPASS`

Leitura pratica:

- sem `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`, o app tende a operar como demonstracao;
- com Supabase configurado e `VITE_AUTH_BYPASS=true`, o MVP fica publico sem login;
- com `VITE_AUTH_BYPASS=false`, o fluxo volta a exigir autenticacao.

## 25. Variaveis mais importantes do backend

No Supabase, as variaveis mais importantes relacionadas a IA sao:

- `LLM_PROVIDER`
- `ALLOW_MOCK_ANALYSIS`
- `ANTHROPIC_API_KEY`
- `ANTHROPIC_MODEL`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `GEMINI_API_KEY`
- `GEMINI_MODEL`

Leitura pratica:

- `LLM_PROVIDER` escolhe qual provedor sera usado;
- `ALLOW_MOCK_ANALYSIS=true` permite degradacao controlada para mock em certos cenarios;
- se a chave ou o modelo do provedor escolhido estiverem ausentes, a funcao pode falhar ou cair em alternativa.

## 26. Qual e o papel do Claude neste projeto

O caminho preferencial atual do MVP e Anthropic / Claude, porque a intencao do produto e usar esse provedor como principal para a analise.

Mas o backend nao esta preso a ele. A arquitetura ja foi preparada para:

- Claude
- OpenAI
- Gemini

Isso e importante porque te da flexibilidade de custo, qualidade e estrategia futura.

## 27. Como a base de conhecimento entra no fluxo

A base de conhecimento nao e decorativa. Ela entra como contexto operacional.

O projeto ja possui uma camada para:

- importar arquivos CSV;
- transformar linhas em contexto mais util;
- recuperar casos e orientacoes;
- enriquecer o chamado antes da analise.

Arquivos principais:

- `src/lib/analyst-knowledge.ts`
- `src/lib/csv-knowledge-import.ts`

## 28. O que significa "qualidade da base" neste projeto

A qualidade da resposta depende muito da qualidade do conhecimento importado. Uma base boa tende a ter:

- texto legivel;
- casos claramente descritos;
- titulo objetivo;
- causa, acao e resultado identificaveis;
- pouca poluicao de metadados crus;
- sem segredos e sem lixo de exportacao.

Uma base ruim costuma gerar:

- resposta generica;
- passos irrelevantes;
- copia de metadados como se fossem orientacoes;
- baixa precisao na identificacao do problema.

## 29. O que ja foi feito para melhorar a qualidade das respostas

Ao longo do trabalho, foram feitas melhorias como:

- organizacao da documentacao do projeto;
- refinamento do prompt de analise;
- reforco de normalizacao da saida do modelo;
- reducao de respostas muito vagas;
- filtragem de evidencias de baixa qualidade;
- melhoria na construcao de conteudo importado por CSV;
- protecao contra despejo de metadados crus nos passos da resolucao;
- reforco de alertas de seguranca e necessidade de escalonamento.

## 30. O que foi feito no projeto desde o inicio

Consolidando historicamente, o trabalho ja passou por estas fases:

1. leitura do projeto originado via Lovable;
2. entendimento da interface e do escopo do MVP;
3. organizacao do repositorio;
4. criacao e sincronizacao de documentacao de negocio e tecnica;
5. definicao de backlog operacional;
6. configuracao de desenvolvimento local;
7. configuracao de Supabase e Edge Functions;
8. liberacao do modo publico sem login para acelerar testes;
9. deploy do frontend em Cloudflare Workers;
10. integracao com provedores de IA no backend;
11. insercao de base de conhecimento por arquivo;
12. tratamento de resultados genericos;
13. limpeza de dados brutos do versionamento;
14. consolidacao do MVP acessivel publicamente.

## 31. O que voce precisa saber sobre seguranca e LGPD

O projeto ja trata seguranca de forma inicial, principalmente no backend.

Pontos importantes:

- segredos nao devem ir para o Git;
- `data/raw/` nao deve ser versionado;
- a funcao de analise bloqueia certos padroes de credenciais;
- alguns dados identificaveis sao mascarados antes do envio ao modelo;
- a resposta ao cliente continua sob revisao humana;
- casos sensiveis devem acionar alerta e possivel escalonamento.

## 32. O que existe de persistencia hoje

Existem tres formas principais de persistencia ou continuidade:

1. armazenamento local no navegador, usado em cenario demo ou fallback local;
2. sessao publica controlada, usada no modo publico;
3. persistencia em Supabase, usada no fluxo conectado ou no backend do MVP.

Essa combinacao explica por que alguns resultados podem existir em um ambiente e nao em outro.

## 33. Por que um link de resultado pode nao existir mais

Quando um resultado abre com "Resultado nao encontrado", as causas mais provaveis sao:

- o ID nao existe mais na base consultada;
- o ID pertence a outra sessao ou outro ambiente;
- o registro nao foi persistido como se esperava;
- o usuario acessou a rota direta sem o dado correspondente.

Isso nao significa necessariamente que o deploy esteja quebrado. Muitas vezes significa apenas que aquele registro nao esta acessivel naquele contexto.

## 34. Como rodar localmente

Fluxo pratico:

1. entrar em `copiloto-amigo-main`
2. instalar dependencias
3. configurar `.env.local`
4. subir `vite dev`
5. acessar a URL local

Comandos de referencia:

```bash
pnpm install
pnpm dev
```

No Windows, quando `pnpm` ou `node` nao estiverem no PATH, pode ser necessario usar os binarios do runtime instalado no ambiente.

## 35. Como publicar o frontend

O fluxo documentado de deploy e:

1. build de producao
2. deploy com Wrangler para a saida gerada pelo TanStack Start / Nitro

Referencia atual:

- arquivo: `copiloto-amigo-main/docs/deploy-cloudflare.md`

Ponto importante:

- publicar o frontend nao substitui o deploy da Edge Function do Supabase.

## 36. Como explicar a separacao entre frontend e backend

Se alguem te perguntar por que nao chamar a IA direto do navegador, a resposta e:

- porque segredos precisam ficar protegidos;
- porque o backend controla mascaramento e bloqueios;
- porque o backend escolhe o provedor;
- porque o backend normaliza a resposta;
- porque isso facilita trocar Claude, OpenAI ou Gemini sem reescrever o frontend.

## 37. O que responder se perguntarem "qual e o coracao do sistema?"

Voce pode responder assim:

`No frontend, o coracao operacional esta na store do copiloto. No backend, o coracao da inteligencia esta na Edge Function analyze-ticket.`

## 38. O que responder se perguntarem "onde a IA decide?"

Melhor formulacao:

`A IA nao decide sozinha. Ela gera uma sugestao estruturada no backend. A decisao final continua com o analista.`

## 39. O que responder se perguntarem "como a sugestao e montada?"

Resposta curta:

`A sugestao e montada a partir do ticket preenchido, do contexto adicional, de evidencias recuperadas da base e do retorno do provedor de IA configurado, que depois passa por uma camada de normalizacao antes de chegar a tela.`

## 40. O que responder se perguntarem "por que algumas respostas ficam genericas?"

Resposta honesta:

`Porque a qualidade depende do contexto do chamado, da qualidade da base de conhecimento e de o fluxo remoto estar respondendo corretamente. Quando o caso vem pobre em detalhes ou a evidencia recuperada nao e boa, a resposta tende a perder precisao.`

## 41. Troubleshooting: resposta ficou ruim ou estranha

Checklist pratico:

1. verificar se o caso foi detalhado o bastante;
2. verificar se a base importada esta legivel;
3. verificar se a resposta parece fallback;
4. verificar se houve erro remoto no fluxo de analise;
5. verificar se a evidencia recuperada e realmente semelhante;
6. verificar se o provedor configurado esta com chave e modelo validos.

## 42. Troubleshooting: suspeita de fallback

Sinais comuns:

- resposta simples demais;
- tom muito padrao e repetitivo;
- pouca aderencia ao caso;
- fontes ou passos muito genericos;
- comportamento diferente entre local e publico.

Pontos de investigacao:

- `src/lib/analyze-ticket.ts`
- `src/lib/copiloto-store.tsx`
- `supabase/functions/analyze-ticket/index.ts`
- configuracao de `LLM_PROVIDER`
- configuracao de `ALLOW_MOCK_ANALYSIS`

## 43. Troubleshooting: login, acesso e modos

Se o usuario nao consegue logar ou o login nao e desejado no momento, a pergunta correta e:

- o ambiente deve estar em modo publico ou conectado?

Se a intencao for validar rapidamente o MVP:

- o modo publico tende a ser o mais eficiente.

Se a intencao for validar autenticacao real:

- o modo conectado precisa estar corretamente configurado no Supabase e no frontend.

## 44. Troubleshooting: resultado nao encontrado

Quando um link de resultado abre mas nao exibe analise:

1. verificar se o ID pertence ao ambiente atual;
2. verificar se o registro ainda existe;
3. verificar se a sessao publica e a mesma do contexto original;
4. tentar abrir o resultado a partir do historico do proprio sistema;
5. gerar uma nova analise no ambiente atual para comparar.

## 45. Perguntas de negocio que voce deve saber responder

### O que o produto faz?

Ele ajuda analistas de suporte a triar chamados com apoio de IA e base de conhecimento, mantendo decisao humana obrigatoria.

### Quem usa?

Analistas de suporte, principalmente em contexto L1.

### O que o MVP ja prova?

Que o fluxo principal de abertura, analise, recomendacao e revisao humana funciona ponta a ponta.

### Qual e o valor principal?

Padronizacao de atendimento, ganho de tempo e melhor orientacao para a proxima acao do analista.

## 46. Perguntas tecnicas que voce deve saber responder

### O frontend chama o Claude diretamente?

Nao. O frontend chama a Edge Function no Supabase.

### Da para trocar de provedor?

Sim. O backend ja suporta Anthropic, OpenAI e Gemini.

### Como o sistema escolhe o modo de execucao?

Por combinacao de configuracao do Supabase com `VITE_DEMO_MODE` e `VITE_AUTH_BYPASS`.

### Onde o resultado e tratado?

Principalmente na Edge Function `analyze-ticket` e depois na tela `resultado.$id.tsx`.

## 47. Como apresentar o projeto em 30 segundos

`O Copiloto L1 e um MVP de apoio ao analista de suporte. O usuario abre um chamado, o sistema consulta contexto adicional e usa IA no backend para sugerir identificacao do problema, resolucao e resposta ao cliente, sempre com revisao humana obrigatoria. O frontend esta publicado e o backend roda em Supabase com suporte a multiplos provedores.`

## 48. Como apresentar o projeto em 2 minutos

`O projeto nasceu para reduzir o trabalho repetitivo do analista de suporte. Hoje o MVP ja permite abrir chamados manualmente, consultar conhecimento complementar e gerar uma analise estruturada com apoio de IA. A resposta nao vai direto para o cliente: o analista revisa, edita ou rejeita. O frontend esta publicado em Cloudflare e o backend de analise roda em Supabase Edge Functions. A arquitetura ja suporta Claude, OpenAI e Gemini, embora o caminho preferencial do MVP siga sendo Claude. O foco agora e consolidar qualidade da base, confiabilidade do fluxo remoto e eliminacao de fallback indevido.`

## 49. Glossario rapido

- Chamado: o caso submetido pelo analista
- Analise: resultado estruturado gerado pelo sistema
- Evidencia: contexto recuperado para apoiar a interpretacao do caso
- KB: base de conhecimento
- Fallback: resposta alternativa quando o caminho principal falha
- Sessao publica: identificador de uso sem login tradicional
- Edge Function: funcao server-side hospedada no Supabase
- Provedor: servico de IA configurado para responder a analise

## 50. Onde estudar mais dentro do proprio repositorio

Arquivos mais importantes para continuar aprendendo:

- `README.md`
- `docs/technical-context-lite.md`
- `docs/business-context-lite.md`
- `docs/backlog-operacional-mvp.md`
- `docs/knowledge-corpus-mvp.md`
- `copiloto-amigo-main/src/lib/copiloto-store.tsx`
- `copiloto-amigo-main/src/lib/analyze-ticket.ts`
- `copiloto-amigo-main/supabase/functions/analyze-ticket/index.ts`

## 51. O que ainda merece evolucao

As proximas evolucoes mais naturais sao:

1. confirmar e eliminar fallback indevido;
2. elevar a qualidade e curadoria da base de conhecimento;
3. amadurecer a estrategia de busca e recuperacao de contexto;
4. estabilizar autenticacao do modo conectado;
5. melhorar observabilidade e confiabilidade de producao.

## 52. Conclusao final

Hoje voce ja tem em maos um MVP funcional, publicado e explicavel. O projeto esta suficientemente organizado para demonstracao, validacao e continuidade. O mais importante para defender o projeto em conversas e lembrar estas cinco ideias:

1. ele apoia, nao substitui, o analista;
2. a IA roda no backend, nao no navegador;
3. a base de conhecimento e parte critica da qualidade;
4. o modo publico foi uma decisao pragmatica para validar o MVP;
5. o proximo salto de maturidade esta em confiabilidade, corpus e governanca operacional.

## 53. Trilha de estudo recomendada

Se voce quiser ganhar dominio do projeto de forma rapida, esta e a melhor ordem de leitura:

1. `README.md`
2. `docs/business-context-lite.md`
3. `docs/technical-context-lite.md`
4. este guia de dominio
5. `copiloto-amigo-main/src/lib/copiloto-store.tsx`
6. `copiloto-amigo-main/src/lib/analyze-ticket.ts`
7. `copiloto-amigo-main/supabase/functions/analyze-ticket/index.ts`
8. `docs/knowledge-base/`

Essa sequencia te leva do mais estrategico para o mais operacional.

## 54. Mapa rapido de responsabilidade por arquivo

Se a pergunta for "onde eu mexo?", use esta referencia:

- mudar a abertura de chamado: `src/routes/_authenticated/novo-atendimento.tsx`
- mudar a tela de resultado: `src/routes/_authenticated/resultado.$id.tsx`
- mudar logica de criacao, historico e decisao: `src/lib/copiloto-store.tsx`
- mudar chamada da analise: `src/lib/analyze-ticket.ts`
- mudar contrato entre frontend e backend: `src/lib/analyze-ticket-contract.ts`
- mudar enriquecimento por base local: `src/lib/analyst-knowledge.ts`
- mudar importacao de CSV: `src/lib/csv-knowledge-import.ts`
- mudar modo demo/publico/conectado: `src/lib/runtime-mode.ts`
- mudar sessao publica: `src/lib/public-session.ts`
- mudar backend de IA: `supabase/functions/analyze-ticket/index.ts`
- mudar corpus do backend: `supabase/functions/analyze-ticket/knowledge-corpus.ts`
- mudar persistencia publica: `supabase/functions/public-analyses/index.ts`

## 55. Comandos mais importantes

No uso diario, estes tendem a ser os comandos mais uteis:

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm run verify:mvp
pnpm run smoke:analyze-ticket
```

Quando a demanda for deploy web:

```bash
pnpm dlx wrangler login
pnpm build
pnpm dlx wrangler deploy --config .output/server/wrangler.json
```

Quando a demanda for Edge Function:

```bash
supabase link --project-ref <project-ref>
supabase functions deploy analyze-ticket
supabase functions deploy public-analyses
```

## 56. Checklist antes de apresentar o MVP

Antes de mostrar o projeto para outra pessoa, vale validar:

1. o frontend abre na URL publica;
2. o novo atendimento gera uma analise;
3. o historico exibe o novo caso;
4. a tela de resultado mostra fontes, alertas e resposta sugerida;
5. a base de conhecimento importada esta coerente;
6. o ambiente esta no modo esperado;
7. nao existem chaves ou dados sensiveis expostos na demonstracao.

## 57. Checklist antes de afirmar que a IA esta funcionando de verdade

Esse ponto e importante porque evita confundir IA real com fallback.

Verifique:

1. se `LLM_PROVIDER` esta configurado corretamente;
2. se a chave do provedor escolhido existe no Supabase;
3. se o modelo correspondente existe no Supabase;
4. se `ALLOW_MOCK_ANALYSIS` nao esta habilitado sem necessidade;
5. se a resposta do caso esta aderente ao contexto real;
6. se o comportamento se repete em mais de um ticket de teste.

## 58. Como usar a nova Knowledge Base tecnica

Foi criada uma trilha complementar em `docs/knowledge-base/` para estudar as tecnologias usadas no projeto. A ideia e simples:

- usar este guia para entender o produto e a arquitetura do MVP;
- usar a KB tecnica para entender a stack;
- usar os arquivos do app para entender a implementacao real.

Em resumo:

`guia de dominio = entendimento do projeto`

`knowledge base tecnica = entendimento da stack`

`codigo = entendimento da implementacao`
