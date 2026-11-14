"use client";

import { useState } from "react";

export function ForecastSensitivity() {
  const [storm, setStorm] = useState(1.1);
  const [release, setRelease] = useState(700);
  const hours = 24;
  const waterVolume = Array.from({ length: hours }, (_, hour) =>
    650 + 180 * storm * Math.pow(Math.sin((hour / hours) * Math.PI), 3)
  );
  const endDelta = waterVolume.reduce((acc, flow) => acc + (flow - release) * 3600, 0);
  const peak = Math.max(...waterVolume);
  return (
    <section className="panel p-5">
      <p className="eyebrow">Sensitivity lab</p>
      <h2 className="text-lg font-semibold">24-hour storage response</h2>
      <label className="mt-4 block text-sm">Storm severity ×{storm.toFixed(1)}
        <input className="mt-2 w-full accent-lake" type="range" min="0" max="3"
          step="0.1" value={storm} onChange={(e) => setStorm(Number(e.target.value))} />
      </label>
      <label className="mt-4 block text-sm">Release target {release} m³/s
        <input className="mt-2 w-full accent-lake" type="range" min="200" max="1700"
          step="25" value={release} onChange={(e) => setRelease(Number(e.target.value))} />
      </label>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-mist p-3"><p>Peak inflow</p>
          <strong className="metric">{peak.toFixed(0)} m³/s</strong></div>
        <div className="rounded-xl bg-mist p-3"><p>Net water balance</p>
          <strong className="metric">{(endDelta / 1e6).toFixed(2)} Mm³</strong></div>
      </div>
      <p className="mt-3 text-xs text-slate-500">Synthetic sinusoidal inflow only.</p>
    </section>
  );
}
