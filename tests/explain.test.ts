/**
 * AI Explainer unit tests — verify rule-based explanation generation.
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { explain } from "../src/lib/explain/explainer";
import { calculateProgressiveTax } from "../src/lib/calc/tax";

const US_BRACKETS = [
  { lowerBound: 0, upperBound: 11925, rate: 0.10 },
  { lowerBound: 11925, upperBound: 48475, rate: 0.12 },
  { lowerBound: 48475, upperBound: 103350, rate: 0.22 },
  { lowerBound: 103350, upperBound: 197300, rate: 0.24 },
  { lowerBound: 197300, upperBound: 250525, rate: 0.32 },
  { lowerBound: 250525, upperBound: 626350, rate: 0.35 },
  { lowerBound: 626350, upperBound: null, rate: 0.37 },
];

function usExplain(income: number) {
  const fed = calculateProgressiveTax(income, US_BRACKETS, [
    { name: "Standard Deduction (Single)", type: "standard", amount: 15000 },
  ]);
  return explain({
    country: { code: "US", name: "United States", taxSystem: "progressive", defaultCurrency: "USD" },
    year: 2025,
    income,
    currency: "USD",
    federal: fed,
    sourceUrl: "https://www.irs.gov",
  });
}

describe("explain — US 2025", () => {
  test("summary contains take-home and effective rate", () => {
    const out = usExplain(100000);
    assert.match(out.summary, /USD 100,000/);
    assert.match(out.summary, /USD 13,614/);
    assert.match(out.summary, /13\.61%/);
  });

  test("has progressive breakdown section", () => {
    const out = usExplain(100000);
    const breakdown = out.sections.find((s) => s.heading.includes("progressive"));
    assert.ok(breakdown);
    assert.match(breakdown.body, /10\.00%/);
    assert.match(breakdown.body, /22\.00%/);
  });

  test("has marginal vs effective section", () => {
    const out = usExplain(100000);
    const m = out.sections.find((s) => s.heading.includes("Marginal vs effective"));
    assert.ok(m);
    assert.match(m.body, /22\.00%/); // marginal
    assert.match(m.body, /13\.61%/); // effective
  });

  test("includes deductions section when applied", () => {
    const out = usExplain(100000);
    const d = out.sections.find((s) => s.heading.toLowerCase().includes("deduction"));
    assert.ok(d);
    assert.match(d.body, /Standard Deduction/);
    assert.match(d.body, /USD 15,000/);
  });

  test("includes insights array with bracket info", () => {
    const out = usExplain(100000);
    assert.ok(out.insights.length >= 2);
    assert.ok(out.insights.some((i) => i.includes("22.00%")));
    assert.ok(out.insights.some((i) => i.toLowerCase().includes("keep")));
  });

  test("citations array contains sourceUrl", () => {
    const out = usExplain(100000);
    assert.equal(out.citations.length, 1);
    assert.equal(out.citations[0].url, "https://www.irs.gov");
  });
});

describe("explain — UAE / no-tax", () => {
  test("UAE summary mentions no income tax", () => {
    const out = explain({
      country: { code: "AE", name: "UAE", taxSystem: "none", defaultCurrency: "AED" },
      year: 2025,
      income: 200000,
      currency: "AED",
      federal: {
        grossIncome: 200000,
        taxableIncome: 200000,
        totalTax: 0,
        effectiveRate: 0,
        marginalRate: 0,
        breakdown: [],
        deductionsApplied: [],
      },
    });
    assert.match(out.summary, /UAE/);
    assert.match(out.summary, /no income tax|AED 0/i);
    assert.equal(out.sections.length, 1); // Just the no-tax section
    assert.match(out.sections[0].heading, /no personal income tax/i);
  });
});

describe("explain — state tax", () => {
  test("includes state section when provided", () => {
    const fed = calculateProgressiveTax(100000, US_BRACKETS, [
      { name: "Standard", type: "standard", amount: 15000 },
    ]);
    const caBrackets = [
      { lowerBound: 0, upperBound: 10412, rate: 0.01 },
      { lowerBound: 10412, upperBound: 24684, rate: 0.02 },
      { lowerBound: 24684, upperBound: 38959, rate: 0.04 },
      { lowerBound: 38959, upperBound: 54081, rate: 0.06 },
      { lowerBound: 54081, upperBound: 68350, rate: 0.08 },
      { lowerBound: 68350, upperBound: 349137, rate: 0.093 },
      { lowerBound: 349137, upperBound: 418961, rate: 0.103 },
      { lowerBound: 418961, upperBound: 698271, rate: 0.113 },
      { lowerBound: 698271, upperBound: null, rate: 0.123 },
    ];
    const ca = calculateProgressiveTax(100000, caBrackets, [
      { name: "CA Standard Deduction", type: "standard", amount: 5540 },
    ]);
    const out = explain({
      country: { code: "US", name: "United States", taxSystem: "progressive", defaultCurrency: "USD" },
      state: { name: "California", hasIncomeTax: true },
      year: 2025,
      income: 100000,
      currency: "USD",
      federal: fed,
      stateResult: ca,
      sourceUrl: "https://www.irs.gov",
      stateSourceUrl: "https://www.ftb.ca.gov",
    });
    assert.ok(out.sections.length >= 3);
    const stateSection = out.sections.find((s) => s.heading.includes("California"));
    assert.ok(stateSection);
    assert.match(stateSection.body, /state income tax/);
    assert.equal(out.citations.length, 2);
  });

  test("no-tax state shows green-light section", () => {
    const fed = calculateProgressiveTax(100000, US_BRACKETS, [
      { name: "Standard", type: "standard", amount: 15000 },
    ]);
    const out = explain({
      country: { code: "US", name: "United States", taxSystem: "progressive", defaultCurrency: "USD" },
      state: { name: "Texas", hasIncomeTax: false },
      year: 2025,
      income: 100000,
      currency: "USD",
      federal: fed,
      stateResult: { ...fed, totalTax: 0 },
    });
    const txSection = out.sections.find((s) => s.heading.includes("Texas"));
    assert.ok(txSection);
    assert.match(txSection.body, /does not levy a state-level|no state(-|)level income tax|no state income tax/i);
  });
});

describe("explain — warnings", () => {
  test("US federal-only warning when no state", () => {
    const out = usExplain(100000);
    assert.ok(
      out.warnings.some((w) => /most states add 0/i.test(w)),
      `no warning about states`
    );
  });

  test("high income warning at $1M+", () => {
    const out = usExplain(2000000);
    assert.ok(
      out.warnings.some((w) => /Income exceeds 1M/i.test(w)),
      "no high income warning"
    );
  });

  test("Switzerland cantonal warning", () => {
    const fed = calculateProgressiveTax(100000, US_BRACKETS, []);
    const out = explain({
      country: { code: "CH", name: "Switzerland", taxSystem: "progressive", defaultCurrency: "CHF" },
      year: 2025,
      income: 100000,
      currency: "CHF",
      federal: fed,
    });
    assert.ok(out.warnings.some((w) => /cantonal/i.test(w)));
  });
});