import asyncio
import pytest
from app.cancellation import (
    CancellationToken,
    CancellationTokenSource,
    OperationCanceledException,
)
from app.generator import generate_grounding_mission


@pytest.mark.anyio
async def test_cancellation_token_basic_cancellation():
    cts = CancellationTokenSource()
    token = cts.token

    assert not cts.is_cancellation_requested
    assert not token.is_cancellation_requested
    assert token.can_be_canceled

    # Should not raise
    token.throw_if_cancellation_requested()

    cts.cancel()
    assert cts.is_cancellation_requested
    assert token.is_cancellation_requested

    with pytest.raises(OperationCanceledException):
        token.throw_if_cancellation_requested()


@pytest.mark.anyio
async def test_cancellation_token_callbacks():
    cts = CancellationTokenSource()
    called = []

    reg = cts.token.register(lambda: called.append("first"))
    cts.cancel()
    assert called == ["first"]

    # Registering after cancel runs immediately
    cts.token.register(lambda: called.append("second"))
    assert called == ["first", "second"]


@pytest.mark.anyio
async def test_cancellation_token_registration_dispose():
    cts = CancellationTokenSource()
    called = []

    reg = cts.token.register(lambda: called.append("disposed"))
    reg.dispose()

    cts.cancel()
    assert called == []


@pytest.mark.anyio
async def test_cancellation_token_cancel_after():
    cts = CancellationTokenSource()
    cts.cancel_after(0.05)

    assert not cts.is_cancellation_requested
    await asyncio.sleep(0.08)
    assert cts.is_cancellation_requested


@pytest.mark.anyio
async def test_linked_token_source():
    cts1 = CancellationTokenSource()
    cts2 = CancellationTokenSource()

    linked = CancellationTokenSource.create_linked_token_source(cts1.token, cts2.token)
    assert not linked.is_cancellation_requested

    cts2.cancel()
    assert linked.is_cancellation_requested


@pytest.mark.anyio
async def test_generator_immediate_abort_on_canceled_token():
    cts = CancellationTokenSource()
    cts.cancel()

    with pytest.raises(OperationCanceledException):
        await generate_grounding_mission(
            brain_dump="Severe panic and racing thoughts",
            cancellation_token=cts.token,
        )


@pytest.mark.anyio
async def test_token_none_never_cancels():
    token = CancellationToken.none()
    assert not token.is_cancellation_requested
    assert not token.can_be_canceled
    token.throw_if_cancellation_requested()
