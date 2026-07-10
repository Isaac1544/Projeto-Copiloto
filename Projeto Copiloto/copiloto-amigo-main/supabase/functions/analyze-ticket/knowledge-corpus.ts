import type {
  AnalyzeTicketInput,
  AnalyzeTicketKnowledgeSource,
} from "../../../src/lib/analyze-ticket-contract.ts";

export interface RankedKnowledgeEvidence extends AnalyzeTicketKnowledgeSource {
  excerpt: string;
  score: number;
  matchedKeywords: string[];
}

interface LocalKnowledgeEntry extends AnalyzeTicketKnowledgeSource {
  excerpt: string;
  guidance: string[];
  keywords: string[];
  baselineScore: number;
}

const KNOWLEDGE_CORPUS: LocalKnowledgeEntry[] = [
  {
    title: "KB — Processo de Gerenciamento de Incidentes",
    reference: "KB-PROC-INC",
    sourceType: "process",
    baselineScore: 2,
    keywords: [
      "incidente",
      "triagem",
      "prioridade",
      "impacto",
      "urgencia",
      "workaround",
      "contorno",
      "analista",
      "chamado",
    ],
    excerpt:
      "O N1 deve classificar, priorizar, consultar a KB e só sugerir solução quando houver evidência e elegibilidade operacional.",
    guidance: [
      "Separar fatos, hipótese e recomendação.",
      "Se não houver solução documentada para N1, pedir mais dados ou escalar.",
      "Manter revisão humana obrigatória antes de qualquer envio ao cliente.",
    ],
  },
  {
    title: "KB — Escalonamento N1 / N2 / N3 / Fornecedor",
    reference: "KB-ESC-N1N2N3",
    sourceType: "process",
    baselineScore: 2,
    keywords: [
      "escalar",
      "escalonamento",
      "n1",
      "n2",
      "n3",
      "fornecedor",
      "vendor",
      "mais dados",
      "diagnostico",
    ],
    excerpt:
      "Escalar para N2 quando não houver workaround documentado ou houver risco técnico relevante; escalar para N3/fabricante em casos de cluster crítico, bug ou ação especializada.",
    guidance: [
      "Pedir mais dados quando faltarem logs, horário da ocorrência, serviço afetado ou componente claro.",
      "Escalar para N2 em casos de storage, cluster, backup ou rede com risco relevante.",
      "Escalar para N3/fabricante quando houver bug, script do vendor ou instabilidade crítica de cluster.",
    ],
  },
  {
    title: "KB — Segurança, LGPD e Mascaramento",
    reference: "KB-SEC-LGPD",
    sourceType: "policy",
    baselineScore: 1,
    keywords: [
      "senha",
      "token",
      "chave",
      "segredo",
      "credencial",
      "lgpd",
      "email",
      "telefone",
      "ip",
      "host",
    ],
    excerpt:
      "Nenhum conteúdo com segredo, token, chave, PII ou topologia identificável deve seguir para IA sem bloqueio ou mascaramento.",
    guidance: [
      "Bloquear envio quando houver senha, token, chave, certificado privado ou topologia sensível.",
      "Mascarar e-mail, telefone, IP, hostname e identificadores antes do processamento.",
      "Registrar alertas de segurança junto com a análise.",
    ],
  },
  {
    title: "KB — Nutanix Infraestrutura",
    reference: "KB-NTNX-INFRA",
    sourceType: "kb_article",
    baselineScore: 1,
    keywords: [
      "nutanix",
      "cluster",
      "storage",
      "cvm",
      "prism",
      "lcm",
      "aos",
      "ahv",
      "nkp",
      "acropolis",
    ],
    excerpt:
      "Tickets Nutanix devem ser classificados por subdomínio como Prism, LCM, AOS, AHV, Hardware/Storage ou NKP para recuperar a evidência correta.",
    guidance: [
      "Se houver impacto em cluster produtivo, tratar como risco alto.",
      "Se o artigo for draft ou a evidência for parcial, reduzir a confiança.",
      "Se depender de ação do fabricante, recomendar validação N2/N3.",
    ],
  },
  {
    title: "KB — Nutanix Prism, LCM, AOS, AHV e NKP",
    reference: "KB-NTNX-TAX",
    sourceType: "kb_article",
    baselineScore: 1,
    keywords: [
      "prism central",
      "prism element",
      "lifecycle manager",
      "lcm",
      "aos",
      "acropolis",
      "task stuck",
      "ahv",
      "vm",
      "nkp",
      "kommander",
      "crashloop",
    ],
    excerpt:
      "Prism concentra autenticação e gestão; LCM cobre inventory e update; AOS/Acropolis cobre cluster health e crash; AHV cobre hosts e VMs; NKP cobre control plane e certificados.",
    guidance: [
      "Usar artigos published e sinais claros para aumentar confiança.",
      "Se houver somente termo genérico sem log, manter confiança baixa.",
      "Relacionar o subdomínio técnico com a próxima ação operacional.",
    ],
  },
  {
    title: "KB — Caso Resolvido: Alto Uso de Disco em CVM",
    reference: "CASE-CVM-DISK",
    sourceType: "resolved_case",
    baselineScore: 3,
    keywords: [
      "cvm",
      "/home",
      "disco",
      "disk",
      "storage",
      "75%",
      "alto uso",
      "filesystem",
      "espaco",
      "particao",
    ],
    excerpt:
      "Quando houver alerta de alto uso em /home de CVM, o N1 deve confirmar partição e percentual, consultar procedimento aprovado e evitar executar script sem revisão técnica.",
    guidance: [
      "Confirmar partição afetada, percentual de uso e impacto atual.",
      "Consultar procedimento oficial de limpeza segura antes de qualquer ação.",
      "Escalar para N2/N3 se houver risco operacional, falta de autorização ou dúvida técnica.",
    ],
  },
  {
    title: "KB — Caso Resolvido: Crash do Serviço Acropolis",
    reference: "CASE-ACROPOLIS-CRASH",
    sourceType: "resolved_case",
    baselineScore: 4,
    keywords: [
      "acropolis",
      "aplos",
      "memory_model",
      "2 == 1 failed",
      "idf",
      "crash",
      "crash loop",
      "cluster degraded",
      "vm inacessivel",
      "console indisponivel",
    ],
    excerpt:
      "Sinais de crash do serviço Acropolis com impacto em VMs e cluster devem ser tratados como caso crítico e normalmente exigem escalonamento para N2/N3/fabricante.",
    guidance: [
      "Tratar como incidente crítico e coletar evidências mínimas do cluster.",
      "Validar impacto em VMs, hosts e histórico de instabilidade de rede.",
      "Não executar script corretivo ou ação de fabricante sem validação especializada.",
    ],
  },
  {
    title: "KB — Padrão de Resposta ao Cliente",
    reference: "KB-RESP-CLIENTE",
    sourceType: "policy",
    baselineScore: 1,
    keywords: [
      "resposta",
      "cliente",
      "triagem",
      "proximos passos",
      "rascunho",
      "comunicacao",
      "atendimento",
    ],
    excerpt:
      "O rascunho ao cliente deve ser profissional, não prometer solução antes da validação e sempre deixar claro que a análise será revisada pelo analista responsável.",
    guidance: [
      "Usar saudação neutra e resumo curto do que foi observado.",
      "Citar próximos passos seguros ou pedido de mais dados.",
      "Evitar expor dados internos, topologia ou afirmar contato com fabricante sem confirmação.",
    ],
  },
];

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function uniqueStrings(values: string[]) {
  return Array.from(new Set(values));
}

function buildSearchText(ticket: AnalyzeTicketInput, sanitizationAlerts: string[]) {
  return normalize(
    [
      ticket.title,
      ticket.description,
      ticket.category,
      ticket.priority,
      ticket.additionalContext ?? "",
      sanitizationAlerts.join(" "),
    ].join(" "),
  );
}

function scoreEntry(searchText: string, entry: LocalKnowledgeEntry) {
  const matchedKeywords = entry.keywords.filter((keyword) =>
    searchText.includes(normalize(keyword)),
  );
  const score = entry.baselineScore + matchedKeywords.length * 6;
  return {
    matchedKeywords,
    score,
  };
}

export function retrieveKnowledgeEvidence(
  ticket: AnalyzeTicketInput,
  sanitizationAlerts: string[],
): RankedKnowledgeEvidence[] {
  const searchText = buildSearchText(ticket, sanitizationAlerts);
  const ranked = KNOWLEDGE_CORPUS.map((entry) => {
    const { matchedKeywords, score } = scoreEntry(searchText, entry);
    return {
      title: entry.title,
      reference: entry.reference,
      sourceType: entry.sourceType,
      excerpt: entry.excerpt,
      score,
      matchedKeywords,
    };
  })
    .filter((entry) => entry.score > 2)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (ranked.length > 0) {
    return ranked;
  }

  return KNOWLEDGE_CORPUS.filter((entry) =>
    ["KB-PROC-INC", "KB-ESC-N1N2N3", "KB-RESP-CLIENTE"].includes(entry.reference),
  ).map((entry) => ({
    title: entry.title,
    reference: entry.reference,
    sourceType: entry.sourceType,
    excerpt: entry.excerpt,
    score: entry.baselineScore,
    matchedKeywords: [],
  }));
}

export function buildEvidencePromptContext(evidence: RankedKnowledgeEvidence[]) {
  if (evidence.length === 0) {
    return "Nenhuma evidência de KB foi recuperada.";
  }

  return evidence
    .map((item, index) => {
      const keywords =
        item.matchedKeywords.length > 0 ? item.matchedKeywords.join(", ") : "sem match explícito";
      return [
        `Evidência ${index + 1}: ${item.title} (${item.reference})`,
        `Tipo: ${item.sourceType}`,
        `Trecho: ${item.excerpt}`,
        `Palavras-chave associadas: ${keywords}`,
      ].join("\n");
    })
    .join("\n\n");
}

function hasReference(evidence: RankedKnowledgeEvidence[], reference: string) {
  return evidence.some((item) => item.reference === reference);
}

function containsAny(text: string, terms: string[]) {
  return terms.some((term) => text.includes(normalize(term)));
}

function buildCustomerDraft(summary: string, nextSteps: string[]) {
  const lines = nextSteps.slice(0, 3).map((step) => `- ${step}`);
  return [
    "Olá,",
    "",
    "Recebemos o chamado e realizamos uma triagem inicial.",
    "",
    `Resumo identificado: ${summary}`,
    "",
    "Próximos passos:",
    ...lines,
    "",
    "Esta análise inicial será revisada pelo analista responsável antes do envio.",
    "",
    "Atenciosamente,",
    "Equipe de Suporte",
  ].join("\n");
}

export function buildRuleBasedFallbackAnalysis(
  ticket: AnalyzeTicketInput,
  sanitizationAlerts: string[],
  evidence: RankedKnowledgeEvidence[],
) {
  const normalizedText = buildSearchText(ticket, sanitizationAlerts);

  if (
    hasReference(evidence, "CASE-ACROPOLIS-CRASH") ||
    containsAny(normalizedText, [
      "acropolis",
      "memory_model",
      "2 == 1 failed",
      "crash loop",
      "cluster degraded",
    ])
  ) {
    const recommendedSteps = [
      "Confirmar impacto atual em VMs, hosts e capacidade de gerenciamento do cluster.",
      "Coletar logs, horário da falha e sinais de instabilidade de rede anteriores ao incidente.",
      "Escalar imediatamente para N2/N3 ou fabricante antes de qualquer ação corretiva.",
    ];
    const summary =
      "Sinais compatíveis com incidente crítico em cluster Nutanix/Acropolis, com risco direto para VMs e gerenciamento.";
    return {
      summary,
      probableCause:
        "Hipótese forte de falha no serviço Acropolis ou inconsistência interna de cluster, exigindo validação especializada.",
      recommendedSteps,
      suggestedResponse: buildCustomerDraft(summary, recommendedSteps),
      confidenceScore: 84,
      safetyAlerts: uniqueStrings([
        ...sanitizationAlerts,
        "Caso crítico de cluster: evitar scripts corretivos sem validação especializada.",
      ]),
    };
  }

  if (
    hasReference(evidence, "CASE-CVM-DISK") ||
    containsAny(normalizedText, ["cvm", "/home", "alto uso de disco", "disk usage", "filesystem"])
  ) {
    const recommendedSteps = [
      "Confirmar a CVM, partição afetada e percentual atual de uso de disco.",
      "Validar se já existe procedimento aprovado de limpeza segura para o caso.",
      "Escalar para N2/N3 se houver risco operacional, crescimento acelerado ou falta de autorização para intervenção.",
    ];
    const summary =
      "Sinais compatíveis com alto uso de disco em CVM, com risco de degradação operacional se o crescimento continuar.";
    return {
      summary,
      probableCause:
        "Possível saturação da partição /home ou filesystem associado à CVM por acúmulo de logs, temporários ou artefatos operacionais.",
      recommendedSteps,
      suggestedResponse: buildCustomerDraft(summary, recommendedSteps),
      confidenceScore: 78,
      safetyAlerts: uniqueStrings([
        ...sanitizationAlerts,
        "Não executar script de limpeza sem procedimento aprovado e revisão humana.",
      ]),
    };
  }

  if (containsAny(normalizedText, ["prism", "lcm", "inventory", "pre-check", "update failure"])) {
    const recommendedSteps = [
      "Confirmar componente afetado, mensagem exata de erro e horário da ocorrência.",
      "Verificar se o caso se enquadra em Prism ou LCM para recuperar o procedimento mais adequado.",
      "Escalar para N2 se não houver workaround documentado ou se a atualização envolver risco operacional.",
    ];
    const summary =
      "Chamado Nutanix com sinais de subdomínio administrativo ou de atualização, ainda exigindo detalhamento adicional para fechar diagnóstico.";
    return {
      summary,
      probableCause:
        "Hipótese inicial associada a falha de gestão centralizada ou ciclo de atualização, com evidência ainda parcial.",
      recommendedSteps,
      suggestedResponse: buildCustomerDraft(summary, recommendedSteps),
      confidenceScore: 70,
      safetyAlerts: uniqueStrings(sanitizationAlerts),
    };
  }

  const recommendedSteps = [
    "Confirmar o serviço afetado, o impacto percebido e o horário aproximado da ocorrência.",
    "Consultar a KB mais aderente à categoria e verificar se existe workaround elegível ao N1.",
    "Pedir mais dados ou escalar para N2 se faltarem evidências suficientes para uma orientação segura.",
  ];
  const summary = `Chamado sobre "${ticket.title}" classificado em ${ticket.category}, ainda em triagem inicial com revisão humana obrigatória.`;
  return {
    summary,
    probableCause:
      "Hipótese preliminar baseada nas informações sanitizadas disponíveis, sem evidência suficiente para confirmar causa raiz.",
    recommendedSteps,
    suggestedResponse: buildCustomerDraft(summary, recommendedSteps),
    confidenceScore:
      ticket.priority === "Crítica" || ticket.priority === "P1"
        ? 62
        : ticket.priority === "Alta" || ticket.priority === "P2"
          ? 68
          : 74,
    safetyAlerts: uniqueStrings(sanitizationAlerts),
  };
}
