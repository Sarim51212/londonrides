import { Quote } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading.jsx';
import Stars from '../ui/Stars.jsx';
import { Reveal } from '../ui/Reveal.jsx';
import { REVIEWS } from '../../data/content.js';
import { SITE } from '../../data/site.js';

const SOURCES = [
  { name: 'Google', score: '4.9', color: '#4285F4' },
  { name: 'Trustpilot', score: '4.8', color: '#00B67A' },
  { name: 'TripAdvisor', score: '5.0', color: '#34E0A1' },
];

function ReviewCard({ r }) {
  return (
    <figure className="relative flex w-[300px] shrink-0 flex-col rounded-2xl border border-white/5 bg-ink-750 p-6 shadow-lg sm:w-[360px]">
      <Quote size={36} className="absolute right-5 top-5 text-gold/15" />
      <div className="mb-4 flex items-center gap-2">
        <Stars size={15} />
        <span className="text-[11px] font-semibold text-slatey">via {r.source}</span>
      </div>
      <blockquote className="mb-6 text-[14.5px] italic leading-relaxed text-cream">“{r.text}”</blockquote>
      <figcaption className="mt-auto flex items-center gap-3 border-t border-white/5 pt-4">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-gold/30 to-gold/10 text-[13px] font-bold text-gold-bright">{r.initials}</span>
        <span>
          <span className="block text-[14px] font-semibold text-white">{r.name}</span>
          <span className="block text-[12px] text-sand">{r.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export default function Reviews() {
  const loop = [...REVIEWS, ...REVIEWS];
  return (
    <section className="overflow-hidden bg-ink-850 py-16 md:py-24">
      <div className="container-site">
        <SectionHeading eyebrow="Verified Travellers" title="Trusted by Executives Worldwide">
          <div className="flex items-center gap-4 rounded-2xl bg-ink-750 px-5 py-3">
            <div>
              <Stars size={17} />
              <div className="mt-0.5 text-[16px] font-bold text-white">{SITE.rating} out of 5</div>
            </div>
            <div className="h-9 w-px bg-ink-600" />
            <span className="max-w-[160px] text-[12.5px] text-sand">{SITE.reviewCount.toLocaleString()}+ verified ratings</span>
          </div>
        </SectionHeading>
        <Reveal className="mb-10 flex flex-wrap gap-3">
          {SOURCES.map((s) => (
            <span key={s.name} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-ink-750 px-4 py-2 text-[13px]">
              <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
              <b className="text-white">{s.name}</b>
              <span className="text-sand">{s.score}★</span>
            </span>
          ))}
        </Reveal>
      </div>
      {/* Infinite marquee — pauses on hover/touch */}
      <div className="mask-fade-x group relative">
        <div className="flex w-max animate-marquee gap-5 px-5 group-hover:[animation-play-state:paused] group-active:[animation-play-state:paused]">
          {loop.map((r, i) => (
            <ReviewCard key={i} r={r} />
          ))}
        </div>
      </div>
    </section>
  );
}
