import { useQuery } from "../../shared/hooks/useQuery.js";
import { fetchPortfolio, fetchEquityHistory } from "./portfolio.api.js";

export function usePortfolio() {
  return useQuery(fetchPortfolio, []);
}

export function useEquityHistory(limit = 365) {
  return useQuery(() => fetchEquityHistory(limit), [limit]);
}
