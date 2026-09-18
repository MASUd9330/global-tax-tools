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

  console.log("\n✅ Seed complete!");
  console.log(`   Countries: 5 (USA, UK, Germany, France, Canada)`);
  console.log(`   Tax rules: 5 (one per country, year 2025)`);
  console.log(`   Brackets: 26 total`);
  console.log(`   Deductions: 5 (one per country)`);
  console.log(`   Salary configs: 5`);
  console.log(`   Data sources: 5`);
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