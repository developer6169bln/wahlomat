/**
 * API-Client für Railway PostgreSQL (via Express-Backend)
 * Verwendet relative URLs – funktioniert wenn Frontend und API gleicher Origin
 */
const API_BASE = "/api";

export async function saveResult(data) {
  const res = await fetch(`${API_BASE}/results`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function fetchResults() {
  const res = await fetch(`${API_BASE}/results`, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/**
 * Prüft ob die API (und damit die DB) verfügbar ist.
 * Bei Railway: DATABASE_URL wird vom PostgreSQL-Service bereitgestellt.
 */
export function isApiConfigured() {
  return true;
}
