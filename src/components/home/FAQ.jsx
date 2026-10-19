import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading.jsx';
import { RevealGroup, RevealItem } from '../ui/Reveal.jsx';
import { FAQS, POLICIES } from '../../data/content.js';

export default function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="bg-ink-850 py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <SectionHeading center eyebrow="Clarity & Assurance" title="Frequently Asked Questions" text="Everything you need to know about our chauffeur and airport transfer service." />
        <RevealGroup gap={0.05} className="space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <RevealItem key={f.q} className={`overflow-hidden rounded-xl border transition-colors ${isOpen ? 'border-gold/30 bg-ink-750' : 'border-white/5 bg-ink-750/70'}`}>
                <button type="button" onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-4 p-5 text-left md:p-6">
                  <span className="font-display text-[16.5px] font-semibold text-cream md:text-[18px]">{f.q}</span>
                  <motion.span animate={{ rotate: isOpen ? 45 : 0 }} className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${isOpen ? 'bg-gold text-ink-900' : 'bg-ink-700 text-gold'}`}>
                    <Plus size={18} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                      <p className="px-5 pb-6 text-[14.5px] leading-relaxed text-sand md:px-6">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>

      <div className="container-site mt-16 border-t border-white/10 pt-14">
        <SectionHeading center eyebrow="Guarantees & Policies" title="Booking Protections" />
        <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {POLICIES.map(({ icon: Icon, title, text, tag }) => (
            <RevealItem key={title}>
              <motion.div whileHover={{ y: -4 }} className="flex h-full flex-col rounded-2xl border border-white/5 bg-ink-750 p-5">
                <span className="mb-3 grid h-11 w-11 place-items-center rounded-xl border border-gold/20 bg-gold/10 text-gold-bright">
                  <Icon size={21} />
                </span>
                <h4 className="mb-1 text-[15.5px] font-semibold text-white">{title}</h4>
                <p className="mb-4 text-[13px] leading-relaxed text-sand">{text}</p>
                <div className="mt-auto border-t border-white/5 pt-3 text-[11px] font-bold uppercase tracking-wider text-gold-bright">{tag}</div>
              </motion.div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
