"""Immutable, unit-explicit types for the reservoir simulation domain."""
from dataclasses import asdict, dataclass
from math import isfinite


def finite_nonnegative(value: float, name: str) -> float:
    if not isfinite(value) or value < 0:
        raise ValueError(f"{name} must be finite and nonnegative")
    return value


@dataclass(frozen=True)
class ReservoirState:
    storage_m3: float
    capacity_m3: float
    level_m: float
    inflow_m3s: float
    outflow_m3s: float
    sediment_kg_m3: float

    def validate(self) -> "ReservoirState":
        for key in ("storage_m3", "capacity_m3", "inflow_m3s",
                    "outflow_m3s", "sediment_kg_m3"):
            finite_nonnegative(getattr(self, key), key)
        if not 0 <= self.storage_m3 <= self.capacity_m3:
            raise ValueError("storage_m3 outside reservoir capacity")
        if self.capacity_m3 == 0:
            raise ValueError("capacity_m3 cannot be zero")
        return self

    def as_json(self) -> dict[str, float]:
        return asdict(self)


@dataclass(frozen=True)
class ScenarioResult:
    scenario_id: str
    season: str
    inflow_m3s: float
    release_m3s: float
    reservoir_level_m: float
    sediment_concentration_kg_m3: float
    predicted_power_mw: float
    drawdown_m3: float
    flood_exposure_index: float
    sediment_deposition_tonnes: float
    alert_code: str

    def as_json(self) -> dict[str, str | float]:
        return asdict(self)
