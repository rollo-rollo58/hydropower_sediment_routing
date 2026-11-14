export interface ForecastPoint {
  hour: number;
  inflow_m3s: number;
  release_m3s: number;
  storage_m3: number;
}

export interface GateReading {
  id: string;
  opening_pct: number;
  discharge_m3s: number;
}

export interface Alert {
  code: string;
  severity: "info" | "watch" | "warning" | "critical";
  detail: string;
}

export interface Dashboard {
  reservoir: string;
  level_m: number;
  capacity_pct: number;
  inflow_m3s: number;
  release_m3s: number;
  sediment_kg_m3: number;
  turbine_mw: number;
  forecast: ForecastPoint[];
  gates: GateReading[];
  alerts: Alert[];
}

export interface ScenarioResult {
  scenario_id: string;
  season: string;
  inflow_m3s: number;
  release_m3s: number;
  reservoir_level_m: number;
  sediment_concentration_kg_m3: number;
  predicted_power_mw: number;
  drawdown_m3: number;
  flood_exposure_index: number;
  sediment_deposition_tonnes: number;
  alert_code: string;
}
