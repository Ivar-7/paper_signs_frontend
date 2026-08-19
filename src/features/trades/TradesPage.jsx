import { useTrades, useTradeSummary } from "./useTrades.js";
import { PageHeader } from "../../shared/ui/PageHeader.jsx";
import { StatCard } from "../../shared/ui/StatCard.jsx";
import { Card } from "../../shared/ui/Card.jsx";
import { Badge } from "../../shared/ui/Badge.jsx";
import { ErrorMessage } from "../../shared/ui/ErrorMessage.jsx";
import { EmptyState } from "../../shared/ui/EmptyState.jsx";
import { Spinner } from "../../shared/ui/Spinner.jsx";
import { motion } from "motion/react";

const fmt = (n) =>
  typeof n === "number"
    ? n.toLocaleString("en-US", { style: "currency", currency: "USD" })
    : "-";

export default function TradesPage() {
  const summary = useTradeSummary();
  const { data, loading, error, refetch, filters, setFilters } = useTrades();

  return (
    <div className="flex flex-col gap-0">
      <PageHeader title="Trades" description="Full execution history" />

      <div className="p-6 flex flex-col gap-6">
        {summary.data && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 gap-4 sm:grid-cols-4"
          >
            <StatCard label="Total Trades" value={summary.data.total_trades} />
            <StatCard
              label="Total P&L"
              value={fmt(summary.data.total_pnl)}
              trend={summary.data.total_pnl >= 0 ? "up" : "down"}
            />
            <StatCard label="Win Rate" value={`${summary.data.win_rate}%`} />
            <StatCard label="W / L" value={`${summary.data.wins} / ${summary.data.losses}`} />
          </motion.div>
        )}

        <Card>
          <div className="mb-4 flex gap-2">
            <input
              id="trades-symbol-filter"
              type="text"
              placeholder="Symbol-"
              value={filters.symbol}
              onChange={(e) => setFilters((f) => ({ ...f, symbol: e.target.value.toUpperCase() }))}
              className="w-32 rounded-lg border border-[--color-border] bg-[--color-surface-3] px-3 py-1.5 text-sm focus:border-[--color-accent] outline-none transition-colors"
              aria-label="Filter by symbol"
            />
            <select
              id="trades-action-filter"
              value={filters.action}
              onChange={(e) => setFilters((f) => ({ ...f, action: e.target.value }))}
              className="rounded-lg border border-[--color-border] bg-[--color-surface-3] px-3 py-1.5 text-sm focus:border-[--color-accent] outline-none transition-colors"
              aria-label="Filter by action"
            >
              <option value="">All</option>
              <option value="BUY">BUY</option>
              <option value="SELL">SELL</option>
            </select>
          </div>

          {loading && <div className="flex justify-center py-10"><Spinner /></div>}
          {error   && <ErrorMessage message={error} onRetry={refetch} />}
          {!loading && !error && !data?.length && <EmptyState message="No trades found." />}

          {!loading && !error && data?.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" aria-label="Trade history">
                <thead>
                  <tr className="border-b border-[--color-border] text-[--color-muted] text-xs">
                    {["Date","Symbol","Action","Shares","Price","Cost","P&L"].map((h) => (
                      <th key={h} className={`pb-2 font-medium ${h === "Date" || h === "Symbol" || h === "Action" ? "text-left" : "text-right"}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((t) => (
                    <tr key={t.id} className="border-b border-[--color-border]/50 hover:bg-[--color-surface-3]/50 transition-colors">
                      <td className="py-2.5 text-[--color-muted] text-xs">{t.trade_date}</td>
                      <td className="py-2.5 font-semibold text-[--color-accent]">{t.symbol}</td>
                      <td className="py-2.5">
                        <Badge variant={t.action === "BUY" ? "success" : "danger"}>{t.action}</Badge>
                      </td>
                      <td className="py-2.5 text-right">{t.shares}</td>
                      <td className="py-2.5 text-right">{fmt(t.price)}</td>
                      <td className="py-2.5 text-right">{fmt(t.cost)}</td>
                      <td className="py-2.5 text-right">
                        {t.pnl != null
                          ? <Badge variant={t.pnl >= 0 ? "success" : "danger"}>{fmt(t.pnl)}</Badge>
                          : <span className="text-[--color-muted]">-</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
