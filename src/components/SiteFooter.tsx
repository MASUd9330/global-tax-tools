import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h4 className="text-sm font-semibold text-slate-900">TaxRank</h4>
            <p className="mt-2 text-sm text-slate-600">
              Free global tax & salary calculator. Source-cited estimates, no signup.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">Calculators</h4>
            <ul className="mt-2 space-y-1 text-sm text-slate-600">
              <li><Link href="/tools/tax-calculator/" className="hover:text-slate-900">Income Tax</Link></li>
              <li><Link href="/tools/salary-calculator/" className="hover:text-slate-900">Salary (take-home)</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">Countries</h4>
            <ul className="mt-2 space-y-1 text-sm text-slate-600">
              <li><Link href="/countries/usa/" className="hover:text-slate-900">United States</Link></li>
              <li><Link href="/countries/uk/" className="hover:text-slate-900">United Kingdom</Link></li>
              <li><Link href="/countries/germany/" className="hover:text-slate-900">Germany</Link></li>
              <li><Link href="/countries/france/" className="hover:text-slate-900">France</Link></li>
              <li><Link href="/countries/canada/" className="hover:text-slate-900">Canada</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">Trust</h4>
            <ul className="mt-2 space-y-1 text-sm text-slate-600">
              <li><Link href="/methodology/" className="hover:text-slate-900">Methodology</Link></li>
              <li><Link href="/about/" className="hover:text-slate-900">About</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-200 pt-6 text-xs text-slate-500">
          © {new Date().getFullYear()} TaxRank. Estimates only — not tax advice. Always confirm with a local professional.
        </div>
      </div>
    </footer>
  );
}