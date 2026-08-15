import { Part, OEMReference, Source, PartImage } from '@/types';

const now = '2026-08-15T00:00:00.000Z';

/**
 * NTParts catalog — OEM numbers are NEVER invented.
 * Only numbers published in public catalogs (MANN, FEBI, SAMPA, Textar, Knorr, Elring, Cojali…).
 * Always verify fitment with vehicle config / VIN before ordering.
 */

type SystemId =
  | 'brake-system' | 'engine-system' | 'suspension-system' | 'transmission-system'
  | 'electrical-system' | 'cooling-system' | 'exhaust-system' | 'steering-system'
  | 'cabin-system' | 'other-system';

type SourceDefinition = { id: string; name: string; url: string };
type PartTemplate = {
  slug: string; name: string; category: string; systemId: SystemId;
  tags: string[]; aftermarketBrands: string[]; imageQuery: string;
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

const FILTER_BRANDS = ['MANN-FILTER', 'MAHLE', 'HENGST', 'DONALDSON', 'UFI', 'PURFLUX', 'FEBI', 'SAMPA'];
const BRAKE_BRANDS = ['KNORR-BREMSE', 'WABCO', 'HALDEX', 'TRW', 'BREMBO', 'TEXTAR', 'FEBI', 'SAMPA', 'VADEN', 'COJALI'];

const PART_TEMPLATES: PartTemplate[] = [
  { slug: 'brake-disc', name: 'Brake Disc', category: 'Brakes', systemId: 'brake-system', tags: ['brake', 'disc'], aftermarketBrands: BRAKE_BRANDS.slice(0, 6), imageQuery: 'truck-brake-disc' },
  { slug: 'brake-pad', name: 'Brake Pad', category: 'Brakes', systemId: 'brake-system', tags: ['brake', 'pad'], aftermarketBrands: ['TEXTAR', 'FEBI', 'KNORR-BREMSE', 'SAMPA', 'VADEN'], imageQuery: 'truck-brake-pads' },
  { slug: 'brake-caliper', name: 'Brake Caliper', category: 'Brakes', systemId: 'brake-system', tags: ['brake', 'caliper'], aftermarketBrands: ['KNORR-BREMSE', 'WABCO', 'VADEN', 'SAMPA'], imageQuery: 'truck-brake-caliper' },
  { slug: 'brake-chamber', name: 'Brake Chamber', category: 'Brakes', systemId: 'brake-system', tags: ['brake', 'air', 'chamber'], aftermarketBrands: ['KNORR-BREMSE', 'WABCO', 'HALDEX', 'COJALI'], imageQuery: 'truck-brake-chamber' },
  { slug: 'brake-valve', name: 'Brake Valve', category: 'Brakes', systemId: 'brake-system', tags: ['brake', 'valve'], aftermarketBrands: ['KNORR-BREMSE', 'WABCO', 'COJALI', 'SAMPA'], imageQuery: 'truck-air-brake-valve' },
  { slug: 'air-dryer', name: 'Air Dryer', category: 'Brakes', systemId: 'brake-system', tags: ['air', 'dryer'], aftermarketBrands: ['KNORR-BREMSE', 'WABCO', 'HALDEX', 'COJALI', 'SAMPA'], imageQuery: 'truck-air-dryer' },
  { slug: 'oil-filter', name: 'Oil Filter', category: 'Filters', systemId: 'engine-system', tags: ['filter', 'oil'], aftermarketBrands: FILTER_BRANDS, imageQuery: 'truck-oil-filter' },
  { slug: 'air-filter', name: 'Air Filter', category: 'Filters', systemId: 'engine-system', tags: ['filter', 'air'], aftermarketBrands: FILTER_BRANDS, imageQuery: 'truck-air-filter' },
  { slug: 'fuel-filter', name: 'Fuel Filter', category: 'Filters', systemId: 'engine-system', tags: ['filter', 'fuel'], aftermarketBrands: FILTER_BRANDS, imageQuery: 'truck-fuel-filter' },
  { slug: 'cabin-filter', name: 'Cabin Air Filter', category: 'Filters', systemId: 'cabin-system', tags: ['filter', 'cabin'], aftermarketBrands: ['MANN-FILTER', 'MAHLE', 'HENGST', 'FEBI'], imageQuery: 'cabin-air-filter' },
  { slug: 'water-pump', name: 'Water Pump', category: 'Cooling System', systemId: 'cooling-system', tags: ['water', 'pump'], aftermarketBrands: ['MAHLE', 'GATES', 'FEBI', 'SKF'], imageQuery: 'truck-water-pump' },
  { slug: 'thermostat', name: 'Thermostat', category: 'Cooling System', systemId: 'cooling-system', tags: ['thermostat'], aftermarketBrands: ['MAHLE', 'GATES', 'FEBI'], imageQuery: 'engine-thermostat' },
  { slug: 'radiator', name: 'Radiator', category: 'Cooling System', systemId: 'cooling-system', tags: ['radiator'], aftermarketBrands: ['MAHLE', 'NRF', 'BEHR'], imageQuery: 'truck-radiator' },
  { slug: 'clutch-kit', name: 'Clutch Kit', category: 'Transmission', systemId: 'transmission-system', tags: ['clutch'], aftermarketBrands: ['SACHS', 'LuK', 'VALEO', 'SAMPA'], imageQuery: 'truck-clutch-kit' },
  { slug: 'shock-absorber', name: 'Shock Absorber', category: 'Suspension', systemId: 'suspension-system', tags: ['shock'], aftermarketBrands: ['SACHS', 'MONROE', 'ZF', 'SAMPA', 'FEBI'], imageQuery: 'truck-shock-absorber' },
  { slug: 'air-spring', name: 'Air Spring', category: 'Suspension', systemId: 'suspension-system', tags: ['air', 'spring'], aftermarketBrands: ['CONTINENTAL', 'FIRESTONE', 'SAMPA'], imageQuery: 'truck-air-spring' },
  { slug: 'starter-motor', name: 'Starter Motor', category: 'Electrical', systemId: 'electrical-system', tags: ['starter'], aftermarketBrands: ['BOSCH', 'HELLA', 'DENSO', 'VALEO'], imageQuery: 'truck-starter-motor' },
  { slug: 'alternator', name: 'Alternator', category: 'Electrical', systemId: 'electrical-system', tags: ['alternator'], aftermarketBrands: ['BOSCH', 'HELLA', 'DENSO', 'VALEO'], imageQuery: 'truck-alternator' },
  { slug: 'turbocharger', name: 'Turbocharger', category: 'Engine', systemId: 'engine-system', tags: ['turbo'], aftermarketBrands: ['GARRETT', 'BORGWARNER'], imageQuery: 'truck-turbocharger' },
  { slug: 'injector', name: 'Fuel Injector', category: 'Engine', systemId: 'engine-system', tags: ['injector'], aftermarketBrands: ['BOSCH', 'DENSO', 'DELPHI'], imageQuery: 'diesel-fuel-injector' },
  { slug: 'drive-belt', name: 'Drive Belt', category: 'Engine', systemId: 'engine-system', tags: ['belt'], aftermarketBrands: ['GATES', 'DAYCO', 'CONTITECH'], imageQuery: 'serpentine-belt' },
  { slug: 'mirror', name: 'Mirror Assembly', category: 'Cabin', systemId: 'cabin-system', tags: ['mirror'], aftermarketBrands: ['HELLA', 'MEKRA', 'FEBI', 'SAMPA'], imageQuery: 'truck-side-mirror' },
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

/** Published OEM + aftermarket cross numbers (MANN, FEBI, SAMPA, HENGST, ELRING, COJALI, TEXTAR, KNORR…) */
const VERIFIED_OEM_REFERENCES: Array<{
  manufacturerId: string;
  partTemplateSlug: string;
  referenceNumber: string;
  alternateNumbers?: string[];
  sourceUrl: string;
}> = [
  // VOLVO — Oil filter (MANN W 11 025 family)
  {
    manufacturerId: 'volvo-trucks', partTemplateSlug: 'oil-filter', referenceNumber: '21707134',
    alternateNumbers: [
      '21707136', '21170569', '23658111', '21707133', '478736', '478362',
      'MANN W 11 025', 'W11025', 'MANN W 11 102/36',
      'FEBI 35425', 'FEBI 39215', 'FEBI 27799',
      'HENGST H200W04', 'HENGST H200W41', 'MAHLE OC 370',
      'BOSCH F026407043', 'DONALDSON P550519', 'FLEETGUARD LF17503',
      'KNORR K118000', 'SAMPA', '1R-0658',
    ],
    sourceUrl: 'https://www.mann-filter.com/',
  },
  {
    manufacturerId: 'volvo-trucks', partTemplateSlug: 'air-filter', referenceNumber: '21377915',
    alternateNumbers: ['21914608', 'MANN C 25 990/1', 'MAHLE LX', 'HENGST'],
    sourceUrl: 'https://partsandfilters.co.uk/volvo/',
  },
  {
    manufacturerId: 'volvo-trucks', partTemplateSlug: 'fuel-filter', referenceNumber: '20924422',
    alternateNumbers: [
      '20972293', '21879886', '22480372', '20815011',
      'MANN WDK 11 102/13', 'MANN WDK11102/23',
      'SAMPA 033.141', 'BOSCH F026402017', 'HENGST H200WDK',
      'MAHLE KC251', 'DONALDSON P550529', 'FLEETGUARD FF5507',
    ],
    sourceUrl: 'https://www.sampa.com/en/productdetail?code=033.141',
  },
  {
    manufacturerId: 'volvo-trucks', partTemplateSlug: 'cabin-filter', referenceNumber: '11007388',
    alternateNumbers: ['1584575', '4771477', 'MANN CU 2785', 'FEBI', 'MAHLE LA'],
    sourceUrl: 'https://partsandfilters.co.uk/volvo/',
  },
  {
    manufacturerId: 'volvo-trucks', partTemplateSlug: 'air-dryer', referenceNumber: '20539275',
    alternateNumbers: ['KNORR LA', 'WABCO', 'COJALI', 'SAMPA 096.453'],
    sourceUrl: 'https://www.knorr-bremse.com/',
  },

  // SCANIA
  {
    manufacturerId: 'scania', partTemplateSlug: 'brake-pad', referenceNumber: '2325212',
    alternateNumbers: [
      '2271804', '1856108', '1521979', '1734529', '1890861', '1527633',
      'TEXTAR 2933101', 'WVA 29331', 'Knorr SN7-HP', 'K071018K50',
      'FEBI', 'SAMPA', 'VADEN',
    ],
    sourceUrl: 'https://truckstopgroup.co.uk/products/2933101-textar-brake-pad-set-scania',
  },
  {
    manufacturerId: 'scania', partTemplateSlug: 'brake-disc', referenceNumber: '1852817',
    alternateNumbers: ['1889543', '1402272', '1386686', 'FEBI', 'SAMPA'],
    sourceUrl: 'https://www.scania.com/',
  },
  {
    manufacturerId: 'scania', partTemplateSlug: 'brake-valve', referenceNumber: '571190',
    alternateNumbers: [
      '1324663', '1324664', '1324662', '10571189',
      'COJALI 2212254', 'WABCO 4613151800', 'KNORR 0481064603000', 'DAF 1505071',
    ],
    sourceUrl: 'https://plenty.parts/parts/cojali/all/2212254',
  },
  {
    manufacturerId: 'scania', partTemplateSlug: 'oil-filter', referenceNumber: '15126069',
    alternateNumbers: ['MANN WDK 11 102/13', 'SAMPA 033.141'],
    sourceUrl: 'https://www.sampa.com/',
  },

  // MERCEDES
  {
    manufacturerId: 'mercedes-benz-trucks', partTemplateSlug: 'air-filter', referenceNumber: 'A0040949104',
    alternateNumbers: ['0040949104', '0040949704', '0040946904', 'MANN C50005', 'MAHLE', 'HENGST'],
    sourceUrl: 'https://www.mann-filter.com/',
  },
  {
    manufacturerId: 'mercedes-benz-trucks', partTemplateSlug: 'oil-filter', referenceNumber: 'A5411800009',
    alternateNumbers: ['5411800009', 'A5411840225', '4571800009', 'MANN HU 12 140 x', 'HU12140X', 'MAHLE', 'FEBI'],
    sourceUrl: 'https://www.mann-filter.com/',
  },
  {
    manufacturerId: 'mercedes-benz-trucks', partTemplateSlug: 'cabin-filter', referenceNumber: 'A9608300518',
    alternateNumbers: ['9608300518', '9608300818', 'MANN CU 32 012/1', 'FEBI'],
    sourceUrl: 'https://www.mann-filter.com/',
  },

  // DAF
  {
    manufacturerId: 'daf-trucks', partTemplateSlug: 'fuel-filter', referenceNumber: '1699168',
    alternateNumbers: [
      '1537109', '1616361', '1643080', '1857677', '1433649',
      'MANN PU 966/1 X', 'BOSCH F026402032', 'HENGST E82KP D36',
      'FEBI 108791', 'FLEETGUARD FF5695', 'SAMPA',
    ],
    sourceUrl: 'https://www.mahle-aftermarket.com/',
  },
  {
    manufacturerId: 'daf-trucks', partTemplateSlug: 'fuel-filter', referenceNumber: '1529638',
    alternateNumbers: ['1345335', 'Fleetguard P550810', 'MANN WDK925'],
    sourceUrl: 'https://www.mann-filter.com/',
  },
  {
    manufacturerId: 'daf-trucks', partTemplateSlug: 'oil-filter', referenceNumber: '2142288',
    alternateNumbers: ['MAHLE OX 1059D', 'MANN', 'HENGST', 'FEBI'],
    sourceUrl: 'https://www.mahle-aftermarket.com/',
  },
  {
    manufacturerId: 'daf-trucks', partTemplateSlug: 'brake-valve', referenceNumber: '1505071',
    alternateNumbers: ['1504971', 'COJALI 2212254', 'WABCO 4613151800', 'SCANIA 571190'],
    sourceUrl: 'https://plenty.parts/parts/cojali/all/2212254',
  },

  // RENAULT
  {
    manufacturerId: 'renault-trucks', partTemplateSlug: 'oil-filter', referenceNumber: '5001846641',
    alternateNumbers: [
      '5001846642', '7420709459', '7421561278', '21707136',
      'MANN W 11 025', 'FEBI 35425', 'HENGST H200W04',
    ],
    sourceUrl: 'https://www.mann-filter.com/',
  },
  {
    manufacturerId: 'renault-trucks', partTemplateSlug: 'air-dryer', referenceNumber: '5001874313',
    alternateNumbers: [
      '5001874310', '5001865738', 'COJALI 2310529', 'SAMPA 096.453',
      'KNORR K001281N50', 'KNORR LA8067',
    ],
    sourceUrl: 'https://www.recambioscamion.com/',
  },
  {
    manufacturerId: 'renault-trucks', partTemplateSlug: 'fuel-filter', referenceNumber: '7420976001',
    alternateNumbers: ['SAMPA 033.141', 'MANN WDK11102', 'VOLVO 22480372'],
    sourceUrl: 'https://www.sampa.com/',
  },

  // MAN
  {
    manufacturerId: 'man-truck-bus', partTemplateSlug: 'brake-pad', referenceNumber: 'K059965K50',
    alternateNumbers: ['WVA 29253', 'TEXTAR', 'Knorr SB/SN7', 'FEBI', 'SAMPA'],
    sourceUrl: 'https://www.knorr-bremse.com/',
  },
  {
    manufacturerId: 'man-truck-bus', partTemplateSlug: 'fuel-filter', referenceNumber: '51125030053',
    alternateNumbers: ['51125030071', 'SAMPA 033.141', 'MANN WDK11102', 'HENGST H200WDK'],
    sourceUrl: 'https://www.sampa.com/',
  },

  // MACK (shares Volvo filter family)
  {
    manufacturerId: 'mack', partTemplateSlug: 'oil-filter', referenceNumber: '21707136',
    alternateNumbers: ['20539275', '23658111', '484GB3191C', 'MANN W 11 025', 'FEBI 35425'],
    sourceUrl: 'https://www.mann-filter.com/',
  },
];

function unique(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
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
  // Category-style public images (Unsplash) — illustrative, not product photography of a specific OE box
  const seed = encodeURIComponent(template.imageQuery);
  return [
    {
      id: `${partId}-img-1`,
      partId,
      url: `https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80&auto=format&fit=crop`,
      title: template.name,
      alt: `${template.name} — industrial truck part`,
      isPrimary: true,
      source: 'unsplash',
    },
  ];
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
    alternateNumbers: item.alternateNumbers ?? [],
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
  const crossLines = unique(oemReferences.flatMap((oem) => oem.alternateNumbers ?? []));

  return {
    id,
    systemId: template.systemId,
    name: template.name,
    description:
      `${template.name} for ${manufacturer.name} ${model.name}. ` +
      (oemReferences.length
        ? `OEM and published cross-references (MANN, FEBI, SAMPA, HENGST, COJALI, TEXTAR…) are indexed for search. Confirm fitment before ordering.`
        : `Exact OEM requires manufacturer catalog lookup for this configuration.`),
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

/** Normalize reference for fuzzy match: strip spaces/dashes, lowercase */
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
    const refHit = refs.some(
      (r) =>
        r.toLowerCase().includes(normalized) ||
        normalizeRef(r).includes(compact) ||
        compact.includes(normalizeRef(r))
    );
    if (refHit) return true;

    const bag = [
      part.id,
      part.name,
      part.category,
      part.description ?? '',
      part.specifications?.manufacturer ?? '',
      part.specifications?.model ?? '',
      part.specifications?.crossReferences ?? '',
      ...parseList(part.specifications?.tags),
      ...parseList(part.specifications?.aftermarketBrands),
    ]
      .join(' ')
      .toLowerCase();
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
      return all.some(
        (r) => r.toLowerCase() === n || normalizeRef(r) === c || normalizeRef(r).includes(c)
      );
    })
  );
}
export function getPartById(id: string): Part | undefined {
  return CATALOG_PARTS.find((p) => p.id === id);
}
export function getVerifiedOEMParts(): Part[] {
  return CATALOG_PARTS.filter((p) => p.oemReferences.length > 0);
}
