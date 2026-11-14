from math import isfinite

import pytest

from app.scenarios import evaluate_scenario


@pytest.mark.parametrize("kind", ["monsoon", "flood", "sediment"])
@pytest.mark.parametrize("index", [0, 19, 318, 898, 1699])
def test_generated_scenario_contract(kind: str, index: int):
    result = evaluate_scenario(kind, index)
    assert result.scenario_id == f"{kind.upper()}-{index:04d}"
    assert result.inflow_m3s >= 0
    assert result.release_m3s >= 0
    assert isfinite(result.predicted_power_mw)
    assert result.predicted_power_mw >= 0
    assert result.sediment_deposition_tonnes >= 0
    assert 0 <= result.flood_exposure_index <= 1


def test_reject_invalid_scenario_kind():
    with pytest.raises(KeyError):
        evaluate_scenario("unknown", 0)


def test_reject_out_of_bounds_index():
    with pytest.raises(ValueError):
        evaluate_scenario("monsoon", 1700)
