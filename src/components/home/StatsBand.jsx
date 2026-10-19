import CountUp from '../ui/CountUp.jsx';
import { RevealGroup, RevealItem } from '../ui/Reveal.jsx';
import { STATS } from '../../data/content.js';

export default function StatsBand() {
  return (
    <section className="border-b border-white/5 bg-ink-850 py-10 md:py-12">
      <RevealGroup className="container-site grid grid-cols-2 gap-y-8 md:grid-cols-4">
        {STATS.map((s, i) => (
          <RevealItem key={s.label} className={`text-center ${i % 2 ? 'border-l border-white/5' : ''} md:border-l md:first:border-l-0`}>
            <CountUp value={s.value} decimals={s.decimals} suffix={s.suffix} className="font-display text-[34px] font-semibold text-gold-gradient md:text-[44px]" />
            <div className="mt-1 text-label-caps uppercase text-slatey">{s.label}</div>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
