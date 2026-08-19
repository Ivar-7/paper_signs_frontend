export function Spinner({ className = "" }) {
  return (
    <div
      className={`size-5 rounded-full border-2 border-[--color-border] border-t-[--color-accent] animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
