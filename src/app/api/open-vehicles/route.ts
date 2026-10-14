import { NextResponse } from 'next/server';

export const revalidate = 86400;

const BASE = 'https://raw.githubusercontent.com/vehiclesdb/vehiclesdb/main/catalog';

type VehicleMake = { id: string; name: string; slug: string; kinds?: string[] };
type VehicleModel = {
  id: string; make_id: string; name: string; slug: string; kind: 'truck' | 'bus';
  availability?: Array<{ country: string; evidence: string; source: string }>;
  regions?: string[];
};

async function readJson<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE}/${path}.json`, {
    next: { revalidate: 86400 },
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) throw new Error(`VehiclesDB request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

export async function GET(request: Request) {
  try {
    const kindParam = new URL(request.url).searchParams.get('kind');
    const kinds: Array<'truck' | 'bus'> = kindParam === 'truck' || kindParam === 'bus'
      ? [kindParam]
      : ['truck', 'bus'];

    const groups = await Promise.all(kinds.map(async (kind) => {
      const [makes, models] = await Promise.all([
        readJson<VehicleMake[]>(`${kind}/makes`),
        readJson<VehicleModel[]>(`${kind}/models`),
      ]);
      const makeMap = new Map(makes.map((make) => [make.id, make.name]));
      return models.map((model) => ({
        id: model.id,
        kind: model.kind,
        makeId: model.make_id,
        make: makeMap.get(model.make_id) ?? model.make_id,
        model: model.name,
        slug: model.slug,
        countries: [...new Set((model.availability ?? []).map((item) => item.country))],
        regions: model.regions ?? [],
      }));
    }));

    const vehicles = groups.flat().sort((a, b) =>
      a.make.localeCompare(b.make) || a.model.localeCompare(b.model)
    );
    return NextResponse.json({
      source: 'VehiclesDB',
      datasetLicense: 'CC-BY-4.0',
      attribution: 'Vehicle data by VehiclesDB',
      attributionUrl: 'https://vehiclesdb.com',
      kind: kinds.length === 1 ? kinds[0] : 'truck,bus',
      count: vehicles.length,
      vehicles,
      notice: 'Vehicle identity only. This data does not establish part compatibility, OEM references, or current stock.',
    }, {
      headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' },
    });
  } catch {
    return NextResponse.json(
      { error: 'Open vehicle data is temporarily unavailable. Please try again later.' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
