import { NextRequest, NextResponse } from "next/server";
import { getInternalLinkGraph } from "@/lib/seo/link-graph";
import { detectCannibalization } from "@/lib/seo/cannibalization";
import { detectContentGaps } from "@/lib/seo/content-gaps";
import { getFreshnessReport } from "@/lib/seo/freshness";
import { getEntityGraph } from "@/lib/seo/entities";

/** GET /api/seo/[signal] — individual signal */
export async function GET(
  _req: NextRequest,
  { params }: { params: { signal: string } }
) {
  const { signal } = params;
  switch (signal) {
    case "link-graph": return NextResponse.json(await getInternalLinkGraph());
    case "cannibalization": return NextResponse.json(await detectCannibalization());
    case "content-gaps": return NextResponse.json(await detectContentGaps());
    case "freshness": return NextResponse.json(await getFreshnessReport());
    case "entities": return NextResponse.json(await getEntityGraph());
    default:
      return NextResponse.json({ error: `Unknown signal: ${signal}` }, { status: 404 });
  }
}