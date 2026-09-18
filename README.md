# TaxRank — Global Tax & Salary Calculator

**Phase 0 deliverable.** Free, source-cited calculators for USA, UK, Germany, France, and Canada. Built with Next.js 14, Prisma, and SQLite.

> 🎯 Mission: rank #1 globally for tax-related searches by 2027. Currently in Phase 0 (foundation).

---

## ⚡ Quickstart

```bash
# Install deps
npm install

# Generate Prisma client (already done if you cloned the repo with the dev.db)
npx prisma generate

# Push schema to SQLite (creates dev.db)
npx prisma db push

# Seed tax data for 5 countries (2025)
npx prisma db seed

# Start dev server
npm run dev

# Open http://localhost:3000
```

**Reset everything:**
```bash
npm run db:reset   # nukes dev.db + reseeds
```

---

## 🏗 Architecture

```
                    GOOGLE / BING / AI SEARCH
                              │
                              ▼
        ┌─────────────────────────────────────┐
        │      SEO INTELLIGENCE (Phase 1+)    │
        └───────────────────┬─────────────────┘
                            ▼
        ┌─────────────────────────────────────┐
        │         CONTENT PLATFORM           │
        │  Country Hubs · Tax Pages · FAQs    │
        └───────────────────┬─────────────────┘
                            ▼
        ┌─────────────────────────────────────┐
        │     DECISION / CALCULATION ENGINE   │
        │  Progressive tax · Salary take-home │
        └───────────────────┬─────────────────┘
                            ▼
        ┌─────────────────────────────────────┐
        │       VERSIONED DATA CORE           │
        │  Country · TaxRule · TaxBracket ·   │
        │  Deduction · SalaryConfig · Source  │
        └───────────────────┬─────────────────┘
                            ▼
        ┌─────────────────────────────────────┐
        │      DATA UPDATE PIPELINE (Phase 1+)│
        │  Source Monitor → Validate → Review │
        └─────────────────────────────────────┘
```

### Layer breakdown

| Layer | Phase 0 (now) | Phase 1+ (later) |
|---|---|---|
| **Calculation Engine** | ✅ Pure TS, progressive brackets | + Germany formula, France quotient familial, UK taper |
| **Data Core** | ✅ Versioned, SQLite | + PostgreSQL, source monitor |
| **Content** | ✅ 5 country hubs + tax pages | + Comparison, salary, scenarios |
| **API** | ✅ `/api/calculate/{tax,salary}` + `/api/countries` | + embed widget, scenario builder |
| **SEO** | ✅ JSON-LD, sitemap, robots | + query clustering, content gaps |

---

## 📁 Project Structure

```
global-tax-tools/
├── prisma/
│   ├── schema.prisma       # Country, TaxRule (versioned), TaxBracket, Deduction, SalaryConfig, DataSource
│   └── seed.ts             # 5 countries × 2025 brackets
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── countries/route.ts
│   │   │   ├── countries/[code]/route.ts
│   │   │   └── calculate/{tax,salary}/route.ts
│   │   ├── countries/
│   │   │   ├── page.tsx                    # Index
│   │   │   └── [code]/
│   │   │       ├── page.tsx                # Country hub
│   │   │       └── tax/page.tsx            # Country tax page
│   │   ├── tools/
│   │   │   ├── tax-calculator/page.tsx
│   │   │   └── salary-calculator/page.tsx
│   │   ├── about/page.tsx
│   │   ├── methodology/page.tsx
│   │   ├── layout.tsx                      # Site header/footer + global metadata
│   │   ├── page.tsx                        # Homepage
│   │   ├── sitemap.ts                      # Dynamic sitemap
│   │   ├── robots.ts                       # robots.txt
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── ui/                             # button, input, card primitives
│   │   ├── CountrySelector.tsx
│   │   ├── TaxCalculator.tsx
│   │   ├── JsonLd.tsx                      # SEO structured data
│   │   ├── SiteHeader.tsx
│   │   └── SiteFooter.tsx
│   └── lib/
│       ├── calc/
│       │   ├── tax.ts                      # Pure progressive tax engine
│       │   └── salary.ts                   # Gross → net with social
│       ├── data/country.ts                 # DB access layer
│       ├── db.ts                           # Prisma singleton
│       └── utils.ts                        # cn(), formatters
└── README.md
```

---

## 🧮 Tax Calculation API

### `POST /api/calculate/tax`
```json
// Request
{ "country": "US", "income": 75000 }

// Response (truncated)
{
  "input": { "country": {...}, "year": 2025, "income": 75000 },
  "result": {
    "grossIncome": 75000,
    "taxableIncome": 60000,
    "totalTax": 8114,
    "effectiveRate": 0.108,
    "marginalRate": 0.22,
    "breakdown": [...],
    "deductionsApplied": [...]
  }
}
```

### `POST /api/calculate/salary`
```json
// Request
{ "country": "US", "grossIncome": 75000 }

// Response
{
  "result": {
    "gross": 75000,
    "incomeTax": 8114,
    "employeeSocial": 5737.5,
    "netAnnual": 61148.5,
    "netMonthly": 5095.7
  }
}
```

---

## 🌍 Countries Supported (Phase 0)

| Country | Code | Currency | Year | Notes |
|---|---|---|---|---|
| 🇺🇸 United States | US | USD | 2025 | Federal, single filer. State tax — Phase 1. |
| 🇬🇧 United Kingdom | GB | GBP | 2025/26 | Income Tax + NI. England/Wales only. |
| 🇩🇪 Germany | DE | EUR | 2025 | Simplified progressive (real formula — Phase 1). |
| 🇫🇷 France | FR | EUR | 2025 | Quotient familial — Phase 1. |
| 🇨🇦 Canada | CA | CAD | 2025 | Federal only. Provincial — Phase 1. |

---

## ⚠️ Limitations (honest disclosure)

1. **Simplified brackets for Germany** — real BMF formula is more precise in the linear-progression zone (€17,443-€68,430). Phase 1 will implement exact formula.
2. **No state/provincial tax** — US states (CA, NY, TX…), Canadian provinces, etc. Phase 1+.
3. **No capital gains / dividends / investments** — Phase 2.
4. **Single filer only** — married/joint not modeled. Phase 1+.
5. **NI simplified for UK** — full taper above £50,270 not modeled.
6. **Brackets are 2025 only** — 2026 will be added when published.

---

## 🗺 Roadmap

| Phase | Status | Scope |
|---|---|---|
| **Phase 0** (now) | ✅ | Scaffold, versioned schema, 5 countries, calc engine, basic UI, SEO foundations |
| Phase 1 | 🔜 | US states, Canadian provinces, Germany precise formula, embed widget, query clustering |
| Phase 2 | — | Capital gains, dividends, comparison matrix, scenario builder |
| Phase 3 | — | 100+ countries, salary API monetization |
| Phase 4 | — | AI explanation layer, historical trends, negotiation simulator |

---

## 🛠 Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start dev server on :3000 |
| `npm run build` | Production build |
| `npm run start` | Run production build |
| `npm run db:push` | Sync Prisma schema → SQLite |
| `npm run db:seed` | Seed 5 countries |
| `npm run db:reset` | Wipe + reseed (dev only!) |
| `npm run type-check` | TypeScript check |

---

## 🤝 Contributing (later)

Phase 0 is solo-built for proof-of-concept. Once we hit Phase 2, we'll open tax-data contribution flows (per-country review queues, source-citation required).

---

*Built with Mavis — your AI architect.*
