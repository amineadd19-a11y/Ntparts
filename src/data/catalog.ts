import { Part, OEMReference, Source } from '@/types';

const now = '2026-08-13T00:00:00.000Z';

/**
 * TruckParts AI — Large structured truck-parts catalog.
 *
 * Data policy:
 * 1. OEM numbers are NEVER guessed.
 * 2. A part generated here is a catalog/search template, not proof of fitment.
 * 3. Exact OEM references require manufacturer catalog lookup using the exact
 *    truck configuration (model, generation, engine, axle/chassis and VIN when
 *    required).
 * 4. Aftermarket brands are category-level references only; they are NOT
 *    presented as confirmed cross-references to a specific OEM number.
 *
 * The current Part type stores specifications as Record<string, string>, so
 * arrays are serialized as comma-separated strings.
 */

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
type PartTemplate = { slug: string; name: string; category: string; systemId: SystemId; tags: string[]; aftermarketBrands: string[] };
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

const FILTER_BRANDS = ['MANN-FILTER', 'MAHLE', 'HENGST', 'DONALDSON', 'UFI', 'PURFLUX'];
const BRAKE_BRANDS = ['KNORR-BREMSE', 'WABCO', 'HALDEX', 'TRW', 'BREMBO', 'TEXTAR', 'FEBI'];
const SUSPENSION_BRANDS = ['SACHS', 'ZF', 'LEMFÖRDER', 'FEBI', 'SKF', 'CONTINENTAL', 'FIRESTONE'];
const CLUTCH_BRANDS = ['SACHS', 'LuK', 'VALEO', 'ZF'];
const ELECTRICAL_BRANDS = ['BOSCH', 'HELLA', 'DENSO', 'VALEO', 'VARTA', 'EXIDE'];
const COOLING_BRANDS = ['MAHLE', 'BEHR', 'NRF', 'GATES', 'DAYCO'];
const ENGINE_BRANDS = ['BOSCH', 'DENSO', 'DELPHI', 'MAHLE', 'GATES', 'DAYCO', 'CONTITECH', 'INA', 'SKF', 'FAG'];
const STEERING_BRANDS = ['ZF', 'TRW', 'LEMFÖRDER', 'FEBI'];
const EXHAUST_BRANDS = ['HJS', 'BOSAL', 'FEBI'];
const CABIN_BRANDS = ['HELLA', 'VALEO', 'MEKRA', 'FEBI'];

const PART_TEMPLATES: PartTemplate[] = [
  { slug: 'brake-disc', name: 'Brake Disc', category: 'Brakes', systemId: 'brake-system', tags: ['brake', 'disc'], aftermarketBrands: ['BREMBO', 'TRW', 'FEBI', 'KNORR-BREMSE'] },
  { slug: 'brake-pad', name: 'Brake Pad', category: 'Brakes', systemId: 'brake-system', tags: ['brake', 'pad'], aftermarketBrands: ['TRW', 'BREMBO', 'FEBI', 'TEXTAR'] },
  { slug: 'brake-drum', name: 'Brake Drum', category: 'Brakes', systemId: 'brake-system', tags: ['brake', 'drum'], aftermarketBrands: ['BREMBO', 'FEBI', 'TRW'] },
  { slug: 'brake-lining', name: 'Brake Lining', category: 'Brakes', systemId: 'brake-system', tags: ['brake', 'lining'], aftermarketBrands: ['TEXTAR', 'TRW', 'FEBI'] },
  { slug: 'brake-caliper', name: 'Brake Caliper', category: 'Brakes', systemId: 'brake-system', tags: ['brake', 'caliper'], aftermarketBrands: ['TRW', 'BREMBO', 'FEBI'] },
  { slug: 'brake-chamber', name: 'Brake Chamber', category: 'Brakes', systemId: 'brake-system', tags: ['brake', 'air', 'chamber'], aftermarketBrands: ['KNORR-BREMSE', 'WABCO', 'HALDEX'] },
  { slug: 'brake-valve', name: 'Brake Valve', category: 'Brakes', systemId: 'brake-system', tags: ['brake', 'valve'], aftermarketBrands: ['KNORR-BREMSE', 'WABCO', 'HALDEX'] },
  { slug: 'abs-sensor', name: 'ABS Sensor', category: 'Brakes', systemId: 'brake-system', tags: ['abs', 'sensor', 'brake'], aftermarketBrands: ['BOSCH', 'KNORR-BREMSE', 'WABCO'] },
  { slug: 'air-dryer', name: 'Air Dryer', category: 'Brakes', systemId: 'brake-system', tags: ['air', 'dryer', 'brake'], aftermarketBrands: ['KNORR-BREMSE', 'WABCO', 'HALDEX'] },
  { slug: 'compressor', name: 'Air Compressor', category: 'Engine', systemId: 'engine-system', tags: ['air', 'compressor'], aftermarketBrands: ['KNORR-BREMSE', 'WABCO'] },
  { slug: 'oil-filter', name: 'Oil Filter', category: 'Filters', systemId: 'engine-system', tags: ['filter', 'oil'], aftermarketBrands: FILTER_BRANDS.slice(0, 5) },
  { slug: 'air-filter', name: 'Air Filter', category: 'Filters', systemId: 'engine-system', tags: ['filter', 'air'], aftermarketBrands: FILTER_BRANDS.slice(0, 5) },
  { slug: 'fuel-filter', name: 'Fuel Filter', category: 'Filters', systemId: 'engine-system', tags: ['filter', 'fuel'], aftermarketBrands: FILTER_BRANDS.slice(0, 5) },
  { slug: 'cabin-filter', name: 'Cabin Air Filter', category: 'Filters', systemId: 'cabin-system', tags: ['filter', 'cabin'], aftermarketBrands: FILTER_BRANDS.slice(0, 4) },
  { slug: 'hydraulic-filter', name: 'Hydraulic Filter', category: 'Filters', systemId: 'other-system', tags: ['filter', 'hydraulic'], aftermarketBrands: ['DONALDSON', 'MAHLE', 'MANN-FILTER'] },
  { slug: 'fuel-pump', name: 'Fuel Pump', category: 'Engine', systemId: 'engine-system', tags: ['fuel', 'pump'], aftermarketBrands: ['BOSCH', 'DENSO'] },
  { slug: 'injector', name: 'Fuel Injector', category: 'Engine', systemId: 'engine-system', tags: ['fuel', 'injector'], aftermarketBrands: ['BOSCH', 'DENSO', 'DELPHI'] },
  { slug: 'high-pressure-pump', name: 'High Pressure Fuel Pump', category: 'Engine', systemId: 'engine-system', tags: ['fuel', 'high pressure', 'pump'], aftermarketBrands: ['BOSCH', 'DENSO', 'DELPHI'] },
  { slug: 'turbocharger', name: 'Turbocharger', category: 'Engine', systemId: 'engine-system', tags: ['turbo', 'charger'], aftermarketBrands: ['GARRETT', 'BORGWARNER'] },
  { slug: 'turbo-actuator', name: 'Turbo Actuator', category: 'Engine', systemId: 'engine-system', tags: ['turbo', 'actuator'], aftermarketBrands: ['GARRETT', 'BORGWARNER'] },
  { slug: 'egr-valve', name: 'EGR Valve', category: 'Engine', systemId: 'engine-system', tags: ['egr', 'valve'], aftermarketBrands: ['BOSCH', 'PIERBURG', 'FEBI'] },
  { slug: 'oil-pump', name: 'Oil Pump', category: 'Engine', systemId: 'engine-system', tags: ['oil', 'pump'], aftermarketBrands: ['FEBI', 'MAHLE'] },
  { slug: 'water-pump', name: 'Water Pump', category: 'Cooling System', systemId: 'cooling-system', tags: ['water', 'pump', 'cooling'], aftermarketBrands: ['MAHLE', 'GATES', 'DAYCO', 'SKF'] },
  { slug: 'thermostat', name: 'Thermostat', category: 'Cooling System', systemId: 'cooling-system', tags: ['thermostat', 'cooling'], aftermarketBrands: ['MAHLE', 'GATES', 'FEBI'] },
  { slug: 'radiator', name: 'Radiator', category: 'Cooling System', systemId: 'cooling-system', tags: ['radiator', 'cooling'], aftermarketBrands: ['MAHLE', 'NRF', 'BEHR'] },
  { slug: 'intercooler', name: 'Intercooler', category: 'Cooling System', systemId: 'cooling-system', tags: ['intercooler', 'charge air'], aftermarketBrands: ['MAHLE', 'NRF'] },
  { slug: 'fan-clutch', name: 'Fan Clutch', category: 'Cooling System', systemId: 'cooling-system', tags: ['fan', 'clutch', 'cooling'], aftermarketBrands: ['MAHLE', 'BEHR', 'BORGWARNER'] },
  { slug: 'coolant-hose', name: 'Coolant Hose', category: 'Cooling System', systemId: 'cooling-system', tags: ['coolant', 'hose'], aftermarketBrands: ['GATES', 'DAYCO', 'FEBI'] },
  { slug: 'drive-belt', name: 'Drive Belt', category: 'Engine', systemId: 'engine-system', tags: ['drive', 'belt'], aftermarketBrands: ['GATES', 'DAYCO', 'CONTITECH'] },
  { slug: 'belt-tensioner', name: 'Belt Tensioner', category: 'Engine', systemId: 'engine-system', tags: ['belt', 'tensioner'], aftermarketBrands: ['INA', 'GATES', 'DAYCO'] },
  { slug: 'timing-kit', name: 'Timing Belt/Chain Kit', category: 'Engine', systemId: 'engine-system', tags: ['timing', 'kit'], aftermarketBrands: ['CONTITECH', 'GATES', 'DAYCO', 'INA'] },
  { slug: 'engine-mount', name: 'Engine Mount', category: 'Engine', systemId: 'engine-system', tags: ['engine', 'mount'], aftermarketBrands: ['FEBI', 'LEMFÖRDER'] },
  { slug: 'clutch-kit', name: 'Clutch Kit', category: 'Transmission', systemId: 'transmission-system', tags: ['clutch', 'kit'], aftermarketBrands: ['SACHS', 'LuK', 'VALEO'] },
  { slug: 'clutch-disc', name: 'Clutch Disc', category: 'Transmission', systemId: 'transmission-system', tags: ['clutch', 'disc'], aftermarketBrands: ['SACHS', 'LuK', 'VALEO'] },
  { slug: 'clutch-cover', name: 'Clutch Cover', category: 'Transmission', systemId: 'transmission-system', tags: ['clutch', 'cover'], aftermarketBrands: ['SACHS', 'LuK', 'VALEO'] },
  { slug: 'release-bearing', name: 'Release Bearing', category: 'Transmission', systemId: 'transmission-system', tags: ['clutch', 'bearing'], aftermarketBrands: ['SACHS', 'SKF', 'FAG'] },
  { slug: 'clutch-slave-cylinder', name: 'Clutch Slave Cylinder', category: 'Transmission', systemId: 'transmission-system', tags: ['clutch', 'hydraulic'], aftermarketBrands: ['ZF', 'SACHS', 'TRW'] },
  { slug: 'gearbox', name: 'Gearbox', category: 'Transmission', systemId: 'transmission-system', tags: ['gearbox', 'transmission'], aftermarketBrands: ['ZF'] },
  { slug: 'gearbox-filter', name: 'Transmission Filter', category: 'Transmission', systemId: 'transmission-system', tags: ['gearbox', 'filter'], aftermarketBrands: ['ZF', 'MANN-FILTER'] },
  { slug: 'propeller-shaft', name: 'Propeller Shaft', category: 'Transmission', systemId: 'transmission-system', tags: ['propeller', 'shaft'], aftermarketBrands: ['GKN', 'SPICER'] },
  { slug: 'universal-joint', name: 'Universal Joint', category: 'Transmission', systemId: 'transmission-system', tags: ['universal', 'joint', 'driveshaft'], aftermarketBrands: ['SPICER', 'GKN'] },
  { slug: 'shock-absorber', name: 'Shock Absorber', category: 'Suspension', systemId: 'suspension-system', tags: ['shock', 'absorber'], aftermarketBrands: ['SACHS', 'MONROE', 'ZF'] },
  { slug: 'air-spring', name: 'Air Spring', category: 'Suspension', systemId: 'suspension-system', tags: ['air', 'spring'], aftermarketBrands: ['CONTINENTAL', 'FIRESTONE', 'GOODYEAR'] },
  { slug: 'cab-air-spring', name: 'Cab Air Spring', category: 'Cabin', systemId: 'cabin-system', tags: ['cab', 'air', 'spring'], aftermarketBrands: ['CONTINENTAL', 'FIRESTONE'] },
  { slug: 'control-arm', name: 'Control Arm', category: 'Suspension', systemId: 'suspension-system', tags: ['control', 'arm'], aftermarketBrands: ['LEMFÖRDER', 'TRW', 'FEBI'] },
  { slug: 'stabilizer-link', name: 'Stabilizer Link', category: 'Suspension', systemId: 'suspension-system', tags: ['stabilizer', 'link'], aftermarketBrands: ['LEMFÖRDER', 'TRW', 'FEBI'] },
  { slug: 'leaf-spring', name: 'Leaf Spring', category: 'Suspension', systemId: 'suspension-system', tags: ['leaf', 'spring'], aftermarketBrands: ['SACHS', 'FEBI'] },
  { slug: 'steering-pump', name: 'Steering Pump', category: 'Steering', systemId: 'steering-system', tags: ['steering', 'pump'], aftermarketBrands: ['ZF', 'TRW'] },
  { slug: 'steering-gear', name: 'Steering Gear', category: 'Steering', systemId: 'steering-system', tags: ['steering', 'gear'], aftermarketBrands: ['ZF', 'TRW'] },
  { slug: 'tie-rod', name: 'Tie Rod', category: 'Steering', systemId: 'steering-system', tags: ['tie', 'rod'], aftermarketBrands: ['LEMFÖRDER', 'TRW', 'FEBI'] },
  { slug: 'drag-link', name: 'Drag Link', category: 'Steering', systemId: 'steering-system', tags: ['drag', 'link'], aftermarketBrands: ['LEMFÖRDER', 'TRW', 'FEBI'] },
  { slug: 'starter-motor', name: 'Starter Motor', category: 'Electrical', systemId: 'electrical-system', tags: ['starter', 'motor'], aftermarketBrands: ['BOSCH', 'HELLA', 'DENSO', 'VALEO'] },
  { slug: 'alternator', name: 'Alternator', category: 'Electrical', systemId: 'electrical-system', tags: ['alternator'], aftermarketBrands: ['BOSCH', 'HELLA', 'DENSO', 'VALEO'] },
  { slug: 'battery', name: 'Truck Battery', category: 'Electrical', systemId: 'electrical-system', tags: ['battery'], aftermarketBrands: ['VARTA', 'BOSCH', 'EXIDE'] },
  { slug: 'glow-plug', name: 'Glow Plug', category: 'Electrical', systemId: 'electrical-system', tags: ['glow', 'plug'], aftermarketBrands: ['BOSCH', 'DENSO'] },
  { slug: 'engine-sensor', name: 'Engine Sensor', category: 'Electrical', systemId: 'electrical-system', tags: ['sensor', 'engine'], aftermarketBrands: ['BOSCH', 'DENSO', 'HELLA'] },
  { slug: 'headlamp', name: 'Headlamp', category: 'Electrical', systemId: 'electrical-system', tags: ['headlamp', 'lighting'], aftermarketBrands: ['HELLA', 'VALEO'] },
  { slug: 'wiper-motor', name: 'Wiper Motor', category: 'Cabin', systemId: 'cabin-system', tags: ['wiper', 'motor'], aftermarketBrands: ['HELLA', 'VALEO'] },
  { slug: 'mirror', name: 'Mirror Assembly', category: 'Cabin', systemId: 'cabin-system', tags: ['mirror', 'cabin'], aftermarketBrands: ['HELLA', 'MEKRA', 'FEBI'] },
  { slug: 'door-lock', name: 'Door Lock', category: 'Cabin', systemId: 'cabin-system', tags: ['door', 'lock'], aftermarketBrands: ['FEBI', 'VALEO'] },
  { slug: 'exhaust-pipe', name: 'Exhaust Pipe', category: 'Exhaust', systemId: 'exhaust-system', tags: ['exhaust', 'pipe'], aftermarketBrands: ['BOSAL', 'HJS', 'FEBI'] },
  { slug: 'muffler', name: 'Muffler', category: 'Exhaust', systemId: 'exhaust-system', tags: ['exhaust', 'muffler'], aftermarketBrands: ['BOSAL', 'HJS'] },
  { slug: 'dpf', name: 'Diesel Particulate Filter', category: 'Exhaust', systemId: 'exhaust-system', tags: ['dpf', 'exhaust'], aftermarketBrands: ['HJS', 'BOSAL'] },
  { slug: 'scr-catalyst', name: 'SCR Catalyst', category: 'Exhaust', systemId: 'exhaust-system', tags: ['scr', 'catalyst', 'adblue'], aftermarketBrands: ['HJS', 'BOSAL'] },
  { slug: 'adblue-pump', name: 'AdBlue Pump', category: 'Exhaust', systemId: 'exhaust-system', tags: ['adblue', 'pump'], aftermarketBrands: ['BOSCH', 'HELLA'] },
];

const MANUFACTURERS: ManufacturerDefinition[] = [
  { id: 'volvo-trucks', name: 'Volvo Trucks', source: SOURCES['volvo-trucks'], models: [
    { id: 'volvo-fh', name: 'FH' }, { id: 'volvo-fh16', name: 'FH16' }, { id: 'volvo-fm', name: 'FM' }, { id: 'volvo-fmx', name: 'FMX' }, { id: 'volvo-fe', name: 'FE' }, { id: 'volvo-fl', name: 'FL' },
  ] },
  { id: 'daf-trucks', name: 'DAF Trucks', source: SOURCES['daf-trucks'], models: [
    { id: 'daf-xf', name: 'XF' }, { id: 'daf-xg', name: 'XG' }, { id: 'daf-xg-plus', name: 'XG+' }, { id: 'daf-cf', name: 'CF' }, { id: 'daf-lf', name: 'LF' },
  ] },
  { id: 'mercedes-benz-trucks', name: 'Mercedes-Benz Trucks', source: SOURCES['mercedes-benz-trucks'], models: [
    { id: 'mercedes-actros', name: 'Actros' }, { id: 'mercedes-arocs', name: 'Arocs' }, { id: 'mercedes-atego', name: 'Atego' }, { id: 'mercedes-axor', name: 'Axor' },
  ] },
  { id: 'scania', name: 'Scania', source: SOURCES['scania'], models: [
    { id: 'scania-r', name: 'R-Series' }, { id: 'scania-s', name: 'S-Series' }, { id: 'scania-p', name: 'P-Series' }, { id: 'scania-g', name: 'G-Series' },
  ] },
  { id: 'man-truck-bus', name: 'MAN Truck & Bus', source: SOURCES['man-truck-bus'], models: [
    { id: 'man-tgx', name: 'TGX' }, { id: 'man-tgs', name: 'TGS' }, { id: 'man-tgm', name: 'TGM' }, { id: 'man-tgl', name: 'TGL' },
  ] },
  { id: 'renault-trucks', name: 'Renault Trucks', source: SOURCES['renault-trucks'], models: [
    { id: 'renault-t', name: 'T' }, { id: 'renault-c', name: 'C' }, { id: 'renault-k', name: 'K' }, { id: 'renault-d', name: 'D' },
  ] },
  { id: 'iveco', name: 'Iveco', source: SOURCES['iveco'], models: [
    { id: 'iveco-s-way', name: 'S-Way' }, { id: 'iveco-x-way', name: 'X-Way' }, { id: 'iveco-t-way', name: 'T-Way' }, { id: 'iveco-eurocargo', name: 'Eurocargo' },
  ] },
  { id: 'kenworth', name: 'Kenworth', source: SOURCES['kenworth'], models: [
    { id: 'kenworth-t680', name: 'T680' }, { id: 'kenworth-t880', name: 'T880' }, { id: 'kenworth-w990', name: 'W990' },
  ] },
  { id: 'peterbilt', name: 'Peterbilt', source: SOURCES['peterbilt'], models: [
    { id: 'peterbilt-579', name: '579' }, { id: 'peterbilt-389', name: '389' }, { id: 'peterbilt-567', name: '567' },
  ] },
  { id: 'freightliner', name: 'Freightliner', source: SOURCES['freightliner'], models: [
    { id: 'freightliner-cascadia', name: 'Cascadia' }, { id: 'freightliner-m2-106', name: 'M2 106' }, { id: 'freightliner-122sd', name: '122SD' },
  ] },
  { id: 'mack', name: 'Mack Trucks', source: SOURCES['mack'], models: [
    { id: 'mack-anthem', name: 'Anthem' }, { id: 'mack-pinnacle', name: 'Pinnacle' }, { id: 'mack-granite', name: 'Granite' },
  ] },
  { id: 'western-star', name: 'Western Star', source: SOURCES['western-star'], models: [
    { id: 'western-star-49x', name: '49X' }, { id: 'western-star-57x', name: '57X' }, { id: 'western-star-47x', name: '47X' },
  ] },
  { id: 'hino', name: 'Hino Trucks', source: SOURCES['hino'], models: [
    { id: 'hino-xl', name: 'XL Series' }, { id: 'hino-l', name: 'L Series' },
  ] },
  { id: 'isuzu', name: 'Isuzu Trucks', source: SOURCES['isuzu'], models: [
    { id: 'isuzu-n', name: 'N Series' }, { id: 'isuzu-f', name: 'F Series' }, { id: 'isuzu-g', name: 'G Series' },
  ] },
];

const VERIFIED_OEM_REFERENCES: Array<{
  manufacturerId: string;
  partTemplateSlug: string;
  referenceNumber: string;
  sourceUrl: string;
}> = [];

function unique(values: string[]): string[] { return Array.from(new Set(values)); }
function slugify(value: string): string { return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }
function parseList(value: string | undefined): string[] { if (!value) return []; return value.split(',').map((item) => item.trim()).filter(Boolean); }
function createSource(source: SourceDefinition, partId: string): Source { return { id: `${source.id}-${partId}`, partId, name: source.name, url: source.url, type: 'official', reliability: 'high' }; }
function createVerifiedOEMReferences(partId: string, manufacturerId: string, templateSlug: string): OEMReference[] {
  return VERIFIED_OEM_REFERENCES.filter((item) => item.manufacturerId === manufacturerId && item.partTemplateSlug === templateSlug).map((item, index) => ({ id: `${partId}-oem-${index + 1}`, partId, manufacturerId, referenceNumber: item.referenceNumber, verificationStatus: 'verified' as const, source: item.sourceUrl }));
}
function createPart(manufacturer: ManufacturerDefinition, model: ModelDefinition, template: PartTemplate): Part {
  const id = `${model.id}-${template.slug}`;
  const tags = unique([...template.tags, slugify(manufacturer.id), slugify(model.name)]);
  const aftermarketBrands = unique(template.aftermarketBrands);
  const oemReferences = createVerifiedOEMReferences(id, manufacturer.id, template.slug);
  return {
    id,
    systemId: template.systemId,
    name: template.name,
    description: `${template.name} catalog entry for ${manufacturer.name} ${model.name}. ` + `Exact OEM reference and vehicle fitment must be verified from authoritative ` + `manufacturer data before ordering.`,
    category: template.category,
    specifications: { type: template.name, vehicleType: 'Truck', manufacturer: manufacturer.name, manufacturerId: manufacturer.id, model: model.name, tags: tags.join(', '), aftermarketBrands: aftermarketBrands.join(', '), oemStatus: oemReferences.length > 0 ? 'verified' : 'pending-exact-application-lookup', referencePolicy: 'OEM numbers are added only after authoritative verification' },
    images: [],
    oemReferences,
    crossReferences: [],
    compatibility: [],
    sources: [createSource(manufacturer.source, id)],
    verificationStatus: oemReferences.length > 0 ? 'verified' : 'needs-verification',
    createdAt: now,
    updatedAt: now,
  };
}

export const CATALOG_PARTS: Part[] = MANUFACTURERS.flatMap((manufacturer) => manufacturer.models.flatMap((model) => PART_TEMPLATES.map((template) => createPart(manufacturer, model, template))));
export const CATALOG_MANUFACTURERS = MANUFACTURERS.map(({ id, name }) => ({ id, name }));
export const CATALOG_MODELS = MANUFACTURERS.flatMap((manufacturer) => manufacturer.models.map((model) => ({ id: model.id, manufacturerId: manufacturer.id, name: model.name })));
export const CATALOG_CATEGORIES = Array.from(new Set(CATALOG_PARTS.map((part) => part.category)));
export const CATALOG_SYSTEMS = Array.from(new Set(CATALOG_PARTS.map((part) => part.systemId)));
export const CATALOG_AFTERMARKET_BRANDS = Array.from(new Set(PART_TEMPLATES.flatMap((template) => template.aftermarketBrands))).sort();
export const CATALOG_STATS = { manufacturers: MANUFACTURERS.length, models: CATALOG_MODELS.length, partTemplates: PART_TEMPLATES.length, parts: CATALOG_PARTS.length, categories: CATALOG_CATEGORIES.length, systems: CATALOG_SYSTEMS.length, aftermarketBrands: CATALOG_AFTERMARKET_BRANDS.length, verifiedOEMReferences: VERIFIED_OEM_REFERENCES.length };

export function searchCatalog(query: string): Part[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return CATALOG_PARTS;
  return CATALOG_PARTS.filter((part) => {
    const searchableText = [part.id, part.name, part.category, part.description ?? '', part.specifications?.manufacturer ?? '', part.specifications?.manufacturerId ?? '', part.specifications?.model ?? '', part.specifications?.oemStatus ?? '', ...parseList(part.specifications?.tags), ...parseList(part.specifications?.aftermarketBrands), ...part.oemReferences.flatMap((oem) => [oem.referenceNumber, ...(oem.alternateNumbers ?? [])])].join(' ').toLowerCase();
    return searchableText.includes(normalized);
  });
}
export function getPartsByManufacturer(manufacturerId: string): Part[] { const normalized = manufacturerId.trim().toLowerCase(); return CATALOG_PARTS.filter((part) => part.specifications?.manufacturerId?.toLowerCase() === normalized); }
export function getPartsByModel(manufacturerId: string, model: string): Part[] { const m = manufacturerId.trim().toLowerCase(); const modelName = model.trim().toLowerCase(); return CATALOG_PARTS.filter((part) => part.specifications?.manufacturerId?.toLowerCase() === m && part.specifications?.model?.toLowerCase() === modelName); }
export function getPartsByCategory(category: string): Part[] { const normalized = category.trim().toLowerCase(); return CATALOG_PARTS.filter((part) => part.category.toLowerCase() === normalized); }
export function getPartsBySystem(systemId: string): Part[] { return CATALOG_PARTS.filter((part) => part.systemId === systemId); }
export function getPartsByAftermarketBrand(brand: string): Part[] { const normalized = brand.trim().toLowerCase(); return CATALOG_PARTS.filter((part) => parseList(part.specifications?.aftermarketBrands).some((item) => item.toLowerCase() === normalized)); }
export function getPartsByTag(tag: string): Part[] { const normalized = tag.trim().toLowerCase(); return CATALOG_PARTS.filter((part) => parseList(part.specifications?.tags).some((item) => item.toLowerCase() === normalized)); }
export function getPartsByOEM(referenceNumber: string): Part[] { const normalized = referenceNumber.trim().toLowerCase(); return CATALOG_PARTS.filter((part) => part.oemReferences.some((oem) => oem.referenceNumber.toLowerCase() === normalized || (oem.alternateNumbers ?? []).some((alt) => alt.toLowerCase() === normalized))); }
export function getPartById(id: string): Part | undefined { return CATALOG_PARTS.find((part) => part.id === id); }
export function getVerifiedOEMParts(): Part[] { return CATALOG_PARTS.filter((part) => part.oemReferences.length > 0); }
