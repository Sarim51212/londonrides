import { vehicleById } from '../src/data/vehicles.js';
import { validPoint, straightLineMiles, MIN_HOURS, MAX_HOURS } from '../src/lib/pricing.js';

const str = (v, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const int = (v, lo, hi) => Math.min(hi, Math.max(lo, Math.round(Number(v) || 0)));

function place(p) {
  if (!p || typeof p !== 'object') return null;
  const out = { label: str(p.label, 160), sub: str(p.sub, 160), lat: Number(p.lat), lng: Number(p.lng), type: str(p.type, 20) };
  return out.label && validPoint(out) ? out : null;
}

/** Normalises an untrusted booking payload. Returns { booking } or { error }. */
export function validateBooking(raw) {
  if (!raw || typeof raw !== 'object') return { error: 'Missing booking details.' };
  const journeyType = ['oneway', 'return', 'hourly'].includes(raw.journeyType) ? raw.journeyType : null;
  if (!journeyType) return { error: 'Choose a journey type.' };

  const pickup = place(raw.pickup);
  if (!pickup) return { error: 'Choose a valid pickup location in the UK.' };
  const dropoff = place(raw.dropoff); // optional for hourly hire
  if (journeyType !== 'hourly' && !dropoff) return { error: 'Choose a valid drop-off location in the UK.' };
  if (dropoff && journeyType !== 'hourly' && straightLineMiles(pickup, dropoff) < 0.3) return { error: 'Pickup and destination must be different.' };

  const when = new Date(raw.datetime);
  if (Number.isNaN(when.getTime())) return { error: 'Choose a pickup date and time.' };
  if (when.getTime() < Date.now() + 60 * 60 * 1000) return { error: 'Pickups must be at least 1 hour from now.' };

  let returnDatetime = null;
  if (journeyType === 'return') {
    const r = new Date(raw.returnDatetime);
    if (Number.isNaN(r.getTime()) || r <= when) return { error: 'The return pickup must be after the outbound pickup.' };
    returnDatetime = r.toISOString();
  }

  const vehicle = vehicleById[raw.vehicleId];
  if (!vehicle) return { error: 'Choose a vehicle.' };
  const passengers = int(raw.passengers, 1, 16);
  const luggage = int(raw.luggage, 0, 16);
  if (passengers > vehicle.passengers || luggage > vehicle.suitcases) {
    return { error: `The ${vehicle.name} cannot fit ${passengers} passengers and ${luggage} suitcases.` };
  }

  const c = raw.passenger || {};
  const passenger = { name: str(c.name, 80), email: str(c.email, 120), phone: str(c.phone, 30), notes: str(c.notes, 600) };
  if (passenger.name.length < 2) return { error: 'Enter the lead passenger name.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(passenger.email)) return { error: 'Enter a valid email address.' };
  if (passenger.phone.replace(/\D/g, '').length < 7) return { error: 'Enter a valid phone number.' };

  const e = raw.extras || {};
  return {
    booking: {
      journeyType,
      pickup,
      dropoff,
      datetime: when.toISOString(),
      returnDatetime,
      hours: journeyType === 'hourly' ? int(raw.hours, MIN_HOURS, MAX_HOURS) : null,
      passengers,
      luggage,
      vehicleId: vehicle.id,
      flightNumber: str(raw.flightNumber, 12).toUpperCase(),
      extras: { meetGreet: Boolean(e.meetGreet), porter: Boolean(e.porter), childSeats: int(e.childSeats, 0, 4) },
      passenger,
    },
  };
}
