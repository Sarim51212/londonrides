const stamp = (d) => new Date(d).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const esc = (s = '') => s.replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n');

/** Downloads an .ics calendar invite for a confirmed booking. */
export function downloadIcs(record) {
  const b = record.booking;
  const start = new Date(b.datetime);
  const end = new Date(start.getTime() + (record.minutes || (b.hours || 1) * 60) * 60000);
  const to = b.dropoff ? ` to ${b.dropoff.label}` : '';
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//London Rides//Booking//EN',
    'BEGIN:VEVENT',
    `UID:${record.ref}@londonrides`,
    `DTSTAMP:${stamp(Date.now())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${esc(`London Rides chauffeur${to}`)}`,
    `LOCATION:${esc(b.pickup.label)}`,
    `DESCRIPTION:${esc(`Booking ${record.ref}\nPickup: ${b.pickup.label}${to ? `\nDrop-off: ${b.dropoff.label}` : ''}${b.flightNumber ? `\nFlight: ${b.flightNumber}` : ''}`)}`,
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Your chauffeur arrives in 2 hours',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  const url = URL.createObjectURL(new Blob([lines.join('\r\n')], { type: 'text/calendar' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: `london-rides-${record.ref}.ics` });
  a.click();
  URL.revokeObjectURL(url);
}
