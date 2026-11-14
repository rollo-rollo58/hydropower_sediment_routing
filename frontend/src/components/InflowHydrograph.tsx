import type { ForecastPoint } from "../types/domain";

interface Props { points: ForecastPoint[]; }

export function InflowHydrograph({ points }: Props) {
  const maxFlow = Math.max(1, ...points.map((p) => p.inflow_m3s));
  const toX = (index: number) => (index / Math.max(1, points.length - 1)) * 520 + 38;
  const toY = (flow: number) => 195 - (flow / maxFlow) * 155;
  const inflow = points.map((p, i) => `${toX(i)},${toY(p.inflow_m3s)}`).join(" ");
  const release = points.map((p, i) => `${toX(i)},${toY(p.release_m3s)}`).join(" ");
  return (
    <section className="panel p-5">
      <div className="flex items-start justify-between gap-3">
        <div><p className="eyebrow">24-hour synthetic routing</p>
          <h2 className="text-lg font-semibold">Inflow versus release</h2></div>
        <span className="text-xs text-slate-500">m³/s</span>
      </div>
      <svg viewBox="0 0 600 240" className="mt-4 w-full" role="img"
        aria-label="Inflow hydrograph and release comparison for 24 hours">
        {[40, 90, 140, 195].map((y) => (
          <line key={y} x1="35" y1={y} x2="562" y2={y}
            stroke="#e0eae8" strokeDasharray="3 4" />
        ))}
        <polyline points={inflow} fill="none" stroke="#0d8497" strokeWidth="3" />
        <polyline points={release} fill="none" stroke="#dc9a42" strokeWidth="3"
          strokeDasharray="5 4" />
        <text x="36" y="225" fill="#6b807b" fontSize="12">00:00</text>
        <text x="498" y="225" fill="#6b807b" fontSize="12">23:00</text>
      </svg>
      <div className="flex gap-5 text-xs text-slate-600">
        <span><b className="text-lake">━</b> Inflow</span>
        <span><b className="text-sunrise">┄</b> Release</span>
      </div>
    </section>
  );
}
