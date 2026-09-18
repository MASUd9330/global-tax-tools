import Link from "next/link";
import { ChevronRight, AlertTriangle, Database, Globe, Link2, Network, Sparkles } from "lucide-react";
import { getInternalLinkGraph } from "@/lib/seo/link-graph";
import { detectCannibalization } from "@/lib/seo/cannibalization";
import { detectContentGaps } from "@/lib/seo/content-gaps";
import { getFreshnessReport } from "@/lib/seo/freshness";
import { getEntityGraph } from "@/lib/seo/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";
export const metadata = { title: "SEO Intelligence Dashboard" };

export default async function SeoDashboardPage() {
  const [linkGraph, cannibalization, contentGaps, freshness, entities] = await Promise.all([
    getInternalLinkGraph(),
    detectCannibalization(),
    detectContentGaps(),
    getFreshnessReport(),
    getEntityGraph(),
  ]);

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-slate-500">
        <Link href="/" className="hover:text-slate-700">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-slate-900">SEO Intelligence</span>
      </nav>

      <div>
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="h-7 w-7 text-blue-600" />
          SEO Intelligence Dashboard
        </h1>
        <p className="mt-2 text-slate-600">
          Phase 2 architecture signals — link graph, cannibalization, content gaps, freshness, entity graph.
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<Globe />} label="Total Pages" value={linkGraph.totalPages} accent="blue" />
        <StatCard icon={<Link2 />} label="Internal Edges" value={linkGraph.totalEdges} accent="blue" />
        <StatCard icon={<AlertTriangle />} label="Orphan Pages" value={linkGraph.orphans.length} accent={linkGraph.orphans.length > 0 ? "red" : "green"} />
        <StatCard icon={<AlertTriangle />} label="Cannibalization" value={cannibalization.length} accent={cannibalization.length > 5 ? "red" : "amber"} />
        <StatCard icon={<Database />} label="Content Gaps" value={contentGaps.gaps.length} accent="amber" />
        <StatCard icon={<Database />} label="Priority Score" value={contentGaps.totalPriority} accent="blue" />
        <StatCard icon={<Database />} label="Stale Pages" value={`${freshness.stalePercent}%`} accent={freshness.stalePercent > 30 ? "red" : "green"} />
        <StatCard icon={<Network />} label="Entities" value={entities.stats.totalEntities} accent="blue" />
      </div>

      {/* Link Graph */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" /> Internal Link Graph
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600 mb-3">
            {linkGraph.totalPages} pages, {linkGraph.totalEdges} edges, avg {linkGraph.avgInbound} inbound links per page.
          </p>
          {linkGraph.orphans.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded p-3 mb-3">
              <h4 className="font-medium text-amber-900 text-sm">⚠ {linkGraph.orphans.length} Orphan Pages</h4>
              <p className="text-xs text-amber-800 mt-1">These pages have no inbound internal links. Add them to relevant content.</p>
              <ul className="mt-2 text-xs text-amber-900 space-y-0.5 max-h-40 overflow-auto">
                {linkGraph.orphans.slice(0, 10).map((u) => (
                  <li key={u} className="truncate font-mono">{u}</li>
                ))}
              </ul>
            </div>
          )}
          <h4 className="font-medium text-slate-900 text-sm mt-4">Top Hubs (most outbound links)</h4>
          <ol className="mt-2 text-xs space-y-0.5">
            {linkGraph.hubs.map((h, i) => (
              <li key={h.url} className="flex items-center gap-2">
                <span className="text-slate-400 w-5">{i + 1}.</span>
                <span className="font-mono truncate flex-1">{h.url.replace(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000", "")}</span>
                <span className="text-slate-500">{h.outboundCount}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Cannibalization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" /> Cannibalization Issues ({cannibalization.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600 mb-3">
            Pages competing for the same keywords. High severity means 4+ pages target the same keyword.
          </p>
          <div className="space-y-2">
            {cannibalization.slice(0, 15).map((issue, i) => (
              <div key={i} className={`p-2 rounded text-xs border ${
                issue.severity === "high" ? "bg-red-50 border-red-200" :
                issue.severity === "medium" ? "bg-amber-50 border-amber-200" :
                "bg-slate-50 border-slate-200"
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-medium">{issue.keyword}</span>
                  <span className={`uppercase text-[10px] font-bold ${
                    issue.severity === "high" ? "text-red-700" :
                    issue.severity === "medium" ? "text-amber-700" :
                    "text-slate-600"
                  }`}>{issue.severity}</span>
                </div>
                <div className="text-slate-600 mt-1">
                  {issue.pages.length} pages: {issue.pages.slice(0, 2).map((p) => p.title).join(", ")}
                  {issue.pages.length > 2 && ` +${issue.pages.length - 2} more`}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content Gaps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" /> Content Gaps ({contentGaps.gaps.length} opportunities)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600 mb-3">
            Missing pages that should exist for SEO coverage. Priority 1-10 (higher = more important).
          </p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {contentGaps.gaps.slice(0, 24).map((g, i) => (
              <div key={i} className="border border-slate-200 rounded p-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-900 truncate">{g.label}</span>
                  <span className={`ml-2 rounded px-1.5 py-0.5 text-[10px] font-bold ${
                    g.priority >= 7 ? "bg-red-100 text-red-700" :
                    g.priority >= 5 ? "bg-amber-100 text-amber-700" :
                    "bg-slate-100 text-slate-600"
                  }`}>P{g.priority}</span>
                </div>
                <div className="text-slate-500 mt-0.5">{g.type.replace("missing-", "")}</div>
                <div className="text-slate-600 mt-1">{g.reason}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Freshness */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" /> Freshness Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600 mb-3">
            Pages with tax data older than 12 months need a review.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium text-sm mb-2">Countries</h4>
              <ul className="text-xs space-y-1 max-h-64 overflow-auto">
                {freshness.countries.map((c) => (
                  <li key={c.code} className="flex items-center justify-between">
                    <span>{c.name}</span>
                    <span className={c.stale ? "text-red-600" : "text-emerald-600"}>
                      {c.daysSinceUpdate !== null ? `${c.daysSinceUpdate}d` : "no data"} {c.stale && "⚠"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-2">US States (sample)</h4>
              <ul className="text-xs space-y-1 max-h-64 overflow-auto">
                {freshness.states.slice(0, 15).map((s) => (
                  <li key={s.code} className="flex items-center justify-between">
                    <span>{s.name}</span>
                    <span className="text-emerald-600">{s.daysSinceUpdate}d</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Entity Graph */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" /> Entity Graph
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-4 text-sm">
            <Stat label="Total entities" value={entities.stats.totalEntities} />
            <Stat label="Total relationships" value={entities.stats.totalRelationships} />
            {Object.entries(entities.stats.byType).map(([type, count]) => (
              <Stat key={type} label={type} value={count} />
            ))}
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-slate-500">
        API endpoints: <code className="rounded bg-slate-100 px-1">GET /api/seo</code> (combined) ·{" "}
        <code className="rounded bg-slate-100 px-1">GET /api/seo/[link-graph|cannibalization|content-gaps|freshness|entities]</code> (individual).
      </p>
    </div>
  );
}

function StatCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: number | string; accent: "blue" | "red" | "amber" | "green" }) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-700",
    red: "bg-red-50 text-red-700",
    amber: "bg-amber-50 text-amber-700",
    green: "bg-emerald-50 text-emerald-700",
  };
  return (
    <div className={`rounded-lg p-4 ${colorMap[accent]}`}>
      <div className="flex items-center gap-2 text-xs uppercase tracking-wide opacity-80">
        {icon}
        <span>{label}</span>
      </div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-slate-50 rounded p-3">
      <div className="text-xs text-slate-500 uppercase tracking-wide">{label}</div>
      <div className="mt-1 text-lg font-semibold text-slate-900">{value}</div>
    </div>
  );
}