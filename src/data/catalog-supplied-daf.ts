/**
 * DAF OEM candidates transcribed from the user-supplied commercial HTML catalogue.
 * Source listing only: not independently verified; no prices/stock imported.
 * Do not treat the compatibility text as confirmed VIN fitment.
 */
import type { Part } from '@/types';

const SOURCE = 'Catalogue Poids Lourds PRO 2026.html';
const IMPORT_DATE = '2026-10-16T00:00:00.000Z';

// [source row, DAF reference, label, category, listed application, listed aftermarket equivalents, source notes, engine]
const ROWS: string[][] = [["593","1948921","Filtre à huile élément","filtres","cf/xf mx-13 / renault","mann hu 12 103 x / mahle","oem 1948921 – aussi 1629393 / 1643070","MX-13"],["594","2277128","Filtre à gasoil élément","filtres","cf/xf","mann pu 10 012 z / hengst e127kp","oem 2277128 – aussi 1852005 / 2164462","MX-13"],["595","1629393","Filtre à huile alt.","filtres","cf/xf","mann / équiv 1948921","équiv. 1948921","MX-13"],["596","1643070","Filtre à huile alt. 2","filtres","cf/xf","mann / équiv 1948921","équiv. 1948921","MX-13"],["597","1852005","Filtre à gasoil alt.","filtres","cf/xf","mann / équiv 2277128","équiv. 2277128",""],["598","2164462","Filtre à gasoil alt. 2","filtres","cf/xf","mann / équiv 2277128","équiv. 2277128",""],["599","2133095","Filtre à gasoil alt. 3","filtres","cf/xf","mann / équiv 2277128","équiv. 2277128",""],["602","1828379","Filtre huile boîte / ralentisseur","filtres","xf/cf multi","mann / zf hx 229","oem 1828379 – filtre boîte",""],["603","1825427","Filtre habitacle / cabine","filtres","xf95/xf105","mann cu / mahle la","oem 1825427 filtre cabine",""],["604","2151728","Filtre à huile Euro 6","filtres","cf/xf euro 6","mann hu 12009 z / mahle ox1293d","oem 2151728 euro 6","MX-13"],["605","2142288","Filtre à air","filtres","cf/xf","mann / mahle al 22","oem 2142288 filtre air",""],["606","1821580","Filtre à air alt.","filtres","cf/xf","mann / mahle al 25","oem 1821580",""],["607","1925363","Filtre à air principal","filtres","xf","mann / mahle al 41","oem 1925363",""],["608","2027058","Filtre hydraulique","filtres","cf/xf","mann / mahle hx 108","oem 2027058 hydraulique",""],["609","1433649","Filtre gasoil primaire","filtres","cf/xf","mann / mahle kc 296d","oem 1433649",""],["610","1707078","Filtre gasoil secondaire","filtres","cf/xf","mann / mahle kx 484d","oem 1707078",""],["611","1714363","Kit filtres service Euro 6","filtres","cf/xf euro 6","mann / fleetguard","oem 1714363 kit service","MX-13"],["612","1658011","Étrier frein avant gauche","freinage","xf","knorr / meritor","oem 1658011 étrier g",""],["613","1658010","Étrier frein avant droit","freinage","xf","knorr / meritor","oem 1658010 étrier d",""],["614","1962287","Disque de frein","freinage","cf/xf","textar / trp","oem 1962287 disque frein",""],["615","1387439","Disque de frein avant/arrière","freinage","85 cf / xf","textar / trp","oem 1387439",""],["616","1686001","Cylindre frein 24/24","freinage","cf/xf","","oem 1686001 cylindre 24/24",""],["617","1927311","Alternateur","electrique","xf95","bosch 0124555117","oem 1927311 alternateur",""],["618","1927312","Alternateur XF","electrique","xf","bosch 0124655405","oem 1927312",""],["619","2000904","Alternateur CF","electrique","cf","bosch 0124655385","oem 2000904",""],["620","1854407","Filtre à air ignifuge","filtres","xf105","mann / fleetguard","oem 1854407 flame retardant",""],["626","2277129","Filtre à gasoil élément haut Euro 6","filtres","cf/xf euro 6 mx-11/13","mann pu 10 009 z / hengst e126kp","oem 2277129 – aussi 1852006 / 2164463 / 2133096","MX-13"],["627","1852006","Filtre gasoil alt. haut","filtres","cf/xf euro 6","mann / équiv 2277129","équiv. 2277129","MX-13"],["628","2164463","Filtre gasoil alt. haut 2","filtres","cf/xf euro 6","mann / équiv 2277129","équiv. 2277129","MX-13"],["629","2133096","Filtre gasoil alt. haut 3","filtres","cf/xf euro 6","mann / équiv 2277129","équiv. 2277129","MX-13"],["630","2272926","Kit filtres gasoil Euro 6 (KX645)","filtres","cf/xf euro 6","mann pu 9038-2 z","oem 2272926 kit gasoil","MX-13"],["631","2272927","Kit filtres gasoil Euro 6 (KX646)","filtres","cf/xf euro 6","mann pu 9039-2 z","oem 2272927 kit gasoil","MX-13"],["632","1928868","Filtre à huile Euro 6","filtres","xf106 / cf euro 6","mann hu 11003 z / mahle ox1059d","oem 1928868","MX-13"],["633","1928869","Filtre centrifuge / rotor huile","filtres","xf/cf mx-13","mahle oz 10","oem 1928869 centrifuge","MX-13"],["634","1922496","Filtre centrifuge huile MX-13","filtres","xf/cf mx-13 euro 5/6","paccar / fleetguard","oem 1922496 centrifuge rotor","MX-13"],["635","1948919","Filtre centrifuge alt.","filtres","xf/cf","mahle oz 9d","oem 1948919",""],["636","2253989","Filtre à huile Euro 6 récent","filtres","xf ii / xg euro 6","mann hu 11 009 z / mahle ox1412d","oem 2253989","MX-13"],["637","2047411","Filtre à huile alt. Euro 6","filtres","xf/cf euro 6","mann / équiv 2151728","équiv. 2151728 / 2234788","MX-13"],["638","2234788","Filtre à huile Euro 6 récent 2","filtres","xf/cf euro 6","mann hu 12009 z","oem 2234788 – lié 2151728","MX-13"]];

function systemFor(category: string): string {
  if (category === 'freinage' || category === 'pneumatique') return 'brake-system';
  if (category === 'transmission') return 'transmission-system';
  if (category === 'suspension' || category === 'direction') return 'suspension-system';
  if (category === 'electrique') return 'electrical-system';
  if (category === 'refroidissement') return 'cooling-system';
  return 'engine-system';
}

function categoryLabel(category: string): string {
  const labels: Record<string, string> = {
    filtres: 'Filters', freinage: 'Brakes', electrique: 'Electrical',
    refroidissement: 'Cooling', transmission: 'Transmission',
    suspension: 'Suspension', pneumatique: 'Pneumatics', direction: 'Steering',
  };
  return labels[category] ?? category;
}

function toPart(row: string[]): Part {
  const [sourceRow, ref, name, category, application, equivalents, notes, engine] = row;
  const alternateNumbers = Array.from(new Set((notes.match(/\b\d{6,8}\b/g) ?? []).filter((n) => n !== ref)));
  const id = `sup-daf-${ref}`;
  const sourceCitation = `${SOURCE}, row ${sourceRow}`;
  return {
    id,
    systemId: systemFor(category),
    name: `${name} — DAF ${ref}`,
    description: `${name}. Listed for ${application || 'DAF application not specified'} in the user-supplied catalogue. Exact vehicle/engine/VIN fitment is not independently verified.`,
    category: categoryLabel(category),
    specifications: {
      vehicleType: 'Truck',
      manufacturerId: 'daf-trucks',
      manufacturer: 'DAF Trucks',
      model: application,
      engine: engine || '',
      aftermarketReference: equivalents || '',
      aftermarketBrands: (equivalents.match(/\b(MANN|MAHLE|HENGST|BOSCH|KNORR|MERITOR|TEXTAR|TRP|FLEETGUARD|PACCAR|ZF)\b/gi) ?? []).join(', '),
      crossReferences: [equivalents, notes].filter(Boolean).join(' | '),
      sourceDocument: SOURCE,
      sourceRow,
      oemStatus: 'SOURCE-LISTED / NOT INDEPENDENTLY VERIFIED',
      referencePolicy: 'Transcribed from a user-supplied commercial catalogue. Confirm exact application and VIN before ordering.',
      tags: [categoryLabel(category), name, application, equivalents, notes, engine, ref].filter(Boolean).join(', ').toLowerCase(),
    },
    images: [],
    oemReferences: [{
      id: `${id}-oem`,
      partId: id,
      manufacturerId: 'daf-trucks',
      referenceNumber: ref,
      alternateNumbers,
      verificationStatus: 'source-listed',
      source: sourceCitation,
      evidenceLevel: 'parts-catalog',
    }],
    crossReferences: [],
    crossBrandReferences: [],
    compatibility: [],
    sources: [{
      id: `${id}-source`,
      partId: id,
      name: sourceCitation,
      type: 'parts-catalog',
      reliability: 'medium',
    }],
    verificationStatus: 'source-listed',
    createdAt: IMPORT_DATE,
    updatedAt: IMPORT_DATE,
  };
}

export const SUPPLIED_DAF_CATALOG_PARTS: Part[] = ROWS.map(toPart);
