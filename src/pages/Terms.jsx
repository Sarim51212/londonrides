import PageHero from '../components/layout/PageHero.jsx';
import { SITE } from '../data/site.js';
import usePageMeta from '../lib/usePageMeta.js';

// Template policy copy — have it reviewed by a solicitor before launch.
const SECTIONS = [
  {
    id: 'booking',
    title: 'Bookings & fixed fares',
    body: [
      'All fares are quoted in pounds sterling and include VAT, the London Congestion Charge, ULEZ, airport drop-off and parking fees, and tolls.',
      'Your fare is fixed at the time of booking. It may change only if you alter the journey (for example adding a stop, changing the destination or extending hourly hire).',
      'Bookings require at least 1 hour notice. A booking is confirmed once payment is completed and you receive a booking reference.',
    ],
  },
  {
    id: 'waiting',
    title: 'Waiting time',
    body: [
      'Airport pickups include 60 minutes of free waiting from the actual landing time. Other pickups include 15 minutes of free waiting from the booked time.',
      'Additional waiting may be charged at the vehicle’s hourly rate, pro rata, after we have tried to contact you.',
    ],
  },
  {
    id: 'cancellation',
    title: 'Cancellation & refunds',
    body: [
      'Cancel more than 12 hours before pickup for a full refund to your original payment method.',
      'Cancellations within 12 hours of pickup, or no-shows, are charged in full.',
      'Refunds are processed within 2 working days; your bank may take 5–10 working days to show the credit.',
    ],
  },
  {
    id: 'conduct',
    title: 'Passengers & luggage',
    body: [
      'Please choose a vehicle with enough capacity for your party and luggage. Chauffeurs may refuse to carry excess passengers or luggage for safety reasons.',
      'Child seats are provided free on request and must be requested at booking.',
      'Smoking, vaping and consumption of food in vehicles is not permitted. Soiling charges may apply.',
    ],
  },
  {
    id: 'privacy',
    title: 'Privacy policy',
    body: [
      'We collect only the details needed to fulfil your booking: name, contact details, journey details and flight number.',
      'Card and wallet payments are processed by Stripe and PayPal. We never see or store your full card details.',
      `To access, correct or delete your data, email ${SITE.email}.`,
    ],
  },
];

export default function Terms() {
  usePageMeta('Terms & Conditions');
  return (
    <>
      <PageHero eyebrow="Policies" title="Terms, cancellation & privacy" crumbs={[{ label: 'Terms' }]} />
      <section className="bg-ink-850 py-12 md:py-16">
        <div className="mx-auto grid max-w-5xl gap-10 px-5 md:px-8 lg:grid-cols-[220px_1fr]">
          <nav className="hidden lg:block">
            <ul className="sticky top-28 space-y-2 text-[14px]">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-sand hover:text-gold-bright">{s.title}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="space-y-10">
            {SECTIONS.map((s) => (
              <article key={s.id} id={s.id} className="scroll-mt-28">
                <h2 className="mb-4 font-display text-[24px] font-semibold text-cream">{s.title}</h2>
                <ul className="space-y-3 text-[15px] leading-relaxed text-sand">
                  {s.body.map((p) => (
                    <li key={p} className="flex gap-3">
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                      {p}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
            <p className="text-[13px] text-slatey">London Rides Ltd · {SITE.tflLicence} · {SITE.address}</p>
          </div>
        </div>
      </section>
    </>
  );
}
