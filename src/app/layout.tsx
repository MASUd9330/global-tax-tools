import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "TaxRank — Free Global Tax & Salary Calculator",
    template: "%s · TaxRank",
  },
  description:
    "Free, source-cited income tax and salary calculators for USA, UK, Germany, France, Canada. Up-to-date 2025 brackets. No signup, no ads.",
  openGraph: {
    type: "website",
    siteName: "TaxRank",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <SiteHeader />
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}