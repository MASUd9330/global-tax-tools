/**
 * Freshness Engine.
 * Tracks lastUpdated for tax rules. Flags stale data (>12 months old).
 */
import { prisma } from "@/lib/db";

const STALE_DAYS = 365;

export interface FreshnessReport {
  countries: Array<{
    code: string;
    name: string;
    lastUpdated: Date | null;
    daysSinceUpdate: number | null;
    stale: boolean;
    year: number | null;
  }>;
  states: Array<{
    code: string;
    name: string;
    country: string;
    lastUpdated: Date | null;
    daysSinceUpdate: number | null;
    stale: boolean;
  }>;
  totalStale: number;
  totalFresh: number;
  stalePercent: number;
}

function daysBetween(d1: Date, d2: Date): number {
  return Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
}

export async function getFreshnessReport(): Promise<FreshnessReport> {
  const now = new Date();
  const countries = await prisma.country.findMany({
    include: { taxRules: { orderBy: { year: "desc" }, take: 1 } },
    orderBy: { name: "asc" },
  });

  const countryRows = countries.map((c) => {
    const lastRule = c.taxRules[0];
    const lastUpdated = lastRule?.publishedAt ?? lastRule?.updatedAt ?? null;
    const daysSince = lastUpdated ? daysBetween(lastUpdated, now) : null;
    return {
      code: c.code,
      name: c.name,
      lastUpdated,
      daysSinceUpdate: daysSince,
      stale: daysSince === null ? true : daysSince > STALE_DAYS,
      year: lastRule?.year ?? null,
    };
  });

  // For states, use country.updatedAt as proxy (states don't have separate year field yet)
  const states = await prisma.state.findMany({
    include: { country: { select: { name: true } } },
    orderBy: { name: "asc" },
  });
  const stateRows = states.map((s) => {
    const lastUpdated = s.updatedAt;
    const daysSince = daysBetween(lastUpdated, now);
    return {
      code: s.code,
      name: s.name,
      country: s.country.name,
      lastUpdated,
      daysSinceUpdate: daysSince,
      stale: daysSince > STALE_DAYS,
    };
  });

  const totalStale = countryRows.filter((r) => r.stale).length + stateRows.filter((r) => r.stale).length;
  const totalFresh = countryRows.filter((r) => !r.stale).length + stateRows.filter((r) => !r.stale).length;
  const total = totalStale + totalFresh;
  const stalePercent = total > 0 ? Math.round((totalStale / total) * 100) : 0;

  return {
    countries: countryRows,
    states: stateRows,
    totalStale,
    totalFresh,
    stalePercent,
  };
}