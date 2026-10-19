async function request(path, { method = 'GET', body } = {}) {
  let res;
  try {
    res = await fetch(`/api${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw Object.assign(new Error('Unable to reach the booking server.'), { offline: true });
  }
  let data = null;
  try {
    data = await res.json();
  } catch {
    /* non-JSON: API not running behind the dev proxy, or static hosting */
  }
  if (!data) throw Object.assign(new Error('Unable to reach the booking server.'), { offline: true });
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export const api = {
  config: () => request('/config'),
  stripeIntent: (booking) => request('/payments/stripe/intent', { method: 'POST', body: { booking } }),
  stripeConfirm: (ref) => request('/payments/stripe/confirm', { method: 'POST', body: { ref } }),
  paypalOrder: (booking) => request('/payments/paypal/order', { method: 'POST', body: { booking } }),
  paypalCapture: (ref, orderID) => request('/payments/paypal/capture', { method: 'POST', body: { ref, orderID } }),
  demoPay: (booking, method) => request('/payments/demo', { method: 'POST', body: { booking, method } }),
  booking: (ref) => request(`/bookings/${encodeURIComponent(ref)}`),
};
