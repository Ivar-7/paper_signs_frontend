/** @type {string} */
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

/**
 * Thin fetch wrapper - adds base URL, throws normalised errors.
 * @param {string} path
 * @param {RequestInit} [init]
 * @returns {Promise<any>}
 */
export async function apiFetch(path, init) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });

  if (!res.ok) {
    let errorMsg = res.statusText || "Request failed";
    try {
      const errorJson = await res.json();
      if (errorJson && errorJson.detail) {
        errorMsg = typeof errorJson.detail === "string" ? errorJson.detail : JSON.stringify(errorJson.detail);
      }
    } catch {
      const text = await res.text().catch(() => "");
      if (text) errorMsg = text;
    }
    const err = new Error(errorMsg);
    err.status = res.status;
    throw err;
  }

  const ct = res.headers.get("content-type") ?? "";
  return ct.includes("application/json") ? res.json() : res.text();
}
