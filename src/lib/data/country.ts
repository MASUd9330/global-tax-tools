/**
 * Data access layer for tax rules.
 * Loads published tax rules for a given country + year from the DB.
 * Pure functions that return plain objects (no Prisma types leaking).
 */
import { prisma } from "@/lib/db";
import type { TaxBracket, TaxDeduction } from "@/lib/calc/tax";

export interface CountrySummary {
  code: string;
  slug: string;
  name: string;
  region: string;
  defaultCurrency: string;
  flagEmoji: string | null;
  taxSystem: string;
  description: string | null;
}

export interface CountryTaxData {
  country: CountrySummary;
  year: number;
  taxType: string;
  brackets: TaxBracket[];
  deductions: TaxDeduction[];
  sourceUrl: string | null;
  notes: string | null;
  lastUpdated: Date;
}

export interface SalaryConfigData {
  employeeSocialRate: number;
  employerSocialRate: number;
  socialCap: number | null;
  healthcareRate: number;
  healthcareCap: number | null;
  notes: string | null;
}

/** List all countries (lightweight, for nav/selector) */
export async function listCountries(): Promise<CountrySummary[]> {
  const rows = await prisma.country.findMany({
    orderBy: { name: "asc" },
    select: {
      code: true,
      slug: true,
      name: true,
      region: true,
      defaultCurrency: true,
      flagEmoji: true,
      taxSystem: true,
      description: true,
    },
  });
  return rows;
}

/** Get country by code or slug */
export async function getCountry(identifier: string): Promise<CountrySummary | null> {
  const row = await prisma.country.findFirst({
    where: {
      OR: [{ code: identifier.toUpperCase() }, { slug: identifier.toLowerCase() }],
    },
    select: {
      code: true,
      slug: true,
      name: true,
      region: true,
      defaultCurrency: true,
      flagEmoji: true,
      taxSystem: true,
      description: true,
    },
  });
  return row;
}

/** Get latest published tax rule for a country + year */
export async function getCountryTaxData(
  identifier: string,
  year: number,
  taxType = "income_tax"
): Promise<CountryTaxData | null> {
  const country = await getCountry(identifier);
  if (!country) return null;

  const rule = await prisma.taxRule.findFirst({
    where: {
      country: { OR: [{ code: identifier.toUpperCase() }, { slug: identifier.toLowerCase() }] },
      year,
      type: taxType,
      status: "published",
    },
    orderBy: { version: "desc" },
    include: {
      brackets: { orderBy: { orderIndex: "asc" } },
      deductions: true,
    },
  });

  if (!rule) return null;

  return {
    country,
    year,
    taxType,
    brackets: rule.brackets.map((b) => ({
      lowerBound: b.lowerBound,
      upperBound: b.upperBound,
      rate: b.rate,
      fixedAmount: b.fixedAmount,
    })),
    deductions: rule.deductions.map((d) => ({
      name: d.name,
      type: d.type,
      amount: d.amount,
      percentage: d.percentage,
      conditions: d.conditions ? JSON.parse(d.conditions) : null,
    })),
    sourceUrl: rule.sourceUrl,
    notes: rule.notes,
    lastUpdated: rule.publishedAt || rule.updatedAt,
  };
}

/** Get salary config for a country + year */
export async function getSalaryConfig(
  identifier: string,
  year: number
): Promise<SalaryConfigData | null> {
  const row = await prisma.salaryConfig.findFirst({
    where: {
      country: { OR: [{ code: identifier.toUpperCase() }, { slug: identifier.toLowerCase() }] },
      year,
    },
  });
  if (!row) return null;
  return {
    employeeSocialRate: row.employeeSocialRate,
    employerSocialRate: row.employerSocialRate,
    socialCap: row.socialCap,
    healthcareRate: row.healthcareRate ?? 0,
    healthcareCap: row.healthcareCap,
    notes: row.notes,
  };
}

/** Get latest available tax year for a country */
export async function getLatestTaxYear(identifier: string): Promise<number | null> {
  const row = await prisma.taxRule.findFirst({
    where: {
      country: { OR: [{ code: identifier.toUpperCase() }, { slug: identifier.toLowerCase() }] },
      status: "published",
    },
    orderBy: { year: "desc" },
    select: { year: true },
  });
  return row?.year ?? null;
}