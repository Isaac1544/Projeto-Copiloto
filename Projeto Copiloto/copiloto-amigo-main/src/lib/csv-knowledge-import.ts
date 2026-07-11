import { createAnalystKnowledgeItem, type AnalystKnowledgeItem } from "./analyst-knowledge";

const MAX_IMPORTED_CASES = 120;

type ParsedCsv = {
  headers: string[];
  rows: Array<Record<string, string>>;
};

type ImportResult = {
  items: AnalystKnowledgeItem[];
  skippedRows: number;
  truncated: boolean;
};

function normalizeHeader(value: string) {
  return value.replace(/\uFEFF/g, "").trim();
}

function normalizeCell(value: string) {
  return value.replace(/\r\n/g, "\n").trim();
}

function normalizeLookup(value: string) {
  return normalizeHeader(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function parseCsvLine(line: string) {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        index += 1;
        continue;
      }

      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      cells.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  cells.push(current);
  return cells.map(normalizeCell);
}

function parseCsvText(text: string): ParsedCsv {
  const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const rawLines = normalized
    .split("\n")
    .map((line) => line.trimEnd())
    .filter(Boolean);

  if (rawLines.length < 2) {
    return { headers: [], rows: [] };
  }

  const headerCells = parseCsvLine(rawLines[0]);
  const occurrenceMap = new Map<string, number>();
  const headers = headerCells.map((header) => {
    const normalizedHeader = normalizeHeader(header);
    const key = normalizeLookup(normalizedHeader);
    const occurrence = (occurrenceMap.get(key) ?? 0) + 1;
    occurrenceMap.set(key, occurrence);
    return occurrence === 1 ? normalizedHeader : `${normalizedHeader}__${occurrence}`;
  });

  const rows = rawLines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(
      headers.map((header, index) => [header, values[index] ?? ""]),
    ) as Record<string, string>;
  });

  return { headers, rows };
}

function findColumnValue(row: Record<string, string>, headers: string[], aliases: string[]) {
  const aliasSet = new Set(aliases.map(normalizeLookup));

  for (const header of headers) {
    const baseHeader = header.split("__")[0] ?? header;
    if (aliasSet.has(normalizeLookup(baseHeader))) {
      const value = normalizeCell(row[header] ?? "");
      if (value) return value;
    }
  }

  return "";
}

function isNoiseRow(input: { title: string; description: string }) {
  const normalized = `${input.title} ${input.description}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  return /\bteste?s?\b/.test(normalized) || normalized.length < 20;
}

function buildCaseContent(caseData: {
  assunto: string;
  descricao: string;
  categoria: string;
  subcategoria: string;
  tipo: string;
  prioridade: string;
  urgencia: string;
  empresa: string;
  grupo: string;
  origem: string;
  agente: string;
  status: string;
  statusResolucao: string;
  notaResolucao: string;
  horaCriacao: string;
  ticketId: string;
}) {
  return [
    `Caso histórico: ${caseData.assunto}`,
    [
      caseData.categoria ? `Categoria ${caseData.categoria}` : undefined,
      caseData.subcategoria ? `subcategoria ${caseData.subcategoria}` : undefined,
      caseData.tipo ? `tipo ${caseData.tipo}` : undefined,
    ]
      .filter(Boolean)
      .join(", ") || undefined,
    [
      caseData.prioridade ? `Prioridade ${caseData.prioridade}` : undefined,
      caseData.urgencia ? `urgência ${caseData.urgencia}` : undefined,
      caseData.status ? `status ${caseData.status}` : undefined,
    ]
      .filter(Boolean)
      .join(", ") || undefined,
    caseData.empresa || caseData.grupo
      ? `Contexto operacional: ${[caseData.empresa, caseData.grupo].filter(Boolean).join(" / ")}`
      : undefined,
    caseData.horaCriacao ? `Data de abertura original: ${caseData.horaCriacao}` : undefined,
    caseData.ticketId ? `Identificador original: ${caseData.ticketId}` : undefined,
    `Relato do caso: ${caseData.descricao}`,
    caseData.notaResolucao ? `Desfecho anterior: ${caseData.notaResolucao}` : undefined,
    caseData.statusResolucao ? `Status anterior da resolução: ${caseData.statusResolucao}` : undefined,
    caseData.agente ? `Analista anterior: ${caseData.agente}` : undefined,
    caseData.origem ? `Origem do chamado: ${caseData.origem}` : undefined,
  ]
    .filter(Boolean)
    .join("\n");
}

function buildKeywordsText(caseData: {
  assunto: string;
  categoria: string;
  subcategoria: string;
  tipo: string;
  prioridade: string;
  urgencia: string;
  empresa: string;
  grupo: string;
}) {
  return [
    caseData.assunto,
    caseData.categoria,
    caseData.subcategoria,
    caseData.tipo,
    caseData.prioridade,
    caseData.urgencia,
    caseData.empresa,
    caseData.grupo,
  ]
    .filter(Boolean)
    .join(", ");
}

export function importCsvAsKnowledgeItems(
  fileName: string,
  content: string,
): ImportResult {
  const parsed = parseCsvText(content);
  if (parsed.headers.length === 0 || parsed.rows.length === 0) {
    return {
      items: [],
      skippedRows: 0,
      truncated: false,
    };
  }

  const items: AnalystKnowledgeItem[] = [];
  let skippedRows = 0;
  let truncated = false;

  for (const row of parsed.rows) {
    const assunto = findColumnValue(row, parsed.headers, ["Assunto", "Título", "Titulo"]);
    const descricao = findColumnValue(row, parsed.headers, ["Descrição", "Descricao"]);
    const categoria = findColumnValue(row, parsed.headers, ["Categoria"]);
    const subcategoria = findColumnValue(row, parsed.headers, ["Subcategoria"]);
    const tipo = findColumnValue(row, parsed.headers, ["Tipo"]);
    const prioridade = findColumnValue(row, parsed.headers, ["Prioridade"]);
    const urgencia = findColumnValue(row, parsed.headers, ["Urgência", "Urgencia"]);
    const empresa = findColumnValue(row, parsed.headers, ["Empresa"]);
    const grupo = findColumnValue(row, parsed.headers, ["Grupo"]);
    const origem = findColumnValue(row, parsed.headers, ["Origem"]);
    const agente = findColumnValue(row, parsed.headers, ["Agente"]);
    const status = findColumnValue(row, parsed.headers, ["Status"]);
    const statusResolucao = findColumnValue(row, parsed.headers, [
      "Status da Resolução",
      "Status da Resolucao",
    ]);
    const notaResolucao = findColumnValue(row, parsed.headers, [
      "Nota de resolução",
      "Nota de resolucao",
    ]);
    const horaCriacao = findColumnValue(row, parsed.headers, [
      "Hora da Criação",
      "Hora da Criacao",
    ]);
    const ticketId = findColumnValue(row, parsed.headers, ["ID do ticket"]);

    if (!assunto || !descricao || isNoiseRow({ title: assunto, description: descricao })) {
      skippedRows += 1;
      continue;
    }

    const title = `${assunto}${ticketId ? ` [Ticket ${ticketId}]` : ""}`;
    const caseContent = buildCaseContent({
      assunto,
      descricao,
      categoria,
      subcategoria,
      tipo,
      prioridade,
      urgencia,
      empresa,
      grupo,
      origem,
      agente,
      status,
      statusResolucao,
      notaResolucao,
      horaCriacao,
      ticketId,
    });

    items.push(
      createAnalystKnowledgeItem({
        title,
        content: caseContent,
        keywordsText: buildKeywordsText({
          assunto,
          categoria,
          subcategoria,
          tipo,
          prioridade,
          urgencia,
          empresa,
          grupo,
        }),
        origin: "upload",
        fileName,
      }),
    );

    if (items.length >= MAX_IMPORTED_CASES) {
      truncated = parsed.rows.length - skippedRows > MAX_IMPORTED_CASES;
      break;
    }
  }

  return {
    items,
    skippedRows,
    truncated,
  };
}
