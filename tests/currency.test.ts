/**
 * Currency conversion tests.
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { CURRENCIES, CURRENCY_LIST, convertCurrency, formatMoney, parseAmount } from "../src/lib/currency";

describe("CURRENCIES registry", () => {
  test("has at least 15 currencies", () => {
    assert.ok(CURRENCY_LIST.length >= 15);
  });

  test("has USD, EUR, GBP, INR (top remittance currencies)", () => {
    for (const code of ["USD", "EUR", "GBP", "INR"]) {
      assert.ok(CURRENCIES[code], `${code} missing`);
    }
  });

  test("every currency has flag emoji + symbol + perUsd > 0", () => {
    for (const c of CURRENCY_LIST) {
      assert.ok(c.flag.length > 0, `${c.code} missing flag`);
      assert.ok(c.symbol.length > 0, `${c.code} missing symbol`);
      assert.ok(c.perUsd > 0, `${c.code} has invalid rate`);
    }
  });
});

describe("convertCurrency", () => {
  test("USD → USD round-trips", () => {
    assert.equal(convertCurrency(100, "USD", "USD"), 100);
  });

  test("USD → EUR (rate ≈ 0.92)", () => {
    const r = convertCurrency(100, "USD", "EUR");
    assert.ok(Math.abs(r - 92) < 0.5, `got ${r}`);
  });

  test("USD → JPY (rate ≈ 157)", () => {
    const r = convertCurrency(100, "USD", "JPY");
    assert.ok(Math.abs(r - 15700) < 50, `got ${r}`);
  });

  test("EUR → USD back ≈ original", () => {
    const eur = convertCurrency(1000, "USD", "EUR");
    const back = convertCurrency(eur, "EUR", "USD");
    assert.ok(Math.abs(back - 1000) < 0.01, `got ${back}`);
  });

  test("unknown from currency returns amount unchanged", () => {
    assert.equal(convertCurrency(100, "ZZZ", "USD"), 100);
  });
});

describe("formatMoney", () => {
  test("formats USD $100,000", () => {
    const r = formatMoney(100000, "USD");
    assert.match(r, /\$100,000/);
  });

  test("formats EUR 92,000", () => {
    const r = formatMoney(92000, "EUR");
    assert.match(r, /€/);
  });
});

describe("parseAmount", () => {
  test("parses US format 1,234.56", () => {
    assert.equal(parseAmount("1,234.56"), 1234.56);
  });

  test("parses European format 1.234,56", () => {
    assert.equal(parseAmount("1.234,56"), 1234.56);
  });

  test("parses plain 5000", () => {
    assert.equal(parseAmount("5000"), 5000);
  });

  test("empty string → 0", () => {
    assert.equal(parseAmount(""), 0);
  });
});