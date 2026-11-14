"""Conservative hydraulic approximations; values use SI units."""
from math import isfinite, sqrt

G = 9.80665
WATER_DENSITY = 998.2


def checked(value: float, name: str, lower: float = 0.0) -> float:
    if not isfinite(value) or value < lower:
        raise ValueError(f"{name} must be finite and >= {lower}")
    return value


def gate_discharge(
    opening_m: float, width_m: float, upstream_head_m: float,
    discharge_coefficient: float = 0.62,
) -> float:
    """Orifice release with submerged-head approximation, m3/s."""
    for name, value in (("opening", opening_m), ("width", width_m),
                        ("head", upstream_head_m)):
        checked(value, name)
    if not 0 <= discharge_coefficient <= 1:
        raise ValueError("coefficient outside [0,1]")
    return discharge_coefficient * opening_m * width_m * sqrt(2 * G * upstream_head_m)


def spillway_discharge(
    crest_width_m: float, overflow_depth_m: float,
    coefficient: float = 1.7,
) -> float:
    checked(crest_width_m, "crest_width")
    checked(overflow_depth_m, "overflow_depth")
    checked(coefficient, "coefficient")
    return coefficient * crest_width_m * overflow_depth_m ** 1.5


def turbine_power_mw(
    discharge_m3s: float, gross_head_m: float, efficiency: float,
    head_loss_m: float = 0.0,
) -> float:
    checked(discharge_m3s, "discharge")
    checked(gross_head_m, "head")
    checked(head_loss_m, "head_loss")
    if not 0 <= efficiency <= 1:
        raise ValueError("efficiency outside [0,1]")
    net_head = max(0.0, gross_head_m - head_loss_m)
    return WATER_DENSITY * G * discharge_m3s * net_head * efficiency / 1_000_000


def manning_flow_m3s(
    area_m2: float, hydraulic_radius_m: float,
    slope: float, roughness_n: float,
) -> float:
    checked(area_m2, "area")
    checked(hydraulic_radius_m, "radius")
    checked(slope, "slope")
    checked(roughness_n, "roughness", 0.00000001)
    return area_m2 * hydraulic_radius_m ** (2 / 3) * sqrt(slope) / roughness_n


def hydraulic_efficiency_index(head_m: float, discharge_m3s: float) -> float:
    checked(head_m, "head")
    checked(discharge_m3s, "discharge")
    return (head_m / (head_m + 30)) * (discharge_m3s / (discharge_m3s + 60))
