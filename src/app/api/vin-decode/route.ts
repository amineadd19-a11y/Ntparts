import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const VIN_PATTERN = /^[A-HJ-NPR-Z0-9]{17}$/;

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

export async function GET(request: Request) {
  const url = new URL(request.url);
  const rawVin = url.searchParams.get('vin') ?? '';
  const vin = rawVin.trim().toUpperCase();

  if (!VIN_PATTERN.test(vin)) {
    return NextResponse.json(
      {
        error:
          'Enter a 17-character VIN using letters and numbers. The letters I, O and Q are not valid VIN characters. Short chassis numbers may not be supported.',
        code: 'INVALID_VIN',
      },
      { status: 400, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  try {
    const upstream = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/${encodeURIComponent(vin)}?format=json`,
      {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
        signal: AbortSignal.timeout(8_000),
      },
    );

    if (!upstream.ok) {
      return NextResponse.json(
        { error: 'The official VIN data service is temporarily unavailable. Please try again later.', code: 'UPSTREAM_UNAVAILABLE' },
        { status: 502, headers: { 'Cache-Control': 'no-store' } },
      );
    }

    const payload: unknown = await upstream.json();
    const results =
      payload && typeof payload === 'object' && 'Results' in payload && Array.isArray(payload.Results)
        ? payload.Results
        : [];
    const first = results[0];

    if (!first || typeof first !== 'object') {
      return NextResponse.json(
        { error: 'No vehicle details were returned for this VIN.', code: 'NO_DATA' },
        { status: 404, headers: { 'Cache-Control': 'no-store' } },
      );
    }

    const source = first as Record<string, unknown>;
    const vehicle = Object.fromEntries(
      FIELD_MAP
        .map(([sourceKey, targetKey]) => [targetKey, source[sourceKey]])
        .filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== ''),
    );

    const hasIdentity = Boolean(vehicle.make || vehicle.model || vehicle.modelYear || vehicle.manufacturer);
    if (!hasIdentity) {
      return NextResponse.json(
        {
          error: 'The VIN was submitted, but the official database could not identify this vehicle reliably. This may happen with vehicles intended for markets outside the United States.',
          code: 'VEHICLE_NOT_IDENTIFIED',
        },
        { status: 404, headers: { 'Cache-Control': 'no-store' } },
      );
    }

    return NextResponse.json(
      {
        vin,
        vehicle,
        source: 'NHTSA vPIC',
        sourceUrl: 'https://vpic.nhtsa.dot.gov/api/',
        fitmentVerified: false,
        note: 'Vehicle decoding does not prove that any specific spare part fits this vehicle. Confirm the chassis, engine, axle and OEM reference against an authoritative parts catalogue.',
      },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    const timedOut = error instanceof Error && error.name === 'TimeoutError';
    return NextResponse.json(
      {
        error: timedOut
          ? 'The VIN lookup timed out. Please try again.'
          : 'The official VIN data service could not be reached. Please try again later.',
        code: timedOut ? 'UPSTREAM_TIMEOUT' : 'UPSTREAM_ERROR',
      },
      { status: 502, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
