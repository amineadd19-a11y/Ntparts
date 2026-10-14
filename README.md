# NTParts

**Global truck parts catalogue and OEM intelligence platform.**

NTParts publishes **only real, source-backed catalogue records** — no demo, placeholder, or synthetic part numbers.

## Real catalogue sources

| Source | Content |
|--------|---------|
| Core OEM registry | Verified / source-listed OEM references with provenance URLs |
| Source-backed imports | MANN-FILTER, Knorr-Bremse, WABCO public documentation |
| RENPAR catalogue | Supplied commercial catalogue PDF (MOIS 11) rows |

Template expansion rows without OEM evidence are **excluded** from the live catalogue.

## Features

- Structured OEM + aftermarket search
- **PartMind AI** — catalogue tools + Google Search grounding
- Explicit `NOT VERIFIED` / `SOURCE CONFLICT` answers
- Catalogue is separate from private company inventory; public stock display is disabled
- Multi-language UI (EN / FR / AR)
- Full quality gate (types, lint, tests, catalog validation, build)

## Quick start

```bash
npm install
cp .env.example .env.local
# Set GEMINI_API_KEY (server-side only) for PartMind
npm run dev
```

### Environment

```text
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Never expose `GEMINI_API_KEY` via `NEXT_PUBLIC_*`.

## PartMind AI

`POST /api/ai`

```json
{ "question": "K059965K50" }
```

Also available at `/ai` and on the homepage.

## Quality gate

```bash
npm run quality-gate
```

Runs: type-check → lint → tests → `validate:catalog` → build.

## External catalogue provider

The next provider to evaluate is a licensed TecAlliance TecDoc Web Service or Data Package, subject to written confirmation of truck/bus coverage, Morocco territory, and online display/redistribution rights. AUTODOC is not treated as an automatically reusable feed. No external provider is connected until licensing, credentials, and sample-data validation are complete. See `docs/catalog-rebuild-stock-reset.md`.

## Catalogue policy

- Only public, attributable cross-references.
- Every OEM record carries `sourceUrl` + evidence level.
- Empty fitment scope means exact application is **not** proven.
- Synthetic / placeholder patterns are rejected by the validator.
- **No demo catalogue data is published.**

## Deploy

Vercel-ready. Set `GEMINI_API_KEY` as a server-side secret.
