import Link from "next/link";
import { Calculator, ChevronDown } from "lucide-react";

const TOOLS = [
  { href: "/tools/tax-calculator/", label: "Income Tax" },
  { href: "/tools/salary-calculator/", label: "Salary" },
  { href: "/tools/scenario-builder/", label: "Scenario Builder" },
  { href: "/tools/historical-trends/", label: "Historical Trends" },
  { href: "/compare/", label: "Compare Countries" },
  { href: "/embed/", label: "Embed Widget" },
];

export function SiteHeader() {
  return (
    <header className="site-header sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
          <Calculator className="h-5 w-5 text-blue-600" />
          <span>TaxRank</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1 text-sm text-slate-600">
          {/* Tools dropdown */}
          <div className="group relative">
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-md px-3 py-2 hover:bg-slate-100 hover:text-slate-900"
            >
              Tools <ChevronDown className="h-3 w-3" />
            </button>
            <div className="invisible absolute left-0 top-full z-20 mt-1 w-56 rounded-lg border border-slate-200 bg-white p-1 shadow-lg opacity-0 transition-all group-hover:visible group-hover:opacity-100">
              {TOOLS.map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className="block rounded-md px-3 py-2 text-sm hover:bg-blue-50 hover:text-blue-900"
                >
                  {t.label}
                </Link>
              ))}
            </div>
          </div>
          <Link href="/countries/" className="rounded-md px-3 py-2 hover:bg-slate-100 hover:text-slate-900">
            Countries
          </Link>
          <Link href="/about/" className="rounded-md px-3 py-2 hover:bg-slate-100 hover:text-slate-900">
            About
          </Link>
          <Link
            href="/embed/"
            className="ml-2 inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Embed
          </Link>
        </nav>
        {/* Mobile menu — collapsed, just essential links */}
        <nav className="flex md:hidden items-center gap-3 text-sm text-slate-600">
          <Link href="/countries/" className="hover:text-slate-900">Countries</Link>
          <Link href="/tools/tax-calculator/" className="hover:text-slate-900">Calculator</Link>
        </nav>
      </div>
    </header>
  );
}