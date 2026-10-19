import { motion } from 'framer-motion';
import { Check, Users, Luggage, Briefcase, AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import { useBooking } from '../../context/BookingContext.jsx';
import { quoteAll, routeStats } from '../../lib/pricing.js';
import { gbp, formatDuration } from '../../lib/format.js';

export default function StepVehicle({ onNext }) {
  const { booking: b, update } = useBooking();
  const options = quoteAll(b);
  const stats = b.journeyType !== 'hourly' ? routeStats(b.pickup, b.dropoff) : null;

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="font-display text-[26px] font-semibold text-cream md:text-[30px]">Choose your vehicle</h2>
          <p className="text-[14px] text-sand">
            {stats ? `${stats.miles} miles · approx. ${formatDuration(stats.minutes)}` : `${b.hours} hours as-directed hire`} · all prices fixed & inclusive
          </p>
        </div>
      </div>
      <motion.div className="space-y-3.5" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.07 } } }}>
        {options.map(({ vehicle: v, fits, quote }) => {
          const selected = b.vehicleId === v.id;
          return (
            <motion.button
              key={v.id}
              type="button"
              disabled={!fits}
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
              whileTap={fits ? { scale: 0.985 } : undefined}
              onClick={() => {
                update({ vehicleId: v.id });
                if (window.matchMedia('(min-width: 1024px)').matches) setTimeout(onNext, 250);
              }}
              aria-pressed={selected}
              className={clsx(
                'group relative flex w-full items-stretch gap-3 overflow-hidden rounded-2xl border bg-ink-750 p-2.5 text-left transition-all duration-300 sm:gap-5 sm:p-3',
                selected ? 'border-gold shadow-glow' : 'border-white/5 hover:border-gold/40',
                !fits && 'opacity-45',
              )}
            >
              <div className="relative w-28 shrink-0 overflow-hidden rounded-xl bg-ink-700 sm:w-44">
                <img src={v.image} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                {v.id === 'first' && <span className="absolute left-1.5 top-1.5 rounded-full bg-gold px-2 py-0.5 text-[9px] font-bold uppercase text-ink-900">Flagship</span>}
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-center py-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-display text-[17px] font-semibold text-white sm:text-[19px]">{v.name}</h3>
                    <p className="truncate text-[12px] text-gold-muted">{v.model}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-[20px] font-bold leading-tight text-white sm:text-[24px]">{quote ? gbp(quote.total) : '—'}</div>
                    {b.journeyType === 'return' && <div className="text-[10.5px] text-slatey">return trip</div>}
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-sand">
                  <span className="flex items-center gap-1"><Users size={13} className="text-gold" /> {v.passengers}</span>
                  <span className="flex items-center gap-1"><Luggage size={13} className="text-gold" /> {v.suitcases}</span>
                  <span className="flex items-center gap-1"><Briefcase size={13} className="text-gold" /> {v.handLuggage}</span>
                  <span className="hidden text-slatey sm:inline">· {v.features[0]}</span>
                </div>
                {!fits && (
                  <p className="mt-1.5 flex items-center gap-1 text-[11.5px] text-amber-300">
                    <AlertCircle size={13} /> Too small for {b.passengers} passengers / {b.luggage} cases
                  </p>
                )}
              </div>
              <span className={clsx('absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-full border transition-all sm:static sm:self-center', selected ? 'scale-100 border-gold bg-gold text-ink-900' : 'scale-0 border-white/20 sm:scale-100')}>
                {selected && <Check size={14} strokeWidth={3} />}
              </span>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
