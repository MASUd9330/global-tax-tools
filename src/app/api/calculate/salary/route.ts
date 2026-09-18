import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { calculateSalary } from "@/lib/calc/salary";
import {
  getCountryTaxData,
  getSalaryConfig,
  getLatestTaxYear,
} from "@/lib/data/country";

const BodySchema = z.object({
  country: z.string().min(2).max(3),
  grossIncome: z.number().nonnegative(),
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

  const { country, grossIncome } = parsed.data;
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

  const [taxData, salaryConfig] = await Promise.all([
    getCountryTaxData(country, year),
    getSalaryConfig(country, year),
  ]);

  if (!taxData) {
    return NextResponse.json(
      { error: `No tax data for ${country} ${year}` },
      { status: 404 }
    );
  }
  if (!salaryConfig) {
    return NextResponse.json(
      { error: `No salary config for ${country} ${year}` },
      { status: 404 }
    );
  }

  const result = calculateSalary({
    grossIncome,
    brackets: taxData.brackets,
    deductions: taxData.deductions,
    employeeSocialRate: salaryConfig.employeeSocialRate,
    socialCap: salaryConfig.socialCap,
    healthcareRate: salaryConfig.healthcareRate,
    healthcareCap: salaryConfig.healthcareCap,
  });

  return NextResponse.json({
    input: { country: taxData.country, year, grossIncome },
    meta: {
      sourceUrl: taxData.sourceUrl,
      currency: taxData.country.defaultCurrency,
      notes: salaryConfig.notes,
    },
    result,
  });
}