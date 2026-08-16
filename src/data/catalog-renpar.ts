import type { Part } from '@/types';
import { RENPAR_ROWS_1 } from './renpar-data-1';
import { RENPAR_ROWS_2 } from './renpar-data-2';
import { RENPAR_ROWS_3 } from './renpar-data-3';
import { RENPAR_ROWS_4 } from './renpar-data-4';
import type { RenparRow } from './renpar-types';

const ROWS: RenparRow[] = [...RENPAR_ROWS_1, ...RENPAR_ROWS_2, ...RENPAR_ROWS_3, ...RENPAR_ROWS_4];
const slug = (v: string) => v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const manufacturerId = (text: string) => {
  const t = text.toUpperCase();
  if (/MERCEDES|DAIMLER|ACTROS|AXOR/.test(t)) return 'mercedes-benz-trucks';
  if (/SCANIA/.test(t)) return 'scania';
  if (/DAF/.test(t)) return 'daf-trucks';
  if (/IVECO/.test(t)) return 'iveco';
  if (/MAN\b/.test(t)) return 'man-truck-bus';
  if (/VOLVO/.test(t)) return 'volvo-trucks';
  return 'renault-trucks';
};
const classification = (text: string): { category: string; systemId: Part['systemId'] } => {
  const t = text.toUpperCase();
  if (/FREIN|BRAKE|PLAQUET|DISQUE|ETRIER|VALVE.*FREIN|ABS/.test(t)) return { category: 'Brakes', systemId: 'brake-system' };
  if (/BOITE|VITESSE|EMBR|COUPLEUR|FOURCHETTE|VOLANT MOTEUR/.test(t)) return { category: 'Transmission', systemId: 'transmission-system' };
  if (/DURIT|DURITE|RADIATEUR|INTERCOLER|POMPE A EAU|THERMOSTAT|VENTIL|REFROID/.test(t)) return { category: 'Cooling System', systemId: 'cooling-system' };
  if (/ELECTR|CAPTEUR|COMODO|ALTERN|DEMARREUR|PHARE|GLACE RETROVISEUR|ESSUIE/.test(t)) return { category: 'Electrical & Cabin', systemId: 'electrical-system' };
  if (/AMORTIS|SUSPENS|BALANCIER|RESSORT|MOYEU|ESSIEU/.test(t)) return { category: 'Suspension & Wheel', systemId: 'suspension-system' };
  if (/CABINE|VERIN DE CABINE|RETROVISEUR|PORTE|SIEGE|MARCHEPIED/.test(t)) return { category: 'Cabin', systemId: 'cabin-system' };
  if (/FILTRE|JOINT|GASKET/.test(t)) return { category: 'Filters & Sealing', systemId: 'other-system' };
  if (/ECHAP|FLEXIBLE D'ECHAPPEMENT|SILENCIEUX/.test(t)) return { category: 'Exhaust', systemId: 'other-system' };
  if (/POMPE|COMPRESSEUR|CULASSE|PISTON|SOUPAPE|THERMOSTAT|TENDEUR/.test(t)) return { category: 'Engine & Mechanical', systemId: 'engine-system' };
  return { category: 'Truck Parts', systemId: 'other-system' };
};

export const RENPAR_CATALOG_PARTS: Part[] = ROWS.map(([ref, aftermarket, description, oems, price, page]) => {
  const { category, systemId } = classification(description);
  const manufacturer = manufacturerId(description);
  const refs = oems.split('|').filter(Boolean);
  const partId = `renpar-${slug(ref)}`;
  return {
    id: partId,
    systemId,
    name: description.replace(/\s+/g, ' ').trim(),
    description: `${description}. Source-listed in RENPAR MOIS 11.pdf, page ${page}. Fitment and OEM authenticity remain NOT VERIFIED until independently corroborated.`,
    category,
    specifications: {
      vehicleType: 'Truck',
      manufacturerId: manufacturer,
      manufacturer: manufacturer === 'renault-trucks' ? 'Renault Trucks / RVI' : manufacturer,
      aftermarketReference: aftermarket,
      sourcePrice: price,
      sourceDocument: 'RENPAR MOIS 11.pdf',
      sourcePage: String(page),
      tags: description.toLowerCase().split(/\s+/).filter(x => x.length > 2).slice(0, 14).join(', '),
      oemStatus: refs.length ? 'SOURCE-LISTED / NOT INDEPENDENTLY VERIFIED' : 'NOT VERIFIED',
      referencePolicy: 'No fitment claim beyond the supplied catalogue source.',
    },
    images: [],
    oemReferences: refs.map((referenceNumber, i) => ({
      id: `${partId}-oem-${i + 1}`,
      partId,
      manufacturerId: manufacturer,
      referenceNumber,
      alternateNumbers: [aftermarket, ...refs.filter(x => x !== referenceNumber)].filter(Boolean),
      verificationStatus: 'source-listed' as const,
      source: 'RENPAR MOIS 11.pdf',
      evidenceLevel: 'parts-catalog' as const,
    })),
    crossReferences: [],
    compatibility: [],
    sources: [{ id: `${partId}-source`, partId, name: 'RENPAR MOIS 11 catalogue (supplied PDF)', type: 'parts-catalog', reliability: 'medium' }],
    verificationStatus: 'needs-verification',
    createdAt: '2026-08-16T00:00:00.000Z',
    updatedAt: '2026-08-16T00:00:00.000Z',
  } as Part;
});

export const RENPAR_CATALOG_STATS = {
  sourceRows: RENPAR_CATALOG_PARTS.length,
  withOEM: RENPAR_CATALOG_PARTS.filter(p => p.oemReferences.length > 0).length,
};
