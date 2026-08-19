export function PageSpinner() {
  return (
    <div className="flex h-screen w-full items-center justify-center" role="status" aria-label="Loading">
      <div className="size-8 rounded-full border-2 border-[--color-border] border-t-[--color-accent] animate-spin" />
    </div>
  );
}
