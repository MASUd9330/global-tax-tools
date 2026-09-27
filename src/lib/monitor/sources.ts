/**
 * Source Monitor Pipeline — registry of authoritative tax sources.
 *
 * Per architecture "Data Update Pipeline" principle: detect when official
 * sources have changed so the team can update brackets before they go stale.
 *
 * Each entry maps a country/state to the URL we periodically fetch. The
 * checker (lib/monitor/checker.ts) hashes responses and reports diffs.
 */

import { COUNTRIES } from "@/data/static/countries";
import { US_STATES } from "@/data/static/states";

export interface MonitoredSource {
  id: string;              // unique slug
  jurisdiction: string;    // "United States" | "California" etc
  jurisdictionCode: string;// "US" | "CA" etc
  sourceUrl: string;
  organization: string;
  category: "country" | "state";
  priority: 1 | 2 | 3;     // 1 = critical (G7), 3 = long-tail
  yearCovered: number;     // which tax year this source covers
  notes?: string;
}

// Build registry from static data
export const MONITORED_SOURCES: MonitoredSource[] = (() => {
  const out: MonitoredSource[] = [];

  for (const c of COUNTRIES) {
    out.push({
      id: `country-${c.code}`,
      jurisdiction: c.name,
      jurisdictionCode: c.code,
      sourceUrl: c.sourceUrl,
      organization: c.organization,
      category: "country",
      priority: priorityFor(c.code),
      yearCovered: c.taxRule?.year ?? new Date().getFullYear(),
    });
  }

  for (const s of US_STATES) {
    if (!s.sourceUrl) continue;
    out.push({
      id: `state-us-${s.slug}`,
      jurisdiction: s.name,
      jurisdictionCode: "US",
      sourceUrl: s.sourceUrl,
      organization: "State DOR",
      category: "state",
      priority: s.hasIncomeTax ? 2 : 3,
      yearCovered: new Date().getFullYear(),
    });
  }

  return out;
})();

function priorityFor(code: string): 1 | 2 | 3 {
  const g7 = new Set(["US", "GB", "DE", "FR", "CA", "IT", "JP"]);
  if (g7.has(code)) return 1;
  if (["AU", "ES", "NL", "IE", "CH", "SG", "AE"].includes(code)) return 2;
  return 3;
}

export function getSourcesByPriority(priority: 1 | 2 | 3): MonitoredSource[] {
  return MONITORED_SOURCES.filter((s) => s.priority === priority);
}

export function getSourceById(id: string): MonitoredSource | null {
  return MONITORED_SOURCES.find((s) => s.id === id) ?? null;
}