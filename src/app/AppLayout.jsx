import { useState, useEffect } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import {
  Zap,
  Briefcase,
  History,
  Radio,
  RotateCcw,
} from "lucide-react";
import { fetchPortfolio, resetPortfolio } from "../features/portfolio/portfolio.api.js";
import { fetchTradeSummary } from "../features/trades/trades.api.js";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Strategizer", Icon: Zap },
  { to: "/portfolio", label: "Open Positions", Icon: Briefcase },
  { to: "/trades", label: "Trade Journal", Icon: History },
  { to: "/signals", label: "Signal Feed", Icon: Radio },
];

export function AppLayout() {
  const [portfolio, setPortfolio] = useState(null);
  const [summary, setSummary] = useState(null);
  const [resetting, setResetting] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    const loadHeaderStats = async () => {
      try {
        const [port, sum] = await Promise.all([
          fetchPortfolio().catch(() => null),
          fetchTradeSummary().catch(() => null),
        ]);
        if (mounted) {
          if (port) setPortfolio(port);
          if (sum) setSummary(sum);
        }
      } catch {
        // ignore
      }
    };

    loadHeaderStats();
    const interval = setInterval(loadHeaderStats, 8000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [location.pathname]);

  const handleReset = async () => {
    if (!window.confirm("Are you sure you want to reset paper account balance back to $100,000 and clear active positions?")) {
      return;
    }
    setResetting(true);
    try {
      await resetPortfolio();
      window.location.reload();
    } catch (err) {
      alert("Failed to reset account: " + err?.message);
    } finally {
      setResetting(false);
    }
  };

  const equity = portfolio?.equity ?? 100000;
  const cash = portfolio?.cash ?? 100000;
  const positionsCount = portfolio?.positions?.length ?? 0;
  const totalPnL = summary?.total_pnl ?? 0;
  const winRate = summary?.win_rate ?? 0;

  return (
    <div className="flex h-screen overflow-hidden bg-[--color-surface] text-[--color-text]">
      {/* Sidebar Navigation */}
      <aside className="flex w-64 flex-col border-r border-[--color-border] bg-[--color-surface-2] shrink-0">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-5 py-4.5 border-b border-[--color-border]">
          <div className="size-8 rounded-xl bg-gradient-to-tr from-[--color-accent] to-indigo-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-[--color-accent]/25">
            PS
          </div>
          <div>
            <span className="font-bold tracking-tight text-sm text-[--color-text] block">
              PaperSigns Pro
            </span>
            <span className="text-[10px] font-mono text-[--color-muted-dim] block uppercase tracking-wider">
              Automated Trading
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col gap-1.5 p-3 flex-1" aria-label="Main navigation">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-[--color-muted-dim] px-3 py-1 mt-1">
            Trading Desk
          </span>
          {NAV_ITEMS.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[--color-accent]/15 text-[--color-accent] border border-[--color-accent]/30 shadow-sm"
                    : "text-[--color-muted] hover:text-[--color-text] hover:bg-[--color-surface-3]"
                }`
              }
            >
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Strategy Meta & Reset Account */}
        <div className="p-3 border-t border-[--color-border] flex flex-col gap-2 bg-[--color-surface-card]/50">
          <div className="flex items-center justify-between text-[11px] font-mono text-[--color-muted-dim] px-1">
            <span>Strategy</span>
            <span className="text-[--color-text] font-semibold">Donchian 100/50</span>
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-[--color-muted-dim] px-1">
            <span>Risk Model</span>
            <span className="text-[--color-text] font-semibold">0.5% ATR20</span>
          </div>

          <button
            onClick={handleReset}
            disabled={resetting}
            className="mt-1 flex items-center justify-center gap-1.5 w-full py-1.5 px-3 rounded-lg border border-[--color-border] bg-[--color-surface-3] text-[11px] font-medium text-[--color-muted] hover:text-rose-300 hover:border-rose-500/40 hover:bg-rose-500/10 transition-colors disabled:opacity-50"
          >
            <RotateCcw className="size-3" />
            <span>{resetting ? "Resetting..." : "Reset $100k Account"}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header Ticker Bar */}
        <header className="h-14 border-b border-[--color-border] bg-[--color-surface-2]/80 backdrop-blur-md px-6 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-6 text-xs font-mono">
            {/* Account Equity */}
            <div>
              <span className="text-[10px] uppercase text-[--color-muted-dim] block">Net Equity</span>
              <span className="text-sm font-bold text-[--color-text]">
                ${equity.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            {/* Available Cash */}
            <div className="hidden sm:block">
              <span className="text-[10px] uppercase text-[--color-muted-dim] block">Available Cash</span>
              <span className="text-sm font-bold text-[--color-muted]">
                ${cash.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            {/* Realized PnL */}
            <div className="hidden md:block">
              <span className="text-[10px] uppercase text-[--color-muted-dim] block">Realized P&L</span>
              <span className={`text-sm font-bold ${totalPnL >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {totalPnL >= 0 ? "+" : ""}${totalPnL.toFixed(2)}
              </span>
            </div>

            {/* Win Rate */}
            <div className="hidden lg:block">
              <span className="text-[10px] uppercase text-[--color-muted-dim] block">Win Rate</span>
              <span className="text-sm font-bold text-[--color-text]">
                {winRate}%
              </span>
            </div>

            {/* Active Position Slots */}
            <div>
              <span className="text-[10px] uppercase text-[--color-muted-dim] block">Capacity</span>
              <span className="text-sm font-bold text-[--color-accent]">
                {positionsCount} / 4 Slots
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono font-semibold">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>PAPER LIVE</span>
            </div>
          </div>
        </header>

        {/* Scrollable Page Outlet */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
