interface Props { concentration: number; }

export function SedimentStrataHeatmap({ concentration }: Props) {
  const cells = Array.from({ length: 60 }, (_, index) => {
    const depth = Math.floor(index / 12);
    const turbulence = Math.sin(index * 1.8) * 0.18;
    const intensity = Math.max(0, Math.min(1, depth / 5 + turbulence));
    return { index, intensity };
  });
  return (
    <section className="panel p-5">
      <p className="eyebrow">Suspended load distribution</p>
      <h2 className="text-lg font-semibold">Sediment strata</h2>
      <div className="mt-4 grid grid-cols-12 gap-1" role="img"
        aria-label="Synthetic sediment intensity increasing with depth">
        {cells.map(({ index, intensity }) => (
          <div key={index} className="aspect-square rounded-sm" style={{
            background: `hsl(${185 - intensity * 150}, 45%, ${75 - intensity * 38}%)`
          }} />
        ))}
      </div>
      <div className="mt-4 flex items-end justify-between">
        <span className="text-sm text-slate-500">Surface → bedload</span>
        <strong className="metric text-xl">{concentration.toFixed(2)} kg/m³</strong>
      </div>
    </section>
  );
}
