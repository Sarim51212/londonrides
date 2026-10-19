import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import PageHero from '../components/layout/PageHero.jsx';
import ServicesGrid from '../components/home/ServicesGrid.jsx';
import HowItWorks from '../components/home/HowItWorks.jsx';
import FinalCTA from '../components/home/FinalCTA.jsx';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import { RevealGroup, RevealItem } from '../components/ui/Reveal.jsx';
import { TOURS } from '../data/content.js';
import { vehicleById } from '../data/vehicles.js';
import { byId } from '../data/locations.js';
import { useBooking, toPlace } from '../context/BookingContext.jsx';
import { gbp } from '../lib/format.js';
import usePageMeta from '../lib/usePageMeta.js';

export default function Services() {
  usePageMeta('Chauffeur Services', 'Airport transfers, hourly chauffeur hire, corporate accounts, cruise transfers, private jet FBO and UK day tours.');
  const navigate = useNavigate();
  const { update } = useBooking();

  return (
    <>
      <PageHero eyebrow="Tailored Transportation" title="Chauffeur services for every occasion" text="From a single airport run to a week-long corporate roadshow — one standard of service, at a fixed price." crumbs={[{ label: 'Services' }]}>
        <Link to="/book" className="btn-gold shine">
          Get an instant quote <ArrowRight size={16} />
        </Link>
      </PageHero>
      <ServicesGrid limit={8} heading={false} />

      <section id="day-tours" className="scroll-mt-24 bg-ink-900 py-16 md:py-24">
        <div className="container-site">
          <SectionHeading eyebrow="Private Day Tours" title="Explore beyond London" text="Your own chauffeur and luxury vehicle for the day. Prices shown for an Executive Saloon, as-directed hire." />
          <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TOURS.map((t) => (
              <RevealItem key={t.title}>
                <motion.div whileHover={{ y: -6 }} className="flex h-full flex-col rounded-2xl border border-white/5 bg-ink-750 p-6">
                  <span className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-gold/10 px-3 py-1 text-[12px] font-semibold text-gold-bright">
                    <Clock size={13} /> {t.hours} hours
                  </span>
                  <h3 className="mb-2 font-display text-[20px] font-semibold text-cream">{t.title}</h3>
                  <p className="mb-5 text-[13.5px] leading-relaxed text-sand">{t.text}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-[20px] font-bold text-white">{gbp(vehicleById.executive.hourly * t.hours)}</span>
                    <button
                      type="button"
                      onClick={() => {
                        update({ journeyType: 'hourly', hours: t.hours, pickup: toPlace(byId.mayfair), dropoff: toPlace(byId[t.locId]), vehicleId: 'executive' });
                        navigate('/book');
                      }}
                      className="btn-gold !min-h-[40px] !px-4 text-[13px]"
                    >
                      Book <ArrowRight size={14} />
                    </button>
                  </div>
                </motion.div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>
      <HowItWorks />
      <FinalCTA />
    </>
  );
}
