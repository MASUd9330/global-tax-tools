/**
 * Source Monitor — persistent history reader.
 *
 * Reads data/monitor-results.json (written by GitHub Actions workflow)
 * and returns the last N runs for the admin dashboard.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

export interface MonitorRun {
  ranAt: string;
  sourcesTracked: number;
  summary: {
    total: number;
    byVerdict: { ok: number; changed: number; error: number; timeout: number };
  };
  results: Array<{
    id: string;
    jurisdiction: string;
    jurisdictionCode: string;
    sourceUrl: string;
    organization: string;
    category: string;
    priority: number;
    yearCovered: number;
    httpStatus: number | null;
    contentLength: number | null;
    contentHash: string | null;
    contentType: string | null;
    fetchedAtMs: number;
    durationMs: number;
    verdict: "ok" | "changed" | "error" | "timeout";
    errorMessage?: string;
  }>;
}

export interface MonitorHistory {
  history: MonitorRun[];
  lastRun: MonitorRun | null;
  lastUpdated: string | null;
}

const EMPTY_HISTORY: MonitorHistory = {
  history: [],
  lastRun: null,
  lastUpdated: null,
};

export async function readMonitorHistory(): Promise<MonitorHistory> {
  try {
    // data/monitor-results.json at repo root
    const path = join(process.cwd(), "data", "monitor-results.json");
    const content = readFileSync(path, "utf8");
    const parsed = JSON.parse(content) as MonitorHistory;
    return {
      history: Array.isArray(parsed.history) ? parsed.history : [],
      lastRun: parsed.lastRun ?? null,
      lastUpdated: parsed.lastUpdated ?? null,
    };
  } catch {
    return EMPTY_HISTORY;
  }
}