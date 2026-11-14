"""Thread-safe in-process demo event repository; no hidden live connections."""
from collections import deque
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from threading import RLock
from uuid import uuid4


@dataclass(frozen=True)
class Event:
    event_id: str
    category: str
    message: str
    timestamp: str

    def as_json(self) -> dict[str, str]:
        return asdict(self)


class EventRepository:
    def __init__(self, maximum: int = 200):
        self._items: deque[Event] = deque(maxlen=maximum)
        self._lock = RLock()

    def append(self, category: str, message: str) -> Event:
        event = Event(
            event_id=str(uuid4()),
            category=category,
            message=message,
            timestamp=datetime.now(timezone.utc).isoformat(),
        )
        with self._lock:
            self._items.appendleft(event)
        return event

    def recent(self, limit: int = 20) -> list[Event]:
        with self._lock:
            return list(self._items)[:max(0, min(limit, 100))]


events = EventRepository()
