"""Flask read/simulate endpoints with explicit bounds and error responses."""
import json
import time
from math import isfinite

from flask import Blueprint, Response, jsonify, request

from .alerts import assess
from .domain import ReservoirState
from .forecast import hydrograph, project_storage
from .hydraulics import gate_discharge, turbine_power_mw
from .repository import events
from .routing import advance_reservoir
from .scenarios import evaluate_scenario

api = Blueprint("api", __name__, url_prefix="/api")


def bounded(payload: dict, name: str, default: float, maximum: float) -> float:
    try:
        result = float(payload.get(name, default))
    except (TypeError, ValueError) as exc:
        raise ValueError(f"{name} must be numeric") from exc
    if not isfinite(result) or result < 0 or result > maximum:
        raise ValueError(f"{name} outside permitted range 0..{maximum}")
    return result


@api.get("/health")
def health():
    return jsonify({"status": "ok", "service": "reservoir-simulation"})


@api.get("/dashboard")
def dashboard():
    inflows = hydrograph(780, 1.05, 24)
    curve = project_storage(640_000_000, 850_000_000, inflows, 735)
    gates = [
        {"id": f"G-{n}", "opening_pct": 18 + n * 8,
         "discharge_m3s": round(gate_discharge(0.4 + n * 0.12, 6, 15), 2)}
        for n in range(1, 5)
    ]
    return jsonify({
        "reservoir": "Cascade North / Synthetic Testbed",
        "level_m": 471.2,
        "capacity_pct": 75.3,
        "inflow_m3s": 780,
        "release_m3s": 735,
        "sediment_kg_m3": 1.42,
        "turbine_mw": round(turbine_power_mw(440, 72, 0.91, 2.5), 2),
        "gates": gates,
        "forecast": [point.as_json() for point in curve],
        "alerts": [a.as_json() for a in assess(471.2, 1.42, 780)],
    })


@api.post("/simulate")
def simulate():
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return jsonify({"error": "expected JSON object"}), 400
    try:
        capacity = bounded(payload, "capacity_m3", 850_000_000, 2_000_000_000)
        storage = bounded(payload, "storage_m3", 640_000_000, capacity)
        state = ReservoirState(
            storage_m3=storage, capacity_m3=capacity,
            level_m=bounded(payload, "level_m", 471.2, 1000),
            inflow_m3s=bounded(payload, "inflow_m3s", 780, 100_000),
            outflow_m3s=bounded(payload, "release_m3s", 735, 100_000),
            sediment_kg_m3=bounded(payload, "sediment_kg_m3", 1.42, 100),
        )
        dt = bounded(payload, "elapsed_seconds", 3600, 86400)
        if dt == 0:
            raise ValueError("elapsed_seconds must be positive")
        result, balance = advance_reservoir(state, dt, evaporation_m3s=1.8)
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 422
    events.append("simulation", f"Evaluated {dt:.0f}-second storage balance")
    return jsonify({"state": result.as_json(), "balance": balance.__dict__})


@api.get("/scenarios")
def scenario():
    kind = request.args.get("kind", "monsoon")
    try:
        index = int(request.args.get("index", "0"))
        if not 0 <= index < 1700:
            raise ValueError("scenario index out of bounds")
        result = evaluate_scenario(kind, index)
    except (ValueError, KeyError) as exc:
        return jsonify({"error": str(exc)}), 422
    return jsonify(result.as_json())


@api.get("/events")
def get_events():
    return jsonify({"events": [event.as_json() for event in events.recent()]})


@api.get("/stream")
def stream():
    def generate():
        for index in range(12):
            sample = {"level_m": round(470.2 + index * 0.05, 2),
                      "inflow_m3s": 780 + index * 7, "sequence": index}
            yield f"event: sample\ndata: {json.dumps(sample)}\n\n"
            time.sleep(2)
    return Response(generate(), mimetype="text/event-stream")
