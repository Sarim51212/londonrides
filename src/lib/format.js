export const gbp = (n, { pence = false } = {}) =>
  new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: pence ? 2 : 0,
    maximumFractionDigits: pence ? 2 : 0,
  }).format(n ?? 0);

export const formatDateTime = (iso) =>
  iso
    ? new Date(iso).toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
    : '';

export const formatDuration = (mins) => {
  if (!mins) return '';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h ? `${h}h ${m.toString().padStart(2, '0')}m` : `${m} mins`;
};

/** Value for <input type="datetime-local"> in the user's local time. */
export function toLocalInput(date) {
  const d = new Date(date);
  d.setSeconds(0, 0);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Earliest bookable slot: now + 2h, rounded up to the next 15 minutes. */
export function defaultPickupTime() {
  const d = new Date(Date.now() + 2 * 60 * 60 * 1000);
  d.setMinutes(Math.ceil(d.getMinutes() / 15) * 15, 0, 0);
  return toLocalInput(d);
}

export const minPickupTime = () => toLocalInput(new Date(Date.now() + 60 * 60 * 1000));
