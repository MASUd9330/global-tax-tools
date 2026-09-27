"use client";

import { useState } from "react";
import { Loader2, Sparkles, AlertTriangle, ExternalLink, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ExplanationPayload {
  summary: string;
  sections: { heading: string; body: string }[];
  insights: string[];
  warnings: string[];
  citations: { label: string; url: string }[];
}

interface Props {
  country: string;
  state?: string;
  income: number;
}

export function AiExplainer({ country, state, income }: Props) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ExplanationPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(true);

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country, state, income }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || `HTTP ${r.status}`);
      setData(j.explanation);
      setExpanded(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-purple-200 bg-gradient-to-br from-white to-purple-50/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-4 w-4 text-purple-600" />
          AI Tax Explanation
          <span className="ml-auto text-xs font-normal text-slate-500">Rule-based · no LLM</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!data && (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">
              Get a plain-English breakdown of how your tax was calculated: which brackets applied,
              which deductions reduced your bill, and what your marginal vs effective rates actually mean.
            </p>
            <Button onClick={generate} disabled={loading} variant="default">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Generating…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Explain this calculation
                </>
              )}
            </Button>
            {error && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">{error}</div>}
          </div>
        )}

        {data && (
          <div className="space-y-4">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-sm text-slate-900" dangerouslySetInnerHTML={{ __html: renderMarkdown(data.summary) }} />
            </div>

            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-slate-500 hover:text-slate-700 inline-flex items-center gap-1"
            >
              <ChevronDown className={`h-3 w-3 transition-transform ${expanded ? "rotate-180" : ""}`} />
              {expanded ? "Hide details" : "Show details"}
            </button>

            {expanded && (
              <div className="space-y-5">
                {data.sections.map((s, i) => (
                  <div key={i}>
                    <h4 className="text-sm font-semibold text-slate-900 mb-1.5">{s.heading}</h4>
                    <div
                      className="text-sm text-slate-700 leading-relaxed prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(s.body) }}
                    />
                  </div>
                ))}

                {data.insights.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                    <h4 className="text-sm font-semibold text-blue-900">Key insights</h4>
                    <ul className="space-y-1.5">
                      {data.insights.map((insight, i) => (
                        <li
                          key={i}
                          className="text-sm text-blue-900"
                          dangerouslySetInnerHTML={{ __html: renderMarkdown(insight) }}
                        />
                      ))}
                    </ul>
                  </div>
                )}

                {data.warnings.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2">
                    <h4 className="text-sm font-semibold text-amber-900 flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4" /> Important caveats
                    </h4>
                    <ul className="space-y-1.5">
                      {data.warnings.map((w, i) => (
                        <li key={i} className="text-sm text-amber-900">
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {data.citations.length > 0 && (
                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-xs uppercase tracking-wide text-slate-500 mb-1.5">Sources</p>
                    <ul className="space-y-1">
                      {data.citations.map((c, i) => (
                        <li key={i} className="text-xs text-slate-700">
                          <a
                            href={c.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 hover:text-slate-900 underline"
                          >
                            {c.label} <ExternalLink className="h-3 w-3" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Minimal markdown → HTML — bold (**text**), bullets (•), and line breaks.
// Avoids pulling a markdown lib for a small surface.
function renderMarkdown(text: string): string {
  const escape = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  return escape(text)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br>");
}