import { useState, useEffect } from "react";
import { Modal } from "../../shared/ui/Modal.jsx";
import { Badge } from "../../shared/ui/Badge.jsx";
import { Spinner } from "../../shared/ui/Spinner.jsx";
import { executeTrade } from "./trades.api.js";
import { CheckCircle2, ShieldAlert, Zap } from "lucide-react";

/**
 * @param {{
 *   isOpen: boolean,
 *   onClose: () => void,
 *   opportunity: any,
 *   onSuccess?: () => void
 * }} props
 */
export function TradeModal({ isOpen, onClose, opportunity, onSuccess }) {
  const [action, setAction] = useState("BUY");
  const [shares, setShares] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successResult, setSuccessResult] = useState(null);

  useEffect(() => {
    if (opportunity) {
      setAction(opportunity.recommendation === "EXIT" ? "SELL" : "BUY");
      setShares(opportunity.suggested_shares || 10);
      setError(null);
      setSuccessResult(null);
    }
  }, [opportunity, isOpen]);

  if (!opportunity) return null;

  const price = opportunity.close || 0;
  const totalCost = (shares * price).toFixed(2);
  const stopLoss = opportunity.stop_loss || (price * 0.95);
  const takeProfit = opportunity.take_profit_2 || (price * 1.12);
  const dollarRisk = Math.abs(shares * (price - stopLoss)).toFixed(2);
  const dollarReward = Math.abs(shares * (takeProfit - price)).toFixed(2);

  const handleExecute = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await executeTrade({
        symbol: opportunity.symbol,
        action,
        shares: Number(shares),
        notes: `Executed from Strategizer (${opportunity.recommendation} - ${opportunity.probability_score}%)`,
      });
      setSuccessResult(res);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err?.message || "Execution failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Execute Paper Trade: ${opportunity.symbol}`}
      subtitle={`Donchian 100/50 Strategy - ${opportunity.recommendation} (${opportunity.probability_score}% probability)`}
      maxWidth="max-w-lg"
    >
      {successResult ? (
        <div className="flex flex-col items-center justify-center py-6 text-center gap-4">
          <div className="size-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="size-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[--color-text]">Order Filled Successfully!</h3>
            <p className="text-sm text-[--color-muted] mt-1">{successResult.message}</p>
          </div>
          <button
            onClick={onClose}
            className="mt-2 w-full py-2.5 rounded-lg bg-[--color-accent] text-white font-medium text-sm hover:opacity-90 transition-opacity"
          >
            Done
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {error && (
            <div className="rounded-lg bg-rose-500/15 border border-rose-500/30 p-3 text-xs text-rose-300 flex items-center gap-2">
              <ShieldAlert className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Selector */}
          <div className="grid grid-cols-2 gap-2 bg-[--color-surface-3] p-1 rounded-xl border border-[--color-border]">
            <button
              type="button"
              onClick={() => setAction("BUY")}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                action === "BUY"
                  ? "bg-emerald-500 text-white shadow-md"
                  : "text-[--color-muted] hover:text-[--color-text]"
              }`}
            >
              BUY / LONG
            </button>
            <button
              type="button"
              onClick={() => setAction("SELL")}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                action === "SELL"
                  ? "bg-rose-500 text-white shadow-md"
                  : "text-[--color-muted] hover:text-[--color-text]"
              }`}
            >
              SELL / CLOSE
            </button>
          </div>

          {/* Market Price & Setup Info */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[--color-surface-3]/60 border border-[--color-border]/60">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-[--color-muted-dim]">Market Price</span>
              <p className="text-lg font-bold font-mono text-[--color-text]">${price.toFixed(2)}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-[--color-muted-dim]">Signal Rating</span>
              <div className="mt-0.5">
                <Badge
                  variant={
                    opportunity.recommendation === "STRONG BUY" ? "strong-buy" :
                    opportunity.recommendation === "BUY" ? "buy" :
                    opportunity.recommendation === "WATCHLIST" ? "watchlist" :
                    opportunity.recommendation === "EXIT" ? "exit" : "neutral"
                  }
                  size="sm"
                >
                  {opportunity.recommendation} ({opportunity.probability_score}%)
                </Badge>
              </div>
            </div>
          </div>

          {/* Position Sizing Input */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label htmlFor="shares-input" className="text-xs font-medium text-[--color-muted]">
                Position Size (Shares)
              </label>
              <span className="text-xs font-mono text-[--color-muted-dim]">
                Estimated Cost: <strong className="text-[--color-text]">${Number(totalCost).toLocaleString()}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="shares-input"
                type="number"
                min="1"
                step="1"
                value={shares}
                onChange={(e) => setShares(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full rounded-lg border border-[--color-border] bg-[--color-surface-3] px-3.5 py-2 text-sm font-mono font-bold text-[--color-text] focus:border-[--color-accent] outline-none"
              />
              <button
                type="button"
                onClick={() => setShares(opportunity.suggested_shares || 10)}
                className="px-3 py-2 text-xs font-medium text-[--color-accent] border border-[--color-accent]/30 bg-[--color-accent]/10 rounded-lg hover:bg-[--color-accent]/20 shrink-0"
                title="Reset to ATR risk-adjusted recommended size"
              >
                Auto-Size
              </button>
            </div>
          </div>

          {/* Risk & Target Plan */}
          <div className="flex flex-col gap-2 rounded-xl bg-[--color-surface-card] p-3 border border-[--color-border]/60">
            <span className="text-[11px] font-semibold text-[--color-muted] flex items-center gap-1.5">
              <ShieldAlert className="size-3.5 text-amber-400" />
              Strategy Risk & Target Levels
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs font-mono mt-1">
              <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                <span className="text-[10px] text-rose-300 block">Stop Loss (SL)</span>
                <span className="font-bold text-rose-400">${stopLoss.toFixed(2)}</span>
                <span className="text-[10px] text-[--color-muted-dim] block mt-0.5">-${dollarRisk}</span>
              </div>
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-[10px] text-emerald-300 block">Target 1 (1.5R)</span>
                <span className="font-bold text-emerald-400">${(opportunity.take_profit_1 || (price * 1.075)).toFixed(2)}</span>
              </div>
              <div className="p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30">
                <span className="text-[10px] text-emerald-300 block">Target 2 (2.5R)</span>
                <span className="font-bold text-emerald-300">${takeProfit.toFixed(2)}</span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">+${dollarReward}</span>
              </div>
            </div>
          </div>

          {/* Confirmation Action */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-medium text-[--color-muted] hover:text-[--color-text] hover:bg-[--color-surface-3] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleExecute}
              disabled={loading || shares <= 0}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold text-white transition-all shadow-lg disabled:opacity-50 ${
                action === "BUY"
                  ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/50"
                  : "bg-rose-600 hover:bg-rose-500 shadow-rose-950/50"
              }`}
            >
              {loading ? (
                <>
                  <Spinner />
                  <span>Executing Fill...</span>
                </>
              ) : (
                <>
                  <Zap className="size-4" />
                  <span>Confirm {action} ({shares} Shares)</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
