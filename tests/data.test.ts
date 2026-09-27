/**
 * Static data integrity tests.
 * Verifies all countries/states are well-formed.
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { COUNTRIES } from "../src/data/static/countries";
import { US_STATES } from "../src/data/static/states";

describe("static countries — required fields", () => {
  test("at least 40 countries", () => {
    assert.ok(COUNTRIES.length >= 40, `got ${COUNTRIES.length}, expected >=40`);
  });

  test("every country has unique code", () => {
    const codes = COUNTRIES.map((c) => c.code);
    assert.equal(new Set(codes).size, codes.length, "duplicate codes");
  });

  test("every country has unique slug", () => {
    const slugs = COUNTRIES.map((c) => c.slug);
    assert.equal(new Set(slugs).size, slugs.length, "duplicate slugs");
  });

  test("every country has 2-letter code", () => {
    for (const c of COUNTRIES) {
      assert.match(c.code, /^[A-Z]{2}$/, `${c.code} not 2-letter`);
    }
  });

  test("every country has 2025 brackets or null taxRule", () => {
    for (const c of COUNTRIES) {
      if (c.taxRule === null) {
        // No-tax countries (e.g. UAE) — no brackets needed
        assert.equal(c.taxSystem, "none", `${c.code} has no rule but system is not "none"`);
      } else {
        assert.equal(c.taxRule.year, 2025, `${c.code} taxRule year not 2025`);
        assert.ok(c.taxRule.brackets.length > 0, `${c.code} has empty brackets`);
        // Brackets must be sorted by lowerBound ascending
        for (let i = 1; i < c.taxRule.brackets.length; i++) {
          assert.ok(
            c.taxRule.brackets[i].lowerBound >= c.taxRule.brackets[i - 1].lowerBound,
            `${c.code} brackets not sorted`
          );
        }
        // Rates must be in [0, 1]
        for (const b of c.taxRule.brackets) {
          assert.ok(b.rate >= 0 && b.rate <= 1, `${c.code} bracket rate ${b.rate} out of range`);
        }
        // First bracket must start at 0
        assert.equal(c.taxRule.brackets[0].lowerBound, 0, `${c.code} first bracket not 0`);
        // Last bracket must be unbounded (or close to it)
        const last = c.taxRule.brackets[c.taxRule.brackets.length - 1];
        assert.equal(last.upperBound, null, `${c.code} last bracket not ∞`);
      }
    }
  });

  test("every country has valid sourceUrl", () => {
    for (const c of COUNTRIES) {
      assert.ok(c.sourceUrl.startsWith("http"), `${c.code} bad sourceUrl: ${c.sourceUrl}`);
    }
  });

  test("taxSystem is a known value", () => {
    const known = new Set(["progressive", "flat", "none", "german_formula"]);
    for (const c of COUNTRIES) {
      assert.ok(known.has(c.taxSystem), `${c.code} unknown taxSystem: ${c.taxSystem}`);
    }
  });
});

describe("static US states", () => {
  test("at least 25 states", () => {
    assert.ok(US_STATES.length >= 25, `got ${US_STATES.length}`);
  });

  test("no-tax states: AK, FL, NV, SD, TN, TX, WY", () => {
    const expected = ["AK", "FL", "NV", "SD", "TN", "TX", "WY"];
    for (const code of expected) {
      const s = US_STATES.find((x) => x.code === code);
      assert.ok(s, `${code} missing from states`);
      assert.equal(s.hasIncomeTax, false, `${code} should be no-tax`);
      assert.equal(s.brackets.length, 0, `${code} no-tax state should have empty brackets`);
    }
  });

  test("every state has unique code and slug", () => {
    const codes = US_STATES.map((s) => s.code);
    const slugs = US_STATES.map((s) => s.slug);
    assert.equal(new Set(codes).size, codes.length);
    assert.equal(new Set(slugs).size, slugs.length);
  });

  test("states with income tax have brackets", () => {
    for (const s of US_STATES) {
      if (s.hasIncomeTax) {
        assert.ok(s.brackets.length > 0, `${s.code} has tax but no brackets`);
        // First bracket at 0, last unbounded
        assert.equal(s.brackets[0].lowerBound, 0);
        assert.equal(s.brackets[s.brackets.length - 1].upperBound, null);
      }
    }
  });

  test("topMarginalRate consistency", () => {
    // For states WITH income tax, topMarginalRate must be set and match last bracket rate
    for (const s of US_STATES) {
      if (s.hasIncomeTax) {
        assert.ok(s.topMarginalRate !== null, `${s.code} should have topMarginalRate`);
        assert.ok(s.brackets.length > 0, `${s.code} has tax but no brackets`);
        const last = s.brackets[s.brackets.length - 1];
        assert.equal(s.topMarginalRate, last.rate, `${s.code} topMarginalRate mismatch`);
      } else {
        // No-tax states: topMarginalRate must be null
        assert.equal(s.topMarginalRate, null, `${s.code} no-tax state should have null topMarginalRate`);
      }
    }
  });
});

describe("static historical data", () => {
  test("HISTORICAL_2024 covers 2024 brackets for major countries", async () => {
    const mod = await import("../src/data/static/historical");
    const h = mod.HISTORICAL_2024;
    assert.ok(h.length >= 10, `got ${h.length} historical entries`);

    // US 2024 should have ~7 brackets
    const us = h.find((x) => x.countryCode === "US");
    assert.ok(us, "US 2024 missing");
    assert.equal(us.year, 2024);
    assert.ok(us.brackets.length >= 5);
  });

  test("getHistoricalForCountry returns null for unknown", async () => {
    const mod = await import("../src/data/static/historical");
    assert.equal(mod.getHistoricalForCountry("ZZ", 2024), null);
    assert.equal(mod.getHistoricalForCountry("US", 2025), null);
  });
});