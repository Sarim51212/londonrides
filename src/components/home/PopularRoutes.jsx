import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, MapPin, Circle, ArrowRight } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading.jsx';
import { RevealGroup, RevealItem } from '../ui/Reveal.jsx';
import { POPULAR_ROUTES } from '../../data/content.js';
import { byId } from '../../data/locations.js';
import { fixedFare, routeStats } from '../../lib/pricing.js';
import { gbp, formatDuration } from '../../lib/format.js';
import { useBooking, toPlace } from '../../context/BookingContext.jsx';

export default function PopularRoutes() {
  const navigate = useNavigate();
  const { update } = useBooking();

  return (
    <section id="routes" className="bg-ink-900 py-16 md:py-24">
      <div className="container-site">
        <SectionHeading eyebrow="Fixed-Rate Favourites" title="Popular Routes" text="Includes all Congestion Charges, ULEZ, airport fees and parking. The price you see is the total you pay." />
        <RevealGroup className="m-carousel md:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {POPULAR_ROUTES.map((r, i) => {
            const from = byId[r.from];
            const to = byId[r.to];
            const s = routeStats(from, to);
            return (
              <RevealItem key={`${r.from}-${r.to}`}>
                <motion.div whileHover={{ y: -6 }} className="group flex h-full flex-col rounded-2xl border border-white/5 bg-ink-750 p-5 transition-colors hover:border-gold/30 md:p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <span className={`rounded px-2.5 py-1 text-label-caps uppercase ${i === 0 ? 'bg-gold/15 text-gold-bright' : 'bg-ink-700 text-cream'}`}>{r.tag}</span>
                    <span className="flex items-center gap-1 text-[13px] text-sand">
                      <Clock size={15} /> ~{formatDuration(s.minutes)}
                    </span>
                  </div>
                  <div className="relative mb-6 space-y-4 pl-8">
                    <span className="absolute bottom-6 left-[9px] top-6 w-px bg-gradient-to-b from-gold to-gold-soft/30" />
                    <div className="relative">
                      <Circle size={18} className="absolute -left-8 top-0.5 fill-ink-750 text-gold" />
                      <div className="font-display text-[17px] font-semibold text-cream">{from.name}</div>
                      <div className="text-[12px] text-sand/80">{r.fromNote}</div>
                    </div>
                    <div className="relative">
                      <MapPin size={18} className="absolute -left-8 top-0.5 text-gold-soft" />
                      <div className="font-display text-[17px] font-semibold text-cream">{to.name}</div>
                      <div className="text-[12px] text-sand/80">{r.toNote}</div>
                    </div>
                  </div>
                  <div className="mt-auto flex items-center justify-between rounded-xl bg-ink-900/60 p-4">
                    <div>
                      <span className="block text-label-caps uppercase text-gold-muted">Fixed price from</span>
                      <span className="text-[24px] font-bold text-cream">
                        {gbp(fixedFare(from, to))} <span className="text-[12px] font-normal text-sand">all-incl.</span>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        update({ journeyType: 'oneway', pickup: toPlace(from), dropoff: toPlace(to), vehicleId: null });
                        navigate('/book?step=vehicle');
                      }}
                      className="btn-gold !min-h-[42px] !px-4 text-[13px]"
                    >
                      Book <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </motion.div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
