import { useStatus } from "./useStatus.js";
import { PageHeader } from "../../shared/ui/PageHeader.jsx";
import { StatCard } from "../../shared/ui/StatCard.jsx";
import { Card } from "../../shared/ui/Card.jsx";
import { ErrorMessage } from "../../shared/ui/ErrorMessage.jsx";
import { Spinner } from "../../shared/ui/Spinner.jsx";
import { Badge } from "../../shared/ui/Badge.jsx";
import { motion } from "motion/react";

/**
 * @param {string|null} val - ISO datetime string from the API.
 * @returns {string}
 */
function formatNextRun(val) {
  if (!val) return "—";
  try {
    return new Date(val).toLocaleString();
  } catch {
    return val;
  }
}

export default function DashboardPage() {
  const { data, loading, error, refetch } = useStatus();

  return (
    <div className="flex flex-col gap-0">
      <PageHeader title="Dashboard" description="Live system status and overview" />

      <div className="p-6 flex flex-col gap-6">
        {loading && (
          <div className="flex justify-center py-16" role="status" aria-label="Loading">
            <Spinner />
          </div>
        )}

        {error && <ErrorMessage message={error} onRetry={refetch} />}

        {!loading && !error && !data && (
          <p className="text-center text-sm text-[--color-muted] py-16">No data available.</p>
        )}

        {data && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-6"
          >
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatCard
                label="System"
                value={data.status === "running" ? "Online" : "Offline"}
                sub={data.status === "running" ? "All systems go" : "Check logs"}
                trend={data.status === "running" ? "up" : "down"}
              />
              <StatCard
                label="Broker"
                value={data.broker?.toUpperCase() ?? "—"}
                sub="Mode"
              />
              <StatCard
                label="Symbols"
                value={data.symbols?.length ?? "—"}
                sub="Instruments tracked"
              />
              <StatCard
                label="Next Run"
                value={data.next_run ? new Date(data.next_run).toLocaleTimeString() : "—"}
                sub={formatNextRun(data.next_run)}
              />
            </div>

            <Card>
              <p className="text-xs text-[--color-muted] uppercase tracking-widest font-medium mb-3">
                Tracked Symbols
              </p>
              <div className="flex flex-wrap gap-2">
                {data.symbols?.map((s) => (
                  <Badge key={s} variant="accent">{s}</Badge>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}