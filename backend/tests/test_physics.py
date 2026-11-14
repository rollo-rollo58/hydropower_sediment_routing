import math

import pytest

from app.domain import ReservoirState
from app.forecast import hydrograph, project_storage
from app.hydraulics import gate_discharge, manning_flow_m3s, turbine_power_mw
from app.routing import advance_reservoir, integrate_storage, muskingum_step
from app.sediment import retention_fraction, shields_ratio, trapped_sediment_tonnes
from app.state_machine import Phase, SimulationWorkflow


def test_gate_zero_opening():
    assert gate_discharge(0, 8, 12) == 0


def test_gate_positive_flow():
    assert gate_discharge(1, 8, 12) > gate_discharge(0.5, 8, 12)


def test_turbine_power():
    assert 0 < turbine_power_mw(350, 60, 0.93) < 300


def test_manning():
    assert manning_flow_m3s(30, 2, 0.001, 0.035) > 0


def test_storage_mass_balance():
    balance = integrate_storage(1_000_000, 2_000_000, 110, 100, 0, 3600)
    assert balance.final_storage_m3 == 1_036_000


def test_storage_spills_at_capacity():
    balance = integrate_storage(1_900_000, 2_000_000, 200, 0, 0, 3600)
    assert balance.final_storage_m3 == 2_000_000
    assert balance.overflow_m3 == 620_000


def test_state_advance_bounded():
    state = ReservoirState(600, 1000, 400, 2, 1, 0.5)
    updated, _ = advance_reservoir(state, 10)
    assert math.isclose(updated.storage_m3, 610)


def test_muskingum_constant():
    assert math.isclose(muskingum_step(100, 100, 100, 3600, 0.2, 3600), 100)


def test_retention_bounds():
    assert 0 <= retention_fraction(48, 0.3) <= 1


def test_sediment_mass():
    assert trapped_sediment_tonnes(100, 1, 1000, 0.5) == 50


def test_shields_erosion_ratio():
    assert shields_ratio(9, 0.0005) > 0


def test_hydrograph_projection_length():
    projection = project_storage(1000, 100_000, hydrograph(20, 0.5, 12), 20)
    assert len(projection) == 12


def test_simulation_workflow():
    state = SimulationWorkflow().transition(Phase.CHECKED)
    assert state.transition(Phase.RUNNING).phase == Phase.RUNNING


def test_reject_invalid_workflow():
    with pytest.raises(ValueError):
        SimulationWorkflow().transition(Phase.CLOSED)
