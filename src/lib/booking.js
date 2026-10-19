/** Shapes client booking state into the API payload (ISO dates, trimmed fields). */
export function toPayload(b) {
  return {
    journeyType: b.journeyType,
    pickup: b.pickup,
    dropoff: b.journeyType === 'hourly' ? b.dropoff ?? null : b.dropoff,
    datetime: new Date(b.datetime).toISOString(),
    returnDatetime: b.journeyType === 'return' && b.returnDatetime ? new Date(b.returnDatetime).toISOString() : null,
    hours: b.hours,
    passengers: b.passengers,
    luggage: b.luggage,
    vehicleId: b.vehicleId,
    flightNumber: b.flightNumber,
    extras: b.extras,
    passenger: {
      name: b.passenger.name.trim(),
      email: b.passenger.email.trim(),
      phone: b.passenger.phone.trim(),
      notes: b.passenger.notes.trim(),
    },
  };
}

const LAST = 'lr-last-booking';

export function rememberBooking(record) {
  try {
    sessionStorage.setItem(LAST, JSON.stringify(record));
  } catch {
    /* storage unavailable */
  }
}

export function recallBooking(ref) {
  try {
    const r = JSON.parse(sessionStorage.getItem(LAST));
    return r?.ref === ref ? r : null;
  } catch {
    return null;
  }
}
