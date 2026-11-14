"use client";

import { useState } from "react";
import { getScenario } from "../lib/api-client";
import type { ScenarioResult } from "../types/domain";

export function ScenarioSelector() {
  const [kind, setKind] = useState("monsoon");
  const [index, setIndex] = useState(340);
  const [result, setResult] = useState<ScenarioResult | null>(null);
  const [message, setMessage] = useState("Choose a generated synthetic scenario");
  const [running, setRunning] = useState(false);
  const run = async () => {
    setRunning(true);
    try {
      const data = await getScenario(kind, index);
      setResult(data);
      setMessage(`Evaluated ${data.scenario_id}`);
    } catch {
      setMessage("Scenario API unavailable. Start the backend to evaluate.");
    } finally {
      setRunning(false);
    }
  };
  return (
    <section className="panel p-5">
      <p className="eyebrow">Scenario laboratory / 5,100 deterministic cases</p>
      <h2 className="text-lg font-semibold">Stress-test a basin regime</h2>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <label className="text-sm">Hydrologic regime
          <select value={kind} onChange={(e) => setKind(e.target.value)}
            className="mt-1 w-full rounded-lg border p-2">
            <option value="monsoon">Monsoon</option>
            <option value="flood">Flash flood</option>
            <option value="sediment">Sediment pulse</option>
          </select>
        </label>
        <label className="text-sm">Scenario index
          <input type="number" min="0" max="1699" value={index}
            onChange={(e) => setIndex(Math.max(0, Math.min(1699, Number(e.target.value))))}
            className="mt-1 w-full rounded-lg border p-2" />
        </label>
      </div>
      <button onClick={run} disabled={running}
        className="mt-4 w-full rounded-lg bg-ink py-3 font-semibold text-white
          hover:bg-lake disabled:opacity-50">
        {running ? "Evaluating" : "Evaluate synthetic scenario"}
      </button>
      <p role="status" className="mt-3 text-xs text-slate-500">{message}</p>
      {result && <div className="mt-3 grid grid-cols-2 gap-3 rounded-lg bg-mist p-3 text-sm">
        <p>Peak index <b>{result.flood_exposure_index.toFixed(3)}</b></p>
        <p>Power <b>{result.predicted_power_mw.toFixed(1)} MW</b></p>
        <p>Deposition <b>{result.sediment_deposition_tonnes.toFixed(1)} t</b></p>
        <p>Alert <b>{result.alert_code}</b></p>
      </div>}
    </section>
  );
}
