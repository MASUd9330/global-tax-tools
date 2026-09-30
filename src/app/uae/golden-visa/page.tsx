import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Award, AlertTriangle, BookOpen, CheckCircle2, XCircle, Clock, DollarSign, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GoldenVisaCalculator } from "@/components/GoldenVisaCalculator";

export const metadata: Metadata = {
  title: "UAE Golden Visa Tax Calculator 2026 | 10-Year Residency + Tax Benefits",
  description:
    "Calculate your 10-year tax savings under the UAE Golden Visa. Zero personal income tax, no foreign income reporting, 100% business ownership in free zones.",
};

export const dynamic = "force-dynamic";

export default function GoldenVisaPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <nav className="flex items-center gap-1 text-sm text-slate-500">
        <Link href="/" className="hover:text-slate-700">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/countries/uae" className="hover:text-slate-700">UAE</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-slate-900">Golden Visa</span>
      </nav>

      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
          Special scenario · Expat residency + tax
        </div>
        <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
          UAE Golden Visa — Tax & Financial Calculator
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          The <strong>UAE Golden Visa</strong> is a 10-year renewable residency permit for investors,
          entrepreneurs, and skilled professionals. Combined with the UAE's{" "}
          <strong>0% personal income tax</strong>, it offers a 10-year guaranteed tax-free window —
          typically saving <strong>$50K-$300K+ per year</strong> for high earners vs US/UK/EU.
        </p>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex gap-3">
        <Award className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="text-sm text-emerald-900">
          <strong>10 years × 0% = $0 tax</strong> on all personal income — including salary,
          freelance income, dividends, rental income, capital gains, and crypto. Only mandatory
          cost is <strong>VAT (5%)</strong> on purchases, plus 9% corporate tax if you run a business
          with profits above AED 375,000 (≈ $102K).
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            10-Year Tax Savings Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <GoldenVisaCalculator />
        </CardContent>
      </Card>

      {/* Eligibility */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Eligibility (2026)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                <DollarSign className="h-4 w-4" /> Investor route
              </h3>
              <ul className="mt-2 space-y-1 text-sm text-blue-900 list-disc list-inside">
                <li>Public investment: AED 2M+ in a UAE investment fund</li>
                <li>Real estate: AED 2M+ (must be retained for 2+ years)</li>
                <li>Business: AED 2M+ paid-up capital</li>
                <li>Property loan from approved bank: AED 2M+ approved</li>
              </ul>
            </div>
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <h3 className="font-semibold text-emerald-900 flex items-center gap-2">
                <Award className="h-4 w-4" /> Talent route (no investment)
              </h3>
              <ul className="mt-2 space-y-1 text-sm text-emerald-900 list-disc list-inside">
                <li>Skilled professionals with monthly salary AED 30K+ (~$98K/yr) + valid contract</li>
                <li>PhD graduates from top 500 universities</li>
                <li>Exceptional talents (scientists, doctors, engineers, athletes)</li>
                <li>Humanitarian pioneers</li>
              </ul>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-600">
            Golden Visa holders can sponsor spouse, unmarried children of any age, parents,
            and one personal domestic worker. Visa is renewable every 10 years.
          </p>
        </CardContent>
      </Card>

      {/* Tax benefits comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">What You Don't Pay (vs USA/UK/EU)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <TaxFree label="Personal income tax" detail="$0 — unlimited salary, dividends, etc." />
            <TaxFree label="Capital gains tax" detail="$0 — stocks, crypto, real estate gains" />
            <TaxFree label="Dividend tax" detail="$0 — keep 100% of qualified dividends" />
            <TaxFree label="Inheritance / estate tax" detail="$0 — pass to heirs tax-free" />
            <TaxFree label="Wealth tax" detail="$0 — no tax on net worth" />
            <TaxFree label="Foreign income reporting" detail="Not required — for non-resident visa only" />
            <TaxFree label="Crypto gains tax" detail="$0 — even on long-term BTC gains" />
            <TaxFree label="Rental income tax" detail="$0 — full net rental is yours" />
            <TaxFree label="Self-employment tax" detail="$0 — no 15.3% SS/Medicare equivalent" />
          </div>
          <p className="mt-4 text-xs text-slate-500">
            VAT (5%) applies to purchases in UAE. Excise tax on tobacco (100%), energy drinks
            (100%), carbonated drinks (50%), sugar-sweetened beverages (50%). Alcohol has variable
            excise based on emirate.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cost Comparison (Real Examples)</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="py-2">Scenario</th>
                <th className="py-2 text-right">USA (CA)</th>
                <th className="py-2 text-right">UK</th>
                <th className="py-2 text-right">UAE (Golden Visa)</th>
                <th className="py-2 text-right">10-year savings (UAE)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="py-2">$200K salary, single</td>
                <td className="py-2 text-right tabular-nums">$65K/yr</td>
                <td className="py-2 text-right tabular-nums">$72K/yr</td>
                <td className="py-2 text-right tabular-nums font-bold text-emerald-700">$0</td>
                <td className="py-2 text-right tabular-nums font-bold text-emerald-700">$685K</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2">$400K salary + RSUs</td>
                <td className="py-2 text-right tabular-nums">$160K/yr</td>
                <td className="py-2 text-right tabular-nums">$180K/yr</td>
                <td className="py-2 text-right tabular-nums font-bold text-emerald-700">$0</td>
                <td className="py-2 text-right tabular-nums font-bold text-emerald-700">$1.7M</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2">$1M crypto gains/year</td>
                <td className="py-2 text-right tabular-nums">$370K/yr</td>
                <td className="py-2 text-right tabular-nums">$280K/yr</td>
                <td className="py-2 text-right tabular-nums font-bold text-emerald-700">$0</td>
                <td className="py-2 text-right tabular-nums font-bold text-emerald-700">$3.7M</td>
              </tr>
              <tr>
                <td className="py-2">$300K dividends/yr</td>
                <td className="py-2 text-right tabular-nums">$70K/yr</td>
                <td className="py-2 text-right tabular-nums">$135K/yr</td>
                <td className="py-2 text-right tabular-nums font-bold text-emerald-700">$0</td>
                <td className="py-2 text-right tabular-nums font-bold text-emerald-700">$1.35M</td>
              </tr>
            </tbody>
          </table>
          <p className="mt-3 text-xs text-slate-500">
            US figures include federal + CA state + FICA. UK figures include income tax + NI.
            UAE: $0 personal tax. Sources: Tax Foundation, HMRC, and IRS publications.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-700">
          <details className="group rounded-lg border border-slate-200 p-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between font-semibold">
              Do I become a UAE citizen if I get Golden Visa?
              <span className="text-slate-400 transition group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 leading-relaxed">
              <strong>No.</strong> Golden Visa grants 10-year renewable residency, not citizenship.
              You keep your original passport and citizenship. Citizenship via naturalization
              is a separate, more restrictive process (introduced in 2021 but rarely granted).
              Most Golden Visa holders remain tax residents of their home country
              (depending on their home country's rules — most treat you as non-resident
              if you cut ties).
            </p>
          </details>

          <details className="group rounded-lg border border-slate-200 p-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between font-semibold">
              Does the UAE Golden Visa force me to give up my home country tax residency?
              <span className="text-slate-400 transition group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 leading-relaxed">
              It depends on your home country. <strong>US citizens</strong> are taxed on worldwide
              income regardless of residence — they keep filing US taxes with FEIE (see our{" "}
              <Link href="/usa/feie" className="text-blue-600 hover:underline">FEIE calculator</Link>).
              <strong> UK residents</strong> can use the Statutory Residence Test — if you cut UK
              ties (sell home, transfer family, etc.), you stop being UK tax resident after a
              full tax year abroad. Most other countries also have tie-breaker rules in their
              tax treaties with the UAE.
            </p>
          </details>

          <details className="group rounded-lg border border-slate-200 p-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between font-semibold">
              What happens if I leave UAE after a few years?
              <span className="text-slate-400 transition group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 leading-relaxed">
              Golden Visa is a residency permit, not a tax obligation. As long as you stay
              physically in UAE for 183+ days per year (or 90 days if you're employed by a UAE
              company), you're a UAE tax resident. If you leave, you stop being UAE tax resident
              from the day you leave. The 0% tax benefit applies only while you're a UAE
              resident.
            </p>
          </details>

          <details className="group rounded-lg border border-slate-200 p-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between font-semibold">
              Can I work remotely for a US/UK company on Golden Visa?
              <span className="text-slate-400 transition group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 leading-relaxed">
              <strong>Yes</strong> — the talent/professional category explicitly supports remote
              workers for foreign companies. Many digital nomads use Golden Visa + freelance/
              consulting structure to legally live in UAE while earning foreign income. For
              employees of a foreign company, you can either: (a) work as a freelancer with
              a UAE freelance permit, or (b) structure as a UAE consulting company with a
              trade license (subject to 9% corporate tax above AED 375K profit).
            </p>
          </details>

          <details className="group rounded-lg border border-slate-200 p-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between font-semibold">
              Can I get Golden Visa through the real estate route?
              <span className="text-slate-400 transition group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 leading-relaxed">
              <strong>Yes — AED 2M+ in property</strong> (off-plan or ready), retained for at least 2
              years. Property can be a single home or multiple units combined. Off-plan purchases
              from approved developers also qualify at 50% paid. Mortgage-backed purchases
              require bank approval of AED 2M+ loan. Note: the property itself isn't tax-free
              rental income if you rent it out — but you still owe 0% personal income tax.
            </p>
          </details>

          <details className="group rounded-lg border border-slate-200 p-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between font-semibold">
              How long does Golden Visa processing take?
              <span className="text-slate-400 transition group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 leading-relaxed">
              Typically <strong>2-4 weeks</strong> for the talent category (with valid employment
              contract), <strong>4-8 weeks</strong> for the investor category (after the AED 2M
              investment is verified). Real estate Golden Visa is fastest for off-plan purchases
              with developer attestation. Premium processing available via GDRFA in each emirate
              for additional fees (AED 1,500-3,000).
            </p>
          </details>

          <details className="group rounded-lg border border-slate-200 p-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between font-semibold">
              What about the 9% UAE corporate tax?
              <span className="text-slate-400 transition group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 leading-relaxed">
              Introduced June 2023. Applies to businesses with profits above AED 375,000
              (≈ $102K). Does NOT apply to personal salary, dividends, or capital gains.
              Most employee-only Golden Visa holders aren't affected. Freelancers can stay below
              AED 375K by careful invoicing or use a free zone structure (Qualifying Free Zone
              Persons get a 0% corporate rate on qualifying income up to AED 3.18M).
            </p>
          </details>

          <details className="group rounded-lg border border-slate-200 p-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between font-semibold">
              How does Golden Visa compare to other expat tax havens?
              <span className="text-slate-400 transition group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 leading-relaxed">
              UAE Golden Visa is unique because:
              <br />• <strong>10-year guaranteed</strong> (vs 1-2 years for most Caribbean
              programs)
              <br />• <strong>$0 personal tax on everything</strong> (vs Panama's territorial
              tax, Cyprus's dividend tax, Portugal's NHR 20% on Portuguese-source income)
              <br />• <strong>Major global hub</strong> with world-class infrastructure (vs Caribbean
              tax havens with limited banking/connectivity)
              <br />• <strong>No global income test</strong> (you can keep earning from US/EU)
              <br />
              Trade-off: hot summers (May-Sept 45°C+), cultural adjustment, far from Europe/US.
            </p>
          </details>
        </CardContent>
      </Card>

      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-6 flex items-start gap-3 text-sm text-amber-900">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong>Estimate only — not immigration or tax advice.</strong> Eligibility criteria,
            investment requirements, and tax implications change frequently. Always confirm
            with:
            <br />• <a href="https://u.ae/en/information-and-services/visa-and-emirates-id/golden-visa" className="underline" target="_blank" rel="noopener noreferrer">u.ae (Official UAE Government)</a>
            <br />• <a href="https://www.federaltaxauthority.gov.ae" className="underline" target="_blank" rel="noopener noreferrer">Federal Tax Authority</a>
            <br />• An UAE immigration consultant or specialist tax advisor (typically AED 5,000-15,000 for application)
          </div>
        </CardContent>
      </Card>

      <div className="text-sm text-slate-700">
        <h3 className="font-semibold mb-2">Related</h3>
        <ul className="space-y-1 text-blue-700">
          <li><Link href="/countries/uae" className="hover:underline">→ UAE tax calculator (no Golden Visa specifics)</Link></li>
          <li><Link href="/compare/uae-vs-usa" className="hover:underline">→ UAE vs USA tax comparison</Link></li>
          <li><Link href="/compare/uae-vs-uk" className="hover:underline">→ UAE vs UK tax comparison</Link></li>
          <li><Link href="/usa/feie" className="hover:underline">→ US FEIE for expats still earning US-sourced income</Link></li>
        </ul>
      </div>
    </div>
  );
}

function TaxFree({ label, detail }: { label: string; detail: string }) {
  return (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-3">
      <div className="flex items-start gap-2">
        <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
        <div>
          <div className="font-medium text-emerald-900">{label}</div>
          <div className="text-xs text-emerald-700 mt-0.5">{detail}</div>
        </div>
      </div>
    </div>
  );
}