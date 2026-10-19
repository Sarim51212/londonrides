import { useState, forwardRef, useImperativeHandle } from 'react';
import { motion } from 'framer-motion';
import { Baby, Plane, UserRound, Mail, Phone, MessageSquare, BadgeCheck, Luggage } from 'lucide-react';
import clsx from 'clsx';
import { useBooking } from '../../context/BookingContext.jsx';
import { isAirportLike } from '../../data/locations.js';
import { EXTRAS } from '../../lib/pricing.js';
import NumberStepper from '../ui/NumberStepper.jsx';

export function validateDetails(b) {
  const e = {};
  const p = b.passenger;
  if (p.name.trim().length < 2) e.name = 'Enter the lead passenger’s full name';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email.trim())) e.email = 'Enter a valid email for your confirmation';
  if (p.phone.replace(/\D/g, '').length < 7) e.phone = 'Enter a mobile number so your chauffeur can reach you';
  return e;
}

function Field({ id, label, icon: Icon, error, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      <div className="relative">
        <Icon size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gold" />
        <input id={id} className={clsx('field w-full pl-10', error && 'border-red-400 focus:border-red-400 focus:ring-red-400/20')} aria-invalid={Boolean(error)} {...props} />
      </div>
      {error && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-1.5 text-[12px] text-red-300">{error}</motion.p>}
    </div>
  );
}

function Toggle({ checked, onChange, icon: Icon, title, note, price }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} aria-pressed={checked} className={clsx('flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all', checked ? 'border-gold/60 bg-gold/10' : 'border-white/10 bg-ink-900/50 hover:border-white/20')}>
      <span className={clsx('grid h-10 w-10 shrink-0 place-items-center rounded-lg', checked ? 'bg-gold text-ink-900' : 'bg-ink-700 text-gold')}>
        <Icon size={19} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-semibold text-white">{title}</span>
        <span className="block text-[12px] text-slatey">{note}</span>
      </span>
      <span className="text-[13px] font-bold text-gold-bright">{price ? `+£${price}` : 'Free'}</span>
      <span className={clsx('relative h-6 w-11 shrink-0 rounded-full transition-colors', checked ? 'bg-gold' : 'bg-ink-600')}>
        <motion.span layout className={clsx('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow', checked ? 'right-0.5' : 'left-0.5')} />
      </span>
    </button>
  );
}

const StepDetails = forwardRef(function StepDetails(_props, ref) {
  const { booking: b, update } = useBooking();
  const [errors, setErrors] = useState({});
  const setP = (patch) => {
    update({ passenger: { ...b.passenger, ...patch } });
    setErrors((e) => {
      const n = { ...e };
      Object.keys(patch).forEach((k) => delete n[k]);
      return n;
    });
  };
  const setX = (patch) => update({ extras: { ...b.extras, ...patch } });

  useImperativeHandle(ref, () => ({
    validate() {
      const errs = validateDetails(b);
      setErrors(errs);
      const first = Object.keys(errs)[0];
      if (first) document.getElementById(`p-${first}`)?.focus();
      return !first;
    },
  }));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-[26px] font-semibold text-cream md:text-[30px]">Passenger details</h2>
        <p className="text-[14px] text-sand">We’ll send your confirmation and chauffeur details here.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field id="p-name" label="Lead passenger" icon={UserRound} autoComplete="name" placeholder="Full name" value={b.passenger.name} onChange={(e) => setP({ name: e.target.value })} error={errors.name} />
        </div>
        <Field id="p-email" label="Email" icon={Mail} type="email" inputMode="email" autoComplete="email" placeholder="you@example.com" value={b.passenger.email} onChange={(e) => setP({ email: e.target.value })} error={errors.email} />
        <Field id="p-phone" label="Mobile" icon={Phone} type="tel" inputMode="tel" autoComplete="tel" placeholder="+44 7700 900000" value={b.passenger.phone} onChange={(e) => setP({ phone: e.target.value })} error={errors.phone} />
        {isAirportLike(b.pickup) && (
          <div className="sm:col-span-2">
            <Field id="p-flight" label="Flight number (recommended)" icon={Plane} placeholder="e.g. BA117" value={b.flightNumber} onChange={(e) => update({ flightNumber: e.target.value.toUpperCase().slice(0, 10) })} />
            <p className="mt-1.5 text-[12px] text-slatey">We track your flight and adjust your pickup automatically — 60 minutes free waiting after landing.</p>
          </div>
        )}
        <div className="sm:col-span-2">
          <label htmlFor="p-notes" className="label">Notes for your chauffeur (optional)</label>
          <div className="relative">
            <MessageSquare size={17} className="pointer-events-none absolute left-3.5 top-3.5 text-gold" />
            <textarea id="p-notes" rows={3} maxLength={600} className="field w-full resize-none pl-10" placeholder="Name board text, door number, accessibility needs…" value={b.passenger.notes} onChange={(e) => setP({ notes: e.target.value })} />
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-label-caps uppercase text-gold-muted">Extras</h3>
        <div className="space-y-3">
          {isAirportLike(b.pickup) && <Toggle checked={b.extras.meetGreet} onChange={(v) => setX({ meetGreet: v })} icon={BadgeCheck} title={EXTRAS.meetGreet.label} note={EXTRAS.meetGreet.note} />}
          <Toggle checked={b.extras.porter} onChange={(v) => setX({ porter: v })} icon={Luggage} title={EXTRAS.porter.label} note={EXTRAS.porter.note} price={EXTRAS.porter.price} />
          <div className="rounded-xl border border-white/10 bg-ink-900/50 p-4">
            <NumberStepper icon={Baby} label="Child / booster seats (free)" value={b.extras.childSeats} min={0} max={Math.min(4, b.passengers)} onChange={(n) => setX({ childSeats: n })} />
          </div>
        </div>
      </div>
    </div>
  );
});

export default StepDetails;
