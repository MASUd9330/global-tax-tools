import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { z } from "zod";
import { calculateProgressiveTax } from "@/lib/calc/tax";
import { getCountry, getCountryTaxData } from "@/lib/data/country";
import { getHistoricalForCountry } from "@/data/static/historical";

const BodySchema = z.object({
  country: z.string().min(2).max(3),
  income: z.number().nonnegative(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  const { country, income } = parsed.data;

  const countryInfo = await getCountry(country);
  if (!countryInfo) {
    return NextResponse.json({ error: `Country not found: ${country}` }, { status: 404 });
  }

  // 2025 (current)
  const data2025 = await getCountryTaxData(country, 2025);
  let tax2025 = 0;
  let eff2025 = 0;
  let margin2025 = 0;
  let brackets2025 = 0;

  if (data2025) {
    const r = calculateProgressiveTax(income, data2025.brackets, data2025.deductions);
    tax2025 = r.totalTax;
    eff2025 = r.effectiveRate;
    margin2025 = r.marginalRate;
    brackets2025 = data2025.brackets.length;
  } else if (countryInfo.taxSystem === "none") {
    tax2025 = 0;
    eff2025 = 0;
    margin2025 = 0;
    brackets2025 = 0;
  } else {
    return NextResponse.json({ error: "No 2025 data" }, { status: 404 });
  }

  // 2024 (historical)
  const hist2024 = getHistoricalForCountry(country, 2024);
  let tax2024 = 0;
  let eff2024 = 0;
  let margin2024 = 0;

  if (hist2024) {
    const r = calculateProgressiveTax(income, hist2024.brackets, hist2024.deductions);
    tax2024 = r.totalTax;
    eff2024 = r.effectiveRate;
    margin2024 = r.marginalRate;
  } else if (countryInfo.taxSystem === "none") {
    tax2024 = 0;
  } else {
    // No 2024 data — return null so UI can show "—"
  }

  const deltaTax = tax2025 - tax2024;
  const deltaEff = (eff2025 - eff2024) * 100;
  const direction: "up" | "down" | "flat" =
    Math.abs(deltaTax) < 1 ? "flat" : deltaTax > 0 ? "up" : "down";

  return NextResponse.json({
    country: { code: countryInfo.code, name: countryInfo.name, currency: countryInfo.defaultCurrency },
    income,
    year2024: { tax: tax2024, effectiveRate: eff2024, marginalRate: margin2024, available: hist2024 !== null },
    year2025: { tax: tax2025, effectiveRate: eff2025, marginalRate: margin2025, bracketCount: brackets2025 },
    delta: { tax: deltaTax, effectiveRatePp: deltaEff, direction },
    summary: summarize(countryInfo.name, income, countryInfo.defaultCurrency, tax2024, tax2025, deltaTax, direction),
  });
}

function summarize(
  name: string,
  income: number,
  currency: string,
  tax2024: number,
  tax2025: number,
  delta: number,
  direction: "up" | "down" | "flat"
): string {
  if (direction === "flat") {
    return `Tax burden in ${name} at ${currency} ${Math.round(income).toLocaleString()} did not change from 2024 to 2025.`;
  }
  const pct = tax2024 > 0 ? (delta / tax2024) * 100 : 0;
  const arrow = direction === "up" ? "↑" : "↓";
  const verb = direction === "up" ? "increased" : "decreased";
  return `Tax burden in ${name} at ${currency} ${Math.round(income).toLocaleString()} ${verb} ${arrow} by ${currency} ${Math.abs(Math.round(delta)).toLocaleString()} (${pct.toFixed(1)}%) from 2024 to 2025.`;
}