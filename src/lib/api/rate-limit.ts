/**
 * API rate limiting — token bucket per IP.
 *
 * Per Vercel serverless constraints:
 *   - Module-level state survives warm starts, resets on cold start
 *   - Sufficient for protection against burst abuse; not for persistent limits
 *
 * For persistent rate limiting across deploys, swap to Vercel KV or Upstash.
 *
 * Limits (free, no API key):
 *   - 60 requests / minute per IP
 *   - 1000 requests / hour per IP
 *   - 10000 requests / day per IP
 *
 * Limits with API key (TR_PRO_KEY env var):
 *   - 1000 requests / minute per key
 *   - 50000 requests / hour per key
 */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

interface Bucket {
  tokens: number;
  lastRefill: number;
}

interface LimitState {
  perMinute: Bucket;
  perHour: Bucket;
  perDay: Bucket;
}

const buckets = new Map<string, LimitState>();

// Auto-cleanup stale buckets every 5 minutes to avoid memory leak
let cleanupTimer: ReturnType<typeof setInterval> | null = null;
if (typeof setInterval !== "undefined" && !cleanupTimer) {
  cleanupTimer = setInterval(() => {
    const now = Date.now();
    const STALE_MS = 60 * 60 * 1000; // 1 hour
    for (const [key, state] of buckets.entries()) {
      if (now - state.perMinute.lastRefill > STALE_MS && now - state.perHour.lastRefill > STALE_MS) {
        buckets.delete(key);
      }
    }
  }, 5 * 60 * 1000);
  // Don't keep process alive for this timer
  if (typeof cleanupTimer.unref === "function") cleanupTimer.unref();
}

function refill(bucket: Bucket, rate: number, window: number, now: number) {
  const elapsed = now - bucket.lastRefill;
  const refillAmount = (elapsed / window) * rate;
  bucket.tokens = Math.min(rate, bucket.tokens + refillAmount);
  bucket.lastRefill = now;
}

interface RateLimit {
  allowed: boolean;
  remaining: { minute: number; hour: number; day: number };
  resetIn: { minute: number; hour: number; day: number };
  limit: { minute: number; hour: number; day: number };
}

const FREE_LIMITS = { minute: 60, hour: 1000, day: 10000 };
const KEYED_LIMITS = { minute: 1000, hour: 50000, day: 200000 };

export function checkRateLimit(identifier: string, isApiKey: boolean = false): RateLimit {
  const now = Date.now();
  const limits = isApiKey ? KEYED_LIMITS : FREE_LIMITS;
  const MINUTE = 60 * 1000;
  const HOUR = 60 * MINUTE;
  const DAY = 24 * HOUR;

  let state = buckets.get(identifier);
  if (!state) {
    state = {
      perMinute: { tokens: limits.minute, lastRefill: now },
      perHour: { tokens: limits.hour, lastRefill: now },
      perDay: { tokens: limits.day, lastRefill: now },
    };
    buckets.set(identifier, state);
  }

  refill(state.perMinute, limits.minute, MINUTE, now);
  refill(state.perHour, limits.hour, HOUR, now);
  refill(state.perDay, limits.day, DAY, now);

  const minAllowed = state.perMinute.tokens >= 1;
  const hourAllowed = state.perHour.tokens >= 1;
  const dayAllowed = state.perDay.tokens >= 1;
  const allowed = minAllowed && hourAllowed && dayAllowed;

  if (allowed) {
    state.perMinute.tokens -= 1;
    state.perHour.tokens -= 1;
    state.perDay.tokens -= 1;
  }

  return {
    allowed,
    remaining: {
      minute: Math.floor(state.perMinute.tokens),
      hour: Math.floor(state.perHour.tokens),
      day: Math.floor(state.perDay.tokens),
    },
    resetIn: {
      minute: Math.ceil((MINUTE - (now - state.perMinute.lastRefill)) / 1000),
      hour: Math.ceil((HOUR - (now - state.perHour.lastRefill)) / 1000),
      day: Math.ceil((DAY - (now - state.perDay.lastRefill)) / 1000),
    },
    limit: limits,
  };
}

export function getClientIdentifier(req: NextRequest): string {
  // Prefer API key if provided (Bearer or X-API-Key)
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return `key:${authHeader.slice(7)}`;
  }
  const apiKey = req.headers.get("x-api-key");
  if (apiKey) {
    return `key:${apiKey}`;
  }

  // Fall back to IP (Vercel sets x-forwarded-for + x-real-ip)
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    // First IP in chain is the client
    return `ip:${xff.split(",")[0].trim()}`;
  }
  const xri = req.headers.get("x-real-ip");
  if (xri) return `ip:${xri}`;

  return `ip:unknown`;
}

export function rateLimitHeaders(rl: RateLimit): Record<string, string> {
  return {
    "X-RateLimit-Limit-Minute": rl.limit.minute.toString(),
    "X-RateLimit-Limit-Hour": rl.limit.hour.toString(),
    "X-RateLimit-Limit-Day": rl.limit.day.toString(),
    "X-RateLimit-Remaining-Minute": rl.remaining.minute.toString(),
    "X-RateLimit-Remaining-Hour": rl.remaining.hour.toString(),
    "X-RateLimit-Remaining-Day": rl.remaining.day.toString(),
    "X-RateLimit-Reset-Second": rl.resetIn.minute.toString(),
  };
}

export function rateLimitResponse(rl: RateLimit): NextResponse {
  const headers = rateLimitHeaders(rl);
  headers["Retry-After"] = rl.resetIn.minute.toString();
  return NextResponse.json(
    {
      error: "Rate limit exceeded",
      message: `Too many requests. Retry after ${rl.resetIn.minute} seconds.`,
      limits: rl.limit,
    },
    { status: 429, headers }
  );
}

// Helper: extract API key from request + validate
export function isValidApiKey(req: NextRequest): boolean {
  const expected = process.env.TR_PRO_KEY;
  if (!expected) return false; // Feature disabled

  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ") && authHeader.slice(7) === expected) {
    return true;
  }
  const apiKey = req.headers.get("x-api-key");
  if (apiKey && apiKey === expected) {
    return true;
  }
  return false;
}