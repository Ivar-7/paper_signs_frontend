import { Inbox } from "lucide-react";

/**
 * @param {{ message?: string }} props
 */
export function EmptyState({ message = "No data yet." }) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center" role="status">
      <Inbox className="size-8 text-[--color-muted]" aria-hidden="true" />
      <p className="text-sm text-[--color-muted]">{message}</p>
    </div>
  );
}
