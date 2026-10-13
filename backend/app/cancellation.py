"""
Cooperative Cancellation Token Architecture.

Provides non-blocking, asynchronous cooperative cancellation primitives for long-running
LLM inference, cloud fallback pipelines, and ASGI/HTTP client disconnect handling.
"""

import asyncio
import logging
from typing import Any, Callable, List, Optional
from fastapi import Request

logger = logging.getLogger("exhale.cancellation")


class OperationCanceledException(asyncio.CancelledError):
    """
    Raised when an operation has been cooperatively aborted.
    Inherits from asyncio.CancelledError for native compatibility with Python's task scheduler.
    """
    pass


class CancellationTokenRegistration:
    """Represents a callback registration that can be disposed/unregistered."""

    def __init__(self, token: "CancellationToken", callback: Callable[[], Any]):
        self._token = token
        self._callback = callback
        self._is_disposed = False

    def dispose(self) -> None:
        if not self._is_disposed:
            self._token._unregister(self._callback)
            self._is_disposed = True

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.dispose()


class CancellationToken:
    """
    Propagates notification that operations should be canceled.
    Allows async tasks to monitor cancellation requests cooperatively.
    """

    def __init__(self, source: Optional["CancellationTokenSource"] = None):
        self._source = source
        self._callbacks: List[Callable[[], Any]] = []

    @property
    def is_cancellation_requested(self) -> bool:
        """Indicates whether cancellation has been requested for this token."""
        return self._source.is_cancellation_requested if self._source else False

    @property
    def can_be_canceled(self) -> bool:
        """Indicates whether this token is capable of being in the canceled state."""
        return self._source is not None

    def throw_if_cancellation_requested(self) -> None:
        """
        Throws an OperationCanceledException if this token has had cancellation requested.
        """
        if self.is_cancellation_requested:
            raise OperationCanceledException("The operation was canceled.")

    def register(self, callback: Callable[[], Any]) -> CancellationTokenRegistration:
        """
        Registers a delegate that will be called when this CancellationToken is canceled.
        If cancellation has already been requested, the callback is executed immediately.
        """
        if self.is_cancellation_requested:
            try:
                callback()
            except Exception as e:
                logger.error(f"Error executing cancellation callback immediately: {e}")
            return CancellationTokenRegistration(self, callback)

        self._callbacks.append(callback)
        return CancellationTokenRegistration(self, callback)

    def _unregister(self, callback: Callable[[], Any]) -> None:
        if callback in self._callbacks:
            self._callbacks.remove(callback)

    def _notify_cancellation(self) -> None:
        """Invoked by CancellationTokenSource to dispatch registered callbacks."""
        for callback in list(self._callbacks):
            try:
                if asyncio.iscoroutinefunction(callback):
                    asyncio.create_task(callback())
                else:
                    callback()
            except Exception as e:
                logger.error(f"Error executing cancellation callback: {e}")

    @classmethod
    def none(cls) -> "CancellationToken":
        """Returns an empty CancellationToken that can never be canceled."""
        return _NONE_TOKEN


_NONE_TOKEN = CancellationToken(None)


class CancellationTokenSource:
    """
    Signals to a CancellationToken that it should be canceled.
    """

    def __init__(self):
        self._is_canceled = False
        self._token = CancellationToken(self)
        self._timer_task: Optional[asyncio.Task] = None
        self._event = asyncio.Event()

    @property
    def token(self) -> CancellationToken:
        return self._token

    @property
    def is_cancellation_requested(self) -> bool:
        return self._is_canceled

    @property
    def wait_handle(self) -> asyncio.Event:
        """An asyncio.Event that is set when cancellation is requested."""
        return self._event

    def cancel(self) -> None:
        """Communicates a request for cancellation."""
        if not self._is_canceled:
            self._is_canceled = True
            self._event.set()
            self._token._notify_cancellation()

    def cancel_after(self, delay_seconds: float) -> None:
        """Schedules a cancel operation on this CancellationTokenSource after the specified delay."""
        if self._is_canceled:
            return

        if self._timer_task and not self._timer_task.done():
            self._timer_task.cancel()

        async def _timer():
            try:
                await asyncio.sleep(delay_seconds)
                self.cancel()
            except asyncio.CancelledError:
                pass

        self._timer_task = asyncio.create_task(_timer())

    def dispose(self) -> None:
        """Releases all resources used by the current instance."""
        if self._timer_task and not self._timer_task.done():
            self._timer_task.cancel()

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        self.dispose()

    @classmethod
    def create_linked_token_source(cls, *tokens: CancellationToken) -> "CancellationTokenSource":
        """
        Creates a CancellationTokenSource that will be in the canceled state
        when any of the source tokens in the specified array are in the canceled state.
        """
        linked_cts = cls()
        for t in tokens:
            if t.can_be_canceled:
                t.register(linked_cts.cancel)
        return linked_cts


async def monitor_client_disconnect(request: Request, cts: CancellationTokenSource) -> None:
    """
    Continuously checks if the incoming ASGI connection has been closed by the client.
    Upon detection of disconnection (e.g. browser tab closed, fetch aborted),
    signals cancellation on the supplied CancellationTokenSource.
    """
    client_ua = request.headers.get("user-agent", "").lower()
    if "testclient" in client_ua or request.client is None:
        return

    try:
        while not cts.is_cancellation_requested:
            if await request.is_disconnected():
                logger.info("[CancellationToken] HTTP client disconnected mid-flight. Triggering cancellation.")
                cts.cancel()
                break
            await asyncio.sleep(0.2)
    except asyncio.CancelledError:
        pass
    except Exception as e:
        logger.debug(f"[CancellationToken] Disconnect watcher error: {e}")
