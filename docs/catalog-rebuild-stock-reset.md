# Catalogue rebuild and stock reset

## Current live behaviour

- The legacy generated/core part rows are excluded from the live catalogue merge.
- The supplied RENPAR MOIS 11 PDF contributes 497 source-listed rows with page-level provenance; rows without an OEM reference remain aftermarket-only. The eligibility gate accepts this local source only when the document, page, and source record match.
- Exact vehicle fitment is not asserted when source evidence does not prove it.
- Live inventory tuples, CMUP values, aggregate quantity, and aggregate value are reset to zero until a new dated stocktake is imported.
- The historical `inventory-records-1.ts` through `inventory-records-8.ts` files are no longer imported. They remain in this branch only as a recoverable archive; their values are not current stock.

## Review of requested GitHub projects

These repositories were reviewed as possible implementation references:

1. `Naviolance/Truck-spare-part-store` — store/application code, not an independently verified parts dataset; its repository states a restrictive license, so code is not copied.
2. `catamc90/auto-parts-catalog` — API client requiring external RapidAPI data access, not a bundled complete catalog.
3. `erdekagi/vehicle-parts-catalog` — desktop catalog application, not a ready-to-import verified truck-parts dataset.
4. `dulanachathurma/Vehicle-Spare-Parts` — application/source structure, not a verified OEM catalog feed.
5. `SoFukuhara/TruckParts-Demand-Inventory-Simulator` — synthetic simulation data only; never treated as real stock or verified fitment.

The projects inform the direction of the rebuild (catalog separation, vehicle hierarchy, store workflow, and optional demand simulation), but their code/data is not blindly copied into production. A real external catalog import still requires a licensed data feed or source files with provenance.

## Next required data input

Provide a fresh inventory export for live quantities and cost valuation, and an authorized OEM/aftermarket catalog dataset for broad vehicle/part coverage. Until then, the live stock is intentionally empty and catalog coverage remains limited to existing source-backed rows.

## Recommended production catalogue source

### Decision: evaluate a licensed TecAlliance TecDoc feed first

For a production parts catalogue, the preferred next step is to request a commercial proposal and sample data from **TecAlliance / TecDoc**, rather than scrape AUTODOC or import unlicensed GitHub data. TecDoc documents a Web Service API and Data Package options, with article data, OE/reference search, and vehicle linkages. API access requires a customer agreement/account; documentation examples are not public credentials or permission to redistribute the data.

Official product and API documentation:
- TecDoc Catalogue: https://www.tecalliance.net/products/cards/tecdoc-catalogue
- TecDoc Web Service/API introduction: https://developer.tecalliance.cn/en/introduction/
- Article/vehicle search and linkages: https://developer.tecalliance.cn/en/tecdoc-api/use-case/part-search-request-for-vehicle-filter/index.html and https://developer.tecalliance.cn/en/tecdoc-api/function/part-linkage-search/index.html

AUTODOC remains a secondary reference for manual investigation only. Do not scrape it, bulk-copy its product records/images/descriptions, or publish those assets without written permission and an appropriate licence. A public retail website is not a reusable data feed.

### Required supplier questions before buying

1. Does the licence explicitly cover **commercial vehicles, trucks and buses** relevant to Morocco, including Renault Trucks, Volvo Trucks, Mercedes-Benz Trucks, DAF, MAN, Scania, Iveco and common bus manufacturers?
2. Are web-shop display, search indexing, cached copies, images, descriptions, OEM numbers, aftermarket cross-references and vehicle-fitment links permitted for NTParts?
3. Is Morocco included in the licensed territory, and which languages and brands are included?
4. Is API access or a scheduled data package available? Ask for schema, update frequency, rate limits, sandbox/sample file, fees, and termination/export rules.
5. Can we display compatibility publicly, or must some data remain behind a customer login?

### Import design (do not bypass these gates)

- Keep supplier catalogue records separate from the company's own stock, purchase costs, selling prices and warehouse quantities.
- Preserve supplier record IDs, supplier/brand, OEM and aftermarket references, source, licence, import timestamp and source revision.
- Normalize references and deduplicate without deleting source provenance.
- Import fitment only when it is present in the licensed source; otherwise show “fitment not verified”.
- Never infer stock from supplier availability or from demand-simulation data.
- Start with a small licensed sample and compare representative truck/bus references with manufacturer documentation before a full import.
- Keep the integration disabled until the licence is signed, credentials are provisioned server-side, and the provider's permitted use is confirmed.

**No live TecDoc/AUTODOC connection has been enabled by this change.** We do not yet have a contract, credentials, or confirmed truck/bus coverage for NTParts. Do not add fake API keys, scrape retail pages, or represent a source evaluation as a completed data import.
