/**
 * Normalised application error.
 * Wraps raw errors with a user-safe message so raw tracebacks never reach the UI.
 */
export class AppError extends Error {
  /**
   * @param {string} userMessage - Safe message to display to users.
   * @param {unknown} [cause] - Original error for diagnostic logging.
   */
  constructor(userMessage, cause) {
    super(userMessage);
    this.name = "AppError";
    this.cause = cause;
  }
}

/**
 * Normalise any thrown value into a user-safe message string.
 * Logs the original error for diagnostics.
 * @param {unknown} error
 * @param {string} [fallback]
 * @returns {string}
 */
export function toUserMessage(error, fallback = "Something went wrong. Please try again.") {
  if (error instanceof AppError) return error.message;
  if (error instanceof Error) {
    console.error("[AppError]", error);
    // Surface HTTP status messages that are safe to show
    if (error.status && error.status < 500) return error.message;
    return fallback;
  }
  console.error("[AppError] Unknown error:", error);
  return fallback;
}