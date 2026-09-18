/**
 * Entity Graph.
 * Extracts entities (countries, states, currencies, regions) and their relationships.
 */
import { prisma } from "@/lib/db";

export interface EntityGraph {
  entities: Array<{
    id: string;
    type: string; // country | state | currency | region
    label: string;
    slug?: string;
    code?: string;
  }>;
  relationships: Array<{
    from: string;
    to: string;
    type: string; // "has_state" | "uses_currency" | "in_region"
  }>;
  stats: {
    totalEntities: number;
    totalRelationships: number;
    byType: Record<string, number>;
  };
}

export async function getEntityGraph(): Promise<EntityGraph> {
  const countries = await prisma.country.findMany({ orderBy: { name: "asc" } });
  const states = await prisma.state.findMany({ orderBy: { name: "asc" } });

  const entities: EntityGraph["entities"] = [];
  const relationships: EntityGraph["relationships"] = [];
  const seenIds = new Set<string>();
  const byType: Record<string, number> = {};

  function addEntity(id: string, type: string, label: string, slug?: string, code?: string) {
    if (seenIds.has(id)) return;
    seenIds.add(id);
    entities.push({ id, type, label, slug, code });
    byType[type] = (byType[type] ?? 0) + 1;
  }
  function addRel(from: string, to: string, type: string) {
    relationships.push({ from, to, type });
  }

  // Regions (extracted from countries)
  const regions = new Set<string>();
  for (const c of countries) regions.add(c.region);
  for (const r of regions) {
    addEntity(`region:${r}`, "region", r);
  }

  // Currencies
  const currencies = new Set<string>();
  for (const c of countries) currencies.add(c.defaultCurrency);
  for (const cur of currencies) {
    addEntity(`currency:${cur}`, "currency", cur);
  }

  // Countries
  for (const c of countries) {
    addEntity(`country:${c.code}`, "country", c.name, c.slug, c.code);
    addRel(`country:${c.code}`, `region:${c.region}`, "in_region");
    addRel(`country:${c.code}`, `currency:${c.defaultCurrency}`, "uses_currency");
  }

  // States (US only)
  for (const s of states) {
    const parentCountry = await prisma.state.findUnique({
      where: { id: s.id },
      include: { country: { select: { code: true } } },
    });
    addEntity(`state:${s.code}`, "state", s.name, s.slug, s.code);
    if (parentCountry) {
      addRel(`state:${s.code}`, `country:${parentCountry.country.code}`, "in_country");
    }
  }

  return {
    entities,
    relationships,
    stats: {
      totalEntities: entities.length,
      totalRelationships: relationships.length,
      byType,
    },
  };
}