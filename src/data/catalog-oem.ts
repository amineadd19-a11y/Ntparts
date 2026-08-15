/** Auto-audited OEM + cross refs (public sources only). Deduped at runtime via uniqueRefs. */
export const VERIFIED_OEM_REFERENCES: Array<{
  manufacturerId: string;
  partTemplateSlug: string;
  referenceNumber: string;
  alternateNumbers?: string[];
  sourceUrl: string;
}> = [
  // —— Filters (MANN) ——
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
  // SAMPA 033.141 — official product page cross-refs (sampa.com)
  {
    manufacturerId: 'volvo-trucks', partTemplateSlug: 'fuel-filter', referenceNumber: '22480372',
    alternateNumbers: [
      '20976003', '20430751', '20815011',
      'SAMPA 033.141',
      'MANN WDK 11 102/1', 'MANN WDK11102/28',
      'BOSCH F026402017', 'FLEETGUARD FF5507', 'MAHLE KC251',
      'MACK 20539582', 'RENAULT 7420976001',
    ],
    sourceUrl: 'https://www.sampa.com/en/productdetail?code=033.141',
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
  // Fixed: 1607728 + COJALI 2214400 = air suspension valve (not brake valve)
  {
    manufacturerId: 'volvo-trucks', partTemplateSlug: 'air-spring', referenceNumber: '1607728',
    alternateNumbers: ['COJALI 2214400', 'FEBI 39335', 'WABCO 4640060000', 'HALDEX 612035011'],
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
  {
    manufacturerId: 'mercedes-benz-trucks', partTemplateSlug: 'brake-valve', referenceNumber: 'A0014300460',
    alternateNumbers: ['COJALI 6012001', 'WABCO 4613150052'],
    sourceUrl: 'https://www.intercars24.ee/',
  },

  // —— Brakes / EBS ecosystem ——
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
    alternateNumbers: ['TEXTAR'],
    sourceUrl: 'https://www.knorr-bremse.com/',
  },
  {
    manufacturerId: 'daf-trucks', partTemplateSlug: 'brake-chamber', referenceNumber: '1387439',
    alternateNumbers: ['1726138', 'KNORR K034248'],
    sourceUrl: 'https://www.ebs.co.uk/',
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
    alternateNumbers: ['1114640', 'ELRING 832.619', 'MAN 81.11904-0020'],
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

  // —— SAMPA sensors ——
  {
    manufacturerId: 'volvo-trucks', partTemplateSlug: 'mirror', referenceNumber: '21360516',
    alternateNumbers: ['20723666', 'SAMPA 096.333', 'RENAULT 7421360516'],
    sourceUrl: 'https://www.sampa.com/',
  },
];
