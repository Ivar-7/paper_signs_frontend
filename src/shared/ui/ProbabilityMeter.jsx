import { motion } from "motion/react";

/**
 * @param {{ score: number, size?: "sm"|"md"|"lg", showLabel?: boolean }} props
 */
export function ProbabilityMeter({ score = 0, size = "md", showLabel = true }) {
  const clamped = Math.min(100, Math.max(0, score));

  // Determine color scheme based on score
  const getColor = (s) => {
    if (s >= 80) return { bar: "bg-emerald-500", text: "text-emerald-400", glow: "shadow-[0_0_8px_rgba(16,185,129,0.4)]" };
    if (s >= 65) return { bar: "bg-green-500", text: "text-green-400", glow: "shadow-[0_0_8px_rgba(34,197,94,0.3)]" };
    if (s >= 50) return { bar: "bg-amber-500", text: "text-amber-400", glow: "shadow-[0_0_8px_rgba(245,158,11,0.3)]" };
    if (s >= 35) return { bar: "bg-blue-500", text: "text-blue-400", glow: "" };
    return { bar: "bg-rose-500", text: "text-rose-400", glow: "" };
  };

  const colors = getColor(clamped);

  const heights = {
    sm: "h-1.5",
    md: "h-2",
    lg: "h-2.5",
  };

  return (
    <div className="flex flex-col gap-1 w-full min-w-[70px]">
      {showLabel && (
        <div className="flex items-center justify-between text-xs font-mono font-medium">
          <span className="text-[--color-muted-dim] text-[10px]">PROB</span>
          <span className={`${colors.text} font-bold text-xs`}>{clamped.toFixed(0)}%</span>
        </div>
      )}
      <div className={`w-full bg-[--color-surface-3] rounded-full overflow-hidden ${heights[size]} border border-[--color-border]/60`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`h-full rounded-full ${colors.bar} ${colors.glow}`}
        />
      </div>
    </div>
  );
}
