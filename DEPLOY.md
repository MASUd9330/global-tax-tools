# 🚀 Deploy to Vercel — Step-by-Step Guide

**Status:** ✅ Production build verified locally. Deploy-ready.

---

## ⚠️ Critical: SQLite থেকে hosted DB-তে migrate করতে হবে

Vercel serverless এ **persistent file system নেই** — `prisma/dev.db` file কাজ করবে না।
তোমাকে একটা hosted DB choose করতে হবে। নিচে options দিচ্ছি।

---

## Option A (Recommended): Vercel Postgres — **সবচেয়ে সহজ** ⭐

**Pros:** Vercel-native, free tier sufficient, zero config
**Free tier:** 256 MB storage, 60 hours compute/month, 0.5 GB egress

### Steps:

1. **vercel.com** এ login করো
2. **Add New… → Project** → Import `MASUd9330/global-tax-tools`
3. **Storage tab** → Create Database → Postgres → Hobby (Free)
   - Region: Singapore (sin1) — closest to your users
   - Database name: `taxrank-db`
   - Click **Create**
4. **Connect to Project** → Select your project (`global-tax-tools`)
   - Vercel automatically adds `DATABASE_URL`, `POSTGRES_URL`, etc. to env vars
5. Project root `package.json` already has the right scripts
6. **Deploy**

After first deploy:

7. Go to Vercel project → **Storage** tab → click `taxrank-db` → **Data → Query** → paste:
   ```sql
   -- (Prisma migrations will run automatically on first build)
   ```
   
   Or just open Vercel CLI:
   ```powershell
   vercel env pull .env.production
   npx prisma db push
   npx prisma db seed
   ```

---

## Option B: Supabase Postgres — **generous free tier**

**Pros:** 500 MB storage, 2 GB egress, separate dashboard
**Free tier:** Persistent

### Steps:

1. **supabase.com** → New project → Name: `taxrank`, region: Singapore
2. Project Settings → Database → Connection string (URI mode) → copy
   - Looks like: `postgresql://postgres:xxxxx@db.xxx.supabase.co:5432/postgres`
3. Vercel → import repo → **Environment Variables** add:
   - `DATABASE_URL` = `postgresql://postgres:xxxxx@db.xxx.supabase.co:5432/postgres`
4. Deploy
5. After deploy, locally: `vercel env pull .env.production` → `npx prisma db push && npx prisma db seed`

---

## Option C: Turso — **SQLite-compatible, lowest friction**

**Pros:** Same SQLite engine, libSQL network protocol, generous free tier (9 GB!)
**Free tier:** 9 GB storage, 500M row reads/month

### Steps:

1. **turso.tech** → sign up → install CLI:
   ```powershell
   # install Turso CLI
   npm install -g @turso/cli
   turso auth login
   turso db create taxrank
   turso db show taxrank --url
   turso db tokens create taxrank  # copy this token
   ```

2. The DATABASE_URL looks like:
   `libsql://taxrank-username.turso.io?auth=xxxxx`

3. Switch `prisma/schema.prisma` provider:
   ```diff
   datasource db {
   -  provider = "sqlite"
   +  provider = "postgresql"  # Turso supports Postgres protocol too
      url      = env("DATABASE_URL")
   }
   ```
   
4. Vercel env: `DATABASE_URL` = the libsql URL
5. Deploy + run migrations

---

## 📋 Vercel Dashboard Checklist

After import:

| Setting | Value |
|---|---|
| **Framework Preset** | Next.js (auto-detected) |
| **Root Directory** | `./` (default) |
| **Build Command** | (uses package.json: `prisma generate && next build`) |
| **Output Directory** | `.next` (default — `vercel.json` confirms) |
| **Install Command** | `npm install` (default) |
| **Region** | Singapore (sin1) — recommended |
| **Node Version** | 20.x (auto-detected from .nvmrc if present) |

### Environment Variables

| Key | Value | Required |
|---|---|---|
| `DATABASE_URL` | Your hosted Postgres / libSQL URL | ✅ Yes |
| `NEXT_PUBLIC_SITE_URL` | `https://your-project.vercel.app` | Yes (after first deploy) |
| `NEXT_PUBLIC_SITE_NAME` | `TaxRank` | No (default works) |

### Production Build Settings

`package.json` already has:
```json
"build": "next build"
"postinstall": "prisma generate"  (we'll add if missing)
```

Vercel auto-runs `npm install` which will execute `postinstall`.

---

## 🚦 Deployment Commands

After Vercel is set up via dashboard:

```powershell
# Future deploys happen automatically on git push
cd E:\Talegram\Minimax\global-tax-tools
git add .
git commit -m "..."
git push origin main
# Vercel auto-deploys on every push to main
```

Manual one-off:
```powershell
# Optional: install Vercel CLI
npm install -g vercel

# Login (opens browser)
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

---

## ⚠️ Post-Deploy Tasks

1. **Seed production DB** — first deploy won't have data
   ```powershell
   vercel env pull .env.production
   npx prisma db push
   npx prisma db seed
   ```

2. **Update site URL** — `NEXT_PUBLIC_SITE_URL` should match deployed URL for canonical/OG

3. **Test:**
   - Homepage → calculator works
   - /countries/usa → renders
   - /compare/texas-vs-california → renders
   - /admin/seo → dashboard works

4. **(Optional) Custom domain:**
   - Buy domain (Namecheap / Cloudflare)
   - Vercel → Domains → Add → follow DNS instructions

---

## 💸 Cost Summary

For this app's scale (50 requests/sec peak = ~5M/month), all options are **free**:

- Vercel Hobby: Free (100 GB bandwidth, 6000 build min)
- Vercel Postgres Hobby: Free
- Supabase Free: 500MB DB, 2GB egress
- Turso Free: 9GB storage, 500M reads

Start free. Upgrade only when you hit limits (you won't for a while).

---

## 🛠 Troubleshooting

**Build fails: "Prisma Client not generated"**
- Verify `package.json` has `"postinstall": "prisma generate"` OR use `buildCommand: "prisma generate && next build"` (we set this in `vercel.json`)

**App works but DB is empty (404 on country pages)**
- Run `vercel env pull .env.production && npx prisma db push && npx prisma db seed`

**"DATABASE_URL is not set"**
- Make sure you added the env var in Vercel project settings, not just locally

**Build works but pages 500**
- Check Vercel runtime logs (Project → Logs tab)

---

## 📞 Need help?

Open Vercel dashboard → Project → Logs tab → look for errors.
Or ping me — share the error and I'll help debug.
