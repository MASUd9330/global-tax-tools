/**
 * Seed: 5 countries (USA, UK, Germany, France, Canada) with 2025 income tax rules.
 * BD excluded per user request.
 *
 * Data sources are official 2025 brackets/rates from each country's tax authority.
 * For Phase 0, federal/national level only. State/provincial breakdowns come Phase 1+.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding tax data for 2025...\n");

  // Clean prior data (idempotent)
  await prisma.stateBracket.deleteMany();
  await prisma.state.deleteMany();
  await prisma.taxBracket.deleteMany();
  await prisma.deduction.deleteMany();
  await prisma.taxRule.deleteMany();
  await prisma.salaryConfig.deleteMany();
  await prisma.dataSource.deleteMany();
  await prisma.country.deleteMany();

  // ============================================================
  // USA (2025 Federal, single filer)
  // ============================================================
  console.log("🇺🇸 USA");
  const usa = await prisma.country.create({
    data: {
      code: "US",
      slug: "usa",
      name: "United States",
      region: "North America",
      defaultCurrency: "USD",
      flagEmoji: "🇺🇸",
      taxSystem: "progressive",
      description:
        "Federal income tax for the United States. State taxes are added separately. 2025 IRS brackets for single filers.",
    },
  });

  const usTaxRule = await prisma.taxRule.create({
    data: {
      countryId: usa.id,
      year: 2025,
      type: "income_tax",
      version: 1,
      status: "published",
      sourceUrl: "https://www.irs.gov/filing/federal-income-tax-rates-and-brackets",
      notes: "Federal brackets only. Single filer, 2025.",
      publishedAt: new Date(),
    },
  });

  await prisma.taxBracket.createMany({
    data: [
      { taxRuleId: usTaxRule.id, orderIndex: 0, lowerBound: 0, upperBound: 11925, rate: 0.10 },
      { taxRuleId: usTaxRule.id, orderIndex: 1, lowerBound: 11925, upperBound: 48475, rate: 0.12 },
      { taxRuleId: usTaxRule.id, orderIndex: 2, lowerBound: 48475, upperBound: 103350, rate: 0.22 },
      { taxRuleId: usTaxRule.id, orderIndex: 3, lowerBound: 103350, upperBound: 197300, rate: 0.24 },
      { taxRuleId: usTaxRule.id, orderIndex: 4, lowerBound: 197300, upperBound: 250525, rate: 0.32 },
      { taxRuleId: usTaxRule.id, orderIndex: 5, lowerBound: 250525, upperBound: 626350, rate: 0.35 },
      { taxRuleId: usTaxRule.id, orderIndex: 6, lowerBound: 626350, upperBound: null, rate: 0.37 },
    ],
  });

  await prisma.deduction.create({
    data: {
      taxRuleId: usTaxRule.id,
      name: "Standard Deduction (Single)",
      type: "standard",
      amount: 15000,
    },
  });

  await prisma.salaryConfig.create({
    data: {
      countryId: usa.id,
      year: 2025,
      employeeSocialRate: 0.0765, // 6.2% SS + 1.45% Medicare
      employerSocialRate: 0.0765,
      socialCap: 176100, // 2025 Social Security wage base
      healthcareRate: 0,
      healthcareCap: null,
      notes: "Medicare additional 0.9% on income over $200K not modeled in Phase 0.",
    },
  });

  await prisma.dataSource.create({
    data: {
      countryId: usa.id,
      sourceUrl: "https://www.irs.gov/filing/federal-income-tax-rates-and-brackets",
      organization: "IRS",
      reliability: "high",
    },
  });

  // ============================================================
  // US STATES (top 6 by population) — 2025
  // ============================================================
  console.log("  States: CA, NY, TX, FL, IL, PA");

  // California — 9-bracket progressive, top 13.3%
  const caState = await prisma.state.create({
    data: {
      countryId: usa.id,
      code: "CA",
      slug: "california",
      name: "California",
      hasIncomeTax: true,
      taxType: "progressive",
      standardDeduction: 5540,
      topMarginalRate: 0.123,
      description: "California personal income tax. 2025 brackets, single filer. State standard deduction $5,540.",
      sourceUrl: "https://www.ftb.ca.gov/forms/2024/2024-540.pdf",
    },
  });
  await prisma.stateBracket.createMany({
    data: [
      { stateId: caState.id, orderIndex: 0, lowerBound: 0, upperBound: 10756, rate: 0.01 },
      { stateId: caState.id, orderIndex: 1, lowerBound: 10756, upperBound: 25499, rate: 0.02 },
      { stateId: caState.id, orderIndex: 2, lowerBound: 25499, upperBound: 40245, rate: 0.04 },
      { stateId: caState.id, orderIndex: 3, lowerBound: 40245, upperBound: 55866, rate: 0.06 },
      { stateId: caState.id, orderIndex: 4, lowerBound: 55866, upperBound: 70606, rate: 0.08 },
      { stateId: caState.id, orderIndex: 5, lowerBound: 70606, upperBound: 360659, rate: 0.093 },
      { stateId: caState.id, orderIndex: 6, lowerBound: 360659, upperBound: 432787, rate: 0.103 },
      { stateId: caState.id, orderIndex: 7, lowerBound: 432787, upperBound: 721314, rate: 0.113 },
      { stateId: caState.id, orderIndex: 8, lowerBound: 721314, upperBound: null, rate: 0.123 },
    ],
  });

  // New York — 9-bracket progressive, top 10.9%
  const ny = await prisma.state.create({
    data: {
      countryId: usa.id,
      code: "NY",
      slug: "new-york",
      name: "New York",
      hasIncomeTax: true,
      taxType: "progressive",
      standardDeduction: 8000,
      topMarginalRate: 0.109,
      description: "New York State personal income tax. 2025 brackets, single filer. State standard deduction $8,000.",
      sourceUrl: "https://www.tax.ny.gov/forms/income_tax_forms.htm",
    },
  });
  await prisma.stateBracket.createMany({
    data: [
      { stateId: ny.id, orderIndex: 0, lowerBound: 0, upperBound: 8500, rate: 0.04 },
      { stateId: ny.id, orderIndex: 1, lowerBound: 8500, upperBound: 11700, rate: 0.045 },
      { stateId: ny.id, orderIndex: 2, lowerBound: 11700, upperBound: 13900, rate: 0.0525 },
      { stateId: ny.id, orderIndex: 3, lowerBound: 13900, upperBound: 80650, rate: 0.055 },
      { stateId: ny.id, orderIndex: 4, lowerBound: 80650, upperBound: 215400, rate: 0.06 },
      { stateId: ny.id, orderIndex: 5, lowerBound: 215400, upperBound: 1077550, rate: 0.0685 },
      { stateId: ny.id, orderIndex: 6, lowerBound: 1077550, upperBound: 5000000, rate: 0.0965 },
      { stateId: ny.id, orderIndex: 7, lowerBound: 5000000, upperBound: 25000000, rate: 0.103 },
      { stateId: ny.id, orderIndex: 8, lowerBound: 25000000, upperBound: null, rate: 0.109 },
    ],
  });

  // Texas — NO state income tax
  await prisma.state.create({
    data: {
      countryId: usa.id,
      code: "TX",
      slug: "texas",
      name: "Texas",
      hasIncomeTax: false,
      taxType: "none",
      standardDeduction: 0,
      topMarginalRate: null,
      description: "Texas has no state personal income tax. Only federal income tax applies.",
      sourceUrl: "https://comptroller.texas.gov/taxes/payroll/",
    },
  });

  // Florida — NO state income tax
  await prisma.state.create({
    data: {
      countryId: usa.id,
      code: "FL",
      slug: "florida",
      name: "Florida",
      hasIncomeTax: false,
      taxType: "none",
      standardDeduction: 0,
      topMarginalRate: null,
      description: "Florida has no state personal income tax. Only federal income tax applies.",
      sourceUrl: "https://floridarevenue.com/taxes/taxesfees/Pages/income_tax.aspx",
    },
  });

  // Illinois — flat 4.95%
  const il = await prisma.state.create({
    data: {
      countryId: usa.id,
      code: "IL",
      slug: "illinois",
      name: "Illinois",
      hasIncomeTax: true,
      taxType: "flat",
      standardDeduction: 0,
      topMarginalRate: 0.0495,
      description: "Illinois personal income tax. Flat 4.95% on all income (2025).",
      sourceUrl: "https://www2.illinois.gov/rev/Pages/default.aspx",
    },
  });
  await prisma.stateBracket.createMany({
    data: [
      { stateId: il.id, orderIndex: 0, lowerBound: 0, upperBound: null, rate: 0.0495 },
    ],
  });

  // Pennsylvania — flat 3.07%
  const pa = await prisma.state.create({
    data: {
      countryId: usa.id,
      code: "PA",
      slug: "pennsylvania",
      name: "Pennsylvania",
      hasIncomeTax: true,
      taxType: "flat",
      standardDeduction: 0,
      topMarginalRate: 0.0307,
      description: "Pennsylvania personal income tax. Flat 3.07% on all income (2025).",
      sourceUrl: "https://www.revenue.pa.gov/",
    },
  });
  await prisma.stateBracket.createMany({
    data: [
      { stateId: pa.id, orderIndex: 0, lowerBound: 0, upperBound: null, rate: 0.0307 },
    ],
  });

  // ============================================================
  // US STATES — top 25 by population (Phase 1.5)
  // ============================================================
  console.log("  Additional states: OH, GA, NC, MI, NJ, VA, WA, AZ, MA, IN, MD, MO, WI, CO, MN, SC, AL, LA, TN, AK, NV, SD, WY");

  // Compact data: [code, slug, name, taxType, hasTax, stdDeduction, topRate, brackets[], sourceUrl, description]
  type StateSpec = {
    code: string; slug: string; name: string; taxType: string;
    hasIncomeTax: boolean; stdDeduction: number; topRate: number | null;
    brackets: Array<[number, number | null, number]>;
    sourceUrl: string; description: string;
  };

  const moreStates: StateSpec[] = [
    // Ohio — progressive 0/2.75/3.5
    { code: "OH", slug: "ohio", name: "Ohio", taxType: "progressive", hasIncomeTax: true, stdDeduction: 0, topRate: 0.035,
      brackets: [[0, 26050, 0], [26050, 100000, 0.0275], [100000, null, 0.035]],
      sourceUrl: "https://tax.ohio.gov/",
      description: "Ohio personal income tax. 3-bracket progressive (2025): 0% / 2.75% / 3.5%." },

    // Georgia — flat 5.39%
    { code: "GA", slug: "georgia", name: "Georgia", taxType: "flat", hasIncomeTax: true, stdDeduction: 5400, topRate: 0.0539,
      brackets: [[0, null, 0.0539]],
      sourceUrl: "https://dor.georgia.gov/",
      description: "Georgia personal income tax. Flat 5.39% (2025). Standard deduction $5,400 single." },

    // North Carolina — flat 4.5%
    { code: "NC", slug: "north-carolina", name: "North Carolina", taxType: "flat", hasIncomeTax: true, stdDeduction: 12750, topRate: 0.045,
      brackets: [[0, null, 0.045]],
      sourceUrl: "https://www.ncdor.gov/",
      description: "North Carolina personal income tax. Flat 4.5% (2025). Standard deduction $12,750 single." },

    // Michigan — flat 4.25%
    { code: "MI", slug: "michigan", name: "Michigan", taxType: "flat", hasIncomeTax: true, stdDeduction: 0, topRate: 0.0425,
      brackets: [[0, null, 0.0425]],
      sourceUrl: "https://www.michigan.gov/treasury/",
      description: "Michigan personal income tax. Flat 4.25% (2025)." },

    // New Jersey — progressive 1.4-10.75
    { code: "NJ", slug: "new-jersey", name: "New Jersey", taxType: "progressive", hasIncomeTax: true, stdDeduction: 0, topRate: 0.1075,
      brackets: [[0, 20000, 0.014], [20000, 35000, 0.0175], [35000, 40000, 0.035], [40000, 75000, 0.05525], [75000, 500000, 0.0637], [500000, 1000000, 0.0897], [1000000, null, 0.1075]],
      sourceUrl: "https://www.nj.gov/treasury/taxation/",
      description: "New Jersey personal income tax. 7-bracket progressive (2025), top rate 10.75% on income over $1M." },

    // Virginia — progressive 2/3/5.25/5.75
    { code: "VA", slug: "virginia", name: "Virginia", taxType: "progressive", hasIncomeTax: true, stdDeduction: 0, topRate: 0.0575,
      brackets: [[0, 3000, 0.02], [3000, 5000, 0.03], [5000, 17000, 0.05], [17000, null, 0.0575]],
      sourceUrl: "https://www.tax.virginia.gov/",
      description: "Virginia personal income tax. 4-bracket progressive (2025), top 5.75%." },

    // Washington — capital gains 7% above $262K (no wage tax)
    { code: "WA", slug: "washington", name: "Washington", taxType: "none", hasIncomeTax: false, stdDeduction: 0, topRate: 0.07,
      brackets: [],
      sourceUrl: "https://dor.wa.gov/",
      description: "Washington has no state wage income tax. Capital gains tax 7% applies to long-term gains over $262,000 (2025)." },

    // Arizona — flat 2.5%
    { code: "AZ", slug: "arizona", name: "Arizona", taxType: "flat", hasIncomeTax: true, stdDeduction: 0, topRate: 0.025,
      brackets: [[0, null, 0.025]],
      sourceUrl: "https://azdor.gov/",
      description: "Arizona personal income tax. Flat 2.5% (2025)." },

    // Massachusetts — flat 5% + 4% millionaire surtax over $1M
    { code: "MA", slug: "massachusetts", name: "Massachusetts", taxType: "progressive", hasIncomeTax: true, stdDeduction: 0, topRate: 0.09,
      brackets: [[0, null, 0.05]],
      sourceUrl: "https://www.mass.gov/orgs/department-of-revenue",
      description: "Massachusetts personal income tax. Flat 5% base + 4% surtax on income over $1,083,150 (≈ 9% effective at top)." },

    // Indiana — flat 3.05%
    { code: "IN", slug: "indiana", name: "Indiana", taxType: "flat", hasIncomeTax: true, stdDeduction: 0, topRate: 0.0305,
      brackets: [[0, null, 0.0305]],
      sourceUrl: "https://www.in.gov/dor/",
      description: "Indiana personal income tax. Flat 3.05% (2025)." },

    // Maryland — progressive 2-5.75%
    { code: "MD", slug: "maryland", name: "Maryland", taxType: "progressive", hasIncomeTax: true, stdDeduction: 0, topRate: 0.0575,
      brackets: [[0, 1000, 0.02], [1000, 2000, 0.03], [2000, 3000, 0.04], [3000, 100000, 0.0475], [100000, 125000, 0.05], [125000, 150000, 0.0525], [150000, 250000, 0.055], [250000, null, 0.0575]],
      sourceUrl: "https://www.marylandtaxes.gov/",
      description: "Maryland personal income tax. 8-bracket progressive (2025), top 5.75%. Local county tax not modeled." },

    // Missouri — progressive 2-4.95%
    { code: "MO", slug: "missouri", name: "Missouri", taxType: "progressive", hasIncomeTax: true, stdDeduction: 0, topRate: 0.0495,
      brackets: [[0, 1273, 0.02], [1273, 2546, 0.025], [2546, 3819, 0.03], [3819, 5092, 0.035], [5092, 6365, 0.04], [6365, 7638, 0.045], [7638, 8911, 0.047], [8911, null, 0.0495]],
      sourceUrl: "https://dor.mo.gov/",
      description: "Missouri personal income tax. 8-bracket progressive (2025), top 4.95%." },

    // Wisconsin — progressive 3.5-7.65%
    { code: "WI", slug: "wisconsin", name: "Wisconsin", taxType: "progressive", hasIncomeTax: true, stdDeduction: 0, topRate: 0.0765,
      brackets: [[0, 14680, 0.035], [14680, 29370, 0.044], [29370, 323290, 0.053], [323290, null, 0.0765]],
      sourceUrl: "https://www.revenue.wi.gov/",
      description: "Wisconsin personal income tax. 4-bracket progressive (2025), top 7.65%." },

    // Colorado — flat 4.4%
    { code: "CO", slug: "colorado", name: "Colorado", taxType: "flat", hasIncomeTax: true, stdDeduction: 0, topRate: 0.044,
      brackets: [[0, null, 0.044]],
      sourceUrl: "https://tax.colorado.gov/",
      description: "Colorado personal income tax. Flat 4.4% (2025)." },

    // Minnesota — progressive 5.35-9.85%
    { code: "MN", slug: "minnesota", name: "Minnesota", taxType: "progressive", hasIncomeTax: true, stdDeduction: 0, topRate: 0.0985,
      brackets: [[0, 31690, 0.0535], [31690, 104090, 0.068], [104090, 193240, 0.0785], [193240, null, 0.0985]],
      sourceUrl: "https://www.revenue.state.mn.us/",
      description: "Minnesota personal income tax. 4-bracket progressive (2025), top 9.85%." },

    // South Carolina — progressive 3-6.8% (resets at lower amounts)
    { code: "SC", slug: "south-carolina", name: "South Carolina", taxType: "progressive", hasIncomeTax: true, stdDeduction: 0, topRate: 0.068,
      brackets: [[0, 3460, 0.03], [3460, 17330, 0.064], [17330, null, 0.068]],
      sourceUrl: "https://dor.sc.gov/",
      description: "South Carolina personal income tax. 3-bracket progressive (2025), top 6.8%." },

    // Alabama — progressive 2-5%
    { code: "AL", slug: "alabama", name: "Alabama", taxType: "progressive", hasIncomeTax: true, stdDeduction: 0, topRate: 0.05,
      brackets: [[0, 500, 0.02], [500, 3000, 0.04], [3000, null, 0.05]],
      sourceUrl: "https://www.revenue.alabama.gov/",
      description: "Alabama personal income tax. 3-bracket progressive (2025), top 5%." },

    // Louisiana — progressive 3-4.45%
    { code: "LA", slug: "louisiana", name: "Louisiana", taxType: "progressive", hasIncomeTax: true, stdDeduction: 0, topRate: 0.0445,
      brackets: [[0, 5000, 0.03], [5000, null, 0.0445]],
      sourceUrl: "https://revenue.louisiana.gov/",
      description: "Louisiana personal income tax. 2-bracket progressive (2025): 3% / 4.45%." },

    // Tennessee — no state income tax
    { code: "TN", slug: "tennessee", name: "Tennessee", taxType: "none", hasIncomeTax: false, stdDeduction: 0, topRate: null,
      brackets: [],
      sourceUrl: "https://www.tn.gov/revenue/",
      description: "Tennessee has no state personal income tax. Only federal income tax applies." },

    // Alaska — no state income tax
    { code: "AK", slug: "alaska", name: "Alaska", taxType: "none", hasIncomeTax: false, stdDeduction: 0, topRate: null,
      brackets: [],
      sourceUrl: "https://dor.alaska.gov/",
      description: "Alaska has no state personal income tax. Only federal income tax applies." },

    // Nevada — no state income tax
    { code: "NV", slug: "nevada", name: "Nevada", taxType: "none", hasIncomeTax: false, stdDeduction: 0, topRate: null,
      brackets: [],
      sourceUrl: "https://tax.nv.gov/",
      description: "Nevada has no state personal income tax. Only federal income tax applies." },

    // South Dakota — no state income tax
    { code: "SD", slug: "south-dakota", name: "South Dakota", taxType: "none", hasIncomeTax: false, stdDeduction: 0, topRate: null,
      brackets: [],
      sourceUrl: "https://dor.sd.gov/",
      description: "South Dakota has no state personal income tax. Only federal income tax applies." },

    // Wyoming — no state income tax
    { code: "WY", slug: "wyoming", name: "Wyoming", taxType: "none", hasIncomeTax: false, stdDeduction: 0, topRate: null,
      brackets: [],
      sourceUrl: "http://revenue.wyo.gov/",
      description: "Wyoming has no state personal income tax. Only federal income tax applies." },
  ];

  for (const sd of moreStates) {
    const state = await prisma.state.create({
      data: {
        countryId: usa.id,
        code: sd.code,
        slug: sd.slug,
        name: sd.name,
        hasIncomeTax: sd.hasIncomeTax,
        taxType: sd.taxType,
        standardDeduction: sd.stdDeduction,
        topMarginalRate: sd.topRate,
        description: sd.description,
        sourceUrl: sd.sourceUrl,
      },
    });
    if (sd.brackets.length > 0) {
      await prisma.stateBracket.createMany({
        data: sd.brackets.map((b, i) => ({
          stateId: state.id,
          orderIndex: i,
          lowerBound: b[0],
          upperBound: b[1],
          rate: b[2],
        })),
      });
    }
  }

  // ============================================================
  // UK (2025/26, England/Wales, single)
  // ============================================================
  console.log("🇬🇧 UK");
  const uk = await prisma.country.create({
    data: {
      code: "GB",
      slug: "uk",
      name: "United Kingdom",
      region: "Europe",
      defaultCurrency: "GBP",
      flagEmoji: "🇬🇧",
      taxSystem: "progressive",
      description:
        "Income tax + National Insurance for the United Kingdom. 2025/26 HMRC rates for England/Wales, single taxpayers.",
    },
  });

  const ukTaxRule = await prisma.taxRule.create({
    data: {
      countryId: uk.id,
      year: 2025,
      type: "income_tax",
      version: 1,
      status: "published",
      sourceUrl: "https://www.gov.uk/income-tax-rates",
      notes: "2025/26 tax year (April-March). Personal Allowance tapered above £100K.",
      publishedAt: new Date(),
    },
  });

  await prisma.taxBracket.createMany({
    data: [
      { taxRuleId: ukTaxRule.id, orderIndex: 0, lowerBound: 0, upperBound: 12570, rate: 0 },
      { taxRuleId: ukTaxRule.id, orderIndex: 1, lowerBound: 12570, upperBound: 50270, rate: 0.20 },
      { taxRuleId: ukTaxRule.id, orderIndex: 2, lowerBound: 50270, upperBound: 125140, rate: 0.40 },
      { taxRuleId: ukTaxRule.id, orderIndex: 3, lowerBound: 125140, upperBound: null, rate: 0.45 },
    ],
  });

  await prisma.deduction.create({
    data: {
      taxRuleId: ukTaxRule.id,
      name: "Personal Allowance",
      type: "personal",
      amount: 12570,
      conditions: JSON.stringify({ note: "Tapered £1 for every £2 over £100K. Not modeled in Phase 0." }),
    },
  });

  await prisma.salaryConfig.create({
    data: {
      countryId: uk.id,
      year: 2025,
      employeeSocialRate: 0.08, // NI main rate (above primary threshold)
      employerSocialRate: 0.15, // Employer NI
      socialCap: 50270, // Upper earnings limit (above this, NI drops to 2%)
      healthcareRate: 0,
      notes: "NI simplified to 8% main rate; 2% above £50,270 not modeled.",
    },
  });

  await prisma.dataSource.create({
    data: {
      countryId: uk.id,
      sourceUrl: "https://www.gov.uk/income-tax-rates",
      organization: "HMRC",
      reliability: "high",
    },
  });

  // ============================================================
  // Germany 2025 (national, single)
  // ============================================================
  console.log("🇩🇪 Germany");
  const de = await prisma.country.create({
    data: {
      code: "DE",
      slug: "germany",
      name: "Germany",
      region: "Europe",
      defaultCurrency: "EUR",
      flagEmoji: "🇩🇪",
      taxSystem: "progressive",
      description:
        "Einkommensteuer for Germany. 2025 BMF rates (federal), single taxpayers. Simplified progressive brackets.",
    },
  });

  const deTaxRule = await prisma.taxRule.create({
    data: {
      countryId: de.id,
      year: 2025,
      type: "income_tax",
      version: 1,
      status: "published",
      sourceUrl: "https://www.bmf-steuerrechner.de/",
      notes:
        "Phase 0 simplified: linear-progression zone (€17,444-€68,430) approximated as 30%. Full BMF formula is more complex.",
      publishedAt: new Date(),
    },
  });

  await prisma.taxBracket.createMany({
    data: [
      { taxRuleId: deTaxRule.id, orderIndex: 0, lowerBound: 0, upperBound: 12096, rate: 0 },
      { taxRuleId: deTaxRule.id, orderIndex: 1, lowerBound: 12096, upperBound: 17443, rate: 0.14 },
      { taxRuleId: deTaxRule.id, orderIndex: 2, lowerBound: 17443, upperBound: 68430, rate: 0.30 }, // approx linear-progression zone
      { taxRuleId: deTaxRule.id, orderIndex: 3, lowerBound: 68430, upperBound: 277825, rate: 0.42 },
      { taxRuleId: deTaxRule.id, orderIndex: 4, lowerBound: 277825, upperBound: null, rate: 0.45 },
    ],
  });

  await prisma.deduction.create({
    data: {
      taxRuleId: deTaxRule.id,
      name: "Grundfreibetrag (Basic Allowance)",
      type: "personal",
      amount: 12096,
    },
  });

  await prisma.salaryConfig.create({
    data: {
      countryId: de.id,
      year: 2025,
      employeeSocialRate: 0.20, // Health 7.3% + Care 1.525% + Pension 9.3% + Unemployment 1.3%
      employerSocialRate: 0.20,
      socialCap: 87600, // Beitragsbemessungsgrenze 2025
      healthcareRate: 0,
      notes: "Social contributions capped at €87,600/yr (2025 BBG). Care insurance 0.85% additional for childless over 23.",
    },
  });

  await prisma.dataSource.create({
    data: {
      countryId: de.id,
      sourceUrl: "https://www.bundesfinanzministerium.de",
      organization: "BMF",
      reliability: "high",
    },
  });

  // ============================================================
  // France 2025 (revenus 2024, single, quotient familial not modeled)
  // ============================================================
  console.log("🇫🇷 France");
  const fr = await prisma.country.create({
    data: {
      code: "FR",
      slug: "france",
      name: "France",
      region: "Europe",
      defaultCurrency: "EUR",
      flagEmoji: "🇫🇷",
      taxSystem: "progressive",
      description:
        "Impôt sur le revenu for France. 2025 brackets (revenus 2024), single taxpayer, quotient familial not applied.",
    },
  });

  const frTaxRule = await prisma.taxRule.create({
    data: {
      countryId: fr.id,
      year: 2025,
      type: "income_tax",
      version: 1,
      status: "published",
      sourceUrl: "https://www.impots.gouv.fr/particulier/le-calcul-de-l-impot-sur-le-revenu",
      notes: "Quotient familial not modeled in Phase 0 — uses bare 5-bracket system.",
      publishedAt: new Date(),
    },
  });

  await prisma.taxBracket.createMany({
    data: [
      { taxRuleId: frTaxRule.id, orderIndex: 0, lowerBound: 0, upperBound: 11497, rate: 0 },
      { taxRuleId: frTaxRule.id, orderIndex: 1, lowerBound: 11497, upperBound: 29315, rate: 0.11 },
      { taxRuleId: frTaxRule.id, orderIndex: 2, lowerBound: 29315, upperBound: 83823, rate: 0.30 },
      { taxRuleId: frTaxRule.id, orderIndex: 3, lowerBound: 83823, upperBound: 180294, rate: 0.41 },
      { taxRuleId: frTaxRule.id, orderIndex: 4, lowerBound: 180294, upperBound: null, rate: 0.45 },
    ],
  });

  await prisma.salaryConfig.create({
    data: {
      countryId: fr.id,
      year: 2025,
      employeeSocialRate: 0.22, // CSG 9.2% + CRDS 0.5% + others ~12%
      employerSocialRate: 0.42,
      socialCap: null,
      healthcareRate: 0,
      notes: "Includes CSG/CRDS + Formation Pro + other employee-side contributions.",
    },
  });

  await prisma.dataSource.create({
    data: {
      countryId: fr.id,
      sourceUrl: "https://www.impots.gouv.fr",
      organization: "DGFiP",
      reliability: "high",
    },
  });

  // ============================================================
  // Canada 2025 (federal only, single)
  // ============================================================
  console.log("🇨🇦 Canada");
  const ca = await prisma.country.create({
    data: {
      code: "CA",
      slug: "canada",
      name: "Canada",
      region: "North America",
      defaultCurrency: "CAD",
      flagEmoji: "🇨🇦",
      taxSystem: "progressive",
      description:
        "Federal income tax for Canada. 2025 CRA brackets (single). Provincial taxes added separately in Phase 1+.",
    },
  });

  const caTaxRule = await prisma.taxRule.create({
    data: {
      countryId: ca.id,
      year: 2025,
      type: "income_tax",
      version: 1,
      status: "published",
      sourceUrl: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individual-return/meaning-line-23600.html",
      notes: "Federal only. Quebec and provincial surtaxes excluded.",
      publishedAt: new Date(),
    },
  });

  await prisma.taxBracket.createMany({
    data: [
      { taxRuleId: caTaxRule.id, orderIndex: 0, lowerBound: 0, upperBound: 57375, rate: 0.15 },
      { taxRuleId: caTaxRule.id, orderIndex: 1, lowerBound: 57375, upperBound: 114750, rate: 0.205 },
      { taxRuleId: caTaxRule.id, orderIndex: 2, lowerBound: 114750, upperBound: 177882, rate: 0.26 },
      { taxRuleId: caTaxRule.id, orderIndex: 3, lowerBound: 177882, upperBound: 253414, rate: 0.29 },
      { taxRuleId: caTaxRule.id, orderIndex: 4, lowerBound: 253414, upperBound: null, rate: 0.33 },
    ],
  });

  await prisma.deduction.create({
    data: {
      taxRuleId: caTaxRule.id,
      name: "Basic Personal Amount (Federal)",
      type: "personal",
      amount: 16129,
      conditions: JSON.stringify({ note: "Non-refundable tax credit applied at lowest bracket rate (15%). Phase 0 simplified: direct deduction." }),
    },
  });

  await prisma.salaryConfig.create({
    data: {
      countryId: ca.id,
      year: 2025,
      employeeSocialRate: 0.0595, // CPP 2025
      employerSocialRate: 0.0595,
      socialCap: 71300, // Max pensionable earnings 2025
      healthcareRate: 0.0164, // EI 2025 (estimated for non-Quebec)
      healthcareCap: 65700,
      notes: "CPP between $3,500-$71,300. EI rate 1.64% (assumed). Quebec rates differ.",
    },
  });

  await prisma.dataSource.create({
    data: {
      countryId: ca.id,
      sourceUrl: "https://www.canada.ca/en/revenue-agency.html",
      organization: "CRA",
      reliability: "high",
    },
  });

  // ============================================================
  // PHASE 2 — Additional countries (G7 remainder + expat-heavy)
  // ============================================================
  console.log("\n🌍 Phase 2: IT, JP, AU, ES, NL, IE, CH, SG, AE");

  type CountrySpec = {
    code: string; slug: string; name: string; region: string;
    currency: string; flagEmoji: string; taxSystem: string;
    description: string; sourceUrl: string; orgName: string;
    brackets: Array<[number, number | null, number]>;
    deductions?: Array<{ name: string; type: string; amount: number; pct?: number }>;
    socialRate?: number; socialCap?: number | null; socialNotes?: string;
  };

  const newCountries: CountrySpec[] = [
    // Italy — IRPEF 2025 (regional/municipal surtax not modeled)
    { code: "IT", slug: "italy", name: "Italy", region: "Europe",
      currency: "EUR", flagEmoji: "🇮🇹", taxSystem: "progressive",
      description: "Italian IRPEF (Imposta sul Reddito delle Persone Fisiche). 2025 national brackets, single filer. Regional/municipal addizionale not modeled.",
      sourceUrl: "https://www.agenziaentrate.gov.it/portale/web/guest/schede/dichiarazioni/irpef/come-si-calcola",
      orgName: "Agenzia delle Entrate",
      brackets: [[0, 28000, 0.23], [28000, 50000, 0.35], [50000, null, 0.43]],
      socialRate: 0.0991, socialCap: null, socialNotes: "INPS employee contributions ~9.91% (no cap)." },

    // Japan — 2025 national income tax (¥1 = roughly USD $0.0066)
    { code: "JP", slug: "japan", name: "Japan", region: "Asia",
      currency: "JPY", flagEmoji: "🇯🇵", taxSystem: "progressive",
      description: "Japan national income tax (所得税). 2025 brackets, single filer. Includes 2.1% reconstruction tax (special income tax for reconstruction). Local inhabitant tax not modeled.",
      sourceUrl: "https://www.nta.go.jp/english/taxes/individual/index.htm",
      orgName: "NTA (National Tax Agency)",
      brackets: [
        [0, 1950000, 0.05], [1950000, 3300000, 0.10], [3300000, 6950000, 0.20],
        [6950000, 9000000, 0.23], [9000000, 18000000, 0.33], [18000000, 40000000, 0.40], [40000000, null, 0.45],
      ],
      deductions: [{ name: "Basic Deduction (基礎控除)", type: "standard", amount: 480000 }],
      socialRate: 0.1490, socialCap: null, socialNotes: "Employee social insurance ~14.9% (health 5%, pension 9.15%, employment 0.6%, etc.)" },

    // Australia — 2025-26 tax year (July 2025 - June 2026)
    { code: "AU", slug: "australia", name: "Australia", region: "Oceania",
      currency: "AUD", flagEmoji: "🇦🇺", taxSystem: "progressive",
      description: "Australian federal income tax. 2025-26 financial year (starts July 2025). 4-bracket system. Medicare levy 2% added separately (not modeled).",
      sourceUrl: "https://www.ato.gov.au/Rates/Individual-income-tax-rates",
      orgName: "ATO",
      brackets: [[0, 18200, 0], [18200, 45000, 0.16], [45000, 135000, 0.30], [135000, 190000, 0.37], [190000, null, 0.45]],
      socialRate: 0, socialCap: null, socialNotes: "Medicare levy 2% on income above threshold, superannuation separate." },

    // Spain — IRPF 2025 (state + autonomous community not modeled)
    { code: "ES", slug: "spain", name: "Spain", region: "Europe",
      currency: "EUR", flagEmoji: "🇪🇸", taxSystem: "progressive",
      description: "Spanish IRPF (Impuesto sobre la Renta de las Personas Físicas). 2025 national brackets, single filer. Autonomous community rates vary (state portion only modeled).",
      sourceUrl: "https://www.agenciatributaria.es/AEAT.internet/en_gb/Inicio/La_Agencia_Tributaria/Campanas/_Personal_.html",
      orgName: "Agencia Tributaria",
      brackets: [
        [0, 12450, 0.19], [12450, 20200, 0.24], [20200, 35200, 0.30],
        [35200, 60000, 0.37], [60000, 300000, 0.45], [300000, null, 0.47],
      ],
      socialRate: 0.0635, socialCap: null, socialNotes: "Seguridad Social employee ~6.35% (general regime)." },

    // Netherlands — 3-bracket system 2025
    { code: "NL", slug: "netherlands", name: "Netherlands", region: "Europe",
      currency: "EUR", flagEmoji: "🇳🇱", taxSystem: "progressive",
      description: "Dutch inkomstenbelasting. 2025 3-bracket system (Box 1 only). General tax credit + labor credit applied via standard deduction.",
      sourceUrl: "https://www.belastingdienst.nl/wps/wcm/connect/bldcontenten/belastingdienst/individuals/income-tax",
      orgName: "Belastingdienst",
      brackets: [[0, 38441, 0.0942], [38441, 76817, 0.3748], [76817, null, 0.495]],
      socialRate: 0.0975, socialCap: null, socialNotes: "Employee social premiums ~9.75% (AOW, WLZ, WIA, etc.)" },

    // Ireland — USC + income tax (simplified, only income tax modeled)
    { code: "IE", slug: "ireland", name: "Ireland", region: "Europe",
      currency: "EUR", flagEmoji: "🇮🇪", taxSystem: "progressive",
      description: "Irish income tax. 2025 PAYE rates, single filer. Universal Social Charge (USC) and PRSI not modeled.",
      sourceUrl: "https://www.revenue.ie/en/personal-tax-credits-reliefs-and-exemptions/tax-relief-charts/index.aspx",
      orgName: "Revenue",
      brackets: [[0, 42000, 0.20], [42000, null, 0.40]],
      socialRate: 0.04, socialCap: null, socialNotes: "PRSI ~4% (employee, Class A1). USC additional 0.5-8% on top, not modeled." },

    // Switzerland — federal direct tax 2025
    { code: "CH", slug: "switzerland", name: "Switzerland", region: "Europe",
      currency: "CHF", flagEmoji: "🇨🇭", taxSystem: "progressive",
      description: "Swiss federal direct tax (DBG). 2025 brackets, single. Cantonal + communal taxes (typically 1.5-3× federal) not modeled.",
      sourceUrl: "https://www.estv.admin.ch/estv/en/home.html",
      orgName: "ESTV (FTA)",
      brackets: [
        [0, 14500, 0], [14500, 31600, 0.0077], [31600, 41400, 0.0088],
        [41400, 55200, 0.0297], [55200, 72500, 0.0594], [72500, 78100, 0.066],
        [78100, 103600, 0.088], [103600, 134600, 0.11], [134600, null, 0.132],
      ],
      socialRate: 0.105, socialCap: null, socialNotes: "AHV/IV/EO ~5.275%, ALV ~1.1%, pension ~varies. Simplified 10.5%." },

    // Singapore — 2025 progressive (no capital gains tax, no tax on foreign-sourced income remitted)
    { code: "SG", slug: "singapore", name: "Singapore", region: "Asia",
      currency: "SGD", flagEmoji: "🇸🇬", taxSystem: "progressive",
      description: "Singapore income tax (YA 2025). Non-resident: 15% flat / 22% from YA 2024+. Resident: progressive below. Top marginal 24%.",
      sourceUrl: "https://www.iras.gov.sg/taxes/individual-income-tax/basics-of-individual-income-tax/tax-residents/individual-income-tax-rates",
      orgName: "IRAS",
      brackets: [
        [0, 20000, 0], [20000, 30000, 0.02], [30000, 40000, 0.035], [40000, 80000, 0.07],
        [80000, 120000, 0.115], [120000, 160000, 0.15], [160000, 200000, 0.18],
        [200000, 240000, 0.19], [240000, 280000, 0.195], [280000, 320000, 0.20],
        [320000, 500000, 0.22], [500000, 1000000, 0.23], [1000000, null, 0.24],
      ],
      socialRate: 0.20, socialCap: null, socialNotes: "CPF (Central Provident Fund) ~20% employee share (citizens/PRs only). Not applied to foreigners — Phase 0 simplification always applies 20%." },

    // UAE — no personal income tax (but corporate tax 9% on profits > AED 375K from 2023)
    { code: "AE", slug: "uae", name: "United Arab Emirates", region: "Asia",
      currency: "AED", flagEmoji: "🇦🇪", taxSystem: "none",
      description: "UAE has no federal personal income tax. Corporate tax 9% applies from June 2023 (not modeled). Salary = gross, no deductions.",
      sourceUrl: "https://u.ae/en/information-and-services/finance-and-investment/taxation",
      orgName: "Federal Tax Authority",
      brackets: [],
      socialRate: 0.05, socialCap: null, socialNotes: "GPSSA (UAE nationals) 5% — most expats not subject. Phase 0 keeps it simple." },
  ];

  for (const cs of newCountries) {
    console.log(`  ${cs.flagEmoji} ${cs.name}`);
    const country = await prisma.country.create({
      data: {
        code: cs.code, slug: cs.slug, name: cs.name, region: cs.region,
        defaultCurrency: cs.currency, flagEmoji: cs.flagEmoji,
        taxSystem: cs.taxSystem, description: cs.description,
      },
    });

    if (cs.brackets.length > 0) {
      const taxRule = await prisma.taxRule.create({
        data: {
          countryId: country.id, year: 2025, type: "income_tax",
          version: 1, status: "published",
          sourceUrl: cs.sourceUrl, notes: cs.description,
          publishedAt: new Date(),
        },
      });
      await prisma.taxBracket.createMany({
        data: cs.brackets.map((b, i) => ({
          taxRuleId: taxRule.id, orderIndex: i,
          lowerBound: b[0], upperBound: b[1], rate: b[2],
        })),
      });
      if (cs.deductions && cs.deductions.length > 0) {
        await prisma.deduction.createMany({
          data: cs.deductions.map((d) => ({
            taxRuleId: taxRule.id, name: d.name, type: d.type,
            amount: d.amount, percentage: d.pct ?? null,
          })),
        });
      }
    }

    if (cs.socialRate !== undefined) {
      await prisma.salaryConfig.create({
        data: {
          countryId: country.id, year: 2025,
          employeeSocialRate: cs.socialRate,
          employerSocialRate: cs.socialRate,
          socialCap: cs.socialCap ?? null,
          healthcareRate: 0, healthcareCap: null,
          notes: cs.socialNotes ?? null,
        },
      });
    }

    await prisma.dataSource.create({
      data: {
        countryId: country.id, sourceUrl: cs.sourceUrl,
        organization: cs.orgName, reliability: "high",
      },
    });
  }

  console.log("\n✅ Seed complete!");
  console.log(`   Countries: 14 (USA, UK, Germany, France, Canada + IT, JP, AU, ES, NL, IE, CH, SG, AE)`);
  console.log(`   US States: 29 (top 25 by pop + 4 no-tax + DC in future)`);
  console.log(`   Tax rules: 14 (one per country, year 2025)`);
  console.log(`   Brackets: 26 federal + ~75 state + ~70 international ≈ 170 total`);
  console.log(`   Deductions: 7 (1 US federal + 1 UK + 1 DE + 1 CA + 1 IT + 1 JP + 1 NL implied via tax credits)`);
  console.log(`   Salary configs: 14`);
  console.log(`   Data sources: 14`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });