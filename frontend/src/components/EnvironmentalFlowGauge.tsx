interface Props { release: number; }

export function EnvironmentalFlowGauge({ release }: Props) {
  const target = 160;
  const ratio = Math.min(1, release / (target * 4));
  return (
    <section className="panel p-5">
      <p className="eyebrow">Downstream simulation</p>
      <h2 className="text-lg font-semibold">Ecological flow gauge</h2>
      <svg viewBox="0 0 250 150" className="mx-auto mt-3 w-full max-w-64"
        role="img" aria-label="Simulated environmental release ratio">
        <path d="M35 128 A90 90 0 0 1 215 128" fill="none"
          stroke="#e6efec" strokeWidth="18" strokeLinecap="round" />
        <path d="M35 128 A90 90 0 0 1 215 128" fill="none"
          stroke="#1f9498" strokeWidth="18" strokeLinecap="round"
          pathLength="1" strokeDasharray={`${ratio} 1`} />
        <text x="125" y="116" textAnchor="middle" fontSize="30"
          fill="#213d47" fontWeight="bold">{release.toFixed(0)}</text>
        <text x="125" y="139" textAnchor="middle" fontSize="12"
          fill="#607a75">m³/s simulated release</text>
      </svg>
      <p className="text-center text-sm text-slate-500">
        Illustrative minimum reference: {target} m³/s
      </p>
    </section>
  );
}
