import { CATALOG_PARTS } from '@/data/catalog';
import type { Part } from '@/types';
import type { CatalogMatch } from './types';
import { searchCatalogue, searchByOem } from '@/lib/catalog/search';

function normalize(value: string): string {
  return value.toLowerCase().replace(/[\s\-./]/g, '');
}

function references(part: Part): string[] {
  return Array.from(
    new Set(
      part.oemReferences.flatMap((ref) => [ref.referenceNumber, ...(ref.alternateNumbers ?? [])]),
    ),
  );
}

function toMatch(part: Part, relevance: number): CatalogMatch {
  return {
    id: part.id,
    name: part.name,
    manufacturer: part.specifications?.manufacturer,
    model: part.specifications?.model,
    category: part.category,
    references: references(part),
    verificationStatus: part.verificationStatus,
    sourceUrls: part.sources.map((source) => source.url).filter((url): url is string => Boolean(url)),
    relevance,
  };
}

/** Uses the canonical catalogue search engine (same as website search). */
export function searchPart(query: string): CatalogMatch[] {
  const q = query.trim();
  if (!q) return [];

  const { results } = searchCatalogue(q, { limit: 12 });
  return results.map((r) => {
    const nq = normalize(q);
    const refs = references(r.part).map(normalize);
    const relevance =
      r.matchKind === 'exact-verified-oem'
        ? 1
        : r.matchKind === 'exact-source-listed-oem' || r.matchKind === 'exact-oem'
          ? 0.95
          : refs.includes(nq)
            ? 0.9
            : r.score / 320;
    return toMatch(r.part, Math.min(1, relevance));
  });
}

export function findOEM(query: string): CatalogMatch[] {
  return searchByOem(query, { limit: 12 })
    .filter((part) =>
      part.oemReferences.some((ref) => ref.verificationStatus === 'verified'),
    )
    .map((part) => toMatch(part, 1));
}

export function findCrossReferences(query: string): CatalogMatch[] {
  const matches = searchPart(query);
  const normalized = normalize(query);
  const cross = new Map<string, CatalogMatch>();

  for (const match of matches) {
    for (const reference of match.references) {
      if (normalize(reference) === normalized) continue;
      cross.set(`${match.id}:${reference}`, match);
    }
  }

  return Array.from(cross.values()).slice(0, 12);
}

export function findApplications(query: string): CatalogMatch[] {
  return searchPart(query).filter((match) => Boolean(match.manufacturer || match.model));
}

export function findTruckModels(query: string): string[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const models = new Set<string>();
  for (const part of CATALOG_PARTS) {
    const haystack =
      `${part.specifications?.manufacturer ?? ''} ${part.specifications?.model ?? ''} ${part.description ?? ''}`.toLowerCase();
    if (haystack.includes(q)) {
      const manufacturer = part.specifications?.manufacturer;
      const model = part.specifications?.model;
      if (manufacturer && model) models.add(`${manufacturer} ${model}`);
    }
  }
  return Array.from(models).slice(0, 20);
}

export function compareParts(left: string, right: string) {
  const leftMatches = searchPart(left);
  const rightMatches = searchPart(right);
  const leftRefs = new Set(leftMatches.flatMap((match) => match.references.map(normalize)));
  const rightRefs = new Set(rightMatches.flatMap((match) => match.references.map(normalize)));
  const sharedReferences = Array.from(leftRefs).filter((reference) => rightRefs.has(reference));
  const sameCatalogPart = leftMatches.some((leftMatch) =>
    rightMatches.some((rightMatch) => leftMatch.id === rightMatch.id),
  );
  const sharedApplications = leftMatches
    .flatMap((leftMatch) =>
      rightMatches
        .filter(
          (rightMatch) =>
            leftMatch.manufacturer === rightMatch.manufacturer &&
            leftMatch.model === rightMatch.model,
        )
        .map((rightMatch) => `${leftMatch.manufacturer ?? ''} ${leftMatch.model ?? ''}`.trim()),
    )
    .filter(Boolean);

  return {
    left: leftMatches.slice(0, 6),
    right: rightMatches.slice(0, 6),
    sameCatalogPart,
    sharedReferences: Array.from(new Set(sharedReferences)),
    sharedApplications: Array.from(new Set(sharedApplications)),
    conclusion: sameCatalogPart
      ? 'SAME PART'
      : sharedReferences.length > 0
        ? 'POSSIBLE EQUIVALENT — VERIFY APPLICATION'
        : 'INSUFFICIENT DATA',
  };
}

export const AI_TOOL_DEFINITIONS = [
  {
    name: 'searchPart',
    description:
      'Search the NTParts internal catalogue by OEM, aftermarket reference, model or description. Uses the same canonical search engine as the website.',
    parameters: {
      type: 'OBJECT',
      properties: { query: { type: 'STRING', description: 'Part reference or natural-language query.' } },
      required: ['query'],
    },
  },
  {
    name: 'findOEM',
    description: 'Find verified OEM references already present in NTParts.',
    parameters: {
      type: 'OBJECT',
      properties: { query: { type: 'STRING', description: 'Reference or part description.' } },
      required: ['query'],
    },
  },
  {
    name: 'findCrossReferences',
    description: 'Find internal cross-reference candidates and alternate references.',
    parameters: {
      type: 'OBJECT',
      properties: { query: { type: 'STRING', description: 'Part reference.' } },
      required: ['query'],
    },
  },
  {
    name: 'findApplications',
    description: 'Find truck manufacturers and models associated with a reference in NTParts.',
    parameters: {
      type: 'OBJECT',
      properties: { query: { type: 'STRING', description: 'Part reference or part description.' } },
      required: ['query'],
    },
  },
  {
    name: 'findTruckModels',
    description: 'Find truck model matches in the NTParts catalogue.',
    parameters: {
      type: 'OBJECT',
      properties: { query: { type: 'STRING', description: 'Truck manufacturer/model.' } },
      required: ['query'],
    },
  },
  {
    name: 'compareParts',
    description: 'Compare two part references using the internal catalogue.',
    parameters: {
      type: 'OBJECT',
      properties: {
        left: { type: 'STRING', description: 'First part reference.' },
        right: { type: 'STRING', description: 'Second part reference.' },
      },
      required: ['left', 'right'],
    },
  },
];

export async function executeCatalogTool(name: string, args: Record<string, unknown>) {
  switch (name) {
    case 'searchPart':
      return searchPart(String(args.query ?? ''));
    case 'findOEM':
      return findOEM(String(args.query ?? ''));
    case 'findCrossReferences':
      return findCrossReferences(String(args.query ?? ''));
    case 'findApplications':
      return findApplications(String(args.query ?? ''));
    case 'findTruckModels':
      return findTruckModels(String(args.query ?? ''));
    case 'compareParts':
      return compareParts(String(args.left ?? ''), String(args.right ?? ''));
    default:
      return { error: `Unknown internal tool: ${name}` };
  }
}
