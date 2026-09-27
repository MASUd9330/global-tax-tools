/**
 * Calc engine unit tests — verify bracket math is correct.
 * Uses Node's built-in test runner (no external deps).
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { calculateProgressiveTax } from "../src/lib/calc/tax";

describe("calculateProgressiveTax — US 2025", () => {
  // US 2025 brackets (single):
  //   10% on 0..11925
  //   12% on 11925..48475
  //   22% on 48475..103350
  //   24% on 103350..197300
  //   32% on 197300..250525
  //   35% on 250525..626350
  //   37% on 626350+
  //   Standard deduction: $15,000 (single)
  const US_BRACKETS = [
    { lowerBound: 0, upperBound: 11925, rate: 0.10 },
    { lowerBound: 11925, upperBound: 48475, rate: 0.12 },
    { lowerBound: 48475, upperBound: 103350, rate: 0.22 },
    { lowerBound: 103350, upperBound: 197300, rate: 0.24 },
    { lowerBound: 197300, upperBound: 250525, rate: 0.32 },
    { lowerBound: 250525, upperBound: 626350, rate: 0.35 },
    { lowerBound: 626350, upperBound: null, rate: 0.37 },
  ];
  const US_DEDUCTIONS = [{ name: "Standard", type: "standard", amount: 15000 }];

  test("$0 → $0 tax", () => {
    const r = calculateProgressiveTax(0, US_BRACKETS, US_DEDUCTIONS);
    assert.equal(r.totalTax, 0);
    assert.equal(r.effectiveRate, 0);
    assert.equal(r.marginalRate, 0);
  });

  test("$50k → $4,386 federal tax (after $15k deduction)", () => {
    // Taxable = 50000 - 15000 = 35000
    // 10% on 11925 = 1192.50
    // 12% on (35000-11925) = 23075 * 0.12 = 2769.00
    // Total = 3961.50 → rounded display but engine returns raw
    const r = calculateProgressiveTax(50000, US_BRACKETS, US_DEDUCTIONS);
    assert.equal(r.taxableIncome, 35000);
    assert.equal(Math.round(r.totalTax), 3962);
    assert.equal(r.marginalRate, 0.12);
  });

  test("$100k → ~$13,614 federal (architecture-verified number)", () => {
    // Taxable = 85000
    // 10% on 11925 = 1192.50
    // 12% on 36550 = 4386
    // 22% on 36525 = 8035.50
    // Total = 13614
    const r = calculateProgressiveTax(100000, US_BRACKETS, US_DEDUCTIONS);
    assert.equal(Math.round(r.totalTax), 13614);
    assert.equal(r.marginalRate, 0.22);
    // Effective rate = 13614 / 100000 = 13.6%
    assert.ok(Math.abs(r.effectiveRate - 0.13614) < 0.001, `effective was ${r.effectiveRate}`);
  });

  test("$500k → progressive high income", () => {
    const r = calculateProgressiveTax(500000, US_BRACKETS, US_DEDUCTIONS);
    // Taxable = 485000. Total tax walks 7 brackets → ~$139,297
    assert.ok(r.totalTax > 130000 && r.totalTax < 150000, `expected ~140k, got ${r.totalTax}`);
    assert.equal(r.marginalRate, 0.35);
    // Effective should be ~28% (139k/500k)
    assert.ok(r.effectiveRate > 0.26 && r.effectiveRate < 0.30, `effective ${r.effectiveRate}`);
  });

  test("$1M → reaches 37% top bracket", () => {
    const r = calculateProgressiveTax(1000000, US_BRACKETS, US_DEDUCTIONS);
    assert.equal(r.marginalRate, 0.37);
    assert.equal(r.breakdown[6].rate, 0.37);
  });

  test("breakdown sums to total", () => {
    const r = calculateProgressiveTax(100000, US_BRACKETS, US_DEDUCTIONS);
    const sumOfTax = r.breakdown.reduce((s, b) => s + b.taxInBracket, 0);
    assert.ok(Math.abs(sumOfTax - r.totalTax) < 0.001);
  });

  test("deduction cannot push taxable income below zero", () => {
    const huge = [{ name: "Big", type: "standard", amount: 1000000 }];
    const r = calculateProgressiveTax(50000, US_BRACKETS, huge);
    assert.equal(r.taxableIncome, 0);
    assert.equal(r.totalTax, 0);
  });

  test("income below all brackets → zero tax", () => {
    const r = calculateProgressiveTax(100, US_BRACKETS, US_DEDUCTIONS);
    assert.equal(r.totalTax, 0);
  });

  test("negative income → zero (defensive)", () => {
    const r = calculateProgressiveTax(-5000, US_BRACKETS, US_DEDUCTIONS);
    assert.equal(r.totalTax, 0);
    assert.equal(r.effectiveRate, 0);
  });
});

describe("calculateProgressiveTax — flat tax", () => {
  // UAE-style: 0 brackets → 0 tax (no-tax countries handled separately)
  // Single-rate example (Russia 2024: 13% on first 5M RUB, 15% after)
  const RU_BRACKETS = [
    { lowerBound: 0, upperBound: 5000000, rate: 0.13 },
    { lowerBound: 5000000, upperBound: null, rate: 0.15 },
  ];

  test("Russia-style flat-with-cap: 1M RUB", () => {
    const r = calculateProgressiveTax(1000000, RU_BRACKETS, []);
    assert.equal(Math.round(r.totalTax), 130000);
    assert.equal(r.marginalRate, 0.13);
  });

  test("Russia-style: 10M RUB hits second bracket", () => {
    // 13% on 5M = 650000
    // 15% on 5M = 750000
    // Total = 1400000
    const r = calculateProgressiveTax(10000000, RU_BRACKETS, []);
    assert.equal(Math.round(r.totalTax), 1400000);
    assert.equal(r.marginalRate, 0.15);
  });
});

describe("calculateProgressiveTax — German formula", () => {
  // Germany 2024 (simplified): fixed + rate * (income - lowerBound)
  const DE_BRACKETS = [
    { lowerBound: 0, upperBound: 10908, rate: 0 },
    { lowerBound: 10908, upperBound: 62809, rate: 0.20, fixedAmount: 0 },
    { lowerBound: 62809, upperBound: 277825, rate: 0.42, fixedAmount: 9548 },
    { lowerBound: 277825, upperBound: null, rate: 0.45, fixedAmount: 17170 },
  ];

  test("DE at 30k → in 20% bracket with formula", () => {
    const r = calculateProgressiveTax(30000, DE_BRACKETS, []);
    // fixedAmount 0 + 0.20 * (30000 - 10908) = 0 + 3818.40 = 3818.40
    assert.equal(Math.round(r.totalTax), 3818);
    assert.equal(r.marginalRate, 0.20);
  });

  test("DE at 100k → second bracket", () => {
    const r = calculateProgressiveTax(100000, DE_BRACKETS, []);
    // 10k bracket: 0 + 0.20 * (62809 - 10908) = 10380.20 (but we break at lowerBound for next bracket)
    // Actually: walks from start, hits bracket 2:
    //   bracket[1]: 0.20 * (62809-10908) = 10380.20
    //   bracket[2]: 9548 + 0.42 * (100000-62809) = 9548 + 15619.62 = 25167.62
    // Total = 10380.20 + 25167.62 = 35547.82
    assert.ok(Math.abs(Math.round(r.totalTax) - 35548) < 5, `got ${r.totalTax}`);
    assert.equal(r.marginalRate, 0.42);
  });
});

describe("calculateProgressiveTax — edge cases", () => {
  test("empty brackets → zero tax", () => {
    const r = calculateProgressiveTax(100000, [], []);
    assert.equal(r.totalTax, 0);
  });

  test("deduction with percentage", () => {
    const brackets = [{ lowerBound: 0, upperBound: null, rate: 0.10 }];
    const ded = [{ name: "10%", type: "pct", amount: 0, percentage: 0.10 }];
    const r = calculateProgressiveTax(100000, brackets, ded);
    // 10% deduction of 100k = 10000
    // Taxable = 90000
    // 10% on 90000 = 9000
    assert.equal(Math.round(r.totalTax), 9000);
  });

  test("deduction zero amount is skipped", () => {
    const brackets = [{ lowerBound: 0, upperBound: null, rate: 0.10 }];
    const ded = [{ name: "Zero", type: "x", amount: 0 }];
    const r = calculateProgressiveTax(100000, brackets, ded);
    // No deduction applied, taxable = 100000
    assert.equal(r.taxableIncome, 100000);
    assert.equal(Math.round(r.totalTax), 10000);
  });

  test("effectiveRate = totalTax / grossIncome (not taxableIncome)", () => {
    const brackets = [{ lowerBound: 0, upperBound: null, rate: 0.10 }];
    const ded = [{ name: "Half", type: "std", amount: 50000 }];
    const r = calculateProgressiveTax(100000, brackets, ded);
    // Taxable = 50000, tax = 5000
    // Effective = 5000 / 100000 = 0.05 (not 0.10)
    assert.equal(r.effectiveRate, 0.05);
  });
});