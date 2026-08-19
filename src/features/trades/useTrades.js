import { useState } from "react";
import { useQuery } from "../../shared/hooks/useQuery.js";
import { fetchTrades, fetchTradeSummary } from "./trades.api.js";

export function useTrades() {
  const [filters, setFilters] = useState({ symbol: "", action: "" });

  const query = useQuery(
    () => fetchTrades({ symbol: filters.symbol || undefined, action: filters.action || undefined }),
    [filters.symbol, filters.action]
  );

  return { ...query, filters, setFilters };
}

export function useTradeSummary() {
  return useQuery(fetchTradeSummary, []);
}
