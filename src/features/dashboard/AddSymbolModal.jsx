import { useState } from "react";
import { Modal } from "../../shared/ui/Modal.jsx";
import { Spinner } from "../../shared/ui/Spinner.jsx";
import { PlusCircle, Search, Sparkles } from "lucide-react";

/**
 * @param {{
 *   isOpen: boolean,
 *   onClose: () => void,
 *   onAdd: (symbol: string) => Promise<void>
 * }} props
 */
export function AddSymbolModal({ isOpen, onClose, onAdd }) {
  const [symbol, setSymbol] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const POPULAR_SUGGESTIONS = ["NVDA", "AAPL", "MSFT", "TSLA", "AMZN", "META", "GOOGL", "AMD", "COIN", "BTC-USD"];

  const handleAdd = async (symToAdd) => {
    const target = (symToAdd || symbol).trim().toUpperCase();
    if (!target) return;
    setLoading(true);
    setError(null);
    try {
      await onAdd(target);
      setSymbol("");
      onClose();
    } catch (err) {
      setError(err?.message || `Failed to add symbol ${target}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Track New Market Symbol"
      subtitle="Add any US stock or ETF to automatically scan with Donchian Strategy"
      maxWidth="max-w-md"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAdd();
        }}
        className="flex flex-col gap-4"
      >
        {error && (
          <div className="rounded-lg bg-rose-500/15 border border-rose-500/30 p-3 text-xs text-rose-300">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="symbol-input" className="text-xs font-medium text-[--color-muted] block mb-1.5">
            Ticker Symbol
          </label>
          <div className="relative">
            <input
              id="symbol-input"
              type="text"
              placeholder="e.g. NVDA, AAPL, SPY"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              autoFocus
              className="w-full rounded-xl border border-[--color-border] bg-[--color-surface-3] px-4 py-2.5 text-sm font-mono font-bold tracking-wider text-[--color-text] placeholder:text-[--color-muted-dim] focus:border-[--color-accent] outline-none"
            />
            <Search className="absolute right-3.5 top-3 size-4 text-[--color-muted-dim]" />
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div>
          <span className="text-[11px] font-medium text-[--color-muted-dim] flex items-center gap-1 mb-2">
            <Sparkles className="size-3 text-amber-400" />
            Quick Add Ideas
          </span>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_SUGGESTIONS.map((sym) => (
              <button
                key={sym}
                type="button"
                onClick={() => handleAdd(sym)}
                disabled={loading}
                className="px-2.5 py-1 text-xs font-mono font-medium rounded-lg bg-[--color-surface-3] text-[--color-text] border border-[--color-border] hover:border-[--color-accent] hover:text-[--color-accent] transition-colors"
              >
                +{sym}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[--color-border]/60">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-xs font-medium text-[--color-muted] hover:text-[--color-text] rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !symbol.trim()}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[--color-accent] hover:bg-[--color-accent-hover] text-white font-bold text-xs shadow-md disabled:opacity-50 transition-all"
          >
            {loading ? (
              <>
                <Spinner />
                <span>Validating...</span>
              </>
            ) : (
              <>
                <PlusCircle className="size-4" />
                <span>Add Symbol</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
