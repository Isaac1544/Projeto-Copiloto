# KB — Padrão de Resposta ao Cliente

> Tipo: Comunicação  
> Uso no MVP: orientar rascunhos revisáveis para resposta ao cliente.  
> Fontes: prints do FreshService, processo de incidentes e casos de uso.

## Objetivo

Padronizar a forma como o Copiloto gera rascunhos, sempre como apoio ao analista.

## Estrutura recomendada

```text
Olá, [saudação neutra].

Recebemos o chamado e realizamos uma triagem inicial.

Resumo identificado:
- [fato observado, sem expor dados sensíveis]

Evidências analisadas:
- [evidência 1]
- [evidência 2]

Próximos passos:
- [ação segura/revisável]
- [pedido de informação, se necessário]
- [escalonamento, se aplicável]

Observação:
Esta resposta é um rascunho e deve ser revisada pelo analista responsável antes do envio.

Atenciosamente,
Equipe de Suporte
```

## Regras de linguagem

- Ser claro e profissional.
- Não prometer solução antes de validação.
- Não expor causa raiz como fato se for hipótese.
- Não expor dados internos, IPs, hosts ou topologia.
- Não mencionar “a IA decidiu”.
- Não orientar cliente a executar ações arriscadas sem validação.
- Não declarar contato com fabricante se isso ainda não ocorreu.

## Exemplos de frases seguras

- “Identificamos sinais compatíveis com...”
- “Ainda não há evidência suficiente para confirmar...”
- “Recomendamos coletar as seguintes informações...”
- “O caso deve ser validado por equipe especializada antes de qualquer ação corretiva.”
- “Esta análise inicial será revisada pelo analista responsável.”

## Saída esperada do MVP

```json
{
  "customer_draft": "texto revisável",
  "tone": "profissional",
  "risk_flags": ["sem_dados_sensiveis", "revisao_humana_obrigatoria"]
}
```
