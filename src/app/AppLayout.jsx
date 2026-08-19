import { Outlet, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  Radio,
  FlaskConical,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard",  Icon: LayoutDashboard },
  { to: "/portfolio", label: "Portfolio",  Icon: Wallet },
  { to: "/trades",    label: "Trades",     Icon: ArrowLeftRight },
  { to: "/signals",   label: "Signals",    Icon: Radio },
  { to: "/backtest",  label: "Backtest",   Icon: FlaskConical },
];

/**
 * Shell layout � sidebar nav + page outlet.
 */
export function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-[--color-surface] text-[--color-text]">
      <aside className="flex w-56 flex-col border-r border-[--color-border] bg-[--color-surface-2]">
        <div className="flex items-center gap-2 px-4 py-5 border-b border-[--color-border]">
          <span className="size-7 rounded-md bg-[--color-accent] flex items-center justify-center text-white font-bold text-sm">P</span>
          <span className="font-semibold tracking-wide text-sm">PaperSigns</span>
        </div>
        <nav className="flex flex-col gap-1 p-2 flex-1" aria-label="Main navigation">
          {NAV_ITEMS.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[--color-accent]/15 text-[--color-accent]"
                    : "text-[--color-muted] hover:text-[--color-text] hover:bg-[--color-surface-3]"
                }`
              }
            >
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-3 border-t border-[--color-border] text-xs text-[--color-muted]">
          TrendBot v1.0
        </div>
      </aside>

      <main className="flex flex-1 flex-col overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
