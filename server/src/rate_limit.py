"""
Fixed-window rate limiting for the unauthenticated endpoints.

There was none anywhere in the application, which left three things open:

* `POST /api/auth/token` accepted unlimited password guesses. Every attempt runs
  bcrypt, so it doubled as a CPU/cost amplifier on a per-GB-second platform.
* `POST /api/auth/forgot-password/request` sent a real email each time and reset
  the OTP attempt counter, so the 5-attempt cap could be refreshed indefinitely
  (200k rounds covers the whole 6-digit space) while mail-bombing the victim.
* `POST /register/upload-csv` accepted unbounded uploads.

Counting lives in Redis when Upstash is configured, because the API runs as
serverless functions: an in-process counter is per-instance and resets on every
cold start, so an attacker spreading requests across instances would barely be
limited. The in-process dict is a fallback for local runs and for when Redis is
unreachable.

Deliberately fails open: if the limiter itself breaks, users can still log in.
The alternative is a Redis outage locking everyone out of the portal.
"""

import time
from typing import Optional

from fastapi import HTTPException, Request, status

from src import logger
from src.redis import redis


# key -> (count, window_start_monotonic). Only used when Redis is unavailable.
_local_counters: dict[str, tuple[int, float]] = {}


def client_identifier(request: Request) -> str:
    """
    Best-effort caller identity.

    Vercel terminates TLS upstream, so request.client.host is the proxy. The
    left-most X-Forwarded-For entry is the original caller. It is spoofable in
    general, but on a platform that overwrites the header at the edge it is the
    best signal available - and an attacker who rotates it still burns the
    per-account limits applied alongside this one.
    """
    forwarded = request.headers.get("x-forwarded-for", "")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def _hit_redis(key: str, window_seconds: int) -> Optional[int]:
    """Increment in Redis, returning the new count, or None if unavailable."""
    if redis is None:
        return None
    try:
        count = redis.incr(key)
        if count == 1:
            # First request in this window - start the clock.
            redis.expire(key, window_seconds)
        return count
    except Exception as exc:
        logger.warning("Rate limit backend failed for %s: %s", key, exc)
        return None


def _hit_local(key: str, window_seconds: int) -> int:
    now = time.monotonic()
    count, started = _local_counters.get(key, (0, now))
    if now - started >= window_seconds:
        count, started = 0, now
    count += 1
    _local_counters[key] = (count, started)
    return count


def enforce(
    bucket: str,
    identifier: str,
    limit: int,
    window_seconds: int,
    message: str = "Too many requests. Please try again later.",
) -> None:
    """
    Count one request and raise 429 once `limit` is exceeded in the window.

    Args:
        bucket: logical group, e.g. "login" or "otp-request".
        identifier: what to count against - a client IP or an email address.
        limit: allowed requests per window.
        window_seconds: window length in seconds.
        message: client-facing detail.
    """
    key = f"rl:{bucket}:{identifier}"

    count = _hit_redis(key, window_seconds)
    if count is None:
        count = _hit_local(key, window_seconds)

    if count > limit:
        logger.warning(
            "Rate limit exceeded: bucket=%s identifier=%s count=%s",
            bucket,
            identifier,
            count,
        )
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=message,
            headers={"Retry-After": str(window_seconds)},
        )
