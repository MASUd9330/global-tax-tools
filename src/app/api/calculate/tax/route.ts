import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { calculateProgressiveTax } from "@/lib/calc/tax";
import { getCountry, getCountryTaxData, getLatestTaxYear } from "@/lib/data/country";
import { getStateTaxData } from "@/lib/data/state";

const BodySchema = z.object({
  country: z.string().min(2).max(3), // "US" or "usa"
  state: z.string().min(2).max(40).optional(), // state code or slug
  income: z.number().nonnegative(),
  year: z.number().int().min(2000).max(2100).optional(),
  taxType: z.string().default("income_tax"),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { country, state, income, taxType } = parsed.data;
  let { year } = parsed.data;

  // First, check the country exists and get its tax system
  const countryInfo = await getCountry(country);
  if (!countryInfo) {
    return NextResponse.json({ error: `Country not found: ${country}` }, { status: 404 });
  }

  if (!year) {
    const latest = await getLatestTaxYear(country);
    if (latest) {
      year = latest;
    } else if (countryInfo.taxSystem === "none") {
      // No-tax countries may have no TaxRule record; use current year
      year = new Date().getFullYear();
    } else {
      return NextResponse.json(
        { error: `No tax data available for ${country}` },
        { status: 404 }
      );
    }
  }

  // Federal / country-level tax
  // Handle no-tax countries (UAE etc.) by returning zero tax instead of 404
  const data = await getCountryTaxData(country, year, taxType);
  let federalResult;
  let metaSourceUrl: string | null = null;
  let metaNotes: string | null = null;
  let metaLastUpdated: Date = new Date();

  if (!data) {
    if (countryInfo.taxSystem === "none") {
      // No-tax country: zero federal income tax
      federalResult = {
        grossIncome: income,
        taxableIncome: income,
        totalTax: 0,
        effectiveRate: 0,
        marginalRate: 0,
        breakdown: [],
        deductionsApplied: [],
      };
    } else {
      return NextResponse.json(
        { error: `No ${taxType} data for ${country} ${year}` },
        { status: 404 }
      );
    }
  } else {
    federalResult = calculateProgressiveTax(income, data.brackets, data.deductions);
    metaSourceUrl = data.sourceUrl;
    metaNotes = data.notes;
    metaLastUpdated = data.lastUpdated;
  }

  // State tax (optional, country must match state country)
  let stateResult: ReturnType<typeof calculateProgressiveTax> | null = null;
  let stateInfo: Awaited<ReturnType<typeof getStateTaxData>> | null = null;
  if (state) {
    stateInfo = await getStateTaxData(country, state);
    if (!stateInfo) {
      return NextResponse.json(
        { error: `No state data for ${state} in ${country}` },
        { status: 404 }
      );
    }
    if (stateInfo.state.hasIncomeTax) {
      const stateDeductions: { name: string; type: string; amount: number }[] = stateInfo.standardDeduction > 0
        ? [{ name: `${stateInfo.state.name} Standard Deduction`, type: "standard", amount: stateInfo.standardDeduction }]
        : [];
      stateResult = calculateProgressiveTax(income, stateInfo.brackets, stateDeductions);
    }
  }

  // Combined totals
  const stateTaxTotal = stateResult?.totalTax ?? 0;
  const combinedTotalTax = federalResult.totalTax + stateTaxTotal;
  const combinedEffectiveRate = income > 0 ? combinedTotalTax / income : 0;

  return NextResponse.json({
    input: { country: countryInfo, state: stateInfo?.state ?? null, year, taxType, income },
    meta: {
      sourceUrl: metaSourceUrl,
      stateSourceUrl: stateInfo?.sourceUrl ?? null,
      notes: metaNotes,
      lastUpdated: metaLastUpdated,
      currency: countryInfo.defaultCurrency,
    },
    result: {
      federal: federalResult,
      state: stateResult,
      grossIncome: income,
      totalTax: combinedTotalTax,
      effectiveRate: combinedEffectiveRate,
      netIncome: income - combinedTotalTax,
    },
  });
}