import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import PageHero from '../components/layout/PageHero.jsx';
import VehicleCard from '../components/fleet/VehicleCard.jsx';
import { FleetFilter } from '../components/home/FleetShowcase.jsx';
import { Reveal } from '../components/ui/Reveal.jsx';
import FinalCTA from '../components/home/FinalCTA.jsx';
import { VEHICLES } from '../data/vehicles.js';
import { useBooking } from '../context/BookingContext.jsx';
import usePageMeta from '../lib/usePageMeta.js';

export default function Fleet() {
  usePageMeta('Our Fleet', 'Mercedes S-Class, E-Class, V-Class MPVs and VIP Sprinter minibuses — chauffeur-driven across London.');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  const { update } = useBooking();
  const shown = VEHICLES.filter((v) => filter === 'all' || v.category === filter);

  return (
    <>
      <PageHero eyebrow="Excellence in Motion" title="The London Rides Fleet" text="Every vehicle under three years old, smoke-free, valeted before each journey and driven by a vetted, TfL-licensed chauffeur." image="/images/s-class.webp" crumbs={[{ label: 'Fleet' }]} />
      <section className="bg-ink-850 py-12 md:py-16">
        <div className="container-site">
          <div className="mb-8">
            <FleetFilter value={filter} onChange={setFilter} />
          </div>
          <LayoutGroup>
            <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {shown.map((v) => (
                  <VehicleCard
                    key={v.id}
                    vehicle={v}
                    onSelect={() => {
                      update((b) => ({ vehicleId: v.id, passengers: Math.min(b.passengers, v.passengers), luggage: Math.min(b.luggage, v.suitcases) }));
                      navigate('/book');
                    }}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>

          <Reveal className="mt-14 overflow-x-auto rounded-2xl border border-white/10 bg-ink-750">
            <table className="w-full min-w-[640px] text-left text-[14px]">
              <caption className="p-5 text-left font-display text-[22px] text-cream">Capacity at a glance</caption>
              <thead>
                <tr className="border-y border-white/10 bg-ink-700/60 text-label-caps uppercase text-slatey">
                  <th className="px-5 py-3">Vehicle</th>
                  <th className="px-3 py-3 text-center">Passengers</th>
                  <th className="px-3 py-3 text-center">Suitcases</th>
                  <th className="px-3 py-3 text-center">Hand bags</th>
                  <th className="px-3 py-3 text-center">Hourly</th>
                  <th className="px-5 py-3 text-right">From</th>
                </tr>
              </thead>
              <tbody>
                {VEHICLES.map((v) => (
                  <tr key={v.id} className="border-b border-white/5 last:border-0 hover:bg-ink-700/40">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-white">{v.name}</div>
                      <div className="text-[12px] text-slatey">{v.model}</div>
                    </td>
                    <td className="px-3 py-3.5 text-center text-cream">{v.passengers}</td>
                    <td className="px-3 py-3.5 text-center text-cream">{v.suitcases}</td>
                    <td className="px-3 py-3.5 text-center text-cream">{v.handLuggage}</td>
                    <td className="px-3 py-3.5 text-center text-cream">£{v.hourly}/hr</td>
                    <td className="px-5 py-3.5 text-right font-bold text-gold-bright">£{v.minFare}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
