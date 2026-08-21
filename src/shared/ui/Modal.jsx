import { useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

/**
 * @param {{
 *   isOpen: boolean,
 *   onClose: () => void,
 *   title: string,
 *   subtitle?: string,
 *   children: React.ReactNode,
 *   maxWidth?: string
 * }} props
 */
export function Modal({ isOpen, onClose, title, subtitle, children, maxWidth = "max-w-xl" }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className={`relative w-full ${maxWidth} rounded-2xl border border-[--color-border] bg-[--color-surface-2] p-6 shadow-2xl z-10`}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-start justify-between pb-4 border-b border-[--color-border]/60">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-[--color-text]">{title}</h2>
              {subtitle && <p className="text-xs text-[--color-muted] mt-0.5">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-[--color-muted] hover:text-[--color-text] hover:bg-[--color-surface-3] transition-colors"
              aria-label="Close modal"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="mt-4">{children}</div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
