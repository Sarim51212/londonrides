import { motion } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading.jsx';
import { RevealGroup, RevealItem } from '../ui/Reveal.jsx';
import { STEPS } from '../../data/content.js';

export default function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-ink-900 py-16 md:py-24">
      <div className="container-site">
        <SectionHeading center eyebrow="Simplicity & Certainty" title="Four Steps to a Seamless Journey" text="From the moment you reserve to the moment your door is opened at your destination." />
        <div className="relative">
          {/* Animated connector line (desktop) */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-[12%] right-[12%] top-[52px] hidden h-px origin-left bg-gradient-to-r from-gold/0 via-gold/60 to-gold/0 lg:block"
          />
          {/* Vertical connector (mobile) */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1.6 }}
            className="absolute bottom-10 left-[39px] top-10 w-px origin-top bg-gradient-to-b from-gold/60 to-gold/0 sm:hidden"
          />
          <RevealGroup gap={0.15} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {STEPS.map(({ icon: Icon, title, text, tag }, i) => (
              <RevealItem key={title} className="relative">
                <motion.div whileHover={{ y: -6 }} className="relative flex h-full gap-4 rounded-2xl border border-white/5 bg-ink-750 p-5 sm:flex-col sm:p-6">
                  <div className="flex shrink-0 items-center justify-between sm:mb-4">
                    <span className="relative grid h-12 w-12 place-items-center rounded-full border border-gold/40 bg-ink-900 text-gold-bright shadow-[0_0_24px_rgba(212,175,55,0.25)]">
                      <Icon size={20} />
                    </span>
                    <span className="hidden font-display text-[40px] font-bold leading-none text-white/[0.06] sm:block">0{i + 1}</span>
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span className="mb-1 text-label-caps uppercase text-gold">Step 0{i + 1}</span>
                    <h3 className="mb-2 font-display text-[19px] font-semibold text-cream">{title}</h3>
                    <p className="text-[13.5px] leading-relaxed text-sand">{text}</p>
                    <div className="mt-4 rounded-lg bg-ink-700/50 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-gold-muted sm:mt-auto sm:translate-y-0">{tag}</div>
                  </div>
                </motion.div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
