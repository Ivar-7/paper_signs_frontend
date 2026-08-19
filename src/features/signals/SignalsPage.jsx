import { useSignals } from "./useSignals.js";
import { PageHeader } from "../../shared/ui/PageHeader.jsx";
import { Card } from "../../shared/ui/Card.jsx";
import { Badge } from "../../shared/ui/Badge.jsx";
import { ErrorMessage } from "../../shared/ui/ErrorMessage.jsx";
import { EmptyState } from "../../shared/ui/EmptyState.jsx";
import { Spinner } from "../../shared/ui/Spinner.jsx";
import { motion } from "motion/react";
import { RefreshCw } from "lucide-react";

const fmt2 = (n) => (typeof n === "number" ? n.toFixed(2) : "-");

export default function SignalsPage() {
  const { data, loading, error, refetch } = useSignals();

  return (
    <div className="flex flex-col gap-0">
      <PageHeader
        title="Signals"
        description="Today's entry/exit signals"
        action={
          <button
            onClick={refetch}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg border border-[--color-border] px-3 py-1.5 text-xs font-medium hover:bg-[--color-surface-3] transition-colors disabled:opacity-50"
            aria-label="Refresh signals"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} aria-hidden="true" />
            Refresh
          </button>
        }
      />

      <div className="p-6">
        <Card>
          {loading && <div className="flex justify-center py-10"><Spinner /></div>}
          {error   && <ErrorMessage message={error} onRetry={refetch} />}
          {!loading && !error && !data?.length && <EmptyState message="No signals today." />}

          {!loading && !error && data?.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="overflow-x-auto"
            >
              <table className="w-full text-sm" aria-label="Daily signals">
                <thead>
                  <tr className="border-b border-[--color-border] text-[--color-muted] text-xs">
                    {["Symbol","Date","Close","Entry High","Exit Low","SMA200","ATR20","Entry","Exit","Shares","Cost"].map((h) => (
                      <th key={h} className="pb-2 text-right first:text-left font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((s) => (
                    <tr
                      key={s.id}
                      className={`border-b border-[--color-border]/50 hover:bg-[--color-surface-3]/50 transition-colors ${
                        s.entry_signal ? "bg-[--color-success]/5" : s.exit_signal ? "bg-[--color-danger]/5" : ""
                      }`}
                    >
                      <td className="py-2.5 font-semibold text-[--color-accent]">{s.symbol}</td>
                      <td className="py-2.5 text-right text-[--color-muted] text-xs">{s.signal_date}</td>
                      <td className="py-2.5 text-right">{fmt2(s.close)}</td>
                      <td className="py-2.5 text-right">{fmt2(s.entry_high)}</td>
                      <td className="py-2.5 text-right">{fmt2(s.exit_low)}</td>
                      <td className="py-2.5 text-right">{fmt2(s.sma200)}</td>
                      <td className="py-2.5 text-right">{fmt2(s.atr20)}</td>
                      <td className="py-2.5 text-right">
                        <Badge variant={s.entry_signal ? "success" : "muted"}>
                          {s.entry_signal ? "YES" : "-"}
                        </Badge>
                      </td>
                      <td className="py-2.5 text-right">
                        <Badge variant={s.exit_signal ? "danger" : "muted"}>
                          {s.exit_signal ? "YES" : "-"}
                        </Badge>
                      </td>
                      <td className="py-2.5 text-right">{s.suggested_shares ?? "-"}</td>
                      <td className="py-2.5 text-right">
                        {s.suggested_cost != null
                          ? s.suggested_cost.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </Card>
      </div>
    </div>
  );
}
