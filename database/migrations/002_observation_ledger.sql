BEGIN;
CREATE TABLE IF NOT EXISTS observations (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  reservoir_id UUID NOT NULL REFERENCES reservoirs(id),
  recorded_at TIMESTAMPTZ NOT NULL,
  level_m DOUBLE PRECISION NOT NULL,
  inflow_m3s DOUBLE PRECISION NOT NULL CHECK (inflow_m3s >= 0),
  turbidity_ntu DOUBLE PRECISION NOT NULL CHECK (turbidity_ntu >= 0),
  source TEXT NOT NULL DEFAULT 'simulated',
  received_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_observations_time
  ON observations (reservoir_id, recorded_at DESC);
CREATE TABLE IF NOT EXISTS simulation_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservoir_id UUID NOT NULL REFERENCES reservoirs(id),
  scenario_kind TEXT NOT NULL,
  initial_storage_m3 DOUBLE PRECISION NOT NULL,
  final_storage_m3 DOUBLE PRECISION NOT NULL,
  elapsed_seconds INTEGER NOT NULL CHECK (elapsed_seconds > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMIT;
