import type { Part, OEMReference, Source } from '@/types';
import { resolveProductImages } from '@/data/catalog-images';
import { VERIFIED_OEM_REFERENCES } from '@/data/catalog-oem';

type SystemId =
  | 'brake-system'
  | 'engine-system'
  | 'suspension-system'
  | 'transmission-system'
  | 'electrical-system'
  | 'cooling-system'
  | 'exhaust-system'
  | 'steering-system'
  | 'cabin-system'
  | 'other-system';

type SourceDefinition = { id: string; name: string; url: string };
type PartTemplate = {
  slug: string;
  name: string;
  category: string;
  systemId: SystemId;
  tags: string[];
  aftermarketBrands: string[];
};
type ModelDefinition = { id: string; name: string };
type ManufacturerDefinition = {
  id: string;
  name: string;
  source: SourceDefinition;
  models: ModelDefinition[];
};

const now = '2026-08-15T00:00:00.000Z';

const SOURCES: Record<string, SourceDefinition> = {
  'volvo-trucks': { id: 'source-volvo-trucks', name: 'Volvo Trucks', url: 'https://www.volvotrucks.com/' },
  'daf-trucks': { id: 'source-daf-trucks', name: 'DAF Trucks', url: 'https://www.daf.com/' },
  'mercedes-benz-trucks': { id: 'source-mercedes-benz-trucks', name: 'Mercedes-Benz Trucks', url: 'https://www.mercedes-benz-trucks.com/' },
  scania: { id: 'source-scania', name: 'Scania', url: 'https://www.scania.com/' },
  'man-truck-bus': { id: 'source-man-truck-bus', name: 'MAN Truck & Bus', url: 'https://www.man.eu/' },
  'renault-trucks': { id: 'source-renault-trucks', name: 'Renault Trucks', url: 'https://www.renault-trucks.com/' },
  iveco: { id: 'source-iveco', name: 'Iveco', url: 'https://www.iveco.com/' },
  kenworth: { id: 'source-kenworth', name: 'Kenworth', url: 'https://www.kenworth.com/' },
  peterbilt: { id: 'source-peterbilt', name: 'Peterbilt', url: 'https://www.peterbilt.com/' },
  freightliner: { id: 'source-freightliner', name: 'Freightliner', url: 'https://www.freightliner.com/' },
  mack: { id: 'source-mack', name: 'Mack Trucks', url: 'https://www.macktrucks.com/' },
  'western-star': { id: 'source-western-star', name: 'Western Star', url: 'https://www.westernstartrucks.com/' },
  hino: { id: 'source-hino', name: 'Hino Trucks', url: 'https://www.hino.com/' },
  isuzu: { id: 'source-isuzu', name: 'Isuzu Trucks', url: 'https://www.isuzucv.com/' },
};

const FILTER_BRANDS = ['MANN-FILTER', 'MAHLE', 'HENGST', 'DONALDSON', 'UFI', 'PURFLUX', 'FEBI', 'SAMPA', 'ELRING'];
const SUSPENSION_BRANDS = ['SACHS', 'MONROE', 'ZF', 'SAMPA', 'FEBI', 'LEMA', 'COJALI', 'CONTINENTAL'];

const PART_TEMPLATES: PartTemplate[] = [
  { slug: 'brake-disc', name: 'Brake Disc', category: 'Brakes', systemId: 'brake-system', tags: ['brake', 'disc'], aftermarketBrands: ['EBS', 'TEXTAR', 'FEBI', 'SAMPA', 'KNORR-BREMSE', 'VADEN'] },
  { slug: 'brake-pad', name: 'Brake Pad', category: 'Brakes', systemId: 'brake-system', tags: ['brake', 'pad'], aftermarketBrands: ['EBS', 'TEXTAR', 'FEBI', 'KNORR-BREMSE', 'SAMPA', 'VADEN'] },
  { slug: 'brake-caliper', name: 'Brake Caliper', category: 'Brakes', systemId: 'brake-system', tags: ['brake', 'caliper'], aftermarketBrands: ['KNORR-BREMSE', 'WABCO', 'VADEN', 'SAMPA', 'EBS'] },
  { slug: 'brake-chamber', name: 'Brake Chamber', category: 'Brakes', systemId: 'brake-system', tags: ['brake', 'air', 'chamber'], aftermarketBrands: ['KNORR-BREMSE', 'WABCO', 'HALDEX', 'COJALI', 'EBS'] },
  { slug: 'brake-valve', name: 'Brake Valve', category: 'Brakes', systemId: 'brake-system', tags: ['brake', 'valve'], aftermarketBrands: ['KNORR-BREMSE', 'WABCO', 'COJALI', 'SAMPA', 'EBS'] },
  { slug: 'air-dryer', name: 'Air Dryer', category: 'Brakes', systemId: 'brake-system', tags: ['air', 'dryer'], aftermarketBrands: ['KNORR-BREMSE', 'WABCO', 'HALDEX', 'COJALI', 'SAMPA'] },
  { slug: 'oil-filter', name: 'Oil Filter', category: 'Filters', systemId: 'engine-system', tags: ['filter', 'oil'], aftermarketBrands: FILTER_BRANDS },
  { slug: 'air-filter', name: 'Air Filter', category: 'Filters', systemId: 'engine-system', tags: ['filter', 'air'], aftermarketBrands: FILTER_BRANDS },
  { slug: 'fuel-filter', name: 'Fuel Filter', category: 'Filters', systemId: 'engine-system', tags: ['filter', 'fuel'], aftermarketBrands: FILTER_BRANDS },
  { slug: 'cabin-filter', name: 'Cabin Air Filter', category: 'Filters', systemId: 'cabin-system', tags: ['filter', 'cabin'], aftermarketBrands: ['MANN-FILTER', 'MAHLE', 'HENGST', 'FEBI'] },
  { slug: 'water-pump', name: 'Water Pump', category: 'Cooling System', systemId: 'cooling-system', tags: ['water', 'pump'], aftermarketBrands: ['MAHLE', 'GATES', 'FEBI', 'SKF'] },
  { slug: 'thermostat', name: 'Thermostat', category: 'Cooling System', systemId: 'cooling-system', tags: ['thermostat'], aftermarketBrands: ['MAHLE', 'GATES', 'FEBI'] },
  { slug: 'radiator', name: 'Radiator', category: 'Cooling System', systemId: 'cooling-system', tags: ['radiator'], aftermarketBrands: ['MAHLE', 'NRF', 'BEHR'] },
  { slug: 'clutch-kit', name: 'Clutch Kit', category: 'Transmission', systemId: 'transmission-system', tags: ['clutch'], aftermarketBrands: ['SACHS', 'LuK', 'VALEO', 'SAMPA'] },
  { slug: 'shock-absorber', name: 'Shock Absorber', category: 'Suspension', systemId: 'suspension-system', tags: ['shock'], aftermarketBrands: SUSPENSION_BRANDS },
  { slug: 'air-spring', name: 'Air Spring', category: 'Suspension', systemId: 'suspension-system', tags: ['air', 'spring'], aftermarketBrands: ['CONTINENTAL', 'FIRESTONE', 'SAMPA', 'COJALI'] },
  { slug: 'starter-motor', name: 'Starter Motor', category: 'Electrical', systemId: 'electrical-system', tags: ['starter'], aftermarketBrands: ['BOSCH', 'HELLA', 'DENSO', 'VALEO'] },
  { slug: 'alternator', name: 'Alternator', category: 'Electrical', systemId: 'electrical-system', tags: ['alternator'], aftermarketBrands: ['BOSCH', 'HELLA', 'DENSO', 'VALEO'] },
  { slug: 'turbocharger', name: 'Turbocharger', category: 'Engine', systemId: 'engine-system', tags: ['turbo'], aftermarketBrands: ['GARRETT', 'BORGWARNER'] },
  { slug: 'injector', name: 'Fuel Injector', category: 'Engine', systemId: 'engine-system', tags: ['injector'], aftermarketBrands: ['BOSCH', 'DENSO', 'DELPHI'] },
  { slug: 'drive-belt', name: 'Drive Belt', category: 'Engine', systemId: 'engine-system', tags: ['belt'], aftermarketBrands: ['GATES', 'DAYCO', 'CONTITECH'] },
  { slug: 'mirror', name: 'Mirror Assembly', category: 'Cabin', systemId: 'cabin-system', tags: ['mirror'], aftermarketBrands: ['HELLA', 'MEKRA', 'FEBI', 'SAMPA'] },
  { slug: 'gasket-set', name: 'Gasket Set', category: 'Engine', systemId: 'engine-system', tags: ['gasket', 'seal'], aftermarketBrands: ['ELRING', 'REINZ', 'AJUSA', 'FEBI', 'LEMA'] },
  { slug: 'silentblock', name: 'Silentblock / Bush', category: 'Suspension', systemId: 'suspension-system', tags: ['silentblock', 'bush'], aftermarketBrands: ['LEMA', 'FEBI', 'SAMPA'] },
];

const MANUFACTURERS: ManufacturerDefinition[] = [
  { id: 'volvo-trucks', name: 'Volvo Trucks', source: SOURCES['volvo-trucks'], models: [{ id: 'volvo-fh', name: 'FH' }, { id: 'volvo-fh16', name: 'FH16' }, { id: 'volvo-fm', name: 'FM' }, { id: 'volvo-fmx', name: 'FMX' }, { id: 'volvo-fe', name: 'FE' }, { id: 'volvo-fl', name: 'FL' }] },
  { id: 'daf-trucks', name: 'DAF Trucks', source: SOURCES['daf-trucks'], models: [{ id: 'daf-xf', name: 'XF' }, { id: 'daf-xg', name: 'XG' }, { id: 'daf-xg-plus', name: 'XG+' }, { id: 'daf-cf', name: 'CF' }, { id: 'daf-lf', name: 'LF' }] },
  { id: 'mercedes-benz-trucks', name: 'Mercedes-Benz Trucks', source: SOURCES['mercedes-benz-trucks'], models: [{ id: 'mercedes-actros', name: 'Actros' }, { id: 'mercedes-arocs', name: 'Arocs' }, { id: 'mercedes-atego', name: 'Atego' }, { id: 'mercedes-axor', name: 'Axor' }] },
  { id: 'scania', name: 'Scania', source: SOURCES.scania, models: [{ id: 'scania-r', name: 'R-Series' }, { id: 'scania-s', name: 'S-Series' }, { id: 'scania-p', name: 'P-Series' }, { id: 'scania-g', name: 'G-Series' }] },
  { id: 'man-truck-bus', name: 'MAN Truck & Bus', source: SOURCES['man-truck-bus'], models: [{ id: 'man-tgx', name: 'TGX' }, { id: 'man-tgs', name: 'TGS' }, { id: 'man-tgm', name: 'TGM' }, { id: 'man-tgl', name: 'TGL' }] },
  { id: 'renault-trucks', name: 'Renault Trucks', source: SOURCES['renault-trucks'], models: [{ id: 'renault-t', name: 'T' }, { id: 'renault-c', name: 'C' }, { id: 'renault-k', name: 'K' }, { id: 'renault-d', name: 'D' }] },
  { id: 'iveco', name: 'Iveco', source: SOURCES.iveco, models: [{ id: 'iveco-s-way', name: 'S-Way' }, { id: 'iveco-x-way', name: 'X-Way' }, { id: 'iveco-t-way', name: 'T-Way' }, { id: 'iveco-eurocargo', name: 'Eurocargo' }] },
  { id: 'kenworth', name: 'Kenworth', source: SOURCES.kenworth, models: [{ id: 'kenworth-t680', name: 'T680' }, { id: 'kenworth-t880', name: 'T880' }, { id: 'kenworth-w990', name: 'W990' }] },
  { id: 'peterbilt', name: 'Peterbilt', source: SOURCES.peterbilt, models: [{ id: 'peterbilt-579', name: '579' }, { id: 'peterbilt-389', name: '389' }, { id: 'peterbilt-567', name: '567' }] },
  { id: 'freightliner', name: 'Freightliner', source: SOURCES.freightliner, models: [{ id: 'freightliner-cascadia', name: 'Cascadia' }, { id: 'freightliner-m2-106', name: 'M2 106' }, { id: 'freightliner-122sd', name: '122SD' }] },
  { id: 'mack', name: 'Mack Trucks', source: SOURCES.mack, models: [{ id: 'mack-anthem', name: 'Anthem' }, { id: 'mack-pinnacle', name: 'Pinnacle' }, { id: 'mack-granite', name: 'Granite' }] },
  { id: 'western-star', name: 'Western Star', source: SOURCES['western-star'], models: [{ id: 'western-star-49x', name: '49X' }, { id: 'western-star-57x', name: '57X' }, { id: 'western-star-47x', name: '47X' }] },
  { id: 'hino', name: 'Hino Trucks', source: SOURCES.hino, models: [{ id: 'hino-xl', name: 'XL Series' }, { id: 'hino-l', name: 'L Series' }] },
  { id: 'isuzu', name: 'Isuzu Trucks', source: SOURCES.isuzu, models: [{ id: 'isuzu-n', name: 'N Series' }, { id: 'isuzu-f', name: 'F Series' }, { id: 'isuzu-g', name: 'G Series' }] },
];

const normalizeRef = (value: string): string => value.toLowerCase().replace(/[\s\-\/.]/g, '');
const unique = (values: string[]): string[] => Array.from(new Set(values.filter(Boolean)));

function sourceFor(manufacturer: ManufacturerDefinition, partId: string): Source {
  return { id: `${manufacturer.source.id}-${partId}`, partId, name: manufacturer.source.name, url: manufacturer.source.url, type: 'official', reliability: 'high' };
}

function oemRefsFor(partId: string, manufacturerId: string, templateSlug: string): OEMReference[] {
  return VERIFIED_OEM_REFERENCES
    .filter((item) => item.manufacturerId === manufacturerId && item.partTemplateSlug === templateSlug)
    .map((item, index) => ({
      id: `${partId}-oem-${index + 1}`,
      partId,
      manufacturerId,
      referenceNumber: item.referenceNumber,
      alternateNumbers: unique(item.alternateNumbers ?? []),
      verificationStatus: 'verified' as const,
      source: item.sourceUrl,
      evidenceLevel: 'parts-catalog' as const,
    }));
}

function createPart(manufacturer: ManufacturerDefinition, model: ModelDefinition, template: PartTemplate): Part {
  const id = `${model.id}-${template.slug}`;
  const oemReferences = oemRefsFor(id, manufacturer.id, template.slug);
  const crossReferences = unique(oemReferences.flatMap((ref) => ref.alternateNumbers ?? []));
  const tags = unique([...template.tags, manufacturer.id, model.name.toLowerCase()]);
  return {
    id,
    systemId: template.systemId,
    name: template.name,
    description: `${template.name} — ${manufacturer.name} ${model.name}. ${oemReferences.length ? 'Source-backed OEM references indexed; confirm exact fitment before ordering.' : 'Exact OEM and fitment are NOT VERIFIED.'}`,
    category: template.category,
    specifications: {
      type: template.name,
      vehicleType: 'Truck',
      manufacturer: manufacturer.name,
      manufacturerId: manufacturer.id,
      model: model.name,
      tags: tags.join(', '),
      aftermarketBrands: template.aftermarketBrands.join(', '),
      oemStatus: oemReferences.length ? 'verified' : 'NOT VERIFIED',
      crossReferences: crossReferences.join(', '),
      referencePolicy: 'No OEM number claimed without source-backed evidence; verify exact application before order',
    },
    images: resolveProductImages(template.slug, id, template.name) as Part['images'],
    oemReferences,
    crossReferences: [],
    compatibility: [],
    sources: [sourceFor(manufacturer, id)],
    verificationStatus: oemReferences.length ? 'verified' : 'needs-verification',
    createdAt: now,
    updatedAt: now,
  };
}

export const CATALOG_PARTS: Part[] = MANUFACTURERS.flatMap((manufacturer) =>
  manufacturer.models.flatMap((model) => PART_TEMPLATES.map((template) => createPart(manufacturer, model, template)))
);

export const CATALOG_MANUFACTURERS = MANUFACTURERS.map(({ id, name }) => ({ id, name }));
export const CATALOG_MODELS = MANUFACTURERS.flatMap((manufacturer) =>
  manufacturer.models.map((model) => ({ id: model.id, manufacturerId: manufacturer.id, name: model.name }))
);
export const CATALOG_CATEGORIES = Array.from(new Set(CATALOG_PARTS.map((part) => part.category)));
export const CATALOG_SYSTEMS = Array.from(new Set(CATALOG_PARTS.map((part) => part.systemId)));
export const CATALOG_AFTERMARKET_BRANDS = Array.from(new Set(PART_TEMPLATES.flatMap((template) => template.aftermarketBrands))).sort();
export const CATALOG_STATS = {
  manufacturers: CATALOG_MANUFACTURERS.length,
  models: CATALOG_MODELS.length,
  partTemplates: PART_TEMPLATES.length,
  parts: CATALOG_PARTS.length,
  categories: CATALOG_CATEGORIES.length,
  systems: CATALOG_SYSTEMS.length,
  aftermarketBrands: CATALOG_AFTERMARKET_BRANDS.length,
  verifiedOEMReferences: VERIFIED_OEM_REFERENCES.length,
};

export function searchCoreCatalog(query: string): Part[] {
  const q = query.trim().toLowerCase();
  if (!q) return CATALOG_PARTS;
  const compact = normalizeRef(query);
  return CATALOG_PARTS.filter((part) => {
    const refs = part.oemReferences.flatMap((oem) => [oem.referenceNumber, ...(oem.alternateNumbers ?? [])]);
    if (refs.some((ref) => ref.toLowerCase().includes(q) || normalizeRef(ref).includes(compact))) return true;
    return [part.id, part.name, part.category, part.description ?? '', part.specifications?.manufacturer ?? '', part.specifications?.model ?? '', part.specifications?.crossReferences ?? '', part.specifications?.tags ?? '', part.specifications?.aftermarketBrands ?? ''].join(' ').toLowerCase().includes(q);
  });
}
