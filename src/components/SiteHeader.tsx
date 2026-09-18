import Link from "next/link";
import { Calculator } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
          <Calculator className="h-5 w-5 text-blue-600" />
          <span>TaxRank</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
          <Link href="/tools/tax-calculator/" className="hover:text-slate-900">Tax Calculator</Link>
          <Link href="/tools/salary-calculator/" className="hover:text-slate-900">Salary</Link>
          <Link href="/countries/" className="hover:text-slate-900">Countries</Link>
          <Link href="/about/" className="hover:text-slate-900">About</Link>
        </nav>
      </div>
    </header>
  );
}