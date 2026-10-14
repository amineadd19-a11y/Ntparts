# Catalog audit — Phase 2 source of truth (2026-09-30)

## Policy
**Real catalogue only.** No demo, placeholder, or synthetic part numbers are published.

### A. VERIFIED / SOURCE-BACKED (live)
Only data supported by attributable evidence appears in the production catalogue:

1. Core OEM registry (`catalog-oem.ts`) — public manufacturer/distributor URLs
2. Source-backed imports (`catalog-source-backed.ts`) — MANN, Knorr-Bremse, WABCO public docs
3. RENPAR rows (`catalog-renpar.ts`) — supplied commercial catalogue PDF

### B. DISCOVERY / UNVERIFIED (not live)
- `catalog-expansion.ts` — offline / empty
- Manufacturer × model × part-template combinations **without** OEM evidence are **never generated** into the live path

## Verification statuses
```
verified | source-listed | cross-checked | needs-verification | unverified | rejected
```

- LLM confidence is a supporting signal only — never proof.
- Empty `modelIds` means exact application is **not** proven.

## Live eligibility gate
`isLiveCatalogueEligible` (`src/lib/catalog/pipeline.ts`):
- Requires at least one non-empty OEM/reference
- Rejects `rejected` / bare `unverified` references
- Enforced at merge time (`deduplicateAndMerge({ liveOnly: true })`)

## 2026-09-30 (Phase 2) changes
- Core no longer materializes template rows without OEM evidence
- Unified `VerificationStatus` type across Part and OEMReference
- Merge pipeline rejects non-eligible discovery data by default
- Expansion remains offline with explicit policy constant

## Still required before claiming exact fitment
- VIN / chassis confirmation
- Official application tables where modelIds are empty
