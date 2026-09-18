/**
 * Content Gap Detector.
 * Identifies missing page combinations that should exist for SEO coverage.
 */
import { prisma } from "@/lib/db";

export interface ContentGap {
  type: "missing-country" | "missing-state" | "missing-province" | "missing-region";
  slug: string;
  label: string;
  priority: number; // 1-10, higher = more important
  reason: string;
}

interface MissingItem {
  code: string;
  slug: string;
  name: string;
  reason: string;
  priority: number;
}

// Known missing US states (we have 29, missing these 21)
const MISSING_US_STATES: MissingItem[] = [
  { code: "AR", slug: "arkansas", name: "Arkansas", reason: "Low pop but search volume", priority: 3 },
  { code: "CT", slug: "connecticut", name: "Connecticut", reason: "Top 30 by pop, wealthy state", priority: 6 },
  { code: "DE", slug: "delaware", name: "Delaware", reason: "Tax-friendly expat interest", priority: 4 },
  { code: "HI", slug: "hawaii", name: "Hawaii", reason: "Highest state tax in USA", priority: 6 },
  { code: "IA", slug: "iowa", name: "Iowa", reason: "Flat 3.8% tax — easy win", priority: 5 },
  { code: "ID", slug: "idaho", name: "Idaho", reason: "Flat 5.695% — easy win", priority: 4 },
  { code: "KS", slug: "kansas", name: "Kansas", reason: "Progressive brackets", priority: 3 },
  { code: "KY", slug: "kentucky", name: "Kentucky", reason: "Flat 4% — easy win", priority: 5 },
  { code: "ME", slug: "maine", name: "Maine", reason: "Progressive brackets", priority: 3 },
  { code: "MS", slug: "mississippi", name: "Mississippi", reason: "Flat 4.4% — easy win", priority: 4 },
  { code: "MT", slug: "montana", name: "Montana", reason: "Progressive brackets", priority: 3 },
  { code: "ND", slug: "north-dakota", name: "North Dakota", reason: "Progressive brackets", priority: 2 },
  { code: "NE", slug: "nebraska", name: "Nebraska", reason: "Progressive brackets", priority: 3 },
  { code: "NM", slug: "new-mexico", name: "New Mexico", reason: "Progressive brackets", priority: 3 },
  { code: "OK", slug: "oklahoma", name: "Oklahoma", reason: "Progressive brackets", priority: 4 },
  { code: "OR", slug: "oregon", name: "Oregon", reason: "Top 30 by pop, high tax", priority: 6 },
  { code: "RI", slug: "rhode-island", name: "Rhode Island", reason: "Progressive brackets", priority: 2 },
  { code: "UT", slug: "utah", name: "Utah", reason: "Flat 4.55% — easy win", priority: 4 },
  { code: "VT", slug: "vermont", name: "Vermont", reason: "Progressive brackets", priority: 2 },
  { code: "WV", slug: "west-virginia", name: "West Virginia", reason: "Progressive brackets", priority: 2 },
  { code: "DC", slug: "district-of-columbia", name: "District of Columbia", reason: "Capital, expat interest", priority: 5 },
];

// Known popular non-USA countries not yet added
const MISSING_COUNTRIES: MissingItem[] = [
  { code: "BR", slug: "brazil", name: "Brazil", reason: "Largest LATAM economy", priority: 6 },
  { code: "MX", slug: "mexico", name: "Mexico", reason: "Top expat destination", priority: 6 },
  { code: "NZ", slug: "new-zealand", name: "New Zealand", reason: "English-speaking", priority: 5 },
  { code: "SE", slug: "sweden", name: "Sweden", reason: "Nordic, high tax interest", priority: 4 },
  { code: "NO", slug: "norway", name: "Norway", reason: "Nordic, high tax interest", priority: 4 },
  { code: "DK", slug: "denmark", name: "Denmark", reason: "Nordic, high tax interest", priority: 4 },
  { code: "BE", slug: "belgium", name: "Belgium", reason: "EU expat", priority: 3 },
  { code: "AT", slug: "austria", name: "Austria", reason: "EU expat", priority: 3 },
  { code: "PT", slug: "portugal", name: "Portugal", reason: "NHR program — massive expat search volume", priority: 8 },
  { code: "GR", slug: "greece", name: "Greece", reason: "Expat retirement", priority: 3 },
  { code: "KR", slug: "south-korea", name: "South Korea", reason: "Asian tech hub", priority: 4 },
  { code: "HK", slug: "hong-kong", name: "Hong Kong", reason: "Salaries tax interest", priority: 5 },
  { code: "TH", slug: "thailand", name: "Thailand", reason: "Digital nomad hub", priority: 4 },
  { code: "QA", slug: "qatar", name: "Qatar", reason: "No income tax (like UAE)", priority: 4 },
  { code: "KW", slug: "kuwait", name: "Kuwait", reason: "No income tax", priority: 3 },
  { code: "IN", slug: "india", name: "India", reason: "Huge user base, big search volume", priority: 7 },
  { code: "PH", slug: "philippines", name: "Philippines", reason: "BPO, OFW interest", priority: 4 },
  { code: "MY", slug: "malaysia", name: "Malaysia", reason: "Digital nomad hub", priority: 4 },
];

// Canadian provinces (we have federal CA, missing provinces)
const MISSING_CANADIAN_PROVINCES: MissingItem[] = [
  { code: "ON", slug: "ontario", name: "Ontario", reason: "Most populous province", priority: 7 },
  { code: "QC", slug: "quebec", name: "Quebec", reason: "Distinct tax system, French", priority: 7 },
  { code: "BC", slug: "british-columbia", name: "British Columbia", reason: "Top 3 by pop", priority: 6 },
  { code: "AB", slug: "alberta", name: "Alberta", reason: "Flat 10% provincial — popular", priority: 6 },
  { code: "MB", slug: "manitoba", name: "Manitoba", reason: "Progressive", priority: 4 },
  { code: "SK", slug: "saskatchewan", name: "Saskatchewan", reason: "Progressive", priority: 4 },
  { code: "NS", slug: "nova-scotia", name: "Nova Scotia", reason: "Atlantic province", priority: 3 },
  { code: "NB", slug: "new-brunswick", name: "New Brunswick", reason: "Atlantic province", priority: 3 },
  { code: "NL", slug: "newfoundland", name: "Newfoundland and Labrador", reason: "Atlantic", priority: 2 },
  { code: "PE", slug: "prince-edward-island", name: "Prince Edward Island", reason: "Atlantic", priority: 2 },
];

// UK regions (we have England/Wales, missing Scotland + NI)
const MISSING_UK_REGIONS: MissingItem[] = [
  { code: "SCT", slug: "scotland", name: "Scotland", reason: "Different income tax bands", priority: 6 },
  { code: "NI", slug: "northern-ireland", name: "Northern Ireland", reason: "Different from UK mainland", priority: 4 },
];

export async function detectContentGaps(): Promise<{
  gaps: ContentGap[];
  totalPriority: number;
  byType: Record<string, number>;
}> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const existing = await prisma.country.findMany();
  const existingSlugs = new Set(existing.map((c) => c.slug));
  const existingStates = await prisma.state.findMany();
  const existingStateCodes = new Set(existingStates.map((s) => s.code));

  const gaps: ContentGap[] = [];

  for (const m of MISSING_US_STATES) {
    if (!existingStateCodes.has(m.code)) {
      gaps.push({
        type: "missing-state",
        slug: m.slug,
        label: `${m.name} state income tax`,
        priority: m.priority,
        reason: m.reason,
      });
    }
  }
  for (const m of MISSING_COUNTRIES) {
    if (!existingSlugs.has(m.slug)) {
      gaps.push({
        type: "missing-country",
        slug: m.slug,
        label: `${m.name} income tax`,
        priority: m.priority,
        reason: m.reason,
      });
    }
  }
  for (const m of MISSING_CANADIAN_PROVINCES) {
    gaps.push({
      type: "missing-province",
      slug: m.slug,
      label: `${m.name} provincial tax`,
      priority: m.priority,
      reason: m.reason,
    });
  }
  for (const m of MISSING_UK_REGIONS) {
    gaps.push({
      type: "missing-region",
      slug: m.slug,
      label: `${m.name} income tax`,
      priority: m.priority,
      reason: m.reason,
    });
  }

  gaps.sort((a, b) => b.priority - a.priority);

  const totalPriority = gaps.reduce((sum, g) => sum + g.priority, 0);
  const byType: Record<string, number> = {};
  for (const g of gaps) {
    byType[g.type] = (byType[g.type] ?? 0) + 1;
  }

  return { gaps, totalPriority, byType };
}