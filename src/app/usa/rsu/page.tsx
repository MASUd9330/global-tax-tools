import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Briefcase, AlertTriangle, BookOpen, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RsuCalculator } from "@/components/RsuCalculator";

export const metadata: Metadata = {
  title: "USA RSU Tax Calculator 2026 | Restricted Stock Unit Tax Strategy",
  description:
    "Calculate federal + state income tax on RSU vesting. Compare strategies: sell-to-cover vs. cash exercise, AMT impact, and how RSUs interact with brackets.",
};

export const dynamic = "force-dynamic";

export default function RsuPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <nav className="flex items-center gap-1 text-sm text-slate-500">
        <Link href="/" className="hover:text-slate-700">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/countries/usa" className="hover:text-slate-700">USA</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-slate-900">RSU Tax</span>
      </nav>

      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
          Special scenario · US employee equity
        </div>
        <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
          USA RSU Tax Calculator
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          Restricted Stock Units (RSUs) are taxed as <strong>ordinary income</strong> at vesting —
          the full vesting value is added to your W-2 and taxed at your marginal rate.
          For high earners, RSUs can push you into top brackets and trigger AMT exposure.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <BookOpen className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900">
          <strong>How RSU tax works:</strong> On the vesting date, your shares are valued at
          fair market value (FMV). That FMV is treated as <strong>supplemental wages</strong> and
          typically taxed at the 22% federal supplemental rate (or 37% if year-to-date income
          exceeds $1M). State tax applies on top. Capital gains treatment only applies to
          <em> appreciation after vesting </em>
          — if you sell later at a higher price, the gain is capital gains.
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            RSU Vesting Tax Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RsuCalculator />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Key Concepts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-700">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-4">
            <h3 className="font-semibold text-emerald-900">Vesting = Taxable Event</h3>
            <p className="mt-1">
              The day your RSUs vest, the FMV becomes <strong>ordinary income</strong> — taxed at
              your marginal rate. This is the same as receiving a bonus. There's no 83(b) election
              available for RSUs (that's only for restricted stock grants).
            </p>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50/40 p-4">
            <h3 className="font-semibold text-blue-900">Sell-to-Cover (Default)</h3>
            <p className="mt-1">
              Most companies automatically sell ~22-37% of vested shares to cover taxes. You
              get the rest as net shares. No cash outflow — but you owe the remaining tax
              at year-end. This is the safest default for most employees.
            </p>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50/40 p-4">
            <h3 className="font-semibold text-amber-900">Cash exercise / Sell all</h3>
            <p className="mt-1">
              If you have cash outside the RSU to cover taxes, you can sell 100% and avoid
              concentration risk. Often recommended when:
              <br />• Single stock above 10-20% of net worth
              <br />• Insiders approaching blackout windows
              <br />• You have diversified equity elsewhere
            </p>
          </div>

          <div className="rounded-lg border border-purple-200 bg-purple-50/40 p-4">
            <h3 className="font-semibold text-purple-900">Capital gains on post-vesting appreciation</h3>
            <p className="mt-1">
              Once RSUs vest and become "held," any future gain is long-term capital gains
              (15-20% federal) if held &gt;1 year from vest. For Apple/Google/Microsoft, post-vest
              gains often dwarf the original RSU value — proper holding period can save 6-figures
              over a decade.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-700">
          <details className="group rounded-lg border border-slate-200 p-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between font-semibold">
              How are RSUs taxed the year they vest?
              <span className="text-slate-400 transition group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 leading-relaxed">
              The FMV on vest date is added to your W-2 wages. Federal income tax withheld at the
              supplemental rate (22% if YTD wages &lt; $1M, 37% above). Your year-end
              tax return reconciles to your actual marginal rate. If RSU vest pushes you into
              a higher bracket, you may owe more at tax time — many people underestimate this.
            </p>
          </details>

          <details className="group rounded-lg border border-slate-200 p-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between font-semibold">
              Can I do an 83(b) election on RSUs to escape the vest-date tax?
              <span className="text-slate-400 transition group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 leading-relaxed">
              <strong>No.</strong> 83(b) elections are only for restricted stock grants (actual
              shares with vesting conditions). RSUs settle as actual shares on vest, with no
              early-exercise option. So you can't elect 83(b) on RSUs. ESOPs and stock options
              with exercise prices ARE eligible for 83(b).
            </p>
          </details>

          <details className="group rounded-lg border border-slate-200 p-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between font-semibold">
              What if my RSUs vest while I'm living abroad?
              <span className="text-slate-400 transition group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 leading-relaxed">
              Two scenarios: <br />
              <strong>(1) Still on US payroll:</strong> RSUs are still US-source income, fully
              taxable in the US. <br />
              <strong>(2) On local-country payroll (rare):</strong> Sometimes companies "swap"
              your US RSU for a local cash bonus or local equity plan. In that case it's taxed
              only in the local country (and US via FEIE — see our{" "}
              <Link href="/usa/feie" className="text-blue-600 hover:underline">FEIE calculator</Link>).
              Confirm with your HR/finance team before leaving.
            </p>
          </details>

          <details className="group rounded-lg border border-slate-200 p-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between font-semibold">
              Can I owe AMT on RSU vesting?
              <span className="text-slate-400 transition group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 leading-relaxed">
              Rarely on RSU vesting itself (no preference item), but if you have AMT exposure
              from ISOs (incentive stock options) holding <em>and</em> large RSU vest in the same
              year, the combined picture can trigger AMT. Use Form 6251 to calculate. Most
              pure-RSU employees won't owe AMT unless their income exceeds ~$700K single /
              $1M MFJ.
            </p>
          </details>

          <details className="group rounded-lg border border-slate-200 p-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between font-semibold">
              Do RSUs count toward Social Security / Medicare?
              <span className="text-slate-400 transition group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 leading-relaxed">
              <strong>Yes — supplemental wages</strong> are subject to FICA (Social Security 6.2%
              up to wage base, Medicare 1.45% no cap, plus 0.9% Additional Medicare Tax above $200K).
              Your employer withholds these automatically. So an RSU vest isn't just income tax
              — it's also a ~7.65% payroll tax bite.
            </p>
          </details>

          <details className="group rounded-lg border border-slate-200 p-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between font-semibold">
              When should I sell RSU shares vs. hold for long-term gains?
              <span className="text-slate-400 transition group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 leading-relaxed">
              The "right" answer depends on your concentration risk, tax bracket, and beliefs
              about the stock. Rules of thumb:
              <br />• <strong>Sell some at vest</strong> to cover taxes + reduce concentration
              <br />• <strong>Hold rest &gt;1 year</strong> for long-term capital gains (15-20% vs 32-37%)
              <br />• <strong>Diversify</strong> into index funds once single stock exceeds 10-15% of net worth
              <br />
              Most US financial planners recommend keeping at most 20-30% of equity in employer stock.
            </p>
          </details>

          <details className="group rounded-lg border border-slate-200 p-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between font-semibold">
              How do RSUs interact with my tax bracket?
              <span className="text-slate-400 transition group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 leading-relaxed">
              <strong>Watch out for "bracket creep."</strong> A $200K RSU vest pushes your year-to-date
              income up by $200K — potentially moving you from 24% to 32% to 35% federal bracket.
              If you have multiple vest events in the same year (e.g. quarterly), the last vest
              could push ALL the YTD income into the top bracket.
              <br />
              <strong>Strategy:</strong> sell-to-cover early in the year if possible to avoid
              concentration; or use 83(b) on ISOs to spread income across years (not applicable
              to RSUs but adjacent).
            </p>
          </details>
        </CardContent>
      </Card>

      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-6 flex items-start gap-3 text-sm text-amber-900">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong>Estimate only — not tax or financial advice.</strong> RSU taxation depends on
            your specific situation — state of residence, other income, filing status,
            AMT exposure, and your employer's withholding policy. Consult a CPA before
            making major decisions. Most companies offer free tax consultations with their
            RSU admin (e.g. E*TRADE, Fidelity, Morgan Stanley) — use them.
          </div>
        </CardContent>
      </Card>

      <div className="text-sm text-slate-700">
        <h3 className="font-semibold mb-2">Related</h3>
        <ul className="space-y-1 text-blue-700">
          <li><Link href="/countries/usa" className="hover:underline">→ USA tax calculator (base salary)</Link></li>
          <li><Link href="/usa/feie" className="hover:underline">→ US FEIE for expats</Link></li>
          <li><Link href="/embed/US?income=300000" className="hover:underline">→ Embed USA calculator</Link></li>
        </ul>
      </div>
    </div>
  );
}