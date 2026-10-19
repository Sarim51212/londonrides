import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Car, MessageCircle, Briefcase, Phone, ArrowRight } from 'lucide-react';
import { Reveal } from '../ui/Reveal.jsx';
import { SITE } from '../../data/site.js';

export default function FinalCTA() {
  return (
    <section className="bg-ink-900 py-16 md:py-20">
      <div className="container-site space-y-6">
        <Reveal className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-gold/30 bg-ink-700/80 p-6 text-center shadow-xl md:flex-row md:p-8 md:text-left">
          <div className="space-y-1">
            <span className="flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-wider text-gold-bright md:justify-start">
              <Briefcase size={15} /> Corporate Accounts
            </span>
            <h4 className="font-display text-[20px] font-bold text-white">Managing VIP delegations or regular airport runs?</h4>
            <p className="max-w-xl text-[14px] text-slate-300">Monthly invoicing, dedicated chauffeur allocation, consolidated statements and corporate tariffs.</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <a href={SITE.phoneHref} className="btn-dark">
              <Phone size={16} className="text-gold" /> Call us
            </a>
            <Link to="/contact?topic=corporate" className="btn-gold">
              Open Account <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>

        <Reveal className="relative overflow-hidden rounded-3xl">
          <img src="/images/hero.webp" alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-[70%_center]" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-900 via-ink-900/90 to-ink-900/40" />
          <div className="relative flex flex-col items-center gap-8 p-8 text-center sm:p-12 lg:flex-row lg:justify-between lg:p-16 lg:text-left">
            <div className="max-w-2xl space-y-3">
              <span className="eyebrow">Seamless British Hospitality</span>
              <h2 className="h-section">Ready for an effortless London journey?</h2>
              <p className="text-[15px] text-sand">Reserve your chauffeur in under 60 seconds with instant fixed pricing, free flight tracking and complete peace of mind.</p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link to="/book" className="btn-gold shine w-full !min-h-[56px] !px-8 text-[15px]">
                  <Car size={19} /> Book Your Transfer
                </Link>
              </motion.div>
              <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-ghost !min-h-[56px]">
                <MessageCircle size={19} className="text-[#25D366]" /> WhatsApp Concierge
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
