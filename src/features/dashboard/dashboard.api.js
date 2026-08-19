import { apiFetch } from "../../shared/http/client.js";

/** @returns {Promise<{ status: string, broker: string, symbols: string[], next_run: string|null }>} */
export const fetchStatus = () => apiFetch("/api/status");
