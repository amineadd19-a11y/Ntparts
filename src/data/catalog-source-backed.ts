/**
 * Source-backed catalogue records extracted from public manufacturer documentation.
 * Status: SOURCE-LISTED unless stronger independent verification exists.
 * Never invents OEM numbers or fitment.
 */
import type { Part } from '@/types';

const IMPORT_DATE = '2026-08-16T12:00:00.000Z';

function part(input: {
  id: string;
  name: string;
  category: string;
  systemId: Part['systemId'];
  description: string;
  manufacturerId: string;
  manufacturer: string;
  aftermarketReference?: string;
  aftermarketBrands?: string;
  oem: Array<{ number: string; manufacturerId: string; alternates?: string[] }>;
  sourceName: string;
  sourceUrl: string;
  sourceType: 'official' | 'parts-catalog' | 'documentation' | 'other';
}): Part {
  return {
    id: input.id,
    systemId: input.systemId,
    name: input.name,
    description: input.description,
    category: input.category,
    specifications: {
      vehicleType: 'Truck',
      manufacturerId: input.manufacturerId,
      manufacturer: input.manufacturer,
      aftermarketReference: input.aftermarketReference || '',
      aftermarketBrands: input.aftermarketBrands || '',
      oemStatus: 'SOURCE-LISTED / NOT INDEPENDENTLY VERIFIED AS EXACT FITMENT',
      referencePolicy:
        'References extracted from public manufacturer/distributor catalogues. Confirm exact application and VIN before ordering.',
      sourceDocument: input.sourceName,
      tags: [input.category, input.name, input.manufacturer].join(', ').toLowerCase(),
    },
    images: [],
    oemReferences: input.oem.map((o, i) => ({
      id: `${input.id}-oem-${i + 1}`,
      partId: input.id,
      manufacturerId: o.manufacturerId,
      referenceNumber: o.number,
      alternateNumbers: o.alternates || [],
      verificationStatus: 'source-listed' as const,
      source: input.sourceUrl,
      evidenceLevel: 'parts-catalog' as const,
    })),
    crossReferences: [],
    compatibility: [],
    sources: [
      {
        id: `${input.id}-src`,
        partId: input.id,
        name: input.sourceName,
        url: input.sourceUrl,
        type: input.sourceType,
        reliability: 'high',
      },
    ],
    verificationStatus: 'needs-verification',
    createdAt: IMPORT_DATE,
    updatedAt: IMPORT_DATE,
  };
}

/**
 * Curated records from:
 * - MANN-FILTER European Trucks / Euro 6 guides (public PDFs)
 * - Knorr-Bremse ProTecS brake pad documentation
 * - WABCO / public cross-reference listings for air dryer cartridges
 */
export const SOURCE_BACKED_PARTS: Part[] = [
  // --- MANN-FILTER oil / air / fuel (Volvo FH family) ---
  part({
    id: 'src-mann-w11025-volvo-oil',
    name: 'Oil Filter (MANN-FILTER W 11 025)',
    category: 'Filters',
    systemId: 'engine-system',
    description:
      'MANN-FILTER W 11 025 oil filter listed for Volvo Trucks FH / FM applications in the MANN-FILTER European Trucks guide. OEM cross-references include Volvo-style numbers published in the same guides. Exact engine/chassis fitment NOT VERIFIED without VIN.',
    manufacturerId: 'volvo-trucks',
    manufacturer: 'Volvo Trucks',
    aftermarketReference: 'W 11 025',
    aftermarketBrands: 'MANN-FILTER',
    oem: [
      { number: '21707134', manufacturerId: 'volvo-trucks', alternates: ['W 11 025', 'W11025'] },
    ],
    sourceName: 'MANN-FILTER European Trucks / Euro 6 Guide (public PDF)',
    sourceUrl: 'https://www.mann-filter.com/content/dam/website/mann-filter/mann-filter-com/en/documents/MF_Guide-2020_Euro6_A4_Interaktiv.pdf',
    sourceType: 'parts-catalog',
  }),
  part({
    id: 'src-mann-wp11102-volvo-oil',
    name: 'Oil Filter (MANN-FILTER WP 11 102/3)',
    category: 'Filters',
    systemId: 'engine-system',
    description:
      'MANN-FILTER WP 11 102/3 oil filter listed alongside Volvo FH applications in public MANN-FILTER truck guides. SOURCE-LISTED only.',
    manufacturerId: 'volvo-trucks',
    manufacturer: 'Volvo Trucks',
    aftermarketReference: 'WP 11 102/3',
    aftermarketBrands: 'MANN-FILTER',
    oem: [{ number: 'WP 11 102/3', manufacturerId: 'volvo-trucks', alternates: ['WP11102/3'] }],
    sourceName: 'MANN-FILTER European Trucks Guide',
    sourceUrl: 'https://www.mann-filter.com/content/dam/website/mann-filter/mann-filter-com/australia/download-hub/document/MANN-FILTER_European_Trucks_Guide.pdf',
    sourceType: 'parts-catalog',
  }),
  part({
    id: 'src-mann-tb1394-air-dryer',
    name: 'Air Dryer Cartridge (MANN-FILTER TB 1394 series)',
    category: 'Brakes',
    systemId: 'brake-system',
    description:
      'MANN-FILTER TB 1394/x air dryer cartridges listed for pneumatic brake systems on multiple European trucks (Volvo, DAF, Scania applications appear in public guides). SOURCE-LISTED; confirm dryer type and vehicle before order.',
    manufacturerId: 'volvo-trucks',
    manufacturer: 'Multi (Volvo / DAF / Scania applications listed in source)',
    aftermarketReference: 'TB 1394/1 x',
    aftermarketBrands: 'MANN-FILTER',
    oem: [
      { number: 'TB 1394/1 x', manufacturerId: 'volvo-trucks', alternates: ['TB1394/1x', 'TB 1394/6 x', 'TB 1396 x'] },
    ],
    sourceName: 'MANN-FILTER European Trucks Guide — air dryer listings',
    sourceUrl: 'https://www.mann-filter.com/content/dam/website/mann-filter/mann-filter-com/australia/download-hub/document/MANN-FILTER_European_Trucks_Guide.pdf',
    sourceType: 'parts-catalog',
  }),

  // --- Knorr-Bremse brake pads ---
  part({
    id: 'src-kb-k059965k50-brake-pad',
    name: 'Brake Pad Set Knorr SB/SN7 (K059965K50)',
    category: 'Brakes',
    systemId: 'brake-system',
    description:
      'Knorr-Bremse ProTecS brake pad kit K059965K50 for SB/SN7 systems. Public cross-references include MAN 81.50820-6070 / 81.50820-6061, Scania SP1037195, Renault Trucks 5021204049. SOURCE-LISTED from Knorr-Bremse / distributor documentation.',
    manufacturerId: 'man-truck-bus',
    manufacturer: 'MAN Truck & Bus',
    aftermarketReference: 'K059965K50',
    aftermarketBrands: 'KNORR-BREMSE',
    oem: [
      {
        number: '81.50820-6070',
        manufacturerId: 'man-truck-bus',
        alternates: ['81.50820-6061', '81.50820-6083', 'K059965K50', 'SP1037195', '5021204049'],
      },
    ],
    sourceName: 'Knorr-Bremse ProTecS Brake Pad documentation / public OEM cross-ref listings',
    sourceUrl: 'https://trucks.autodoc.co.uk/knorr-bremse/13651485',
    sourceType: 'parts-catalog',
  }),
  part({
    id: 'src-kb-k046771k50-brake-pad',
    name: 'Brake Pad Set Knorr SB/SN7 (K046771K50)',
    category: 'Brakes',
    systemId: 'brake-system',
    description:
      'Knorr-Bremse K046771K50 ProTecS pad kit listed for Mercedes-Benz Actros/Axor and MAN TGA/TGS/TGX SB/SN7 applications in public Knorr documentation. SOURCE-LISTED.',
    manufacturerId: 'mercedes-benz-trucks',
    manufacturer: 'Mercedes-Benz Trucks',
    aftermarketReference: 'K046771K50',
    aftermarketBrands: 'KNORR-BREMSE',
    oem: [
      {
        number: 'A0064201020',
        manufacturerId: 'mercedes-benz-trucks',
        alternates: ['A0044206020', 'K046771K50', '81.50820-6030'],
      },
    ],
    sourceName: 'Knorr-Bremse ProTecS Brake Pad Range (public documentation)',
    sourceUrl: 'https://www.befa.gr/wp-content/uploads/2021/03/ProTecS%C2%AE-Brake-Pad-Range.pdf',
    sourceType: 'documentation',
  }),

  // --- WABCO air dryer cartridges ---
  part({
    id: 'src-wabco-4324102227-air-dryer',
    name: 'Air Dryer Cartridge WABCO 4324102227',
    category: 'Brakes',
    systemId: 'brake-system',
    description:
      'WABCO air dryer cartridge 4324102227 with widely published OEM cross-references (DAF, MAN, Mercedes-Benz, Scania, Volvo, Renault, Iveco). SOURCE-LISTED from public cross-reference tables; confirm dryer family before order.',
    manufacturerId: 'daf-trucks',
    manufacturer: 'DAF Trucks / multi-OEM',
    aftermarketReference: '4324102227',
    aftermarketBrands: 'WABCO, MANN-FILTER, KNORR-BREMSE',
    oem: [
      {
        number: '0699387',
        manufacturerId: 'daf-trucks',
        alternates: [
          '1504900R',
          '1518683',
          '81521020008',
          'A0004293795',
          '377640',
          '1932688',
          '5000295421',
          '4324102227',
        ],
      },
    ],
    sourceName: 'WABCO / public commercial vehicle cross-reference listings',
    sourceUrl: 'https://www.rexbo.co.uk/wabco/air-dryer-cartridge-compressed-air-system-4324102227',
    sourceType: 'parts-catalog',
  }),
  part({
    id: 'src-scania-1774598-air-dryer',
    name: 'Air Dryer Cartridge (Scania-related 1774598 family)',
    category: 'Brakes',
    systemId: 'brake-system',
    description:
      'Air dryer cartridge associated with Scania applications and cross-listed numbers including 1774598 / 1384549 / 1455253 in public aftermarket listings. SOURCE-LISTED only.',
    manufacturerId: 'scania',
    manufacturer: 'Scania',
    aftermarketReference: '1774598',
    aftermarketBrands: 'WABCO, COJALI',
    oem: [
      {
        number: '1774598',
        manufacturerId: 'scania',
        alternates: ['1384549', '1455253', '2081360'],
      },
    ],
    sourceName: 'Public Scania / WABCO air dryer cross-reference listings',
    sourceUrl: 'https://www.swedishtruckpartsshop.co.uk/s6390-air-dryer-filter-cartridge-spin-on-20399-p.asp',
    sourceType: 'parts-catalog',
  }),

  // --- MANN cabin / urea ---
  part({
    id: 'src-mann-cu2184-cabin',
    name: 'Cabin Air Filter (MANN-FILTER CU 2184)',
    category: 'Filters',
    systemId: 'cabin-system',
    description:
      'MANN-FILTER CU 2184 / CUK 2184 cabin filters listed for Volvo FH/FM applications in public MANN truck guides. SOURCE-LISTED.',
    manufacturerId: 'volvo-trucks',
    manufacturer: 'Volvo Trucks',
    aftermarketReference: 'CU 2184',
    aftermarketBrands: 'MANN-FILTER',
    oem: [{ number: 'CU 2184', manufacturerId: 'volvo-trucks', alternates: ['CUK 2184', 'FP 2184'] }],
    sourceName: 'MANN-FILTER European Trucks Guide',
    sourceUrl: 'https://www.mann-filter.com/content/dam/website/mann-filter/mann-filter-com/en/documents/MF_Guide-2020_Euro6_A4_Interaktiv.pdf',
    sourceType: 'parts-catalog',
  }),
  part({
    id: 'src-mann-u5001-urea',
    name: 'Urea / AdBlue Filter (MANN-FILTER U 5001 KIT)',
    category: 'Exhaust',
    systemId: 'exhaust-system',
    description:
      'MANN-FILTER U 5001 KIT urea filter listed across multiple European truck applications (Volvo, DAF, MAN) in public Euro 6 guides. SOURCE-LISTED; SCR system variant must be confirmed.',
    manufacturerId: 'volvo-trucks',
    manufacturer: 'Multi (Volvo / DAF / MAN applications in source)',
    aftermarketReference: 'U 5001 KIT',
    aftermarketBrands: 'MANN-FILTER',
    oem: [{ number: 'U 5001 KIT', manufacturerId: 'volvo-trucks', alternates: ['U5001KIT', 'U 1005'] }],
    sourceName: 'MANN-FILTER Euro 6 / European Trucks Guide',
    sourceUrl: 'https://www.mann-filter.com/content/dam/website/mann-filter/mann-filter-com/en/documents/MF_Guide-2020_Euro6_A4_Interaktiv.pdf',
    sourceType: 'parts-catalog',
  }),
];

export const SOURCE_BACKED_STATS = {
  records: SOURCE_BACKED_PARTS.length,
  withOem: SOURCE_BACKED_PARTS.filter((p) => p.oemReferences.length > 0).length,
};
