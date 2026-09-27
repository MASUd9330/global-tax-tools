import Link from "next/link";
import { listCountries } from "@/lib/data/country";
import { listStatesForCountry } from "@/lib/data/state";
import { TaxCalculator } from "@/components/TaxCalculator";
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui/card";
import { JsonLd, organizationLd, softwareApplicationLd } from "@/components/JsonLd";
import {
  ArrowRight, Globe2, ShieldCheck, Zap, Calculator, Banknote, Layers,
  GitCompare, TrendingUp, Code2, MapPin, FileSearch, Clock, BookOpen, Sparkles,
} from "lucide-react";

// Dynamic: server-rendered with current static data
export const dynamic = "force-dynamic";
export const revalidate = 3600;

function ToolCard({ href, title, description, icon: Icon, accent }: {
  href: string; title: string; description: string;
  icon: React.ComponentType<{ className?: string }>; accent: string;
}) {
  return (
    <Link href={href} className="group block">
      <Card className="relative h-full overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
        <div className={`absolute inset-x-0 top-0 h-1 ${accent}`} />
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className={`rounded-lg p-2 ${accent} bg-opacity-10`}>
              <Icon className="h-5 w-5" />
            </div>
            <ArrowRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-slate-500" />
          </div>
          <CardTitle className="text-base font-semibold text-slate-900 pt-2">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

function StatPill({ value, label, sub }: { value: string; label: string; sub?: string }) {
  return (
    <div className="text-center px-3 py-2">
      <div className="text-2xl font-bold text-slate-900 tabular-nums">{value}</div>
      <div className="text-xs uppercase tracking-wide text-slate-500 mt-0.5">{label}</div>
      {sub && <div className="text-xs text-slate-400 mt-0.5">{sub}</div>}
    </div>
  );
}

function CountryCard({ c }: { c: Awaited<ReturnType<typeof listCountries>>[number] }) {
  const noTax = c.taxSystem === "none";
  return (
    <Link href={`/countries/${c.slug}/`} className="group block">
      <Card className="relative h-full overflow-hidden transition-all duration-200 hover:shadow-md hover:border-slate-300">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-base">
            <span className="flex items-center gap-2">
              <span className="text-2xl leading-none">{c.flagEmoji}</span>
              <span className="font-semibold text-slate-900">{c.name}</span>
            </span>
            <ArrowRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-slate-500" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {c.description ?? `${c.region} — ${c.taxSystem} tax system, ${c.defaultCurrency}.`}
          </p>
          <div className="flex flex-wrap gap-1.5 text-xs">
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-slate-700 font-medium">
              {c.region}
            </span>
            <span className="rounded-md bg-blue-50 px-2 py-0.5 text-blue-700 font-medium">
              {c.defaultCurrency}
            </span>
            {noTax ? (
              <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-emerald-700 font-medium">
                No income tax
              </span>
            ) : (
              <span className="rounded-md bg-purple-50 px-2 py-0.5 text-purple-700 font-medium capitalize">
                {c.taxSystem}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default async function HomePage() {
  const countries = await listCountries();
  const usStates = await listStatesForCountry("US");
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const noTaxCountries = countries.filter((c) => c.taxSystem === "none");

  // Group countries by region for the regional display
  const byRegion = countries.reduce((acc, c) => {
    if (!acc[c.region]) acc[c.region] = [];
    acc[c.region].push(c);
    return acc;
  }, {} as Record<string, typeof countries>);

  return (
    <div className="space-y-16">
      <JsonLd data={organizationLd()} />
      <JsonLd
        data={softwareApplicationLd({
          name: "TaxRank — Global Income Tax Calculator",
          description:
            "Free, source-cited income tax calculator for USA, UK, Germany, France, Canada. 2025 brackets.",
          url: base,
        })}
      />

      {/* Hero */}
      <section className="relative -mt-8">
        <div className="absolute inset-x-0 -top-8 -bottom-8 bg-gradient-to-b from-blue-50/60 via-white to-transparent -z-10" />
        <div className="absolute inset-x-0 top-32 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        <div className="text-center pt-8 pb-4">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3 py-1 text-xs font-medium text-blue-700 shadow-sm">
            <Zap className="h-3 w-3" /> Free · No signup · Source-cited
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            Estimate tax in any country, <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
              in under 5 seconds.
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
            {countries.length} countries, {usStates.length} US states, official-source brackets.
            Built for expats, remote workers, and anyone evaluating a move.
          </p>

          {/* Stats bar */}
          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 sm:grid-cols-4 gap-1 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
            <StatPill value={`${countries.length}`} label="Countries" />
            <div className="hidden sm:block"><div className="h-full w-px bg-slate-200 mx-auto" /></div>
            <StatPill value={`${usStates.length}`} label="US states" />
            <div className="hidden sm:block"><div className="h-full w-px bg-slate-200 mx-auto" /></div>
            <StatPill value="2025" label="Tax year" sub="Indexed brackets" />
            <div className="hidden sm:block"><div className="h-full w-px bg-slate-200 mx-auto" /></div>
            <StatPill value={noTaxCountries.length.toString()} label="No-tax" sub="jurisdictions" />
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section>
        <TaxCalculator initialCountry="US" initialIncome={75000} />
      </section>

      {/* Tools grid */}
      <section>
        <div className="flex items-baseline justify-between mb-2">
          <h2 className="text-2xl font-bold text-slate-900">Tools</h2>
          <p className="text-sm text-slate-500">One for every tax question.</p>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ToolCard
            href="/tools/tax-calculator/"
            title="Income Tax"
            description="Single country, full bracket + deduction breakdown."
            icon={Calculator}
            accent="bg-blue-500 text-blue-700"
          />
          <ToolCard
            href="/tools/salary-calculator/"
            title="Salary (take-home)"
            description="Net pay with social / health contributions included."
            icon={Banknote}
            accent="bg-emerald-500 text-emerald-700"
          />
          <ToolCard
            href="/tools/scenario-builder/"
            title="Scenario Builder"
            description="Compare 2-4 countries or states at the same salary."
            icon={Layers}
            accent="bg-amber-500 text-amber-700"
          />
          <ToolCard
            href="/tools/historical-trends/"
            title="Historical Trends"
            description="2024 vs 2025 year-over-year comparison."
            icon={TrendingUp}
            accent="bg-purple-500 text-purple-700"
          />
          <ToolCard
            href="/compare/"
            title="Compare Countries"
            description="Side-by-side comparison matrix."
            icon={GitCompare}
            accent="bg-rose-500 text-rose-700"
          />
          <ToolCard
            href="/embed/"
            title="Embed Widget"
            description="Drop the calculator on your site — free, no signup."
            icon={Code2}
            accent="bg-slate-700 text-slate-700"
          />
        </div>
      </section>

      {/* Trust strip */}
      <section>
        <div className="grid gap-4 md:grid-cols-3 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200 p-6 md:p-8">
          <div className="flex gap-3">
            <div className="shrink-0 rounded-lg bg-emerald-100 p-2 h-fit">
              <ShieldCheck className="h-5 w-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Source-cited estimates</h3>
              <p className="mt-1 text-sm text-slate-600">
                Every bracket links to the official tax authority. See <Link href="/methodology/" className="text-blue-600 hover:underline">methodology</Link>.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="shrink-0 rounded-lg bg-blue-100 p-2 h-fit">
              <FileSearch className="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Change detection</h3>
              <p className="mt-1 text-sm text-slate-600">
                We monitor 51 official sources. Updated brackets ship within days of publication.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="shrink-0 rounded-lg bg-purple-100 p-2 h-fit">
              <Sparkles className="h-5 w-5 text-purple-700" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">AI explanations</h3>
              <p className="mt-1 text-sm text-slate-600">
                Plain-English breakdowns of how your tax was calculated — no LLM, fully deterministic.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Country grid — by region */}
      <section>
        <div className="flex items-baseline justify-between mb-2">
          <h2 className="text-2xl font-bold text-slate-900">Supported countries</h2>
          <Link href="/countries/" className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1">
            See all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <p className="text-sm text-slate-600">
          Federal/national level. <strong className="text-slate-900">{usStates.length} US states</strong> with full bracket breakdowns below.
        </p>

        {/* US States mega card */}
        <div className="mt-6">
          <Card className="overflow-hidden border-blue-200">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-base">
                  <span className="text-2xl">🇺🇸</span>
                  <span className="font-semibold">United States</span>
                  <Badge className="bg-blue-100 text-blue-800">{usStates.length} states</Badge>
                </span>
                <Link href="/countries/usa/" className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1">
                  Full US calculator <ArrowRight className="h-3 w-3" />
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-1.5">
                {usStates.map((s) => (
                  <Link
                    key={s.code}
                    href={`/us-state/${s.slug}`}
                    className="group/state relative rounded-md border border-slate-200 px-2 py-1.5 text-center text-xs transition-all hover:border-blue-400 hover:bg-blue-50"
                  >
                    <div className="font-semibold text-slate-900">{s.code}</div>
                    <div className="text-[10px] text-slate-500 truncate">{s.name}</div>
                    {!s.hasIncomeTax && (
                      <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-500" title="No state income tax" />
                    )}
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Other countries grouped by region */}
        <div className="mt-8 space-y-8">
          {Object.entries(byRegion).map(([region, list]) => (
            <div key={region}>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
                <MapPin className="h-3.5 w-3.5" /> {region}
                <span className="text-xs font-normal text-slate-400 normal-case">· {list.length} countries</span>
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((c) => (
                  <CountryCard key={c.code} c={c} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Methodology footer CTA */}
      <section>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="shrink-0 rounded-lg bg-slate-100 p-3">
                <BookOpen className="h-6 w-6 text-slate-700" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">How we calculate</h3>
                <p className="mt-1 text-sm text-slate-600">
                  We use published bracket tables + standard deductions. Always cite the official source.
                  <strong> Estimate only</strong> — confirm with a tax professional before filing.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <Link
                href="/methodology/"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Methodology <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/embed/"
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                <Code2 className="h-3.5 w-3.5" /> Get widget
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}