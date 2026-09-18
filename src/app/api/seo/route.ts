import { NextResponse } from "next/server";
import { getInternalLinkGraph } from "@/lib/seo/link-graph";
import { detectCannibalization } from "@/lib/seo/cannibalization";
import { detectContentGaps } from "@/lib/seo/content-gaps";
import { getFreshnessReport } from "@/lib/seo/freshness";
import { getEntityGraph } from "@/lib/seo/entities";

/** GET /api/seo — combined SEO Intelligence report */
export async function GET() {
  const [linkGraph, cannibalization, contentGaps, freshness, entities] = await Promise.all([
    getInternalLinkGraph(),
    detectCannibalization(),
    detectContentGaps(),
    getFreshnessReport(),
    getEntityGraph(),
  ]);

  return NextResponse.json({
    summary: {
      totalPages: linkGraph.totalPages,
      totalInternalEdges: linkGraph.totalEdges,
      orphanPages: linkGraph.orphans.length,
      cannibalizationIssues: cannibalization.length,
      contentGaps: contentGaps.gaps.length,
      totalPriorityScore: contentGaps.totalPriority,
      stalePercent: freshness.stalePercent,
      totalEntities: entities.stats.totalEntities,
    },
    linkGraph,
    cannibalization,
    contentGaps,
    freshness,
    entities,
  });
}