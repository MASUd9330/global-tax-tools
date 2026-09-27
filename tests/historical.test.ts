/**
 * Historical data tests — verify 2024 vs 2025 comparison logic.
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { calculateProgressiveTax } from "../src/lib/calc/tax";
import { HISTORICAL_2024, getHistoricalForCountry } from "../src/data/static/historical";

describe("historical — US 2024 vs 2025", () => {
  const us2024 = HISTORICAL_2024.find((h) => h.countryCode === "US")!;
  const us2025Brackets = [
    { lowerBound: 0, upperBound: 11925, rate: 0.10 },
    { lowerBound: 11925, upperBound: 48475, rate: 0.12 },
    { lowerBound: 48475, upperBound: 103350, rate: 0.22 },
    { lowerBound: 103350, upperBound: 197300, rate: 0.24 },
    { lowerBound: 197300, upperBound: 250525, rate: 0.32 },
    { lowerBound: 250525, upperBound: 626350, rate: 0.35 },
    { lowerBound: 626350, upperBound: null, rate: 0.37 },
  ];

  test("$100k: 2024 = $13,841, 2025 = $13,614 (decreased by ~$227)", () => {
    const t2024 = calculateProgressiveTax(100000, us2024.brackets, us2024.deductions);
    const t2025 = calculateProgressiveTax(100000, us2025Brackets, [
      { name: "Standard Deduction (Single)", type: "standard", amount: 15000 },
    ]);
    assert.equal(Math.round(t2024.totalTax), 13841);
    assert.equal(Math.round(t2025.totalTax), 13614);
    assert.ok(t2025.totalTax < t2024.totalTax, "2025 should be lower than 2024 due to inflation indexing");
  });

  test("2024 standard deduction is $14,600 (lower than 2025's $15,000)", () => {
    const ded = us2024.deductions.find((d) => d.type === "standard");
    assert.equal(ded?.amount, 14600);
  });

  test("$50k: 2024 vs 2025 both effective in low brackets", () => {
    const t2024 = calculateProgressiveTax(50000, us2024.brackets, us2024.deductions);
    const t2025 = calculateProgressiveTax(50000, us2025Brackets, [
      { name: "Standard", type: "standard", amount: 15000 },
    ]);
    assert.ok(t2024.totalTax > 0 && t2024.totalTax < 5000);
    assert.ok(t2025.totalTax > 0 && t2025.totalTax < 5000);
  });
});

describe("historical — multi-country coverage", () => {
  test("at least 10 countries have 2024 data", () => {
    const codes = new Set(HISTORICAL_2024.map((h) => h.countryCode));
    assert.ok(codes.size >= 10, `got ${codes.size} countries`);
  });

  test("UK 2024 has Personal Allowance (£12,570)", () => {
    const uk = HISTORICAL_2024.find((h) => h.countryCode === "GB")!;
    const ded = uk.deductions.find((d) => d.name.includes("Personal"));
    assert.equal(ded?.amount, 12570);
  });

  test("UAE not in historical (no-tax country)", () => {
    const ae = HISTORICAL_2024.find((h) => h.countryCode === "AE");
    assert.equal(ae, undefined);
  });

  test("getHistoricalForCountry returns 2024 US data", () => {
    const us = getHistoricalForCountry("US", 2024);
    assert.ok(us);
    assert.equal(us.countryCode, "US");
    assert.equal(us.year, 2024);
  });
});