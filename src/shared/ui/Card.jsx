/**
 * @param {{ children: React.ReactNode, className?: string }} props
 */
export function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-[#1e293b] bg-[#0c1220]/80 backdrop-blur-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:border-[#2a3952] transition-all ${className}`}>
      {children}
    </div>
  );
}
