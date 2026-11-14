"use client";

import { useState } from "react";
import type { GateReading } from "../types/domain";

interface Props { gates: GateReading[]; }

export function GateControlArray({ gates }: Props) {
  const [selected, setSelected] = useState("G-1");
  return (
    <section className="panel p-5">
      <p className="eyebrow">Read-only gate overview</p>
      <h2 className="mb-4 text-lg font-semibold">Spillway geometry</h2>
      <div className="grid grid-cols-4 gap-2">
        {gates.map((gate) => (
          <button key={gate.id} onClick={() => setSelected(gate.id)}
            aria-pressed={selected === gate.id}
            className={`rounded-xl border p-2 text-center ${selected === gate.id
              ? "border-lake bg-mist" : "border-slate-200"}`}>
            <svg viewBox="0 0 60 94" className="mx-auto h-24 w-full max-w-14">
              <rect x="9" y="5" width="42" height="84" rx="3" fill="#badbd9" />
              <rect x="14" y="10" width="32" height="74" fill="#256d80" />
              <rect x="14" y="10" width="32" height={74*(1-gate.opening_pct/100)}
                fill="#415766" />
              <path d="M9 88H51" stroke="#263a44" strokeWidth="4" />
            </svg>
            <p className="text-sm font-semibold">{gate.id}</p>
            <p className="text-xs text-moss">{gate.opening_pct}%</p>
          </button>
        ))}
      </div>
      <p className="mt-4 text-xs text-slate-500">
        Selection displays geometry only. This UI cannot actuate physical gates.
      </p>
    </section>
  );
}
