import { apiFetch } from "../../shared/http/client.js";

/** @returns {Promise<{ equity: number, cash: number, positions: object[], snapshot_date: string }>} */
export const fetchPortfolio = () => apiFetch("/api/portfolio/");

/** @param {number} [limit]
 *  @returns {Promise<{ date: string, equity: number }[]>} */
export const fetchEquityHistory = (limit = 365) =>
  apiFetch(`/api/portfolio/history?limit=${limit}`);
