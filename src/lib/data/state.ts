/**
 * US State data layer — STATIC (no DB queries).
 */

import { US_STATES, US_STATES_BY_CODE, US_STATES_BY_SLUG, type StaticState } from "@/data/static/states";

export interface StateSummary {
  code: string;
  slug: string;
  name: string;
  countryCode: string;
  countryName: string;
  hasIncomeTax: boolean;
  taxType: string;
  topMarginalRate: number | null;
  description: string | null;
}

export interface StateTaxData {
  state: StateSummary;
  brackets: Array<{ lowerBound: number; upperBound: number | null; rate: number }>;
  standardDeduction: number;
  sourceUrl: string | null;
}

export function listStatesForCountry(countryCode: string): StateSummary[] {
  if (countryCode.toUpperCase() !== "US") return [];
  return [...US_STATES]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((s) => ({
      code: s.code,
      slug: s.slug,
      name: s.name,
      countryCode: "US",
      countryName: "United States",
      hasIncomeTax: s.hasIncomeTax,
      taxType: s.taxType,
      topMarginalRate: s.topMarginalRate,
      description: s.description,
    }));
}

export function getState(countryCode: string, identifier: string): StateSummary | null {
  if (countryCode.toUpperCase() !== "US") return null;
  const upper = identifier.toUpperCase();
  const lower = identifier.toLowerCase();
  const s = US_STATES_BY_CODE[upper] || US_STATES_BY_SLUG[lower];
  if (!s) return null;
  return {
    code: s.code,
    slug: s.slug,
    name: s.name,
    countryCode: "US",
    countryName: "United States",
    hasIncomeTax: s.hasIncomeTax,
    taxType: s.taxType,
    topMarginalRate: s.topMarginalRate,
    description: s.description,
  };
}

export function getStateTaxData(countryCode: string, identifier: string): StateTaxData | null {
  if (countryCode.toUpperCase() !== "US") return null;
  const upper = identifier.toUpperCase();
  const lower = identifier.toLowerCase();
  const s = US_STATES_BY_CODE[upper] || US_STATES_BY_SLUG[lower];
  if (!s) return null;
  return {
    state: {
      code: s.code,
      slug: s.slug,
      name: s.name,
      countryCode: "US",
      countryName: "United States",
      hasIncomeTax: s.hasIncomeTax,
      taxType: s.taxType,
      topMarginalRate: s.topMarginalRate,
      description: s.description,
    },
    brackets: s.brackets.map((b) => ({
      lowerBound: b.lowerBound,
      upperBound: b.upperBound,
      rate: b.rate,
    })),
    standardDeduction: s.standardDeduction,
    sourceUrl: s.sourceUrl,
  };
}
