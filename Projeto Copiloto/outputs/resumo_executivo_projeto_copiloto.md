# Resumo Executivo do Projeto Copiloto

## 1. O que é o projeto

O Copiloto L1 e um assistente para analistas de suporte. Ele recebe um chamado, consulta contexto e evidencias, gera uma leitura inicial do caso e entrega:

- identificacao do problema;
- sugestao de resolucao;
- resposta sugerida ao cliente;
- alertas de seguranca e LGPD;
- trilha de decisao humana obrigatoria.

O objetivo do MVP e acelerar a triagem do analista sem substituir o julgamento humano.

## 2. Estado atual do MVP

Hoje o MVP ja consegue:

- abrir sem login, em modo publico temporario;
- registrar atendimentos manualmente;
- chamar backend server-side para analisar o chamado;
- consultar base de conhecimento curada;
- mostrar fatos observados, causa provavel, passos recomendados e resposta ao cliente;
- registrar aceitacao, edicao ou rejeicao da sugestao;
- manter historico de analises.

## 3. Onde o projeto esta publicado

- Deploy publico atual: [isaac1544-projeto-copiloto.copilotoisaac.workers.dev](https://isaac1544-projeto-copiloto.copilotoisaac.workers.dev)
- Deploy legado do Lovable: [copiloto-amigo.lovable.app](https://copiloto-amigo.lovable.app)

## 4. Arquitetura resumida

Fluxo principal:

1. o analista abre o frontend;
2. preenche um chamado;
3. o frontend envia o ticket para a Edge Function `analyze-ticket`;
4. a funcao consulta base de conhecimento e monta o prompt;
5. o provedor de IA responde;
6. o sistema normaliza a resposta e apresenta o resultado ao analista;
7. a decisao final fica registrada.

## 5. Stack confirmada

- Frontend: React 19 + TypeScript + TanStack Start + Vite
- UI: Tailwind + componentes Radix
- Estado e dados: React Query + store local
- Backend: Supabase Edge Functions
- Persistencia: Supabase
- Deploy publico: Cloudflare Workers
- Provedores de IA suportados: Claude, OpenAI e Gemini

## 6. Modos de uso

O projeto opera em tres modos:

- Demo: funciona mesmo sem backend completo
- Publico: backend real, sem login obrigatorio
- Conectado: fluxo com autenticacao Supabase

Para o MVP atual, o modo publico foi priorizado para acelerar testes.

## 7. Estrutura principal do repositorio

- `copiloto-amigo-main/`: app principal
- `docs/`: contexto de negocio, contexto tecnico e backlog
- `docs/knowledge-base/`: material de conhecimento curado
- `data/processed/`: dados tratados e anonimizados
- `data/raw/`: material bruto, fora do versionamento
- `outputs/`: arquivos de apoio gerados durante o trabalho

## 8. Arquivos e pontos mais importantes

No app:

- `src/routes/_authenticated/novo-atendimento.tsx`: formulario do chamado
- `src/routes/_authenticated/resultado.$id.tsx`: tela do resultado
- `src/routes/_authenticated/historico.tsx`: historico das analises
- `src/routes/_authenticated/base-conhecimento.tsx`: entrada de base de conhecimento
- `src/lib/copiloto-store.tsx`: estado central e persistencia
- `src/lib/analyze-ticket.ts`: chamada do frontend para a analise
- `src/lib/analyst-knowledge.ts`: leitura da base local do analista
- `src/lib/csv-knowledge-import.ts`: importacao de CSV de conhecimento

No backend:

- `supabase/functions/analyze-ticket/index.ts`: motor principal da analise
- `supabase/functions/analyze-ticket/knowledge-corpus.ts`: evidencias e corpus
- `supabase/functions/public-analyses/index.ts`: suporte ao modo publico

Na documentacao:

- `docs/technical-context-lite.md`: fotografia tecnica atual
- `docs/business-context-lite.md`: visao de produto e regras de negocio
- `docs/backlog-operacional-mvp.md`: backlog organizado do MVP
- `docs/knowledge-corpus-mvp.md`: estrategia do corpus e RAG

## 9. O que ja foi melhorado

As principais melhorias ja consolidadas foram:

- organizacao do repositorio e da documentacao;
- retirada de dados brutos sensiveis do Git;
- publicacao do MVP em Cloudflare;
- integracao server-side com provedores de IA;
- base de conhecimento local para apoiar as sugestoes;
- refinamento do prompt e da normalizacao da resposta;
- reducao de respostas excessivamente genericas em varios cenarios;
- trilha de decisao humana obrigatoria.

## 10. Riscos e limitacoes atuais

Os pontos mais importantes hoje sao:

- ainda existe risco de fallback local em alguns cenarios;
- a qualidade depende muito da base de conhecimento importada;
- o modo sem login e temporario, pensado para viabilizar o MVP;
- parte da inteligencia de busca ainda e simples, sem RAG vetorial completo;
- alguns links antigos de resultado podem nao existir mais no ambiente atual.

## 11. O que falta para um proximo nivel

As evolucoes naturais apos o MVP seriam:

1. validar e eliminar fallback indevido;
2. reforcar a qualidade do corpus;
3. evoluir busca de conhecimento para algo mais robusto;
4. reativar autenticacao de forma controlada;
5. melhorar observabilidade, auditoria e operacao.

## 12. Conclusao curta

O MVP ja esta funcional, acessivel e demonstra bem a proposta do produto: apoiar o analista com sugestoes estruturadas, usando IA e base de conhecimento, mas mantendo revisao humana como regra central.
