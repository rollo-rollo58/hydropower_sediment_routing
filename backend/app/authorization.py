"""Demonstration RBAC policy for read-only research simulator actions."""
from enum import StrEnum


class Role(StrEnum):
    VIEWER = "viewer"
    ANALYST = "analyst"
    REVIEWER = "reviewer"


GRANTS = {
    Role.VIEWER: frozenset({"dashboard:read", "events:read"}),
    Role.ANALYST: frozenset({
        "dashboard:read", "events:read", "simulation:create", "scenarios:read",
    }),
    Role.REVIEWER: frozenset({
        "dashboard:read", "events:read", "simulation:create",
        "scenarios:read", "simulation:review",
    }),
}


def can(role: Role, permission: str) -> bool:
    return permission in GRANTS[role]


def require(role: Role, permission: str) -> None:
    if not can(role, permission):
        raise PermissionError(f"role {role} cannot perform {permission}")
