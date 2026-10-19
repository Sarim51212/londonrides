import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { ArrowRight, ChevronDown, Menu, Phone, X, MessageCircle } from 'lucide-react';
import clsx from 'clsx';
import Logo from '../ui/Logo.jsx';
import { NAV, SITE } from '../../data/site.js';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });
  const overHero = pathname === '/' && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={clsx(
          'fixed inset-x-0 top-0 z-50 transition-[background,border,height] duration-500',
          overHero ? 'border-b border-transparent bg-gradient-to-b from-black/60 to-transparent' : 'border-b border-white/5 bg-ink-850/80 backdrop-blur-xl',
        )}
      >
        <div className={clsx('container-site flex items-center justify-between transition-[height] duration-500', scrolled ? 'h-16' : 'h-[72px] md:h-20')}>
          <Logo compact={scrolled} />

          <nav className="hidden items-center gap-7 text-[13.5px] font-medium lg:flex" aria-label="Main">
            {NAV.map((item) =>
              item.children ? (
                <div key={item.label} className="group relative py-3">
                  <NavLink to={item.to} className={({ isActive }) => clsx('flex items-center gap-1 transition-colors hover:text-gold-bright', isActive ? 'text-gold-bright' : 'text-slate-200')}>
                    {item.label}
                    <ChevronDown size={15} className="transition-transform duration-300 group-hover:rotate-180" />
                  </NavLink>
                  <div className="invisible absolute left-1/2 top-full w-64 -translate-x-1/2 translate-y-2 rounded-xl border border-white/10 bg-obsidian/95 p-2 opacity-0 shadow-elevated backdrop-blur-2xl transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    {item.children.map((c) => (
                      <Link key={c.to} to={c.to} className="flex items-center justify-between rounded-lg px-3.5 py-2.5 text-[13px] text-slate-300 transition-colors hover:bg-ink-700 hover:text-gold-bright">
                        {c.label}
                        {c.note && <span className="text-[10px] font-bold text-gold">{c.note}</span>}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end
                  className={({ isActive }) =>
                    clsx(
                      'relative py-3 transition-colors hover:text-gold-bright after:absolute after:inset-x-0 after:bottom-1.5 after:h-px after:origin-left after:scale-x-0 after:bg-gold after:transition-transform after:duration-300 hover:after:scale-x-100',
                      isActive && !item.to.includes('#') ? 'text-gold-bright after:scale-x-100' : 'text-slate-200',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ),
            )}
          </nav>

          <div className="flex items-center gap-2">
            <a href={SITE.phoneHref} className="hidden items-center gap-2 text-[13px] font-semibold text-slate-200 transition-colors hover:text-gold-bright xl:flex">
              <Phone size={15} className="text-gold" />
              {SITE.phone}
            </a>
            <Link to="/book" className="btn-gold shine hidden !min-h-[42px] !px-5 sm:inline-flex">
              Book Now <ArrowRight size={16} />
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-ink-900/40 text-white backdrop-blur lg:hidden"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
        <motion.div style={{ scaleX: progress }} className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-gradient-to-r from-gold via-gold-bright to-gold-pale" />
      </motion.header>

      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function MobileMenu({ open, onClose }) {
  const links = NAV.flatMap((n) => [n, ...(n.children?.map((c) => ({ ...c, child: true })) ?? [])]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[70] lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className="absolute inset-y-0 right-0 flex w-[88%] max-w-sm flex-col border-l border-hairline bg-ink-900"
          >
            <div className="flex h-[72px] items-center justify-between px-5">
              <Logo compact />
              <button type="button" onClick={onClose} aria-label="Close menu" className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 text-white">
                <X size={22} />
              </button>
            </div>
            <motion.nav
              className="flex-1 overflow-y-auto px-5 py-4"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } } }}
            >
              {links.map((l) => (
                <motion.div key={l.label} variants={{ hidden: { opacity: 0, x: 24 }, show: { opacity: 1, x: 0 } }}>
                  <Link
                    to={l.to}
                    onClick={onClose}
                    className={clsx(
                      'flex items-center justify-between border-b border-white/5 transition-colors hover:text-gold-bright',
                      l.child ? 'py-3 pl-4 text-[14px] text-slate-400' : 'py-4 font-display text-[22px] text-white',
                    )}
                  >
                    {l.label}
                    {l.note && <span className="text-[10px] font-bold text-gold">{l.note}</span>}
                  </Link>
                </motion.div>
              ))}
            </motion.nav>
            <div className="space-y-3 border-t border-white/5 p-5 pb-safe">
              <Link to="/book" onClick={onClose} className="btn-gold shine w-full">
                Get an Instant Quote <ArrowRight size={16} />
              </Link>
              <div className="grid grid-cols-2 gap-3">
                <a href={SITE.phoneHref} className="btn-dark !px-3">
                  <Phone size={16} className="text-gold" /> Call
                </a>
                <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-dark !px-3">
                  <MessageCircle size={16} className="text-[#25D366]" /> WhatsApp
                </a>
              </div>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
