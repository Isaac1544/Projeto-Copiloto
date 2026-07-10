const PUBLIC_SESSION_STORAGE_KEY = "copiloto-l1.public-session.v1";

function generatePublicSessionId() {
  const generated =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  return `public-${generated}`;
}

export function getPublicSessionId() {
  if (typeof window === "undefined") {
    return "public-ssr";
  }

  const existing = window.localStorage.getItem(PUBLIC_SESSION_STORAGE_KEY);
  if (existing) {
    return existing;
  }

  const created = generatePublicSessionId();
  window.localStorage.setItem(PUBLIC_SESSION_STORAGE_KEY, created);
  return created;
}
