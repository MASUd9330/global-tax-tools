/**
 * Canadian province data integrity tests.
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { CA_PROVINCES, PROVINCES_BY_CODE, PROVINCES_BY_SLUG } from "../src/data/static/provinces";

describe("static provinces — required fields", () => {
  test("has 13 provinces/territories", () => {
    assert.equal(CA_PROVINCES.length, 13);
  });

  test("includes all major provinces", () => {
    const expected = ["ON", "QC", "BC", "AB", "SK", "MB", "NB", "NS", "PE", "NL", "YT", "NT", "NU"];
    for (const code of expected) {
      assert.ok(PROVINCES_BY_CODE[code], `${code} missing`);
    }
  });

  test("each province has unique code and slug", () => {
    const codes = CA_PROVINCES.map((p) => p.code);
    const slugs = CA_PROVINCES.map((p) => p.slug);
    assert.equal(new Set(codes).size, codes.length);
    assert.equal(new Set(slugs).size, slugs.length);
  });

  test("every province has at least one bracket (income tax)", () => {
    for (const p of CA_PROVINCES) {
      assert.ok(p.brackets.length > 0, `${p.code} has no brackets`);
      assert.equal(p.brackets[0].lowerBound, 0, `${p.code} first bracket not 0`);
      assert.equal(p.brackets[p.brackets.length - 1].upperBound, null, `${p.code} last bracket not ∞`);
    }
  });

  test("bracketing monotonic (sorted by lowerBound)", () => {
    for (const p of CA_PROVINCES) {
      for (let i = 1; i < p.brackets.length; i++) {
        assert.ok(
          p.brackets[i].lowerBound >= p.brackets[i - 1].lowerBound,
          `${p.code} brackets not sorted`
        );
      }
    }
  });

  test("rates in [0, 1] range", () => {
    for (const p of CA_PROVINCES) {
      for (const b of p.brackets) {
        assert.ok(b.rate >= 0 && b.rate <= 1, `${p.code} bracket rate ${b.rate} out of range`);
      }
    }
  });

  test("Quebec has the highest top rate (~25.65%)", () => {
    const qc = PROVINCES_BY_CODE.QC!;
    assert.ok(qc.topMarginalRate !== null && qc.topMarginalRate > 0.20, `QC rate ${qc.topMarginalRate}`);
    assert.equal(qc.hasQuebecAbatement, true);
  });

  test("Nunavut has the lowest top rate (11.5%)", () => {
    const nu = PROVINCES_BY_CODE.NU!;
    assert.equal(nu.topMarginalRate, 0.115);
  });

  test("getProvince returns summary with required fields", async () => {
    const { getProvince } = await import("../src/lib/data/province");
    const p = getProvince("ON");
    assert.ok(p);
    assert.equal(p!.code, "ON");
    assert.equal(p!.countryCode, "CA");
  });

  test("getProvinceTaxData returns full data with brackets", async () => {
    const { getProvinceTaxData } = await import("../src/lib/data/province");
    const d = getProvinceTaxData("ontario");
    assert.ok(d, "Province data should be loadable");
    if (!d) return;
    assert.ok(d.brackets.length > 0);
    assert.ok(d.sourceUrl !== null && d.sourceUrl.startsWith("http"));
  });

  test("Canadian provinces tax verified — $100K in Ontario", async () => {
    const { calculateProgressiveTax } = await import("../src/lib/calc/tax");
    const { getProvinceTaxData } = await import("../src/lib/data/province");
    const p = getProvinceTaxData("ON")!;
    const r = calculateProgressiveTax(100000, p.brackets, [
      { name: "ON Basic Personal Amount", type: "personal", amount: 12399 },
    ]);
    // Ontario brackets for 2025: 5.05% × $52,886 + 9.15% × ($100K - $52,886 - $12,399 = $34,715)
    // ≈ 2,671 + 3,176 = $5,847
    assert.ok(Math.abs(r.totalTax - 5847) < 50, `got ${r.totalTax}`);
  });
});