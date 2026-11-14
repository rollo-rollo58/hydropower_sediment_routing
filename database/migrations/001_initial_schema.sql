BEGIN;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS reservoirs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  capacity_m3 DOUBLE PRECISION NOT NULL CHECK (capacity_m3 > 0),
  dead_storage_m3 DOUBLE PRECISION NOT NULL DEFAULT 0,
  normal_pool_m DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (dead_storage_m3 >= 0 AND dead_storage_m3 < capacity_m3)
);
CREATE TABLE IF NOT EXISTS gates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservoir_id UUID NOT NULL REFERENCES reservoirs(id),
  code TEXT NOT NULL,
  width_m DOUBLE PRECISION NOT NULL CHECK (width_m > 0),
  height_m DOUBLE PRECISION NOT NULL CHECK (height_m > 0),
  maximum_opening_pct NUMERIC(5,2) NOT NULL DEFAULT 100,
  UNIQUE (reservoir_id, code)
);
CREATE TABLE IF NOT EXISTS turbines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservoir_id UUID NOT NULL REFERENCES reservoirs(id),
  code TEXT NOT NULL,
  rated_mw DOUBLE PRECISION NOT NULL CHECK (rated_mw > 0),
  rated_flow_m3s DOUBLE PRECISION NOT NULL CHECK (rated_flow_m3s > 0),
  design_head_m DOUBLE PRECISION NOT NULL CHECK (design_head_m > 0),
  UNIQUE (reservoir_id, code)
);
CREATE INDEX IF NOT EXISTS idx_gates_reservoir ON gates (reservoir_id);
CREATE INDEX IF NOT EXISTS idx_turbines_reservoir ON turbines (reservoir_id);
COMMIT;
