import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ArrowRight, MessageCircle, Phone } from 'lucide-react';
import { SITE } from '../../data/site.js';

/** Thumb-reach conversion bar on phones; slides in after the hero. */
export default function MobileActionBar() {
  const { pathname } = useLocation();
  const [show, setShow] = useState(pathname !== '/');
  const hidden = pathname.startsWith('/book') || pathname.startsWith('/booking');

  useEffect(() => {
    if (pathname !== '/') return setShow(true);
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  return (
    <AnimatePresence>
      {show && !hidden && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-2.5 border-t border-white/10 bg-ink-900/95 px-4 pt-3 shadow-[0_-8px_24px_rgba(0,0,0,0.6)] backdrop-blur-xl pb-safe lg:hidden"
        >
          <a href={SITE.phoneHref} aria-label="Call us" className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-white/10 bg-ink-700 text-gold">
            <Phone size={20} />
          </a>
          <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp us" className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-[#25D366]/40 bg-[#25D366]/15 text-[#25D366]">
            <MessageCircle size={20} />
          </a>
          <Link to="/book" className="btn-gold shine flex-1 !min-h-[48px]">
            Instant Fixed Fare <ArrowRight size={16} />
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
