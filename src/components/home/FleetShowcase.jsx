import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import clsx from 'clsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import VehicleCard from '../fleet/VehicleCard.jsx';
import { VEHICLES, FLEET_FILTERS } from '../../data/vehicles.js';
import { useBooking } from '../../context/BookingContext.jsx';

export function FleetFilter({ value, onChange }) {
  return (
    <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0" role="tablist" aria-label="Filter fleet">
      {FLEET_FILTERS.map((f) => (
        <button
          key={f.id}
          type="button"
          role="tab"
          aria-selected={value === f.id}
          onClick={() => onChange(f.id)}
          className={clsx('relative shrink-0 rounded-full px-4 py-2.5 text-[13px] font-semibold transition-colors', value === f.id ? 'text-ink-900' : 'bg-ink-750 text-cream hover:bg-ink-700')}
        >
          {value === f.id && <motion.span layoutId="fleet-pill" className="absolute inset-0 rounded-full bg-gradient-to-r from-gold-bright to-gold" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
          <span className="relative">{f.label}</span>
        </button>
      ))}
    </div>
  );
}

export default function FleetShowcase() {
  const [filter, setFilter] = useState('all');
  const { update } = useBooking();
  const navigate = useNavigate();
  const shown = VEHICLES.filter((v) => filter === 'all' || v.category === filter);

  const select = (v) => {
    update((b) => ({ vehicleId: v.id, passengers: Math.min(b.passengers, v.passengers), luggage: Math.min(b.luggage, v.suitcases) }));
    navigate('/book');
  };

  return (
    <section id="fleet" className="bg-ink-850 py-16 md:py-24">
      <div className="container-site">
        <SectionHeading
          eyebrow="Excellence in Motion"
          title="The Executive Chauffeur Fleet"
          text="Impeccably maintained saloons, Mercedes S-Class flagships and VIP MPVs. Every vehicle under 3 years old, smoke-free and valeted before each journey."
        >
          <FleetFilter value={filter} onChange={setFilter} />
        </SectionHeading>
        <LayoutGroup>
          <motion.div layout className="m-carousel md:grid-cols-2 md:gap-6 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {shown.map((v) => (
                <VehicleCard key={v.id} vehicle={v} onSelect={select} />
              ))}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>
      </div>
    </section>
  );
}
