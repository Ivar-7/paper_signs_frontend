import { apiFetch } from "../../shared/http/client.js";

/**
 * @param {{ symbol?: string, action?: string, limit?: number, offset?: number }} [params]
 * @returns {Promise<object[]>}
 */
export const fetchTrades = ({ symbol, action, limit = 100, offset = 0 } = {}) => {
  const p = new URLSearchParams({ limit, offset });
  if (symbol) p.set("symbol", symbol);
  if (action) p.set("action", action);
  return apiFetch(`/api/trades/?${p}`);
};

/** @returns {Promise<{ total_trades: number, total_pnl: number, wins: number, losses: number, win_rate: number }>} */
export const fetchTradeSummary = () => apiFetch("/api/trades/summary");
