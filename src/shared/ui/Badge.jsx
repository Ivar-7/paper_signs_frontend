const VARIANTS = {
  success: "bg-[--color-success]/15 text-[--color-success]",
  danger:  "bg-[--color-danger]/15  text-[--color-danger]",
  warning: "bg-[--color-warning]/15 text-[--color-warning]",
  muted:   "bg-[--color-surface-3] text-[--color-muted]",
  accent:  "bg-[--color-accent]/15  text-[--color-accent]",
};

/**
 * @param {{ children: React.ReactNode, variant?: keyof VARIANTS }} props
 */
export function Badge({ children, variant = "muted" }) {
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${VARIANTS[variant]}`}>
      {children}
    </span>
  );
}
