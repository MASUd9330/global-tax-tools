import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BracketVisualization } from "@/components/BracketVisualization";
import { TaxFreedomDay } from "@/components/TaxFreedomDay";
import { ThirtyPercentCalculator } from "@/components/ThirtyPercentCalculator";
import { ChevronRight, BookOpen, AlertTriangle } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Netherlands 30% Ruling Calculator 2026 | €80K Saves €11,880 Tax",
  description:
    "Calculate how the Netherlands 30% ruling lets expats receive 30% of salary tax-free. 2026 brackets + 2027 drop to 27%.",
};

export const dynamic = "force-dynamic";

export default function ThirtyPercentRulingPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-slate-500">
        <Link href="/" className="hover:text-slate-700">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/countries/netherlands" className="hover:text-slate-700">Netherlands</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-slate-900">30% Ruling</span>
      </nav>

      {/* Hero */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
          Special scenario · Expat tax
        </div>
        <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
          Netherlands 30% Ruling Calculator
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          The <strong>30% ruling</strong> is a Dutch tax facility that lets qualifying expats receive
          <strong> 30% of their salary tax-free</strong> for up to 5 years. With high Dutch tax rates
          (37-49.5%), the savings are substantial — typically €10K-€20K/year on a senior expat salary.
        </p>
      </div>

      {/* KEY INSIGHT callout */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
        <BookOpen className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-900">
          <strong>2026 vs 2027:</strong> The 30% ruling drops to <strong>27%</strong> in 2027 (already legislated).
          Planning to move? 2026 is the last year to lock in the higher rate. Apply within 4 months of arrival.
        </div>
      </div>

      {/* Calculator + Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your 30% Ruling Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <ThirtyPercentCalculator />
        </CardContent>
      </Card>

      {/* Eligibility */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Eligibility Checklist (2026)</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm text-slate-700">
            <li>
              <strong>Salary threshold:</strong> €48,013/year minimum (gross, before 30% ruling).
              Reduced threshold of €36,497 for under-30s with a master's degree or PhD.
            </li>
            <li>
              <strong>150km rule:</strong> You must have lived <strong>more than 150 km from the Dutch border</strong> for
              at least 16 of the last 24 months before moving to NL.
              (Lifted for scientific researchers.)
            </li>
            <li>
              <strong>Recruitment from abroad:</strong> You must be hired from outside the Netherlands, OR
              moved to NL from abroad and within 12 months took a new role with a different employer.
            </li>
            <li>
              <strong>Salary cap (Balkenende norm):</strong> The 30%-tax-free allowance caps at 30% of
              <strong> €262,000</strong> (2026). Salary above this is fully taxable.
              (Not applicable to scientific researchers.)
            </li>
            <li>
              <strong>5-year limit:</strong> Maximum duration is 5 years (60 months) total, can be split.
            </li>
            <li>
              <strong>Application deadline:</strong> Within <strong>4 months</strong> of starting Dutch employment,
              otherwise the benefit is lost for that period.
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Before vs After */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Before vs After 30% Ruling (worked example)</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-700 space-y-2">
          <p><strong>Example:</strong> Senior software engineer, €80,000 salary, single filer, 2026.</p>
          <table className="w-full text-sm mt-3">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="py-2">Item</th>
                <th className="py-2 text-right">Without 30% ruling</th>
                <th className="py-2 text-right">With 30% ruling</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="py-2">Taxable income</td>
                <td className="py-2 text-right tabular-nums">€80,000</td>
                <td className="py-2 text-right tabular-nums text-emerald-700">€56,000</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2">Income tax owed</td>
                <td className="py-2 text-right tabular-nums text-rose-700">€19,038</td>
                <td className="py-2 text-right tabular-nums text-emerald-700">€7,158</td>
              </tr>
              <tr className="border-b border-slate-100 font-semibold">
                <td className="py-2">Annual savings</td>
                <td className="py-2 text-right tabular-nums">—</td>
                <td className="py-2 text-right tabular-nums text-emerald-700">€11,880</td>
              </tr>
              <tr className="text-xs text-slate-500">
                <td className="py-2">5-year total (compounding)</td>
                <td className="py-2 text-right tabular-nums">—</td>
                <td className="py-2 text-right tabular-nums">~€59K saved</td>
              </tr>
            </tbody>
          </table>
          <p className="text-xs text-slate-500 pt-2">
            Numbers from the calculator above (uses NL 2026 brackets with €48K payroll credit per year,
            not the full €56K reduction — actual values vary).
          </p>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-700">
          <details className="group rounded-lg border border-slate-200 p-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between font-semibold">
              What is the 150km rule for the 30% ruling?
              <span className="text-slate-400 transition group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 leading-relaxed">
              You must have lived more than 150 km from the Dutch border for at least 16 of the last 24 months
              before starting Dutch employment. This excludes people who already lived in NL or nearby countries
              (Belgium, Germany west of Aachen). Exception: scientific researchers and doctors in training.
            </p>
          </details>

          <details className="group rounded-lg border border-slate-200 p-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between font-semibold">
              What salary do I need for the 30% ruling?
              <span className="text-slate-400 transition group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 leading-relaxed">
              <strong>€48,013/year</strong> gross minimum (2026). For under-30s with a master's degree or PhD,
              the threshold is €36,497. Your salary is "gross" — meaning before the 30%-tax-free portion is
              applied. So €68,590 gross is enough that €48,013 remains after the €20,577 tax-free amount.
            </p>
          </details>

          <details className="group rounded-lg border border-slate-200 p-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between font-semibold">
              What is the Balkenende norm (salary cap)?
              <span className="text-slate-400 transition group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 leading-relaxed">
              The 30%-tax-free allowance caps at 30% of <strong>€262,000</strong> (2026 norm). Salary above this
              is fully taxable at normal rates. So someone earning €400K gets €78.6K tax-free (30% of 262K),
              not €120K (30% of 400K). Scientific researchers are exempt from this cap.
            </p>
          </details>

          <details className="group rounded-lg border border-slate-200 p-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between font-semibold">
              When does the 30% ruling drop to 27%?
              <span className="text-slate-400 transition group-open:rotate-180">▾</span>
          </summary>
            <p className="mt-3 leading-relaxed">
              The drop from 30% to 27% takes effect <strong>January 1, 2027</strong>. If you start Dutch
              employment in 2026 and apply within 4 months, your 5-year ruling period stays at 30% (you
              can switch employers during the 5 years without losing it). Maximum 5 years regardless.
            </p>
          </details>

          <details className="group rounded-lg border border-slate-200 p-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between font-semibold">
              Can I switch employers and keep the 30% ruling?
              <span className="text-slate-400 transition group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 leading-relaxed">
              <strong>Yes.</strong> The 30% ruling follows you, not your employer — but only within the
              first 5 years total. Each job change requires re-apply (Belastingdienst will typically
              approve), and if you have a gap of more than 3 months between jobs, the clock pauses.
            </p>
          </details>

          <details className="group rounded-lg border border-slate-200 p-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between font-semibold">
              What if I take a partial month off or get sick?
              <span className="text-slate-400 transition group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 leading-relaxed">
              The 5-year period can be paused for certain "non-active" periods (sick leave, pregnancy,
              unpaid leave). You need to formally request this from the Belastingdienst.
              Vacation/holiday is normal — doesn't pause.
            </p>
          </details>

          <details className="group rounded-lg border border-slate-200 p-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between font-semibold">
              Does the 30% ruling work in conjunction with the 40% ruling?
              <span className="text-slate-400 transition group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 leading-relaxed">
              They're mutually exclusive — pick whichever is better. The 40% ruling (former)
              was for highly-skilled migrants under specific conditions. As of 2024 the 40% ruling only
              applies to specific pension-funded arrangements and is rare. Most expats use 30%.
            </p>
          </details>

          <details className="group rounded-lg border border-slate-200 p-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between font-semibold">
              Does the 30% ruling affect my pension contributions?
              <span className="text-slate-400 transition group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 leading-relaxed">
              <strong>Yes, slightly.</strong> The 30%-tax-free portion is excluded from the AOW (state pension)
              base, but you can make voluntary AOW equivalents. Your occupational pension accrual is
              typically based on full gross salary (some pension schemes need adjustment).
              Consult a pension advisor.
            </p>
          </details>
        </CardContent>
      </Card>

      {/* Disclaimer + related */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-6 flex items-start gap-3 text-sm text-amber-900">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong>Estimate only.</strong> Actual outcomes depend on your complete situation —
            partner income, Dutch social security (AOW/WW/WIA) coverage, immigration type,
            partial-year employment, and Dutch-US tax treaty interplay. Always confirm with a Dutch
            tax advisor (e.g. via <a href="https://www.belastingdienst.nl" className="underline">Belastingdienst</a>{" "}
            or a specialist firm).
          </div>
        </CardContent>
      </Card>

      <div className="text-sm text-slate-700">
        <h3 className="font-semibold mb-2">Related</h3>
        <ul className="space-y-1 text-blue-700">
          <li><Link href="/countries/netherlands" className="hover:underline">→ Netherlands tax calculator (no ruling)</Link></li>
          <li><Link href="/compare/netherlands-vs-usa" className="hover:underline">→ Netherlands vs USA tax comparison</Link></li>
          <li><Link href="/compare/netherlands-vs-belgium" className="hover:underline">→ Netherlands vs Belgium tax comparison</Link></li>
          <li><Link href="/compare/netherlands-vs-uk" className="hover:underline">→ Netherlands vs UK tax comparison</Link></li>
        </ul>
      </div>
    </div>
  );
}