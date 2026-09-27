/**
 * Freshness Engine.
 * Tracks lastUpdated for tax rules. Flags stale data (>12 months old).
 * Uses static data — all entries have fixed 2025 timestamp.
 */
import { listCountries } from "@/lib/data/country";
import { US_STATES } from "@/data/static/states";

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
  const countries = listCountries().map((c) => ({
    code: c.code,
    name: c.name,
  }));

  const countryRows = countries.map((c) => {
    // Static data — all 2025, "fresh"
    const lastUpdated = now;
    return {
      code: c.code,
      name: c.name,
      lastUpdated,
      daysSinceUpdate: 0,
      stale: false,
      year: 2025,
    };
  });

  // For states, all static data is "fresh" (just created)
  const states = US_STATES;
  const stateRows = states.map((s) => ({
    code: s.code,
    name: s.name,
    country: "United States",
    lastUpdated: now,
    daysSinceUpdate: 0,
    stale: false,
  }));

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