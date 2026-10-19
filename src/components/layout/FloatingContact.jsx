import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Headphones, MessageCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { SITE } from '../../data/site.js';

/** Desktop-only concierge buttons (phones use MobileActionBar). Appears once the hero is passed. */
export default function FloatingContact() {
  const { pathname } = useLocation();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  if (pathname.startsWith('/book')) return null;
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.4 }}
          className="fixed bottom-6 right-6 z-40 hidden flex-col items-end gap-3 lg:flex"
        >
          <a href={SITE.phoneHref} className="flex items-center gap-2 rounded-full bg-obsidian-elevated/90 px-4 py-2 text-[13px] font-semibold text-cream shadow-elevated backdrop-blur-md transition hover:text-gold-bright">
            <Headphones size={17} className="text-gold" /> Call Chauffeur Desk
          </a>
          <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 rounded-full bg-ink-700/90 py-2 pl-2 pr-5 shadow-elevated backdrop-blur-md transition hover:bg-ink-600">
            <span className="relative grid h-11 w-11 place-items-center rounded-full bg-[#25D366] text-white">
              <MessageCircle size={21} />
              <span className="absolute right-0 top-0 h-3 w-3 animate-ping rounded-full bg-gold-bright opacity-75" />
              <span className="absolute right-0 top-0 h-3 w-3 rounded-full bg-gold-bright" />
            </span>
            <span className="flex flex-col text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gold-muted">Online Concierge</span>
              <span className="text-[13px] font-semibold text-cream group-hover:text-gold-bright">WhatsApp in 30s</span>
            </span>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
