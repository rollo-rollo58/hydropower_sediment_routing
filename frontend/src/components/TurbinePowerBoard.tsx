interface Props { powerMw: number; }

export function TurbinePowerBoard({ powerMw }: Props) {
  return (
    <section className="panel p-5">
      <p className="eyebrow">Hydroelectric generation</p>
      <h2 className="mb-4 text-lg font-semibold">Turbine allocation</h2>
      <div className="grid grid-cols-3 gap-2">
        {[0.35, 0.34, 0.31].map((fraction, index) => (
          <div key={index} className="rounded-xl bg-mist p-3 text-center">
            <svg viewBox="0 0 50 50" className="mx-auto mb-2 h-12 w-12 text-lake">
              <circle cx="25" cy="25" r="20" stroke="currentColor"
                strokeWidth="2" fill="none" />
              {[0, 120, 240].map((angle) => (
                <path key={angle} d="M25 25L25 8Q40 10 32 27Z" fill="currentColor"
                  transform={`rotate(${angle} 25 25)`} opacity="0.7" />
              ))}
            </svg>
            <p className="text-xs">Unit {index + 1}</p>
            <strong className="metric text-sm">{(powerMw * fraction).toFixed(1)} MW</strong>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-slate-500">Aggregate estimate</p>
      <p className="metric text-3xl">{powerMw.toFixed(1)} <span className="text-base">MW</span></p>
    </section>
  );
}
