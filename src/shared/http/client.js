/** @type {string} */
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

/**
 * Thin fetch wrapper � adds base URL, throws normalised errors.
 * @param {string} path
 * @param {RequestInit} [init]
 * @returns {Promise<unknown>}
 */
export async function apiFetch(path, init) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    const err = new Error(text || res.statusText);
    err.status = res.status;
    throw err;
  }

  const ct = res.headers.get("content-type") ?? "";
  return ct.includes("application/json") ? res.json() : res.text();
}
