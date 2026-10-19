import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1];

/** Compact cinematic header for inner pages. */
export default function PageHero({ eyebrow, title, text, image = '/images/hero.webp', crumbs = [], children }) {
  return (
    <section className="relative isolate overflow-hidden bg-ink-900 pb-12 pt-32 md:pb-16 md:pt-40">
      <motion.img initial={{ scale: 1.15, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.6, ease }} src={image} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover object-[70%_center]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-900 via-ink-900/85 to-ink-900/40" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-850 to-transparent" />
      <div className="container-site">
        <motion.nav initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1 text-[12.5px] text-slatey">
          <Link to="/" className="hover:text-gold-bright">Home</Link>
          {crumbs.map((c) => (
            <span key={c.label} className="flex items-center gap-1">
              <ChevronRight size={13} />
              {c.to ? <Link to={c.to} className="hover:text-gold-bright">{c.label}</Link> : <span className="text-sand">{c.label}</span>}
            </span>
          ))}
        </motion.nav>
        <motion.span initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, ease }} className="eyebrow">
          {eyebrow}
        </motion.span>
        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.8, ease }} className="max-w-3xl font-display text-[36px] font-semibold leading-[1.1] text-white md:text-[52px]">
          {title}
        </motion.h1>
        {text && (
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, ease }} className="mt-4 max-w-2xl text-[15.5px] leading-relaxed text-slate-300">
            {text}
          </motion.p>
        )}
        {children && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, ease }} className="mt-7">
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}
