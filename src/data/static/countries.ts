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
];

// Quick lookup maps
export const COUNTRIES_BY_CODE: Record<string, StaticCountry> = Object.fromEntries(
  COUNTRIES.map((c) => [c.code, c])
);
export const COUNTRIES_BY_SLUG: Record<string, StaticCountry> = Object.fromEntries(
  COUNTRIES.map((c) => [c.slug, c])
);
