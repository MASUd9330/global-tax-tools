/**
 * Pro keys tests — verify key generation + validation.
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { generateProKey, validateProKey, PLAN_LIMITS, PLAN_PRICING } from "../src/lib/api/pro-keys";

describe("Pro keys — generation", () => {
  test("generates key with correct prefix", () => {
    const k = generateProKey("pro", "test@example.com");
    assert.match(k.key, /^tr_pro_[a-f0-9]{24}$/);
    assert.equal(k.plan, "pro");
    assert.equal(k.ownerEmail, "test@example.com");
    assert.equal(k.active, true);
  });

  test("different emails generate different keys", () => {
    const a = generateProKey("pro", "a@example.com");
    const b = generateProKey("pro", "b@example.com");
    assert.notEqual(a.key, b.key);
  });

  test("team plan gets team prefix", () => {
    const k = generateProKey("team", "team@example.com");
    assert.match(k.key, /^tr_team_[a-f0-9]{24}$/);
  });
});

describe("Pro keys — validation", () => {
  test("returns null when no env var set", () => {
    const prev = process.env.PRO_KEYS;
    delete process.env.PRO_KEYS;
    assert.equal(validateProKey("tr_pro_anything"), null);
    if (prev) process.env.PRO_KEYS = prev;
  });

  test("returns null for empty/null key", () => {
    assert.equal(validateProKey(""), null);
    assert.equal(validateProKey(null), null);
    assert.equal(validateProKey(undefined), null);
  });

  test("returns ProKey for valid env-var key", () => {
    process.env.PRO_KEYS = "tr_pro_abc123|pro|user@example.com";
    const k = validateProKey("tr_pro_abc123");
    assert.ok(k);
    assert.equal(k!.plan, "pro");
    assert.equal(k!.ownerEmail, "user@example.com");
    delete process.env.PRO_KEYS;
  });

  test("returns null for non-matching key", () => {
    process.env.PRO_KEYS = "tr_pro_abc|pro|user@example.com";
    assert.equal(validateProKey("tr_pro_xyz"), null);
    delete process.env.PRO_KEYS;
  });

  test("falls back to file when env not set", () => {
    const prev = process.env.PRO_KEYS;
    delete process.env.PRO_KEYS;
    const fs = require("node:fs") as typeof import("node:fs");
    const path = require("node:path") as typeof import("node:path");
    const tmpPath = path.join(process.cwd(), ".pro-keys-test.json");
    fs.writeFileSync(
      tmpPath,
      JSON.stringify([
        {
          key: "tr_pro_filetest",
          plan: "pro",
          ownerEmail: "file@example.com",
          createdAt: new Date().toISOString(),
          expiresAt: null,
          active: true,
        },
      ])
    );
    process.env.PRO_KEYS_FILE = tmpPath;
    const k = validateProKey("tr_pro_filetest");
    assert.ok(k);
    assert.equal(k!.ownerEmail, "file@example.com");
    fs.unlinkSync(tmpPath);
    delete process.env.PRO_KEYS_FILE;
    if (prev) process.env.PRO_KEYS = prev;
  });

  test("rejects expired keys from file", () => {
    const fs = require("node:fs") as typeof import("node:fs");
    const path = require("node:path") as typeof import("node:path");
    const tmpPath = path.join(process.cwd(), ".pro-keys-expired.json");
    fs.writeFileSync(
      tmpPath,
      JSON.stringify([
        {
          key: "tr_pro_expired",
          plan: "pro",
          ownerEmail: "x@example.com",
          createdAt: "2020-01-01T00:00:00Z",
          expiresAt: "2020-12-31T00:00:00Z",
          active: true,
        },
      ])
    );
    process.env.PRO_KEYS_FILE = tmpPath;
    assert.equal(validateProKey("tr_pro_expired"), null);
    fs.unlinkSync(tmpPath);
    delete process.env.PRO_KEYS_FILE;
  });

  test("rejects inactive keys from file", () => {
    const fs = require("node:fs") as typeof import("node:fs");
    const path = require("node:path") as typeof import("node:path");
    const tmpPath = path.join(process.cwd(), ".pro-keys-inactive.json");
    fs.writeFileSync(
      tmpPath,
      JSON.stringify([
        {
          key: "tr_pro_inactive",
          plan: "pro",
          ownerEmail: "x@example.com",
          createdAt: new Date().toISOString(),
          expiresAt: null,
          active: false,
        },
      ])
    );
    process.env.PRO_KEYS_FILE = tmpPath;
    assert.equal(validateProKey("tr_pro_inactive"), null);
    fs.unlinkSync(tmpPath);
    delete process.env.PRO_KEYS_FILE;
  });
});

describe("Pro keys — plans", () => {
  test("PLAN_LIMITS has all 3 tiers", () => {
    assert.ok(PLAN_LIMITS.free);
    assert.ok(PLAN_LIMITS.pro);
    assert.ok(PLAN_LIMITS.team);
    assert.ok(PLAN_LIMITS.pro.minute > PLAN_LIMITS.free.minute);
    assert.ok(PLAN_LIMITS.team.minute > PLAN_LIMITS.pro.minute);
  });

  test("PLAN_PRICING has USD + features for each tier", () => {
    for (const tier of ["free", "pro", "team"] as const) {
      assert.ok(PLAN_PRICING[tier].usd >= 0);
      assert.ok(PLAN_PRICING[tier].features.length > 0);
    }
  });
});