import { AlertCircle } from "lucide-react";

/**
 * Displays a normalised user-safe error message.
 * Raw error objects must be normalised by the caller via toUserMessage() before passing.
 * @param {{ message: string, onRetry?: () => void }} props
 */
export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center" role="alert" aria-live="assertive">
      <AlertCircle className="size-8 text-[--color-danger]" aria-hidden="true" />
      <p className="text-sm text-[--color-muted]">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg bg-[--color-surface-3] px-4 py-2 text-sm font-medium hover:bg-[--color-border] transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  );
}