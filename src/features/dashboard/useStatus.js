import { useQuery } from "../../shared/hooks/useQuery.js";
import { fetchStatus } from "./dashboard.api.js";

export function useStatus() {
  return useQuery(fetchStatus, []);
}
