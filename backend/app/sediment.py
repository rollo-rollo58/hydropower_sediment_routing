"""Simplified particulate transport models for sensitivity analysis."""
from math import exp, isfinite

SEDIMENT_DENSITY = 2650.0
WATER_DENSITY = 998.2
G = 9.80665


def retention_fraction(residence_hours: float, grain_millimetres: float) -> float:
    if not isfinite(residence_hours) or residence_hours < 0:
        raise ValueError("residence_hours is invalid")
    if not isfinite(grain_millimetres) or grain_millimetres < 0:
        raise ValueError("grain_millimetres is invalid")
    settling_factor = grain_millimetres / (grain_millimetres + 0.25)
    return min(0.99, max(0.0, 1 - exp(-residence_hours * settling_factor / 24)))


def trapped_sediment_tonnes(
    inflow_m3s: float, concentration_kg_m3: float,
    elapsed_seconds: float, retention: float,
) -> float:
    if min(inflow_m3s, concentration_kg_m3, elapsed_seconds) < 0:
        raise ValueError("negative flow or concentration or interval")
    if not 0 <= retention <= 1:
        raise ValueError("retention outside [0,1]")
    return inflow_m3s * concentration_kg_m3 * elapsed_seconds * retention / 1000


def shields_ratio(
    shear_stress_pa: float, grain_m: float, critical_shields: float = 0.047,
) -> float:
    if shear_stress_pa < 0 or grain_m <= 0 or critical_shields <= 0:
        raise ValueError("invalid sediment transport parameters")
    denominator = (SEDIMENT_DENSITY - WATER_DENSITY) * G * grain_m
    return (shear_stress_pa / denominator) / critical_shields


def sediment_load_tonnes_day(flow_m3s: float, concentration_kg_m3: float) -> float:
    if flow_m3s < 0 or concentration_kg_m3 < 0:
        raise ValueError("flow and concentration must be nonnegative")
    return flow_m3s * concentration_kg_m3 * 86400 / 1000
