import { useState } from "react";
import { useQuery } from "../../shared/hooks/useQuery.js";
import { fetchBacktestResults, runBacktest } from "./backtest.api.js";

export function useBacktestResults() {
  return useQuery(fetchBacktestResults, []);
}

export function useRunBacktest() {
  const [running, setRunning] = useState(false);
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState(null);

  const run = async (period = "all") => {
    setRunning(true);
    setError(null);
    setResult(null);
    try {
      const res = await runBacktest(period);
      setResult(res);
    } catch (err) {
      setError(err?.message ?? "Backtest failed");
    } finally {
      setRunning(false);
    }
  };

  return { run, running, result, error };
}
