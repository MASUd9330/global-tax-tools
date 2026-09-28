import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MONITORED_SOURCES } from "@/lib/monitor/sources";
import { readMonitorHistory } from "@/lib/monitor/history";

export const metadata = {
  title: "Source Monitor — TaxRank Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function MonitorPage() {
  const countries = MONITORED_SOURCES.filter((s) => s.category === "country");
  const states = MONITORED_SOURCES.filter((s) => s.category === "state");
  const g7 = countries.filter((s) => s.priority === 1);
  const tier2 = countries.filter((s) => s.priority === 2);
  const tier3 = countries.filter((s) => s.priority === 3);
  const history = await readMonitorHistory();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Source Monitor</h1>
        <p className="mt-1 text-slate-600 text-sm">
          Registry of authoritative tax sources. Run <code className="bg-slate-100 px-1 rounded text-xs">/api/monitor</code> to fetch all
          and compare hash against last-seen baseline (stored in module memory — resets on cold start).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <Stat label="Total sources" value={MONITORED_SOURCES.length} />
            <Stat label="Countries" value={countries.length} />
            <Stat label="US States" value={states.length} />
            <Stat label="Tier 1 (G7)" value={g7.length} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tier 1 — G7 countries (priority 1)</CardTitle>
        </CardHeader>
        <CardContent>
          <SourceTable sources={g7} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tier 2 — Expat-heavy (priority 2)</CardTitle>
        </CardHeader>
        <CardContent>
          <SourceTable sources={tier2} />
        </CardContent>
      </Card>

      {tier3.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tier 3 — Long-tail (priority 3)</CardTitle>
          </CardHeader>
          <CardContent>
            <SourceTable sources={tier3} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>US States (priority 2/3)</CardTitle>
        </CardHeader>
        <CardContent>
          <SourceTable sources={states} />
        </CardContent>
      </Card>

      {/* Recent run history (populated by GitHub Actions workflow) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Recent run history</span>
            {history.lastUpdated && (
              <span className="text-xs font-normal text-slate-500">
                Last updated: {new Date(history.lastUpdated).toLocaleString()}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {history.history.length === 0 ? (
            <div className="text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded p-3">
              No runs yet. The GitHub Actions workflow{" "}
              <code className="bg-white px-1 rounded text-xs">.github/workflows/monitor.yml</code> runs
              daily at 06:00 UTC and commits results to <code className="bg-white px-1 rounded text-xs">data/monitor-results.json</code>.
              You can also trigger it manually from the Actions tab → "Run workflow".
            </div>
          ) : (
            <div className="space-y-3">
              {history.history.slice().reverse().slice(0, 10).map((run, i) => {
                const changed = run.summary.byVerdict.changed;
                const errors = run.summary.byVerdict.error + run.summary.byVerdict.timeout;
                return (
                  <div key={i} className="border border-slate-200 rounded p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-900">
                        {new Date(run.ranAt).toLocaleString()}
                      </span>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-slate-500">{run.summary.total} checked</span>
                        {changed > 0 && (
                          <span className="rounded bg-amber-50 px-2 py-0.5 text-amber-700 font-medium">
                            {changed} changed
                          </span>
                        )}
                        {errors > 0 && (
                          <span className="rounded bg-rose-50 px-2 py-0.5 text-rose-700 font-medium">
                            {errors} errors
                          </span>
                        )}
                      </div>
                    </div>
                    {run.results.filter((r) => r.verdict === "changed").length > 0 && (
                      <ul className="mt-2 text-xs space-y-1">
                        {run.results.filter((r) => r.verdict === "changed").map((r) => (
                          <li key={r.id} className="text-slate-700">
                            <strong>{r.jurisdiction}</strong> —{" "}
                            <a href={r.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {r.sourceUrl}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How to use</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-700 space-y-2">
          <p>
            <strong>Manual audit:</strong> Call{" "}
            <code className="bg-slate-100 px-1 rounded text-xs">GET /api/monitor</code> from your terminal or browser.
            Returns JSON with each source's HTTP status, content hash, and verdict.
          </p>
          <p>
            <strong>Filter by priority:</strong>{" "}
            <code className="bg-slate-100 px-1 rounded text-xs">/api/monitor?priority=1</code> — only G7 countries.
          </p>
          <p>
            <strong>Filter by category:</strong>{" "}
            <code className="bg-slate-100 px-1 rounded text-xs">/api/monitor?category=state</code> — only US states.
          </p>
          <p>
            <strong>Automated daily check:</strong> The GitHub Actions workflow runs at 06:00 UTC and
            writes results to <code className="bg-slate-100 px-1 rounded text-xs">data/monitor-results.json</code>.
            No PC required — runs on GitHub's servers (free, ~30 min/month of GitHub Actions quota).
          </p>
          <p>
            <strong>Verdicts:</strong>{" "}
            <span className="text-emerald-700">ok</span> = hash matches last-seen ·{" "}
            <span className="text-amber-700">changed</span> = hash differs ·{" "}
            <span className="text-rose-700">error</span> = non-2xx or network failure ·{" "}
            <span className="text-slate-700">timeout</span> = exceeded 8s.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-slate-50 rounded p-3">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-bold text-slate-900">{value}</div>
    </div>
  );
}

function SourceTable({ sources }: { sources: typeof MONITORED_SOURCES }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
            <th className="py-2">Jurisdiction</th>
            <th className="py-2">Source</th>
            <th className="py-2">URL</th>
          </tr>
        </thead>
        <tbody>
          {sources.map((s) => (
            <tr key={s.id} className="border-b border-slate-100">
              <td className="py-2 font-medium text-slate-900">{s.jurisdiction}</td>
              <td className="py-2 text-slate-700">{s.organization}</td>
              <td className="py-2">
                <a
                  href={s.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all text-xs"
                >
                  {s.sourceUrl}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}