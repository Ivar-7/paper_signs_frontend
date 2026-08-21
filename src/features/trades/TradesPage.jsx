import { useTrades, useTradeSummary } from "./useTrades.js";
import { PageHeader } from "../../shared/ui/PageHeader.jsx";
import { StatCard } from "../../shared/ui/StatCard.jsx";
import { Badge } from "../../shared/ui/Badge.jsx";
import { ErrorMessage } from "../../shared/ui/ErrorMessage.jsx";
import { Spinner } from "../../shared/ui/Spinner.jsx";
import { motion } from "motion/react";
import { RefreshCw, ArrowLeftRight } from "lucide-react";

const fmt = (n) =>
  typeof n === "number"
    ? n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 })
    : "-";

const fmtDateTime = (val) => {
  if (!val) return "—";
  const normalized = typeof val === "string" && (val.includes("T") || val.includes(" ")) ? val : `${val}T00:00:00`;
  const d = new Date(normalized);
  if (isNaN(d.getTime())) return String(val);
  if (typeof val === "string" && (val.includes(":") || val.includes("T"))) {
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  }
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function TradesPage() {
  const summary = useTradeSummary();
  const { data, loading, error, refetch, filters, setFilters } = useTrades();

  return (
    <div className="flex flex-col gap-0 min-h-full pb-12">
      <PageHeader
        title="Trade Journal & History"
        description="Comprehensive ledger of all paper executions, realized profit & loss, and strategy performance"
        action={
          <button
            onClick={() => {
              refetch();
              summary.refetch?.();
            }}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-xl border border-[--color-border] bg-[--color-surface-2] px-3.5 py-2 text-xs font-semibold hover:border-[--color-accent] hover:text-[--color-accent] transition-all shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        }
      />

      <div className="px-6 lg:px-8 py-6 flex flex-col gap-6 w-full">
        {/* Performance Statistics Grid */}
        {summary.data && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 gap-4 lg:grid-cols-4"
          >
            <StatCard
              label="Total Realized P&L"
              value={fmt(summary.data.total_pnl)}
              sub={`${summary.data.total_trades} Executions logged`}
              trend={summary.data.total_pnl >= 0 ? "up" : "down"}
            />
            <StatCard
              label="Strategy Win Rate"
              value={`${summary.data.win_rate}%`}
              sub={`${summary.data.wins} Wins / ${summary.data.losses} Losses`}
            />
            <StatCard
              label="Profit Factor"
              value={summary.data.profit_factor ? summary.data.profit_factor.toFixed(2) : "1.00"}
              sub="Gross Profits / Gross Losses"
            />
            <StatCard
              label="Avg Win / Avg Loss"
              value={`${fmt(summary.data.avg_win)}`}
              sub={`Avg Loss: ${fmt(summary.data.avg_loss)}`}
            />
          </motion.div>
        )}

        {/* Filter Toolbar & Table */}
        <div className="rounded-2xl border border-[--color-border] bg-[--color-surface-2] overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[--color-border] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[--color-surface-3]/30">
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="size-4 text-[--color-accent]" />
              <span className="text-xs uppercase font-mono font-bold tracking-wider text-[--color-text]">
                Execution Log
              </span>
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-auto">
              <input
                id="trades-symbol-filter"
                type="text"
                placeholder="Filter Symbol..."
                value={filters.symbol}
                onChange={(e) => setFilters((f) => ({ ...f, symbol: e.target.value.toUpperCase() }))}
                className="w-36 rounded-xl border border-[--color-border] bg-[--color-surface-3] px-3 py-1.5 text-xs font-mono font-bold focus:border-[--color-accent] outline-none transition-colors"
                aria-label="Filter by symbol"
              />
              <select
                id="trades-action-filter"
                value={filters.action}
                onChange={(e) => setFilters((f) => ({ ...f, action: e.target.value }))}
                className="rounded-xl border border-[--color-border] bg-[--color-surface-3] px-3 py-1.5 text-xs font-semibold focus:border-[--color-accent] outline-none transition-colors"
                aria-label="Filter by action"
              >
                <option value="">All Actions</option>
                <option value="BUY">BUY Orders</option>
                <option value="SELL">SELL Orders</option>
              </select>
            </div>
          </div>

          {loading && !data?.length && (
            <div className="flex justify-center py-16">
              <Spinner />
            </div>
          )}

          {error && <ErrorMessage message={error} onRetry={refetch} />}

          {!loading && !error && !data?.length && (
            <div className="p-12 text-center flex flex-col items-center justify-center gap-2">
              <p className="text-sm font-medium text-[--color-muted]">No trades found.</p>
              <p className="text-xs text-[--color-muted-dim]">
                Execute trades via the Strategizer or run the automated scheduler to log activity.
              </p>
            </div>
          )}

          {!loading && !error && data?.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm" aria-label="Trade execution history">
                <thead>
                  <tr className="border-b border-[--color-border] bg-[--color-surface-3]/40 text-[--color-muted] text-[11px] font-mono uppercase tracking-wider">
                    <th className="py-3.5 pl-6 font-semibold">Date / Time</th>
                    <th className="py-3.5 px-3 font-semibold">Instrument</th>
                    <th className="py-3.5 px-3 font-semibold">Action</th>
                    <th className="py-3.5 px-3 font-semibold text-right">Shares</th>
                    <th className="py-3.5 px-3 font-semibold text-right">Fill Price</th>
                    <th className="py-3.5 px-3 font-semibold text-right">Total Cost</th>
                    <th className="py-3.5 pr-6 font-semibold text-right">Realized P&L</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[--color-border]/40">
                  {data.map((t) => (
                    <tr key={t.id} className="hover:bg-[--color-surface-3]/60 transition-colors">
                      <td className="py-4 pl-6 text-[--color-muted] font-mono text-xs whitespace-nowrap">
                        {fmtDateTime(t.created_at || t.trade_date)}
                      </td>
                      <td className="py-4 px-3 font-bold font-mono text-base text-[--color-text]">
                        {t.symbol}
                      </td>
                      <td className="py-4 px-3">
                        <Badge variant={t.action === "BUY" ? "buy" : "exit"} size="sm">
                          {t.action}
                        </Badge>
                      </td>
                      <td className="py-4 px-3 text-right font-mono font-semibold text-[--color-text]">
                        {t.shares}
                      </td>
                      <td className="py-4 px-3 text-right font-mono text-[--color-muted]">
                        {fmt(t.price)}
                      </td>
                      <td className="py-4 px-3 text-right font-mono font-semibold text-[--color-text]">
                        {fmt(t.cost)}
                      </td>
                      <td className="py-4 pr-6 text-right font-mono">
                        {t.pnl != null && t.action === "SELL" ? (
                          <span
                            className={`font-bold ${
                              t.pnl >= 0 ? "text-emerald-400" : "text-rose-400"
                            }`}
                          >
                            {t.pnl >= 0 ? "+" : ""}
                            {fmt(t.pnl)}
                          </span>
                        ) : (
                          <span className="text-[--color-muted-dim] text-xs">— (Open)</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
