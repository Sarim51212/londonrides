import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading.jsx';
import { RevealGroup, RevealItem } from '../ui/Reveal.jsx';
import { SERVICES } from '../../data/content.js';

export default function ServicesGrid({ limit = 6, heading = true }) {
  return (
    <section id="services" className="bg-ink-850 py-16 md:py-24">
      <div className="container-site">
        {heading && <SectionHeading center eyebrow="Tailored Transportation" title="Chauffeur Services" text="From private jet apron pickups to full-day corporate roadshows across the United Kingdom." />}
        <RevealGroup className={heading ? "m-carousel md:grid-cols-2 md:gap-5 lg:grid-cols-3" : "grid gap-5 md:grid-cols-2 lg:grid-cols-3"}>
          {SERVICES.slice(0, limit).map(({ id, icon: Icon, title, text, cta, to }) => (
            <RevealItem key={id} id={heading ? undefined : id} className="scroll-mt-28">
              <motion.div whileHover="hover" className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/5 bg-ink-750 p-6 transition-colors hover:border-gold/30 md:p-8">
                <motion.span variants={{ hover: { scale: 1.5, opacity: 1 } }} initial={{ opacity: 0 }} className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold/10 blur-2xl" />
                <motion.span variants={{ hover: { rotate: -8, scale: 1.1 } }} className="mb-6 grid h-14 w-14 place-items-center rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 text-gold-bright ring-1 ring-gold/20">
                  <Icon size={26} />
                </motion.span>
                <h3 className="mb-3 font-display text-[21px] font-semibold text-cream">{title}</h3>
                <p className="mb-6 text-[14.5px] leading-relaxed text-sand">{text}</p>
                <Link to={to} className="mt-auto inline-flex items-center gap-2 text-[14px] font-semibold text-gold-bright">
                  <span className="relative after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-gold-bright after:transition-transform group-hover:after:scale-x-100">{cta}</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
