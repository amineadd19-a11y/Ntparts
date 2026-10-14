# Catalogue rebuild and stock reset

## Current live behaviour

- The legacy generated/core part rows are excluded from the live catalogue merge.
- Only records from the existing source-backed manufacturer/distributor dataset and the supplied RENPAR catalogue are considered for live results, subject to the existing eligibility gate.
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
