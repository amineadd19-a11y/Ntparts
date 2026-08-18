# NTParts

**Global truck parts catalogue and OEM intelligence platform.**

NTParts is a professional, verification-aware catalogue for European and North-American trucks. Search OEM numbers, aftermarket cross-references, truck models and systems, then research with **PartMind** — a server-side AI layer that combines the internal catalogue with grounded web evidence.

## Features

- **Structured catalogue** — manufacturers, models, systems, categories, OEM + aftermarket references
- **PartMind AI** — OEM identification, cross-references, fitment analysis, part comparison
- **Source ranking & confidence** — official manufacturer > technical docs > authorized distributors > professional catalogues
- **Explicit honesty** — answers marked `NOT VERIFIED` or `SOURCE CONFLICT` instead of inventing data
- **Inventory / Stock view** — snapshot of available references and quantities
- **Multi-language UI** — English, French, Arabic (Darija)
- **Quality gate** — type-check, lint, unit tests, catalog validation, production build

## Quick start

```bash
npm install
cp .env.example .env.local
# Set GEMINI_API_KEY (server-side only) for PartMind
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Required environment

```text
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash   # optional, default shown
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Never** expose `GEMINI_API_KEY` via a `NEXT_PUBLIC_*` variable.

## PartMind AI

`POST /api/ai`

```json
{ "question": "K059965K50" }
```

Response includes grounded answer, confidence, catalogue matches, ranked sources and conflict status.

Also available in the UI at `/ai` and embedded on the homepage.

## Quality gate

Run the full production gate before merging:

```bash
npm run quality-gate
```

This executes:

1. `npm run type-check`
2. `npm run lint`
3. `npm test -- --runInBand`
4. `npm run validate:catalog`
5. `npm run build`

CI runs the same gate on every push/PR to `main` (see `.github/workflows/quality-gate.yml`).

## Project structure (high level)

```text
src/
  app/           # Next.js App Router pages + API routes
  components/    # UI (catalog, AI, layout, search, stock…)
  data/          # Catalogue sources, inventory, translations
  lib/           # Catalog pipeline, AI tools, inventory search
  store/         # Client state (language, favorites…)
  types/         # Shared TypeScript types
scripts/         # Catalog validator + quality helpers
```

## Catalogue policy

- Only **public, attributable** cross-references are stored.
- OEM records carry `sourceUrl` + evidence level.
- Empty `modelIds` means exact fitment is **not** proven — never treat as guaranteed compatibility.
- Synthetic / placeholder numbers are rejected by the validation gate.

## Deploy

Configured for Vercel (`vercel.json`). Set `GEMINI_API_KEY` as a server-side environment variable / secret.

## License

Private / proprietary unless otherwise stated by the owner.
