/**
 * Country data layer — STATIC (no DB queries).
 * Reads from `src/data/static/countries.ts`.
 */

import { COUNTRIES, COUNTRIES_BY_CODE, COUNTRIES_BY_SLUG, type StaticCountry, type StaticTaxBracket, type StaticDeduction } from "@/data/static/countries";

export type { StaticTaxBracket, StaticDeduction };

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
  brackets: StaticTaxBracket[];
  deductions: StaticDeduction[];
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

function toSummary(c: StaticCountry): CountrySummary {
  return {
    code: c.code,
    slug: c.slug,
    name: c.name,
    region: c.region,
    defaultCurrency: c.defaultCurrency,
    flagEmoji: c.flagEmoji,
    taxSystem: c.taxSystem,
    description: c.description,
  };
}

export function listCountries(): CountrySummary[] {
  return [...COUNTRIES].sort((a, b) => a.name.localeCompare(b.name)).map(toSummary);
}

export function getCountry(identifier: string): CountrySummary | null {
  const upper = identifier.toUpperCase();
  const lower = identifier.toLowerCase();
  return COUNTRIES_BY_CODE[upper] || COUNTRIES_BY_SLUG[lower]
    ? toSummary(COUNTRIES_BY_CODE[upper] || COUNTRIES_BY_SLUG[lower])
    : null;
}

export function getCountryTaxData(
  identifier: string,
  year: number,
  taxType = "income_tax"
): CountryTaxData | null {
  const upper = identifier.toUpperCase();
  const lower = identifier.toLowerCase();
  const c = COUNTRIES_BY_CODE[upper] || COUNTRIES_BY_SLUG[lower];
  if (!c || c.taxSystem === "none" || !c.taxRule) return null;
  if (c.taxRule.year !== year) return null;
  if (c.taxRule.type !== taxType) return null;

  return {
    country: toSummary(c),
    year: c.taxRule.year,
    taxType: c.taxRule.type,
    brackets: c.taxRule.brackets,
    deductions: c.taxRule.deductions,
    sourceUrl: c.sourceUrl,
    notes: c.description,
    lastUpdated: new Date(),
  };
}

export function getSalaryConfig(identifier: string, _year: number): SalaryConfigData | null {
  const upper = identifier.toUpperCase();
  const lower = identifier.toLowerCase();
  const c = COUNTRIES_BY_CODE[upper] || COUNTRIES_BY_SLUG[lower];
  if (!c || !c.salaryConfig) return null;
  return {
    employeeSocialRate: c.salaryConfig.employeeSocialRate,
    employerSocialRate: c.salaryConfig.employerSocialRate,
    socialCap: c.salaryConfig.socialCap,
    healthcareRate: c.salaryConfig.healthcareRate,
    healthcareCap: c.salaryConfig.healthcareCap,
    notes: null,
  };
}

export function getLatestTaxYear(_identifier: string): number | null {
  // Static data only has 2025 — return that
  return 2025;
}

export function getCountryRaw(identifier: string): StaticCountry | null {
  const upper = identifier.toUpperCase();
  const lower = identifier.toLowerCase();
  return COUNTRIES_BY_CODE[upper] || COUNTRIES_BY_SLUG[lower] || null;
}
