from datetime import datetime, timezone
from threading import Lock
from uuid import uuid4


class InMemoryPlanStore:
    def __init__(self) -> None:
        self._sessions: dict[str, dict] = {}
        self._lock = Lock()

    def save_plan(self, request, plan, session_id=None):
        resolved_session_id = session_id or str(uuid4())
        created_at = datetime.now(timezone.utc).isoformat()

        record = {
            "sessionId": resolved_session_id,
            "createdAt": created_at,
            "checkIn": request,
            "plan": plan,
        }

        with self._lock:
            self._sessions[resolved_session_id] = record

        return record

    def get_session(self, session_id: str):
        with self._lock:
            return self._sessions.get(session_id)

    def delete_session(self, session_id: str):
        with self._lock:
            return self._sessions.pop(session_id, None) is not None
