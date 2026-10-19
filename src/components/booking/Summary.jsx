import { AnimatePresence, motion } from 'framer-motion';
import { CalendarClock, Circle, Clock, MapPin, Route, Users, Luggage, Plane, ShieldCheck } from 'lucide-react';
import { useBooking } from '../../context/BookingContext.jsx';
import { routeStats } from '../../lib/pricing.js';
import { formatDateTime, formatDuration, gbp } from '../../lib/format.js';
import CountUp from '../ui/CountUp.jsx';

export function TripDetails({ booking: b }) {
  const stats = b.journeyType !== 'hourly' ? routeStats(b.pickup, b.dropoff) : null;
  return (
    <div className="space-y-4">
      <div className="relative space-y-4 pl-7">
        <span className="absolute bottom-5 left-[7px] top-5 w-px bg-gradient-to-b from-gold to-gold-soft/30" />
        <div className="relative">
          <Circle size={15} className="absolute -left-7 top-1 fill-ink-750 text-gold" />
          <div className="text-[14px] font-semibold text-white">{b.pickup?.label ?? '—'}</div>
          <div className="text-[12px] text-slatey">{b.pickup?.sub}</div>
        </div>
        {b.journeyType === 'hourly' ? (
          <div className="relative">
            <Clock size={15} className="absolute -left-7 top-1 text-gold-soft" />
            <div className="text-[14px] font-semibold text-white">As directed · {b.hours} hours</div>
          </div>
        ) : (
          <div className="relative">
            <MapPin size={15} className="absolute -left-7 top-1 text-gold-soft" />
            <div className="text-[14px] font-semibold text-white">{b.dropoff?.label ?? '—'}</div>
            <div className="text-[12px] text-slatey">{b.dropoff?.sub}</div>
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2 text-[12.5px] text-sand">
        <span className="col-span-2 flex items-center gap-2">
          <CalendarClock size={14} className="text-gold" /> {formatDateTime(b.datetime)}
          {b.journeyType === 'return' && b.returnDatetime && <span className="text-slatey">· return {formatDateTime(b.returnDatetime)}</span>}
        </span>
        {stats && (
          <span className="flex items-center gap-2">
            <Route size={14} className="text-gold" /> {stats.miles} mi · {formatDuration(stats.minutes)}
          </span>
        )}
        <span className="flex items-center gap-2">
          <Users size={14} className="text-gold" /> {b.passengers} pax
          <Luggage size={14} className="ml-1 text-gold" /> {b.luggage}
        </span>
        {b.flightNumber && (
          <span className="flex items-center gap-2">
            <Plane size={14} className="text-gold" /> {b.flightNumber}
          </span>
        )}
      </div>
    </div>
  );
}

export function PriceLines({ quote }) {
  if (!quote) return <p className="text-[13px] text-slatey">Choose a vehicle to see your fixed price.</p>;
  return (
    <div className="space-y-2">
      {quote.lines.map((l) => (
        <div key={l.label} className="flex justify-between gap-3 text-[13px]">
          <span className="text-sand">{l.label}</span>
          <span className={l.amount < 0 ? 'text-emerald-400' : l.amount === 0 ? 'text-emerald-400' : 'text-white'}>{l.amount === 0 ? 'Free' : gbp(l.amount)}</span>
        </div>
      ))}
    </div>
  );
}

/** Sticky desktop sidebar. */
export default function Summary() {
  const { booking: b, quote } = useBooking();
  return (
    <aside className="sticky top-24 space-y-4">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-750 shadow-elevated">
        <AnimatePresence mode="wait">
          {quote && (
            <motion.div key={quote.vehicle.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative h-36 overflow-hidden">
              <motion.img initial={{ scale: 1.15, x: 30 }} animate={{ scale: 1, x: 0 }} transition={{ duration: 0.8 }} src={quote.vehicle.image} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-750 to-transparent" />
              <div className="absolute bottom-3 left-5">
                <div className="font-display text-[19px] font-semibold text-white">{quote.vehicle.name}</div>
                <div className="text-[12px] text-gold-muted">{quote.vehicle.model}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="space-y-5 p-5">
          <h3 className="text-label-caps uppercase text-gold-muted">Your Journey</h3>
          <TripDetails booking={b} />
          <div className="border-t border-white/10 pt-4">
            <PriceLines quote={quote} />
          </div>
          {quote && (
            <div className="flex items-end justify-between border-t border-white/10 pt-4">
              <div>
                <div className="text-label-caps uppercase text-slatey">Total · fixed</div>
                <div className="text-[11px] text-slatey">Incl. VAT, tolls & parking</div>
              </div>
              <CountUp value={quote.total} prefix="£" duration={0.6} className="font-display text-[32px] font-bold text-gold-bright" />
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-ink-750/60 p-4 text-[12.5px] text-sand">
        <ShieldCheck size={22} className="shrink-0 text-gold" /> Free cancellation up to 12 hours before pickup. Flight delays never cost extra.
      </div>
    </aside>
  );
}
