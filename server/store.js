// Minimal JSON-file booking store. Swap for a real database (Postgres, Mongo,
// Supabase…) before production — the interface is just get/save/update.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const file = path.join(import.meta.dirname, 'data', 'bookings.json');
mkdirSync(path.dirname(file), { recursive: true });

let bookings = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8') || '{}') : {};
const persist = () => writeFileSync(file, JSON.stringify(bookings, null, 2));

export function newRef() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let ref;
  do {
    ref = 'LR-' + Array.from(crypto.randomBytes(6), (b) => alphabet[b % alphabet.length]).join('');
  } while (bookings[ref]);
  return ref;
}

export const getBooking = (ref) => bookings[ref] ?? null;

export function saveBooking(record) {
  bookings[record.ref] = { ...record, createdAt: new Date().toISOString() };
  persist();
  return bookings[record.ref];
}

export function updateBooking(ref, patch) {
  if (!bookings[ref]) return null;
  bookings[ref] = { ...bookings[ref], ...patch, updatedAt: new Date().toISOString() };
  persist();
  return bookings[ref];
}

/** Fields safe to return to the browser. */
export const publicView = (b) =>
  b && {
    ref: b.ref,
    status: b.status,
    paymentMethod: b.paymentMethod,
    demo: Boolean(b.demo),
    total: b.total,
    currency: b.currency,
    lines: b.lines,
    miles: b.miles,
    minutes: b.minutes,
    booking: b.booking,
    createdAt: b.createdAt,
  };
