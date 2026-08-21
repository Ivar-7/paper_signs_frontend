/**
 * @param {{ data: number[], width?: number, height?: number, isPositive?: boolean }} props
 */
export function Sparkline({ data = [], width = 64, height = 24, isPositive = true }) {
  if (!data || data.length < 2) {
    return <div className="w-16 h-6" />;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * (width - 4) + 2;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const color = isPositive ? "#10b981" : "#f43f5e";

  return (
    <svg width={width} height={height} className="overflow-visible shrink-0">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        opacity="0.85"
      />
    </svg>
  );
}
