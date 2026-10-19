import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarPlus, Printer, MessageCircle, Loader2, Car, Mail, Phone, Info, AlertCircle } from 'lucide-react';
import { api } from '../lib/api.js';
import { recallBooking, rememberBooking } from '../lib/booking.js';
import { downloadIcs } from '../lib/calendar.js';
import { gbp } from '../lib/format.js';
import { vehicleById } from '../data/vehicles.js';
import { TripDetails, PriceLines } from '../components/booking/Summary.jsx';
import { SITE } from '../data/site.js';
import usePageMeta from '../lib/usePageMeta.js';

const METHOD_LABEL = { card: 'Card', google_pay: 'Google Pay', apple_pay: 'Apple Pay', paypal: 'PayPal' };

function Burst() {
  const particles = useMemo(
    () => Array.from({ length: 22 }, (_, i) => ({ angle: (i / 22) * Math.PI * 2, dist: 70 + Math.random() * 70, size: 4 + Math.random() * 6, delay: Math.random() * 0.15 })),
    [],
  );
  return (
    <div className="pointer-events-none absolute inset-0">
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="absolute left-1/2 top-1/2 rounded-full bg-gradient-to-br from-gold-pale to-gold"
          style={{ width: p.size, height: p.size, marginLeft: -p.size / 2, marginTop: -p.size / 2 }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
          animate={{ x: Math.cos(p.angle) * p.dist, y: Math.sin(p.angle) * p.dist, opacity: 0, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.45 + p.delay, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

function Tick() {
  return (
    <div className="relative mx-auto h-24 w-24">
      <Burst />
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }} className="absolute inset-0 rounded-full bg-gradient-to-br from-gold-bright to-gold shadow-[0_0_60px_rgba(212,175,55,0.5)]" />
      <svg viewBox="0 0 52 52" className="absolute inset-0 h-full w-full">
        <motion.path d="M15 27 l7 7 l15 -16" fill="none" stroke="#0e1321" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.35, ease: 'easeOut' }} />
      </svg>
    </div>
  );
}

export default function Confirmation() {
  usePageMeta('Booking Confirmed');
  const { ref } = useParams();
  const { state } = useLocation();
  const [params] = useSearchParams();
  const [record, setRecord] = useState(() => state?.record ?? recallBooking(ref));
  const [error, setError] = useState('');

  useEffect(() => {
    if (record?.status === 'confirmed') return;
    // Returning from a Stripe redirect (e.g. 3D Secure) → verify server-side.
    const load = params.get('provider') === 'stripe' ? api.stripeConfirm(ref) : api.booking(ref);
    load
      .then((r) => {
        setRecord(r);
        rememberBooking(r);
      })
      .catch((e) => setError(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  if (!record && !error) {
    return (
      <div className="grid min-h-screen place-items-center bg-ink-850">
        <Loader2 size={28} className="animate-spin text-gold" />
      </div>
    );
  }

  if (!record) {
    return (
      <div className="grid min-h-screen place-items-center bg-ink-850 px-5 text-center">
        <div className="max-w-md space-y-4">
          <AlertCircle size={40} className="mx-auto text-red-300" />
          <h1 className="font-display text-[28px] text-white">We couldn’t find that booking</h1>
          <p className="text-sand">{error} If you were charged, please contact us with reference <b className="text-white">{ref}</b>.</p>
          <a href={SITE.phoneHref} className="btn-gold">
            <Phone size={16} /> {SITE.phone}
          </a>
        </div>
      </div>
    );
  }

  const b = record.booking;
  const vehicle = vehicleById[b.vehicleId];
  const pending = record.status !== 'confirmed';

  return (
    <div className="min-h-screen bg-ink-850 pb-24 pt-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.16),transparent_60%)]" />
      <div className="relative mx-auto max-w-2xl px-5">
        <div className="mb-8 text-center">
          <Tick />
          <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-6 font-display text-[32px] font-semibold text-white md:text-[40px]">
            {pending ? 'Payment processing' : 'Your chauffeur is booked'}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }} className="mt-2 text-[15px] text-sand">
            Confirmation sent to <b className="text-white">{b.passenger.email}</b>. Driver details arrive by SMS & WhatsApp before pickup.
          </motion.p>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9 }} className="mt-5 inline-flex items-center gap-3 rounded-full border border-gold/40 bg-gold/10 px-5 py-2">
            <span className="text-label-caps uppercase text-gold-muted">Reference</span>
            <span className="font-mono text-[17px] font-bold tracking-wider text-gold-bright">{record.ref}</span>
          </motion.div>
        </div>

        {record.demo && (
          <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-gold/30 bg-gold/10 p-3.5 text-[12.5px] text-gold-pale print:hidden">
            <Info size={17} className="mt-0.5 shrink-0" /> Demo booking — no payment was taken{record.local ? ' and the booking server was offline, so this was not saved' : ''}.
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="overflow-hidden rounded-2xl border border-white/10 bg-ink-750 shadow-elevated">
          {vehicle && (
            <div className="flex items-center gap-4 border-b border-white/10 p-4">
              <img src={vehicle.image} alt="" className="h-16 w-24 rounded-lg object-cover" />
              <div>
                <div className="font-display text-[19px] font-semibold text-white">{vehicle.name}</div>
                <div className="text-[12.5px] text-gold-muted">{vehicle.model}</div>
              </div>
            </div>
          )}
          <div className="space-y-5 p-5">
            <TripDetails booking={b} />
            <div className="grid gap-2 rounded-xl bg-ink-900/60 p-4 text-[13px] text-sand sm:grid-cols-2">
              <span className="flex items-center gap-2"><Car size={14} className="text-gold" /> {b.passenger.name}</span>
              <span className="flex items-center gap-2"><Phone size={14} className="text-gold" /> {b.passenger.phone}</span>
              <span className="flex items-center gap-2 sm:col-span-2"><Mail size={14} className="text-gold" /> {b.passenger.email}</span>
            </div>
            <div className="border-t border-white/10 pt-4">
              <PriceLines quote={record} />
            </div>
            <div className="flex items-end justify-between border-t border-white/10 pt-4">
              <div>
                <div className="text-label-caps uppercase text-slatey">{pending ? 'Amount due' : 'Paid'}</div>
                <div className="text-[12px] text-slatey">via {METHOD_LABEL[record.paymentMethod?.replace('stripe:', '')] ?? 'Card'}</div>
              </div>
              <span className="font-display text-[30px] font-bold text-gold-bright">{gbp(record.total)}</span>
            </div>
          </div>
        </motion.div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3 print:hidden">
          <button type="button" onClick={() => downloadIcs(record)} className="btn-dark">
            <CalendarPlus size={17} className="text-gold" /> Add to calendar
          </button>
          <button type="button" onClick={() => window.print()} className="btn-dark">
            <Printer size={17} className="text-gold" /> Print receipt
          </button>
          <a href={`${SITE.whatsapp}?text=${encodeURIComponent(`Hi, about my booking ${record.ref}`)}`} target="_blank" rel="noopener noreferrer" className="btn-dark">
            <MessageCircle size={17} className="text-[#25D366]" /> WhatsApp us
          </a>
        </div>
        <div className="mt-8 text-center print:hidden">
          <Link to="/book" className="btn-gold shine">
            Book another journey
          </Link>
        </div>
      </div>
    </div>
  );
}
