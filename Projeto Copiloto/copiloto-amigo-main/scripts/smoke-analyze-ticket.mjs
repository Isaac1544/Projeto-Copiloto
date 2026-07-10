import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const cwd = process.cwd();
const envFiles = [".env.example", ".env.local"];

function parseEnvFile(filePath) {
  if (!existsSync(filePath)) return {};

  return readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .reduce((acc, line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return acc;
      const separator = trimmed.indexOf("=");
      if (separator <= 0) return acc;
      const key = trimmed.slice(0, separator).trim();
      const value = trimmed.slice(separator + 1).trim();
      acc[key] = value;
      return acc;
    }, {});
}

const env = envFiles.reduce((acc, fileName) => {
  return { ...acc, ...parseEnvFile(path.join(cwd, fileName)) };
}, {});

const supabaseUrl = env.VITE_SUPABASE_URL || env.SUPABASE_URL;
const publishableKey = env.VITE_SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !publishableKey) {
  console.error(
    "Faltam VITE_SUPABASE_URL e/ou VITE_SUPABASE_PUBLISHABLE_KEY em .env.local/.env.example.",
  );
  process.exit(1);
}

const payload = {
  title: "Usuário sem acesso ao portal interno",
  description:
    "Usuário relata erro de permissão ao abrir o portal interno após troca de senha. Sem print anexado.",
  category: "Acesso e Permissão",
  priority: "Média",
  additionalContext:
    "Plataforma: Portal Web | Tipo: incidente | Horário: manhã | Serviço afetado: portal interno",
};

const response = await fetch(`${supabaseUrl}/functions/v1/analyze-ticket`, {
  method: "POST",
  headers: {
    "content-type": "application/json",
    apikey: publishableKey,
    Authorization: `Bearer ${publishableKey}`,
  },
  body: JSON.stringify(payload),
});

const body = await response.json().catch(() => null);

if (!response.ok) {
  console.error(`HTTP ${response.status} ao chamar analyze-ticket.`);
  console.error(JSON.stringify(body, null, 2));
  process.exit(1);
}

if (!body?.ok) {
  console.error("A função respondeu com erro funcional.");
  console.error(JSON.stringify(body, null, 2));
  process.exit(1);
}

const analysis = body.analysis;
const fallbackActive = analysis.safetyAlerts?.some((alert) =>
  alert.includes("Modo de contingência ativo"),
);

console.log("Smoke test concluído com sucesso.");
console.log(`Resumo: ${analysis.summary}`);
console.log(`Confianca: ${analysis.confidenceScore}% (${analysis.confidenceLevel})`);
console.log(`Modo da resposta: ${fallbackActive ? "fallback/mock" : "provedor configurado"}`);
console.log(`Fontes: ${analysis.sources?.length ?? 0}`);

if (analysis.safetyAlerts?.length) {
  console.log("Alertas:");
  for (const alert of analysis.safetyAlerts) {
    console.log(`- ${alert}`);
  }
}
