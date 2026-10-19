import { Link } from 'react-router-dom';
import { Lock, BadgeCheck, Mail, Phone, MapPin } from 'lucide-react';
import Logo from '../ui/Logo.jsx';
import Stars from '../ui/Stars.jsx';
import PaymentLogos from '../ui/PaymentLogos.jsx';
import { SITE } from '../../data/site.js';
import { AIRPORTS } from '../../data/content.js';

// Brand glyphs (lucide-react no longer ships brand icons).
const brand = (d) =>
  function BrandIcon({ size = 18 }) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d={d} />
      </svg>
    );
  };
const Instagram = brand('M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 4.7a5.1 5.1 0 1 0 0 10.2 5.1 5.1 0 0 0 0-10.2zm0 8.4a3.3 3.3 0 1 1 0-6.6 3.3 3.3 0 0 1 0 6.6zm5.3-9.8a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z');
const Facebook = brand('M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z');
const Linkedin = brand('M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6h.1c.5-.9 1.6-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5v6.2zM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2zM7.1 20.5H3.5V9h3.6v11.5zM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0z');

const COLUMNS = [
  { title: 'Airport Transfers', links: AIRPORTS.map((a) => ({ label: `${a.name} (${a.code})`, to: `/airports/${a.slug}` })) },
  {
    title: 'Services',
    links: [
      { label: 'Hourly Chauffeur Hire', to: '/services#hourly' },
      { label: 'Corporate Accounts', to: '/services#corporate' },
      { label: 'Cruise Port Transfers', to: '/services#cruise' },
      { label: 'Eurostar & Rail', to: '/services#stations' },
      { label: 'UK Day Tours', to: '/services#day-tours' },
      { label: 'Weddings & Events', to: '/services#events' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Our Fleet', to: '/fleet' },
      { label: 'Contact Us', to: '/contact' },
      { label: 'Terms & Conditions', to: '/terms' },
      { label: 'Cancellation Policy', to: '/terms#cancellation' },
      { label: 'Privacy Policy', to: '/terms#privacy' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-ink-900 pb-28 pt-16 text-sand lg:pb-10">
      <div className="container-site">
        <div className="grid gap-10 pb-12 md:grid-cols-2 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-4">
            <Logo />
            <p className="max-w-sm text-[14px] leading-relaxed">
              Fixed-price luxury chauffeur and airport transfers across London, the Home Counties and the UK. Serving executives, families and discerning travellers since {SITE.since}.
            </p>
            <div className="flex flex-wrap gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-xl border border-white/5 bg-ink-750 px-3 py-1.5 text-[12px]">
                <Stars size={13} /> <b className="text-white">{SITE.rating}/5</b> ({SITE.reviewCount.toLocaleString()}+ reviews)
              </span>
              <span className="inline-flex items-center gap-2 rounded-xl border border-white/5 bg-ink-750 px-3 py-1.5 text-[12px]">
                <BadgeCheck size={15} className="text-gold" /> {SITE.tflLicence}
              </span>
            </div>
            <ul className="space-y-2 text-[14px]">
              <li>
                <a href={SITE.phoneHref} className="flex items-center gap-2.5 hover:text-gold-bright">
                  <Phone size={15} className="text-gold" /> {SITE.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`} className="flex items-center gap-2.5 hover:text-gold-bright">
                  <Mail size={15} className="text-gold" /> {SITE.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin size={15} className="text-gold" /> {SITE.address}
              </li>
            </ul>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title} className="lg:col-span-2">
              <h3 className="mb-4 text-label-caps uppercase text-cream">{col.title}</h3>
              <ul className="space-y-2.5 text-[14px]">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="transition-colors hover:text-gold-bright">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-label-caps uppercase text-cream">Follow</h3>
            <div className="flex gap-2">
              {[
                [Instagram, SITE.socials.instagram, 'Instagram'],
                [Facebook, SITE.socials.facebook, 'Facebook'],
                [Linkedin, SITE.socials.linkedin, 'LinkedIn'],
              ].map(([Icon, href, label]) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-ink-750 transition hover:-translate-y-0.5 hover:border-gold/50 hover:text-gold-bright">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-5 border-t border-white/5 pt-6 md:flex-row">
          <p className="text-center text-[12px] md:text-left">© {new Date().getFullYear()} London Rides Ltd. Registered in England & Wales.</p>
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider">
              <Lock size={13} className="text-gold" /> Secure payments by Stripe & PayPal
            </span>
            <PaymentLogos className="justify-center" />
          </div>
        </div>
      </div>
    </footer>
  );
}
