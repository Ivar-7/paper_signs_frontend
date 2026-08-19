/**
 * @param {{ children: React.ReactNode, className?: string }} props
 */
export function Card({ children, className = "" }) {
  return (
    <div className={`rounded-xl border border-[--color-border] bg-[--color-surface-2] p-4 ${className}`}>
      {children}
    </div>
  );
}
