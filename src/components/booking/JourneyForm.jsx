import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ArrowUpDown, CalendarClock, Clock, Info, Luggage, MapPin, Navigation, Plane, Users } from 'lucide-react';
import clsx from 'clsx';
import LocationInput from '../ui/LocationInput.jsx';
import { useBooking } from '../../context/BookingContext.jsx';
import { isAirportLike } from '../../data/locations.js';
import { MIN_HOURS, MAX_HOURS, straightLineMiles } from '../../lib/pricing.js';
import { minPickupTime } from '../../lib/format.js';

export const JOURNEY_TYPES = [
  { id: 'oneway', label: 'One Way' },
  { id: 'return', label: 'Return' },
  { id: 'hourly', label: 'By the Hour' },
];

export function validateJourney(b) {
  const e = {};
  if (!b.pickup) e.pickup = 'Choose a pickup location';
  if (b.journeyType !== 'hourly' && !b.dropoff) e.dropoff = 'Choose a destination';
  else if (b.journeyType !== 'hourly' && b.pickup && straightLineMiles(b.pickup, b.dropoff) < 0.3) e.dropoff = 'Destination must be different from pickup';
  if (!b.datetime || new Date(b.datetime) < new Date(Date.now() + 55 * 60 * 1000)) e.datetime = 'Pickups need at least 1 hour notice';
  if (b.journeyType === 'return' && (!b.returnDatetime || new Date(b.returnDatetime) <= new Date(b.datetime))) e.returnDatetime = 'Return must be after pickup';
  return e;
}

/**
 * Journey details form.
 * variant="hero": light card that lays out in one row on desktop (design's booking bar).
 * variant="panel": dark stacked form used inside the booking flow.
 */
export default function JourneyForm({ variant = 'hero', onSubmit, submitLabel = 'Get Instant Quote' }) {
  const { booking: b, update } = useBooking();
  const [errors, setErrors] = useState({});
  const [more, setMore] = useState(false);
  const hero = variant === 'hero';
  const light = hero;
  const hourly = b.journeyType === 'hourly';

  const submit = (e) => {
    e.preventDefault();
    const errs = validateJourney(b);
    setErrors(errs);
    if (!Object.keys(errs).length) onSubmit?.();
  };

  const set = (patch) => {
    update(patch);
    setErrors((er) => {
      const next = { ...er };
      Object.keys(patch).forEach((k) => delete next[k]);
      return next;
    });
  };

  const fieldBox = clsx(
    'flex flex-col justify-center rounded-xl border px-3.5 py-2.5 transition-colors',
    light ? 'border-slate-200 bg-slate-100 hover:bg-slate-200/70 focus-within:border-slate-400 focus-within:bg-white' : 'border-white/10 bg-ink-900/70 focus-within:border-gold',
  );
  const lbl = clsx('text-[10.5px] font-bold uppercase tracking-[0.12em]', light ? 'text-slate-500' : 'text-slatey');
  const ctl = clsx('w-full min-w-0 border-0 bg-transparent p-0 text-[15px] font-medium focus:outline-none focus:ring-0', light ? 'text-slate-900' : 'text-white');
  const ico = clsx('shrink-0', light ? 'text-slate-700' : 'text-gold');
  const err = (k) => errors[k] && <p className="mt-1 text-[12px] font-medium text-red-500">{errors[k]}</p>;

  const swap = () => set({ pickup: b.dropoff, dropoff: b.pickup });

  return (
    <form onSubmit={submit} noValidate className="space-y-3.5">
      {/* Journey type segmented control */}
      <div className={clsx('relative grid grid-cols-3 rounded-xl p-1', light ? 'bg-slate-200/70' : 'bg-ink-900/80 ring-1 ring-white/10')} role="tablist" aria-label="Journey type">
        {JOURNEY_TYPES.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={b.journeyType === t.id}
            onClick={() => set({ journeyType: t.id })}
            className={clsx('relative z-10 rounded-lg py-2.5 text-[13px] font-semibold transition-colors', b.journeyType === t.id ? (light ? 'text-white' : 'text-ink-900') : light ? 'text-slate-600' : 'text-sand')}
          >
            {b.journeyType === t.id && (
              <motion.span layoutId={`jt-${variant}`} className={clsx('absolute inset-0 -z-10 rounded-lg shadow', light ? 'bg-ink-900' : 'bg-gradient-to-r from-gold-bright to-gold')} transition={{ type: 'spring', stiffness: 420, damping: 34 }} />
            )}
            {t.label}
          </button>
        ))}
      </div>

      <div className={clsx('grid gap-3', hero ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-12' : 'grid-cols-1')}>
        {/* From / To with swap */}
        <div className={clsx('relative grid gap-3', hero ? 'sm:col-span-2 lg:col-span-5 lg:grid-cols-2' : '')}>
          <LocationInput variant={light ? 'light' : 'dark'} label={hourly ? 'Pickup' : 'From'} icon={MapPin} value={b.pickup} onChange={(pickup) => set({ pickup })} placeholder="Airport, hotel, address or postcode" error={errors.pickup} />
          {!hourly && (
            <>
              <LocationInput variant={light ? 'light' : 'dark'} label="To" icon={Navigation} value={b.dropoff} onChange={(dropoff) => set({ dropoff })} placeholder="Where are you going?" error={errors.dropoff} />
              <motion.button
                type="button"
                whileTap={{ rotate: 180, scale: 0.9 }}
                onClick={swap}
                aria-label="Swap pickup and destination"
                className={clsx(
                  'absolute right-4 top-[52px] z-20 grid h-9 w-9 place-items-center rounded-full border shadow-md lg:left-1/2 lg:right-auto lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:rotate-90',
                  light ? 'border-slate-200 bg-white text-slate-700' : 'border-white/10 bg-ink-700 text-gold',
                  !hero && 'lg:left-auto lg:right-4 lg:top-[52px] lg:translate-x-0 lg:translate-y-0 lg:rotate-0',
                )}
              >
                <ArrowUpDown size={16} />
              </motion.button>
            </>
          )}
          {hourly && (
            <div className={fieldBox}>
              <span className={lbl}>Duration</span>
              <span className="mt-0.5 flex items-center gap-2">
                <Clock size={18} className={ico} />
                <select value={b.hours} onChange={(e) => set({ hours: Number(e.target.value) })} className={clsx(ctl, 'cursor-pointer appearance-none')}>
                  {Array.from({ length: MAX_HOURS - MIN_HOURS + 1 }, (_, i) => MIN_HOURS + i).map((h) => (
                    <option key={h} value={h} className="text-slate-900">
                      {h} hours
                    </option>
                  ))}
                </select>
              </span>
            </div>
          )}
        </div>

        {/* Date & time */}
        <div className={clsx(hero ? (b.journeyType === 'return' ? 'lg:col-span-2' : 'lg:col-span-3') : '')}>
          <label className={fieldBox}>
            <span className={lbl}>{b.journeyType === 'return' ? 'Outbound' : 'Date & Time'}</span>
            <span className="mt-0.5 flex items-center gap-2">
              <CalendarClock size={18} className={ico} />
              <input type="datetime-local" min={minPickupTime()} value={b.datetime} onChange={(e) => set({ datetime: e.target.value })} className={clsx(ctl, 'cursor-pointer text-[14px]', light && '[color-scheme:light]')} />
            </span>
          </label>
          {err('datetime')}
        </div>

        <AnimatePresence initial={false}>
          {b.journeyType === 'return' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className={clsx(hero && 'lg:col-span-2')}>
              <label className={fieldBox}>
                <span className={lbl}>Return</span>
                <span className="mt-0.5 flex items-center gap-2">
                  <CalendarClock size={18} className={ico} />
                  <input type="datetime-local" min={b.datetime} value={b.returnDatetime} onChange={(e) => set({ returnDatetime: e.target.value })} className={clsx(ctl, 'cursor-pointer text-[14px]', light && '[color-scheme:light]')} />
                </span>
              </label>
              {err('returnDatetime')}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Passengers + luggage */}
        <div className={clsx('grid grid-cols-2 gap-3', hero && (b.journeyType === 'return' ? 'sm:col-span-2 lg:col-span-1 lg:grid-cols-1' : 'lg:col-span-2'))}>
          <label className={fieldBox}>
            <span className={lbl}>Passengers</span>
            <span className="mt-0.5 flex items-center gap-2">
              <Users size={18} className={ico} />
              <select value={b.passengers} onChange={(e) => set({ passengers: Number(e.target.value) })} className={clsx(ctl, 'cursor-pointer appearance-none')}>
                {Array.from({ length: 16 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n} className="text-slate-900">
                    {n}
                  </option>
                ))}
              </select>
            </span>
          </label>
          <label className={fieldBox}>
            <span className={lbl}>Luggage</span>
            <span className="mt-0.5 flex items-center gap-2">
              <Luggage size={18} className={ico} />
              <select value={b.luggage} onChange={(e) => set({ luggage: Number(e.target.value) })} className={clsx(ctl, 'cursor-pointer appearance-none')}>
                {Array.from({ length: 17 }, (_, i) => i).map((n) => (
                  <option key={n} value={n} className="text-slate-900">
                    {n}
                  </option>
                ))}
              </select>
            </span>
          </label>
        </div>

        <div className={clsx(hero ? 'sm:col-span-2 lg:col-span-2' : '')}>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className={clsx('shine flex h-full min-h-[54px] w-full items-center justify-center gap-2 rounded-xl px-4 text-[14.5px] font-bold shadow-lg transition-colors', light ? 'bg-ink-900 text-white hover:bg-ink-700' : 'bg-gradient-to-r from-gold-bright to-gold text-ink-900 shadow-gold')}
          >
            {submitLabel} <ArrowRight size={17} />
          </motion.button>
        </div>
      </div>

      {/* Sub-row: flight number + more options */}
      <div className={clsx('flex flex-wrap items-center justify-between gap-3 text-[13px]', light ? 'text-slate-600' : 'text-sand')}>
        <AnimatePresence initial={false}>
          {isAirportLike(b.pickup) && (
            <motion.label initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
              <Plane size={16} className={light ? 'text-slate-600' : 'text-gold'} />
              <span className="font-medium">Flight no.</span>
              <input
                value={b.flightNumber}
                onChange={(e) => set({ flightNumber: e.target.value.toUpperCase().slice(0, 10) })}
                placeholder="e.g. BA123"
                className={clsx('w-28 rounded-lg border px-2.5 py-1.5 text-[13px] uppercase placeholder:normal-case focus:outline-none', light ? 'border-slate-200 bg-slate-100 text-slate-900 placeholder:text-slate-400 focus:border-slate-400' : 'border-white/10 bg-ink-900 text-white placeholder:text-slatey/60 focus:border-gold')}
              />
              <span title="We track your flight and adjust pickup automatically — 60 mins free waiting after landing." className="cursor-help">
                <Info size={15} className="opacity-60" />
              </span>
            </motion.label>
          )}
        </AnimatePresence>
        {hero && (
          <button type="button" onClick={() => setMore((m) => !m)} className="ml-auto font-semibold underline-offset-4 hover:underline" aria-expanded={more}>
            {more ? 'Fewer options' : 'More options'}
          </button>
        )}
      </div>
      <AnimatePresence initial={false}>
        {hero && more && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="flex flex-wrap gap-x-6 gap-y-2.5 border-t border-slate-200 pt-3 text-[13px] text-slate-700">
              <label className="flex cursor-pointer items-center gap-2">
                <input type="checkbox" checked={b.extras.meetGreet} onChange={(e) => update({ extras: { ...b.extras, meetGreet: e.target.checked } })} className="h-4 w-4 rounded accent-ink-900" />
                Terminal Meet & Greet (free)
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input type="checkbox" checked={b.extras.childSeats > 0} onChange={(e) => update({ extras: { ...b.extras, childSeats: e.target.checked ? 1 : 0 } })} className="h-4 w-4 rounded accent-ink-900" />
                Child / booster seat (free)
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input type="checkbox" checked={b.extras.porter} onChange={(e) => update({ extras: { ...b.extras, porter: e.target.checked } })} className="h-4 w-4 rounded accent-ink-900" />
                Executive luggage porter (+£15)
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
