import { motion } from 'framer-motion';
import { CheckCircle2, ChevronRight, Luggage, Users, Briefcase } from 'lucide-react';
import clsx from 'clsx';
import { gbp } from '../../lib/format.js';

export default function VehicleCard({ vehicle: v, onSelect, wide = false }) {
  const flagship = v.id === 'first';
  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.96, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className={clsx(
        'group flex flex-col overflow-hidden rounded-2xl border bg-ink-750 shadow-xl transition-[border,box-shadow] duration-300',
        flagship ? 'border-gold/40 hover:shadow-glow' : 'border-white/5 hover:border-gold/30',
        wide && 'md:col-span-2 md:grid md:grid-cols-2',
      )}
    >
      <div className={clsx('relative overflow-hidden bg-ink-700', wide ? 'h-56 md:h-full' : 'h-52 sm:h-56')}>
        <img src={v.image} alt={`${v.name} — ${v.model}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-750/80 via-transparent to-transparent" />
        <span className={clsx('absolute left-4 top-4 rounded-full px-3 py-1 text-label-caps uppercase', flagship ? 'bg-gold text-ink-900' : 'bg-ink-900/85 text-gold-bright backdrop-blur-md')}>{v.badge}</span>
        <span className="absolute bottom-4 right-4 rounded-lg bg-ink-850/90 px-3 py-1 text-[16px] font-bold text-cream backdrop-blur-md">
          from <span className="text-gold-bright">{gbp(v.minFare)}</span>
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <h3 className="font-display text-[22px] font-semibold text-cream">{v.name}</h3>
        <p className="mb-3 text-[12.5px] font-medium text-gold-muted">{v.model}</p>
        <p className="mb-4 text-[13.5px] leading-relaxed text-sand">{v.description}</p>
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="chip">
            <Users size={14} className="text-gold" /> {v.passengers} passengers
          </span>
          <span className="chip">
            <Luggage size={14} className="text-gold-soft" /> {v.suitcases} suitcases
          </span>
          <span className="chip">
            <Briefcase size={14} className="text-gold-soft" /> {v.handLuggage} hand bags
          </span>
        </div>
        <ul className="mb-6 space-y-1.5 text-[13px] text-sand">
          {v.features.map((f) => (
            <li key={f} className="flex items-center gap-2">
              <CheckCircle2 size={15} className="shrink-0 text-gold" /> {f}
            </li>
          ))}
        </ul>
        <button type="button" onClick={() => onSelect?.(v)} className={clsx('mt-auto w-full', flagship ? 'btn-gold' : 'btn-dark group-hover:border-gold/50')}>
          Select {v.name} <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </motion.article>
  );
}
