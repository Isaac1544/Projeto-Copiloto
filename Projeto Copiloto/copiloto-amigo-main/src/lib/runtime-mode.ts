const runtimeEnv =
  typeof import.meta !== "undefined" && import.meta.env
    ? (import.meta.env as Record<string, string | boolean | undefined>)
    : {};

function readEnv(name: string) {
  const value = runtimeEnv[name];
  return typeof value === "string" ? value : undefined;
}

export function isSupabaseConfigured() {
  return Boolean(readEnv("VITE_SUPABASE_URL") && readEnv("VITE_SUPABASE_PUBLISHABLE_KEY"));
}

export function isAuthBypassEnabled() {
  return readEnv("VITE_AUTH_BYPASS") === "true";
}

export function isDemoModeEnabled() {
  const explicitMode = readEnv("VITE_DEMO_MODE");
  if (explicitMode === "true") return true;
  if (explicitMode === "false") return false;
  return !isSupabaseConfigured();
}

export function getRuntimeModeLabel() {
  if (isDemoModeEnabled()) return "Demonstração";
  if (isAuthBypassEnabled()) return "Acesso público";
  return "Conectado";
}
