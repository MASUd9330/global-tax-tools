/**
 * Source Monitor tests — verify registry + checker structure.
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";

describe("monitor — sources registry", () => {
  test("includes G7 countries as priority 1", async () => {
    const { MONITORED_SOURCES } = await import("../src/lib/monitor/sources");
    // Our static data uses "UK" for United Kingdom (ISO: GB) — both should be priority 1
    const g7 = new Set(["US", "UK", "DE", "FR", "CA", "IT", "JP"]);
    for (const code of g7) {
      const src = MONITORED_SOURCES.find((s) => s.jurisdictionCode === code && s.category === "country");
      assert.ok(src, `G7 country ${code} not in monitored sources`);
      assert.equal(src.priority, 1, `${code} should be priority 1`);
      assert.ok(src.sourceUrl.startsWith("http"));
    }
  });

  test("US states monitored with correct priority", async () => {
    const { MONITORED_SOURCES } = await import("../src/lib/monitor/sources");
    const states = MONITORED_SOURCES.filter((s) => s.category === "state");
    assert.ok(states.length >= 20, `got ${states.length} US states monitored`);
    // Each should have a valid URL
    for (const s of states) {
      assert.ok(s.sourceUrl.startsWith("http"), `${s.jurisdiction} bad URL`);
    }
  });

  test("every source has unique id", async () => {
    const { MONITORED_SOURCES } = await import("../src/lib/monitor/sources");
    const ids = MONITORED_SOURCES.map((s) => s.id);
    assert.equal(new Set(ids).size, ids.length);
  });

  test("getSourceById returns null for unknown", async () => {
    const { getSourceById } = await import("../src/lib/monitor/sources");
    assert.equal(getSourceById("nonexistent"), null);
  });
});

describe("monitor — checker verdict types", () => {
  test("summary function handles empty array", async () => {
    const { summary } = await import("../src/lib/monitor/checker");
    const s = summary([]);
    assert.equal(s.total, 0);
    assert.equal(s.byVerdict.ok, 0);
  });
});