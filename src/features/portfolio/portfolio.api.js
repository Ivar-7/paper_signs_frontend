import { apiFetch } from "../../shared/http/client.js";

/** @returns {Promise<{ equity: number, cash: number, positions: any[], snapshot_date: string }>} */
export const fetchPortfolio = () => apiFetch("/api/portfolio/");

/**
 * Close an active position for symbol.
 * @param {string} symbol
 */
export const closePosition = (symbol) =>
  apiFetch(`/api/portfolio/close/${encodeURIComponent(symbol)}`, {
    method: "POST",
  });

/**
 * Reset paper portfolio to $100,000.
 */
export const resetPortfolio = () =>
  apiFetch("/api/portfolio/reset", {
    method: "POST",
  });

/**
 * @param {number} [limit]
 * @returns {Promise<{ date: string, equity: number }[]>}
 */
export const fetchEquityHistory = (limit = 365) =>
  apiFetch(`/api/portfolio/history?limit=${limit}`);
