# Catalog audit (2026-08-15)

## What was fixed
- Wrong mapping: Volvo `1607728` was under **brake-valve**; it belongs to **air suspension valve** (COJALI 2214400) → moved to `air-spring`.
- Removed bare brand tokens without numbers (`EBS`, `FEBI`, `SAMPA` alone) from alternate lists — they created false search matches.
- Dedup via `uniqueRefs()` (spaces/dashes/dots ignored).
- Added numbered **SAMPA** crosses from public Autodoc truck listings where available.

## What cannot be done
Copying **entire** Autodoc or SAMPA catalogues (millions of SKUs + product photos) is not possible:
- proprietary commercial data
- rate limits / legal restrictions
- images are CDN-protected

NTParts keeps **verified public cross-references only**. Expand by sending specific part numbers or exports.
