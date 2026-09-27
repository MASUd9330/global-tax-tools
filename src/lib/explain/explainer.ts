/**
 * AI Explanation Layer (rule-based, no LLM dependency).
 *
 * Per architecture: "AI explains, never calculates". This module takes
 * an already-computed tax result and produces a structured narrative.
 *
 * Input:  calculation result + jurisdiction context
 * Output: { summary, sections[], insights[], citations[], warnings[] }
 *
 * Deterministic. Same input → same output. No network calls.
 */

import type { StaticTaxBracket, StaticDeduction } from "@/data/static/countries";

export interface CalcBreakdownItem {
  lower: number;
  upper: number | null;
  rate: number;
  amountInBracket: number;
  taxInBracket: number;
}

export interface DeductionApplied {
  name: string;
  amount: number;
}

export interface CalcResultLike {
  grossIncome: number;
  taxableIncome: number;
  totalTax: number;
  effectiveRate: number;
  marginalRate: number;
  breakdown: CalcBreakdownItem[];
  deductionsApplied: DeductionApplied[];
}

export interface ExplainInput {
  country: { code: string; name: string; taxSystem: string; defaultCurrency: string };
  state?: { name: string; hasIncomeTax: boolean } | null;
  year: number;
  income: number;
  currency: string;
  federal: CalcResultLike;
  stateResult?: CalcResultLike | null;
  sourceUrl?: string | null;
  stateSourceUrl?: string | null;
  metaNotes?: string | null;
}

export interface ExplainSection {
  heading: string;
  body: string;
}

export interface ExplainOutput {
  summary: string;
  sections: ExplainSection[];
  insights: string[];
  warnings: string[];
  citations: { label: string; url: string }[];
}

const fmt = (n: number, currency: string) => {
  const rounded = Math.round(n).toLocaleString();
  return `${currency} ${rounded}`;
};

const fmtPct = (n: number) => `${(n * 100).toFixed(2)}%`;

function explainFederal(input: ExplainInput): ExplainSection[] {
  const { country, year, income, currency, federal } = input;
  const sections: ExplainSection[] = [];

  // No-tax countries
  if (country.taxSystem === "none" || federal.totalTax === 0) {
    sections.push({
      heading: `${country.name} has no personal income tax`,
      body: `${country.name} does not levy a personal income tax on salaries in ${year}. Your gross income of ${fmt(income, currency)} is fully retained as take-home pay (other local fees, if any, are not modeled here).`,
    });
    return sections;
  }

  // Flat-tax countries
  if (country.taxSystem === "flat") {
    sections.push({
      heading: `Flat-rate tax`,
      body: `${country.name} applies a single flat rate of ${fmtPct(federal.marginalRate)} to all taxable income. Tax = ${fmt(income, currency)} × ${fmtPct(federal.marginalRate)} = ${fmt(federal.totalTax, currency)}.`,
    });
    return sections;
  }

  // Progressive: explain how brackets apply
  const lines: string[] = [];
  for (const b of federal.breakdown) {
    if (b.amountInBracket > 0) {
      const range =
        b.upper == null
          ? `above ${fmt(b.lower, currency)}`
          : `${fmt(b.lower, currency)} – ${fmt(b.upper, currency)}`;
      lines.push(
        `• **${range}** at **${fmtPct(b.rate)}** on ${fmt(b.amountInBracket, currency)} = ${fmt(b.taxInBracket, currency)}`
      );
    }
  }

  const headline =
    lines.length === 0
      ? `No income falls into a taxable bracket at this income level.`
      : `Your taxable income is split across ${lines.length} bracket${lines.length > 1 ? "s" : ""}.`;

  sections.push({
    heading: `${country.name} progressive tax breakdown (${year})`,
    body: headline + "\n\n" + lines.join("\n"),
  });

  // Marginal vs effective
  const marginPct = fmtPct(federal.marginalRate);
  const effPct = fmtPct(federal.effectiveRate);
  sections.push({
    heading: `Marginal vs effective rate`,
    body:
      `Your **marginal rate** is **${marginPct}** — that's the rate on the *next* dollar you earn (it applies to income inside your highest filled bracket). ` +
      `Your **effective rate** is **${effPct}** — that's what you actually pay across all your income. ` +
      `The gap between them (${((federal.marginalRate - federal.effectiveRate) * 100).toFixed(1)} pp) reflects the lower-rate brackets applied to your earlier income.`,
  });

  // Deductions applied
  if (federal.deductionsApplied.length > 0) {
    const ded = federal.deductionsApplied
      .map((d) => `• ${d.name}: ${fmt(d.amount, currency)}`)
      .join("\n");
    sections.push({
      heading: `Deductions applied`,
      body: `Before tax was calculated, the following deductions reduced your taxable income:\n\n${ded}\n\nThis lowered your taxable income from ${fmt(income, currency)} to ${fmt(federal.taxableIncome, currency)}.`,
    });
  }

  return sections;
}

function explainState(input: ExplainInput): ExplainSection[] {
  if (!input.state || !input.stateResult) return [];
  const { state, stateResult, currency, income } = input;

  if (!state.hasIncomeTax || stateResult.totalTax === 0) {
    return [
      {
        heading: `${state.name} has no state income tax`,
        body: `${state.name} does not levy a state-level income tax, so your tax obligation ends at the federal level.`,
      },
    ];
  }

  return [
    {
      heading: `${state.name} state tax`,
      body:
        `On top of federal tax, ${state.name} applies ${fmt(stateResult.totalTax, currency)} in state income tax at an effective rate of ${fmtPct(stateResult.effectiveRate)} on your ${fmt(income, currency)} salary. ` +
        `State tax is calculated separately on your gross income (after any state-specific deductions) — federal tax does not reduce the state tax base.`,
    },
  ];
}

function deriveInsights(input: ExplainInput): string[] {
  const insights: string[] = [];
  const { federal, stateResult, country, currency, income } = input;

  // Insight: highest bracket reached
  const lastBracket = federal.breakdown[federal.breakdown.length - 1];
  if (lastBracket && federal.breakdown.length > 0 && country.taxSystem === "progressive") {
    insights.push(
      `Your income reaches the **${fmtPct(lastBracket.rate)}** bracket — every additional ${currency}1 above ${fmt(lastBracket.lower, currency)} is taxed at this rate.`
    );
  }

  // Insight: pre/post deduction comparison
  const totalDeductions = federal.deductionsApplied.reduce((s, d) => s + d.amount, 0);
  if (totalDeductions > 0) {
    insights.push(
      `Deductions reduced your taxable income by ${fmt(totalDeductions, currency)} (${((totalDeductions / income) * 100).toFixed(1)}% of gross).`
    );
  }

  // Insight: combined effective rate
  const combinedTax = federal.totalTax + (stateResult?.totalTax ?? 0);
  const combinedEffective = income > 0 ? combinedTax / income : 0;
  if (stateResult && stateResult.totalTax > 0) {
    insights.push(
      `Combined federal + state effective rate: **${fmtPct(combinedEffective)}** — that's your real "all-in" tax burden.`
    );
  }

  // Insight: take-home ratio
  const takeHome = income - combinedTax;
  const ratio = income > 0 ? (takeHome / income) * 100 : 0;
  insights.push(`You keep **${ratio.toFixed(1)}%** of your gross income (${fmt(takeHome, currency)} of ${fmt(income, currency)}).`);

  return insights;
}

function deriveWarnings(input: ExplainInput): string[] {
  const warnings: string[] = [];
  const { country, income, currency } = input;

  if (country.taxSystem === "german_formula") {
    warnings.push(
      "Germany uses a *mathematical formula* (not progressive brackets). Calc engine implements the formula for single filers — joint filing may differ."
    );
  }

  if (country.code === "DE" || country.code === "FR" || country.code === "IT" || country.code === "NL") {
    warnings.push(
      "Estimate excludes mandatory social-security / health-insurance contributions. See /tools/salary-calculator/ for take-home including payroll deductions."
    );
  }

  if (country.code === "PT") {
    warnings.push(
      "Portugal's NHR regime has a 10-year sunset for new entrants. This estimate assumes standard rates."
    );
  }

  if (country.code === "CH") {
    warnings.push(
      "Switzerland estimate is federal-only — cantonal and communal taxes vary widely (≈ 10-25% additional). See country page for details."
    );
  }

  if (country.code === "US" && !input.state) {
    warnings.push(
      "US federal tax only — most states add 0–13% income tax. Pick a state for the full picture."
    );
  }

  if (income > 1_000_000) {
    warnings.push(
      "Income exceeds 1M — most brackets cap out and high-earner phase-outs / caps may apply. Verify with a tax professional."
    );
  }

  return warnings;
}

export function explain(input: ExplainInput): ExplainOutput {
  const { country, income, currency, federal, stateResult } = input;

  // Summary headline
  const totalTax = federal.totalTax + (stateResult?.totalTax ?? 0);
  const takeHome = income - totalTax;

  let summary: string;
  if (country.taxSystem === "none" || totalTax === 0) {
    summary = `On ${fmt(income, currency)} of gross income, you pay **${fmt(0, currency)}** in personal income tax in ${country.name} — you take home the full ${fmt(income, currency)}.`;
  } else {
    const effPct = fmtPct(totalTax / income);
    summary = `On ${fmt(income, currency)} of gross income, you pay **${fmt(totalTax, currency)}** in tax (effective rate **${effPct}**) — you take home **${fmt(takeHome, currency)}**.`;
  }

  const sections: ExplainSection[] = [
    ...explainFederal(input),
    ...explainState(input),
  ];

  // Bracket-only structure summary (short version for UI)
  const insights = deriveInsights(input);
  const warnings = deriveWarnings(input);

  const citations: { label: string; url: string }[] = [];
  if (input.sourceUrl) citations.push({ label: `${country.name} tax source`, url: input.sourceUrl });
  if (input.stateSourceUrl) citations.push({ label: `${input.state?.name ?? ""} tax source`, url: input.stateSourceUrl });

  return {
    summary,
    sections,
    insights,
    warnings,
    citations,
  };
}