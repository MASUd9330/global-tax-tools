import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { z } from "zod";
import { calculateProgressiveTax } from "@/lib/calc/tax";
import { getCountry, getCountryTaxData, getLatestTaxYear } from "@/lib/data/country";
import { getStateTaxData } from "@/lib/data/state";
import { explain } from "@/lib/explain/explainer";

const BodySchema = z.object({
  country: z.string().min(2).max(3),
  state: z.string().min(2).max(40).optional(),
  income: z.number().nonnegative(),
  year: z.number().int().min(2000).max(2100).optional(),
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

  const { country, state, income } = parsed.data;
  let { year } = parsed.data;

  const countryInfo = await getCountry(country);
  if (!countryInfo) {
    return NextResponse.json({ error: `Country not found: ${country}` }, { status: 404 });
  }

  if (!year) {
    const latest = await getLatestTaxYear(country);
    year = latest ?? new Date().getFullYear();
  }

  // Recompute here so we own the result and the explanation (calc engine has no shared state)
  const data = await getCountryTaxData(country, year);
  let federalResult;
  let sourceUrl: string | null = null;
  let metaNotes: string | null = null;

  if (!data) {
    if (countryInfo.taxSystem === "none") {
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
        { error: `No tax data available for ${country} ${year}` },
        { status: 404 }
      );
    }
  } else {
    federalResult = calculateProgressiveTax(income, data.brackets, data.deductions);
    sourceUrl = data.sourceUrl;
    metaNotes = data.notes;
  }

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
      const stateDeductions = stateInfo.standardDeduction > 0
        ? [{ name: `${stateInfo.state.name} Standard Deduction`, type: "standard", amount: stateInfo.standardDeduction }]
        : [];
      stateResult = calculateProgressiveTax(income, stateInfo.brackets, stateDeductions);
    }
  }

  const explanation = explain({
    country: countryInfo,
    state: stateInfo ? { name: stateInfo.state.name, hasIncomeTax: stateInfo.state.hasIncomeTax } : null,
    year,
    income,
    currency: countryInfo.defaultCurrency,
    federal: federalResult,
    stateResult,
    sourceUrl,
    stateSourceUrl: stateInfo?.sourceUrl ?? null,
    metaNotes,
  });

  return NextResponse.json({
    input: { country: countryInfo, state: stateInfo?.state ?? null, year, income },
    explanation,
  });
}