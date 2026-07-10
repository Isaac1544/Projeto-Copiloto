import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

const currentFile = fileURLToPath(import.meta.url);
const scriptsDir = dirname(currentFile);
const projectRoot = join(scriptsDir, "..");
const require = createRequire(import.meta.url);

const viteBin = join(dirname(require.resolve("vite/package.json")), "bin", "vite.js");
const eslintBin = join(dirname(require.resolve("eslint/package.json")), "bin", "eslint.js");

const filesToLint = [
  "src/lib/runtime-mode.ts",
  "src/lib/analyze-ticket.ts",
  "src/lib/analyze-ticket-contract.ts",
  "src/lib/copiloto-store.tsx",
  "src/routes/auth.tsx",
  "src/routes/_authenticated/route.tsx",
  "src/routes/_authenticated/index.tsx",
  "src/routes/_authenticated/novo-atendimento.tsx",
  "src/routes/_authenticated/resultado.$id.tsx",
  "src/components/copiloto/AppShell.tsx",
  "supabase/functions/analyze-ticket/index.ts",
  "supabase/functions/analyze-ticket/knowledge-corpus.ts",
];

function assertExists(path, label) {
  if (!existsSync(path)) {
    console.error(`[verify:mvp] ${label} não encontrado: ${path}`);
    process.exit(1);
  }
}

function run(command, args, label) {
  console.log(`\n[verify:mvp] ${label}`);
  const result = spawnSync(command, args, {
    cwd: projectRoot,
    stdio: "inherit",
    shell: false,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

assertExists(viteBin, "Binário do Vite");
assertExists(eslintBin, "Binário do ESLint");

run(process.execPath, [viteBin, "build"], "Build de produção");
run(process.execPath, [eslintBin, ...filesToLint], "Lint focado nos arquivos críticos do MVP");

console.log("\n[verify:mvp] OK: build e lint focado concluídos com sucesso.");
