// Thin PayPal Orders v2 REST client (no SDK needed).
const base = () => (process.env.PAYPAL_ENV === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com');

export const paypalEnabled = () => Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET);

async function accessToken() {
  const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');
  const res = await fetch(`${base()}/v1/oauth2/token`, {
    method: 'POST',
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
  });
  if (!res.ok) throw new Error(`PayPal auth failed (${res.status})`);
  return (await res.json()).access_token;
}

async function call(path, body) {
  const res = await fetch(`${base()}${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${await accessToken()}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.details?.[0]?.description || data?.message || `PayPal error (${res.status})`);
  return data;
}

export function createOrder({ ref, total, currency, description }) {
  return call('/v2/checkout/orders', {
    intent: 'CAPTURE',
    purchase_units: [
      {
        reference_id: ref,
        custom_id: ref,
        description: description.slice(0, 127),
        amount: { currency_code: currency, value: total.toFixed(2) },
      },
    ],
    application_context: { brand_name: 'London Rides', shipping_preference: 'NO_SHIPPING', user_action: 'PAY_NOW' },
  });
}

export const captureOrder = (orderId) => call(`/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`);
