# TaxRank — Session Notes for Tomorrow

## Project state (last updated: Sept 28, 2026)

**Live at:** https://global-tax-tools.vercel.app
**GitHub:** https://github.com/MASUd9330/global-tax-tools
**Local:** `E:\Talegram\Minimax\global-tax-tools`

## What's done (commits on main)

- `b895c7c` — Phase 0: foundation (calc engine, 5 countries, API, pages)
- `aa62428` + `ab5e234` — Phase 1: US states (29 total)
- `949f496` — Phase 2: 14 countries (G7 + expat-heavy)
- `bdfea94` — Phase 2 SEO Intelligence Core (6 modules)
- `a9e42d1` — Phase 3: Comparison Matrix
- `67bbf28` + `93d898d` — Vercel deploy infrastructure
- `c93f389` — Force-dynamic refactor
- `89d08a6` — Static data refactor (no Prisma at runtime)
- `0df894a` — Phase 5: Scenario Builder, Embed Widget, AI Explanation, Source Monitor UI, Historical Trends, +8 countries
- `a50e9cd` — Visual polish (hero, header, footer, country pages, BracketVisualization)
- `6f28cd4` — Phase 6: +22 countries, 88 tests, API rate limiting
- `f87fc7c` — Phase 7: Binance Pay Pro tier + /pro page + key system
- `99879df` — Fix CopyButton client component

## What's NEXT (todo for tomorrow)

User asked for offline background monitoring. Planned: GitHub Actions scheduled workflow.
The .github/workflows/monitor.yml file got an error during creation ("Operation aborted") —
needs to be re-created tomorrow.

### Tomorrow's agenda (per "structure onujay baki" + user's last ask):

1. **Re-create GitHub Actions workflow** for source monitor (run daily, no PC needed)
2. **Real GSC + query clustering** (if user has Google OAuth / Search Console access)
3. **More countries** (currently 44, target 100+ per architecture)
4. **GitHub Actions CI** (auto-run `npm test` on PRs)
5. **Update data** (add 2026 brackets when published)

## Architecture status

- SEO Intelligence Core: 85%
- Content Platform: 98%
- Decision/Calc Engine: 100%
- Versioned Data Core: 80%
- Data Update Pipeline: 70%
- AI Layer: 90%
- API Monetization: 75% (Binance Pay done)
- Test Coverage: ~70% (100 tests)
- **Overall: ~90%**

## Vercel env vars to set when ready to sell

```
PRO_KEYS=tr_pro_xxxxxx|pro|customer@example.com,...
NEXT_PUBLIC_BINANCE_PAY_ID=...
NEXT_PUBLIC_USDT_ADDRESS=...
NEXT_PUBLIC_SUPPORT_EMAIL=pro@yourdomain.com
```

## Vercel deploy tokens (already in env)

- Vercel token + GitHub PAT stored in local env (not in repo)
- Use `vercel deploy --prod --yes --token <token>` and `git push https://<pat>@github.com/...`

## Things to remember

- User communicates in Banglish (Bangla in Roman script)
- No Stripe — only Binance Pay / USDT
- User wants "ak ak kore suru koro" = incremental execution
- "age bolo" = tell me first / status before opinions
- Don't ask too many clarifying questions — just do the next sensible thing
- 44 countries, 29 US states, 100 tests, 1 production deploy

## Useful commands

```bash
# Run all tests
cd E:\Talegram\Minimax\global-tax-tools
node --import tsx --test tests\*.test.ts

# Type-check
node node_modules/typescript/bin/tsc --noEmit

# Deploy (token in env, not committed)
vercel deploy --prod --yes --token $VERCEL_TOKEN

# Verify a route
curl -sS -m 30 -o NUL -w "%{http_code}\n" https://global-tax-tools.vercel.app/<path>
```