import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { BadgeCheck, Headphones, Wallet, ChevronRight } from 'lucide-react';
import JourneyForm from '../booking/JourneyForm.jsx';
import Stars from '../ui/Stars.jsx';
import { SERVICE_STRIP } from '../../data/content.js';
import { SITE } from '../../data/site.js';

const ease = [0.22, 1, 0.36, 1];
const BADGES = [
  { icon: Wallet, title: 'Fixed Prices', sub: 'No hidden fees' },
  { icon: BadgeCheck, title: 'Safe & Reliable', sub: 'Licensed chauffeurs' },
  { icon: Headphones, title: '24/7 Support', sub: 'Always here for you' },
];

function HeroVideo() {
  const reduce = useReducedMotion();
  const [src, setSrc] = useState(null);
  const video = useRef(null);

  useEffect(() => {
    // Lighter 720p file on phones / data-saver; skip video entirely for reduced motion.
    if (reduce) return;
    const saveData = navigator.connection?.saveData;
    if (saveData) return;
    setSrc(window.matchMedia('(min-width: 1024px)').matches ? '/videos/hero-1080.mp4' : '/videos/hero-720.mp4');
  }, [reduce]);

  useEffect(() => {
    video.current?.play().catch(() => {});
  }, [src]);

  return (
    <>
      <img src="/images/hero-poster.webp" alt="" className="absolute inset-0 h-full w-full object-cover object-[70%_center]" fetchPriority="high" />
      {src && (
        <motion.video
          ref={video}
          key={src}
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 h-full w-full object-cover object-[70%_center]"
        />
      )}
    </>
  );
}

export default function Hero() {
  const navigate = useNavigate();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.18]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.45], [0, -60]);

  const words1 = ['Your', 'Journey,'];
  const words2 = ['Our', 'Priority'];

  return (
    <section ref={ref} className="relative isolate flex min-h-[100svh] flex-col bg-ink-900">
      {/* Background video with parallax + slow zoom */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div style={{ y: bgY, scale: bgScale }} className="absolute inset-0">
          <motion.div initial={{ scale: 1.12 }} animate={{ scale: 1 }} transition={{ duration: 2.4, ease }} className="absolute inset-0">
            <HeroVideo />
          </motion.div>
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-850 via-ink-850/10 to-black/50" />
        <div className="grain absolute inset-0 opacity-[0.06] mix-blend-overlay" />
      </div>

      <div className="container-site flex flex-1 flex-col justify-end pb-6 pt-28 md:pt-36">
        <motion.div style={{ opacity: contentOpacity, y: contentY }} className="max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3, ease }} className="mb-4 flex items-center gap-2.5 whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.2em] text-gold sm:text-[11px] sm:tracking-[0.24em]">
            <span className="h-px w-6 bg-gold sm:w-8" />
            Premium Transportation
            <span className="h-1 w-1 rounded-full bg-gold" />
            London & Beyond
          </motion.div>

          <h1 className="font-display text-[44px] leading-[1.05] tracking-tight text-white sm:text-[56px] lg:text-[72px]">
            <span className="block overflow-hidden pb-1">
              {words1.map((w, i) => (
                <motion.span key={w} className="mr-[0.25em] inline-block" initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: 0.45 + i * 0.12, ease }}>
                  {w}
                </motion.span>
              ))}
            </span>
            <span className="block overflow-hidden pb-2">
              {words2.map((w, i) => (
                <motion.span key={w} className="text-gold-gradient mr-[0.25em] inline-block italic" initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: 0.7 + i * 0.12, ease }}>
                  {w}
                </motion.span>
              ))}
            </span>
          </h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1, ease }} className="mt-4 max-w-xl text-[15.5px] leading-relaxed text-slate-300 md:text-[17px]">
            Reliable airport transfers, private hire, executive travel and chauffeur services across London and the UK — at a fixed price you know before you book.
          </motion.p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1.15 }} className="mt-5 flex items-center gap-3 text-[13px] text-slate-300">
            <Stars size={15} />
            <span>
              <b className="text-white">{SITE.rating}</b> from {SITE.reviewCount.toLocaleString()}+ reviews on Google, Trustpilot & TripAdvisor
            </span>
          </motion.div>

          <motion.ul initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: 1.25 } } }} className="mt-6 hidden flex-wrap gap-x-8 gap-y-4 sm:flex">
            {BADGES.map(({ icon: Icon, title, sub }) => (
              <motion.li key={title} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }} className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full border border-gold/40 bg-gold/15 text-gold">
                  <Icon size={19} />
                </span>
                <span>
                  <span className="block text-[14px] font-semibold leading-tight text-white">{title}</span>
                  <span className="text-[12px] text-slate-400">{sub}</span>
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Booking bar */}
        <motion.div
          id="booking"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.1, ease }}
          className="relative z-20 mt-8 rounded-2xl border border-white/80 bg-slate-50 p-3.5 text-slate-800 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.75)] sm:p-5 lg:mt-12 lg:p-6"
        >
          <JourneyForm variant="hero" onSubmit={() => navigate('/book?step=vehicle')} />
        </motion.div>
      </div>

      {/* Service quick-nav strip */}
      <div className="relative z-10 border-t border-white/5 bg-ink-900/90 backdrop-blur-xl">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 1.5 } } }}
          className="container-site no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto py-4 lg:justify-between lg:overflow-visible lg:py-5"
        >
          {SERVICE_STRIP.map(({ icon: Icon, title, sub, to }) => (
            <motion.div key={title} variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} className="shrink-0 snap-start">
              <Link to={to} className="group flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-gold/10 text-gold-soft transition-transform duration-300 group-hover:scale-110 group-hover:bg-gold/20">
                  <Icon size={20} />
                </span>
                <span>
                  <span className="block whitespace-nowrap text-[13px] font-semibold text-white transition-colors group-hover:text-gold-soft">{title}</span>
                  <span className="block whitespace-nowrap text-[11.5px] text-slate-400">{sub}</span>
                </span>
              </Link>
            </motion.div>
          ))}
          <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} className="hidden shrink-0 items-center xl:flex">
            <Link to="/services" className="flex items-center gap-1 text-[13px] font-semibold text-gold-soft hover:text-gold-pale">
              All services <ChevronRight size={16} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
