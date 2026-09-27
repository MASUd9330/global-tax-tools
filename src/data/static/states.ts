/**
 * Static US state data — 29 states × 2025.
 * No-Tax states: AK, FL, NV, SD, TN, TX, WY (7 states)
 */

import type { StaticTaxBracket } from "./countries";

export interface StaticState {
  code: string;
  slug: string;
  name: string;
  hasIncomeTax: boolean;
  taxType: string; // progressive | flat | none
  standardDeduction: number;
  topMarginalRate: number | null;
  description: string;
  sourceUrl: string;
  brackets: StaticTaxBracket[]; // empty for no-tax states
}

export const US_STATES: StaticState[] = [
  // === NO-TAX STATES ===
  {
    code: "AK", slug: "alaska", name: "Alaska", hasIncomeTax: false, taxType: "none",
    standardDeduction: 0, topMarginalRate: null,
    description: "Alaska has no state personal income tax. Only federal income tax applies.",
    sourceUrl: "https://dor.alaska.gov/", brackets: [],
  },
  {
    code: "FL", slug: "florida", name: "Florida", hasIncomeTax: false, taxType: "none",
    standardDeduction: 0, topMarginalRate: null,
    description: "Florida has no state personal income tax. Only federal income tax applies.",
    sourceUrl: "https://floridarevenue.com", brackets: [],
  },
  {
    code: "NV", slug: "nevada", name: "Nevada", hasIncomeTax: false, taxType: "none",
    standardDeduction: 0, topMarginalRate: null,
    description: "Nevada has no state personal income tax. Only federal income tax applies.",
    sourceUrl: "https://tax.nv.gov/", brackets: [],
  },
  {
    code: "SD", slug: "south-dakota", name: "South Dakota", hasIncomeTax: false, taxType: "none",
    standardDeduction: 0, topMarginalRate: null,
    description: "South Dakota has no state personal income tax. Only federal income tax applies.",
    sourceUrl: "https://dor.sd.gov/", brackets: [],
  },
  {
    code: "TN", slug: "tennessee", name: "Tennessee", hasIncomeTax: false, taxType: "none",
    standardDeduction: 0, topMarginalRate: null,
    description: "Tennessee has no state personal income tax. Only federal income tax applies.",
    sourceUrl: "https://www.tn.gov/revenue/", brackets: [],
  },
  {
    code: "TX", slug: "texas", name: "Texas", hasIncomeTax: false, taxType: "none",
    standardDeduction: 0, topMarginalRate: null,
    description: "Texas has no state personal income tax. Only federal income tax applies.",
    sourceUrl: "https://comptroller.texas.gov/", brackets: [],
  },
  {
    code: "WY", slug: "wyoming", name: "Wyoming", hasIncomeTax: false, taxType: "none",
    standardDeduction: 0, topMarginalRate: null,
    description: "Wyoming has no state personal income tax. Only federal income tax applies.",
    sourceUrl: "http://revenue.wyo.gov/", brackets: [],
  },

  // === PROGRESSIVE STATES ===
  {
    code: "CA", slug: "california", name: "California", hasIncomeTax: true, taxType: "progressive",
    standardDeduction: 5540, topMarginalRate: 0.123,
    description: "California personal income tax. 2025 brackets, single filer. State standard deduction $5,540.",
    sourceUrl: "https://www.ftb.ca.gov/forms/2024/2024-540.pdf",
    brackets: [
      { lowerBound: 0, upperBound: 10756, rate: 0.01 },
      { lowerBound: 10756, upperBound: 25499, rate: 0.02 },
      { lowerBound: 25499, upperBound: 40245, rate: 0.04 },
      { lowerBound: 40245, upperBound: 55866, rate: 0.06 },
      { lowerBound: 55866, upperBound: 70606, rate: 0.08 },
      { lowerBound: 70606, upperBound: 360659, rate: 0.093 },
      { lowerBound: 360659, upperBound: 432787, rate: 0.103 },
      { lowerBound: 432787, upperBound: 721314, rate: 0.113 },
      { lowerBound: 721314, upperBound: null, rate: 0.123 },
    ],
  },
  {
    code: "NY", slug: "new-york", name: "New York", hasIncomeTax: true, taxType: "progressive",
    standardDeduction: 8000, topMarginalRate: 0.109,
    description: "New York State personal income tax. 2025 brackets, single filer. State standard deduction $8,000.",
    sourceUrl: "https://www.tax.ny.gov/",
    brackets: [
      { lowerBound: 0, upperBound: 8500, rate: 0.04 },
      { lowerBound: 8500, upperBound: 11700, rate: 0.045 },
      { lowerBound: 11700, upperBound: 13900, rate: 0.0525 },
      { lowerBound: 13900, upperBound: 80650, rate: 0.055 },
      { lowerBound: 80650, upperBound: 215400, rate: 0.06 },
      { lowerBound: 215400, upperBound: 1077550, rate: 0.0685 },
      { lowerBound: 1077550, upperBound: 5000000, rate: 0.0965 },
      { lowerBound: 5000000, upperBound: 25000000, rate: 0.103 },
      { lowerBound: 25000000, upperBound: null, rate: 0.109 },
    ],
  },
  {
    code: "OH", slug: "ohio", name: "Ohio", hasIncomeTax: true, taxType: "progressive",
    standardDeduction: 0, topMarginalRate: 0.035,
    description: "Ohio personal income tax. 2025 3-bracket progressive: 0% / 2.75% / 3.5%.",
    sourceUrl: "https://tax.ohio.gov/",
    brackets: [
      { lowerBound: 0, upperBound: 26050, rate: 0 },
      { lowerBound: 26050, upperBound: 100000, rate: 0.0275 },
      { lowerBound: 100000, upperBound: null, rate: 0.035 },
    ],
  },
  {
    code: "NJ", slug: "new-jersey", name: "New Jersey", hasIncomeTax: true, taxType: "progressive",
    standardDeduction: 0, topMarginalRate: 0.1075,
    description: "New Jersey personal income tax. 7-bracket progressive, top 10.75% on income over $1M.",
    sourceUrl: "https://www.nj.gov/treasury/taxation/",
    brackets: [
      { lowerBound: 0, upperBound: 20000, rate: 0.014 },
      { lowerBound: 20000, upperBound: 35000, rate: 0.0175 },
      { lowerBound: 35000, upperBound: 40000, rate: 0.035 },
      { lowerBound: 40000, upperBound: 75000, rate: 0.05525 },
      { lowerBound: 75000, upperBound: 500000, rate: 0.0637 },
      { lowerBound: 500000, upperBound: 1000000, rate: 0.0897 },
      { lowerBound: 1000000, upperBound: null, rate: 0.1075 },
    ],
  },
  {
    code: "VA", slug: "virginia", name: "Virginia", hasIncomeTax: true, taxType: "progressive",
    standardDeduction: 0, topMarginalRate: 0.0575,
    description: "Virginia personal income tax. 4-bracket progressive, top 5.75%.",
    sourceUrl: "https://www.tax.virginia.gov/",
    brackets: [
      { lowerBound: 0, upperBound: 3000, rate: 0.02 },
      { lowerBound: 3000, upperBound: 5000, rate: 0.03 },
      { lowerBound: 5000, upperBound: 17000, rate: 0.05 },
      { lowerBound: 17000, upperBound: null, rate: 0.0575 },
    ],
  },
  {
    code: "WA", slug: "washington", name: "Washington", hasIncomeTax: false, taxType: "none",
    standardDeduction: 0, topMarginalRate: 0.07,
    description: "Washington has no state wage income tax. Capital gains tax 7% applies to long-term gains over $262,000 (2025).",
    sourceUrl: "https://dor.wa.gov/", brackets: [],
  },
  {
    code: "MD", slug: "maryland", name: "Maryland", hasIncomeTax: true, taxType: "progressive",
    standardDeduction: 0, topMarginalRate: 0.0575,
    description: "Maryland personal income tax. 8-bracket progressive, top 5.75%. Local county tax not modeled.",
    sourceUrl: "https://www.marylandtaxes.gov/",
    brackets: [
      { lowerBound: 0, upperBound: 1000, rate: 0.02 },
      { lowerBound: 1000, upperBound: 2000, rate: 0.03 },
      { lowerBound: 2000, upperBound: 3000, rate: 0.04 },
      { lowerBound: 3000, upperBound: 100000, rate: 0.0475 },
      { lowerBound: 100000, upperBound: 125000, rate: 0.05 },
      { lowerBound: 125000, upperBound: 150000, rate: 0.0525 },
      { lowerBound: 150000, upperBound: 250000, rate: 0.055 },
      { lowerBound: 250000, upperBound: null, rate: 0.0575 },
    ],
  },
  {
    code: "MO", slug: "missouri", name: "Missouri", hasIncomeTax: true, taxType: "progressive",
    standardDeduction: 0, topMarginalRate: 0.0495,
    description: "Missouri personal income tax. 8-bracket progressive, top 4.95%.",
    sourceUrl: "https://dor.mo.gov/",
    brackets: [
      { lowerBound: 0, upperBound: 1273, rate: 0.02 },
      { lowerBound: 1273, upperBound: 2546, rate: 0.025 },
      { lowerBound: 2546, upperBound: 3819, rate: 0.03 },
      { lowerBound: 3819, upperBound: 5092, rate: 0.035 },
      { lowerBound: 5092, upperBound: 6365, rate: 0.04 },
      { lowerBound: 6365, upperBound: 7638, rate: 0.045 },
      { lowerBound: 7638, upperBound: 8911, rate: 0.047 },
      { lowerBound: 8911, upperBound: null, rate: 0.0495 },
    ],
  },
  {
    code: "WI", slug: "wisconsin", name: "Wisconsin", hasIncomeTax: true, taxType: "progressive",
    standardDeduction: 0, topMarginalRate: 0.0765,
    description: "Wisconsin personal income tax. 4-bracket progressive, top 7.65%.",
    sourceUrl: "https://www.revenue.wi.gov/",
    brackets: [
      { lowerBound: 0, upperBound: 14680, rate: 0.035 },
      { lowerBound: 14680, upperBound: 29370, rate: 0.044 },
      { lowerBound: 29370, upperBound: 323290, rate: 0.053 },
      { lowerBound: 323290, upperBound: null, rate: 0.0765 },
    ],
  },
  {
    code: "MN", slug: "minnesota", name: "Minnesota", hasIncomeTax: true, taxType: "progressive",
    standardDeduction: 0, topMarginalRate: 0.0985,
    description: "Minnesota personal income tax. 4-bracket progressive, top 9.85%.",
    sourceUrl: "https://www.revenue.state.mn.us/",
    brackets: [
      { lowerBound: 0, upperBound: 31690, rate: 0.0535 },
      { lowerBound: 31690, upperBound: 104090, rate: 0.068 },
      { lowerBound: 104090, upperBound: 193240, rate: 0.0785 },
      { lowerBound: 193240, upperBound: null, rate: 0.0985 },
    ],
  },
  {
    code: "SC", slug: "south-carolina", name: "South Carolina", hasIncomeTax: true, taxType: "progressive",
    standardDeduction: 0, topMarginalRate: 0.068,
    description: "South Carolina personal income tax. 3-bracket progressive, top 6.8%.",
    sourceUrl: "https://dor.sc.gov/",
    brackets: [
      { lowerBound: 0, upperBound: 3460, rate: 0.03 },
      { lowerBound: 3460, upperBound: 17330, rate: 0.064 },
      { lowerBound: 17330, upperBound: null, rate: 0.068 },
    ],
  },
  {
    code: "AL", slug: "alabama", name: "Alabama", hasIncomeTax: true, taxType: "progressive",
    standardDeduction: 0, topMarginalRate: 0.05,
    description: "Alabama personal income tax. 3-bracket progressive, top 5%.",
    sourceUrl: "https://www.revenue.alabama.gov/",
    brackets: [
      { lowerBound: 0, upperBound: 500, rate: 0.02 },
      { lowerBound: 500, upperBound: 3000, rate: 0.04 },
      { lowerBound: 3000, upperBound: null, rate: 0.05 },
    ],
  },
  {
    code: "LA", slug: "louisiana", name: "Louisiana", hasIncomeTax: true, taxType: "progressive",
    standardDeduction: 0, topMarginalRate: 0.0445,
    description: "Louisiana personal income tax. 2-bracket progressive: 3% / 4.45%.",
    sourceUrl: "https://revenue.louisiana.gov/",
    brackets: [
      { lowerBound: 0, upperBound: 5000, rate: 0.03 },
      { lowerBound: 5000, upperBound: null, rate: 0.0445 },
    ],
  },

  // === FLAT-TAX STATES ===
  {
    code: "IL", slug: "illinois", name: "Illinois", hasIncomeTax: true, taxType: "flat",
    standardDeduction: 0, topMarginalRate: 0.0495,
    description: "Illinois personal income tax. Flat 4.95% (2025).",
    sourceUrl: "https://www2.illinois.gov/rev/",
    brackets: [{ lowerBound: 0, upperBound: null, rate: 0.0495 }],
  },
  {
    code: "PA", slug: "pennsylvania", name: "Pennsylvania", hasIncomeTax: true, taxType: "flat",
    standardDeduction: 0, topMarginalRate: 0.0307,
    description: "Pennsylvania personal income tax. Flat 3.07% (2025).",
    sourceUrl: "https://www.revenue.pa.gov/",
    brackets: [{ lowerBound: 0, upperBound: null, rate: 0.0307 }],
  },
  {
    code: "GA", slug: "georgia", name: "Georgia", hasIncomeTax: true, taxType: "flat",
    standardDeduction: 5400, topMarginalRate: 0.0539,
    description: "Georgia personal income tax. Flat 5.39% (2025). Standard deduction $5,400 single.",
    sourceUrl: "https://dor.georgia.gov/",
    brackets: [{ lowerBound: 0, upperBound: null, rate: 0.0539 }],
  },
  {
    code: "NC", slug: "north-carolina", name: "North Carolina", hasIncomeTax: true, taxType: "flat",
    standardDeduction: 12750, topMarginalRate: 0.045,
    description: "North Carolina personal income tax. Flat 4.5% (2025). Standard deduction $12,750 single.",
    sourceUrl: "https://www.ncdor.gov/",
    brackets: [{ lowerBound: 0, upperBound: null, rate: 0.045 }],
  },
  {
    code: "MI", slug: "michigan", name: "Michigan", hasIncomeTax: true, taxType: "flat",
    standardDeduction: 0, topMarginalRate: 0.0425,
    description: "Michigan personal income tax. Flat 4.25% (2025).",
    sourceUrl: "https://www.michigan.gov/treasury/",
    brackets: [{ lowerBound: 0, upperBound: null, rate: 0.0425 }],
  },
  {
    code: "AZ", slug: "arizona", name: "Arizona", hasIncomeTax: true, taxType: "flat",
    standardDeduction: 0, topMarginalRate: 0.025,
    description: "Arizona personal income tax. Flat 2.5% (2025).",
    sourceUrl: "https://azdor.gov/",
    brackets: [{ lowerBound: 0, upperBound: null, rate: 0.025 }],
  },
  {
    code: "MA", slug: "massachusetts", name: "Massachusetts", hasIncomeTax: true, taxType: "flat",
    standardDeduction: 0, topMarginalRate: 0.09,
    description: "Massachusetts personal income tax. Flat 5% + 4% millionaire surtax on income over $1.08M.",
    sourceUrl: "https://www.mass.gov/dor",
    brackets: [{ lowerBound: 0, upperBound: null, rate: 0.05 }],
  },
  {
    code: "IN", slug: "indiana", name: "Indiana", hasIncomeTax: true, taxType: "flat",
    standardDeduction: 0, topMarginalRate: 0.0305,
    description: "Indiana personal income tax. Flat 3.05% (2025).",
    sourceUrl: "https://www.in.gov/dor/",
    brackets: [{ lowerBound: 0, upperBound: null, rate: 0.0305 }],
  },
  {
    code: "CO", slug: "colorado", name: "Colorado", hasIncomeTax: true, taxType: "flat",
    standardDeduction: 0, topMarginalRate: 0.044,
    description: "Colorado personal income tax. Flat 4.4% (2025).",
    sourceUrl: "https://tax.colorado.gov/",
    brackets: [{ lowerBound: 0, upperBound: null, rate: 0.044 }],
  },
];

export const US_STATES_BY_CODE: Record<string, StaticState> = Object.fromEntries(
  US_STATES.map((s) => [s.code, s])
);
export const US_STATES_BY_SLUG: Record<string, StaticState> = Object.fromEntries(
  US_STATES.map((s) => [s.slug, s])
);
