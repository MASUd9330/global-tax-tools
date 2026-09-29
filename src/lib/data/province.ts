/**
 * Canadian province data adapter — STATIC (no DB queries).
 * Reads from `src/data/static/provinces.ts`.
 */

import {
  PROVINCES_BY_CODE,
  PROVINCES_BY_SLUG,
  PROVINCE_LIST,
  type StaticProvince,
} from "@/data/static/provinces";
import type { StaticTaxBracket, StaticDeduction } from "@/data/static/countries";

export type { StaticProvince };

export interface ProvinceSummary {
  code: string;
  slug: string;
  name: string;
  countryCode: string;
  hasIncomeTax: boolean;
  taxType: string;
  standardDeduction: number;
  topMarginalRate: number | null;
  description: string | null;
}

export interface ProvinceTaxData {
  province: ProvinceSummary;
  brackets: StaticTaxBracket[];
  deductions: StaticDeduction[];
  sourceUrl: string | null;
  organization: string;
  hasQuebecAbatement: boolean;
  lastUpdated: Date;
}

function toSummary(p: StaticProvince): ProvinceSummary {
  return {
    code: p.code,
    slug: p.slug,
    name: p.name,
    countryCode: p.countryCode,
    hasIncomeTax: p.hasIncomeTax,
    taxType: p.taxType,
    standardDeduction: p.standardDeduction,
    topMarginalRate: p.topMarginalRate,
    description: p.description,
  };
}

export function listProvinces(): ProvinceSummary[] {
  return [...PROVINCE_LIST]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(toSummary);
}

export function getProvince(identifier: string): ProvinceSummary | null {
  const upper = identifier.toUpperCase();
  const lower = identifier.toLowerCase();
  const p = PROVINCES_BY_CODE[upper] || PROVINCES_BY_SLUG[lower];
  return p ? toSummary(p) : null;
}

export function getProvinceTaxData(identifier: string): ProvinceTaxData | null {
  const upper = identifier.toUpperCase();
  const lower = identifier.toLowerCase();
  const p = PROVINCES_BY_CODE[upper] || PROVINCES_BY_SLUG[lower];
  if (!p) return null;
  return {
    province: toSummary(p),
    brackets: p.brackets,
    deductions: [{ name: `${p.name} Basic Personal Amount`, type: "personal", amount: p.standardDeduction }],
    sourceUrl: p.sourceUrl,
    organization: p.organization,
    hasQuebecAbatement: p.hasQuebecAbatement ?? false,
    lastUpdated: new Date(),
  };
}

export function getProvinceRaw(identifier: string): StaticProvince | null {
  const upper = identifier.toUpperCase();
  const lower = identifier.toLowerCase();
  return PROVINCES_BY_CODE[upper] || PROVINCES_BY_SLUG[lower] || null;
}