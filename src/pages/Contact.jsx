import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Phone, Mail, MessageCircle, MapPin, Send, CheckCircle2, Clock } from 'lucide-react';
import PageHero from '../components/layout/PageHero.jsx';
import { Reveal } from '../components/ui/Reveal.jsx';
import { SITE } from '../data/site.js';
import usePageMeta from '../lib/usePageMeta.js';

const TOPICS = { general: 'General enquiry', corporate: 'Corporate account', events: 'Weddings & events', booking: 'Existing booking' };

export default function Contact() {
  usePageMeta('Contact Us', 'Speak to our 24/7 London chauffeur desk by phone, WhatsApp or email.');
  const [params] = useSearchParams();
  const [topic, setTopic] = useState(TOPICS[params.get('topic')] ? params.get('topic') : 'general');
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  // No mail backend yet: hand the message to the user's email client.
  const submit = (e) => {
    e.preventDefault();
    const body = `${form.message}\n\n— ${form.name}\n${form.email}\n${form.phone}`;
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(`[${TOPICS[topic]}] ${form.name}`)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const channels = [
    { icon: Phone, title: 'Call 24/7', value: SITE.phone, href: SITE.phoneHref },
    { icon: MessageCircle, title: 'WhatsApp', value: 'Reply in ~30 seconds', href: SITE.whatsapp, external: true },
    { icon: Mail, title: 'Email', value: SITE.email, href: `mailto:${SITE.email}` },
    { icon: MapPin, title: 'Office', value: SITE.address },
  ];

  return (
    <>
      <PageHero eyebrow="We’re here 24/7" title="Talk to our chauffeur desk" text="Questions, corporate accounts or a bespoke itinerary — real people, any hour." crumbs={[{ label: 'Contact' }]} />
      <section className="bg-ink-850 py-12 md:py-20">
        <div className="container-site grid gap-8 lg:grid-cols-12">
          <div className="space-y-3 lg:col-span-5">
            {channels.map(({ icon: Icon, title, value, href, external }, i) => {
              const Comp = href ? 'a' : 'div';
              return (
                <Reveal key={title} delay={i * 0.06}>
                  <Comp href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-ink-750 p-5 transition-colors hover:border-gold/30">
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold/10 text-gold-bright transition-transform group-hover:scale-110">
                      <Icon size={22} />
                    </span>
                    <span>
                      <span className="block text-label-caps uppercase text-slatey">{title}</span>
                      <span className="block text-[15px] font-semibold text-white">{value}</span>
                    </span>
                  </Comp>
                </Reveal>
              );
            })}
            <Reveal className="flex items-center gap-3 rounded-2xl border border-gold/20 bg-gold/5 p-5 text-[13.5px] text-sand">
              <Clock size={20} className="text-gold" /> Dispatch is staffed 24 hours a day, 365 days a year.
            </Reveal>
          </div>

          <Reveal className="rounded-2xl border border-white/10 bg-ink-750 p-5 md:p-8 lg:col-span-7">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div key="sent" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4 py-12 text-center">
                  <CheckCircle2 size={56} className="text-gold-bright" />
                  <h2 className="font-display text-[26px] text-white">Your email is ready to send</h2>
                  <p className="max-w-sm text-sand">We’ve opened your email app with the message filled in. For anything urgent, call or WhatsApp us.</p>
                  <button type="button" onClick={() => setSent(false)} className="btn-dark">Write another message</button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={submit} className="space-y-4">
                  <h2 className="font-display text-[26px] font-semibold text-white">Send us a message</h2>
                  <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
                    {Object.entries(TOPICS).map(([id, label]) => (
                      <button key={id} type="button" onClick={() => setTopic(id)} className={`shrink-0 rounded-full px-4 py-2 text-[12.5px] font-semibold transition-colors ${topic === id ? 'bg-gold text-ink-900' : 'bg-ink-700 text-sand hover:bg-ink-600'}`}>
                        {label}
                      </button>
                    ))}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="label" htmlFor="c-name">Name</label>
                      <input id="c-name" required autoComplete="name" className="field w-full" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div>
                      <label className="label" htmlFor="c-email">Email</label>
                      <input id="c-email" type="email" required autoComplete="email" className="field w-full" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </div>
                    <div>
                      <label className="label" htmlFor="c-phone">Phone</label>
                      <input id="c-phone" type="tel" autoComplete="tel" className="field w-full" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="label" htmlFor="c-msg">Message</label>
                      <textarea id="c-msg" required rows={5} className="field w-full resize-none" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                    </div>
                  </div>
                  <button type="submit" className="btn-gold shine w-full sm:w-auto">
                    <Send size={16} /> Send message
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </Reveal>
        </div>
      </section>
    </>
  );
}
