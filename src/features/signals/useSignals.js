import { useQuery } from "../../shared/hooks/useQuery.js";
import { fetchLatestSignals } from "./signals.api.js";

export function useSignals() {
  return useQuery(fetchLatestSignals, []);
}
