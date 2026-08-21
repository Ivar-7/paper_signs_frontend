const VARIANTS = {
  success: "bg-[--color-success]/15 text-[--color-success] border border-[--color-success]/30",
  danger:  "bg-[--color-danger]/15  text-[--color-danger] border border-[--color-danger]/30",
  warning: "bg-[--color-warning]/15 text-[--color-warning] border border-[--color-warning]/30",
  muted:   "bg-[--color-surface-3] text-[--color-muted] border border-[--color-border]",
  accent:  "bg-[--color-accent]/15  text-[--color-accent] border border-[--color-accent]/30",
  "strong-buy": "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.25)] font-bold",
  buy: "bg-green-500/15 text-green-300 border border-green-500/30 font-semibold",
  watchlist: "bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold",
  neutral: "bg-slate-700/40 text-slate-300 border border-slate-600/40 font-medium",
  exit: "bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold",
  avoid: "bg-red-950/40 text-red-400 border border-red-900/40 font-medium",
};

/**
 * @param {{ children: React.ReactNode, variant?: keyof VARIANTS, size?: "sm"|"md"|"lg", className?: string }} props
 */
export function Badge({ children, variant = "muted", size = "md", className = "" }) {
  const sizeClasses = {
    sm: "px-1.5 py-0.5 text-[10px]",
    md: "px-2.5 py-0.5 text-xs",
    lg: "px-3 py-1 text-sm font-semibold",
  };

  const style = VARIANTS[variant] || VARIANTS.muted;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md tracking-wide ${sizeClasses[size]} ${style} ${className}`}>
      {children}
    </span>
  );
}
