# London Rides — Luxury Chauffeur Booking Platform

React + Vite + Tailwind + Framer Motion frontend with an Express API for fixed-fare
quoting and payments (Stripe cards / Google Pay / Apple Pay, and PayPal).
Built from the "Obsidian & Gold" design in `D:\LondonRides` (DESIGN.md, code.html, hero video).

## Quick start

```bash
npm install
cp .env.example .env      # optional — leave keys blank for demo mode
npm run dev               # web on http://localhost:5173, API on :4242
```

Open on your phone (same Wi-Fi) using the **Network** URL Vite prints.

## Production

```bash
npm run build
npm start                 # Express serves the API and the built site on $PORT
```

Deploy anywhere Node runs (Render, Railway, Fly.io, a VPS). Google Pay / Apple Pay need HTTPS.

## Payments

| Method | Provider | Setup |
| --- | --- | --- |
| Visa, Mastercard, Amex, Maestro | Stripe Payment Element | `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY` |
| Google Pay, Apple Pay | Stripe Express Checkout | Same Stripe keys. Enable the wallets in Stripe Dashboard → Settings → Payment methods. Apple Pay also needs your domain verified there. |
| PayPal (+ Pay Later) | PayPal Orders v2 | `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_ENV=sandbox\|live` |

- With no keys, each method runs in **demo mode**: the full UI works end to end, bookings are saved, and nothing is charged.
- The server **recomputes every price** from `src/lib/pricing.js` before creating a PaymentIntent or PayPal order, and checks the captured amount before confirming. Client totals are never trusted.
- Optional Stripe webhook: point `https://your-domain/api/webhooks/stripe` at `payment_intent.succeeded` and set `STRIPE_WEBHOOK_SECRET`.
- Stripe test card: `4242 4242 4242 4242`, any future date, any CVC.

## Where to change things

| What | File |
| --- | --- |
| Phone, WhatsApp, email, TfL licence, nav | `src/data/site.js` |
| Vehicles, capacities, minimum fares, hourly rates | `src/data/vehicles.js` |
| Pricing formula (base fare, per-mile bands, return discount, extras) | `src/lib/pricing.js` |
| Pickup locations (airports, stations, ports, hotels) | `src/data/locations.js` |
| Airports, routes, services, FAQs, reviews | `src/data/content.js` |
| Colours, fonts (design tokens) | `tailwind.config.js` |
| Hero video / images | `assets-src/` → run `npm run optimize-media` |

## Notes before launch

- **Replace placeholder content**: the phone and WhatsApp numbers, TfL licence number, review counts and testimonials come from the design mock-up and are not real.
- **Bookings** are stored in `server/data/bookings.json`. Use a real database in production, and add confirmation emails/SMS (e.g. Resend, Twilio) in `server/index.js` where bookings are confirmed.
- **Distances** are straight-line × 1.3 road factor. For exact road miles, swap `routeStats()` for Google Distance Matrix or OSRM.
- **Address search** uses Photon (OpenStreetMap, no key). For high volume, switch to Google Places.
- `src/pages/Terms.jsx` is template copy. Have it reviewed by a solicitor.
