import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const VIN_PATTERN = /^[A-HJ-NPR-Z0-9]{17}$/;
const EMPTY_VALUES = new Set(['', '0', 'not applicable', 'not applicable (na)', 'unknown', 'null', 'undefined']);

const FIELD_MAP: Array<[string, string]> = [
  ['Make', 'make'],
  ['Model', 'model'],
  ['ModelYear', 'modelYear'],
  ['Manufacturer', 'manufacturer'],
  ['Series', 'series'],
  ['Trim', 'trim'],
  ['VehicleType', 'vehicleType'],
  ['BodyClass', 'bodyClass'],
  ['EngineModel', 'engine'],
  ['DisplacementL', 'displacementL'],
  ['FuelTypePrimary', 'fuelType'],
  ['DriveType', 'driveType'],
  ['PlantCountry', 'plantCountry'],
];

type ApiRow = Record<string, unknown>;

function cleanValue(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  const text = String(value).trim();
  if (EMPTY_VALUES.has(text.toLowerCase())) return undefined;
  return text;
}

function extractRows(payload: unknown): ApiRow[] {
  if (!payload || typeof payload !== 'object' || !('Results' in payload)) return [];
  const results = (payload as { Results?: unknown }).Results;
  return Array.isArray(results) ? results.filter((row): row is ApiRow => !!row && typeof row === 'object') : [];
}

async function fetchRows(url: string): Promise<ApiRow[]> {
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
    signal: AbortSignal.timeout(6_000),
  });
  if (!response.ok) return [];
  return extractRows(await response.json());
}

function mapVinFields(row: ApiRow): Record<string, string> {
  return Object.fromEntries(
    FIELD_MAP
      .map(([sourceKey, targetKey]) => [targetKey, cleanValue(row[sourceKey])])
      .filter((entry): entry is [string, string] => typeof entry[1] === 'string'),
  );
}

function mapWmiFields(row: ApiRow): Record<string, string> {
  const mapped: Record<string, string> = {};
  const manufacturer = cleanValue(row['ManufacturerName']);
  const make = cleanValue(row['Make']);
  const vehicleType = cleanValue(row['VehicleType']);
  const country = cleanValue(row['Country']);
  if (manufacturer) mapped.manufacturer = manufacturer;
  if (make) mapped.make = make;
  if (vehicleType) mapped.vehicleType = vehicleType;
  if (country) mapped.plantCountry = country;
  return mapped;
}

function hasIdentity(vehicle: Record<string, string>): boolean {
  return Boolean(vehicle.make || vehicle.model || vehicle.manufacturer);
}

function jsonError(error: string, code: string, status: number) {
  return NextResponse.json(
    { error, code },
    { status, headers: { 'Cache-Control': 'no-store' } },
  );
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const vin = (url.searchParams.get('vin') ?? '').replace(/\s+/g, '').toUpperCase();

  if (!VIN_PATTERN.test(vin)) {
    return jsonError(
      'Enter a standard 17-character VIN. Letters I, O and Q are not valid. Some commercial vehicles use shorter chassis numbers; these require a manufacturer-specific catalogue and are not decoded by this service yet.',
      'INVALID_VIN',
      400,
    );
  }

  try {
    let rows: ApiRow[] = [];
    let vehicle: Record<string, string> = {};
    let source = 'NHTSA vPIC VIN decoder';

    try {
      rows = await fetchRows(
        `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/${encodeURIComponent(vin)}?format=json`,
      );
      if (rows[0]) vehicle = mapVinFields(rows[0]);
    } catch {
      // Continue to the WMI fallback; this can still identify some manufacturers.
    }

    if (!hasIdentity(vehicle)) {
      try {
        const wmiRows = await fetchRows(
          `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeWMI/${encodeURIComponent(vin.slice(0, 3))}?format=json`,
        );
        if (wmiRows[0]) {
          vehicle = { ...mapWmiFields(wmiRows[0]), ...vehicle };
          source = 'NHTSA vPIC WMI fallback (manufacturer-level only)';
        }
      } catch {
        // The final response below explains that this VIN could not be identified.
      }
    }

    if (!hasIdentity(vehicle)) {
      return jsonError(
        'The VIN format is valid, but available public data could not identify this vehicle. This is common for some European, Moroccan-market and commercial vehicles. Try a manufacturer-specific truck catalogue or enter the make/model manually.',
        'VEHICLE_NOT_IDENTIFIED',
        404,
      );
    }

    return NextResponse.json(
      {
        vin,
        vehicle,
        source,
        sourceUrl: 'https://vpic.nhtsa.dot.gov/api/',
        fitmentVerified: false,
        coverage: 'Partial public-data coverage; not a universal VIN database.',
        note: 'Vehicle decoding does not prove that any specific spare part fits. Confirm chassis, engine, axle and OEM reference against an authoritative parts catalogue.',
      },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    const timedOut = error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError');
    return jsonError(
      timedOut
        ? 'The VIN lookup timed out. Please try again.'
        : 'The public VIN data service could not be reached. Please try again later.',
      timedOut ? 'UPSTREAM_TIMEOUT' : 'UPSTREAM_ERROR',
      502,
    );
  }
}
