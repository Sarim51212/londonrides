import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading.jsx';
import CountUp from '../ui/CountUp.jsx';
import { Reveal, RevealGroup, RevealItem } from '../ui/Reveal.jsx';
import { AIRPORTS, FLIGHT_FEATURES } from '../../data/content.js';

export default function AirportStatus() {
  return (
    <section id="airports" className="bg-ink-900 py-16 md:py-24">
      <div className="container-site">
        <SectionHeading eyebrow="Flight-Tracked Transfers" title="London Airport Hubs">
          <div className="flex items-center gap-2 text-[13px] text-sand">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>
            Live flight tracking on every airport booking
          </div>
        </SectionHeading>

        <RevealGroup gap={0.06} className="no-scrollbar -mx-5 mb-12 flex snap-x gap-3.5 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-3 md:px-0 lg:grid-cols-6">
          {AIRPORTS.map((a) => (
            <RevealItem key={a.code} className="w-[44%] shrink-0 snap-start md:w-auto">
              <Link to={`/airports/${a.slug}`} className="group block h-full rounded-xl border border-white/5 bg-ink-750 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 hover:bg-ink-700">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-display text-[22px] font-bold text-cream transition-colors group-hover:text-gold-bright">{a.code}</span>
                  <span className="rounded-full bg-gold/10 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-gold-bright">{a.status}</span>
                </div>
                <div className="text-[13px] text-cream">{a.name}</div>
                <div className="mt-1 text-[11px] uppercase tracking-wide text-sand/80">{a.detail}</div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="relative overflow-hidden rounded-3xl border border-white/5 bg-ink-750 p-6 shadow-xl md:p-10">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
          <div className="grid items-center gap-8 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-5">
              <span className="eyebrow !text-gold-muted">Flight Delay Guarantee</span>
              <h3 className="font-display text-[26px] font-semibold leading-tight text-cream md:text-[32px]">Never worry about early landings or holding patterns</h3>
              <p className="text-[15px] leading-relaxed text-sand">
                We monitor your flight around the clock. Your chauffeur is dispatched for the actual landing time, not the timetable — so you are never left waiting, and never charged for delays.
              </p>
              <div className="flex items-center gap-6 pt-2">
                <div>
                  <CountUp value={60} suffix=" mins" className="font-display text-[30px] font-bold text-gold-bright" />
                  <div className="text-label-caps uppercase text-sand">Free airport waiting</div>
                </div>
                <div className="h-12 w-px bg-ink-600" />
                <div>
                  <span className="font-display text-[30px] font-bold text-gold-bright">£0</span>
                  <div className="text-label-caps uppercase text-sand">Delay surcharge</div>
                </div>
              </div>
            </div>
            <RevealGroup className="grid grid-cols-2 gap-3 sm:gap-4 lg:col-span-7">
              {FLIGHT_FEATURES.map(({ icon: Icon, title, text }) => (
                <RevealItem key={title}>
                  <motion.div whileHover={{ y: -4 }} className="h-full rounded-xl border border-white/5 bg-ink-700/60 p-3.5 sm:p-5">
                    <span className="mb-2.5 grid h-9 w-9 place-items-center rounded-lg bg-gold/10 text-gold-bright sm:mb-3 sm:h-11 sm:w-11">
                      <Icon size={21} />
                    </span>
                    <h4 className="mb-1 font-display text-[15px] font-semibold leading-snug text-cream sm:text-[18px]">{title}</h4>
                    <p className="text-[12px] leading-relaxed text-sand sm:text-[13px]">{text}</p>
                  </motion.div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
