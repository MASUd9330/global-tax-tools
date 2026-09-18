import type { MetadataRoute } from "next";
import { listCountries } from "@/lib/data/country";
import { listStatesForCountry } from "@/lib/data/state";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const countries = await listCountries();
  const usStates = await listStatesForCountry("US");
  const now = new Date();

  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/tools/tax-calculator`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/countries`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
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
  ];
}