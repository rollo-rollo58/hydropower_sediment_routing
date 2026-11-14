"""Explicit, reversible simulation workflow transitions."""
from dataclasses import dataclass
from enum import StrEnum


class Phase(StrEnum):
    DRAFT = "draft"
    CHECKED = "checked"
    RUNNING = "running"
    REVIEW = "review"
    CLOSED = "closed"


ALLOWED = {
    Phase.DRAFT: frozenset({Phase.CHECKED}),
    Phase.CHECKED: frozenset({Phase.DRAFT, Phase.RUNNING}),
    Phase.RUNNING: frozenset({Phase.REVIEW}),
    Phase.REVIEW: frozenset({Phase.CHECKED, Phase.CLOSED}),
    Phase.CLOSED: frozenset(),
}


@dataclass(frozen=True)
class SimulationWorkflow:
    phase: Phase = Phase.DRAFT
    revision: int = 0

    def transition(self, proposed: Phase) -> "SimulationWorkflow":
        if proposed not in ALLOWED[self.phase]:
            raise ValueError(f"invalid transition: {self.phase} -> {proposed}")
        return SimulationWorkflow(proposed, self.revision + 1)
