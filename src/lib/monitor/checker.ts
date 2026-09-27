/**
 * Source Monitor — fetches authoritative tax sources and detects changes.
 *
 * Approach:
 *   - HEAD/GET each source URL, hash response body
 *   - Compare hash against last-seen (module-level cache)
 *   - Report verdict: "unchanged" | "changed" | "error" | "new"
 *
 * Limitations (Vercel serverless):
 *   - Module cache resets on cold start, so cross-deploy history is lost
 *   - We mitigate by exposing /api/monitor/audit that hashes each URL and
 *     returns fingerprint data — call it manually before/after a deploy
 *     to confirm the static data still matches the source of truth.
 */

import { createHash } from "node:crypto";
import { MONITORED_SOURCES, type MonitoredSource } from "./sources";

export interface SourceCheckResult {
  id: string;
  jurisdiction: string;
  jurisdictionCode: string;
  sourceUrl: string;
  organization: string;
  category: "country" | "state";
  priority: 1 | 2 | 3;
  yearCovered: number;
  httpStatus: number | null;
  contentLength: number | null;
  contentHash: string | null;
  contentType: string | null;
  fetchedAtMs: number;
  durationMs: number;
  verdict: "ok" | "changed" | "error" | "timeout";
  errorMessage?: string;
}

// Module-level last-seen cache (survives warm starts, resets on cold start)
const lastSeen = new Map<string, { hash: string; fetchedAtMs: number }>();

// In-flight de-dup
const inFlight = new Map<string, Promise<SourceCheckResult>>();

async function checkOne(src: MonitoredSource, timeoutMs = 8000): Promise<SourceCheckResult> {
  const started = Date.now();
  const cached = inFlight.get(src.id);
  if (cached) return cached;

  const promise = runCheck(src, timeoutMs, started).finally(() => {
    inFlight.delete(src.id);
  });
  inFlight.set(src.id, promise);
  return promise;
}

async function runCheck(src: MonitoredSource, timeoutMs: number, started: number): Promise<SourceCheckResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(src.sourceUrl, {
      method: "GET",
      signal: controller.signal,
      headers: {
        "User-Agent":
          "TaxRank-Bot/1.0 (+https://global-tax-tools.vercel.app/about) source-monitor",
        "Accept": "text/html,application/json",
      },
      redirect: "follow",
    });
    clearTimeout(timer);

    if (!res.ok) {
      return {
        id: src.id,
        jurisdiction: src.jurisdiction,
        jurisdictionCode: src.jurisdictionCode,
        sourceUrl: src.sourceUrl,
        organization: src.organization,
        category: src.category,
        priority: src.priority,
        yearCovered: src.yearCovered,
        httpStatus: res.status,
        contentLength: null,
        contentHash: null,
        contentType: null,
        fetchedAtMs: Date.now(),
        durationMs: Date.now() - started,
        verdict: "error",
        errorMessage: `HTTP ${res.status} ${res.statusText}`,
      };
    }

    const buf = await res.arrayBuffer();
    const hash = createHash("sha256").update(Buffer.from(buf)).digest("hex").slice(0, 16);
    const last = lastSeen.get(src.id);

    let verdict: "ok" | "changed" = "ok";
    if (!last) verdict = "ok";
    else if (last.hash !== hash) verdict = "changed";

    lastSeen.set(src.id, { hash, fetchedAtMs: Date.now() });

    return {
      id: src.id,
      jurisdiction: src.jurisdiction,
      jurisdictionCode: src.jurisdictionCode,
      sourceUrl: src.sourceUrl,
      organization: src.organization,
      category: src.category,
      priority: src.priority,
      yearCovered: src.yearCovered,
      httpStatus: res.status,
      contentLength: buf.byteLength,
      contentHash: hash,
      contentType: res.headers.get("content-type"),
      fetchedAtMs: Date.now(),
      durationMs: Date.now() - started,
      verdict,
    };
  } catch (e) {
    clearTimeout(timer);
    const isTimeout = (e as Error)?.name === "AbortError";
    return {
      id: src.id,
      jurisdiction: src.jurisdiction,
      jurisdictionCode: src.jurisdictionCode,
      sourceUrl: src.sourceUrl,
      organization: src.organization,
      category: src.category,
      priority: src.priority,
      yearCovered: src.yearCovered,
      httpStatus: null,
      contentLength: null,
      contentHash: null,
      contentType: null,
      fetchedAtMs: Date.now(),
      durationMs: Date.now() - started,
      verdict: isTimeout ? "timeout" : "error",
      errorMessage: (e as Error)?.message ?? String(e),
    };
  }
}

export async function checkAll(filter?: { priority?: 1 | 2 | 3; category?: "country" | "state" }): Promise<SourceCheckResult[]> {
  const queue = MONITORED_SOURCES.filter((s) => {
    if (filter?.priority && s.priority !== filter.priority) return false;
    if (filter?.category && s.category !== filter.category) return false;
    return true;
  });
  return Promise.all(queue.map((s) => checkOne(s)));
}

export async function checkOneById(id: string): Promise<SourceCheckResult | null> {
  const src = MONITORED_SOURCES.find((s) => s.id === id);
  if (!src) return null;
  return checkOne(src);
}

export function summary(results: SourceCheckResult[]) {
  const by = {
    ok: results.filter((r) => r.verdict === "ok").length,
    changed: results.filter((r) => r.verdict === "changed").length,
    error: results.filter((r) => r.verdict === "error").length,
    timeout: results.filter((r) => r.verdict === "timeout").length,
  };
  return { total: results.length, byVerdict: by };
}