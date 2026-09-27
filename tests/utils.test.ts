/**
 * Utility tests — format helpers, current-year helper.
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { formatCurrency, formatNumber, formatPercent, getCurrentTaxYear, cn } from "../src/lib/utils";

describe("formatCurrency", () => {
  test("USD with no decimals", () => {
    const r = formatCurrency(123456, "USD");
    assert.match(r, /\$123,456/);
    assert.doesNotMatch(r, /\.50/); // No decimals
  });

  test("EUR with EU locale", () => {
    const r = formatCurrency(123456, "EUR", "de-DE");
    assert.match(r, /€/);
  });

  test("negative amount", () => {
    const r = formatCurrency(-500, "USD");
    assert.match(r, /-|\(.*\)/); // Either sign or parens
  });

  test("zero", () => {
    assert.match(formatCurrency(0, "USD"), /\$0/);
  });
});

describe("formatPercent", () => {
  test("0.10 → 10.0%", () => {
    assert.equal(formatPercent(0.10), "10.0%");
  });

  test("0.13614 → 13.6% (1 decimal)", () => {
    assert.equal(formatPercent(0.13614), "13.6%");
  });

  test("custom decimals", () => {
    assert.equal(formatPercent(0.13614, 2), "13.61%");
    assert.equal(formatPercent(0.13614, 0), "14%");
  });
});

describe("formatNumber", () => {
  test("commas", () => {
    assert.equal(formatNumber(1234567), "1,234,567");
  });

  test("no decimals", () => {
    assert.equal(formatNumber(99.9), "100");
  });
});

describe("getCurrentTaxYear", () => {
  test("returns a reasonable year", () => {
    const y = getCurrentTaxYear();
    assert.ok(y >= 2020 && y <= 2030, `got ${y}`);
  });
});

describe("cn (className utility)", () => {
  test("merges classes", () => {
    assert.equal(cn("a", "b", "c"), "a b c");
  });

  test("drops falsy", () => {
    assert.equal(cn("a", false, null, undefined, "b"), "a b");
  });

  test("dedupes tailwind conflicts", () => {
    // twMerge should resolve p-2 vs p-4
    assert.equal(cn("p-2", "p-4"), "p-4");
  });
});