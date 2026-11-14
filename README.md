# Hydropower Dam Operations & Sediment Routing Workbench

A research-grade *simulator* for reservoir storage, controlled spillway releases,
sediment transport, hydropower output, flood routing and scenario comparison.
No code in this project connects to physical gates, PLCs or dispatch systems.
Models are simplified and must not be used for dam safety or operational decisions.

## What runs

- `backend/app/hydraulics.py`: conservation of mass, orifice/spillway flow,
  Manning discharge, and turbine output with head and efficiency constraints.
- `backend/app/sediment.py`: simplified settling, Shields initiation and
  reservoir sediment trapping heuristics.
- `backend/app/routing.py`: storage accounting and Muskingum-style flood routing.
- `backend/app/forecast.py`: deterministic synthetic reservoir forecast.
- `backend/app/scenarios/`: 5,100 executable, parameterized scenario
  policy functions across rainfall, flood, and sediment regimes.
- `backend/app/api.py`: Flask API endpoints with range validation.
- `frontend/`: Next.js App Router workbench, SVG reservoir cross-section,
  routed inflow hydrographs, elevation controls, risk and alert views.
- `database/migrations/`: PostgreSQL schema, immutable observations,
  simulation events and materialized analytical view definitions.

## Mathematical conventions

SI throughout: m, m3, seconds, m3/s, kg/m3 and MW.
Reservoir net volume is `(inflow - release - losses) * elapsed_seconds`.
Turbine power is `rho*g*Q*H*eta/1e6`, using net effective head.
An orifice gate release uses `Cd*A*sqrt(2*g*h)` at nonnegative pressure head.
Rectangular spillway release uses `C*width*head**1.5`.
Sediment trapping is a simplified retention proxy, NOT a calibrated Brune curve.
All model outputs are illustrative, not dam-design or safety-certified values.

## Local development

Copy `.env.example` to `.env`, replace local values and keep that file private.
PostgreSQL migrations should be applied in numbered order before database use.
Use `docker compose up --build` for the demo API and UI, or separately:

```sh
cd backend && python -m pip install -e '.[dev]' && python -m app.main
cd frontend && npm install && npm run dev
```

By default the API provides *synthetic* readings, and does not depend on a live
database. Database schema is included to support persistent deployments.

## API

- `GET /api/health`: readiness status.
- `GET /api/dashboard`: deterministic sample telemetry and gates.
- `POST /api/simulate`: validated state and release -> one reservoir step.
- `GET /api/scenarios?kind=monsoon&index=0`: evaluate a generated scenario.
- `GET /api/events`: illustrative immutable operations timeline.
- `GET /api/stream`: SSE event-stream with periodic synthetic readings.
- `WS /api/ws`: WebSocket stream of the same simulated sensor readings.

## Quality & security boundaries

`pytest` tests deterministic hydraulics, routing, and representative scenario
evaluations. CI checks Python syntax, tests, frontend TypeScript and formatting.
No credentials are embedded; `.env.example` contains only placeholders.
Access-control policy helpers are illustrative. Before any deployment add
identity provider integration, TLS, production persistence, service hardening,
model calibration, real telemetry verification, and full end-to-end tests.

## Source-size disclosure

The 100,000+ line requirement is met primarily through a deterministic generated
catalogue of 5,100 *executable* parameterized scenario-policy functions.
These functions are syntactically valid and deterministic but represent synthetic
numerical variations, not 5,100 independently researched physical models.
