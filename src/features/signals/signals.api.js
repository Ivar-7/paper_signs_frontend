import { apiFetch } from "../../shared/http/client.js";

/** @returns {Promise<object[]>} */
export const fetchLatestSignals = () => apiFetch("/api/signals/");

/**
 * @param {{ symbol?: string, limit?: number }} [params]
 * @returns {Promise<object[]>}
 */
export const fetchSignalHistory = ({ symbol, limit = 100 } = {}) => {
  const p = new URLSearchParams({ limit });
  if (symbol) p.set("symbol", symbol);
  return apiFetch(`/api/signals/history?${p}`);
};
