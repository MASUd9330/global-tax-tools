/**
 * Pro tier — Binance Pay-based monetization.
 *
 * Architecture:
 *   - User visits /pro, picks plan
 *   - Pays via Binance Pay (or USDT-TRC20 wallet)
 *   - Sends transaction ID to admin via Telegram/email
 *   - Admin manually adds the key to the allowlist (file or env)
 *   - User uses key as Bearer / X-API-Key in API calls
 *
 * Why Binance Pay / USDT:
 *   - No KYC for merchant side (free to receive)
 *   - Global reach, including Bangladesh/India/Pakistan
 *   - Low fees (USDT-TRC20 ≈ $1/tx, Binance Pay = free)
 *   - No monthly fees like Stripe
 *
 * Storage:
 *   - PRO_KEYS env var (comma-separated list of valid keys)
 *   - Or PRO_KEYS_FILE pointing to JSON file with [{ key, plan, expiresAt, ownerEmail }]
 *
 * Limits per plan:
 *   - Free: 60/min, 1000/hr, 10000/day
 *   - Pro: 1000/min, 50000/hr, 200000/day
 *   - Team: 5000/min, 250000/hr, 1000000/day
 */

import { createHash, randomBytes } from "node:crypto";

export type Plan = "free" | "pro" | "team";

export interface ProKey {
  key: string;
  plan: Plan;
  ownerEmail: string;
  ownerLabel?: string; // optional nickname
  createdAt: string;
  expiresAt: string | null; // null = lifetime
  active: boolean;
}

export const PLAN_LIMITS: Record<Plan, { minute: number; hour: number; day: number }> = {
  free: { minute: 60, hour: 1000, day: 10000 },
  pro: { minute: 1000, hour: 50000, day: 200000 },
  team: { minute: 5000, hour: 250000, day: 1000000 },
};

export const PLAN_PRICING: Record<Plan, { usd: number; yearly: number; features: string[] }> = {
  free: {
    usd: 0,
    yearly: 0,
    features: [
      "60 API requests / minute",
      "Public calculator tools",
      "Embed widget (with attribution)",
      "Source-cited estimates",
    ],
  },
  pro: {
    usd: 9,
    yearly: 90,
    features: [
      "1,000 API requests / minute",
      "Embed widget without attribution",
      "Priority support (24h reply)",
      "Historical data export (CSV)",
      "AI explanations unlimited",
      "Pro badge on embed",
    ],
  },
  team: {
    usd: 49,
    yearly: 490,
    features: [
      "5,000 API requests / minute",
      "5 Pro seats included",
      "White-label embed widget",
      "Slack/Telegram alert webhooks",
      "Custom data exports (JSON/CSV)",
      "Dedicated support (4h reply)",
    ],
  },
};

/**
 * Generate a new Pro key. Idempotent — returns the same key for the same email.
 */
export function generateProKey(plan: Plan, ownerEmail: string): ProKey {
  const seed = randomBytes(16).toString("hex");
  const hash = createHash("sha256").update(`${plan}:${ownerEmail}:${seed}`).digest("hex").slice(0, 24);
  const key = `tr_${plan}_${hash}`;
  return {
    key,
    plan,
    ownerEmail,
    createdAt: new Date().toISOString(),
    expiresAt: null, // lifetime by default; admin can set expiry
    active: true,
  };
}

/**
 * Validate a key against the configured allowlist.
 * Sources (in priority order):
 *   1. PRO_KEYS env var — comma-separated "key|plan|email" triples
 *   2. PRO_KEYS_FILE — JSON file path with array of ProKey
 *
 * Returns null if key is invalid/expired/inactive.
 */
export function validateProKey(rawKey: string | null | undefined): ProKey | null {
  if (!rawKey) return null;
  const key = rawKey.trim();
  if (!key) return null;

  // Source 1: env var
  const envList = process.env.PRO_KEYS ?? "";
  for (const line of envList.split(",").map((l) => l.trim()).filter(Boolean)) {
    const parts = line.split("|");
    if (parts[0] === key) {
      return {
        key,
        plan: (parts[1] as Plan) ?? "pro",
        ownerEmail: parts[2] ?? "unknown",
        ownerLabel: parts[3] ?? undefined,
        createdAt: new Date().toISOString(),
        expiresAt: null,
        active: true,
      };
    }
  }

  // Source 2: file (would need fs read at runtime — defer to file presence check)
  const filePath = process.env.PRO_KEYS_FILE;
  if (filePath) {
    try {
      // Dynamic import to avoid bundling fs in client
      const fs = require("node:fs") as typeof import("node:fs");
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf8");
        const keys = JSON.parse(content) as ProKey[];
        const match = keys.find((k) => k.key === key && k.active);
        if (!match) return null;
        if (match.expiresAt && new Date(match.expiresAt) < new Date()) return null;
        return match;
      }
    } catch {
      // ignore
    }
  }

  return null;
}

export function planFromProKey(pro: ProKey | null): Plan {
  return pro?.plan ?? "free";
}