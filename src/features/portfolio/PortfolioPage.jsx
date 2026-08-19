import { usePortfolio, useEquityHistory } from "./usePortfolio.js";
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
    ? n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
    : "-";

const pct = (n) =>
  typeof n === "number" ? `${n >= 0 ? "+" : ""}${n.toFixed(2)}%` : "-";

export default function PortfolioPage() {
  const portfolio  = usePortfolio();
  const history    = useEquityHistory(90);

  if (portfolio.loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (portfolio.error) {
    return (
      <div className="flex flex-col gap-0">
        <PageHeader title="Portfolio" description="Live account state" />
        <div className="p-6">
          <ErrorMessage message={portfolio.error} onRetry={portfolio.refetch} />
        </div>
      </div>
    );
  }

  const { data } = portfolio;
  const invested = data?.positions?.reduce((s, p) => s + (p.market_value ?? 0), 0) ?? 0;
  const unrealized = data?.positions?.reduce((s, p) => s + (p.unrealized_pnl ?? 0), 0) ?? 0;

  return (
    <div className="flex flex-col gap-0">
      <PageHeader title="Portfolio" description="Live account state" />

      <div className="p-6 flex flex-col gap-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-2 gap-4 sm:grid-cols-4"
        >
          <StatCard label="Equity"      value={fmt(data?.equity)}      />
          <StatCard label="Cash"        value={fmt(data?.cash)}        />
          <StatCard label="Invested"    value={fmt(invested)}          />
          <StatCard
            label="Unrealized P&L"
            value={fmt(unrealized)}
            sub={unrealized !== 0 ? (unrealized >= 0 ? "Profit" : "Loss") : undefined}
            trend={unrealized > 0 ? "up" : unrealized < 0 ? "down" : null}
          />
        </motion.div>

        <Card>
          <p className="text-xs text-[--color-muted] uppercase tracking-widest font-medium mb-4">
            Open Positions
          </p>
          {!data?.positions?.length ? (
            <EmptyState message="No open positions." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" aria-label="Open positions">
                <thead>
                  <tr className="border-b border-[--color-border] text-[--color-muted] text-xs">
                    <th className="pb-2 text-left font-medium">Symbol</th>
                    <th className="pb-2 text-right font-medium">Shares</th>
                    <th className="pb-2 text-right font-medium">Avg Entry</th>
                    <th className="pb-2 text-right font-medium">Current</th>
                    <th className="pb-2 text-right font-medium">Mkt Value</th>
                    <th className="pb-2 text-right font-medium">Unrealized</th>
                  </tr>
                </thead>
                <tbody>
                  {data.positions.map((p) => (
                    <tr key={p.symbol} className="border-b border-[--color-border]/50 hover:bg-[--color-surface-3]/50 transition-colors">
                      <td className="py-2.5 font-semibold text-[--color-accent]">{p.symbol}</td>
                      <td className="py-2.5 text-right">{p.shares}</td>
                      <td className="py-2.5 text-right">{fmt(p.avg_entry_price)}</td>
                      <td className="py-2.5 text-right">{p.current_price != null ? fmt(p.current_price) : "-"}</td>
                      <td className="py-2.5 text-right">{fmt(p.market_value)}</td>
                      <td className="py-2.5 text-right">
                        <Badge variant={(p.unrealized_pnl ?? 0) >= 0 ? "success" : "danger"}>
                          {fmt(p.unrealized_pnl)}
                        </Badge>
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
