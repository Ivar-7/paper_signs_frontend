import { useState, useEffect } from "react";
import { X, CheckCircle, XCircle, AlertTriangle, ShieldCheck, Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Badge } from "../../shared/ui/Badge.jsx";
import { ProbabilityMeter } from "../../shared/ui/ProbabilityMeter.jsx";
import { Spinner } from "../../shared/ui/Spinner.jsx";
import { getSymbolAnalysis } from "./dashboard.api.js";

/**
 * @param {{
 *   isOpen: boolean,
 *   onClose: () => void,
 *   symbol: string|null,
 *   onOpenTrade: (opp: any) => void
 * }} props
 */
export function AnalysisDrawer({ isOpen, onClose, symbol, onOpenTrade }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    if (symbol && isOpen) {
      setLoading(true);
      setError(null);
      getSymbolAnalysis(symbol)
        .then((res) => {
          if (mounted) setData(res);
        })
        .catch((err) => {
          if (mounted) setError(err?.message || "Failed to load market analysis");
        })
        .finally(() => {
          if (mounted) setLoading(false);
        });
    }
    return () => {
      mounted = false;
    };
  }, [symbol, isOpen]);

  if (!isOpen || !symbol) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Drawer panel */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative w-full max-w-xl h-full bg-[--color-surface-2] border-l border-[--color-border] shadow-2xl flex flex-col z-10 overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[--color-border]/60 sticky top-0 bg-[--color-surface-2]/90 backdrop-blur-md z-10">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-black tracking-tight text-[--color-text]">{symbol}</h2>
                {data && (
                  <Badge
                    variant={
                      data.recommendation === "STRONG BUY" ? "strong-buy" :
                      data.recommendation === "BUY" ? "buy" :
                      data.recommendation === "WATCHLIST" ? "watchlist" :
                      data.recommendation === "EXIT" ? "exit" : "neutral"
                    }
                  >
                    {data.recommendation}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-[--color-muted] mt-1">Donchian 100/50 Strategy Intelligence</p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-[--color-muted] hover:text-[--color-text] hover:bg-[--color-surface-3] transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <Spinner />
              <span className="text-xs text-[--color-muted]">Analyzing strategy data...</span>
            </div>
          )}

          {error && (
            <div className="p-6">
              <div className="rounded-xl bg-rose-500/15 border border-rose-500/30 p-4 text-xs text-rose-300">
                {error}
              </div>
            </div>
          )}

          {data && !loading && (
            <div className="p-6 flex flex-col gap-6">
              {/* Score card */}
              <div className="rounded-2xl bg-[--color-surface-card] p-5 border border-[--color-border]/80 shadow-inner flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-mono text-[--color-muted-dim] uppercase tracking-wider">Strategy Success Probability</span>
                    <p className="text-3xl font-black font-mono text-[--color-text] mt-0.5">
                      {data.probability_score}%
                    </p>
                  </div>
                  <div className="w-36">
                    <ProbabilityMeter score={data.probability_score} size="lg" showLabel={false} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-[--color-border]/40 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-[--color-muted-dim] block">Last Price</span>
                    <span className="font-bold text-[--color-text]">${data.close?.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[--color-muted-dim] block">100d High</span>
                    <span className="font-bold text-cyan-400">${data.entry_high?.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[--color-muted-dim] block">SMA200</span>
                    <span className="font-bold text-indigo-300">${data.sma200?.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* 4-Point Strategy Rules Checklist */}
              <div className="flex flex-col gap-3">
                <h3 className="text-xs uppercase font-mono font-semibold tracking-wider text-[--color-muted]">
                  Strategy Criteria Checklist
                </h3>
                <div className="flex flex-col gap-2.5">
                  {/* Rule 1: SMA200 */}
                  <div className={`p-3.5 rounded-xl border flex items-start gap-3 transition-colors ${
                    data.checklist?.trend_above_sma200
                      ? "bg-emerald-500/10 border-emerald-500/30"
                      : "bg-rose-500/10 border-rose-500/30"
                  }`}>
                    {data.checklist?.trend_above_sma200 ? (
                      <CheckCircle className="size-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="size-5 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="text-xs font-bold text-[--color-text]">1. Trend Filter: Price Above 200 SMA</p>
                      <p className="text-[11px] text-[--color-muted] mt-0.5">
                        {data.checklist?.details?.sma200 || `Price must exceed 200-day simple moving average.`}
                      </p>
                    </div>
                  </div>

                  {/* Rule 2: Donchian 100d Breakout */}
                  <div className={`p-3.5 rounded-xl border flex items-start gap-3 transition-colors ${
                    data.checklist?.breakout_donchian_high
                      ? "bg-emerald-500/10 border-emerald-500/30"
                      : "bg-amber-500/10 border-amber-500/30"
                  }`}>
                    {data.checklist?.breakout_donchian_high ? (
                      <CheckCircle className="size-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="size-5 text-amber-400 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="text-xs font-bold text-[--color-text]">2. Breakout: 100-Day Channel High</p>
                      <p className="text-[11px] text-[--color-muted] mt-0.5">
                        {data.checklist?.details?.donchian || `Price breakout above highest high of previous 100 bars.`}
                      </p>
                    </div>
                  </div>

                  {/* Rule 3: Volatility Structure */}
                  <div className={`p-3.5 rounded-xl border flex items-start gap-3 transition-colors ${
                    data.checklist?.volatility_healthy
                      ? "bg-emerald-500/10 border-emerald-500/30"
                      : "bg-slate-800/60 border-[--color-border]"
                  }`}>
                    {data.checklist?.volatility_healthy ? (
                      <CheckCircle className="size-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="size-5 text-amber-400 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="text-xs font-bold text-[--color-text]">3. Volatility: ATR20 Health & Compression</p>
                      <p className="text-[11px] text-[--color-muted] mt-0.5">
                        {data.checklist?.details?.atr || `ATR volatility structure within optimal trend parameters.`}
                      </p>
                    </div>
                  </div>

                  {/* Rule 4: Volume & Risk */}
                  <div className="p-3.5 rounded-xl border bg-[--color-surface-card] border-[--color-border] flex items-start gap-3">
                    <ShieldCheck className="size-5 text-[--color-accent] shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-[--color-text]">4. Risk-Adjusted Sizing</p>
                      <p className="text-[11px] text-[--color-muted] mt-0.5">
                        Suggested: {data.suggested_shares} shares (~${data.suggested_cost?.toLocaleString()}) with 1.0% max risk.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Targets & Exit Levels */}
              <div className="rounded-2xl bg-[--color-surface-3]/60 p-4 border border-[--color-border] flex flex-col gap-3">
                <h3 className="text-xs uppercase font-mono font-semibold tracking-wider text-[--color-muted]">
                  Execution Blueprint
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-[--color-surface-2] border border-[--color-border]/60">
                    <span className="text-[10px] text-rose-300 uppercase block font-semibold">Stop Loss Level (SL)</span>
                    <p className="text-base font-bold text-rose-400 mt-1">${data.stop_loss?.toFixed(2)}</p>
                    <span className="text-[10px] text-[--color-muted-dim]">{data.stop_loss_pct?.toFixed(1)}% from close</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[--color-surface-2] border border-[--color-border]/60">
                    <span className="text-[10px] text-emerald-300 uppercase block font-semibold">Take Profit (2.5R Target)</span>
                    <p className="text-base font-bold text-emerald-400 mt-1">${data.take_profit_2?.toFixed(2)}</p>
                    <span className="text-[10px] text-[--color-muted-dim]">Risk:Reward {data.risk_reward_ratio}:1</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[--color-surface-2] border border-[--color-border]/60">
                    <span className="text-[10px] text-cyan-300 uppercase block font-semibold">50-Day Exit Low</span>
                    <p className="text-base font-bold text-cyan-400 mt-1">${data.exit_low?.toFixed(2)}</p>
                    <span className="text-[10px] text-[--color-muted-dim]">Trailing trend exit</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[--color-surface-2] border border-[--color-border]/60">
                    <span className="text-[10px] text-indigo-300 uppercase block font-semibold">Runner Target (4.0R)</span>
                    <p className="text-base font-bold text-indigo-300 mt-1">${data.take_profit_3?.toFixed(2)}</p>
                    <span className="text-[10px] text-[--color-muted-dim]">Trend expansion target</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenTrade(data);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-950/40"
                >
                  <Zap className="size-4" />
                  <span>Execute Paper Trade ({data.symbol})</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
