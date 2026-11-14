BEGIN;
CREATE OR REPLACE VIEW reservoir_daily_extremes AS
SELECT reservoir_id, date_trunc('day', recorded_at) AS observation_day,
  count(*) AS sample_count,
  min(level_m) AS minimum_level_m,
  max(level_m) AS maximum_level_m,
  avg(inflow_m3s) AS mean_inflow_m3s,
  max(turbidity_ntu) AS peak_turbidity_ntu
FROM observations
GROUP BY reservoir_id, date_trunc('day', recorded_at);
CREATE OR REPLACE VIEW latest_reservoir_observation AS
SELECT DISTINCT ON (reservoir_id) reservoir_id, recorded_at,
  level_m, inflow_m3s, turbidity_ntu, source
FROM observations
ORDER BY reservoir_id, recorded_at DESC;
INSERT INTO reservoirs (
  asset_code, name, capacity_m3, dead_storage_m3, normal_pool_m
) VALUES (
  'DEMO-RSV-01', 'Illustrative Cascade Reservoir', 850000000, 65000000, 475.0
) ON CONFLICT (asset_code) DO NOTHING;
COMMIT;
