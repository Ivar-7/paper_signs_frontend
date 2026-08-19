import { Card } from "./Card.jsx";

/**
 * @param {{ label: string, value: string|number, sub?: string, trend?: "up"|"down"|null }} props
 */
export function StatCard({ label, value, sub, trend }) {
  const trendColor =
    trend === "up"   ? "text-[--color-success]" :
    trend === "down" ? "text-[--color-danger]"  :
    "text-[--color-muted]";

  return (
    <Card>
      <p className="text-xs text-[--color-muted] uppercase tracking-widest font-medium">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
      {sub && <p className={`mt-0.5 text-xs ${trendColor}`}>{sub}</p>}
    </Card>
  );
}
