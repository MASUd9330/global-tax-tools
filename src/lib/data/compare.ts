/**
 * Comparison data layer.
 * Resolves a "X-vs-Y" pair into two tax entities (country or state) and their rules.
 */
import { prisma } from "@/lib/db";
import { getCountryTaxData, getCountry } from "@/lib/data/country";
import { getStateTaxData } from "@/lib/data/state";

export type SideType = "country" | "state";

export interface ComparisonSide {
  type: SideType;
  slug: string;
  name: string;
  countryCode?: string; // for state
  countryName?: string; // for state
}

export interface ResolvedComparison {
  left: ComparisonSide;
  right: ComparisonSide;
}

async function resolveOne(slugOrCode: string): Promise<ComparisonSide | null> {
  // Try country first (only 14, fast)
  const country = await getCountry(slugOrCode);
  if (country) {
    return {
      type: "country",
      slug: country.slug,
      name: country.name,
    };
  }
  // Try state (only US for now)
  const state = await prisma.state.findFirst({
    where: {
      OR: [{ code: slugOrCode.toUpperCase() }, { slug: slugOrCode.toLowerCase() }],
    },
    include: { country: { select: { code: true, name: true } } },
  });
  if (state) {
    return {
      type: "state",
      slug: state.slug,
      name: state.name,
      countryCode: state.country.code,
      countryName: state.country.name,
    };
  }
  return null;
}

/** Parse a "X-vs-Y" pair into two sides */
export async function parseComparison(pair: string): Promise<ResolvedComparison | null> {
  if (!pair.includes("-vs-")) return null;
  const [leftSlug, rightSlug] = pair.split("-vs-");
  if (!leftSlug || !rightSlug) return null;
  const [left, right] = await Promise.all([resolveOne(leftSlug), resolveOne(rightSlug)]);
  if (!left || !right) {
    console.error("[compare] parseComparison failed", { pair, leftSlug, rightSlug, left, right });
    return null;
  }
  return { left, right };
}

/** Build the canonical pair slug from two sides */
export function buildPairSlug(left: ComparisonSide, right: ComparisonSide): string {
  return `${left.slug}-vs-${right.slug}`;
}

/** Calculate tax for a single side at given income */
export async function calculateForSide(
  side: ComparisonSide,
  income: number,
  year: number
): Promise<{
  side: ComparisonSide;
  grossIncome: number;
  taxableIncome: number;
  totalTax: number;
  effectiveRate: number;
  marginalRate: number;
  brackets: Array<{ lower: number; upper: number | null; rate: number }>;
  currency: string;
  noTax: boolean;
  breakdown?: { federal: number; state: number };
} | null> {
  if (side.type === "country") {
    const country = await getCountry(side.slug);
    if (!country) return null;
    if (country.taxSystem === "none") {
      return {
        side,
        grossIncome: income,
        taxableIncome: income,
        totalTax: 0,
        effectiveRate: 0,
        marginalRate: 0,
        brackets: [],
        currency: country.defaultCurrency,
        noTax: true,
      };
    }
    // Country with income tax — load tax rules
    const taxData = await getCountryTaxData(side.slug, year);
    if (!taxData) return null;
    const { calculateProgressiveTax } = await import("@/lib/calc/tax");
    const result = calculateProgressiveTax(income, taxData.brackets, taxData.deductions);
    return {
      side,
      grossIncome: income,
      taxableIncome: result.taxableIncome,
      totalTax: result.totalTax,
      effectiveRate: result.effectiveRate,
      marginalRate: result.marginalRate,
      brackets: taxData.brackets.map((b) => ({ lower: b.lowerBound, upper: b.upperBound, rate: b.rate })),
      currency: country.defaultCurrency,
      noTax: false,
      breakdown: { federal: result.totalTax, state: 0 },
    };
  }

  // State — need to also include US federal tax for accurate comparison
  const data = await getStateTaxData(side.countryCode ?? "US", side.slug);
  if (!data) return null;

  if (!data.state.hasIncomeTax) {
    // No state tax — but US federal still applies
    const federalData = await getCountryTaxData("US", year);
    if (!federalData) return null;
    const { calculateProgressiveTax } = await import("@/lib/calc/tax");
    const fedResult = calculateProgressiveTax(income, federalData.brackets, federalData.deductions);
    return {
      side,
      grossIncome: income,
      taxableIncome: fedResult.taxableIncome,
      totalTax: fedResult.totalTax,
      effectiveRate: fedResult.effectiveRate,
      marginalRate: fedResult.marginalRate,
      brackets: federalData.brackets.map((b) => ({ lower: b.lowerBound, upper: b.upperBound, rate: b.rate })),
      currency: "USD",
      noTax: false, // federal still applies
      breakdown: { federal: fedResult.totalTax, state: 0 },
    };
  }

  // State with income tax — federal + state
  const { calculateProgressiveTax } = await import("@/lib/calc/tax");
  const federalData = await getCountryTaxData("US", year);
  if (!federalData) return null;
  const fedResult = calculateProgressiveTax(income, federalData.brackets, federalData.deductions);
  const stateDeductions: { name: string; type: string; amount: number }[] = data.standardDeduction > 0
    ? [{ name: `${data.state.name} Standard Deduction`, type: "standard", amount: data.standardDeduction }]
    : [];
  const stateResult = calculateProgressiveTax(income, data.brackets, stateDeductions);
  return {
    side,
    grossIncome: income,
    taxableIncome: fedResult.taxableIncome,
    totalTax: fedResult.totalTax + stateResult.totalTax,
    effectiveRate: (fedResult.totalTax + stateResult.totalTax) / Math.max(income, 1),
    marginalRate: Math.max(fedResult.marginalRate, stateResult.marginalRate),
    brackets: data.brackets.map((b) => ({ lower: b.lowerBound, upper: b.upperBound, rate: b.rate })),
    currency: "USD",
    noTax: false,
    breakdown: { federal: fedResult.totalTax, state: stateResult.totalTax },
  };
}

/** Get a curated list of popular comparisons */
export async function getPopularComparisons(): Promise<string[]> {
  const countries = await prisma.country.findMany({ select: { slug: true } });
  const countrySlugs = countries.map((c) => c.slug);

  const popularPairs: string[] = [
    // US state vs state (popular, no-tax vs high-tax)
    "texas-vs-california",
    "florida-vs-new-york",
    "texas-vs-new-york",
    "florida-vs-california",
    "washington-vs-california",
    "nevada-vs-california",
    "tennessee-vs-new-york",
    "illinois-vs-florida",
    "pennsylvania-vs-new-york",
    // State vs state (progressive vs flat)
    "california-vs-colorado",
    "new-york-vs-florida",
    "california-vs-arizona",
    "new-york-vs-illinois",
    "california-vs-illinois",
    "california-vs-massachusetts",
    // Country vs country
    "usa-vs-uk",
    "usa-vs-canada",
    "uk-vs-canada",
    "usa-vs-germany",
    "germany-vs-france",
    "uk-vs-germany",
    "usa-vs-singapore",
    "uae-vs-uk",
    "uae-vs-usa",
    "uk-vs-australia",
    "germany-vs-netherlands",
    "singapore-vs-hong-kong", // HK not in DB yet — will be skipped
    "canada-vs-australia",
    "japan-vs-uk",
  ];
  // Filter out pairs where either side doesn't exist in DB
  const valid: string[] = [];
  for (const pair of popularPairs) {
    const [a, b] = pair.split("-vs-");
    if (countrySlugs.includes(a) || countrySlugs.includes(b)) {
      // Resolve more flexibly (handles states too)
      const resolved = await parseComparison(pair);
      if (resolved) valid.push(pair);
    }
  }
  return valid;
}