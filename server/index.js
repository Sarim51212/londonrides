import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { existsSync } from 'node:fs';
import Stripe from 'stripe';
import { quote, CURRENCY } from '../src/lib/pricing.js';
import { validateBooking } from './validate.js';
import { newRef, getBooking, saveBooking, updateBooking, publicView } from './store.js';
import { paypalEnabled, createOrder, captureOrder } from './paypal.js';

const app = express();
const PORT = Number(process.env.PORT) || 4242;
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

app.use(cors());

// Stripe webhooks need the raw body for signature verification — register before express.json().
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), (req, res) => {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) return res.sendStatus(404);
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }
  if (event.type === 'payment_intent.succeeded') {
    const ref = event.data.object.metadata?.ref;
    if (ref && getBooking(ref)?.status !== 'confirmed') {
      updateBooking(ref, { status: 'confirmed', paymentMethod: 'stripe', paymentId: event.data.object.id });
    }
  }
  res.json({ received: true });
});

app.use(express.json({ limit: '50kb' }));

const describe = (b, q) =>
  `${q.vehicle.name} · ${b.pickup.label}${b.dropoff ? ` → ${b.dropoff.label}` : ` · ${b.hours} hrs`} · ${new Date(b.datetime).toLocaleString('en-GB', { timeZone: 'Europe/London' })}`;

/** Validates, prices server-side and stores a pending booking. */
function createPending(raw, provider) {
  const { booking, error } = validateBooking(raw);
  if (error) return { error };
  const q = quote(booking);
  if (!q || q.total <= 0) return { error: 'We could not price this journey. Please call us.' };
  const record = saveBooking({
    ref: newRef(),
    status: 'pending',
    provider,
    booking,
    total: q.total,
    currency: CURRENCY,
    lines: q.lines,
    miles: q.miles ?? null,
    minutes: q.minutes ?? null,
  });
  return { record, q };
}

app.get('/api/config', (_req, res) => {
  res.json({
    currency: CURRENCY,
    stripe: stripe && process.env.STRIPE_PUBLISHABLE_KEY ? { publishableKey: process.env.STRIPE_PUBLISHABLE_KEY } : null,
    paypal: paypalEnabled() ? { clientId: process.env.PAYPAL_CLIENT_ID } : null,
  });
});

app.post('/api/quote', (req, res) => {
  const q = quote(req.body || {});
  if (!q) return res.status(400).json({ error: 'Unable to quote this journey.' });
  res.json({ total: q.total, lines: q.lines, miles: q.miles, minutes: q.minutes });
});

// ---------- Stripe: cards, Google Pay, Apple Pay, Link ----------
app.post('/api/payments/stripe/intent', async (req, res) => {
  if (!stripe) return res.status(503).json({ error: 'Card payments are not configured.' });
  const { record, q, error } = createPending(req.body?.booking, 'stripe');
  if (error) return res.status(400).json({ error });
  try {
    const intent = await stripe.paymentIntents.create(
      {
        amount: Math.round(record.total * 100),
        currency: CURRENCY.toLowerCase(),
        automatic_payment_methods: { enabled: true },
        description: describe(record.booking, q),
        receipt_email: record.booking.passenger.email,
        metadata: { ref: record.ref, vehicle: record.booking.vehicleId },
      },
      { idempotencyKey: `intent-${record.ref}` },
    );
    updateBooking(record.ref, { paymentId: intent.id });
    res.json({ ref: record.ref, clientSecret: intent.client_secret, total: record.total });
  } catch (err) {
    console.error('Stripe intent error:', err.message);
    res.status(502).json({ error: 'Payment provider error. Please try again.' });
  }
});

app.post('/api/payments/stripe/confirm', async (req, res) => {
  if (!stripe) return res.status(503).json({ error: 'Card payments are not configured.' });
  const record = getBooking(req.body?.ref);
  if (!record || !record.paymentId) return res.status(404).json({ error: 'Booking not found.' });
  try {
    const intent = await stripe.paymentIntents.retrieve(record.paymentId);
    const paid = intent.status === 'succeeded' && intent.amount_received === Math.round(record.total * 100);
    if (!paid) return res.status(402).json({ error: `Payment not completed (status: ${intent.status}).` });
    const pm = intent.payment_method_types?.[0] ?? 'card';
    res.json(publicView(updateBooking(record.ref, { status: 'confirmed', paymentMethod: `stripe:${pm}` })));
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

// ---------- PayPal ----------
app.post('/api/payments/paypal/order', async (req, res) => {
  if (!paypalEnabled()) return res.status(503).json({ error: 'PayPal is not configured.' });
  const { record, q, error } = createPending(req.body?.booking, 'paypal');
  if (error) return res.status(400).json({ error });
  try {
    const order = await createOrder({ ref: record.ref, total: record.total, currency: CURRENCY, description: describe(record.booking, q) });
    updateBooking(record.ref, { paymentId: order.id });
    res.json({ ref: record.ref, id: order.id });
  } catch (err) {
    console.error('PayPal order error:', err.message);
    res.status(502).json({ error: 'PayPal error. Please try again.' });
  }
});

app.post('/api/payments/paypal/capture', async (req, res) => {
  if (!paypalEnabled()) return res.status(503).json({ error: 'PayPal is not configured.' });
  const record = getBooking(req.body?.ref);
  if (!record || record.paymentId !== req.body?.orderID) return res.status(404).json({ error: 'Booking not found.' });
  try {
    const result = await captureOrder(record.paymentId);
    const capture = result.purchase_units?.[0]?.payments?.captures?.[0];
    const paid = result.status === 'COMPLETED' && Number(capture?.amount?.value) === record.total;
    if (!paid) return res.status(402).json({ error: 'PayPal payment was not completed.' });
    res.json(publicView(updateBooking(record.ref, { status: 'confirmed', paymentMethod: 'paypal', captureId: capture.id })));
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

// ---------- Demo mode (only when the chosen provider has no keys) ----------
app.post('/api/payments/demo', (req, res) => {
  const method = ['card', 'google_pay', 'apple_pay', 'paypal'].includes(req.body?.method) ? req.body.method : 'card';
  const live = method === 'paypal' ? paypalEnabled() : Boolean(stripe);
  if (live) return res.status(403).json({ error: 'Demo payments are disabled when live keys are configured.' });
  const { record, error } = createPending(req.body?.booking, 'demo');
  if (error) return res.status(400).json({ error });
  res.json(publicView(updateBooking(record.ref, { status: 'confirmed', paymentMethod: method, demo: true })));
});

app.get('/api/bookings/:ref', (req, res) => {
  const record = getBooking(req.params.ref);
  if (!record) return res.status(404).json({ error: 'Booking not found.' });
  res.json(publicView(record));
});

app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }));

// ---------- Production: serve the built React app ----------
const dist = path.resolve(import.meta.dirname, '..', 'dist');
if (existsSync(dist)) {
  app.use(express.static(dist, { maxAge: '7d', index: false }));
  app.get(/.*/, (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}

app.listen(PORT, () => {
  console.log(`London Rides API on http://localhost:${PORT}`);
  console.log(`  Stripe: ${stripe ? 'live keys loaded' : 'demo mode'} · PayPal: ${paypalEnabled() ? 'live keys loaded' : 'demo mode'}`);
});
