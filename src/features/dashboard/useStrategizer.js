import { useState, useEffect, useCallback } from "react";
import { getStrategizerScan, addTrackedSymbol, removeTrackedSymbol } from "./dashboard.api.js";

export function useStrategizer() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchScan = useCallback(async (force = false) => {
    if (force) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    try {
      const res = await getStrategizerScan(force);
      setData(res);
    } catch (err) {
      setError(err?.message || "Failed to scan markets");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchScan(false);
  }, [fetchScan]);

  const addSymbol = async (symbol) => {
    await addTrackedSymbol(symbol);
    await fetchScan(true);
  };

  const removeSymbol = async (symbol) => {
    await removeTrackedSymbol(symbol);
    await fetchScan(true);
  };

  return {
    data,
    loading,
    refreshing,
    error,
    refetch: () => fetchScan(true),
    addSymbol,
    removeSymbol,
  };
}
