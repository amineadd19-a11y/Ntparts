import { Part, OEMReference, Source, PartImage } from '@/types';
import { resolveProductImages } from '@/data/catalog-images';

const now = '2026-08-15T00:00:00.000Z';

type SystemId =
  | 'brake-system' | 'engine-system' | 'suspension-system' | 'transmission-system'
  | 'electrical-system' | 'cooling-system' | 'exhaust-system' | 'steering-system'
  | 'cabin-system' | 'other-system';

type SourceDefinition = { id: string; name: string; url: string };
type PartTemplate = {
  slug: string; name: string; category: string; systemId: SystemId;
  tags: string[]; aftermarketBrands: string[];
};
type ModelDefinition = { id: string; name: string };
type ManufacturerDefinition = { id: string; name: string; source: SourceDefinition; models: ModelDefinition[] };

const SOURCES: Record<string, SourceDefinition> = {
  'volvo-trucks': { id: 'source-volvo-trucks', name: 'Volvo Trucks', url: 'https://www.volvotrucks.com/' },
  'daf-trucks': { id: 'source-daf-trucks', name: 'DAF Trucks', url: 'https://www.daf.com/' },
  'mercedes-benz-trucks': { id: 'source-mercedes-benz-trucks', name: 'Mercedes-Benz Trucks', url: 'https://www.mercedes-benz-trucks.com/' },
  'scania': { id: 'source-scania', name: 'Scania', url: 'https://www.scania.com/' },
  'man-truck-bus': { id: 'source-man-truck-bus', name: 'MAN Truck & Bus', url: 'https://www.man.eu/' },
  'renault-trucks': { id: 'source-renault-trucks', name: 'Renault Trucks', url: 'https://www.renault-trucks.com/' },
  'iveco': { id: 'source-iveco', name: 'Iveco', url: 'https://www.iveco.com/' },
  'kenworth': { id: 'source-kenworth', name: 'Kenworth', url: 'https://www.kenworth.com/' },
  'peterbilt': { id: 'source-peterbilt', name: 'Peterbilt', url: 'https://www.peterbilt.com/' },
  'freightliner': { id: 'source-freightliner', name: 'Freightliner', url: 'https://www.freightliner.com/' },
  'mack': { id: 'source-mack', name: 'Mack Trucks', url: 'https://www.macktrucks.com/' },
  'western-star': { id: 'source-western-star', name: 'Western Star', url: 'https://www.westernstartrucks.com/' },
  'hino': { id: 'source-hino', name: 'Hino Trucks', url: 'https://www.hino.com/' },
  'isuzu': { id: 'source-isuzu', name: 'Isuzu Trucks', url: 'https://www.isuzucv.com/' },
};

const FILTER_BRANDS = ['MANN-FILTER', 'MAHLE', 'HENGST', 'DONALDSON', 'UFI', 'PURFLUX', 'FEBI', 'SAMPA', 'ELRING'];
const SUSP_BRANDS = ['SACHS', 'MONROE', 'ZF', 'SAMPA', 'FEBI', 'LEMA', 'COJALI', 'CONTINENTAL'];
const ENGINE_SEAL_BRANDS = ['ELRING', 'REINZ', 'AJUSA', 'FEBI', 'LEMA'];

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
  { slug: 'shock-absorber', name: 'Shock Absorber', category: 'Suspension', systemId: 'suspension-system', tags: ['shock'], aftermarketBrands: SUSP_BRANDS },
  { slug: 'air-spring', name: 'Air Spring', category: 'Suspension', systemId: 'suspension-system', tags: ['air', 'spring'], aftermarketBrands: ['CONTINENTAL', 'FIRESTONE', 'SAMPA', 'COJALI'] },
  { slug: 'starter-motor', name: 'Starter Motor', category: 'Electrical', systemId: 'electrical-system', tags: ['starter'], aftermarketBrands: ['BOSCH', 'HELLA', 'DENSO', 'VALEO'] },
  { slug: 'alternator', name: 'Alternator', category: 'Electrical', systemId: 'electrical-system', tags: ['alternator'], aftermarketBrands: ['BOSCH', 'HELLA', 'DENSO', 'VALEO'] },
  { slug: 'turbocharger', name: 'Turbocharger', category: 'Engine', systemId: 'engine-system', tags: ['turbo'], aftermarketBrands: ['GARRETT', 'BORGWARNER'] },
  { slug: 'injector', name: 'Fuel Injector', category: 'Engine', systemId: 'engine-system', tags: ['injector'], aftermarketBrands: ['BOSCH', 'DENSO', 'DELPHI'] },
  { slug: 'drive-belt', name: 'Drive Belt', category: 'Engine', systemId: 'engine-system', tags: ['belt'], aftermarketBrands: ['GATES', 'DAYCO', 'CONTITECH'] },
  { slug: 'mirror', name: 'Mirror Assembly', category: 'Cabin', systemId: 'cabin-system', tags: ['mirror'], aftermarketBrands: ['HELLA', 'MEKRA', 'FEBI', 'SAMPA'] },
  { slug: 'gasket-set', name: 'Gasket Set', category: 'Engine', systemId: 'engine-system', tags: ['gasket', 'seal', 'elring'], aftermarketBrands: ENGINE_SEAL_BRANDS },
  { slug: 'silentblock', name: 'Silentblock / Bush', category: 'Suspension', systemId: 'suspension-system', tags: ['silentblock', 'bush', 'lema'], aftermarketBrands: ['LEMA', 'FEBI', 'SAMPA'] },
];

const MANUFACTURERS: ManufacturerDefinition[] = [
  { id: 'volvo-trucks', name: 'Volvo Trucks', source: SOURCES['volvo-trucks'], models: [
    { id: 'volvo-fh', name: 'FH' }, { id: 'volvo-fh16', name: 'FH16' }, { id: 'volvo-fm', name: 'FM' }, { id: 'volvo-fmx', name: 'FMX' }, { id: 'volvo-fe', name: 'FE' }, { id: 'volvo-fl', name: 'FL' },
  ]},
  { id: 'daf-trucks', name: 'DAF Trucks', source: SOURCES['daf-trucks'], models: [
    { id: 'daf-xf', name: 'XF' }, { id: 'daf-xg', name: 'XG' }, { id: 'daf-xg-plus', name: 'XG+' }, { id: 'daf-cf', name: 'CF' }, { id: 'daf-lf', name: 'LF' },
  ]},
  { id: 'mercedes-benz-trucks', name: 'Mercedes-Benz Trucks', source: SOURCES['mercedes-benz-trucks'], models: [
    { id: 'mercedes-actros', name: 'Actros' }, { id: 'mercedes-arocs', name: 'Arocs' }, { id: 'mercedes-atego', name: 'Atego' }, { id: 'mercedes-axor', name: 'Axor' },
  ]},
  { id: 'scania', name: 'Scania', source: SOURCES['scania'], models: [
    { id: 'scania-r', name: 'R-Series' }, { id: 'scania-s', name: 'S-Series' }, { id: 'scania-p', name: 'P-Series' }, { id: 'scania-g', name: 'G-Series' },
  ]},
  { id: 'man-truck-bus', name: 'MAN Truck & Bus', source: SOURCES['man-truck-bus'], models: [
    { id: 'man-tgx', name: 'TGX' }, { id: 'man-tgs', name: 'TGS' }, { id: 'man-tgm', name: 'TGM' }, { id: 'man-tgl', name: 'TGL' },
  ]},
  { id: 'renault-trucks', name: 'Renault Trucks', source: SOURCES['renault-trucks'], models: [
    { id: 'renault-t', name: 'T' }, { id: 'renault-c', name: 'C' }, { id: 'renault-k', name: 'K' }, { id: 'renault-d', name: 'D' },
  ]},
  { id: 'iveco', name: 'Iveco', source: SOURCES['iveco'], models: [
    { id: 'iveco-s-way', name: 'S-Way' }, { id: 'iveco-x-way', name: 'X-Way' }, { id: 'iveco-t-way', name: 'T-Way' }, { id: 'iveco-eurocargo', name: 'Eurocargo' },
  ]},
  { id: 'kenworth', name: 'Kenworth', source: SOURCES['kenworth'], models: [
    { id: 'kenworth-t680', name: 'T680' }, { id: 'kenworth-t880', name: 'T880' }, { id: 'kenworth-w990', name: 'W990' },
  ]},
  { id: 'peterbilt', name: 'Peterbilt', source: SOURCES['peterbilt'], models: [
    { id: 'peterbilt-579', name: '579' }, { id: 'peterbilt-389', name: '389' }, { id: 'peterbilt-567', name: '567' },
  ]},
  { id: 'freightliner', name: 'Freightliner', source: SOURCES['freightliner'], models: [
    { id: 'freightliner-cascadia', name: 'Cascadia' }, { id: 'freightliner-m2-106', name: 'M2 106' }, { id: 'freightliner-122sd', name: '122SD' },
  ]},
  { id: 'mack', name: 'Mack Trucks', source: SOURCES['mack'], models: [
    { id: 'mack-anthem', name: 'Anthem' }, { id: 'mack-pinnacle', name: 'Pinnacle' }, { id: 'mack-granite', name: 'Granite' },
  ]},
  { id: 'western-star', name: 'Western Star', source: SOURCES['western-star'], models: [
    { id: 'western-star-49x', name: '49X' }, { id: 'western-star-57x', name: '57X' }, { id: 'western-star-47x', name: '47X' },
  ]},
  { id: 'hino', name: 'Hino Trucks', source: SOURCES['hino'], models: [
    { id: 'hino-xl', name: 'XL Series' }, { id: 'hino-l', name: 'L Series' },
  ]},
  { id: 'isuzu', name: 'Isuzu Trucks', source: SOURCES['isuzu'], models: [
    { id: 'isuzu-n', name: 'N Series' }, { id: 'isuzu-f', name: 'F Series' }, { id: 'isuzu-g', name: 'G Series' },
  ]},
];

/** Public catalogue cross-refs only. No bare brand tokens. Deduped via uniqueRefs(). */
const VERIFIED_OEM_REFERENCES: Array<{
  manufacturerId: string;
  partTemplateSlug: string;
  referenceNumber: string;
  alternateNumbers?: string[];
  sourceUrl: string;
}> = [
  // —— Filters ——
  {
    manufacturerId: 'volvo-trucks', partTemplateSlug: 'oil-filter', referenceNumber: '21707134',
    alternateNumbers: ['21707136', '21170569', 'MANN W 11 025', 'FEBI 35425', 'HENGST H200W04', 'MAHLE OC 370'],
    sourceUrl: 'https://www.mann-filter.com/en/catalog/search-results/product.html/w11025_mann-filter.html',
  },
  {
    manufacturerId: 'renault-trucks', partTemplateSlug: 'oil-filter', referenceNumber: '5001846641',
    alternateNumbers: ['MANN W 11 025', 'FEBI 35425', '21707134'],
    sourceUrl: 'https://www.mann-filter.com/en/catalog/search-results/product.html/w11025_mann-filter.html',
  },
  {
    manufacturerId: 'mack', partTemplateSlug: 'oil-filter', referenceNumber: '21707136',
    alternateNumbers: ['MANN W 11 025', 'FEBI 35425', '21707134'],
    sourceUrl: 'https://www.mann-filter.com/en/catalog/search-results/product.html/w11025_mann-filter.html',
  },
  {
    manufacturerId: 'volvo-trucks', partTemplateSlug: 'air-filter', referenceNumber: '21377915',
    alternateNumbers: ['21914608', 'MANN C 25 990/1'],
    sourceUrl: 'https://www.mann-filter.com/',
  },
  {
    manufacturerId: 'volvo-trucks', partTemplateSlug: 'fuel-filter', referenceNumber: '20924422',
    alternateNumbers: ['SAMPA 033.141', 'MANN WDK 11 102/13', 'BOSCH F026402017'],
    sourceUrl: 'https://www.mann-filter.com/',
  },
  {
    manufacturerId: 'volvo-trucks', partTemplateSlug: 'cabin-filter', referenceNumber: '11007388',
    alternateNumbers: ['MANN CU 2785'],
    sourceUrl: 'https://www.mann-filter.com/en/catalog/search-results/product.html/cu2785_mann-filter.html',
  },
  {
    manufacturerId: 'mercedes-benz-trucks', partTemplateSlug: 'air-filter', referenceNumber: 'A0040949104',
    alternateNumbers: ['MANN C50005', '0040949104'],
    sourceUrl: 'https://www.mann-filter.com/',
  },
  {
    manufacturerId: 'mercedes-benz-trucks', partTemplateSlug: 'oil-filter', referenceNumber: 'A5411800009',
    alternateNumbers: ['MANN HU 12 140 x'],
    sourceUrl: 'https://www.mann-filter.com/',
  },
  {
    manufacturerId: 'daf-trucks', partTemplateSlug: 'fuel-filter', referenceNumber: '1699168',
    alternateNumbers: ['MANN PU 966/1 X', 'FEBI 108791', 'HENGST E82KP D36'],
    sourceUrl: 'https://www.mann-filter.com/',
  },
  {
    manufacturerId: 'daf-trucks', partTemplateSlug: 'oil-filter', referenceNumber: '2142288',
    alternateNumbers: ['MAHLE OX 1059D'],
    sourceUrl: 'https://www.mann-filter.com/',
  },

  // —— COJALI ——
  {
    manufacturerId: 'scania', partTemplateSlug: 'air-dryer', referenceNumber: '1774598',
    alternateNumbers: ['COJALI 6002007', 'FEBI 35304', 'WABCO 4329012282'],
    sourceUrl: 'https://plenty.parts/parts/cojali/all/6002007',
  },
  {
    manufacturerId: 'scania', partTemplateSlug: 'brake-valve', referenceNumber: '571190',
    alternateNumbers: ['COJALI 2212254', 'WABCO 4613151800'],
    sourceUrl: 'https://plenty.parts/',
  },
  {
    manufacturerId: 'scania', partTemplateSlug: 'air-spring', referenceNumber: '1738475',
    alternateNumbers: ['COJALI 2214400', 'FEBI 39335', 'WABCO 4640060007', 'HALDEX 612035011'],
    sourceUrl: 'https://plenty.parts/parts/cojali/all/2214400',
  },
  {
    manufacturerId: 'daf-trucks', partTemplateSlug: 'brake-valve', referenceNumber: '1677510',
    alternateNumbers: ['COJALI 2232002', 'WABCO 4800030040'],
    sourceUrl: 'https://www.ic24.uk/',
  },
  {
    manufacturerId: 'renault-trucks', partTemplateSlug: 'air-dryer', referenceNumber: '5001874313',
    alternateNumbers: ['COJALI 2310529', 'SAMPA 096.453'],
    sourceUrl: 'https://www.recambioscamion.com/',
  },
  // Fixed: 1607728 is air suspension valve, NOT service brake valve
  {
    manufacturerId: 'volvo-trucks', partTemplateSlug: 'air-spring', referenceNumber: '1607728',
    alternateNumbers: ['COJALI 2214400', 'FEBI 39335', 'WABCO 4640060000'],
    sourceUrl: 'https://plenty.parts/parts/cojali/all/2214400',
  },
  {
    manufacturerId: 'mercedes-benz-trucks', partTemplateSlug: 'brake-valve', referenceNumber: 'A0014300460',
    alternateNumbers: ['COJALI 6012001', 'WABCO 4613150052'],
    sourceUrl: 'https://www.intercars24.ee/',
  },

  // —— Brakes ——
  {
    manufacturerId: 'scania', partTemplateSlug: 'brake-pad', referenceNumber: '2325212',
    alternateNumbers: ['TEXTAR 2933101', 'WVA 29331'],
    sourceUrl: 'https://truckstopgroup.co.uk/',
  },
  {
    manufacturerId: 'scania', partTemplateSlug: 'brake-disc', referenceNumber: '1852817',
    alternateNumbers: ['1889543'],
    sourceUrl: 'https://www.scania.com/',
  },
  {
    manufacturerId: 'man-truck-bus', partTemplateSlug: 'brake-pad', referenceNumber: 'K059965K50',
    alternateNumbers: ['TEXTAR 2917701'],
    sourceUrl: 'https://www.knorr-bremse.com/',
  },
  {
    manufacturerId: 'daf-trucks', partTemplateSlug: 'brake-chamber', referenceNumber: '1387439',
    alternateNumbers: ['1726138', 'KNORR K034248'],
    sourceUrl: 'https://www.ebs.co.uk/',
  },

  // —— SAMPA (public Autodoc / listings) ——
  {
    manufacturerId: 'volvo-trucks', partTemplateSlug: 'radiator', referenceNumber: '033.487',
    alternateNumbers: ['SAMPA 033.487'],
    sourceUrl: 'https://trucks.autodoc.co.uk/spare-parts/hoses-pipes-flanges-200089/volvo/mf-sampa',
  },

  // —— ELRING ——
  {
    manufacturerId: 'volvo-trucks', partTemplateSlug: 'gasket-set', referenceNumber: '21539731',
    alternateNumbers: ['21768034', 'ELRING 899.340', 'AJUSA 52356300', 'REINZ 02-36855-02'],
    sourceUrl: 'https://www.elring.com/',
  },
  {
    manufacturerId: 'volvo-trucks', partTemplateSlug: 'gasket-set', referenceNumber: '477785',
    alternateNumbers: ['ELRING 428.610', 'AJUSA 59013000'],
    sourceUrl: 'https://www.elring.com/',
  },
  {
    manufacturerId: 'scania', partTemplateSlug: 'gasket-set', referenceNumber: '1112908',
    alternateNumbers: ['1114640', 'ELRING 832.619'],
    sourceUrl: 'https://www.elring.com/',
  },
  {
    manufacturerId: 'mercedes-benz-trucks', partTemplateSlug: 'gasket-set', referenceNumber: 'A0010742280',
    alternateNumbers: ['0010742280', 'ELRING 832.619'],
    sourceUrl: 'https://www.elring.com/',
  },

  // —— LEMA ——
  {
    manufacturerId: 'daf-trucks', partTemplateSlug: 'silentblock', referenceNumber: '1291233',
    alternateNumbers: ['LEMA 1003.01'],
    sourceUrl: 'https://www.lema-parts.it/',
  },
  {
    manufacturerId: 'daf-trucks', partTemplateSlug: 'silentblock', referenceNumber: '0366351',
    alternateNumbers: ['LEMA 1003.02'],
    sourceUrl: 'https://www.lema-parts.it/',
  },
  {
    manufacturerId: 'renault-trucks', partTemplateSlug: 'silentblock', referenceNumber: '5000815738',
    alternateNumbers: ['LEMA 1000.65'],
    sourceUrl: 'https://www.lema-parts.it/',
  },
  {
    manufacturerId: 'volvo-trucks', partTemplateSlug: 'silentblock', referenceNumber: '20532891',
    alternateNumbers: ['7420532891', 'ELRING 767.500'],
    sourceUrl: 'https://www.elring.com/',
  },
];

function unique(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}

function uniqueRefs(values: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const v of values) {
    if (!v) continue;
    const key = v.toLowerCase().replace(/[\s\-\/\.]/g, '');
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(v.trim());
  }
  return out;
}

function slugify(value: string): string {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
function parseList(value: string | undefined): string[] {
  if (!value) return [];
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}
function createSource(source: SourceDefinition, partId: string): Source {
  return { id: `${source.id}-${partId}`, partId, name: source.name, url: source.url, type: 'official', reliability: 'high' };
}

function createImages(partId: string, template: PartTemplate): PartImage[] {
  return resolveProductImages(template.slug, partId, template.name) as PartImage[];
}

function createVerifiedOEMReferences(
  partId: string,
  manufacturerId: string,
  templateSlug: string
): OEMReference[] {
  return VERIFIED_OEM_REFERENCES.filter(
    (item) => item.manufacturerId === manufacturerId && item.partTemplateSlug === templateSlug
  ).map((item, index) => ({
    id: `${partId}-oem-${index + 1}`,
    partId,
    manufacturerId,
    referenceNumber: item.referenceNumber,
    alternateNumbers: uniqueRefs(item.alternateNumbers ?? []),
    verificationStatus: 'verified' as const,
    source: item.sourceUrl,
    evidenceLevel: 'parts-catalog' as const,
  }));
}

function createPart(
  manufacturer: ManufacturerDefinition,
  model: ModelDefinition,
  template: PartTemplate
): Part {
  const id = `${model.id}-${template.slug}`;
  const tags = unique([...template.tags, slugify(manufacturer.id), slugify(model.name)]);
  const aftermarketBrands = unique(template.aftermarketBrands);
  const oemReferences = createVerifiedOEMReferences(id, manufacturer.id, template.slug);
  const crossLines = uniqueRefs(oemReferences.flatMap((oem) => oem.alternateNumbers ?? []));

  return {
    id,
    systemId: template.systemId,
    name: template.name,
    description:
      `${template.name} — ${manufacturer.name} ${model.name}. ` +
      (oemReferences.length
        ? 'OEM and cross-references indexed. Confirm fitment before ordering.'
        : 'Exact OEM requires manufacturer catalogue lookup.'),
    category: template.category,
    specifications: {
      type: template.name,
      vehicleType: 'Truck',
      manufacturer: manufacturer.name,
      manufacturerId: manufacturer.id,
      model: model.name,
      tags: tags.join(', '),
      aftermarketBrands: aftermarketBrands.join(', '),
      oemStatus: oemReferences.length > 0 ? 'verified' : 'pending-exact-application-lookup',
      crossReferences: crossLines.join(', '),
      referencePolicy: 'Public catalog numbers only — verify fitment before order',
    },
    images: createImages(id, template),
    oemReferences,
    crossReferences: [],
    compatibility: [],
    sources: [createSource(manufacturer.source, id)],
    verificationStatus: oemReferences.length > 0 ? 'verified' : 'needs-verification',
    createdAt: now,
    updatedAt: now,
  };
}

export const CATALOG_PARTS: Part[] = MANUFACTURERS.flatMap((manufacturer) =>
  manufacturer.models.flatMap((model) =>
    PART_TEMPLATES.map((template) => createPart(manufacturer, model, template))
  )
);

export const CATALOG_MANUFACTURERS = MANUFACTURERS.map(({ id, name }) => ({ id, name }));
export const CATALOG_MODELS = MANUFACTURERS.flatMap((m) =>
  m.models.map((model) => ({ id: model.id, manufacturerId: m.id, name: model.name }))
);
export const CATALOG_CATEGORIES = Array.from(new Set(CATALOG_PARTS.map((p) => p.category)));
export const CATALOG_SYSTEMS = Array.from(new Set(CATALOG_PARTS.map((p) => p.systemId)));
export const CATALOG_AFTERMARKET_BRANDS = Array.from(
  new Set(PART_TEMPLATES.flatMap((t) => t.aftermarketBrands))
).sort();

export const CATALOG_STATS = {
  manufacturers: MANUFACTURERS.length,
  models: CATALOG_MODELS.length,
  partTemplates: PART_TEMPLATES.length,
  parts: CATALOG_PARTS.length,
  categories: CATALOG_CATEGORIES.length,
  systems: CATALOG_SYSTEMS.length,
  aftermarketBrands: CATALOG_AFTERMARKET_BRANDS.length,
  verifiedOEMReferences: VERIFIED_OEM_REFERENCES.length,
};

function normalizeRef(value: string): string {
  return value.toLowerCase().replace(/[\s\-\/\.]/g, '');
}

export function searchCatalog(query: string): Part[] {
  const q = query.trim();
  if (!q) return CATALOG_PARTS;
  const normalized = q.toLowerCase();
  const compact = normalizeRef(q);
  return CATALOG_PARTS.filter((part) => {
    const refs = part.oemReferences.flatMap((oem) => [
      oem.referenceNumber,
      ...(oem.alternateNumbers ?? []),
    ]);
    if (refs.some((r) => r.toLowerCase().includes(normalized) || normalizeRef(r).includes(compact))) return true;
    const bag = [
      part.id, part.name, part.category, part.description ?? '',
      part.specifications?.manufacturer ?? '', part.specifications?.model ?? '',
      part.specifications?.crossReferences ?? '',
      ...parseList(part.specifications?.tags),
      ...parseList(part.specifications?.aftermarketBrands),
    ].join(' ').toLowerCase();
    return bag.includes(normalized);
  });
}

export function getPartsByManufacturer(manufacturerId: string): Part[] {
  const n = manufacturerId.trim().toLowerCase();
  return CATALOG_PARTS.filter((p) => p.specifications?.manufacturerId?.toLowerCase() === n);
}
export function getPartsByModel(manufacturerId: string, model: string): Part[] {
  const m = manufacturerId.trim().toLowerCase();
  const modelName = model.trim().toLowerCase();
  return CATALOG_PARTS.filter(
    (p) =>
      p.specifications?.manufacturerId?.toLowerCase() === m &&
      p.specifications?.model?.toLowerCase() === modelName
  );
}
export function getPartsByCategory(category: string): Part[] {
  const n = category.trim().toLowerCase();
  return CATALOG_PARTS.filter((p) => p.category.toLowerCase() === n);
}
export function getPartsBySystem(systemId: string): Part[] {
  return CATALOG_PARTS.filter((p) => p.systemId === systemId);
}
export function getPartsByAftermarketBrand(brand: string): Part[] {
  const n = brand.trim().toLowerCase();
  return CATALOG_PARTS.filter((p) =>
    parseList(p.specifications?.aftermarketBrands).some((b) => b.toLowerCase() === n)
  );
}
export function getPartsByTag(tag: string): Part[] {
  const n = tag.trim().toLowerCase();
  return CATALOG_PARTS.filter((p) =>
    parseList(p.specifications?.tags).some((t) => t.toLowerCase() === n)
  );
}
export function getPartsByOEM(referenceNumber: string): Part[] {
  const n = referenceNumber.trim().toLowerCase();
  const c = normalizeRef(referenceNumber);
  return CATALOG_PARTS.filter((part) =>
    part.oemReferences.some((oem) => {
      const all = [oem.referenceNumber, ...(oem.alternateNumbers ?? [])];
      return all.some((r) => r.toLowerCase() === n || normalizeRef(r) === c || normalizeRef(r).includes(c));
    })
  );
}
export function getPartById(id: string): Part | undefined {
  return CATALOG_PARTS.find((p) => p.id === id);
}
export function getVerifiedOEMParts(): Part[] {
  return CATALOG_PARTS.filter((p) => p.oemReferences.length > 0);
}
