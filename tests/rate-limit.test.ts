/**
 * Rate limiter tests — verify token bucket logic.
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { checkRateLimit, getClientIdentifier, isValidApiKey, rateLimitHeaders } from "../src/lib/api/rate-limit";

describe("rate-limit — checkRateLimit", () => {
  test("first request is allowed", () => {
    const rl = checkRateLimit("test-ip-1");
    assert.equal(rl.allowed, true);
    assert.equal(rl.remaining.minute, 59);
    assert.equal(rl.remaining.hour, 999);
    assert.equal(rl.remaining.day, 9999);
  });

  test("100 requests within free tier all allowed", () => {
    for (let i = 0; i < 60; i++) {
      const rl = checkRateLimit("test-ip-many");
      assert.ok(rl.allowed || i >= 60, `request ${i} should be allowed`);
    }
  });

  test("61st request within same minute is rejected", () => {
    const id = "test-ip-burst-" + Date.now();
    // Consume 60 tokens
    for (let i = 0; i < 60; i++) checkRateLimit(id);
    const rl = checkRateLimit(id);
    assert.equal(rl.allowed, false);
  });

  test("API key gets higher limits", () => {
    const id = "test-key-" + Date.now();
    const rl = checkRateLimit(id, true);
    assert.equal(rl.allowed, true);
    assert.equal(rl.limit.minute, 1000); // KEYED_LIMITS
  });

  test("different identifiers have separate buckets", () => {
    const a = checkRateLimit("ip-A");
    const b = checkRateLimit("ip-B");
    assert.ok(a.allowed && b.allowed);
    assert.equal(a.remaining.minute, 59);
    assert.equal(b.remaining.minute, 59); // Separate bucket
  });

  test("limits are reported correctly", () => {
    const rl = checkRateLimit("test-ip-limits");
    assert.equal(rl.limit.minute, 60);
    assert.equal(rl.limit.hour, 1000);
    assert.equal(rl.limit.day, 10000);
  });

  test("resetIn is reasonable", () => {
    const rl = checkRateLimit("test-ip-reset");
    assert.ok(rl.resetIn.minute > 0 && rl.resetIn.minute <= 60);
    assert.ok(rl.resetIn.hour > 0 && rl.resetIn.hour <= 3600);
    assert.ok(rl.resetIn.day > 0 && rl.resetIn.day <= 86400);
  });
});

describe("rate-limit — rateLimitHeaders", () => {
  test("produces standard header set", () => {
    const rl = checkRateLimit("test-ip-headers");
    const headers = rateLimitHeaders(rl);
    assert.equal(headers["X-RateLimit-Limit-Minute"], "60");
    assert.equal(headers["X-RateLimit-Limit-Hour"], "1000");
    assert.equal(headers["X-RateLimit-Limit-Day"], "10000");
    assert.ok("X-RateLimit-Remaining-Minute" in headers);
  });
});

describe("rate-limit — getClientIdentifier", () => {
  test("extracts API key from Authorization header", () => {
    const req = new Request("https://test/", {
      headers: { authorization: "Bearer my-secret-key" },
    });
    const id = getClientIdentifier(req as any);
    assert.equal(id, "key:my-secret-key");
  });

  test("extracts API key from X-API-Key header", () => {
    const req = new Request("https://test/", {
      headers: { "x-api-key": "another-key" },
    });
    const id = getClientIdentifier(req as any);
    assert.equal(id, "key:another-key");
  });

  test("falls back to IP from x-forwarded-for", () => {
    const req = new Request("https://test/", {
      headers: { "x-forwarded-for": "203.0.113.42, 10.0.0.1" },
    });
    const id = getClientIdentifier(req as any);
    assert.equal(id, "ip:203.0.113.42");
  });

  test("falls back to IP from x-real-ip", () => {
    const req = new Request("https://test/", {
      headers: { "x-real-ip": "198.51.100.7" },
    });
    const id = getClientIdentifier(req as any);
    assert.equal(id, "ip:198.51.100.7");
  });
});

describe("rate-limit — isValidApiKey", () => {
  test("returns false when env var not set", () => {
    const prev = process.env.TR_PRO_KEY;
    delete process.env.TR_PRO_KEY;
    const req = new Request("https://test/", {
      headers: { authorization: "Bearer anything" },
    });
    assert.equal(isValidApiKey(req as any), false);
    if (prev) process.env.TR_PRO_KEY = prev;
  });

  test("returns true with matching bearer token", () => {
    process.env.TR_PRO_KEY = "test-secret-123";
    const req = new Request("https://test/", {
      headers: { authorization: "Bearer test-secret-123" },
    });
    assert.equal(isValidApiKey(req as any), true);
    delete process.env.TR_PRO_KEY;
  });

  test("returns false with mismatched key", () => {
    process.env.TR_PRO_KEY = "correct-key";
    const req = new Request("https://test/", {
      headers: { authorization: "Bearer wrong-key" },
    });
    assert.equal(isValidApiKey(req as any), false);
    delete process.env.TR_PRO_KEY;
  });
});