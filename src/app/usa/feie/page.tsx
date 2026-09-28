import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Plane, AlertTriangle, BookOpen, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FeieCalculator } from "@/components/FeieCalculator";

export const metadata: Metadata = {
  title: "USA Foreign Earned Income Exclusion (FEIE) Calculator 2026 | Expat Tax Savings",
  description:
    "Calculate the USA FEIE (Foreign Earned Income Exclusion). $130,000 excluded in 2026. See tax savings vs filing normally.",
};

export const dynamic = "force-dynamic";

export default function FeiePage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <nav className="flex items-center gap-1 text-sm text-slate-500">
        <Link href="/" className="hover:text-slate-700">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/countries/usa" className="hover:text-slate-700">USA</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-slate-900">FEIE</span>
      </nav>

      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
          Special scenario · US expat
        </div>
        <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
          USA Foreign Earned Income Exclusion (FEIE)
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          The FEIE lets qualifying US citizens and resident aliens living abroad{" "}
          <strong>exclude up to $130,000 of foreign-earned income</strong> from US federal
          income tax (2026 figure). For a single filer with $130K+ foreign income, this
          can save <strong>$15K-$30K/year</strong> in federal tax.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <BookOpen className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900">
          <strong>How it works:</strong> Once you qualify, you check the box on Form 2555
          attached to your Form 1040. The IRS excludes the first $130K from federal income tax.
          You still owe <strong>self-employment tax</strong> (Social Security + Medicare, 15.3% on
          net earnings up to the wage base) unless you also pay into a foreign system with a
          totalization agreement (most expats in developed countries do).
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your FEIE Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <FeieCalculator />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Eligibility — Two Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <h3 className="text-base font-semibold text-blue-900 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" /> Bona Fide Residence Test
              </h3>
              <p className="mt-2 text-sm text-blue-900">
                You must be a bona fide resident of a foreign country for an <strong>uninterrupted
                period that includes an entire calendar year</strong>. Pro tip: most expats establish
                this by Dec 31 of their first year abroad.
              </p>
            </div>
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <h3 className="text-base font-semibold text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" /> Physical Presence Test
              </h3>
              <p className="mt-2 text-sm text-emerald-900">
                You must be physically present in foreign countries for <strong>at least 330 full
                days</strong> during any 12-month period. Bona fide residence is generally
                easier; physical presence is more mechanical.
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-600">
            ✓ You qualify under <strong>either</strong> test (not both). Exception: in Iraq,
            Afghanistan, or other combat zones for the entire year — you can claim the FEIE
            without either test (IRS Notice 2003-21).
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Income Types</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
              <span><strong>Wages & salary earned in a foreign country</strong> — fully eligible (e.g. Berlin-based salary paid by a German employer to a US citizen)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
              <span><strong>Self-employment income</strong> — eligible, but the full 15.3% SE tax still applies (no exclusion)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
              <span><strong>Foreign rental income</strong> — fully eligible</span>
            </li>
            <li className="flex items-start gap-2">
              <XCircle className="h-4 w-4 text-rose-500 mt-0.5 shrink-0" />
              <span><strong>US-source income</strong> (e.g. consulting for US clients while abroad) — <strong>NOT</strong> eligible for FEIE</span>
            </li>
            <li className="flex items-start gap-2">
              <XCircle className="h-4 w-4 text-rose-500 mt-0.5 shrink-0" />
              <span><strong>Investment & passive income</strong> (dividends, capital gains, interest) — <strong>NOT</strong> eligible; still subject to US tax</span>
            </li>
            <li className="flex items-start gap-2">
              <XCircle className="h-4 w-4 text-rose-500 mt-0.5 shrink-0" />
              <span><strong>Social Security & pension income from the US</strong> — <strong>NOT</strong> eligible</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-700">
          <details className="group rounded-lg border border-slate-200 p-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between font-semibold">
              Can I claim FEIE if I worked abroad part of the year?
              <span className="text-slate-400 transition group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 leading-relaxed">
              Yes — but the exclusion is <strong>prorated</strong> based on the number of qualifying days.
              The $130K (2026) limit is reduced proportionally. For example, 6 qualifying months
              = $65K exclusion. You can also use the calendar-year optimization strategy: time
              your move/departure to maximize qualifying months in a single year.
            </p>
          </details>

          <details className="group rounded-lg border border-slate-200 p-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between font-semibold">
              Does FEIE still apply to self-employment income?
              <span className="text-slate-400 transition group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 leading-relaxed">
              Yes, but the FEIE only excludes income from US <strong>income tax</strong> — you still owe
              <strong> self-employment tax</strong> (15.3%) on your net self-employment income, minus half
              as a deduction. This is why most expat freelancers also elect the Foreign Earned Income
              <em> exclusion AND</em> use the Foreign Tax Credit (FTC) to offset SE tax through foreign
              social contributions (where totalization agreements exist).
            </p>
          </details>

          <details className="group rounded-lg border border-slate-200 p-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between font-semibold">
              What about state income tax? Does FEIE eliminate that?
              <span className="text-slate-400 transition group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 leading-relaxed">
              Federal tax only. <strong>State tax is separate</strong>. Most states follow federal
              residency rules (you escape CA state tax if you establish domicile elsewhere — but
              you'll likely face CA audit if you own CA property). California, Virginia, New Mexico,
              and South Carolina are aggressive about residency audits. New Hampshire and Texas
              (no state income tax) make the FEIE + no-state-tax combo especially valuable.
            </p>
          </details>

          <details className="group rounded-lg border border-slate-200 p-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between font-semibold">
              Can I revoke FEIE and switch to FTC?
              <span className="text-slate-400 transition group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 leading-relaxed">
              Yes — you can revoke FEIE by attaching a statement to your 1040 (no special form).
              The revocation applies to that year and all future years unless you re-elect FEIE
              (<strong>but re-electing requires a 5-year wait</strong>). Most expats revoke once they
              start earning enough that FTC is more beneficial, or their home country tax rate
              exceeds US federal rates.
            </p>
          </details>

          <details className="group rounded-lg border border-slate-200 p-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between font-semibold">
              What happens to my IRA/401k as an expat?
              <span className="text-slate-400 transition group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 leading-relaxed">
              FEIE <strong>does not affect</strong> IRA/401k contributions — but you must still follow
              contribution limits. Roth IRA contributions are prohibited if your MAGI exceeds the
              threshold (even if you exclude all earned income — for Roth eligibility, the IRS looks
              at your <em>modified AGI</em>, not just your excluded income). Traditional IRA contributions
              are still allowed if you have earned income (FEIE-excluded income still counts as "earned
              income" for IRA purposes).
            </p>
          </details>

          <details className="group rounded-lg border border-slate-200 p-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between font-semibold">
              Do I still need to file FBAR and other forms?
              <span className="text-slate-400 transition group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 leading-relaxed">
              Yes — FEIE only affects your US income tax. You still must file:
              <strong> FBAR (FinCEN 114)</strong> if you have over $10K in foreign accounts;
              <strong> Form 8938</strong> if your foreign assets exceed thresholds;
              <strong> Form 1040</strong> with Form 2555 attached;
              <strong> state returns</strong> (if not properly severed residency).
              Most expats hire a specialist CPA — typical cost $300-800/year.
            </p>
          </details>
        </CardContent>
      </Card>

      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-6 flex items-start gap-3 text-sm text-amber-900">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong>Estimate only — not tax advice.</strong> FEIE eligibility, revocation rules, and
            interactions with the Foreign Tax Credit (FTC) are complex. Most US expats benefit from
            consulting a <strong>US-expat-specialist CPA</strong> (e.g. Greenback, H&amp;R Block Expat,
            Taxes for Expats). Budget $300-1500/year for proper filing.
          </div>
        </CardContent>
      </Card>

      <div className="text-sm text-slate-700">
        <h3 className="font-semibold mb-2">Related</h3>
        <ul className="space-y-1 text-blue-700">
          <li><Link href="/countries/usa" className="hover:underline">→ USA tax calculator (no FEIE)</Link></li>
          <li><Link href="/compare/usa-vs-uk" className="hover:underline">→ USA vs UK tax comparison</Link></li>
          <li><Link href="/compare/usa-vs-germany" className="hover:underline">→ USA vs Germany tax comparison</Link></li>
          <li><Link href="/embed/US?income=100000" className="hover:underline">→ Embed USA calculator</Link></li>
        </ul>
      </div>
    </div>
  );
}