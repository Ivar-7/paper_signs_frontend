import { apiFetch } from "../../shared/http/client.js";

/**
 * @param {{ symbol?: string, action?: string, limit?: number, offset?: number }} [params]
 * @returns {Promise<any[]>}
 */
export const fetchTrades = ({ symbol, action, limit = 100, offset = 0 } = {}) => {
  const p = new URLSearchParams({ limit: String(limit), offset: String(offset) });
  if (symbol) p.set("symbol", symbol);
  if (action) p.set("action", action);
  return apiFetch(`/api/trades/?${p.toString()}`);
};

/**
 * @returns {Promise<{
 *   total_trades: number,
 *   total_pnl: number,
 *   wins: number,
 *   losses: number,
 *   win_rate: number,
 *   profit_factor?: number,
 *   avg_win?: number,
 *   avg_loss?: number
 * }>}
 */
export const fetchTradeSummary = () => apiFetch("/api/trades/summary");

/**
 * Execute a new paper trade.
 * @param {{ symbol: string, action: string, shares?: number, price?: number, notes?: string }} payload
 */
export const executeTrade = (payload) =>
  apiFetch("/api/trades/execute", {
    method: "POST",
    body: JSON.stringify(payload),
  });
