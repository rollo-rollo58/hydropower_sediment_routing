"""Scenario catalogue dispatch with strict whitelist and bounded indexes."""
from functools import lru_cache
from importlib import import_module

from app.domain import ScenarioResult

AVAILABLE = frozenset({"monsoon", "flood", "sediment"})


@lru_cache(maxsize=3)
def _module(name: str):
    if name not in AVAILABLE:
        raise KeyError(f"unknown scenario family: {name}")
    return import_module(f"app.scenarios.{name}")


def evaluate_scenario(kind: str, index: int) -> ScenarioResult:
    if not isinstance(index, int) or not 0 <= index < 1700:
        raise ValueError("scenario index must be 0..1699")
    function = getattr(_module(kind), f"evaluate_{kind}_{index:04d}")
    return function()
