BEGIN;
CREATE TABLE IF NOT EXISTS operational_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservoir_id UUID NOT NULL REFERENCES reservoirs(id),
  event_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('info','watch','warning','critical')),
  observed_value DOUBLE PRECISION,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_events_time
  ON operational_events (reservoir_id, occurred_at DESC);
CREATE OR REPLACE FUNCTION refuse_audit_mutation()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'Operational event ledger is append-only';
END;
$$;
DROP TRIGGER IF EXISTS operational_events_immutable ON operational_events;
CREATE TRIGGER operational_events_immutable
  BEFORE UPDATE OR DELETE ON operational_events
  FOR EACH ROW EXECUTE FUNCTION refuse_audit_mutation();
COMMIT;
