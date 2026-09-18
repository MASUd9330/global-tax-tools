/**
 * Data access for sub-national tax jurisdictions (US states, future Canadian provinces, UK regions).
 */
import { prisma } from "@/lib/db";
import type { TaxBracket, TaxDeduction } from "@/lib/calc/tax";

export interface StateSummary {
  code: string;
  slug: string;
  name: string;
  countryCode: string;
  hasIncomeTax: boolean;
  taxType: string; // "progressive" | "flat" | "none"
  topMarginalRate: number | null;
  description: string | null;
}

export interface StateTaxData {
  state: StateSummary;
  brackets: TaxBracket[];
  standardDeduction: number; // applied as a flat deduction
  sourceUrl: string | null;
}

/** List states for a given country code (e.g. "US") */
export async function listStatesForCountry(countryCode: string): Promise<StateSummary[]> {
  const rows = await prisma.state.findMany({
    where: { country: { code: countryCode.toUpperCase() } },
    orderBy: { name: "asc" },
    select: {
      code: true,
      slug: true,
      name: true,
      hasIncomeTax: true,
      taxType: true,
      topMarginalRate: true,
      description: true,
      country: { select: { code: true } },
    },
  });
  return rows.map((r) => ({
    code: r.code,
    slug: r.slug,
    name: r.name,
    countryCode: r.country.code,
    hasIncomeTax: r.hasIncomeTax,
    taxType: r.taxType,
    topMarginalRate: r.topMarginalRate,
    description: r.description,
  }));
}

/** Get state by code (USPS) or slug */
export async function getState(
  countryCode: string,
  identifier: string
): Promise<StateSummary | null> {
  const upper = identifier.toUpperCase();
  const lower = identifier.toLowerCase();
  const row = await prisma.state.findFirst({
    where: {
      country: { code: countryCode.toUpperCase() },
      OR: [{ code: upper }, { slug: lower }],
    },
    select: {
      code: true,
      slug: true,
      name: true,
      hasIncomeTax: true,
      taxType: true,
      topMarginalRate: true,
      description: true,
      country: { select: { code: true } },
    },
  });
  if (!row) return null;
  return {
    code: row.code,
    slug: row.slug,
    name: row.name,
    countryCode: row.country.code,
    hasIncomeTax: row.hasIncomeTax,
    taxType: row.taxType,
    topMarginalRate: row.topMarginalRate,
    description: row.description,
  };
}

/** Get state tax data (brackets + deduction) for calculation */
export async function getStateTaxData(
  countryCode: string,
  identifier: string
): Promise<StateTaxData | null> {
  const upper = identifier.toUpperCase();
  const lower = identifier.toLowerCase();
  const row = await prisma.state.findFirst({
    where: {
      country: { code: countryCode.toUpperCase() },
      OR: [{ code: upper }, { slug: lower }],
    },
    include: { brackets: { orderBy: { orderIndex: "asc" } } },
  });
  if (!row) return null;
  return {
    state: {
      code: row.code,
      slug: row.slug,
      name: row.name,
      countryCode: row.countryId.toString(),
      hasIncomeTax: row.hasIncomeTax,
      taxType: row.taxType,
      topMarginalRate: row.topMarginalRate,
      description: row.description,
    },
    brackets: row.brackets.map((b) => ({
      lowerBound: b.lowerBound,
      upperBound: b.upperBound,
      rate: b.rate,
    })),
    standardDeduction: row.standardDeduction,
    sourceUrl: row.sourceUrl,
  };
}
