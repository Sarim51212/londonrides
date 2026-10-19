import { motion } from 'framer-motion';
import { Phone, ShieldCheck } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading.jsx';
import { Reveal, RevealGroup, RevealItem } from '../ui/Reveal.jsx';
import { WHY_US, SAFETY } from '../../data/content.js';
import { SITE } from '../../data/site.js';

export default function WhyUs() {
  return (
    <section className="relative overflow-hidden bg-ink-900 py-16 md:py-24">
      <div className="container-site">
        <SectionHeading center eyebrow="The London Rides Standard" title="Why Travellers Choose Us" />
        <RevealGroup className="mb-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_US.map(({ icon: Icon, title, text }) => (
            <RevealItem key={title}>
              <div className="flex h-full gap-4 rounded-2xl border border-white/5 bg-ink-750/60 p-5 transition-colors hover:border-gold/25 hover:bg-ink-750">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-gold/25 bg-gold/10 text-gold-bright">
                  <Icon size={22} />
                </span>
                <div>
                  <h3 className="mb-1 text-[16px] font-semibold text-white">{title}</h3>
                  <p className="text-[13.5px] leading-relaxed text-sand">{text}</p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal id="safety" className="relative overflow-hidden rounded-3xl border border-white/5 bg-ink-750 p-6 shadow-2xl md:p-12">
          <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 8, repeat: Infinity }} className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-gold/10 blur-3xl" />
          <div className="relative grid items-center gap-8 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-ink-700 px-3 py-1 text-label-caps uppercase text-gold-bright">
                <ShieldCheck size={15} /> Regulated by Transport for London
              </span>
              <h3 className="font-display text-[26px] font-semibold leading-tight text-cream md:text-[38px]">
                Vetted Chauffeurs. Guaranteed Privacy. <br className="hidden sm:block" />
                <span className="text-gold-gradient italic">Zero Compromise on Safety.</span>
              </h3>
              <p className="max-w-2xl text-[15px] leading-relaxed text-sand">
                London Rides operates under a Transport for London Private Hire Operator licence. Every chauffeur passes enhanced DBS background checks, medical clearance and a rigorous knowledge assessment.
              </p>
              <div className="grid gap-4 pt-2 sm:grid-cols-3">
                {SAFETY.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3 text-[13.5px] text-cream">
                    <Icon size={22} className="shrink-0 text-gold" /> {text}
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-4">
              <div className="mx-auto max-w-xs space-y-3 rounded-2xl border border-white/5 bg-ink-700 p-6 text-center lg:mr-0">
                <span className="text-label-caps uppercase text-gold-muted">Dispatch Centre</span>
                <div className="font-display text-[22px] font-bold text-cream">London 24/7 Desk</div>
                <p className="text-[13px] text-sand">Live operations managing traffic and flight changes, 365 days a year.</p>
                <a href={SITE.phoneHref} className="btn-gold shine w-full">
                  <Phone size={17} /> {SITE.phone}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
