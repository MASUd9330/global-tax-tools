/**
 * Static tax data — 14 countries × 2025.
 * Generated from seed.ts (Sep 2025). No DB queries at runtime.
 */

export interface StaticTaxBracket {
  lowerBound: number;
  upperBound: number | null;
  rate: number;
  fixedAmount?: number | null; // for German-style "fixed + Y% over Z" formula
}

export interface StaticDeduction {
  name: string;
  type: string;
  amount: number;
  percentage?: number | null;
}

export interface StaticTaxRule {
  year: number;
  type: string;
  brackets: StaticTaxBracket[];
  deductions: StaticDeduction[];
}

export interface StaticSalaryConfig {
  year: number;
  employeeSocialRate: number;
  employerSocialRate: number;
  socialCap: number | null;
  healthcareRate: number;
  healthcareCap: number | null;
}

export interface StaticCountry {
  code: string;
  slug: string;
  name: string;
  region: string;
  defaultCurrency: string;
  flagEmoji: string;
  taxSystem: string;
  description: string;
  sourceUrl: string;
  organization: string;
  taxRule: StaticTaxRule | null; // null = no income tax (e.g., UAE)
  salaryConfig: StaticSalaryConfig | null;
}

export const COUNTRIES: StaticCountry[] = [
  {
    code: "US", slug: "usa", name: "United States", region: "North America",
    defaultCurrency: "USD", flagEmoji: "🇺🇸", taxSystem: "progressive",
    description: "Federal income tax for the United States. 2025 brackets, single filer. State taxes added separately.",
    sourceUrl: "https://www.irs.gov/filing/federal-income-tax-rates-and-brackets",
    organization: "IRS",
    taxRule: {
      year: 2025, type: "income_tax",
      brackets: [
        { lowerBound: 0, upperBound: 11925, rate: 0.10 },
        { lowerBound: 11925, upperBound: 48475, rate: 0.12 },
        { lowerBound: 48475, upperBound: 103350, rate: 0.22 },
        { lowerBound: 103350, upperBound: 197300, rate: 0.24 },
        { lowerBound: 197300, upperBound: 250525, rate: 0.32 },
        { lowerBound: 250525, upperBound: 626350, rate: 0.35 },
        { lowerBound: 626350, upperBound: null, rate: 0.37 },
      ],
      deductions: [{ name: "Standard Deduction (Single)", type: "standard", amount: 15000 }],
    },
    salaryConfig: { year: 2025, employeeSocialRate: 0.0765, employerSocialRate: 0.0765, socialCap: 176100, healthcareRate: 0, healthcareCap: null },
  },
  {
    code: "UK", slug: "uk", name: "United Kingdom", region: "Europe",
    defaultCurrency: "GBP", flagEmoji: "🇬🇧", taxSystem: "progressive",
    description: "Income tax + National Insurance for the United Kingdom. 2025/26 HMRC rates, England/Wales, single filer.",
    sourceUrl: "https://www.gov.uk/income-tax-rates",
    organization: "HMRC",
    taxRule: {
      year: 2025, type: "income_tax",
      brackets: [
        { lowerBound: 0, upperBound: 12570, rate: 0 },
        { lowerBound: 12570, upperBound: 50270, rate: 0.20 },
        { lowerBound: 50270, upperBound: 125140, rate: 0.40 },
        { lowerBound: 125140, upperBound: null, rate: 0.45 },
      ],
      deductions: [{ name: "Personal Allowance", type: "personal", amount: 12570 }],
    },
    salaryConfig: { year: 2025, employeeSocialRate: 0.08, employerSocialRate: 0.15, socialCap: 50270, healthcareRate: 0, healthcareCap: null },
  },
  {
    code: "DE", slug: "germany", name: "Germany", region: "Europe",
    defaultCurrency: "EUR", flagEmoji: "🇩🇪", taxSystem: "progressive",
    description: "German Einkommensteuer. 2025 BMF national brackets, single filer.",
    sourceUrl: "https://www.bmf-steuerrechner.de/",
    organization: "BMF",
    taxRule: {
      year: 2025, type: "income_tax",
      brackets: [
        { lowerBound: 0, upperBound: 12096, rate: 0 },
        { lowerBound: 12096, upperBound: 17443, rate: 0.14 },
        { lowerBound: 17443, upperBound: 68430, rate: 0.30 },
        { lowerBound: 68430, upperBound: 277825, rate: 0.42 },
        { lowerBound: 277825, upperBound: null, rate: 0.45 },
      ],
      deductions: [],
    },
    salaryConfig: { year: 2025, employeeSocialRate: 0.20, employerSocialRate: 0.20, socialCap: 87600, healthcareRate: 0, healthcareCap: null },
  },
  {
    code: "FR", slug: "france", name: "France", region: "Europe",
    defaultCurrency: "EUR", flagEmoji: "🇫🇷", taxSystem: "progressive",
    description: "French impôt sur le revenu. 2025 national brackets (revenus 2024), single filer.",
    sourceUrl: "https://www.impots.gouv.fr",
    organization: "DGFiP",
    taxRule: {
      year: 2025, type: "income_tax",
      brackets: [
        { lowerBound: 0, upperBound: 11497, rate: 0 },
        { lowerBound: 11497, upperBound: 29315, rate: 0.11 },
        { lowerBound: 29315, upperBound: 83823, rate: 0.30 },
        { lowerBound: 83823, upperBound: 180294, rate: 0.41 },
        { lowerBound: 180294, upperBound: null, rate: 0.45 },
      ],
      deductions: [],
    },
    salaryConfig: { year: 2025, employeeSocialRate: 0.22, employerSocialRate: 0.42, socialCap: null, healthcareRate: 0, healthcareCap: null },
  },
  {
    code: "CA", slug: "canada", name: "Canada", region: "North America",
    defaultCurrency: "CAD", flagEmoji: "🇨🇦", taxSystem: "progressive",
    description: "Canadian federal income tax. 2025 CRA brackets (single). Provincial taxes added separately.",
    sourceUrl: "https://www.canada.ca/en/revenue-agency.html",
    organization: "CRA",
    taxRule: {
      year: 2025, type: "income_tax",
      brackets: [
        { lowerBound: 0, upperBound: 57375, rate: 0.15 },
        { lowerBound: 57375, upperBound: 114750, rate: 0.205 },
        { lowerBound: 114750, upperBound: 177882, rate: 0.26 },
        { lowerBound: 177882, upperBound: 253414, rate: 0.29 },
        { lowerBound: 253414, upperBound: null, rate: 0.33 },
      ],
      deductions: [{ name: "Basic Personal Amount (Federal)", type: "personal", amount: 16129 }],
    },
    salaryConfig: { year: 2025, employeeSocialRate: 0.0595, employerSocialRate: 0.0595, socialCap: 71300, healthcareRate: 0.0164, healthcareCap: 65700 },
  },
  {
    code: "IT", slug: "italy", name: "Italy", region: "Europe",
    defaultCurrency: "EUR", flagEmoji: "🇮🇹", taxSystem: "progressive",
    description: "Italian IRPEF 2025 national brackets, single filer.",
    sourceUrl: "https://www.agenziaentrate.gov.it",
    organization: "Agenzia delle Entrate",
    taxRule: {
      year: 2025, type: "income_tax",
      brackets: [
        { lowerBound: 0, upperBound: 28000, rate: 0.23 },
        { lowerBound: 28000, upperBound: 50000, rate: 0.35 },
        { lowerBound: 50000, upperBound: null, rate: 0.43 },
      ],
      deductions: [],
    },
    salaryConfig: { year: 2025, employeeSocialRate: 0.0991, employerSocialRate: 0.30, socialCap: null, healthcareRate: 0, healthcareCap: null },
  },
  {
    code: "JP", slug: "japan", name: "Japan", region: "Asia",
    defaultCurrency: "JPY", flagEmoji: "🇯🇵", taxSystem: "progressive",
    description: "Japan national income tax. 2025 brackets, single filer (national only).",
    sourceUrl: "https://www.nta.go.jp/english/taxes/individual/index.htm",
    organization: "NTA",
    taxRule: {
      year: 2025, type: "income_tax",
      brackets: [
        { lowerBound: 0, upperBound: 1950000, rate: 0.05 },
        { lowerBound: 1950000, upperBound: 3300000, rate: 0.10 },
        { lowerBound: 3300000, upperBound: 6950000, rate: 0.20 },
        { lowerBound: 6950000, upperBound: 9000000, rate: 0.23 },
        { lowerBound: 9000000, upperBound: 18000000, rate: 0.33 },
        { lowerBound: 18000000, upperBound: 40000000, rate: 0.40 },
        { lowerBound: 40000000, upperBound: null, rate: 0.45 },
      ],
      deductions: [{ name: "Basic Deduction (基礎控除)", type: "standard", amount: 480000 }],
    },
    salaryConfig: { year: 2025, employeeSocialRate: 0.149, employerSocialRate: 0.15, socialCap: null, healthcareRate: 0, healthcareCap: null },
  },
  {
    code: "AU", slug: "australia", name: "Australia", region: "Oceania",
    defaultCurrency: "AUD", flagEmoji: "🇦🇺", taxSystem: "progressive",
    description: "Australian federal income tax. 2025-26 financial year. 5 brackets.",
    sourceUrl: "https://www.ato.gov.au/Rates/Individual-income-tax-rates",
    organization: "ATO",
    taxRule: {
      year: 2025, type: "income_tax",
      brackets: [
        { lowerBound: 0, upperBound: 18200, rate: 0 },
        { lowerBound: 18200, upperBound: 45000, rate: 0.16 },
        { lowerBound: 45000, upperBound: 135000, rate: 0.30 },
        { lowerBound: 135000, upperBound: 190000, rate: 0.37 },
        { lowerBound: 190000, upperBound: null, rate: 0.45 },
      ],
      deductions: [],
    },
    salaryConfig: { year: 2025, employeeSocialRate: 0, employerSocialRate: 0.115, socialCap: null, healthcareRate: 0.02, healthcareCap: null },
  },
  {
    code: "ES", slug: "spain", name: "Spain", region: "Europe",
    defaultCurrency: "EUR", flagEmoji: "🇪🇸", taxSystem: "progressive",
    description: "Spanish IRPF 2025 national brackets, single filer.",
    sourceUrl: "https://www.agenciatributaria.es",
    organization: "Agencia Tributaria",
    taxRule: {
      year: 2025, type: "income_tax",
      brackets: [
        { lowerBound: 0, upperBound: 12450, rate: 0.19 },
        { lowerBound: 12450, upperBound: 20200, rate: 0.24 },
        { lowerBound: 20200, upperBound: 35200, rate: 0.30 },
        { lowerBound: 35200, upperBound: 60000, rate: 0.37 },
        { lowerBound: 60000, upperBound: 300000, rate: 0.45 },
        { lowerBound: 300000, upperBound: null, rate: 0.47 },
      ],
      deductions: [],
    },
    salaryConfig: { year: 2025, employeeSocialRate: 0.0635, employerSocialRate: 0.30, socialCap: null, healthcareRate: 0, healthcareCap: null },
  },
  {
    code: "NL", slug: "netherlands", name: "Netherlands", region: "Europe",
    defaultCurrency: "EUR", flagEmoji: "🇳🇱", taxSystem: "progressive",
    description: "Dutch inkomstenbelasting. 2025 3-bracket system.",
    sourceUrl: "https://www.belastingdienst.nl",
    organization: "Belastingdienst",
    taxRule: {
      year: 2025, type: "income_tax",
      brackets: [
        { lowerBound: 0, upperBound: 38441, rate: 0.0942 },
        { lowerBound: 38441, upperBound: 76817, rate: 0.3748 },
        { lowerBound: 76817, upperBound: null, rate: 0.495 },
      ],
      deductions: [],
    },
    salaryConfig: { year: 2025, employeeSocialRate: 0.0975, employerSocialRate: 0.1831, socialCap: null, healthcareRate: 0, healthcareCap: null },
  },
  {
    code: "IE", slug: "ireland", name: "Ireland", region: "Europe",
    defaultCurrency: "EUR", flagEmoji: "🇮🇪", taxSystem: "progressive",
    description: "Irish PAYE income tax. 2025 rates, single filer.",
    sourceUrl: "https://www.revenue.ie",
    organization: "Revenue",
    taxRule: {
      year: 2025, type: "income_tax",
      brackets: [
        { lowerBound: 0, upperBound: 42000, rate: 0.20 },
        { lowerBound: 42000, upperBound: null, rate: 0.40 },
      ],
      deductions: [],
    },
    salaryConfig: { year: 2025, employeeSocialRate: 0.04, employerSocialRate: 0.1085, socialCap: null, healthcareRate: 0.04, healthcareCap: null },
  },
  {
    code: "CH", slug: "switzerland", name: "Switzerland", region: "Europe",
    defaultCurrency: "CHF", flagEmoji: "🇨🇭", taxSystem: "progressive",
    description: "Swiss federal direct tax (DBG). 2025 brackets, single. Cantonal/communal not modeled.",
    sourceUrl: "https://www.estv.admin.ch",
    organization: "ESTV",
    taxRule: {
      year: 2025, type: "income_tax",
      brackets: [
        { lowerBound: 0, upperBound: 14500, rate: 0 },
        { lowerBound: 14500, upperBound: 31600, rate: 0.0077 },
        { lowerBound: 31600, upperBound: 41400, rate: 0.0088 },
        { lowerBound: 41400, upperBound: 55200, rate: 0.0297 },
        { lowerBound: 55200, upperBound: 72500, rate: 0.0594 },
        { lowerBound: 72500, upperBound: 78100, rate: 0.066 },
        { lowerBound: 78100, upperBound: 103600, rate: 0.088 },
        { lowerBound: 103600, upperBound: 134600, rate: 0.11 },
        { lowerBound: 134600, upperBound: null, rate: 0.132 },
      ],
      deductions: [],
    },
    salaryConfig: { year: 2025, employeeSocialRate: 0.105, employerSocialRate: 0.105, socialCap: null, healthcareRate: 0, healthcareCap: null },
  },
  {
    code: "SG", slug: "singapore", name: "Singapore", region: "Asia",
    defaultCurrency: "SGD", flagEmoji: "🇸🇬", taxSystem: "progressive",
    description: "Singapore income tax (YA 2025). Progressive, top 24%.",
    sourceUrl: "https://www.iras.gov.sg/taxes/individual-income-tax",
    organization: "IRAS",
    taxRule: {
      year: 2025, type: "income_tax",
      brackets: [
        { lowerBound: 0, upperBound: 20000, rate: 0 },
        { lowerBound: 20000, upperBound: 30000, rate: 0.02 },
        { lowerBound: 30000, upperBound: 40000, rate: 0.035 },
        { lowerBound: 40000, upperBound: 80000, rate: 0.07 },
        { lowerBound: 80000, upperBound: 120000, rate: 0.115 },
        { lowerBound: 120000, upperBound: 160000, rate: 0.15 },
        { lowerBound: 160000, upperBound: 200000, rate: 0.18 },
        { lowerBound: 200000, upperBound: 240000, rate: 0.19 },
        { lowerBound: 240000, upperBound: 280000, rate: 0.195 },
        { lowerBound: 280000, upperBound: 320000, rate: 0.20 },
        { lowerBound: 320000, upperBound: 500000, rate: 0.22 },
        { lowerBound: 500000, upperBound: 1000000, rate: 0.23 },
        { lowerBound: 1000000, upperBound: null, rate: 0.24 },
      ],
      deductions: [],
    },
    salaryConfig: { year: 2025, employeeSocialRate: 0.20, employerSocialRate: 0.17, socialCap: null, healthcareRate: 0, healthcareCap: null },
  },
  {
    code: "AE", slug: "uae", name: "United Arab Emirates", region: "Asia",
    defaultCurrency: "AED", flagEmoji: "🇦🇪", taxSystem: "none",
    description: "UAE has no federal personal income tax. Corporate tax 9% applies (not modeled).",
    sourceUrl: "https://u.ae/en/information-and-services/finance-and-investment/taxation",
    organization: "Federal Tax Authority",
    taxRule: null,
    salaryConfig: { year: 2025, employeeSocialRate: 0.05, employerSocialRate: 0.05, socialCap: null, healthcareRate: 0, healthcareCap: null },
  },
  {
    // PORTUGAL — P8 in gap detector (NHR program, top expat destination)
    code: "PT", slug: "portugal", name: "Portugal", region: "Europe",
    defaultCurrency: "EUR", flagEmoji: "🇵🇹", taxSystem: "progressive",
    description: "Portuguese IRS (Imposto sobre o Rendimento das Pessoas Singulares). 2025 mainland brackets. NHR program (20% flat for 10 years for qualifying expats) NOT modeled.",
    sourceUrl: "https://www.portaldasfinancas.gov.pt/",
    organization: "Autoridade Tributária",
    taxRule: {
      year: 2025, type: "income_tax",
      brackets: [
        { lowerBound: 0, upperBound: 8059, rate: 0.145 },
        { lowerBound: 8059, upperBound: 12160, rate: 0.21 },
        { lowerBound: 12160, upperBound: 17233, rate: 0.265 },
        { lowerBound: 17233, upperBound: 22306, rate: 0.285 },
        { lowerBound: 22306, upperBound: 28400, rate: 0.35 },
        { lowerBound: 28400, upperBound: 41107, rate: 0.37 },
        { lowerBound: 41107, upperBound: 49818, rate: 0.435 },
        { lowerBound: 49818, upperBound: 80782, rate: 0.45 },
        { lowerBound: 80782, upperBound: null, rate: 0.48 },
      ],
      deductions: [],
    },
    salaryConfig: { year: 2025, employeeSocialRate: 0.11, employerSocialRate: 0.2375, socialCap: null, healthcareRate: 0, healthcareCap: null },
  },
  {
    // INDIA — P7 in gap detector (huge user base, big search volume)
    code: "IN", slug: "india", name: "India", region: "Asia",
    defaultCurrency: "INR", flagEmoji: "🇮🇳", taxSystem: "progressive",
    description: "Indian Income Tax (new regime FY 2025-26). Single filer below 60 years. Old regime not modeled.",
    sourceUrl: "https://www.incometax.gov.in/",
    organization: "Income Tax Department",
    taxRule: {
      year: 2025, type: "income_tax",
      brackets: [
        { lowerBound: 0, upperBound: 300000, rate: 0 },
        { lowerBound: 300000, upperBound: 700000, rate: 0.05 },
        { lowerBound: 700000, upperBound: 1000000, rate: 0.10 },
        { lowerBound: 1000000, upperBound: 1200000, rate: 0.15 },
        { lowerBound: 1200000, upperBound: 1500000, rate: 0.20 },
        { lowerBound: 1500000, upperBound: null, rate: 0.30 },
      ],
      deductions: [{ name: "Standard Deduction", type: "standard", amount: 75000 }],
    },
    salaryConfig: { year: 2025, employeeSocialRate: 0.12, employerSocialRate: 0.12, socialCap: null, healthcareRate: 0, healthcareCap: null },
  },
  {
    // BRAZIL — P6 in gap detector (largest LATAM economy)
    code: "BR", slug: "brazil", name: "Brazil", region: "South America",
    defaultCurrency: "BRL", flagEmoji: "🇧🇷", taxSystem: "progressive",
    description: "Brazilian IRPF (Imposto de Renda Pessoa Física). 2025 monthly brackets (simplified to annual).",
    sourceUrl: "https://www.gov.br/receitafederal/",
    organization: "Receita Federal",
    taxRule: {
      year: 2025, type: "income_tax",
      brackets: [
        { lowerBound: 0, upperBound: 28560, rate: 0 },
        { lowerBound: 28560, upperBound: 57120, rate: 0.075 },
        { lowerBound: 57120, upperBound: 85668, rate: 0.15 },
        { lowerBound: 85668, upperBound: 171336, rate: 0.225 },
        { lowerBound: 171336, upperBound: null, rate: 0.275 },
      ],
      deductions: [],
    },
    salaryConfig: { year: 2025, employeeSocialRate: 0.11, employerSocialRate: 0.20, socialCap: null, healthcareRate: 0, healthcareCap: null },
  },
  {
    // MEXICO — P6 in gap detector (top expat destination)
    code: "MX", slug: "mexico", name: "Mexico", region: "North America",
    defaultCurrency: "MXN", flagEmoji: "🇲🇽", taxSystem: "progressive",
    description: "Mexican ISR (Impuesto Sobre la Renta). 2025 annual brackets, single filer.",
    sourceUrl: "https://www.sat.gob.mx/",
    organization: "SAT (Servicio de Administración Tributaria)",
    taxRule: {
      year: 2025, type: "income_tax",
      brackets: [
        { lowerBound: 0, upperBound: 8952, rate: 0.0192 },
        { lowerBound: 8952, upperBound: 75984, rate: 0.064 },
        { lowerBound: 75984, upperBound: 133536, rate: 0.1088 },
        { lowerBound: 133536, upperBound: 155229, rate: 0.16 },
        { lowerBound: 155229, upperBound: 185852, rate: 0.1792 },
        { lowerBound: 185852, upperBound: 374837, rate: 0.2392 },
        { lowerBound: 374837, upperBound: 590795, rate: 0.30 },
        { lowerBound: 590795, upperBound: 1127927, rate: 0.32 },
        { lowerBound: 1127927, upperBound: 1503903, rate: 0.34 },
        { lowerBound: 1503903, upperBound: null, rate: 0.35 },
      ],
      deductions: [],
    },
    salaryConfig: { year: 2025, employeeSocialRate: 0.0288, employerSocialRate: 0.0687, socialCap: null, healthcareRate: 0.0168, healthcareCap: null },
  },
  {
    // NEW ZEALAND — P5 in gap detector (English-speaking)
    code: "NZ", slug: "new-zealand", name: "New Zealand", region: "Oceania",
    defaultCurrency: "NZD", flagEmoji: "🇳🇿", taxSystem: "progressive",
    description: "New Zealand income tax. 2025-26 brackets, single filer.",
    sourceUrl: "https://www.ird.govt.nz/",
    organization: "IRD (Inland Revenue)",
    taxRule: {
      year: 2025, type: "income_tax",
      brackets: [
        { lowerBound: 0, upperBound: 14000, rate: 0.105 },
        { lowerBound: 14000, upperBound: 48000, rate: 0.175 },
        { lowerBound: 48000, upperBound: 70000, rate: 0.30 },
        { lowerBound: 70000, upperBound: 180000, rate: 0.33 },
        { lowerBound: 180000, upperBound: null, rate: 0.39 },
      ],
      deductions: [],
    },
    salaryConfig: { year: 2025, employeeSocialRate: 0, employerSocialRate: 0, socialCap: null, healthcareRate: 0, healthcareCap: null },
  },
  {
    // SWEDEN — P4 in gap detector (Nordic, high tax interest)
    code: "SE", slug: "sweden", name: "Sweden", region: "Europe",
    defaultCurrency: "SEK", flagEmoji: "🇸🇪", taxSystem: "progressive",
    description: "Swedish inkomstskatt. 2025 national brackets (kommunalskatt not modeled — adds ~30%).",
    sourceUrl: "https://www.skatteverket.se/",
    organization: "Skatteverket",
    taxRule: {
      year: 2025, type: "income_tax",
      brackets: [
        { lowerBound: 0, upperBound: 50400, rate: 0 },
        { lowerBound: 50400, upperBound: 61300, rate: 0.20 },
        { lowerBound: 61300, upperBound: null, rate: 0.20 }, // Simplified (real has marginalskatt)
      ],
      deductions: [],
    },
    salaryConfig: { year: 2025, employeeSocialRate: 0.07, employerSocialRate: 0.3142, socialCap: null, healthcareRate: 0, healthcareCap: null },
  },
  {
    // NORWAY — P4 in gap detector (Nordic, high tax interest)
    code: "NO", slug: "norway", name: "Norway", region: "Europe",
    defaultCurrency: "NOK", flagEmoji: "🇳🇴", taxSystem: "progressive",
    description: "Norwegian skatt. 2025 national brackets, single filer. Trinnskatt (step tax) + trygdeavgift (national insurance) not modeled separately.",
    sourceUrl: "https://www.skatteetaten.no/",
    organization: "Skatteetaten",
    taxRule: {
      year: 2025, type: "income_tax",
      brackets: [
        { lowerBound: 0, upperBound: 208050, rate: 0 },
        { lowerBound: 208050, upperBound: 292850, rate: 0.017 },
        { lowerBound: 292850, upperBound: 670000, rate: 0.04 },
        { lowerBound: 670000, upperBound: 937900, rate: 0.136 },
        { lowerBound: 937900, upperBound: 1350000, rate: 0.166 },
        { lowerBound: 1350000, upperBound: null, rate: 0.176 },
      ],
      deductions: [],
    },
    salaryConfig: { year: 2025, employeeSocialRate: 0.078, employerSocialRate: 0.141, socialCap: null, healthcareRate: 0, healthcareCap: null },
  },
  {
    // DENMARK — P4 in gap detector (Nordic, high tax interest)
    code: "DK", slug: "denmark", name: "Denmark", region: "Europe",
    defaultCurrency: "DKK", flagEmoji: "🇩🇰", taxSystem: "progressive",
    description: "Danish bundskat (national tax). 2025 brackets, single. Kommuneskat (~25%) + health tax (~1%) NOT modeled — total effective is higher.",
    sourceUrl: "https://skat.dk/",
    organization: "Skatteforvaltningen",
    taxRule: {
      year: 2025, type: "income_tax",
      brackets: [
        { lowerBound: 0, upperBound: 58800, rate: 0.1212 },
        { lowerBound: 58800, upperBound: null, rate: 0.15 },
      ],
      deductions: [],
    },
    salaryConfig: { year: 2025, employeeSocialRate: 0, employerSocialRate: 0.08, socialCap: null, healthcareRate: 0, healthcareCap: null },
  },

  // === PHASE 6 EXPANSION — 22 additional countries ===

  // ASIA
  {
    code: "CN", slug: "china", name: "China", region: "Asia",
    defaultCurrency: "CNY", flagEmoji: "🇨🇳", taxSystem: "progressive",
    description: "China individual income tax (IIT) for comprehensive income. 2025 brackets, monthly → annualized.",
    sourceUrl: "https://www.chinatax.gov.cn/eng/",
    organization: "STA China",
    taxRule: {
      year: 2025, type: "income_tax",
      brackets: [
        { lowerBound: 0, upperBound: 36000, rate: 0.03 },
        { lowerBound: 36000, upperBound: 144000, rate: 0.10 },
        { lowerBound: 144000, upperBound: 300000, rate: 0.20 },
        { lowerBound: 300000, upperBound: 420000, rate: 0.25 },
        { lowerBound: 420000, upperBound: 660000, rate: 0.30 },
        { lowerBound: 660000, upperBound: 960000, rate: 0.35 },
        { lowerBound: 960000, upperBound: null, rate: 0.45 },
      ],
      deductions: [{ name: "Standard Exemption (¥60,000/yr)", type: "standard", amount: 60000 }],
    },
    salaryConfig: { year: 2025, employeeSocialRate: 0.105, employerSocialRate: 0.30, socialCap: null, healthcareRate: 0.02, healthcareCap: null },
  },
  {
    code: "KR", slug: "south-korea", name: "South Korea", region: "Asia",
    defaultCurrency: "KRW", flagEmoji: "🇰🇷", taxSystem: "progressive",
    description: "Korean income tax + local income tax (10% of income tax). 2025 brackets.",
    sourceUrl: "https://www.nts.go.kr/eng/",
    organization: "NTS Korea",
    taxRule: {
      year: 2025, type: "income_tax",
      brackets: [
        { lowerBound: 0, upperBound: 14000000, rate: 0.06 },
        { lowerBound: 14000000, upperBound: 50000000, rate: 0.15 },
        { lowerBound: 50000000, upperBound: 88000000, rate: 0.24 },
        { lowerBound: 88000000, upperBound: 150000000, rate: 0.35 },
        { lowerBound: 150000000, upperBound: 300000000, rate: 0.38 },
        { lowerBound: 300000000, upperBound: 500000000, rate: 0.40 },
        { lowerBound: 500000000, upperBound: 1000000000, rate: 0.42 },
        { lowerBound: 1000000000, upperBound: null, rate: 0.45 },
      ],
      deductions: [{ name: "Personal Exemption", type: "personal", amount: 1500000 }],
    },
    salaryConfig: { year: 2025, employeeSocialRate: 0.0905, employerSocialRate: 0.1085, socialCap: null, healthcareRate: 0.0354, healthcareCap: null },
  },
  {
    code: "HK", slug: "hong-kong", name: "Hong Kong", region: "Asia",
    defaultCurrency: "HKD", flagEmoji: "🇭🇰", taxSystem: "progressive",
    description: "Hong Kong salaries tax. 2025/26 brackets. Two-tier standard rate above HKD 5M.",
    sourceUrl: "https://www.ird.gov.hk/eng/tax/itr.htm",
    organization: "IRD Hong Kong",
    taxRule: {
      year: 2025, type: "income_tax",
      brackets: [
        { lowerBound: 0, upperBound: 50000, rate: 0.02 },
        { lowerBound: 50000, upperBound: 100000, rate: 0.06 },
        { lowerBound: 100000, upperBound: 150000, rate: 0.10 },
        { lowerBound: 150000, upperBound: 200000, rate: 0.14 },
        { lowerBound: 200000, upperBound: 5000000, rate: 0.17 },
        { lowerBound: 5000000, upperBound: null, rate: 0.17 }, // standard rate
      ],
      deductions: [{ name: "Basic Allowance", type: "personal", amount: 132000 }],
    },
    salaryConfig: { year: 2025, employeeSocialRate: 0.05, employerSocialRate: 0.05, socialCap: 30000, healthcareRate: 0, healthcareCap: null },
  },
  {
    code: "TW", slug: "taiwan", name: "Taiwan", region: "Asia",
    defaultCurrency: "TWD", flagEmoji: "🇹🇼", taxSystem: "progressive",
    description: "Taiwan individual income tax. 2025 brackets. NT$ equivalents.",
    sourceUrl: "https://www.dot.gov.tw/en/",
    organization: "MOF Taiwan",
    taxRule: {
      year: 2025, type: "income_tax",
      brackets: [
        { lowerBound: 0, upperBound: 560000, rate: 0.05 },
        { lowerBound: 560000, upperBound: 1260000, rate: 0.12 },
        { lowerBound: 1260000, upperBound: 2520000, rate: 0.20 },
        { lowerBound: 2520000, upperBound: 4720000, rate: 0.30 },
        { lowerBound: 4720000, upperBound: null, rate: 0.40 },
      ],
      deductions: [{ name: "Standard Deduction (Single)", type: "standard", amount: 131000 }],
    },
    salaryConfig: { year: 2025, employeeSocialRate: 0.0211, employerSocialRate: 0.155, socialCap: 45800, healthcareRate: 0.0517, healthcareCap: null },
  },
  {
    code: "MY", slug: "malaysia", name: "Malaysia", region: "Asia",
    defaultCurrency: "MYR", flagEmoji: "🇲🇾", taxSystem: "progressive",
    description: "Malaysia income tax for residents. 2025 YA brackets (MYR).",
    sourceUrl: "https://www.hasil.gov.my/en/",
    organization: "LHDN Malaysia",
    taxRule: {
      year: 2025, type: "income_tax",
      brackets: [
        { lowerBound: 0, upperBound: 5000, rate: 0 },
        { lowerBound: 5000, upperBound: 20000, rate: 0.01 },
        { lowerBound: 20000, upperBound: 35000, rate: 0.03 },
        { lowerBound: 35000, upperBound: 50000, rate: 0.06 },
        { lowerBound: 50000, upperBound: 70000, rate: 0.11 },
        { lowerBound: 70000, upperBound: 100000, rate: 0.19 },
        { lowerBound: 100000, upperBound: 400000, rate: 0.25 },
        { lowerBound: 400000, upperBound: 600000, rate: 0.26 },
        { lowerBound: 600000, upperBound: 1000000, rate: 0.28 },
        { lowerBound: 1000000, upperBound: null, rate: 0.30 },
      ],
      deductions: [{ name: "Individual Relief", type: "personal", amount: 9000 }],
    },
    salaryConfig: { year: 2025, employeeSocialRate: 0.11, employerSocialRate: 0.13, socialCap: null, healthcareRate: 0, healthcareCap: null },
  },
  {
    code: "TH", slug: "thailand", name: "Thailand", region: "Asia",
    defaultCurrency: "THB", flagEmoji: "🇹🇭", taxSystem: "progressive",
    description: "Thailand personal income tax. 2025 brackets (THB).",
    sourceUrl: "https://www.rd.go.th/english/",
    organization: "Revenue Dept Thailand",
    taxRule: {
      year: 2025, type: "income_tax",
      brackets: [
        { lowerBound: 0, upperBound: 150000, rate: 0 },
        { lowerBound: 150000, upperBound: 300000, rate: 0.05 },
        { lowerBound: 300000, upperBound: 500000, rate: 0.10 },
        { lowerBound: 500000, upperBound: 750000, rate: 0.15 },
        { lowerBound: 750000, upperBound: 1000000, rate: 0.20 },
        { lowerBound: 1000000, upperBound: 2000000, rate: 0.25 },
        { lowerBound: 2000000, upperBound: 5000000, rate: 0.30 },
        { lowerBound: 5000000, upperBound: null, rate: 0.35 },
      ],
      deductions: [{ name: "Personal Allowance", type: "personal", amount: 60000 }],
    },
    salaryConfig: { year: 2025, employeeSocialRate: 0.05, employerSocialRate: 0.05, socialCap: 17500, healthcareRate: 0, healthcareCap: null },
  },
  {
    code: "PH", slug: "philippines", name: "Philippines", region: "Asia",
    defaultCurrency: "PHP", flagEmoji: "🇵🇭", taxSystem: "progressive",
    description: "Philippines income tax. 2025 TRAIN law brackets (PHP).",
    sourceUrl: "https://www.bir.gov.ph/",
    organization: "BIR Philippines",
    taxRule: {
      year: 2025, type: "income_tax",
      brackets: [
        { lowerBound: 0, upperBound: 250000, rate: 0 },
        { lowerBound: 250000, upperBound: 400000, rate: 0.15 },
        { lowerBound: 400000, upperBound: 800000, rate: 0.20 },
        { lowerBound: 800000, upperBound: 2000000, rate: 0.25 },
        { lowerBound: 2000000, upperBound: 8000000, rate: 0.30 },
        { lowerBound: 8000000, upperBound: null, rate: 0.35 },
      ],
      deductions: [{ name: "Personal Exemption", type: "personal", amount: 50000 }],
    },
    salaryConfig: { year: 2025, employeeSocialRate: 0.045, employerSocialRate: 0.095, socialCap: null, healthcareRate: 0.04, healthcareCap: 90000 },
  },
  {
    code: "VN", slug: "vietnam", name: "Vietnam", region: "Asia",
    defaultCurrency: "VND", flagEmoji: "🇻🇳", taxSystem: "progressive",
    description: "Vietnam personal income tax. 2025 brackets (VND millions).",
    sourceUrl: "https://www.gdt.gov.vn/english",
    organization: "GDT Vietnam",
    taxRule: {
      year: 2025, type: "income_tax",
      brackets: [
        { lowerBound: 0, upperBound: 60000000, rate: 0.05 },
        { lowerBound: 60000000, upperBound: 120000000, rate: 0.10 },
        { lowerBound: 120000000, upperBound: 216000000, rate: 0.15 },
        { lowerBound: 216000000, upperBound: 384000000, rate: 0.20 },
        { lowerBound: 384000000, upperBound: 624000000, rate: 0.25 },
        { lowerBound: 624000000, upperBound: 960000000, rate: 0.30 },
        { lowerBound: 960000000, upperBound: null, rate: 0.35 },
      ],
      deductions: [{ name: "Personal Deduction (11M VND)", type: "personal", amount: 11000000 }],
    },
    salaryConfig: { year: 2025, employeeSocialRate: 0.105, employerSocialRate: 0.215, socialCap: null, healthcareRate: 0.015, healthcareCap: null },
  },
  {
    code: "ID", slug: "indonesia", name: "Indonesia", region: "Asia",
    defaultCurrency: "IDR", flagEmoji: "🇮🇩", taxSystem: "progressive",
    description: "Indonesia PPh 21 income tax for employees. 2025 brackets (IDR).",
    sourceUrl: "https://www.pajak.go.id/en",
    organization: "DJP Indonesia",
    taxRule: {
      year: 2025, type: "income_tax",
      brackets: [
        { lowerBound: 0, upperBound: 60000000, rate: 0.05 },
        { lowerBound: 60000000, upperBound: 250000000, rate: 0.15 },
        { lowerBound: 250000000, upperBound: 500000000, rate: 0.25 },
        { lowerBound: 500000000, upperBound: 5000000000, rate: 0.30 },
        { lowerBound: 5000000000, upperBound: null, rate: 0.35 },
      ],
      deductions: [{ name: "PTKP (Non-Taxable Income)", type: "personal", amount: 54000000 }],
    },
    salaryConfig: { year: 2025, employeeSocialRate: 0.03, employerSocialRate: 0.10, socialCap: null, healthcareRate: 0.05, healthcareCap: null },
  },

  // MIDDLE EAST
  {
    code: "SA", slug: "saudi-arabia", name: "Saudi Arabia", region: "Middle East",
    defaultCurrency: "SAR", flagEmoji: "🇸🇦", taxSystem: "progressive",
    description: "Saudi Arabia personal income tax for non-Saudi residents. Saudi nationals pay 0%.",
    sourceUrl: "https://www.gazt.gov.sa/en",
    organization: "GAZT Saudi",
    taxRule: {
      year: 2025, type: "income_tax",
      brackets: [
        { lowerBound: 0, upperBound: null, rate: 0 }, // Saudis only
      ],
      deductions: [],
    },
    salaryConfig: { year: 2025, employeeSocialRate: 0.09, employerSocialRate: 0.09, socialCap: null, healthcareRate: 0, healthcareCap: null },
  },
  {
    code: "IL", slug: "israel", name: "Israel", region: "Middle East",
    defaultCurrency: "ILS", flagEmoji: "🇮🇱", taxSystem: "progressive",
    description: "Israel income tax. 2025 brackets (NIS). Bituach Leumi (social) + health tax not modeled.",
    sourceUrl: "https://www.gov.il/en/departments/israel-tax-authority",
    organization: "ITA Israel",
    taxRule: {
      year: 2025, type: "income_tax",
      brackets: [
        { lowerBound: 0, upperBound: 87180, rate: 0.10 },
        { lowerBound: 87180, upperBound: 116760, rate: 0.14 },
        { lowerBound: 116760, upperBound: 187440, rate: 0.20 },
        { lowerBound: 187440, upperBound: 246480, rate: 0.31 },
        { lowerBound: 246480, upperBound: 514800, rate: 0.35 },
        { lowerBound: 514800, upperBound: 663960, rate: 0.47 },
        { lowerBound: 663960, upperBound: null, rate: 0.50 },
      ],
      deductions: [{ name: "Credit Points (2.25 points × ILS 2,904)", type: "personal", amount: 6534 }],
    },
    salaryConfig: { year: 2025, employeeSocialRate: 0.12, employerSocialRate: 0.14, socialCap: null, healthcareRate: 0.05, healthcareCap: null },
  },

  // EUROPE (additions)
  {
    code: "PL", slug: "poland", name: "Poland", region: "Europe",
    defaultCurrency: "PLN", flagEmoji: "🇵🇱", taxSystem: "progressive",
    description: "Poland PIT. 2025 brackets (PLN). 12% up to 120k, 32% above. Health insurance 9% not modeled.",
    sourceUrl: "https://www.podatki.gov.pl/en/",
    organization: "KAS Poland",
    taxRule: {
      year: 2025, type: "income_tax",
      brackets: [
        { lowerBound: 0, upperBound: 120000, rate: 0.12 },
        { lowerBound: 120000, upperBound: null, rate: 0.32 },
      ],
      deductions: [{ name: "Kwota wolna (Tax-free amount)", type: "standard", amount: 30000 }],
    },
    salaryConfig: { year: 2025, employeeSocialRate: 0.0976, employerSocialRate: 0.0901, socialCap: 234720, healthcareRate: 0.09, healthcareCap: null },
  },
  {
    code: "FI", slug: "finland", name: "Finland", region: "Europe",
    defaultCurrency: "EUR", flagEmoji: "🇫🇮", taxSystem: "progressive",
    description: "Finland ansioverotus (earned income tax). 2025 state brackets + municipal ~22% not modeled.",
    sourceUrl: "https://www.vero.fi/en/",
    organization: "Vero Finland",
    taxRule: {
      year: 2025, type: "income_tax",
      brackets: [
        { lowerBound: 0, upperBound: 21100, rate: 0 },
        { lowerBound: 21100, upperBound: 30000, rate: 0.1265 },
        { lowerBound: 30000, upperBound: 53000, rate: 0.19 },
        { lowerBound: 53000, upperBound: 88200, rate: 0.3025 },
        { lowerBound: 88200, upperBound: 150000, rate: 0.34 },
        { lowerBound: 150000, upperBound: null, rate: 0.44 },
      ],
      deductions: [],
    },
    salaryConfig: { year: 2025, employeeSocialRate: 0.1025, employerSocialRate: 0.20, socialCap: null, healthcareRate: 0.0168, healthcareCap: null },
  },
  {
    code: "AT", slug: "austria", name: "Austria", region: "Europe",
    defaultCurrency: "EUR", flagEmoji: "🇦🇹", taxSystem: "progressive",
    description: "Austria Einkommensteuer. 2025 brackets (EUR).",
    sourceUrl: "https://www.bmf.gv.at/en.html",
    organization: "BMF Austria",
    taxRule: {
      year: 2025, type: "income_tax",
      brackets: [
        { lowerBound: 0, upperBound: 12105, rate: 0 },
        { lowerBound: 12105, upperBound: 21052, rate: 0.20 },
        { lowerBound: 21052, upperBound: 36092, rate: 0.305 },
        { lowerBound: 36092, upperBound: 69812, rate: 0.41 },
        { lowerBound: 69812, upperBound: 103072, rate: 0.455 },
        { lowerBound: 103072, upperBound: 1000000, rate: 0.50 },
        { lowerBound: 1000000, upperBound: null, rate: 0.55 },
      ],
      deductions: [{ name: "Verkehrsabsetzbetrag (Traffic deduction)", type: "standard", amount: 463 }],
    },
    salaryConfig: { year: 2025, employeeSocialRate: 0.18, employerSocialRate: 0.21, socialCap: null, healthcareRate: 0.038, healthcareCap: null },
  },
  {
    code: "BE", slug: "belgium", name: "Belgium", region: "Europe",
    defaultCurrency: "EUR", flagEmoji: "🇧🇪", taxSystem: "progressive",
    description: "Belgium personenbelasting. 2025 brackets (EUR). Top 50% rate.",
    sourceUrl: "https://finance.belgium.be/en",
    organization: "SPF Finances Belgium",
    taxRule: {
      year: 2025, type: "income_tax",
      brackets: [
        { lowerBound: 0, upperBound: 15200, rate: 0.25 },
        { lowerBound: 15200, upperBound: 26820, rate: 0.40 },
        { lowerBound: 26820, upperBound: 46440, rate: 0.45 },
        { lowerBound: 46440, upperBound: null, rate: 0.50 },
      ],
      deductions: [{ name: "Quotité forfaitaire", type: "standard", amount: 10480 }],
    },
    salaryConfig: { year: 2025, employeeSocialRate: 0.13, employerSocialRate: 0.25, socialCap: null, healthcareRate: 0.038, healthcareCap: null },
  },
  {
    code: "CZ", slug: "czech-republic", name: "Czech Republic", region: "Europe",
    defaultCurrency: "CZK", flagEmoji: "🇨🇿", taxSystem: "progressive",
    description: "Czech Republic daň z příjmů. 2025 brackets (CZK). 15% up to ~1.58M, 23% above.",
    sourceUrl: "https://www.financnisprava.cz/en/",
    organization: "FS Czech",
    taxRule: {
      year: 2025, type: "income_tax",
      brackets: [
        { lowerBound: 0, upperBound: 1581840, rate: 0.15 },
        { lowerBound: 1581840, upperBound: null, rate: 0.23 },
      ],
      deductions: [{ name: "Sleva na poplatníka (Personal credit)", type: "personal", amount: 30840 }],
    },
    salaryConfig: { year: 2025, employeeSocialRate: 0.071, employerSocialRate: 0.241, socialCap: null, healthcareRate: 0.045, healthcareCap: null },
  },
  {
    code: "GR", slug: "greece", name: "Greece", region: "Europe",
    defaultCurrency: "EUR", flagEmoji: "🇬🇷", taxSystem: "progressive",
    description: "Greece forologiko systima. 2025 brackets (EUR).",
    sourceUrl: "https://www.aade.gr/en",
    organization: "AADE Greece",
    taxRule: {
      year: 2025, type: "income_tax",
      brackets: [
        { lowerBound: 0, upperBound: 10000, rate: 0.09 },
        { lowerBound: 10000, upperBound: 20000, rate: 0.22 },
        { lowerBound: 20000, upperBound: 30000, rate: 0.28 },
        { lowerBound: 30000, upperBound: 40000, rate: 0.36 },
        { lowerBound: 40000, upperBound: null, rate: 0.44 },
      ],
      deductions: [{ name: "Aforesi atomon (Personal credit)", type: "personal", amount: 777 }],
    },
    salaryConfig: { year: 2025, employeeSocialRate: 0.139, employerSocialRate: 0.222, socialCap: null, healthcareRate: 0.0706, healthcareCap: null },
  },
  {
    code: "HU", slug: "hungary", name: "Hungary", region: "Europe",
    defaultCurrency: "HUF", flagEmoji: "🇭🇺", taxSystem: "flat",
    description: "Hungary SZJA. 2025 flat 15% personal income tax (one of lowest in EU).",
    sourceUrl: "https://nav.gov.hu/en",
    organization: "NAV Hungary",
    taxRule: {
      year: 2025, type: "income_tax",
      brackets: [
        { lowerBound: 0, upperBound: null, rate: 0.15 },
      ],
      deductions: [],
    },
    salaryConfig: { year: 2025, employeeSocialRate: 0.185, employerSocialRate: 0.13, socialCap: null, healthcareRate: 0.07, healthcareCap: null },
  },
  {
    code: "RU", slug: "russia", name: "Russia", region: "Europe",
    defaultCurrency: "RUB", flagEmoji: "🇷🇺", taxSystem: "flat",
    description: "Russia NDFL. 2025 flat 13% (15% on income above ₽5M).",
    sourceUrl: "https://www.nalog.gov.ru/eng/",
    organization: "FNS Russia",
    taxRule: {
      year: 2025, type: "income_tax",
      brackets: [
        { lowerBound: 0, upperBound: 5000000, rate: 0.13 },
        { lowerBound: 5000000, upperBound: null, rate: 0.15 },
      ],
      deductions: [{ name: "Standard Personal Deduction", type: "personal", amount: 140000 }],
    },
    salaryConfig: { year: 2025, employeeSocialRate: 0.01, employerSocialRate: 0.30, socialCap: null, healthcareRate: 0.059, healthcareCap: null },
  },

  // LATIN AMERICA
  {
    code: "AR", slug: "argentina", name: "Argentina", region: "South America",
    defaultCurrency: "ARS", flagEmoji: "🇦🇷", taxSystem: "progressive",
    description: "Argentina impuesto a las ganancias. 2025 brackets (ARS). Updated for new scales.",
    sourceUrl: "https://www.afip.gob.ar/",
    organization: "AFIP Argentina",
    taxRule: {
      year: 2025, type: "income_tax",
      brackets: [
        { lowerBound: 0, upperBound: 11200000, rate: 0.05 },
        { lowerBound: 11200000, upperBound: 22500000, rate: 0.09 },
        { lowerBound: 22500000, upperBound: 33700000, rate: 0.12 },
        { lowerBound: 33700000, upperBound: 44900000, rate: 0.15 },
        { lowerBound: 44900000, upperBound: 56100000, rate: 0.19 },
        { lowerBound: 56100000, upperBound: 78600000, rate: 0.23 },
        { lowerBound: 78600000, upperBound: 112200000, rate: 0.27 },
        { lowerBound: 112200000, upperBound: 168300000, rate: 0.31 },
        { lowerBound: 168300000, upperBound: null, rate: 0.35 },
      ],
      deductions: [{ name: "Ganancia no imponible", type: "personal", amount: 6160000 }],
    },
    salaryConfig: { year: 2025, employeeSocialRate: 0.17, employerSocialRate: 0.27, socialCap: null, healthcareRate: 0.06, healthcareCap: null },
  },
  {
    code: "CL", slug: "chile", name: "Chile", region: "South America",
    defaultCurrency: "CLP", flagEmoji: "🇨🇱", taxSystem: "progressive",
    description: "Chile Global Complementario. 2025 brackets (CLP, monthly UTM).",
    sourceUrl: "https://www.sii.cl/",
    organization: "SII Chile",
    taxRule: {
      year: 2025, type: "income_tax",
      brackets: [
        { lowerBound: 0, upperBound: 14833000, rate: 0 },
        { lowerBound: 14833000, upperBound: 29667000, rate: 0.04 },
        { lowerBound: 29667000, upperBound: 44500000, rate: 0.08 },
        { lowerBound: 44500000, upperBound: 59333000, rate: 0.135 },
        { lowerBound: 59333000, upperBound: 89000000, rate: 0.23 },
        { lowerBound: 89000000, upperBound: 148667000, rate: 0.304 },
        { lowerBound: 148667000, upperBound: null, rate: 0.40 },
      ],
      deductions: [{ name: "Rebaja por ingresos personas naturales", type: "personal", amount: 14833000 }],
    },
    salaryConfig: { year: 2025, employeeSocialRate: 0.07, employerSocialRate: 0.0245, socialCap: 902040, healthcareRate: 0.07, healthcareCap: null },
  },
  {
    code: "CO", slug: "colombia", name: "Colombia", region: "South America",
    defaultCurrency: "COP", flagEmoji: "🇨🇴", taxSystem: "progressive",
    description: "Colombia impuesto de renta. 2025 brackets (COP).",
    sourceUrl: "https://www.dian.gov.co/",
    organization: "DIAN Colombia",
    taxRule: {
      year: 2025, type: "income_tax",
      brackets: [
        { lowerBound: 0, upperBound: 48710000, rate: 0 },
        { lowerBound: 48710000, upperBound: 97420000, rate: 0.19 },
        { lowerBound: 97420000, upperBound: 162440000, rate: 0.28 },
        { lowerBound: 162440000, upperBound: 324880000, rate: 0.33 },
        { lowerBound: 324880000, upperBound: 649760000, rate: 0.35 },
        { lowerBound: 649760000, upperBound: 974640000, rate: 0.37 },
        { lowerBound: 974640000, upperBound: null, rate: 0.39 },
      ],
      deductions: [{ name: "UVT exemption (25% × 1,094 COP/UVT)", type: "personal", amount: 27350000 }],
    },
    salaryConfig: { year: 2025, employeeSocialRate: 0.08, employerSocialRate: 0.30, socialCap: null, healthcareRate: 0.085, healthcareCap: null },
  },
  {
    code: "PE", slug: "peru", name: "Peru", region: "South America",
    defaultCurrency: "PEN", flagEmoji: "🇵🇪", taxSystem: "progressive",
    description: "Peru impuesto a la renta. 2025 brackets (PEN).",
    sourceUrl: "https://www.sunat.gob.pe/",
    organization: "SUNAT Peru",
    taxRule: {
      year: 2025, type: "income_tax",
      brackets: [
        { lowerBound: 0, upperBound: 5, rate: 0.08 },
        { lowerBound: 5, upperBound: 20, rate: 0.14 },
        { lowerBound: 20, upperBound: 35, rate: 0.17 },
        { lowerBound: 35, upperBound: 45, rate: 0.20 },
        { lowerBound: 45, upperBound: null, rate: 0.30 },
      ],
      deductions: [{ name: "UIT exemption (S/5,150 × 7)", type: "personal", amount: 36050 }],
    },
    salaryConfig: { year: 2025, employeeSocialRate: 0.13, employerSocialRate: 0.09, socialCap: null, healthcareRate: 0.09, healthcareCap: null },
  },

  // AFRICA
  {
    code: "ZA", slug: "south-africa", name: "South Africa", region: "Africa",
    defaultCurrency: "ZAR", flagEmoji: "🇿🇦", taxSystem: "progressive",
    description: "South Africa income tax. 2025 brackets (ZAR). Top 45%.",
    sourceUrl: "https://www.sars.gov.za/",
    organization: "SARS South Africa",
    taxRule: {
      year: 2025, type: "income_tax",
      brackets: [
        { lowerBound: 0, upperBound: 237100, rate: 0.18 },
        { lowerBound: 237100, upperBound: 370500, rate: 0.26 },
        { lowerBound: 370500, upperBound: 512800, rate: 0.31 },
        { lowerBound: 512800, upperBound: 673000, rate: 0.36 },
        { lowerBound: 673000, upperBound: 857900, rate: 0.39 },
        { lowerBound: 857900, upperBound: 1817000, rate: 0.41 },
        { lowerBound: 1817000, upperBound: null, rate: 0.45 },
      ],
      deductions: [{ name: "Primary rebate", type: "personal", amount: 17135 }],
    },
    salaryConfig: { year: 2025, employeeSocialRate: 0.01, employerSocialRate: 0.01, socialCap: 177984, healthcareRate: 0, healthcareCap: null },
  },
];

// Quick lookup maps
export const COUNTRIES_BY_CODE: Record<string, StaticCountry> = Object.fromEntries(
  COUNTRIES.map((c) => [c.code, c])
);
export const COUNTRIES_BY_SLUG: Record<string, StaticCountry> = Object.fromEntries(
  COUNTRIES.map((c) => [c.slug, c])
);
