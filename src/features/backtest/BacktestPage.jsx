import { useBacktestResults, useRunBacktest } from "./useBacktest.js";
import { PageHeader } from "../../shared/ui/PageHeader.jsx";
import { Card } from "../../shared/ui/Card.jsx";
import { Badge } from "../../shared/ui/Badge.jsx";
import { ErrorMessage } from "../../shared/ui/ErrorMessage.jsx";
import { EmptyState } from "../../shared/ui/EmptyState.jsx";
import { Spinner } from "../../shared/ui/Spinner.jsx";
import { motion } from "motion/react";
import { Play } from "lucide-react";

const pct = (n) => (typeof n === "number" ? `${(n * 100).toFixed(2)}%` : "�");
const num = (n, dp = 2) => (typeof n === "number" ? n.toFixed(dp) : "�");

const PERIOD_LABELS = { dev: "Development", validation: "Validation", oos: "Out-of-Sample" };

export default function BacktestPage() {
  const results = useBacktestResults();
  const runner  = useRunBacktest();

  const handleRun = async (period) => {
    await runner.run(period);
    results.refetch();
  };

  return (
    <div className="flex flex-col gap-0">
      <PageHeader
        title="Backtest"
        description="Historical strategy performance"
        action={
          <button
            onClick={() => handleRun("all")}
            disabled={runner.running}
            id="run-backtest-btn"
            className="flex items-center gap-1.5 rounded-lg bg-[--color-accent] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {runner.running
              ? <Spinner className="border-white border-t-white/30 size-3.5" />
              : <Play className="size-3.5" aria-hidden="true" />
            }
            {runner.running ? "Running�" : "Run All"}
          </button>
        }
      />

      <div className="p-6 flex flex-col gap-6">
        {runner.error && <ErrorMessage message={runner.error} />}

        {runner.result && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-[--color-success]/30 bg-[--color-success]/5 p-4 text-sm text-[--color-success]"
          >
            Backtest complete � {runner.result.results?.length ?? 0} period(s) run.
          </motion.div>
        )}

        {results.loading && <div className="flex justify-center py-10"><Spinner /></div>}
        {results.error   && <ErrorMessage message={results.error} onRetry={results.refetch} />}

        {!results.loading && !results.error && !results.data?.length && (
          <EmptyState message="No backtest results. Run one first." />
        )}

        {results.data?.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid gap-4 sm:grid-cols-3"
          >
            {results.data.map((r) => (
              <Card key={r.id} className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-widest text-[--color-muted]">
                    {PERIOD_LABELS[r.period_name] ?? r.period_name}
                  </span>
                  <Badge variant={r.cagr > 0 ? "success" : "danger"}>
                    {pct(r.cagr)} CAGR
                  </Badge>
                </div>
                <div className="text-xs text-[--color-muted]">
                  {r.start_date} ? {r.end_date}
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  {[
                    ["Max Drawdown", pct(r.max_drawdown)],
                    ["Sharpe",       num(r.sharpe)],
                    ["Sortino",      num(r.sortino)],
                    ["Profit Factor",num(r.profit_factor)],
                    ["Win Rate",     pct(r.win_rate)],
                    ["Total Trades", r.total_trades ?? "�"],
                    ["Avg Win",      pct(r.avg_win)],
                    ["Avg Loss",     pct(r.avg_loss)],
                    ["Avg Hold",     r.avg_holding_days != null ? `${num(r.avg_holding_days, 0)}d` : "�"],
                    ["Final Equity", r.final_equity != null ? r.final_equity.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) : "�"],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <p className="text-[10px] text-[--color-muted] uppercase tracking-widest">{label}</p>
                      <p className="font-medium">{val}</p>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
