import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Clock, Phone, Plane, Route, Ship, Sparkles, CheckCircle2, BadgeCheck, Coins, PlaneTakeoff, Share2 } from 'lucide-react';
import clsx from 'clsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import { Reveal } from '../ui/Reveal.jsx';
import { byId } from '../../data/locations.js';
import { routeStats, fixedFare } from '../../lib/pricing.js';
import { gbp, formatDuration } from '../../lib/format.js';
import { useBooking, toPlace } from '../../context/BookingContext.jsx';
import { SITE } from '../../data/site.js';

const CORE = { x: 410, y: 280 };
// Stylised positions on an 800×560 canvas (not to scale).
const HUBS = [
  { id: 'lhr', label: 'Heathrow', code: 'LHR', x: 175, y: 318, kind: 'airport', via: 'M4 & A4 West London corridor' },
  { id: 'lgw', label: 'Gatwick', code: 'LGW', x: 430, y: 482, kind: 'airport', via: 'M23 & A23 South London corridor' },
  { id: 'stn', label: 'Stansted', code: 'STN', x: 565, y: 105, kind: 'airport', via: 'M11 & North Circular' },
  { id: 'ltn', label: 'Luton', code: 'LTN', x: 325, y: 92, kind: 'airport', via: 'M1 & A41 corridor' },
  { id: 'lcy', label: 'London City', code: 'LCY', x: 545, y: 290, kind: 'airport', via: 'A13 & Limehouse Link' },
  { id: 'fab', label: 'Farnborough', code: 'FAB', x: 130, y: 418, kind: 'fbo', via: 'M3 & A308 VIP route' },
  { id: 'sou', label: 'Southampton', code: 'SOU', x: 92, y: 520, kind: 'port', via: 'M3 & M27 direct' },
  { id: 'dov', label: 'Dover', code: 'DOV', x: 735, y: 470, kind: 'port', via: 'M20 & A20 Kent corridor' },
];
const DESTS = ['mayfair', 'city', 'canary', 'knightsbridge', 'kensington', 'stp'];
const FILTERS = [
  { id: 'all', label: 'All corridors' },
  { id: 'airport', label: 'Airports' },
  { id: 'fbo', label: 'Private FBOs' },
  { id: 'port', label: 'Cruise ports' },
];

const curve = (h) => {
  const cx = (h.x + CORE.x) / 2 + (h.y - CORE.y) * 0.18;
  const cy = (h.y + CORE.y) / 2 - (h.x - CORE.x) * 0.18;
  return `M ${h.x} ${h.y} Q ${cx} ${cy} ${CORE.x} ${CORE.y}`;
};

export default function CoverageMap() {
  const [hubId, setHubId] = useState('lhr');
  const [dest, setDest] = useState('mayfair');
  const [filter, setFilter] = useState('all');
  const { update } = useBooking();
  const navigate = useNavigate();

  const hub = HUBS.find((h) => h.id === hubId);
  const stats = useMemo(() => routeStats(byId[hubId], byId[dest]), [hubId, dest]);
  const fare = useMemo(() => fixedFare(byId[hubId], byId[dest]), [hubId, dest]);
  const visible = (h) => filter === 'all' || h.kind === filter;

  const book = () => {
    update({ journeyType: 'oneway', pickup: toPlace(byId[hubId]), dropoff: toPlace(byId[dest]), vehicleId: null });
    navigate('/book?step=vehicle');
  };

  return (
    <section id="coverage" className="relative overflow-hidden border-y border-white/5 bg-ink-900 py-16 md:py-24">
      <div className="container-site relative">
        <SectionHeading
          eyebrow="Route & Coverage Network"
          title="London & UK Transfer Radar"
          text="Explore our most-travelled corridors. Tap any hub to see the journey time, distance and fixed fare instantly."
        />

        <div className="no-scrollbar -mx-5 mb-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:px-0">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => {
                setFilter(f.id);
                const first = HUBS.find((h) => f.id === 'all' || h.kind === f.id);
                if (first && !(f.id === 'all' || hub.kind === f.id)) setHubId(first.id);
              }}
              className={clsx('shrink-0 rounded-full px-4 py-2 text-[12.5px] font-semibold transition-all', filter === f.id ? 'bg-gold-bright text-ink-900 shadow-gold' : 'bg-ink-750 text-slate-300 hover:bg-ink-700')}
            >
              {f.label}
            </button>
          ))}
        </div>

        <Reveal className="grid gap-5 rounded-3xl border border-white/10 bg-ink-750 p-3 shadow-2xl md:p-5 lg:grid-cols-12 lg:gap-6">
          {/* Map canvas */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-ink-900 lg:col-span-8">
            <div className="relative aspect-[800/560] w-full select-none">
              <svg viewBox="0 0 800 560" className="absolute inset-0 h-full w-full" aria-hidden>
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(218,178,86,0.06)" />
                  </pattern>
                  <linearGradient id="routeGold" x1="0" x2="1">
                    <stop offset="0%" stopColor="#f2ca50" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#e4c277" stopOpacity="0.4" />
                  </linearGradient>
                  <radialGradient id="sweep" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(242,202,80,0.18)" />
                    <stop offset="100%" stopColor="rgba(242,202,80,0)" />
                  </radialGradient>
                </defs>
                <rect width="800" height="560" fill="url(#grid)" />
                {/* Thames */}
                <path d="M 10 330 C 80 340, 160 310, 240 320 C 310 330, 360 295, 410 290 C 470 285, 520 330, 570 320 C 630 305, 710 320, 790 300" fill="none" stroke="#1e293b" strokeWidth="20" strokeLinecap="round" opacity="0.85" />
                <path d="M 10 330 C 80 340, 160 310, 240 320 C 310 330, 360 295, 410 290 C 470 285, 520 330, 570 320 C 630 305, 710 320, 790 300" fill="none" stroke="rgba(192,208,230,0.2)" strokeWidth="3" />
                {/* M25 */}
                <ellipse cx="410" cy="280" rx="330" ry="215" fill="none" stroke="rgba(229,195,120,0.18)" strokeWidth="2" strokeDasharray="6 6" />
                <text x="410" y="56" textAnchor="middle" fill="rgba(209,197,175,0.4)" fontSize="10" letterSpacing="4">M25 GREATER LONDON ORBITAL</text>
                {/* Radar sweep */}
                <g style={{ transformOrigin: '410px 280px' }} className="animate-[spin_8s_linear_infinite]">
                  <path d="M410 280 L410 140 A140 140 0 0 1 531 210 Z" fill="url(#sweep)" />
                </g>
                <circle cx="410" cy="280" r="85" fill="rgba(242,202,80,0.03)" stroke="rgba(242,202,80,0.28)" strokeWidth="1.5" strokeDasharray="4 4" />
                <text x="410" y="236" textAnchor="middle" fill="#f2ca50" fontSize="11" fontWeight="bold" opacity="0.75">CENTRAL LONDON</text>

                {HUBS.map((h, i) => {
                  const d = curve(h);
                  const active = h.id === hubId;
                  const show = visible(h);
                  return (
                    <g key={h.id} opacity={show ? 1 : 0.12} style={{ transition: 'opacity .4s' }}>
                      <motion.path
                        id={`route-${h.id}`}
                        d={d}
                        fill="none"
                        stroke={active ? '#f2ca50' : 'url(#routeGold)'}
                        strokeWidth={active ? 4 : 2.5}
                        strokeLinecap="round"
                        strokeDasharray={active ? '0' : '6 4'}
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: active ? 1 : 0.55 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.4, delay: 0.2 + i * 0.12, ease: 'easeInOut' }}
                        style={active ? { filter: 'drop-shadow(0 0 6px rgba(242,202,80,0.8))' } : undefined}
                      />
                      {show && (
                        <circle r={active ? 5 : 3.5} fill={active ? '#fff' : '#f2ca50'}>
                          <animateMotion dur={`${active ? 3 : 5 + (i % 3)}s`} repeatCount="indefinite" rotate="auto" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
                            <mpath href={`#route-${h.id}`} />
                          </animateMotion>
                        </circle>
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Core pin */}
              <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${(CORE.x / 800) * 100}%`, top: `${(CORE.y / 560) * 100}%` }}>
                <div className="relative grid place-items-center">
                  <span className="absolute h-12 w-12 animate-[spin_12s_linear_infinite] rounded-full border-2 border-dashed border-gold/50" />
                  <span className="relative z-10 grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-gradient-to-br from-gold-bright to-gold text-ink-900 shadow-2xl">
                    <Sparkles size={15} />
                  </span>
                </div>
              </div>

              {/* Hub pins */}
              {HUBS.map((h) => {
                const active = h.id === hubId;
                const Icon = h.kind === 'port' ? Ship : h.kind === 'fbo' ? PlaneTakeoff : Plane;
                const right = h.x > 600;
                return (
                  <button
                    key={h.id}
                    type="button"
                    disabled={!visible(h)}
                    onClick={() => setHubId(h.id)}
                    aria-label={`${h.label} route`}
                    aria-pressed={active}
                    className={clsx('group absolute -translate-x-1/2 -translate-y-1/2 transition-opacity disabled:opacity-20', active ? 'z-20' : 'z-10')}
                    style={{ left: `${(h.x / 800) * 100}%`, top: `${(h.y / 560) * 100}%` }}
                  >
                    <span className="relative grid place-items-center p-2">
                      {active && <span className="absolute h-9 w-9 animate-ping rounded-full bg-gold/30" />}
                      <span className={clsx('relative grid h-7 w-7 place-items-center rounded-full border-2 shadow-lg transition-transform group-hover:scale-110 md:h-8 md:w-8', active ? 'border-white bg-gold-bright text-ink-900' : 'border-ink-900 bg-gold text-ink-900')}>
                        <Icon size={14} />
                      </span>
                      <span
                        className={clsx(
                          'absolute top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg border px-2 py-1 text-left shadow-xl backdrop-blur-md transition-all',
                          right ? 'right-10' : 'left-10',
                          active ? 'border-gold bg-ink-700/95' : 'hidden border-white/10 bg-ink-700/90 sm:block',
                        )}
                      >
                        <span className="block text-[10.5px] font-bold text-white md:text-[11px]">
                          {h.code} {h.label}
                        </span>
                        <span className="block text-[9.5px] font-bold text-gold-bright md:text-[10px]">from {gbp(fixedFare(byId[h.id], byId[dest]))}</span>
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 px-4 py-3 text-[11px] text-slatey">
              <span className="flex items-center gap-4">
                <span className="flex items-center gap-1.5"><Plane size={12} className="text-gold" /> Airport</span>
                <span className="flex items-center gap-1.5"><PlaneTakeoff size={12} className="text-gold" /> Private FBO</span>
                <span className="flex items-center gap-1.5"><Ship size={12} className="text-gold" /> Cruise port</span>
              </span>
              <span className="uppercase tracking-wider">Tap a hub to price it</span>
            </div>
          </div>

          {/* Estimator */}
          <div className="flex flex-col rounded-2xl border border-white/10 bg-ink-700/60 p-5 lg:col-span-4 lg:p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2 text-label-caps uppercase text-gold-muted">
                <Route size={17} className="text-gold" /> Route Estimator
              </span>
              <span className="rounded-full bg-gold/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-gold-bright">100% FIXED</span>
            </div>
            <label className="label" htmlFor="map-origin">Pickup</label>
            <select id="map-origin" value={hubId} onChange={(e) => setHubId(e.target.value)} className="field mb-3 w-full cursor-pointer">
              {HUBS.map((h) => (
                <option key={h.id} value={h.id}>{byId[h.id].name}</option>
              ))}
            </select>
            <label className="label" htmlFor="map-dest">Destination</label>
            <select id="map-dest" value={dest} onChange={(e) => setDest(e.target.value)} className="field mb-5 w-full cursor-pointer">
              {DESTS.map((d) => (
                <option key={d} value={d}>{byId[d].name}</option>
              ))}
            </select>

            <div className="mb-5 space-y-3 rounded-xl border border-white/10 bg-ink-900 p-4">
              <Row label="Estimated time" value={<span className="flex items-center gap-1"><Clock size={14} className="text-gold" /> {formatDuration(stats?.minutes)}</span>} />
              <Row label="Distance" value={`${stats?.miles} miles`} />
              <Row label="Typical route" value={<span className="text-right text-[12px] font-medium">{hub.via}</span>} />
              <div className="flex items-end justify-between pt-1">
                <div>
                  <span className="block text-label-caps uppercase text-gold-muted">Fixed fare from</span>
                  <span className="text-[11px] text-slatey">Congestion & ULEZ included</span>
                </div>
                <AnimatePresence mode="wait">
                  <motion.span key={fare} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="font-display text-[30px] font-bold text-gold-bright">
                    {gbp(fare)}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
            <ul className="mb-6 space-y-1.5 text-[12.5px] text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 size={15} className="text-gold" /> 60 mins free airport waiting with meet & greet</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={15} className="text-gold" /> Pickup adjusts automatically to flight delays</li>
            </ul>
            <div className="mt-auto space-y-2">
              <button type="button" onClick={book} className="btn-gold shine w-full">
                Book This Route <ArrowRight size={16} />
              </button>
              <a href={SITE.phoneHref} className="btn-dark w-full !min-h-[44px] text-[13px]">
                <Phone size={15} className="text-gold" /> 24/7 Dispatch Desk
              </a>
            </div>
          </div>
        </Reveal>

        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {[
            [BadgeCheck, 'Full M25 & beyond', 'Home Counties & UK-wide'],
            [Coins, 'All tolls & ULEZ', 'Always included'],
            [PlaneTakeoff, 'Terminal parking', 'Paid by us, not you'],
            [Share2, 'Live driver tracking', 'Share via SMS/WhatsApp'],
          ].map(([Icon, t, s]) => (
            <Reveal key={t} className="flex items-center gap-3 rounded-xl border border-white/5 bg-ink-750 p-3.5 md:p-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-ink-700 text-gold"><Icon size={19} /></span>
              <span className="min-w-0">
                <span className="block text-[12.5px] font-semibold text-white">{t}</span>
                <span className="block text-[11px] text-slatey">{s}</span>
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-2.5 text-[13px]">
      <span className="text-slatey">{label}</span>
      <span className="font-bold text-white">{value}</span>
    </div>
  );
}
