/**
 * Tax Freedom Day tests — verify date calculation.
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { calcTaxFreedomDay, formatFreedomDay } from "../src/lib/calc/freedom";

describe("calcTaxFreedomDay", () => {
  test("zero income → no freedom day", () => {
    const r = calcTaxFreedomDay(0, 0, 2025);
    assert.equal(r.freedomDayOrdinal, null);
    assert.equal(r.effectiveRate, 0);
  });

  test("zero tax (UAE) → freedomDayOrdinal null", () => {
    const r = calcTaxFreedomDay(100000, 0, 2025);
    assert.equal(r.freedomDayOrdinal, null);
    assert.equal(r.daysWorkedForGovt, 0);
  });

  test("USA $100k → ~$13.6k tax → ~50 days → mid-Feb", () => {
    const r = calcTaxFreedomDay(100000, 13614, 2025);
    assert.equal(r.effectiveRate, 0.13614);
    // 0.13614 * 365 = 49.69 → 50 days
    assert.equal(r.daysWorkedForGovt, 50);
    assert.ok(r.freedomDayDate);
    // Feb 19 = 31 + 19 = 50th day
    assert.equal(r.freedomDayDate!.getMonth(), 1); // February (0-indexed)
    assert.equal(r.freedomDayDate!.getDate(), 19);
  });

  test("France $100k → ~$30k tax → ~110 days → mid-April", () => {
    const r = calcTaxFreedomDay(100000, 30000, 2025);
    // 0.30 * 365 = 109.5 → 110 days
    assert.equal(r.daysWorkedForGovt, 110);
    // Apr 21 is 31+29+31+21 = 112th day — close to 110
    assert.ok(r.freedomDayOrdinal! >= 109 && r.freedomDayOrdinal! <= 110);
  });

  test("high tax (60%) → late August", () => {
    const r = calcTaxFreedomDay(100000, 60000, 2025);
    // 0.6 * 365 = 219 days → early August
    assert.equal(r.daysWorkedForGovt, 219);
    assert.equal(r.freedomDayDate!.getMonth(), 7); // August
  });

  test("100% tax (impossible but theoretical) → Dec 31", () => {
    const r = calcTaxFreedomDay(100000, 100000, 2025);
    // Capped at 365
    assert.ok(r.daysWorkedForGovt <= 365);
  });

  test("leap year 2024 → 366 days", () => {
    const r = calcTaxFreedomDay(100000, 13614, 2024);
    // 0.13614 * 366 = 49.83 → 50 days
    assert.equal(r.daysWorkedForGovt, 50);
  });

  test("formatFreedomDay returns formatted string", () => {
    const r = calcTaxFreedomDay(100000, 13614, 2025);
    const out = formatFreedomDay(r);
    assert.match(out, /Tax Freedom Day/);
    assert.match(out, /February/);
  });

  test("formatFreedomDay for zero-tax country", () => {
    const r = calcTaxFreedomDay(100000, 0, 2025);
    const out = formatFreedomDay(r);
    assert.match(out, /never.*2026|never reached/i);
  });
});