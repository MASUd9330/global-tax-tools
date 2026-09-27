import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { z } from "zod";
import { checkAll, summary } from "@/lib/monitor/checker";
import { MONITORED_SOURCES } from "@/lib/monitor/sources";

const QuerySchema = z.object({
  priority: z.enum(["1", "2", "3"]).optional(),
  category: z.enum(["country", "state"]).optional(),
});

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const parsed = QuerySchema.safeParse({
    priority: url.searchParams.get("priority") ?? undefined,
    category: url.searchParams.get("category") ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query", details: parsed.error.flatten() }, { status: 400 });
  }

  const filter: { priority?: 1 | 2 | 3; category?: "country" | "state" } = {};
  if (parsed.data.priority) filter.priority = parseInt(parsed.data.priority, 10) as 1 | 2 | 3;
  if (parsed.data.category) filter.category = parsed.data.category;

  const results = await checkAll(filter);
  return NextResponse.json({
    ranAt: new Date().toISOString(),
    sourcesTracked: MONITORED_SOURCES.length,
    summary: summary(results),
    results,
  });
}