# KB — Caso Resolvido: Alto Uso de Disco em CVM

> Tipo: Caso resolvido / Golden case  
> Uso no MVP: teste e referência de diagnóstico para alerta de disco em CVM.  
> Fonte: `Caso de Uso_Alerta de Alto Uso de Disco em CVM.pdf`.

## Resumo executivo

- **Problema:** alerta de uso elevado de disco em CVM, partição `/home > 75%`.
- **Categoria:** Infraestrutura / Virtualização / Storage / Nutanix CVM.
- **Severidade:** Média / Sev 2.
- **Impacto:** sem indisponibilidade imediata, mas com risco de degradação do cluster se o espaço continuar crescendo.
- **Causa raiz:** acúmulo de arquivos temporários, logs e artefatos operacionais na partição `/home`.
- **Solução aplicada no caso real:** procedimento de limpeza recomendado pela Nutanix KB-1540.
- **Prevenção:** monitoramento contínuo, revisão periódica de temporários/logs e alertas preventivos.

## Sinais de entrada

O Copiloto deve associar a este caso quando encontrar:

- CVM;
- `/home`;
- uso de disco acima de 75%;
- alerta de storage;
- risco de degradação;
- lentidão de serviços de gerenciamento;
- backup impactado;
- filesystem crescendo.

## Evidências necessárias

Para confiança alta, buscar:

- percentual de uso;
- partição afetada;
- CVM afetada;
- existência de indisponibilidade;
- crescimento recente;
- alerta de monitoramento;
- validação de KB oficial;
- autorização para procedimento.

## Diagnóstico provável

Possível saturação de disco na partição `/home` da CVM por acúmulo de arquivos temporários/logs/artefatos operacionais.

## Recomendação segura

- Confirmar partição e percentual.
- Confirmar impacto.
- Consultar procedimento oficial aprovado.
- Não executar script sem revisão técnica.
- Se houver risco ou dúvida, escalar para N2/N3.

## Rascunho revisável

```text
Olá,

Recebemos o chamado e identificamos sinais de alto uso de disco em uma CVM, especialmente na partição /home.

Ainda não há indicação de indisponibilidade imediata, mas o crescimento do uso pode gerar risco de degradação se não for tratado.

Próximos passos:
- validar o percentual atual de uso;
- confirmar a CVM/partição afetada;
- verificar procedimento aprovado para limpeza segura;
- escalar para equipe especializada caso faltem evidências ou haja risco operacional.

Esta resposta é um rascunho e deve ser revisada pelo analista responsável antes do envio.
```

## Nível de confiança

- **Alta:** há percentual, partição e KB validada.
- **Média:** há alerta, mas faltam evidências.
- **Baixa:** só há relato genérico de lentidão ou disco.

## Observação

Comandos e scripts citados em caso real não devem ser executados automaticamente pelo Copiloto.
