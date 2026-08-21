import { useState } from "react";
import { usePortfolio } from "./usePortfolio.js";
import { closePosition } from "./portfolio.api.js";
import { PageHeader } from "../../shared/ui/PageHeader.jsx";
import { StatCard } from "../../shared/ui/StatCard.jsx";
import { ErrorMessage } from "../../shared/ui/ErrorMessage.jsx";
import { Spinner } from "../../shared/ui/Spinner.jsx";
import { motion } from "motion/react";
import { RefreshCw, Briefcase } from "lucide-react";

const fmt = (n) =>
  typeof n === "number"
    ? n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 })
    : "-";

const pct = (n) =>
  typeof n === "number" ? `${n >= 0 ? "+" : ""}${n.toFixed(2)}%` : "-";

export default function PortfolioPage() {
  const { data, loading, error, refetch } = usePortfolio();
  const [closingSymbol, setClosingSymbol] = useState(null);
  const [closeSuccess, setCloseSuccess] = useState(null);
  const [closeError, setCloseError] = useState(null);

  const handleClose = async (symbol) => {
    if (!window.confirm(`Are you sure you want to close your position in ${symbol} at current market price?`)) {
      return;
    }
    setClosingSymbol(symbol);
    setCloseSuccess(null);
    setCloseError(null);
    try {
      const res = await closePosition(symbol);
      if (res.success) {
        setCloseSuccess(res.message);
        await refetch();
      } else {
        setCloseError(res.message);
      }
    } catch (err) {
      setCloseError(err?.message || `Failed to close ${symbol}`);
    } finally {
      setClosingSymbol(null);
    }
  };

  const invested = data?.positions?.reduce((s, p) => s + (p.market_value ?? 0), 0) ?? 0;
  const unrealized = data?.positions?.reduce((s, p) => s + (p.unrealized_pnl ?? 0), 0) ?? 0;
  const unrealizedPct = invested > 0 ? (unrealized / invested) * 100 : 0;

  return (
    <div className="flex flex-col gap-0 min-h-full pb-12">
      <PageHeader
        title="Open Positions"
        description="Real-time paper trading positions, live unrealized P&L, and position manager"
        action={
          <button
            onClick={() => refetch()}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-xl border border-[--color-border] bg-[--color-surface-2] px-3.5 py-2 text-xs font-semibold hover:border-[--color-accent] hover:text-[--color-accent] transition-all shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        }
      />

      <div className="px-6 lg:px-8 py-6 flex flex-col gap-6 w-full">
        {/* Success Banner */}
        {closeSuccess && (
          <div className="rounded-xl bg-emerald-500/15 border border-emerald-500/30 p-4 text-xs font-medium text-emerald-300 flex items-center justify-between">
            <span>{closeSuccess}</span>
            <button onClick={() => setCloseSuccess(null)} className="text-emerald-400 font-bold hover:underline">
              Dismiss
            </button>
          </div>
        )}

        {/* Error Banner */}
        {closeError && (
          <div className="rounded-xl bg-rose-500/15 border border-rose-500/30 p-4 text-xs font-medium text-rose-300 flex items-center justify-between">
            <span>{closeError}</span>
            <button onClick={() => setCloseError(null)} className="text-rose-400 font-bold hover:underline">
              Dismiss
            </button>
          </div>
        )}

        {/* Portfolio Summary Stats */}
        {data && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 gap-4 lg:grid-cols-4"
          >
            <StatCard label="Account Equity" value={fmt(data.equity)} />
            <StatCard label="Available Cash" value={fmt(data.cash)} />
            <StatCard
              label="Invested Capital"
              value={fmt(invested)}
              sub={`${data.positions.length} / 4 Slots Utilized`}
            />
            <StatCard
              label="Unrealized P&L"
              value={fmt(unrealized)}
              sub={unrealized !== 0 ? `${pct(unrealizedPct)} Return` : undefined}
              trend={unrealized > 0 ? "up" : unrealized < 0 ? "down" : null}
            />
          </motion.div>
        )}

        {/* Loading / Error States */}
        {loading && !data && (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        )}
        {error && <ErrorMessage message={error} onRetry={refetch} />}

        {/* Positions Table */}
        {!loading && !error && (
          <div className="rounded-2xl border border-[--color-border] bg-[--color-surface-2] overflow-hidden shadow-sm">
            <div className="p-4 border-b border-[--color-border] flex items-center justify-between bg-[--color-surface-3]/30">
              <div className="flex items-center gap-2">
                <Briefcase className="size-4 text-[--color-accent]" />
                <span className="text-xs uppercase font-mono font-bold tracking-wider text-[--color-text]">
                  Active Trades ({data?.positions?.length || 0})
                </span>
              </div>
            </div>

            {!data?.positions?.length ? (
              <div className="p-12 text-center flex flex-col items-center justify-center gap-2">
                <p className="text-sm font-medium text-[--color-muted]">No active open positions.</p>
                <p className="text-xs text-[--color-muted-dim]">
                  Head over to the Strategizer to scan markets and execute your first paper trade.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm" aria-label="Active open positions">
                  <thead>
                    <tr className="border-b border-[--color-border] bg-[--color-surface-3]/40 text-[--color-muted] text-[11px] font-mono uppercase tracking-wider">
                      <th className="py-3.5 pl-6 font-semibold">Instrument</th>
                      <th className="py-3.5 px-3 font-semibold text-right">Shares</th>
                      <th className="py-3.5 px-3 font-semibold text-right">Avg Entry</th>
                      <th className="py-3.5 px-3 font-semibold text-right">Current Price</th>
                      <th className="py-3.5 px-3 font-semibold text-right">Market Value</th>
                      <th className="py-3.5 px-3 font-semibold text-right">Unrealized P&L</th>
                      <th className="py-3.5 pr-6 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[--color-border]/40">
                    {data.positions.map((p) => {
                      const returnPct = p.avg_entry_price > 0 && p.current_price
                        ? ((p.current_price - p.avg_entry_price) / p.avg_entry_price) * 100
                        : 0;
                      const isProfit = (p.unrealized_pnl ?? 0) >= 0;

                      return (
                        <tr key={p.symbol} className="hover:bg-[--color-surface-3]/60 transition-colors">
                          <td className="py-4 pl-6">
                            <span className="font-bold font-mono text-base text-[--color-text] block">
                              {p.symbol}
                            </span>
                            <span className="text-[11px] text-[--color-muted-dim] font-mono">
                              Entry: {p.entry_date || "Live"}
                            </span>
                          </td>
                          <td className="py-4 px-3 text-right font-mono font-semibold text-[--color-text]">
                            {p.shares}
                          </td>
                          <td className="py-4 px-3 text-right font-mono text-[--color-muted]">
                            {fmt(p.avg_entry_price)}
                          </td>
                          <td className="py-4 px-3 text-right font-mono font-bold text-[--color-text]">
                            {p.current_price != null ? fmt(p.current_price) : "—"}
                          </td>
                          <td className="py-4 px-3 text-right font-mono font-semibold text-[--color-text]">
                            {fmt(p.market_value)}
                          </td>
                          <td className="py-4 px-3 text-right font-mono">
                            <div className="flex flex-col items-end">
                              <span className={`font-bold ${isProfit ? "text-emerald-400" : "text-rose-400"}`}>
                                {isProfit ? "+" : ""}{fmt(p.unrealized_pnl)}
                              </span>
                              <span className={`text-[11px] ${isProfit ? "text-emerald-400/80" : "text-rose-400/80"}`}>
                                {pct(returnPct)}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 pr-6 text-right">
                            <button
                              onClick={() => handleClose(p.symbol)}
                              disabled={closingSymbol === p.symbol}
                              className="px-3 py-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 text-xs font-bold transition-all disabled:opacity-50"
                            >
                              {closingSymbol === p.symbol ? "Closing..." : "Close Position"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
