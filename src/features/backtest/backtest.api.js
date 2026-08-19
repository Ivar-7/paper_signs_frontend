import { apiFetch } from "../../shared/http/client.js";

/** @returns {Promise<object[]>} */
export const fetchBacktestResults = () => apiFetch("/api/backtest/results");

/**
 * @param {"dev"|"validation"|"oos"|"all"} period
 * @param {number} [commission]
 * @returns {Promise<object>}
 */
export const runBacktest = (period = "all", commission = 0.001) =>
  apiFetch(`/api/backtest/run?period=${period}&commission=${commission}`, { method: "POST" });

/**
 * @param {string} periodName
 * @returns {Promise<{ period_name: string, equity_curve: object[] }>}
 */
export const fetchEquityCurve = (periodName) =>
  apiFetch(`/api/backtest/equity-curve/${periodName}`);
