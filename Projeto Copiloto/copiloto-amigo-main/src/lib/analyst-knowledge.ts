import type { AnalyzeTicketInput, AnalyzeTicketKnowledgeSource } from "./analyze-ticket-contract";

export interface AnalystKnowledgeItem {
  id: string;
  title: string;
  content: string;
  keywords: string[];
  origin: "manual" | "upload";
  fileName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnalystKnowledgeEvidence extends AnalyzeTicketKnowledgeSource {
  excerpt: string;
  score: number;
  matchedKeywords: string[];
  guidance: string[];
}

const ANALYST_KB_STORAGE_KEY = "copiloto-l1.analyst-kb.v1";
const MAX_ANALYST_CONTEXT_LENGTH = 1400;
const STOPWORDS = new Set([
  "a",
  "ao",
  "aos",
  "as",
  "com",
  "como",
  "da",
  "das",
  "de",
  "do",
  "dos",
  "e",
  "em",
  "na",
  "nas",
  "no",
  "nos",
  "o",
  "os",
  "ou",
  "para",
  "por",
  "que",
  "se",
  "sem",
  "um",
  "uma",
]);

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function uniqueStrings(values: string[]) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function tokenize(value: string) {
  return normalize(value)
    .split(/[^a-z0-9]+/g)
    .map((token) => token.trim())
    .filter((token) => token.length >= 4 && !STOPWORDS.has(token));
}

function extractKeywords(title: string, content: string, providedKeywords: string[]) {
  const ranked = new Map<string, number>();

  for (const token of [...providedKeywords, ...tokenize(title), ...tokenize(content)]) {
    ranked.set(token, (ranked.get(token) ?? 0) + 1);
  }

  return Array.from(ranked.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([keyword]) => keyword);
}

function extractExcerpt(content: string) {
  const compact = content.replace(/\s+/g, " ").trim();
  return compact.length <= 240 ? compact : `${compact.slice(0, 237).trimEnd()}...`;
}

function extractGuidance(content: string) {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const bulletLines = lines
    .filter((line) => /^[-*•]/.test(line) || /^\d+[.)]/.test(line))
    .map((line) => line.replace(/^[-*•]\s*/, "").replace(/^\d+[.)]\s*/, "").trim())
    .filter((line) => line.length >= 12);

  if (bulletLines.length > 0) {
    return bulletLines.slice(0, 3);
  }

  return content
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length >= 20)
    .slice(0, 3);
}

function buildReference(item: Pick<AnalystKnowledgeItem, "id">) {
  return `ANL-KB-${item.id.slice(0, 8).toUpperCase()}`;
}

export function readAnalystKnowledgeItems(): AnalystKnowledgeItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(ANALYST_KB_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as AnalystKnowledgeItem[]) : [];
  } catch {
    return [];
  }
}

export function persistAnalystKnowledgeItems(items: AnalystKnowledgeItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ANALYST_KB_STORAGE_KEY, JSON.stringify(items));
}

export function createAnalystKnowledgeItem(input: {
  title: string;
  content: string;
  keywordsText?: string;
  origin: AnalystKnowledgeItem["origin"];
  fileName?: string;
}) {
  const title = input.title.trim();
  const content = input.content.trim();
  const providedKeywords = uniqueStrings(
    (input.keywordsText ?? "")
      .split(/[,\n;]/g)
      .map((keyword) => normalize(keyword))
      .filter(Boolean),
  );
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    title,
    content,
    keywords: extractKeywords(title, content, providedKeywords),
    origin: input.origin,
    fileName: input.fileName,
    createdAt: now,
    updatedAt: now,
  } satisfies AnalystKnowledgeItem;
}

export function appendAnalystKnowledgeItems(items: AnalystKnowledgeItem[]) {
  const current = readAnalystKnowledgeItems();
  const next = [...items, ...current];
  persistAnalystKnowledgeItems(next);
  return next;
}

export function removeAnalystKnowledgeItem(id: string) {
  const current = readAnalystKnowledgeItems();
  const next = current.filter((item) => item.id !== id);
  persistAnalystKnowledgeItems(next);
  return next;
}

export function clearAnalystKnowledgeItems() {
  persistAnalystKnowledgeItems([]);
  return [];
}

export function retrieveAnalystKnowledgeEvidence(
  ticket: AnalyzeTicketInput,
): AnalystKnowledgeEvidence[] {
  const items = readAnalystKnowledgeItems();
  if (items.length === 0) return [];

  const searchText = normalize(
    [
      ticket.title,
      ticket.description,
      ticket.category,
      ticket.priority,
      ticket.additionalContext ?? "",
    ].join(" "),
  );

  return items
    .map((item) => {
      const matchedKeywords = item.keywords.filter((keyword) => searchText.includes(keyword));
      const normalizedTitle = normalize(item.title);
      const titleMatches =
        normalize(ticket.title).includes(normalizedTitle) || normalizedTitle.includes(normalize(ticket.title));
      const contentMatches = item.keywords.some((keyword) => searchText.includes(keyword));
      const score = matchedKeywords.length * 8 + (titleMatches ? 4 : 0) + (contentMatches ? 2 : 0);

      return {
        title: item.title,
        reference: buildReference(item),
        sourceType: "analyst_kb",
        excerpt: extractExcerpt(item.content),
        score,
        matchedKeywords,
        guidance: extractGuidance(item.content),
      } satisfies AnalystKnowledgeEvidence;
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

export function buildAnalystKnowledgeContext(evidence: AnalystKnowledgeEvidence[]) {
  if (evidence.length === 0) return undefined;

  const combined = [
    "[BASE_ANALISTA]",
    ...evidence.map((item, index) =>
      [
        `Fonte ${index + 1}: ${item.title} (${item.reference})`,
        `Trecho: ${item.excerpt}`,
        item.guidance.length > 0 ? `Orientações: ${item.guidance.join(" | ")}` : undefined,
        item.matchedKeywords.length > 0
          ? `Palavras-chave: ${item.matchedKeywords.join(", ")}`
          : undefined,
      ]
        .filter(Boolean)
        .join("\n"),
    ),
    "[/BASE_ANALISTA]",
  ]
    .join("\n\n")
    .trim();

  if (combined.length <= MAX_ANALYST_CONTEXT_LENGTH) {
    return combined;
  }

  return `${combined.slice(0, MAX_ANALYST_CONTEXT_LENGTH - 3).trimEnd()}...`;
}
