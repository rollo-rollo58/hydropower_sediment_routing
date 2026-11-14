"use client";

import { AlertLedger } from "../components/AlertLedger";
import { EnvironmentalFlowGauge } from "../components/EnvironmentalFlowGauge";
import { ForecastSensitivity } from "../components/ForecastSensitivity";
import { GateControlArray } from "../components/GateControlArray";
import { InflowHydrograph } from "../components/InflowHydrograph";
import { OperationsHeader } from "../components/OperationsHeader";
import { OperationsTimeline } from "../components/OperationsTimeline";
import { ReleaseConstraints } from "../components/ReleaseConstraints";
import { ReservoirElevationProfile } from "../components/ReservoirElevationProfile";
import { ScenarioSelector } from "../components/ScenarioSelector";
import { SedimentStrataHeatmap } from "../components/SedimentStrataHeatmap";
import { TurbinePowerBoard } from "../components/TurbinePowerBoard";
import { useDomainTelemetry } from "../hooks/useDomainTelemetry";

export default function Page() {
  const { dashboard, status } = useDomainTelemetry();
  return (
    <main className="mx-auto max-w-[1560px] px-4 py-7 md:px-10">
      <OperationsHeader status={status} level={dashboard.level_m} />
      <div className="mb-6 flex flex-wrap items-center gap-4 border-y py-4 text-sm">
        <span className="font-semibold text-lake">Basin: North Cascade</span>
        <span className="text-slate-500">Research environment</span>
        <span className="ml-auto font-semibold text-amber-700">
          Synthetic values / No physical control
        </span>
      </div>
      <div className="grid gap-4 xl:grid-cols-12">
        <div className="space-y-4 xl:col-span-7">
          <ReservoirElevationProfile level={dashboard.level_m}
            capacity={dashboard.capacity_pct} />
          <InflowHydrograph points={dashboard.forecast} />
          <div className="grid gap-4 md:grid-cols-2">
            <SedimentStrataHeatmap concentration={dashboard.sediment_kg_m3} />
            <TurbinePowerBoard powerMw={dashboard.turbine_mw} />
          </div>
        </div>
        <div className="space-y-4 xl:col-span-5">
          <GateControlArray gates={dashboard.gates} />
          <ReleaseConstraints inflow={dashboard.inflow_m3s}
            release={dashboard.release_m3s} />
          <ScenarioSelector />
        </div>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-4">
        <ForecastSensitivity />
        <EnvironmentalFlowGauge release={dashboard.release_m3s} />
        <OperationsTimeline />
        <AlertLedger alerts={dashboard.alerts} />
      </div>
      <footer className="py-8 text-center text-xs text-slate-500">
        Hydropower / Sediment Routing Workbench — non-operational model
      </footer>
    </main>
  );
}
