// Fixed-fare pricing engine. Imported by both the React app and the API server,
// which recomputes every amount before taking payment — never trust client totals.
import { VEHICLES, vehicleById } from '../data/vehicles.js';

export const CURRENCY = 'GBP';
const BASE_FARE = 25; // £ flag-fall for a Standard Saloon
// £ per road mile for a Standard Saloon, tapering on long-distance runs.
const MILE_BANDS = [
  { upTo: 20, rate: 2.4 },
  { upTo: 60, rate: 1.6 },
  { upTo: Infinity, rate: 1.3 },
];
const ROAD_FACTOR = 1.3; // straight-line → driving distance
const RETURN_DISCOUNT = 0.05;
export const MIN_HOURS = 3;
export const MAX_HOURS = 12;

export const EXTRAS = {
  meetGreet: { label: 'Terminal Meet & Greet', price: 0, note: 'Complimentary for airport pickups' },
  childSeats: { label: 'Child / Booster Seats', price: 0, note: 'Free on request' },
  porter: { label: 'Executive Luggage Porter', price: 15, note: 'Doorstep & terminal assistance' },
};

const toRad = (d) => (d * Math.PI) / 180;

export function straightLineMiles(a, b) {
  const R = 3958.8;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function routeStats(pickup, dropoff) {
  if (!validPoint(pickup) || !validPoint(dropoff)) return null;
  const miles = Math.max(1, straightLineMiles(pickup, dropoff) * ROAD_FACTOR);
  // Slower average speed for short, congested central journeys.
  const mph = miles < 8 ? 14 : miles < 25 ? 24 : miles < 60 ? 34 : 45;
  const minutes = Math.round((miles / mph) * 60 + 6);
  return { miles: round1(miles), minutes };
}

export function validPoint(p) {
  // Coverage: Great Britain bounding box.
  return p && Number.isFinite(p.lat) && Number.isFinite(p.lng) && p.lat > 49.8 && p.lat < 59 && p.lng > -8.3 && p.lng < 2;
}

function oneWayFare(vehicle, miles) {
  let distanceFare = 0;
  let from = 0;
  for (const band of MILE_BANDS) {
    if (miles <= from) break;
    distanceFare += (Math.min(miles, band.upTo) - from) * band.rate;
    from = band.upTo;
  }
  const raw = (BASE_FARE + distanceFare) * vehicle.multiplier;
  return Math.max(vehicle.minFare, Math.round(raw));
}

/**
 * @param {object} b booking: { journeyType, pickup, dropoff, hours, vehicleId, extras }
 * @returns {{ lines: {label:string, amount:number}[], total:number, miles?:number, minutes?:number } | null}
 */
export function quote(b, vehicleId = b.vehicleId) {
  const vehicle = vehicleById[vehicleId];
  if (!vehicle) return null;
  const lines = [];
  let stats = null;

  if (b.journeyType === 'hourly') {
    if (!validPoint(b.pickup)) return null;
    const hours = clamp(Math.round(Number(b.hours) || MIN_HOURS), MIN_HOURS, MAX_HOURS);
    lines.push({ label: `As-directed hire · ${hours} hrs × £${vehicle.hourly}`, amount: hours * vehicle.hourly });
  } else {
    stats = routeStats(b.pickup, b.dropoff);
    if (!stats) return null;
    const fare = oneWayFare(vehicle, stats.miles);
    lines.push({ label: 'Outbound journey', amount: fare });
    if (b.journeyType === 'return') {
      lines.push({ label: 'Return journey', amount: fare });
      lines.push({ label: `Return discount (${RETURN_DISCOUNT * 100}%)`, amount: -Math.round(fare * 2 * RETURN_DISCOUNT) });
    }
  }

  const ex = b.extras || {};
  if (ex.porter) lines.push({ label: EXTRAS.porter.label, amount: EXTRAS.porter.price * (b.journeyType === 'return' ? 2 : 1) });
  if (ex.meetGreet) lines.push({ label: EXTRAS.meetGreet.label, amount: 0 });
  if (ex.childSeats > 0) lines.push({ label: `${EXTRAS.childSeats.label} × ${ex.childSeats}`, amount: 0 });

  const total = lines.reduce((s, l) => s + l.amount, 0);
  return { vehicle, lines, total, ...stats };
}

/** Prices for every vehicle, flagging which ones fit the party. */
export function quoteAll(b) {
  return VEHICLES.map((v) => ({
    vehicle: v,
    fits: v.passengers >= (b.passengers || 1) && v.suitcases >= (b.luggage || 0),
    quote: quote(b, v.id),
  }));
}

/** "From" price between two known places for a vehicle (used on fare tables & route cards). */
export function fixedFare(from, to, vehicleId = 'saloon') {
  return quote({ journeyType: 'oneway', pickup: from, dropoff: to }, vehicleId)?.total ?? null;
}

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
const round1 = (n) => Math.round(n * 10) / 10;
