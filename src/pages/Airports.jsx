import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Plane } from 'lucide-react';
import PageHero from '../components/layout/PageHero.jsx';
import AirportFares from '../components/home/AirportFares.jsx';
import AirportStatus from '../components/home/AirportStatus.jsx';
import FAQ from '../components/home/FAQ.jsx';
import FinalCTA from '../components/home/FinalCTA.jsx';
import { RevealGroup, RevealItem } from '../components/ui/Reveal.jsx';
import { AIRPORTS, FLIGHT_FEATURES } from '../data/content.js';
import { byId } from '../data/locations.js';
import { fixedFare } from '../lib/pricing.js';
import { gbp } from '../lib/format.js';
import { useBooking, toPlace } from '../context/BookingContext.jsx';
import usePageMeta from '../lib/usePageMeta.js';

export function AirportsIndex() {
  usePageMeta('Airport Transfers', 'Fixed-price chauffeur transfers for Heathrow, Gatwick, Stansted, Luton, London City and Farnborough.');
  return (
    <>
      <PageHero eyebrow="Flight-Tracked Transfers" title="London airport transfers" text="Meet & greet in the terminal, live flight tracking and 60 minutes of free waiting — at a fixed price." crumbs={[{ label: 'Airports' }]} />
      <section className="bg-ink-850 py-12 md:py-16">
        <RevealGroup className="container-site grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {AIRPORTS.map((a) => (
            <RevealItem key={a.slug}>
              <Link to={`/airports/${a.slug}`} className="group flex h-full flex-col rounded-2xl border border-white/5 bg-ink-750 p-6 transition-all hover:-translate-y-1 hover:border-gold/30">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-display text-[34px] font-bold text-gold-gradient">{a.code}</span>
                  <Plane size={22} className="text-gold transition-transform group-hover:-rotate-12 group-hover:translate-x-1" />
                </div>
                <h2 className="font-display text-[20px] font-semibold text-cream">{a.name}</h2>
                <p className="mb-4 text-[12px] uppercase tracking-wide text-slatey">{a.detail}</p>
                <p className="mb-5 text-[13.5px] leading-relaxed text-sand">{a.blurb}</p>
                <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
                  <span className="text-[13px] text-sand">
                    To Mayfair from <b className="text-[17px] text-white">{gbp(fixedFare(byId[a.locId], byId.mayfair))}</b>
                  </span>
                  <ArrowRight size={18} className="text-gold transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>
      <AirportFares />
      <FAQ />
      <FinalCTA />
    </>
  );
}

export function AirportDetail() {
  const { slug } = useParams();
  const airport = AIRPORTS.find((a) => a.slug === slug);
  const navigate = useNavigate();
  const { update } = useBooking();
  usePageMeta(airport ? `${airport.name} Transfers` : 'Airport', airport?.blurb);
  if (!airport) return <Navigate to="/airports" replace />;

  const book = (direction) => {
    const a = toPlace(byId[airport.locId]);
    const m = toPlace(byId.mayfair);
    update({ journeyType: 'oneway', pickup: direction === 'from' ? a : m, dropoff: direction === 'from' ? m : a, vehicleId: null });
    navigate('/book');
  };

  return (
    <>
      <PageHero eyebrow={`${airport.code} · ${airport.detail}`} title={`${airport.name} chauffeur transfers`} text={airport.blurb} crumbs={[{ label: 'Airports', to: '/airports' }, { label: airport.name }]}>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={() => book('from')} className="btn-gold shine">
            Book from {airport.code} <ArrowRight size={16} />
          </button>
          <button type="button" onClick={() => book('to')} className="btn-ghost">
            Book to {airport.code}
          </button>
        </div>
      </PageHero>
      <section className="bg-ink-850 pt-12">
        <RevealGroup className="container-site grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FLIGHT_FEATURES.map(({ icon: Icon, title, text }) => (
            <RevealItem key={title}>
              <motion.div whileHover={{ y: -4 }} className="h-full rounded-2xl border border-white/5 bg-ink-750 p-5">
                <Icon size={22} className="mb-3 text-gold" />
                <h3 className="mb-1 font-semibold text-white">{title}</h3>
                <p className="text-[13px] leading-relaxed text-sand">{text}</p>
              </motion.div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>
      <div className="bg-ink-850 pt-8">
        <div className="container-site">
          <h2 className="h-section">Fixed fares from {airport.name}</h2>
        </div>
      </div>
      <AirportFares key={slug} initial={slug} compact />
      <AirportStatus />
      <FinalCTA />
    </>
  );
}
