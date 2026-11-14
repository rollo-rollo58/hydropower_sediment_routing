"""Dependency-isolated job payload validation for optional RQ workers."""
from dataclasses import asdict, dataclass

from .forecast import hydrograph, project_storage


@dataclass(frozen=True)
class ForecastJob:
    initial_storage_m3: float
    capacity_m3: float
    base_inflow_m3s: float
    storm_multiplier: float
    release_m3s: float
    hours: int

    def run(self) -> list[dict[str, int | float]]:
        flows = hydrograph(self.base_inflow_m3s, self.storm_multiplier, self.hours)
        return [asdict(p) for p in project_storage(
            self.initial_storage_m3, self.capacity_m3, flows, self.release_m3s,
        )]


def execute_forecast(payload: dict) -> list[dict[str, int | float]]:
    job = ForecastJob(**payload)
    return job.run()
