// Dados e tipos mockados do Copiloto L1.
// Preparado para futura substituição por chamadas a Supabase / função
// server-side `analyze-ticket`. NÃO colocar chaves de API aqui.

export type Prioridade = "P1" | "P2" | "P3" | "P4" | "P5" | "Baixa" | "Média" | "Alta" | "Crítica";
export type Categoria =
  | "Infraestrutura e Virtualização"
  | "Rede e Segurança"
  | "Backup e Recuperação"
  | "Identidade e Acesso"
  | "Produtividade e Colaboração"
  | "Aplicação de Negócio"
  | "Observabilidade e Monitoramento"
  | "Outro"
  | "Acesso e Senha"
  | "Hardware"
  | "Software"
  | "Rede"
  | "E-mail"
  | "Outros";
export type TipoTicket = "Incidente" | "Requisição de Serviço" | "Alerta";
export type Plataforma =
  | "Nutanix"
  | "Fortinet"
  | "Veeam"
  | "Commvault"
  | "Windows"
  | "Office 365"
  | "SharePoint"
  | "Odoo"
  | "Exagrid"
  | "Arista"
  | "Outra"
  | "Não informado";
export type SubdominioNutanix =
  | "Prism"
  | "LCM"
  | "AOS"
  | "AHV"
  | "Hardware"
  | "Storage"
  | "CVM"
  | "Data Protection"
  | "NKP"
  | "Não informado";
export type DecisaoStatus = "Pendente" | "Aceita" | "Editada" | "Rejeitada";
export type ScorecardNota = 1 | 2 | 3 | 4 | 5;

export interface ScorecardAvaliacao {
  utilidade: ScorecardNota;
  evidencia: ScorecardNota;
  seguranca: ScorecardNota;
  escalonamento: ScorecardNota;
}

export interface Ticket {
  titulo: string;
  descricao: string;
  categoria: Categoria;
  prioridade: Prioridade;
  tipoTicket?: TipoTicket;
  plataforma?: Plataforma;
  subdominio?: SubdominioNutanix | string;
  servicoAfetado?: string;
  horarioOcorrencia?: string;
  contextoAdicional?: string;
}

export interface SugestaoCopiloto {
  resumo: string;
  possivelCausa: string;
  passosRecomendados: string[];
  sugestaoResposta: string;
  nivelConfianca: number; // 0-100
  alertasLgpd: string[];
  fontesConsultadas: { titulo: string; referencia: string }[];
}

export interface DecisaoHumana {
  status: DecisaoStatus;
  responsavel: string;
  dataHora: string; // ISO
  comentario?: string;
  sugestaoEditada?: string;
  scorecard?: ScorecardAvaliacao;
}

export interface EventoAuditoria {
  status: DecisaoStatus;
  responsavel: string;
  dataHora: string; // ISO
  comentario?: string;
  sugestaoEditada?: string;
  scorecard?: ScorecardAvaliacao;
}

export interface Analise {
  id: string;
  criadoEm: string; // ISO
  ticket: Ticket;
  sugestao: SugestaoCopiloto;
  decisao: DecisaoHumana;
  auditoria: EventoAuditoria[];
}

export const CATEGORIAS: Categoria[] = [
  "Infraestrutura e Virtualização",
  "Rede e Segurança",
  "Backup e Recuperação",
  "Identidade e Acesso",
  "Produtividade e Colaboração",
  "Aplicação de Negócio",
  "Observabilidade e Monitoramento",
  "Outro",
];

export const CATEGORIAS_LEGADO: Categoria[] = [
  "Acesso e Senha",
  "Hardware",
  "Software",
  "Rede",
  "E-mail",
  "Outros",
];

export const TIPOS_TICKET: TipoTicket[] = ["Incidente", "Requisição de Serviço", "Alerta"];

export const PLATAFORMAS: Plataforma[] = [
  "Nutanix",
  "Fortinet",
  "Veeam",
  "Commvault",
  "Windows",
  "Office 365",
  "SharePoint",
  "Odoo",
  "Exagrid",
  "Arista",
  "Outra",
  "Não informado",
];

export const SUBDOMINIOS_NUTANIX: SubdominioNutanix[] = [
  "Prism",
  "LCM",
  "AOS",
  "AHV",
  "Hardware",
  "Storage",
  "CVM",
  "Data Protection",
  "NKP",
  "Não informado",
];

export const PRIORIDADES: Prioridade[] = ["P1", "P2", "P3", "P4", "P5"];
export const SCORECARD_NOTAS: ScorecardNota[] = [1, 2, 3, 4, 5];

const analistas = ["Ana Ribeiro", "Bruno Costa", "Carla Menezes", "Diego Alves"];

// Datas fixas em ISO/UTC para garantir renderização estável entre SSR e cliente.
// Formatadas em pt-BR (America/Sao_Paulo) pelos helpers de exibição.
const D = {
  d0_a: "2026-07-08T12:15:00.000Z", // 08/07/2026 09:15
  d1_a: "2026-07-07T13:40:00.000Z", // 07/07/2026 10:40
  d1_b: "2026-07-07T14:20:00.000Z", // 07/07/2026 11:20
  d2_a: "2026-07-06T17:05:00.000Z", // 06/07/2026 14:05
  d2_b: "2026-07-06T18:30:00.000Z", // 06/07/2026 15:30
  d3_a: "2026-07-05T18:10:00.000Z", // 05/07/2026 15:10
  d3_b: "2026-07-05T19:00:00.000Z", // 05/07/2026 16:00
  d4_a: "2026-07-04T11:25:00.000Z", // 04/07/2026 08:25
} as const;

export const analisesIniciais: Analise[] = [
  {
    id: "an-1001",
    criadoEm: D.d0_a,
    ticket: {
      titulo: "Não consigo acessar o e-mail corporativo",
      descricao:
        "Usuário relata que ao abrir o Outlook recebe mensagem de credenciais inválidas desde a manhã de hoje.",
      categoria: "E-mail",
      prioridade: "Alta",
      contextoAdicional: "Usuário trocou a senha do domínio ontem à tarde.",
    },
    sugestao: {
      resumo:
        "Falha de autenticação no Outlook provavelmente relacionada à troca recente de senha do domínio.",
      possivelCausa: "Cache de credenciais desatualizado após rotação de senha corporativa.",
      passosRecomendados: [
        "Confirmar com o usuário a data da última troca de senha.",
        "Solicitar novo login com a senha atualizada.",
        "Se persistir, orientar o usuário a aguardar a validação da equipe de TI para limpeza de credenciais armazenadas.",
      ],
      sugestaoResposta:
        "Olá! Identificamos que o acesso ao seu e-mail pode estar relacionado à troca recente de senha. A equipe de TI irá validar o ajuste necessário no equipamento corporativo, se aplicável. Pedimos, por gentileza, que tente acessar novamente com a senha atualizada.",
      nivelConfianca: 82,
      alertasLgpd: ["Não solicitar a senha do usuário por e-mail ou chat."],
      fontesConsultadas: [
        { titulo: "Base interna: Procedimento de reset de senha", referencia: "KB-0142" },
        { titulo: "Base interna: Falhas comuns no Outlook", referencia: "KB-0311" },
      ],
    },
    decisao: { status: "Pendente", responsavel: "-", dataHora: D.d0_a },
    auditoria: [],
  },
  {
    id: "an-1002",
    criadoEm: D.d1_a,
    ticket: {
      titulo: "Notebook lento após atualização",
      descricao:
        "Usuário relata lentidão significativa desde a atualização do sistema operacional na última semana.",
      categoria: "Hardware",
      prioridade: "Média",
    },
    sugestao: {
      resumo: "Lentidão em notebook corporativo após atualização recente do sistema operacional.",
      possivelCausa:
        "Serviços de indexação e telemetria em execução pós-atualização, ou drivers desatualizados.",
      passosRecomendados: [
        "Verificar uso de CPU e memória em horário de pico.",
        "Confirmar se o dispositivo está conectado à energia.",
        "Encaminhar para avaliação de drivers pela equipe de TI, se aplicável.",
      ],
      sugestaoResposta:
        "Olá! Recebemos seu relato de lentidão. A equipe de TI irá validar o ajuste necessário no equipamento corporativo, se aplicável, e retornaremos com os próximos passos.",
      nivelConfianca: 68,
      alertasLgpd: [],
      fontesConsultadas: [
        { titulo: "Base interna: Pós-atualização Windows", referencia: "KB-0522" },
      ],
    },
    decisao: {
      status: "Aceita",
      responsavel: "Ana Ribeiro",
      dataHora: D.d1_b,
      comentario: "Sugestão aplicada conforme apresentada.",
    },
    auditoria: [
      {
        status: "Aceita",
        responsavel: "Ana Ribeiro",
        dataHora: D.d1_b,
        comentario: "Sugestão aplicada conforme apresentada.",
      },
    ],
  },
  {
    id: "an-1003",
    criadoEm: D.d2_a,
    ticket: {
      titulo: "VPN cai a cada 10 minutos",
      descricao:
        "Ao trabalhar remotamente, a VPN é desconectada em intervalos curtos, prejudicando o atendimento a clientes.",
      categoria: "Rede",
      prioridade: "Crítica",
      contextoAdicional: "Usuário está em rede residencial via Wi-Fi.",
    },
    sugestao: {
      resumo: "Desconexões recorrentes de VPN em ambiente remoto.",
      possivelCausa:
        "Instabilidade da rede local do usuário ou política de timeout do concentrador VPN.",
      passosRecomendados: [
        "Solicitar teste com conexão cabeada, se possível.",
        "Coletar horário exato das últimas quedas.",
        "Escalar para a equipe de redes caso o problema persista após teste local.",
      ],
      sugestaoResposta:
        "Olá! Recebemos seu relato sobre a instabilidade na conexão remota. Vamos analisar o comportamento e, se necessário, a equipe de TI irá validar o ajuste necessário no equipamento corporativo. Poderia nos informar o horário aproximado das últimas quedas?",
      nivelConfianca: 74,
      alertasLgpd: ["Não solicitar dados da rede residencial além do estritamente necessário."],
      fontesConsultadas: [
        { titulo: "Base interna: Troubleshooting VPN", referencia: "KB-0781" },
        { titulo: "Base interna: Escalonamento para Redes", referencia: "KB-0790" },
      ],
    },
    decisao: {
      status: "Editada",
      responsavel: "Bruno Costa",
      dataHora: D.d2_b,
      comentario: "Ajustei o texto para reforçar coleta de logs antes do escalonamento.",
      sugestaoEditada:
        "Olá! Recebemos seu relato. Antes de encaminharmos à equipe de redes, poderia nos informar os horários exatos das últimas quedas e se é possível testar com uma conexão cabeada? A equipe de TI irá validar o ajuste necessário no equipamento corporativo, se aplicável.",
    },
    auditoria: [
      {
        status: "Editada",
        responsavel: "Bruno Costa",
        dataHora: D.d2_b,
        comentario: "Ajustei o texto para reforçar coleta de logs antes do escalonamento.",
        sugestaoEditada:
          "Olá! Recebemos seu relato. Antes de encaminharmos à equipe de redes, poderia nos informar os horários exatos das últimas quedas e se é possível testar com uma conexão cabeada? A equipe de TI irá validar o ajuste necessário no equipamento corporativo, se aplicável.",
      },
    ],
  },
  {
    id: "an-1004",
    criadoEm: D.d3_a,
    ticket: {
      titulo: "Solicito acesso ao sistema financeiro",
      descricao: "Novo colaborador precisa de acesso ao módulo de contas a pagar.",
      categoria: "Acesso e Senha",
      prioridade: "Baixa",
    },
    sugestao: {
      resumo: "Pedido de novo acesso ao sistema financeiro para colaborador recém-admitido.",
      possivelCausa: "Provisionamento pendente de perfil de acesso.",
      passosRecomendados: [
        "Confirmar aprovação do gestor imediato.",
        "Registrar solicitação no fluxo padrão de provisionamento.",
        "Comunicar SLA estimado ao usuário.",
      ],
      sugestaoResposta:
        "Olá! Recebemos sua solicitação de acesso. Encaminharemos ao fluxo interno de provisionamento e retornaremos com a confirmação assim que a equipe de TI validar as permissões necessárias.",
      nivelConfianca: 91,
      alertasLgpd: [
        "Verificar se o solicitante possui autorização formal antes de conceder acessos.",
      ],
      fontesConsultadas: [
        { titulo: "Base interna: Provisionamento de acessos", referencia: "KB-0055" },
      ],
    },
    decisao: {
      status: "Rejeitada",
      responsavel: "Carla Menezes",
      dataHora: D.d3_b,
      comentario: "Faltou aprovação formal do gestor. Solicitação devolvida ao usuário.",
    },
    auditoria: [
      {
        status: "Rejeitada",
        responsavel: "Carla Menezes",
        dataHora: D.d3_b,
        comentario: "Faltou aprovação formal do gestor. Solicitação devolvida ao usuário.",
      },
    ],
  },
  {
    id: "an-1005",
    criadoEm: D.d4_a,
    ticket: {
      titulo: "Impressora não responde",
      descricao: "A impressora do 3º andar não imprime desde ontem.",
      categoria: "Hardware",
      prioridade: "Média",
    },
    sugestao: {
      resumo: "Impressora departamental indisponível.",
      possivelCausa: "Fila de impressão travada ou perda de conexão com o servidor de impressão.",
      passosRecomendados: [
        "Verificar status da fila de impressão.",
        "Confirmar conectividade do equipamento.",
        "Solicitar reinício remoto pela equipe responsável, se necessário.",
      ],
      sugestaoResposta:
        "Olá! Recebemos o chamado da impressora do 3º andar. A equipe de TI irá validar o ajuste necessário no equipamento corporativo, se aplicável, e retornaremos com uma previsão.",
      nivelConfianca: 77,
      alertasLgpd: [],
      fontesConsultadas: [{ titulo: "Base interna: Fila de impressão", referencia: "KB-0210" }],
    },
    decisao: { status: "Pendente", responsavel: "-", dataHora: D.d4_a },
    auditoria: [],
  },
];

export const ANALISTA_LOGADO = analistas[0];

const META_OPEN = "[COPILOTO_META]";
const META_CLOSE = "[/COPILOTO_META]";
const SCORECARD_OPEN = "[COPILOTO_SCORECARD]";
const SCORECARD_CLOSE = "[/COPILOTO_SCORECARD]";
const MAX_ANALYSIS_CONTEXT_LENGTH = 3000;

function valorMeta(value?: string) {
  return value?.trim() || undefined;
}

export function montarContextoAnalise(ticket: Ticket) {
  const metadata = [
    ["Tipo de registro", ticket.tipoTicket],
    ["Domínio do serviço", ticket.categoria],
    ["Plataforma", ticket.plataforma],
    ["Subdomínio", ticket.subdominio],
    ["Serviço afetado", ticket.servicoAfetado],
    ["Horário da ocorrência", ticket.horarioOcorrencia],
  ].filter(([, value]) => valorMeta(value));

  const contextoLivre = valorMeta(ticket.contextoAdicional);
  if (metadata.length === 0) {
    return contextoLivre;
  }

  const metadataText = metadata.map(([label, value]) => `${label}: ${value}`).join("\n");
  const combined = [META_OPEN, metadataText, META_CLOSE, contextoLivre]
    .filter(Boolean)
    .join("\n\n");

  if (combined.length <= MAX_ANALYSIS_CONTEXT_LENGTH) {
    return combined;
  }

  const reserved = [META_OPEN, metadataText, META_CLOSE].join("\n\n").length + 2;
  const availableForFreeText = Math.max(0, MAX_ANALYSIS_CONTEXT_LENGTH - reserved);
  const freeText = contextoLivre?.slice(0, availableForFreeText).trim();
  return [META_OPEN, metadataText, META_CLOSE, freeText].filter(Boolean).join("\n\n");
}

export function extrairContextoAnalise(contexto?: string) {
  const bruto = valorMeta(contexto);
  if (!bruto || !bruto.includes(META_OPEN) || !bruto.includes(META_CLOSE)) {
    return {
      contextoLivre: bruto,
    };
  }

  const match = bruto.match(/\[COPILOTO_META\]\s*([\s\S]*?)\s*\[\/COPILOTO_META\]\s*([\s\S]*)?/);
  if (!match) {
    return {
      contextoLivre: bruto,
    };
  }

  const metadataLines = match[1]
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const metadata = Object.fromEntries(
    metadataLines
      .map((line) => {
        const separator = line.indexOf(":");
        if (separator === -1) return null;
        const key = line.slice(0, separator).trim();
        const value = line.slice(separator + 1).trim();
        return [key, value];
      })
      .filter(Boolean) as Array<[string, string]>,
  );

  return {
    tipoTicket: metadata["Tipo de registro"] as TipoTicket | undefined,
    dominioServico: metadata["Domínio do serviço"] as Categoria | undefined,
    plataforma: metadata["Plataforma"] as Plataforma | undefined,
    subdominio: metadata["Subdomínio"],
    servicoAfetado: metadata["Serviço afetado"],
    horarioOcorrencia: metadata["Horário da ocorrência"],
    contextoLivre: valorMeta(match[2] ?? ""),
  };
}

export function montarComentarioDecisao(input: {
  comentario?: string;
  scorecard?: ScorecardAvaliacao;
}) {
  const comentarioLivre = valorMeta(input.comentario);
  if (!input.scorecard) {
    return comentarioLivre;
  }

  const scorecardText = [
    `Utilidade: ${input.scorecard.utilidade}`,
    `Evidência: ${input.scorecard.evidencia}`,
    `Segurança: ${input.scorecard.seguranca}`,
    `Escalonamento: ${input.scorecard.escalonamento}`,
  ].join("\n");

  return [SCORECARD_OPEN, scorecardText, SCORECARD_CLOSE, comentarioLivre]
    .filter(Boolean)
    .join("\n\n");
}

export function extrairComentarioDecisao(comentario?: string) {
  const bruto = valorMeta(comentario);
  if (!bruto || !bruto.includes(SCORECARD_OPEN) || !bruto.includes(SCORECARD_CLOSE)) {
    return {
      comentarioLivre: bruto,
    };
  }

  const match = bruto.match(
    /\[COPILOTO_SCORECARD\]\s*([\s\S]*?)\s*\[\/COPILOTO_SCORECARD\]\s*([\s\S]*)?/,
  );
  if (!match) {
    return {
      comentarioLivre: bruto,
    };
  }

  const metadata = Object.fromEntries(
    match[1]
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const separator = line.indexOf(":");
        if (separator === -1) return null;
        return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()];
      })
      .filter(Boolean) as Array<[string, string]>,
  );

  const scorecard = {
    utilidade: Number(metadata.Utilidade),
    evidencia: Number(metadata["Evidência"]),
    seguranca: Number(metadata["Segurança"]),
    escalonamento: Number(metadata.Escalonamento),
  };

  if (
    !SCORECARD_NOTAS.includes(scorecard.utilidade as ScorecardNota) ||
    !SCORECARD_NOTAS.includes(scorecard.evidencia as ScorecardNota) ||
    !SCORECARD_NOTAS.includes(scorecard.seguranca as ScorecardNota) ||
    !SCORECARD_NOTAS.includes(scorecard.escalonamento as ScorecardNota)
  ) {
    return {
      comentarioLivre: bruto,
    };
  }

  return {
    comentarioLivre: valorMeta(match[2] ?? ""),
    scorecard: scorecard as ScorecardAvaliacao,
  };
}

// Simula a geração de uma sugestão pelo Copiloto para um novo ticket.
// No futuro será substituído por uma chamada à função server-side
// `analyze-ticket`, que por sua vez invocará o modelo (ex.: Claude).
export function gerarSugestaoMock(ticket: Ticket): SugestaoCopiloto {
  const textoAnalise = `${ticket.titulo} ${ticket.descricao} ${ticket.contextoAdicional ?? ""}`.toLowerCase();
  const alertas: string[] = [];
  if (/senha|cpf|cartão|token/i.test(ticket.descricao + " " + (ticket.contextoAdicional ?? ""))) {
    alertas.push(
      "Possível dado sensível no relato. Evite registrar credenciais ou dados pessoais em texto livre.",
    );
  }
  const confiancaBase =
    ticket.prioridade === "Crítica" || ticket.prioridade === "P1"
      ? 65
      : ticket.prioridade === "Alta" || ticket.prioridade === "P2"
        ? 78
        : 84;

  const envolveBloqueioAgente =
    /sentinel|agent|agente|bloqueio de rede|programa nao homologado|programa não homologado/.test(
      textoAnalise,
    );

  const resumo = envolveBloqueioAgente
    ? "Chamado indica bloqueio de rede aplicado por agente de segurança após instalação de software não homologado, com necessidade de validação da política que gerou a contenção."
    : `Chamado sobre "${ticket.titulo}" na categoria ${ticket.categoria}.`;

  const possivelCausa = envolveBloqueioAgente
    ? "Indício de atuação do agente de segurança por política de proteção ou quarentena após detectar instalação ou execução de software fora do padrão homologado. A causa exata ainda depende da evidência do alerta disparado."
    : "Análise preliminar baseada nas informações fornecidas. Requer validação humana antes de qualquer ação.";

  const passosRecomendados = envolveBloqueioAgente
    ? [
        "Confirmar no console da ferramenta de segurança qual política, alerta ou evento acionou o bloqueio de rede.",
        "Validar se o software instalado é realmente não homologado e se há necessidade de remoção, liberação controlada ou exceção formal.",
        "Solicitar evidências adicionais, como horário da ocorrência, nome do executável e print/log do alerta, caso essas informações ainda não estejam no chamado.",
        "Escalar para Segurança ou time responsável pela plataforma caso a liberação dependa de exceção, ajuste de política ou análise de risco.",
      ]
    : [
        "Confirmar com o usuário os detalhes descritos no chamado.",
        "Consultar a base de conhecimento interna referente à categoria informada.",
        "Registrar tratativa e, se necessário, escalar ao time responsável.",
      ];

  const sugestaoResposta = envolveBloqueioAgente
    ? "Olá! Recebemos seu chamado e identificamos indícios de que o bloqueio de rede pode ter sido aplicado pelo agente de segurança após a instalação de um programa não homologado. Vamos validar qual política ou alerta gerou essa ação e confirmar se será necessário remover o software, coletar mais evidências ou encaminhar a análise ao time responsável. Se possível, encaminhe o horário aproximado da ocorrência e qualquer mensagem exibida pelo agente para agilizar a tratativa."
    : "Olá! Recebemos seu chamado e estamos analisando as informações. A equipe de TI irá validar o ajuste necessário no equipamento corporativo, se aplicável, e retornaremos com os próximos passos.";

  return {
    resumo,
    possivelCausa,
    passosRecomendados,
    sugestaoResposta,
    nivelConfianca: confiancaBase,
    alertasLgpd: alertas,
    fontesConsultadas: [
      { titulo: `Base interna: ${ticket.categoria}`, referencia: "KB-AUTO" },
      { titulo: "Diretrizes de atendimento N1", referencia: "KB-0001" },
    ],
  };
}

export function novaAnaliseMock(ticket: Ticket): Analise {
  const id = `an-${Date.now()}`;
  return {
    id,
    criadoEm: new Date().toISOString(),
    ticket,
    sugestao: gerarSugestaoMock(ticket),
    decisao: {
      status: "Pendente",
      responsavel: "-",
      dataHora: new Date().toISOString(),
    },
    auditoria: [],
  };
}
