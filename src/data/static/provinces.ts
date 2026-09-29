/**
 * Canadian provinces & territories — 2025 provincial/territorial tax brackets.
 *
 * Combined with the federal Canada tax (already in countries.ts: progressive
 * 15-33% brackets on $55,867-$246,752 with $15,705 basic personal amount).
 *
 * Each province is essentially its own progressive tax system stacked on the
 * federal tax. This file provides the provincial portion; the calculator
 * sums federal + provincial.
 */

import type { StaticTaxBracket, StaticDeduction } from "./countries";

export interface StaticProvince {
  code: string;            // 2-letter (ON, QC, BC, AB, etc.)
  slug: string;
  name: string;
  countryCode: string;     // always "CA"
  hasIncomeTax: boolean;
  taxType: "progressive" | "flat" | "none";
  standardDeduction: number;  // provincial-specific basic personal amount
  topMarginalRate: number | null;
  description: string;
  sourceUrl: string;
  organization: string;
  brackets: StaticTaxBracket[];  // provincial brackets only (combined with federal at calc time)
  // Quebec: federal surtax A (was 0% in 2024+); specific Quebec abatement handled separately
  hasQuebecAbatement?: boolean;
}

export const CA_PROVINCES: StaticProvince[] = [
  {
    code: "ON", slug: "ontario", name: "Ontario",
    countryCode: "CA", hasIncomeTax: true, taxType: "progressive",
    standardDeduction: 12399, topMarginalRate: 0.1316,
    description: "Ontario provincial income tax. 2025 brackets stacked on federal tax.",
    sourceUrl: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/canada-revenue-agency-cra-individuals-tax-instalment-interest-rates.html",
    organization: "CRA / Ontario Ministry of Finance",
    brackets: [
      { lowerBound: 0, upperBound: 52886, rate: 0.0505 },
      { lowerBound: 52886, upperBound: 105775, rate: 0.0915 },
      { lowerBound: 105775, upperBound: 150000, rate: 0.1116 },
      { lowerBound: 150000, upperBound: 220000, rate: 0.1216 },
      { lowerBound: 220000, upperBound: null, rate: 0.1316 },
    ],
  },
  {
    code: "QC", slug: "quebec", name: "Quebec",
    countryCode: "CA", hasIncomeTax: true, taxType: "progressive",
    standardDeduction: 18056, topMarginalRate: 0.2565,
    description: "Quebec provincial income tax (highest in Canada). 2025 brackets. Includes Quebec abatement (-16.5% of federal tax).",
    sourceUrl: "https://www.revenuquebec.ca/en/citizens/your-situation/workers/",
    organization: "Revenu Québec",
    brackets: [
      { lowerBound: 0, upperBound: 53255, rate: 0.14 },
      { lowerBound: 53255, upperBound: 106495, rate: 0.19 },
      { lowerBound: 106495, upperBound: 129590, rate: 0.24 },
      { lowerBound: 129590, upperBound: null, rate: 0.2575 },
    ],
    hasQuebecAbatement: true,
  },
  {
    code: "BC", slug: "british-columbia", name: "British Columbia",
    countryCode: "CA", hasIncomeTax: true, taxType: "progressive",
    standardDeduction: 12932, topMarginalRate: 0.20,
    description: "BC provincial income tax. 2025 brackets stacked on federal.",
    sourceUrl: "https://www2.gov.bc.ca/gov/content/taxes/income-taxes/personal",
    organization: "BC Ministry of Finance",
    brackets: [
      { lowerBound: 0, upperBound: 49279, rate: 0.0506 },
      { lowerBound: 49279, upperBound: 98560, rate: 0.077 },
      { lowerBound: 98560, upperBound: 113158, rate: 0.105 },
      { lowerBound: 113158, upperBound: 137407, rate: 0.1229 },
      { lowerBound: 137407, upperBound: 186306, rate: 0.147 },
      { lowerBound: 186306, upperBound: 259829, rate: 0.168 },
      { lowerBound: 259829, upperBound: null, rate: 0.205 },
    ],
  },
  {
    code: "AB", slug: "alberta", name: "Alberta",
    countryCode: "CA", hasIncomeTax: true, taxType: "progressive",
    standardDeduction: 22323, topMarginalRate: 0.15,
    description: "Alberta provincial income tax (flat-style). 2025 brackets, single filer.",
    sourceUrl: "https://www.alberta.ca/personal-income-tax.aspx",
    organization: "Alberta Tax and Revenue Administration",
    brackets: [
      { lowerBound: 0, upperBound: 151234, rate: 0.10 },
      { lowerBound: 151234, upperBound: 181481, rate: 0.12 },
      { lowerBound: 181481, upperBound: 241974, rate: 0.13 },
      { lowerBound: 241974, upperBound: null, rate: 0.15 },
    ],
  },
  {
    code: "SK", slug: "saskatchewan", name: "Saskatchewan",
    countryCode: "CA", hasIncomeTax: true, taxType: "progressive",
    standardDeduction: 18491, topMarginalRate: 0.145,
    description: "Saskatchewan provincial income tax. 2025 brackets.",
    sourceUrl: "https://www.saskatchewan.ca/business-tax-information",
    organization: "Saskatchewan Ministry of Finance",
    brackets: [
      { lowerBound: 0, upperBound: 53463, rate: 0.105 },
      { lowerBound: 53463, upperBound: 152750, rate: 0.125 },
      { lowerBound: 152750, upperBound: null, rate: 0.145 },
    ],
  },
  {
    code: "MB", slug: "manitoba", name: "Manitoba",
    countryCode: "CA", hasIncomeTax: true, taxType: "progressive",
    standardDeduction: 15780, topMarginalRate: 0.174,
    description: "Manitoba provincial income tax. 2025 brackets.",
    sourceUrl: "https://www.gov.mb.ca/finance/taxation/taxes/personal.html",
    organization: "Manitoba Finance",
    brackets: [
      { lowerBound: 0, upperBound: 47000, rate: 0.108 },
      { lowerBound: 47000, upperBound: 100000, rate: 0.1275 },
      { lowerBound: 100000, upperBound: null, rate: 0.174 },
    ],
  },
  {
    code: "NB", slug: "new-brunswick", name: "New Brunswick",
    countryCode: "CA", hasIncomeTax: true, taxType: "progressive",
    standardDeduction: 13844, topMarginalRate: 0.196,
    description: "New Brunswick provincial income tax. 2025 brackets.",
    sourceUrl: "https://www2.gnb.ca/content/gnb/en/departments/finance/taxes.html",
    organization: "NB Department of Finance",
    brackets: [
      { lowerBound: 0, upperBound: 51306, rate: 0.094 },
      { lowerBound: 51306, upperBound: 102614, rate: 0.14 },
      { lowerBound: 102614, upperBound: 190060, rate: 0.16 },
      { lowerBound: 190060, upperBound: null, rate: 0.196 },
    ],
  },
  {
    code: "NS", slug: "nova-scotia", name: "Nova Scotia",
    countryCode: "CA", hasIncomeTax: true, taxType: "progressive",
    standardDeduction: 11481, topMarginalRate: 0.21,
    description: "Nova Scotia provincial income tax (second highest in Canada). 2025 brackets.",
    sourceUrl: "https://beta.novascotia.ca/government/taxes",
    organization: "NS Department of Finance",
    brackets: [
      { lowerBound: 0, upperBound: 29590, rate: 0.0879 },
      { lowerBound: 29590, upperBound: 59180, rate: 0.1495 },
      { lowerBound: 59180, upperBound: 93000, rate: 0.1667 },
      { lowerBound: 93000, upperBound: 150000, rate: 0.175 },
      { lowerBound: 150000, upperBound: null, rate: 0.21 },
    ],
  },
  {
    code: "PE", slug: "prince-edward-island", name: "Prince Edward Island",
    countryCode: "CA", hasIncomeTax: true, taxType: "progressive",
    standardDeduction: 12000, topMarginalRate: 0.19,
    description: "PEI provincial income tax. 2025 brackets.",
    sourceUrl: "https://www.princeedwardisland.ca/en/topic/taxes",
    organization: "PEI Department of Finance",
    brackets: [
      { lowerBound: 0, upperBound: 32656, rate: 0.098 },
      { lowerBound: 32656, upperBound: 64313, rate: 0.138 },
      { lowerBound: 64313, upperBound: null, rate: 0.19 },
    ],
  },
  {
    code: "NL", slug: "newfoundland-and-labrador", name: "Newfoundland and Labrador",
    countryCode: "CA", hasIncomeTax: true, taxType: "progressive",
    standardDeduction: 10818, topMarginalRate: 0.218,
    description: "NL provincial income tax (highest top rate in Atlantic Canada). 2025 brackets.",
    sourceUrl: "https://www.gov.nl.ca/fin/tax/",
    organization: "NL Department of Finance",
    brackets: [
      { lowerBound: 0, upperBound: 43198, rate: 0.087 },
      { lowerBound: 43198, upperBound: 86395, rate: 0.145 },
      { lowerBound: 86395, upperBound: 154244, rate: 0.158 },
      { lowerBound: 154244, upperBound: 215943, rate: 0.178 },
      { lowerBound: 215943, upperBound: null, rate: 0.218 },
    ],
  },
  {
    code: "YT", slug: "yukon", name: "Yukon",
    countryCode: "CA", hasIncomeTax: true, taxType: "progressive",
    standardDeduction: 15750, topMarginalRate: 0.15,
    description: "Yukon territorial income tax. 2025 brackets.",
    sourceUrl: "https://yukon.ca/en/doing-business/taxes",
    organization: "Yukon Department of Finance",
    brackets: [
      { lowerBound: 0, upperBound: 57375, rate: 0.064 },
      { lowerBound: 57375, upperBound: 114750, rate: 0.09 },
      { lowerBound: 114750, upperBound: 158125, rate: 0.109 },
      { lowerBound: 158125, upperBound: 500000, rate: 0.128 },
      { lowerBound: 500000, upperBound: null, rate: 0.15 },
    ],
  },
  {
    code: "NT", slug: "northwest-territories", name: "Northwest Territories",
    countryCode: "CA", hasIncomeTax: true, taxType: "progressive",
    standardDeduction: 16593, topMarginalRate: 0.14,
    description: "NWT territorial income tax (lowest top rate in Canada). 2025 brackets.",
    sourceUrl: "https://www.fin.gov.nt.ca/en/services/taxes",
    organization: "NT Department of Finance",
    brackets: [
      { lowerBound: 0, upperBound: 50522, rate: 0.059 },
      { lowerBound: 50522, upperBound: 101033, rate: 0.086 },
      { lowerBound: 101033, upperBound: 164549, rate: 0.122 },
      { lowerBound: 164549, upperBound: null, rate: 0.14 },
    ],
  },
  {
    code: "NU", slug: "nunavut", name: "Nunavut",
    countryCode: "CA", hasIncomeTax: true, taxType: "progressive",
    standardDeduction: 17925, topMarginalRate: 0.115,
    description: "Nunavut territorial income tax (lowest in Canada — 11.5% top). 2025 brackets.",
    sourceUrl: "https://www.gov.nu.ca/finance",
    organization: "Nunavut Department of Finance",
    brackets: [
      { lowerBound: 0, upperBound: 53826, rate: 0.04 },
      { lowerBound: 53826, upperBound: 107653, rate: 0.07 },
      { lowerBound: 107653, upperBound: 175055, rate: 0.09 },
      { lowerBound: 175055, upperBound: null, rate: 0.115 },
    ],
  },
];

// Quick lookup
export const PROVINCES_BY_CODE: Record<string, StaticProvince> = Object.fromEntries(
  CA_PROVINCES.map((p) => [p.code, p])
);
export const PROVINCES_BY_SLUG: Record<string, StaticProvince> = Object.fromEntries(
  CA_PROVINCES.map((p) => [p.slug, p])
);
export const PROVINCE_LIST = CA_PROVINCES;