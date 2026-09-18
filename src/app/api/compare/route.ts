import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { parseComparison, calculateForSide, buildPairSlug } from "@/lib/data/compare";
import { getLatestTaxYear } from "@/lib/data/country";

const BodySchema = z.object({
  pair: z.string().min(3).max(100), // "X-vs-Y"
  income: z.number().nonnegative(),
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
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  }
  const { pair, income } = parsed.data;

  const resolved = await parseComparison(pair);
  if (!resolved) {
    return NextResponse.json({ error: `Could not resolve comparison: ${pair}` }, { status: 404 });
  }

  const fallbackYear = new Date().getFullYear();
  // For US states, always use the US federal tax year (2025)
  const usYear = (await getLatestTaxYear("US")) ?? fallbackYear;
  const leftYear =
    resolved.left.type === "country"
      ? (await getLatestTaxYear(resolved.left.slug)) ?? usYear
      : resolved.left.countryCode === "US"
        ? usYear
        : fallbackYear;
  const rightYear =
    resolved.right.type === "country"
      ? (await getLatestTaxYear(resolved.right.slug)) ?? usYear
      : resolved.right.countryCode === "US"
        ? usYear
        : fallbackYear;

  const [leftResult, rightResult] = await Promise.all([
    calculateForSide(resolved.left, income, leftYear),
    calculateForSide(resolved.right, income, rightYear),
  ]);

  if (!leftResult || !rightResult) {
    console.error("calculateForSide returned null", { left: resolved.left, right: resolved.right, leftResult, rightResult });
    return NextResponse.json(
      { error: "Could not calculate for both sides", left: resolved.left, right: resolved.right },
      { status: 500 }
    );
  }

  return NextResponse.json({
    pair: buildPairSlug(resolved.left, resolved.right),
    income,
    left: leftResult,
    right: rightResult,
    summary: {
      winner: leftResult.totalTax < rightResult.totalTax ? resolved.left.slug : resolved.right.slug,
      difference: Math.abs(leftResult.totalTax - rightResult.totalTax),
    },
  });
}