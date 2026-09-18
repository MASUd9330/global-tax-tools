import Link from "next/link";
import { listCountries } from "@/lib/data/country";
import { TaxCalculator } from "@/components/TaxCalculator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JsonLd, organizationLd, softwareApplicationLd } from "@/components/JsonLd";
import { ArrowRight, Globe2, ShieldCheck, Zap } from "lucide-react";

export const revalidate = 3600;

export default async function HomePage() {
  const countries = await listCountries();
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return (
    <div className="space-y-12">
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
      <section className="text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
          <Zap className="h-3 w-3" /> Free · No signup · Source-cited
        </div>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Global tax & salary calculator
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
          Estimate income tax and take-home pay across {countries.length} countries.
          Always cites the official tax authority. Updated for 2025.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-slate-600">
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="h-4 w-4 text-emerald-600" /> Source-cited
          </span>
          <span className="inline-flex items-center gap-1">
            <Globe2 className="h-4 w-4 text-blue-600" /> 2025 tax data
          </span>
          <span className="inline-flex items-center gap-1">
            <Zap className="h-4 w-4 text-amber-500" /> Live calculation
          </span>
        </div>
      </section>

      {/* Calculator */}
      <section>
        <TaxCalculator initialCountry="US" initialIncome={75000} />
      </section>

      {/* Country grid */}
      <section>
        <h2 className="text-2xl font-semibold text-slate-900">Supported countries</h2>
        <p className="mt-1 text-sm text-slate-600">
          Federal/national level. State and provincial breakdowns coming in Phase 1+.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {countries.map((c) => (
            <Link key={c.code} href={`/countries/${c.slug}/`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="text-2xl">{c.flagEmoji}</span>
                      {c.name}
                    </span>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 line-clamp-3">
                    {c.description ?? `${c.region} — ${c.taxSystem} tax system, ${c.defaultCurrency}.`}
                  </p>
                  <div className="mt-3 flex gap-2 text-xs">
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-700">{c.region}</span>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-700">{c.taxSystem}</span>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-700">{c.defaultCurrency}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}