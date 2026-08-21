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
    <div className="flex h-screen overflow-hidden bg-[#070a13] text-[--color-text] relative">
      {/* Subtle background ambient lights */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/3 size-[650px] rounded-full bg-sky-500/10 blur-[130px]" />
        <div className="absolute top-20 right-0 size-[500px] rounded-full bg-emerald-500/08 blur-[120px]" />
        <div className="absolute -bottom-32 left-10 size-[500px] rounded-full bg-indigo-600/08 blur-[140px]" />
      </div>

      {/* Sidebar Navigation */}
      <aside className="relative flex w-64 flex-col border-r border-[#1a2337] bg-[#090d18]/85 backdrop-blur-2xl shrink-0 z-20">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#1a2337]">
          <img src="/favicon.svg" alt="PaperSigns Logo" className="size-9 rounded-xl shadow-lg shadow-sky-500/20 shrink-0" />
          <div>
            <span className="font-bold tracking-tight text-sm text-[--color-text] block">
              PaperSigns Pro
            </span>
            <span className="text-[10px] font-mono text-[--color-muted-dim] block uppercase tracking-wider">
              Automated Trading Desk
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col gap-1.5 p-3 flex-1" aria-label="Main navigation">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[--color-muted-dim] px-3 py-1 mt-1">
            Trading Terminal
          </span>
          {NAV_ITEMS.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-sky-500/15 text-sky-400 border border-sky-500/30 shadow-[0_0_15px_rgba(56,189,248,0.15)] font-bold"
                    : "text-[--color-muted] hover:text-[--color-text] hover:bg-[#131b2e]/60"
                }`
              }
            >
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Strategy Meta & Reset Account */}
        <div className="p-3 border-t border-[#1a2337] flex flex-col gap-2 bg-[#0c1220]/70 backdrop-blur-md">
          <div className="flex items-center justify-between text-[11px] font-mono text-[--color-muted-dim] px-1">
            <span>Strategy</span>
            <span className="text-[--color-text] font-semibold">Donchian 100/50</span>
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-[--color-muted-dim] px-1">
            <span>Risk Model</span>
            <span className="text-[--color-text] font-semibold">1.0% ATR20</span>
          </div>

          <button
            onClick={handleReset}
            disabled={resetting}
            className="mt-1 flex items-center justify-center gap-1.5 w-full py-1.5 px-3 rounded-lg border border-[#1e293b] bg-[#131b2e]/80 text-[11px] font-medium text-[--color-muted] hover:text-rose-300 hover:border-rose-500/40 hover:bg-rose-500/10 transition-all disabled:opacity-50"
          >
            <RotateCcw className="size-3" />
            <span>{resetting ? "Resetting..." : "Reset $100k Account"}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="relative flex flex-1 flex-col overflow-hidden z-10">
        {/* Top Header Ticker Bar */}
        <header className="h-14 border-b border-[#1a2337] bg-[#090d18]/80 backdrop-blur-2xl px-6 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-6 text-xs font-mono">
            {/* Account Equity */}
            <div>
              <span className="text-[10px] uppercase text-[--color-muted-dim] block">Net Equity</span>
              <span className="text-sm font-black text-[--color-text]">
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
              <span className={`text-sm font-black ${totalPnL >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {totalPnL >= 0 ? "+" : ""}${totalPnL.toFixed(2)}
              </span>
            </div>

            {/* Win Rate */}
            <div className="hidden lg:block">
              <span className="text-[10px] uppercase text-[--color-muted-dim] block">Win Rate</span>
              <span className="text-sm font-black text-[--color-text]">
                {winRate}%
              </span>
            </div>

            {/* Active Position Slots */}
            <div>
              <span className="text-[10px] uppercase text-[--color-muted-dim] block">Capacity</span>
              <span className="text-sm font-black text-sky-400">
                {positionsCount} / 4 Slots
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-bold shadow-[0_0_12px_rgba(16,185,129,0.2)]">
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
