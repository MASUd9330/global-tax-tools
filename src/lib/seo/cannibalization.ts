/**
 * Cannibalization Detector.
 * Finds pages that compete for the same keyword (heuristic — URL/title keyword overlap).
 */
import { prisma } from "@/lib/db";

export interface CannibalizationIssue {
  keyword: string;
  pages: Array<{ url: string; title: string }>;
  severity: "high" | "medium" | "low"; // high = same intent
}

const KEYWORD_FAMILIES: Record<string, string[]> = {
  "us-tax-calculator": ["countries/usa", "tools/tax-calculator", "us-state"],
  "uk-tax-calculator": ["countries/uk", "tools/tax-calculator"],
  "tax-on-salary": ["tools/tax-calculator", "tools/salary-calculator", "countries"],
  "state-income-tax": ["countries/usa", "us-state"],
  "income-tax-calculator": ["tools/tax-calculator", "countries", "countries/.*/tax"],
};

export async function detectCannibalization(): Promise<CannibalizationIssue[]> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const countries = await prisma.country.findMany();
  const states = await prisma.state.findMany({ where: { country: { code: "US" } } });

  const allPages: Array<{ url: string; title: string; keywords: Set<string> }> = [];

  // Generate candidate pages and their target keywords
  const candidates: Array<{ url: string; title: string; keywords: string[] }> = [
    { url: `${base}/tools/tax-calculator`, title: "Income Tax Calculator", keywords: ["tax calculator", "income tax", "tax estimate"] },
    { url: `${base}/tools/salary-calculator`, title: "Salary Calculator", keywords: ["salary calculator", "take home", "net salary"] },
    { url: `${base}/`, title: "TaxRank Home", keywords: ["tax", "global tax", "tax calculator"] },
    { url: `${base}/countries`, title: "Countries", keywords: ["countries", "tax by country"] },
  ];

  for (const c of countries) {
    candidates.push({
      url: `${base}/countries/${c.slug}`,
      title: `${c.name} Tax Calculator`,
      keywords: [`${c.name.toLowerCase()} tax`, `${c.slug} tax`, `${c.name.toLowerCase()} tax calculator`],
    });
    candidates.push({
      url: `${base}/countries/${c.slug}/tax`,
      title: `${c.name} Income Tax Calculator`,
      keywords: [`${c.name.toLowerCase()} income tax`, `${c.slug} income tax`],
    });
  }
  for (const s of states) {
    candidates.push({
      url: `${base}/us-state/${s.slug}`,
      title: `${s.name} Income Tax Calculator`,
      keywords: [`${s.name.toLowerCase()} tax`, `${s.slug} tax`, `${s.name.toLowerCase()} state tax`],
    });
  }

  // Find overlapping keywords
  const keywordToPages = new Map<string, Array<{ url: string; title: string }>>();
  for (const c of candidates) {
    for (const k of c.keywords) {
      if (!keywordToPages.has(k)) keywordToPages.set(k, []);
      keywordToPages.get(k)!.push({ url: c.url, title: c.title });
    }
  }

  const issues: CannibalizationIssue[] = [];
  for (const [keyword, pages] of keywordToPages.entries()) {
    if (pages.length >= 2) {
      const severity: CannibalizationIssue["severity"] =
        pages.length >= 4 ? "high" : pages.length >= 3 ? "medium" : "low";
      issues.push({ keyword, pages, severity });
    }
  }

  // Sort: high severity first
  issues.sort((a, b) => {
    const sev = ["high", "medium", "low"];
    return sev.indexOf(a.severity) - sev.indexOf(b.severity);
  });

  return issues;
}