"""Deterministic illustrative inflow forecast and sensitivity analysis."""
from dataclasses import asdict, dataclass
from math import pi, sin

from .routing import integrate_storage


@dataclass(frozen=True)
class ForecastPoint:
    hour: int
    inflow_m3s: float
    release_m3s: float
    storage_m3: float

    def as_json(self) -> dict[str, int | float]:
        return asdict(self)


def hydrograph(
    base_inflow_m3s: float, storm_multiplier: float,
    hours: int = 24,
) -> list[float]:
    if base_inflow_m3s < 0 or storm_multiplier < 0 or hours < 1 or hours > 240:
        raise ValueError("forecast parameters out of range")
    return [
        round(base_inflow_m3s * (1 + storm_multiplier
              * max(0.0, sin(pi * hour / hours)) ** 3), 3)
        for hour in range(hours)
    ]


def project_storage(
    initial_storage_m3: float, capacity_m3: float, inflows: list[float],
    release_m3s: float,
) -> list[ForecastPoint]:
    storage = initial_storage_m3
    projections = []
    for hour, inflow in enumerate(inflows):
        result = integrate_storage(
            storage, capacity_m3, inflow, release_m3s, 1.8, 3600,
        )
        storage = result.final_storage_m3
        projections.append(ForecastPoint(hour, inflow, release_m3s, storage))
    return projections
