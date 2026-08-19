import { useState, useEffect, useRef } from "react";
import { toUserMessage } from "../errors/errors.js";

/**
 * Minimal data-fetching hook. Remote data is kept separate from interaction state.
 * @template T
 * @param {() => Promise<T>} fetcher - Async function that returns the data.
 * @param {unknown[]} deps - Dependency array — re-fetches when any dep changes.
 * @returns {{ data: T|null, loading: boolean, error: string|null, refetch: () => void }}
 */
export function useQuery(fetcher, deps) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [tick, setTick]       = useState(0);

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetcherRef.current()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) setError(toUserMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  // deps array drives re-fetch; tick drives manual refetch
  }, [...(deps ?? []), tick]);

  const refetch = () => setTick((t) => t + 1);

  return { data, loading, error, refetch };
}