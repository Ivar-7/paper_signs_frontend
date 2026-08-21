import { useSignals } from "./useSignals.js";
import { PageHeader } from "../../shared/ui/PageHeader.jsx";
import { Badge } from "../../shared/ui/Badge.jsx";
import { ErrorMessage } from "../../shared/ui/ErrorMessage.jsx";
import { Spinner } from "../../shared/ui/Spinner.jsx";
import { RefreshCw, Radio } from "lucide-react";

const fmt2 = (n) => (typeof n === "number" ? n.toFixed(2) : "-");

export default function SignalsPage() {
  const { data, loading, error, refetch } = useSignals();

  return (
    <div className="flex flex-col gap-0 min-h-full pb-12">
      <PageHeader
        title="Signal Feed"
        description="Historical and live Donchian strategy trigger records"
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
        <div className="rounded-2xl border border-[--color-border] bg-[--color-surface-2] overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[--color-border] flex items-center justify-between bg-[--color-surface-3]/30">
            <div className="flex items-center gap-2">
              <Radio className="size-4 text-[--color-accent]" />
              <span className="text-xs uppercase font-mono font-bold tracking-wider text-[--color-text]">
                Logged Strategy Signals ({data?.length || 0})
              </span>
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
              <p className="text-sm font-medium text-[--color-muted]">No recorded signals yet.</p>
              <p className="text-xs text-[--color-muted-dim]">
                Signals are logged whenever markets are scanned or when the automated runner triggers.
              </p>
            </div>
          )}

          {!loading && !error && data?.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm" aria-label="Daily signals">
                <thead>
                  <tr className="border-b border-[--color-border] bg-[--color-surface-3]/40 text-[--color-muted] text-[11px] font-mono uppercase tracking-wider">
                    <th className="py-3.5 pl-6 font-semibold">Instrument</th>
                    <th className="py-3.5 px-3 font-semibold">Date</th>
                    <th className="py-3.5 px-3 font-semibold text-right">Close</th>
                    <th className="py-3.5 px-3 font-semibold text-right">100d High</th>
                    <th className="py-3.5 px-3 font-semibold text-right">50d Low</th>
                    <th className="py-3.5 px-3 font-semibold text-right">SMA200</th>
                    <th className="py-3.5 px-3 font-semibold text-right">ATR20</th>
                    <th className="py-3.5 px-3 font-semibold text-center">Entry</th>
                    <th className="py-3.5 px-3 font-semibold text-center">Exit</th>
                    <th className="py-3.5 pr-6 font-semibold text-right">Suggested Size</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[--color-border]/40">
                  {data.map((s) => (
                    <tr
                      key={s.id}
                      className={`hover:bg-[--color-surface-3]/60 transition-colors ${
                        s.entry_signal
                          ? "bg-emerald-500/5"
                          : s.exit_signal
                          ? "bg-rose-500/5"
                          : ""
                      }`}
                    >
                      <td className="py-4 pl-6 font-bold font-mono text-base text-[--color-text]">
                        {s.symbol}
                      </td>
                      <td className="py-4 px-3 text-[--color-muted] font-mono text-xs">
                        {s.signal_date}
                      </td>
                      <td className="py-4 px-3 text-right font-mono font-semibold text-[--color-text]">
                        ${fmt2(s.close)}
                      </td>
                      <td className="py-4 px-3 text-right font-mono text-cyan-400">
                        ${fmt2(s.entry_high)}
                      </td>
                      <td className="py-4 px-3 text-right font-mono text-rose-400">
                        ${fmt2(s.exit_low)}
                      </td>
                      <td className="py-4 px-3 text-right font-mono text-indigo-300">
                        ${fmt2(s.sma200)}
                      </td>
                      <td className="py-4 px-3 text-right font-mono text-[--color-muted]">
                        ${fmt2(s.atr20)}
                      </td>
                      <td className="py-4 px-3 text-center">
                        <Badge variant={s.entry_signal ? "strong-buy" : "neutral"} size="sm">
                          {s.entry_signal ? "BUY" : "—"}
                        </Badge>
                      </td>
                      <td className="py-4 px-3 text-center">
                        <Badge variant={s.exit_signal ? "exit" : "neutral"} size="sm">
                          {s.exit_signal ? "EXIT" : "—"}
                        </Badge>
                      </td>
                      <td className="py-4 pr-6 text-right font-mono text-xs">
                        {s.suggested_shares ? (
                          <span className="font-semibold text-[--color-text]">
                            {s.suggested_shares} shs (~${s.suggested_cost?.toLocaleString()})
                          </span>
                        ) : (
                          <span className="text-[--color-muted-dim]">—</span>
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
