import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { byId } from '../data/locations.js';
import { quote } from '../lib/pricing.js';
import { defaultPickupTime } from '../lib/format.js';

const KEY = 'lr-booking-v1';

export const toPlace = (loc) => loc && { id: loc.id, label: loc.name, sub: loc.sub, lat: loc.lat, lng: loc.lng, type: loc.type };

const initial = () => ({
  journeyType: 'oneway',
  pickup: toPlace(byId.lhr),
  dropoff: toPlace(byId.mayfair),
  datetime: defaultPickupTime(),
  returnDatetime: '',
  hours: 4,
  passengers: 2,
  luggage: 2,
  flightNumber: '',
  vehicleId: null,
  extras: { meetGreet: true, childSeats: 0, porter: false },
  passenger: { name: '', email: '', phone: '', notes: '' },
});

function load() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(KEY));
    if (saved && new Date(saved.datetime) > new Date()) return { ...initial(), ...saved };
  } catch {
    /* storage unavailable */
  }
  return initial();
}

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [booking, setBooking] = useState(load);

  useEffect(() => {
    try {
      sessionStorage.setItem(KEY, JSON.stringify(booking));
    } catch {
      /* storage unavailable */
    }
  }, [booking]);

  const update = useCallback((patch) => setBooking((b) => ({ ...b, ...(typeof patch === 'function' ? patch(b) : patch) })), []);
  const reset = useCallback(() => setBooking(initial()), []);
  const current = useMemo(() => (booking.vehicleId ? quote(booking) : null), [booking]);

  const value = useMemo(() => ({ booking, update, reset, quote: current }), [booking, update, reset, current]);
  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export const useBooking = () => useContext(BookingContext);
