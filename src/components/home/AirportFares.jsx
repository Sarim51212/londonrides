import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import { Reveal } from '../ui/Reveal.jsx';
import { AIRPORTS, FARE_DESTINATIONS } from '../../data/content.js';
import { VEHICLES } from '../../data/vehicles.js';
import { byId } from '../../data/locations.js';
import { fixedFare, routeStats } from '../../lib/pricing.js';
import { gbp, formatDuration } from '../../lib/format.js';
import { useBooking, toPlace } from '../../context/BookingContext.jsx';

const COLS = ['saloon', 'estate', 'executive', 'first', 'mpv', 'minibus'];

/** Fixed fare table per airport, computed from the live pricing engine. */
export default function AirportFares({ initial = 'heathrow', compact = false, destinations = FARE_DESTINATIONS }) {
  const [slug, setSlug] = useState(initial);
  const [showAll, setShowAll] = useState(false);
  const airport = AIRPORTS.find((a) => a.slug === slug);
  const origin = byId[airport.locId];
  const navigate = useNavigate();
  const { update } = useBooking();
  const vehicles = COLS.map((id) => VEHICLES.find((v) => v.id === id));

  const book = (destId, vehicleId = null) => {
    update({ journeyType: 'oneway', pickup: toPlace(origin), dropoff: toPlace(byId[destId]), vehicleId });
    navigate(vehicleId ? '/book?step=details' : '/book?step=vehicle');
  };

  return (
    <section id="fares" className={clsx('bg-ink-850', compact ? 'py-12' : 'py-16 md:py-24')}>
      <div className="container-site">
        {!compact && (
          <SectionHeading
            eyebrow="Transparent Pricing"
            title="Airport Transfer Fares"
            text="One-way fixed prices including Congestion Charge, ULEZ, airport parking and VAT. The price you see is the price you pay."
          />
        )}

        {!compact && (
          <div className="no-scrollbar -mx-5 mb-6 flex gap-2 overflow-x-auto px-5 md:mx-0 md:px-0" role="tablist">
            {AIRPORTS.map((a) => (
              <button
                key={a.slug}
                type="button"
                role="tab"
                aria-selected={slug === a.slug}
                onClick={() => setSlug(a.slug)}
                className={clsx('relative shrink-0 rounded-xl border px-4 py-2.5 text-left transition-colors', slug === a.slug ? 'border-gold/60 bg-gold/10' : 'border-white/5 bg-ink-750 hover:border-white/15')}
              >
                <span className={clsx('block font-display text-[17px] font-bold', slug === a.slug ? 'text-gold-bright' : 'text-cream')}>{a.code}</span>
                <span className="block whitespace-nowrap text-[11px] text-slatey">{a.name}</span>
              </button>
            ))}
          </div>
        )}

        <Reveal>
          <AnimatePresence mode="wait">
            <motion.div key={slug} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
              {/* Mobile: stacked cards */}
              <div className="space-y-3 md:hidden">
                {destinations.slice(0, showAll ? undefined : 4).map((d) => {
                  const dest = byId[d];
                  const s = routeStats(origin, dest);
                  return (
                    <div key={d} className="rounded-2xl border border-white/5 bg-ink-750 p-4">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                          <div className="text-[15px] font-semibold text-white">{dest.name}</div>
                          <div className="text-[12px] text-slatey">
                            {s.miles} mi · {formatDuration(s.minutes)}
                          </div>
                        </div>
                        <button type="button" onClick={() => book(d)} className="btn-gold !min-h-[38px] !px-3.5 text-[12.5px]">
                          Book <ArrowRight size={14} />
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {vehicles.map((v) => (
                          <button key={v.id} type="button" onClick={() => book(d, v.id)} className="rounded-lg bg-ink-900/70 px-2 py-2 text-center transition-colors hover:bg-ink-700">
                            <span className="block truncate text-[10px] uppercase tracking-wide text-slatey">{v.name.replace('Executive ', 'Exec. ')}</span>
                            <span className="block text-[14px] font-bold text-gold-bright">{gbp(fixedFare(origin, dest, v.id))}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
                {!showAll && destinations.length > 4 && (
                  <button type="button" onClick={() => setShowAll(true)} className="btn-dark w-full">
                    Show all {destinations.length} destinations
                  </button>
                )}
              </div>

              {/* Desktop: table */}
              <div className="hidden overflow-hidden rounded-2xl border border-white/10 bg-ink-750 md:block">
                <table className="w-full text-left text-[14px]">
                  <thead>
                    <tr className="border-b border-white/10 bg-ink-700/60 text-label-caps uppercase text-slatey">
                      <th className="px-5 py-4 font-bold">{airport.name} to</th>
                      {vehicles.map((v) => (
                        <th key={v.id} className="px-3 py-4 text-center font-bold">
                          {v.name}
                          <span className="mt-0.5 block text-[10px] font-medium normal-case tracking-normal text-slatey/70">
                            {v.passengers} pax · {v.suitcases} cases
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {destinations.map((d) => {
                      const dest = byId[d];
                      const s = routeStats(origin, dest);
                      return (
                        <tr key={d} className="group border-b border-white/5 transition-colors last:border-0 hover:bg-ink-700/40">
                          <td className="px-5 py-3.5">
                            <div className="font-semibold text-white">{dest.name}</div>
                            <div className="text-[12px] text-slatey">
                              {s.miles} mi · ~{formatDuration(s.minutes)}
                            </div>
                          </td>
                          {vehicles.map((v) => (
                            <td key={v.id} className="px-2 py-3.5 text-center">
                              <button type="button" onClick={() => book(d, v.id)} className="rounded-lg px-3 py-1.5 font-bold text-cream transition-all hover:bg-gold hover:text-ink-900" title={`Book ${v.name}`}>
                                {gbp(fixedFare(origin, dest, v.id))}
                              </button>
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-[12px] text-slatey">Tap any price to book that vehicle. Return journeys save 5%. Not listed? Get an instant quote for any UK address.</p>
            </motion.div>
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}
