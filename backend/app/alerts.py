"""Synthetic watch thresholds for human review, not automated control."""
from dataclasses import asdict, dataclass


@dataclass(frozen=True)
class Alert:
    code: str
    severity: str
    detail: str

    def as_json(self) -> dict[str, str]:
        return asdict(self)


def assess(level_m: float, concentration_kg_m3: float, inflow_m3s: float) -> list[Alert]:
    alerts = []
    if level_m > 476:
        alerts.append(Alert("HIGH_POOL", "warning", "Reservoir pool near upper guide"))
    if concentration_kg_m3 > 2.5:
        alerts.append(Alert("SEDIMENT", "watch", "Elevated suspended solids"))
    if inflow_m3s > 2600:
        alerts.append(Alert("INFLOW", "warning", "High illustrative inflow"))
    if not alerts:
        alerts.append(Alert("NORMAL", "info", "No synthetic thresholds exceeded"))
    return alerts
