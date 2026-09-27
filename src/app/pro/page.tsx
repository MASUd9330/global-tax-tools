import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Zap, Crown, Users, ArrowRight, Mail } from "lucide-react";
import { PLAN_PRICING } from "@/lib/api/pro-keys";
import { CopyButton } from "@/components/CopyButton";

export const metadata: Metadata = {
  title: "Pro Plans — Higher API Limits + Embed Without Attribution",
  description:
    "Upgrade to Pro for 1,000+ API requests/minute, unlimited AI explanations, embed without attribution, and historical data export.",
};

export const dynamic = "force-dynamic";

const BINANCE_PAY_ID = process.env.NEXT_PUBLIC_BINANCE_PAY_ID || "Set in admin (see PRO_BINANCE_PAY_ID env var)";
const USDT_TRC20_ADDRESS = process.env.NEXT_PUBLIC_USDT_ADDRESS || "Set in admin (see PRO_USDT_ADDRESS env var)";
const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "pro@taxrank.io";

export default function ProPage() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center pt-4">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
          <Crown className="h-3 w-3" /> Pro Plans
        </div>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Higher limits. <span className="bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">Pro features.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
          Built for businesses that hit our free tier limits. Pay with Binance Pay or USDT — no Stripe, no card required.
        </p>
      </section>

      {/* Pricing tiers */}
      <section>
        <div className="grid gap-6 md:grid-cols-3">
          <PricingCard
            tier="free"
            icon={<Zap className="h-5 w-5" />}
            accent="border-slate-200"
            iconBg="bg-slate-100 text-slate-600"
            cta={{ label: "Current plan", href: "/", disabled: true }}
          />
          <PricingCard
            tier="pro"
            icon={<Crown className="h-5 w-5" />}
            accent="border-amber-300 ring-2 ring-amber-200"
            iconBg="bg-amber-100 text-amber-700"
            badge="Most popular"
            cta={{ label: "Get Pro →", href: "#pay" }}
          />
          <PricingCard
            tier="team"
            icon={<Users className="h-5 w-5" />}
            accent="border-purple-200"
            iconBg="bg-purple-100 text-purple-700"
            cta={{ label: "Get Team →", href: "#pay" }}
          />
        </div>
      </section>

      {/* Payment methods */}
      <section id="pay" className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">How to pay</h2>
          <p className="mt-1 text-sm text-slate-600">
            Send the equivalent of your plan price in USDT or via Binance Pay. Send the transaction ID to <strong>{SUPPORT_EMAIL}</strong> within 24h and we'll activate your key.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Binance Pay */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <div className="rounded-lg bg-yellow-100 p-1.5">
                  <span className="text-yellow-700 text-xs font-bold">B</span>
                </div>
                Binance Pay
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-slate-600">
                Fastest — pay directly from your Binance app. Free transaction fees.
              </p>
              <div className="space-y-1">
                <Label>Binance Pay ID</Label>
                <CopyField value={BINANCE_PAY_ID} />
              </div>
              <ol className="text-xs text-slate-600 space-y-1 list-decimal list-inside">
                <li>Open Binance app → Pay → Send to Binance Pay ID</li>
                <li>Enter amount (USD equivalent)</li>
                <li>Email transaction ID to {SUPPORT_EMAIL}</li>
              </ol>
            </CardContent>
          </Card>

          {/* USDT */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <div className="rounded-lg bg-green-100 p-1.5">
                  <span className="text-green-700 text-xs font-bold">₮</span>
                </div>
                USDT (TRC-20)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-slate-600">
                Send USDT on the TRON network (TRC-20) — lowest fees (~ $1/tx).
              </p>
              <div className="space-y-1">
                <Label>Wallet address</Label>
                <CopyField value={USDT_TRC20_ADDRESS} />
              </div>
              <ol className="text-xs text-slate-600 space-y-1 list-decimal list-inside">
                <li>Open your wallet (Binance, Trust, TronLink)</li>
                <li>Send USDT via TRC-20 to the address above</li>
                <li>Email the TX hash to {SUPPORT_EMAIL}</li>
              </ol>
            </CardContent>
          </Card>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700 space-y-2">
          <p className="font-semibold text-slate-900 flex items-center gap-2">
            <Mail className="h-4 w-4" /> After payment
          </p>
          <p>
            Send your transaction ID + the email you'd like the API key issued to:
            <a href={`mailto:${SUPPORT_EMAIL}?subject=TaxRank Pro Activation`} className="ml-1.5 inline-flex items-center gap-1 font-medium text-blue-600 hover:underline">
              {SUPPORT_EMAIL} <ArrowRight className="h-3 w-3" />
            </a>
          </p>
          <p className="text-xs text-slate-500">
            Activation is usually within 2 hours. For urgent requests, message us on Twitter/LinkedIn.
          </p>
        </div>
      </section>

      {/* Pro perks comparison */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">What's included</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Perk
                title="Higher API limits"
                description="1,000 requests/minute (Pro) or 5,000/min (Team) vs 60/min on free."
              />
              <Perk
                title="Embed without attribution"
                description="Drop the calculator on your site without a 'Powered by TaxRank' link."
              />
              <Perk
                title="Historical data export"
                description="Bulk-export 2024-2025 comparison data as CSV — useful for analysts."
              />
              <Perk
                title="Priority support"
                description="24h reply (Pro) or 4h reply (Team) on integration questions."
              />
              <Perk
                title="Slack / Telegram webhooks"
                description="(Team) Get alerted when our source monitor detects tax-bracket changes in jurisdictions you care about."
              />
              <Perk
                title="White-label embed"
                description="(Team) Remove our branding and use your own colors + logo on the widget."
              />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">FAQ</h2>
        <div className="space-y-3">
          <FAQ
            q="Why Binance / USDT only? Why no Stripe / cards?"
            a="We keep fees low for our customers. Stripe charges 2.9% + 30¢ per transaction. Binance Pay and USDT-TRC20 are essentially free for both sides, which lets us keep Pro pricing at $9/month instead of $15+. If you really need card billing, contact us — we can do it case-by-case."
          />
          <FAQ
            q="Can I cancel anytime?"
            a="Yes. Pro keys are non-expiring by default — you pay once and use forever. If you want monthly billing instead of lifetime, ask us."
          />
          <FAQ
            q="Is this tax-deductible?"
            a="Generally yes for businesses using the API commercially. Check with your accountant."
          />
          <FAQ
            q="What about refunds?"
            a="7-day money-back guarantee on Pro and Team plans if the API doesn't work for your use case."
          />
        </div>
      </section>

      {/* CTA back to free */}
      <section className="text-center text-sm text-slate-500">
        Not sure?{" "}
        <Link href="/" className="text-blue-600 hover:underline">
          Use the free tools first
        </Link>{" "}
        — they handle 95% of common tax questions.
      </section>
    </div>
  );
}

function PricingCard({
  tier,
  icon,
  accent,
  iconBg,
  badge,
  cta,
}: {
  tier: "free" | "pro" | "team";
  icon: React.ReactNode;
  accent: string;
  iconBg: string;
  badge?: string;
  cta: { label: string; href: string; disabled?: boolean };
}) {
  const p = PLAN_PRICING[tier];
  const isFree = tier === "free";
  return (
    <Card className={`relative ${accent} ${tier === "pro" ? "shadow-xl" : ""}`}>
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 text-xs font-semibold text-white shadow">
          {badge}
        </div>
      )}
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className={`rounded-lg p-2 ${iconBg}`}>{icon}</div>
          <CardTitle className="capitalize">{tier}</CardTitle>
        </div>
        <div className="mt-4">
          <span className="text-4xl font-bold text-slate-900">${p.usd}</span>
          {!isFree && <span className="text-slate-500 text-sm">/mo or ${p.yearly}/yr</span>}
          {isFree && <span className="text-slate-500 text-sm">/forever</span>}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2 text-sm text-slate-700">
          {p.features.map((f) => (
            <li key={f} className="flex items-start gap-2">
              <Check className="h-4 w-4 mt-0.5 text-emerald-500 shrink-0" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
        {cta.disabled ? (
          <button disabled className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-500 cursor-not-allowed">
            {cta.label}
          </button>
        ) : (
          <a
            href={cta.href}
            className={`block w-full rounded-lg px-4 py-2 text-center text-sm font-medium transition-colors ${
              tier === "pro"
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
                : "bg-slate-900 text-white hover:bg-slate-800"
            }`}
          >
            {cta.label}
          </a>
        )}
      </CardContent>
    </Card>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-xs font-medium uppercase tracking-wide text-slate-500">{children}</label>;
}

function CopyField({ value }: { value: string }) {
  return (
    <div className="flex items-stretch gap-2">
      <code className="flex-1 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-800 break-all">
        {value}
      </code>
      <CopyButton value={value} />
    </div>
  );
}

function Perk({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex gap-3">
      <div className="shrink-0 rounded-md bg-emerald-100 p-1.5 h-fit">
        <Check className="h-4 w-4 text-emerald-700" />
      </div>
      <div>
        <h3 className="font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-600">{description}</p>
      </div>
    </div>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  return (
    <details className="group rounded-lg border border-slate-200 bg-white p-4 [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer items-center justify-between font-semibold text-slate-900">
        {q}
        <span className="text-slate-400 transition group-open:rotate-180">▾</span>
      </summary>
      <p className="mt-3 text-sm text-slate-700 leading-relaxed">{a}</p>
    </details>
  );
}