"use client";

import { useEffect, useState } from "react";
import { getDashboard } from "../lib/api-client";
import { subscribeToReservoirStream } from "../lib/websocket-stream";
import type { Dashboard } from "../types/domain";

const sample: Dashboard = {
  reservoir: "Cascade North / Synthetic Testbed",
  level_m: 471.2,
  capacity_pct: 75.3,
  inflow_m3s: 780,
  release_m3s: 735,
  sediment_kg_m3: 1.42,
  turbine_mw: 282.4,
  forecast: Array.from({ length: 24 }, (_, hour) => ({
    hour,
    inflow_m3s: Math.round(730 + 450 * Math.sin((hour / 24) * Math.PI)),
    release_m3s: 735,
    storage_m3: 640000000 + hour * 100000
  })),
  gates: [1, 2, 3, 4].map((n) => ({
    id: `G-${n}`,
    opening_pct: 18 + n * 8,
    discharge_m3s: 65 + n * 12
  })),
  alerts: [{ code: "NORMAL", severity: "info", detail: "Synthetic testbed only" }]
};

export function useDomainTelemetry() {
  const [dashboard, setDashboard] = useState<Dashboard>(sample);
  const [status, setStatus] = useState("Offline sample");

  useEffect(() => {
    const controller = new AbortController();
    getDashboard(controller.signal).then((value) => {
      setDashboard(value);
      setStatus("API connected");
    }).catch(() => setStatus("Offline sample"));
    const unsubscribe = subscribeToReservoirStream((sampleValue) => {
      setDashboard((prev) => ({
        ...prev,
        level_m: sampleValue.level_m,
        inflow_m3s: sampleValue.inflow_m3s
      }));
    });
    return () => {
      controller.abort();
      unsubscribe();
    };
  }, []);

  return { dashboard, status };
}
