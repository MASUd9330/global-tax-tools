import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { calculateProgressiveTax } from "@/lib/calc/tax";
import { getCountryTaxData, getLatestTaxYear } from "@/lib/data/country";

const BodySchema = z.object({
  country: z.string().min(2).max(3), // "US" or "usa"
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

  const { country, income, taxType } = parsed.data;
  let { year } = parsed.data;
  if (!year) {
    const latest = await getLatestTaxYear(country);
    if (!latest) {
      return NextResponse.json(
        { error: `No tax data available for ${country}` },
        { status: 404 }
      );
    }
    year = latest;
  }

  const data = await getCountryTaxData(country, year, taxType);
  if (!data) {
    return NextResponse.json(
      { error: `No ${taxType} data for ${country} ${year}` },
      { status: 404 }
    );
  }

  const result = calculateProgressiveTax(income, data.brackets, data.deductions);

  return NextResponse.json({
    input: { country: data.country, year: data.year, taxType, income },
    meta: {
      sourceUrl: data.sourceUrl,
      notes: data.notes,
      lastUpdated: data.lastUpdated,
      currency: data.country.defaultCurrency,
    },
    result,
  });
}