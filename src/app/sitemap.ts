import type { MetadataRoute } from "next";
import { listCountries } from "@/lib/data/country";
import { listStatesForCountry } from "@/lib/data/state";
import { listProvinces } from "@/lib/data/province";

// Static list of curated comparison pairs (avoids DB query at request time)
const POPULAR_COMPARISONS = [
  "texas-vs-california", "florida-vs-new-york", "texas-vs-new-york", "florida-vs-california",
  "washington-vs-california", "nevada-vs-california", "tennessee-vs-new-york", "illinois-vs-florida",
  "pennsylvania-vs-new-york", "california-vs-colorado", "new-york-vs-florida", "california-vs-arizona",
  "new-york-vs-illinois", "california-vs-illinois", "california-vs-massachusetts",
  "usa-vs-uk", "usa-vs-canada", "uk-vs-canada", "usa-vs-germany", "germany-vs-france",
  "uk-vs-germany", "uae-vs-usa", "uae-vs-uk", "uk-vs-australia", "germany-vs-netherlands",
  "canada-vs-australia", "japan-vs-uk",
];

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// Dynamic: sitemap regenerates per request
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const countries = await listCountries();
  const usStates = await listStatesForCountry("US");
  const caProvinces = listProvinces();
  const now = new Date();

  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/tools/tax-calculator`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/tools/salary-calculator`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/tools/scenario-builder`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/tools/historical-trends`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/countries`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/compare`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/embed`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/pro`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    ...countries.map((c) => ({
      url: `${BASE}/countries/${c.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...countries.map((c) => ({
      url: `${BASE}/countries/${c.slug}/tax`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...usStates.map((s) => ({
      url: `${BASE}/us-state/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...caProvinces.map((p) => ({
      url: `${BASE}/canada/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...POPULAR_COMPARISONS.map((pair) => ({
      url: `${BASE}/compare/${pair}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}