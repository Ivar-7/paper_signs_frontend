import { apiFetch } from "../../shared/http/client.js";

/**
 * Scan all tracked markets for strategy opportunities.
 * @param {boolean} [forceRefresh=false]
 */
export async function getStrategizerScan(forceRefresh = false) {
  return apiFetch(`/api/strategizer/scan?force_refresh=${forceRefresh}`);
}

/**
 * Get deep-dive strategy analysis for a symbol.
 * @param {string} symbol
 */
export async function getSymbolAnalysis(symbol) {
  return apiFetch(`/api/strategizer/analysis/${encodeURIComponent(symbol)}`);
}

/**
 * Get tracked symbols list.
 */
export async function getTrackedSymbols() {
  return apiFetch("/api/strategizer/symbols");
}

/**
 * Add a new symbol to the tracked list.
 * @param {string} symbol
 */
export async function addTrackedSymbol(symbol) {
  return apiFetch("/api/strategizer/symbols", {
    method: "POST",
    body: JSON.stringify({ symbol }),
  });
}

/**
 * Remove a symbol from the tracked list.
 * @param {string} symbol
 */
export async function removeTrackedSymbol(symbol) {
  return apiFetch(`/api/strategizer/symbols/${encodeURIComponent(symbol)}`, {
    method: "DELETE",
  });
}
