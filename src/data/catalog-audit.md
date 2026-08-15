# Catalog audit — 2026-08-15

## What was fixed
1. **Wrong COJALI type**: Volvo `1607728` was under *brake-valve*; COJALI `2214400` is an **air suspension valve**. Moved to `air-spring` / suspension mapping.
2. **SAMPA 033.141**: Official sampa.com product page lists OEM **Volvo 22480372 / 20976003**, MANN WDK11102*, BOSCH F026402017 — not the previous guessed link to 20924422 alone.
3. **Bare brand tags**: Removed lone alternates like only `EBS` / `FEBI` without a concrete part number where possible.
4. **Dedup**: `uniqueRefs()` keeps one of `W 11 025` / `W11025` style duplicates.

## What cannot be done automatically
- **AutoDoc** (autodoc.*): Cloudflare-protected retail site; full catalogue scrape is not allowed and not technical feasible as bulk import.
- **Full SAMPA catalogue**: tens of thousands of SKUs; we index **verified public product pages** only.

## Policy
Only public, attributable cross-references. Always verify fitment before order.
