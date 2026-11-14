"use client";

import { useState } from "react";

interface Props { inflow: number; release: number; }

export function ReleaseConstraints({ inflow, release }: Props) {
  const [minimum, setMinimum] = useState(160);
  const [maximum, setMaximum] = useState(1800);
  const recommended = Math.max(minimum, Math.min(maximum, release));
  return (
    <section className="panel p-5">
      <p className="eyebrow">Simulation-only release bounds</p>
      <h2 className="text-lg font-semibold">Environmental constraints</h2>
      <div className="mt-4 space-y-4">
        <label className="block text-sm">Environmental minimum: {minimum} m³/s
          <input className="mt-2 w-full accent-lake" type="range" min="50" max="500"
            value={minimum} onChange={(e) => setMinimum(Number(e.target.value))} />
        </label>
        <label className="block text-sm">Illustrative maximum: {maximum} m³/s
          <input className="mt-2 w-full accent-lake" type="range" min="700" max="3000"
            value={maximum} onChange={(e) => setMaximum(Number(e.target.value))} />
        </label>
      </div>
      <div className="mt-3 rounded-xl bg-mist px-4 py-3 text-sm">
        <span>Clamped simulated release</span>
        <strong className="metric float-right">{recommended.toFixed(0)} m³/s</strong>
      </div>
      <p className="mt-3 text-xs text-slate-500">
        Inflow reference: {inflow.toFixed(0)} m³/s. Not a safe operating recommendation.
      </p>
    </section>
  );
}
