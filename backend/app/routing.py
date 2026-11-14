"""Mass-conserving finite-time-step reservoir and flood wave simulation."""
from dataclasses import dataclass

from .domain import ReservoirState


@dataclass(frozen=True)
class WaterBalance:
    final_storage_m3: float
    overflow_m3: float
    unmet_release_m3: float
    net_volume_m3: float


def integrate_storage(
    storage_m3: float, capacity_m3: float, inflow_m3s: float,
    release_m3s: float, evaporation_m3s: float, elapsed_seconds: float,
) -> WaterBalance:
    values = (storage_m3, capacity_m3, inflow_m3s, release_m3s,
              evaporation_m3s, elapsed_seconds)
    if min(values) < 0 or capacity_m3 <= 0 or storage_m3 > capacity_m3:
        raise ValueError("invalid storage balance inputs")
    net = (inflow_m3s - release_m3s - evaporation_m3s) * elapsed_seconds
    preliminary = storage_m3 + net
    return WaterBalance(
        final_storage_m3=min(capacity_m3, max(0, preliminary)),
        overflow_m3=max(0, preliminary - capacity_m3),
        unmet_release_m3=max(0, -preliminary),
        net_volume_m3=net,
    )


def advance_reservoir(
    state: ReservoirState, elapsed_seconds: float,
    evaporation_m3s: float = 0.0,
) -> tuple[ReservoirState, WaterBalance]:
    state.validate()
    balance = integrate_storage(
        state.storage_m3, state.capacity_m3, state.inflow_m3s,
        state.outflow_m3s, evaporation_m3s, elapsed_seconds,
    )
    fraction = balance.final_storage_m3 / state.capacity_m3
    updated = ReservoirState(
        storage_m3=balance.final_storage_m3,
        capacity_m3=state.capacity_m3,
        level_m=350 + 130 * fraction,
        inflow_m3s=state.inflow_m3s,
        outflow_m3s=state.outflow_m3s,
        sediment_kg_m3=state.sediment_kg_m3,
    )
    return updated, balance


def muskingum_step(
    prior_inflow_m3s: float, current_inflow_m3s: float,
    prior_outflow_m3s: float, travel_seconds: float,
    weighting: float, elapsed_seconds: float,
) -> float:
    if min(prior_inflow_m3s, current_inflow_m3s, prior_outflow_m3s) < 0:
        raise ValueError("discharges must not be negative")
    if travel_seconds <= 0 or elapsed_seconds <= 0:
        raise ValueError("time constants must be positive")
    if not 0 <= weighting <= 0.5:
        raise ValueError("Muskingum weighting must be between 0 and 0.5")
    denominator = 2 * travel_seconds * (1 - weighting) + elapsed_seconds
    c0 = (elapsed_seconds - 2 * travel_seconds * weighting) / denominator
    c1 = (elapsed_seconds + 2 * travel_seconds * weighting) / denominator
    c2 = (2 * travel_seconds * (1 - weighting) - elapsed_seconds) / denominator
    if min(c0, c1, c2) < -1e-10:
        raise ValueError("time step unstable for routing coefficients")
    return max(0, c0 * current_inflow_m3s + c1 * prior_inflow_m3s
               + c2 * prior_outflow_m3s)
