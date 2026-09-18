/**
 * Pure-function tax calculation engine.
 * No DB access — takes pre-loaded rules + brackets as input.
 * Version-aware: callers pass specific year+version of rules.
 */

export interface TaxBracket {
  lowerBound: number;
  upperBound: number | null; // null = infinity (top bracket)
  rate: number; // 0.10 for 10%
  fixedAmount?: number | null; // for "X + Y% over Z" formula (e.g. Germany)
}

export interface TaxDeduction {
  name: string;
  type: string; // "standard" | "additional" | "personal"
  amount: number;
  percentage?: number | null;
  conditions?: Record<string, unknown> | null;
}

export interface TaxBracketBreakdown {
  lower: number;
  upper: number | null;
  rate: number;
  amountInBracket: number;
  taxInBracket: number;
}

export interface TaxResult {
  grossIncome: number;
  taxableIncome: number;
  totalTax: number;
  effectiveRate: number;
  marginalRate: number;
  breakdown: TaxBracketBreakdown[];
  deductionsApplied: Array<{ name: string; amount: number }>;
}

/**
 * Calculate progressive income tax given income, brackets, and deductions.
 * Supports two bracket styles:
 *   1. Standard: tax = amountInBracket * rate
 *   2. German-style: tax = fixedAmount + (income - lowerBound) * rate
 */
export function calculateProgressiveTax(
  income: number,
  brackets: TaxBracket[],
  deductions: TaxDeduction[] = []
): TaxResult {
  // Guard: non-positive income => no tax
  if (income <= 0) {
    return {
      grossIncome: income,
      taxableIncome: 0,
      totalTax: 0,
      effectiveRate: 0,
      marginalRate: 0,
      breakdown: [],
      deductionsApplied: [],
    };
  }

  // 1. Apply deductions in order
  let taxableIncome = income;
  const deductionsApplied: Array<{ name: string; amount: number }> = [];
  for (const d of deductions) {
    let amount = d.amount;
    if (d.percentage && d.percentage > 0) {
      amount = income * d.percentage;
    }
    if (amount <= 0) continue;
    taxableIncome -= amount;
    deductionsApplied.push({ name: d.name, amount });
  }
  taxableIncome = Math.max(0, taxableIncome);

  // 2. Walk brackets in order
  let totalTax = 0;
  let marginalRate = 0;
  const breakdown: TaxBracketBreakdown[] = [];

  // Sort by lowerBound (defensive — DB should already be ordered)
  const sortedBrackets = [...brackets].sort((a, b) => a.lowerBound - b.lowerBound);

  for (const b of sortedBrackets) {
    if (taxableIncome <= b.lowerBound) break;
    const upper = b.upperBound ?? Number.POSITIVE_INFINITY;
    const amountInBracket = Math.min(taxableIncome, upper) - b.lowerBound;
    if (amountInBracket <= 0) continue;

    let taxInBracket: number;
    if (b.fixedAmount != null) {
      // German formula: fixedAmount + rate * (income - lowerBound)
      taxInBracket = b.fixedAmount + b.rate * amountInBracket;
    } else {
      taxInBracket = amountInBracket * b.rate;
    }

    totalTax += taxInBracket;
    marginalRate = b.rate;
    breakdown.push({
      lower: b.lowerBound,
      upper: b.upperBound,
      rate: b.rate,
      amountInBracket,
      taxInBracket,
    });
  }

  // 3. Compute effective rate
  const effectiveRate = income > 0 ? totalTax / income : 0;

  return {
    grossIncome: income,
    taxableIncome,
    totalTax,
    effectiveRate,
    marginalRate,
    breakdown,
    deductionsApplied,
  };
}

/**
 * Format a tax result for human display.
 */
export function summarizeTax(result: TaxResult, currency = "USD"): string {
  if (result.totalTax === 0) return `No income tax owed in ${currency}.`;
  const pct = (result.effectiveRate * 100).toFixed(2);
  return `${currency} ${result.totalTax.toFixed(0)} (${pct}% effective, ${(result.marginalRate * 100).toFixed(0)}% marginal)`;
}