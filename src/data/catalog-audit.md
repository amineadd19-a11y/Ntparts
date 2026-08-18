# Catalog audit — 2026-08-18

## Policy
**Real catalogue only.** No demo, placeholder, or synthetic part numbers are published.

## Live sources
1. Core OEM registry (`catalog-oem.ts`) — public manufacturer/distributor URLs
2. Source-backed imports (`catalog-source-backed.ts`) — MANN, Knorr-Bremse, WABCO public docs
3. RENPAR rows (`catalog-renpar.ts`) — supplied commercial catalogue PDF

## 2026-08-18 changes
- Removed template expansion rows from the live merge
- Filtered core parts to those with at least one OEM reference
- Removed bare brand token `TEXTAR` from MAN brake-pad alternates; replaced with concrete numbers
- Added Knorr K046771K50 and WABCO/DAF 0699387 OEM registry rows (already source-backed)
- Marked `catalog-expansion.ts` offline / empty

## Still required before claiming exact fitment
- VIN / chassis confirmation
- Official application tables where modelIds are empty
