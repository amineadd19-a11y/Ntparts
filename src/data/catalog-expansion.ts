import type { Part } from '@/types';
import { CATALOG_MANUFACTURERS, CATALOG_MODELS } from '@/data/catalog-core';
import { resolveProductImages } from '@/data/catalog-images';

type ExpansionTemplate = {
  slug: string;
  name: string;
  category: string;
  systemId: Part['systemId'];
  tags: string[];
  brands: string[];
};

const TEMPLATES: ExpansionTemplate[] = [
  { slug: 'brake-drum', name: 'Brake Drum', category: 'Brakes', systemId: 'brake-system', tags: ['brake', 'drum'], brands: ['BREMBO', 'FEBI', 'TRW'] },
  { slug: 'brake-lining', name: 'Brake Lining', category: 'Brakes', systemId: 'brake-system', tags: ['brake', 'lining'], brands: ['TEXTAR', 'TRW', 'FEBI'] },
  { slug: 'abs-sensor', name: 'ABS Sensor', category: 'Brakes', systemId: 'brake-system', tags: ['abs', 'sensor'], brands: ['BOSCH', 'KNORR-BREMSE', 'WABCO'] },
  { slug: 'compressor', name: 'Air Compressor', category: 'Engine', systemId: 'engine-system', tags: ['air', 'compressor'], brands: ['KNORR-BREMSE', 'WABCO'] },
  { slug: 'hydraulic-filter', name: 'Hydraulic Filter', category: 'Filters', systemId: 'other-system', tags: ['filter', 'hydraulic'], brands: ['DONALDSON', 'MAHLE', 'MANN-FILTER'] },
  { slug: 'fuel-pump', name: 'Fuel Pump', category: 'Engine', systemId: 'engine-system', tags: ['fuel', 'pump'], brands: ['BOSCH', 'DENSO'] },
  { slug: 'high-pressure-pump', name: 'High Pressure Fuel Pump', category: 'Engine', systemId: 'engine-system', tags: ['fuel', 'high pressure', 'pump'], brands: ['BOSCH', 'DENSO', 'DELPHI'] },
  { slug: 'turbo-actuator', name: 'Turbo Actuator', category: 'Engine', systemId: 'engine-system', tags: ['turbo', 'actuator'], brands: ['GARRETT', 'BORGWARNER'] },
  { slug: 'egr-valve', name: 'EGR Valve', category: 'Engine', systemId: 'engine-system', tags: ['egr', 'valve'], brands: ['BOSCH', 'PIERBURG', 'FEBI'] },
  { slug: 'oil-pump', name: 'Oil Pump', category: 'Engine', systemId: 'engine-system', tags: ['oil', 'pump'], brands: ['FEBI', 'MAHLE'] },
  { slug: 'intercooler', name: 'Intercooler', category: 'Cooling System', systemId: 'cooling-system', tags: ['intercooler', 'charge air'], brands: ['MAHLE', 'NRF'] },
  { slug: 'fan-clutch', name: 'Fan Clutch', category: 'Cooling System', systemId: 'cooling-system', tags: ['fan', 'clutch', 'cooling'], brands: ['MAHLE', 'BEHR', 'BORGWARNER'] },
  { slug: 'coolant-hose', name: 'Coolant Hose', category: 'Cooling System', systemId: 'cooling-system', tags: ['coolant', 'hose'], brands: ['GATES', 'DAYCO', 'FEBI'] },
  { slug: 'belt-tensioner', name: 'Belt Tensioner', category: 'Engine', systemId: 'engine-system', tags: ['belt', 'tensioner'], brands: ['INA', 'GATES', 'DAYCO'] },
  { slug: 'timing-kit', name: 'Timing Belt/Chain Kit', category: 'Engine', systemId: 'engine-system', tags: ['timing', 'kit'], brands: ['CONTITECH', 'GATES', 'DAYCO', 'INA'] },
  { slug: 'engine-mount', name: 'Engine Mount', category: 'Engine', systemId: 'engine-system', tags: ['engine', 'mount'], brands: ['FEBI', 'LEMFÖRDER'] },
  { slug: 'clutch-disc', name: 'Clutch Disc', category: 'Transmission', systemId: 'transmission-system', tags: ['clutch', 'disc'], brands: ['SACHS', 'LuK', 'VALEO'] },
  { slug: 'clutch-cover', name: 'Clutch Cover', category: 'Transmission', systemId: 'transmission-system', tags: ['clutch', 'cover'], brands: ['SACHS', 'LuK', 'VALEO'] },
  { slug: 'release-bearing', name: 'Release Bearing', category: 'Transmission', systemId: 'transmission-system', tags: ['clutch', 'bearing'], brands: ['SACHS', 'SKF', 'FAG'] },
  { slug: 'clutch-slave-cylinder', name: 'Clutch Slave Cylinder', category: 'Transmission', systemId: 'transmission-system', tags: ['clutch', 'hydraulic'], brands: ['ZF', 'SACHS', 'TRW'] },
  { slug: 'gearbox', name: 'Gearbox', category: 'Transmission', systemId: 'transmission-system', tags: ['gearbox', 'transmission'], brands: ['ZF'] },
  { slug: 'gearbox-filter', name: 'Transmission Filter', category: 'Transmission', systemId: 'transmission-system', tags: ['gearbox', 'filter'], brands: ['ZF', 'MANN-FILTER'] },
  { slug: 'propeller-shaft', name: 'Propeller Shaft', category: 'Transmission', systemId: 'transmission-system', tags: ['propeller', 'shaft'], brands: ['GKN', 'SPICER'] },
  { slug: 'universal-joint', name: 'Universal Joint', category: 'Transmission', systemId: 'transmission-system', tags: ['universal', 'joint', 'driveshaft'], brands: ['SPICER', 'GKN'] },
  { slug: 'cab-air-spring', name: 'Cab Air Spring', category: 'Cabin', systemId: 'cabin-system', tags: ['cab', 'air', 'spring'], brands: ['CONTINENTAL', 'FIRESTONE'] },
  { slug: 'control-arm', name: 'Control Arm', category: 'Suspension', systemId: 'suspension-system', tags: ['control', 'arm'], brands: ['LEMFÖRDER', 'TRW', 'FEBI'] },
  { slug: 'stabilizer-link', name: 'Stabilizer Link', category: 'Suspension', systemId: 'suspension-system', tags: ['stabilizer', 'link'], brands: ['LEMFÖRDER', 'TRW', 'FEBI'] },
  { slug: 'leaf-spring', name: 'Leaf Spring', category: 'Suspension', systemId: 'suspension-system', tags: ['leaf', 'spring'], brands: ['SACHS', 'FEBI'] },
  { slug: 'steering-pump', name: 'Steering Pump', category: 'Steering', systemId: 'steering-system', tags: ['steering', 'pump'], brands: ['ZF', 'TRW'] },
  { slug: 'steering-gear', name: 'Steering Gear', category: 'Steering', systemId: 'steering-system', tags: ['steering', 'gear'], brands: ['ZF', 'TRW'] },
  { slug: 'tie-rod', name: 'Tie Rod', category: 'Steering', systemId: 'steering-system', tags: ['tie', 'rod'], brands: ['LEMFÖRDER', 'TRW', 'FEBI'] },
  { slug: 'drag-link', name: 'Drag Link', category: 'Steering', systemId: 'steering-system', tags: ['drag', 'link'], brands: ['LEMFÖRDER', 'TRW', 'FEBI'] },
  { slug: 'battery', name: 'Truck Battery', category: 'Electrical', systemId: 'electrical-system', tags: ['battery'], brands: ['VARTA', 'BOSCH', 'EXIDE'] },
  { slug: 'glow-plug', name: 'Glow Plug', category: 'Electrical', systemId: 'electrical-system', tags: ['glow', 'plug'], brands: ['BOSCH', 'DENSO'] },
  { slug: 'engine-sensor', name: 'Engine Sensor', category: 'Electrical', systemId: 'electrical-system', tags: ['sensor', 'engine'], brands: ['BOSCH', 'DENSO', 'HELLA'] },
  { slug: 'headlamp', name: 'Headlamp', category: 'Electrical', systemId: 'electrical-system', tags: ['headlamp', 'lighting'], brands: ['HELLA', 'VALEO'] },
  { slug: 'wiper-motor', name: 'Wiper Motor', category: 'Cabin', systemId: 'cabin-system', tags: ['wiper', 'motor'], brands: ['HELLA', 'VALEO'] },
  { slug: 'door-lock', name: 'Door Lock', category: 'Cabin', systemId: 'cabin-system', tags: ['door', 'lock'], brands: ['FEBI', 'VALEO'] },
  { slug: 'exhaust-pipe', name: 'Exhaust Pipe', category: 'Exhaust', systemId: 'exhaust-system', tags: ['exhaust', 'pipe'], brands: ['BOSAL', 'HJS', 'FEBI'] },
  { slug: 'muffler', name: 'Muffler', category: 'Exhaust', systemId: 'exhaust-system', tags: ['exhaust', 'muffler'], brands: ['BOSAL', 'HJS'] },
  { slug: 'dpf', name: 'Diesel Particulate Filter', category: 'Exhaust', systemId: 'exhaust-system', tags: ['dpf', 'exhaust'], brands: ['HJS', 'BOSAL'] },
  { slug: 'scr-catalyst', name: 'SCR Catalyst', category: 'Exhaust', systemId: 'exhaust-system', tags: ['scr', 'catalyst', 'adblue'], brands: ['HJS', 'BOSAL'] },
  { slug: 'adblue-pump', name: 'AdBlue Pump', category: 'Exhaust', systemId: 'exhaust-system', tags: ['adblue', 'pump'], brands: ['BOSCH', 'HELLA'] },
];

const REAL_IMAGE_SLUGS = new Set(['oil-filter', 'air-filter', 'fuel-filter', 'cabin-filter']);

export const CATALOG_EXPANSION: Part[] = CATALOG_MODELS.flatMap((model) =>
  TEMPLATES.map((template) => {
    const id = `${model.id}-${template.slug}`;
    const manufacturer = CATALOG_MANUFACTURERS.find((item) => item.id === model.manufacturerId);
    if (!manufacturer) throw new Error(`Catalog model references unknown manufacturer: ${model.manufacturerId}`);
    const images = REAL_IMAGE_SLUGS.has(template.slug)
      ? resolveProductImages(template.slug, id, template.name) as Part['images']
      : [];
    return {
      id,
      systemId: template.systemId,
      name: template.name,
      description: `${template.name} — ${manufacturer.name} ${model.name}. Exact OEM and fitment are NOT VERIFIED.`,
      category: template.category,
      specifications: {
        type: template.name,
        vehicleType: 'Truck',
        manufacturer: manufacturer.name,
        manufacturerId: manufacturer.id,
        model: model.name,
        tags: [...template.tags, manufacturer.id, model.name].join(', '),
        aftermarketBrands: template.brands.join(', '),
        oemStatus: 'NOT VERIFIED',
        referencePolicy: 'No OEM number claimed without authoritative verification',
      },
      images,
      oemReferences: [],
      crossReferences: [],
      compatibility: [],
      sources: [],
      verificationStatus: 'needs-verification' as const,
      createdAt: '2026-08-15T00:00:00.000Z',
      updatedAt: '2026-08-15T00:00:00.000Z',
    } satisfies Part;
  })
);
