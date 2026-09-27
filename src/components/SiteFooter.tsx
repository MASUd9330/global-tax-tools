import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer mt-24 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-5">
          <div className="md:col-span-2">
            <h4 className="text-sm font-semibold text-slate-900">TaxRank</h4>
            <p className="mt-2 text-sm text-slate-600 max-w-xs">
              Free global tax & salary calculator. Source-cited estimates, no signup, no ads.
              Built for expats, remote workers, and job-offer evaluators.
            </p>
            <p className="mt-3 text-xs text-slate-500">
              Always confirm with a local tax professional before filing.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Calculators</h4>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
              <li><Link href="/tools/tax-calculator/" className="hover:text-blue-600">Income Tax</Link></li>
              <li><Link href="/tools/salary-calculator/" className="hover:text-blue-600">Salary (take-home)</Link></li>
              <li><Link href="/tools/scenario-builder/" className="hover:text-blue-600">Scenario Builder</Link></li>
              <li><Link href="/tools/historical-trends/" className="hover:text-blue-600">Historical Trends</Link></li>
              <li><Link href="/compare/" className="hover:text-blue-600">Compare Countries</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Popular</h4>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
              <li><Link href="/countries/usa/" className="hover:text-blue-600">United States</Link></li>
              <li><Link href="/countries/uk/" className="hover:text-blue-600">United Kingdom</Link></li>
              <li><Link href="/countries/germany/" className="hover:text-blue-600">Germany</Link></li>
              <li><Link href="/countries/uae/" className="hover:text-blue-600">UAE (no tax)</Link></li>
              <li><Link href="/countries/singapore/" className="hover:text-blue-600">Singapore</Link></li>
              <li><Link href="/compare/usa-vs-uk/" className="hover:text-blue-600">USA vs UK</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">For developers</h4>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
              <li><Link href="/embed/" className="hover:text-blue-600">Embed widget</Link></li>
              <li><Link href="/api/countries/" className="hover:text-blue-600">API · Countries</Link></li>
              <li><Link href="/api/calculate/tax/" className="hover:text-blue-600">API · Tax calc</Link></li>
              <li><Link href="/methodology/" className="hover:text-blue-600">Methodology</Link></li>
              <li><Link href="/about/" className="hover:text-blue-600">About</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} TaxRank. Estimates only — not tax advice.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/methodology/" className="hover:text-slate-700">Methodology</Link>
            <span>·</span>
            <Link href="/about/" className="hover:text-slate-700">About</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}