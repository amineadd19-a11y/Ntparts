/**
 * UI-facing catalog helpers. The authoritative manufacturer/model dataset lives
 * in src/data/catalog.ts so the UI cannot drift from the searchable catalogue.
 */
import { CATALOG_MANUFACTURERS, CATALOG_MODELS, CATALOG_PARTS } from '@/data/catalog';

export const TRUCK_MANUFACTURERS = CATALOG_MANUFACTURERS.map((manufacturer) => ({
  ...manufacturer,
  modelCount: CATALOG_MODELS.filter((model) => model.manufacturerId === manufacturer.id).length,
  partCount: CATALOG_PARTS.filter((part) => part.specifications?.manufacturerId === manufacturer.id).length,
}));

export const DEMO_SYSTEMS = [
  { id: 'engine-system', name: 'Engine & Cooling', category: 'engine' as const },
  { id: 'transmission-system', name: 'Transmission', category: 'transmission' as const },
  { id: 'brake-system', name: 'Brake System', category: 'brake' as const },
  { id: 'electrical-system', name: 'Electrical', category: 'electrical' as const },
  { id: 'suspension-system', name: 'Suspension', category: 'suspension' as const },
  { id: 'cabin-system', name: 'Cabin', category: 'other' as const },
  { id: 'other-system', name: 'Other', category: 'other' as const },
];
