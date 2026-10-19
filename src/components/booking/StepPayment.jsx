import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CreditCard, Wallet, Lock, ShieldCheck, Info, Loader2, Check } from 'lucide-react';
import clsx from 'clsx';
import { useBooking } from '../../context/BookingContext.jsx';
import { api } from '../../lib/api.js';
import { toPayload } from '../../lib/booking.js';
import { gbp } from '../../lib/format.js';
import { Visa, Mastercard, Amex, GooglePay, ApplePay, PayPal } from '../ui/PaymentLogos.jsx';
import DemoPay from './payments/DemoPay.jsx';

// Provider SDKs only load when live keys are configured.
const StripePay = lazy(() => import('./payments/StripePay.jsx'));
const PayPalPay = lazy(() => import('./payments/PayPalPay.jsx'));

const METHODS = [
  { id: 'card', label: 'Card', icon: CreditCard, logos: [Visa, Mastercard, Amex] },
  { id: 'wallet', label: 'Google Pay / Apple Pay', short: 'Wallet', icon: Wallet, logos: [GooglePay, ApplePay] },
  { id: 'paypal', label: 'PayPal', icon: null, logos: [PayPal] },
];

function Processing() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] grid place-items-center bg-ink-950/85 backdrop-blur-md" role="status" aria-live="assertive">
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="relative h-20 w-20">
          <motion.span className="absolute inset-0 rounded-full border-2 border-gold/20" />
          <motion.span className="absolute inset-0 rounded-full border-2 border-transparent border-t-gold-bright" animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }} />
          <Lock className="absolute inset-0 m-auto text-gold" size={26} />
        </div>
        <div>
          <p className="font-display text-[22px] text-white">Securing your chauffeur…</p>
          <p className="text-[13px] text-slatey">Please don’t close this window</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function StepPayment({ onPaid }) {
  const { booking: b, quote } = useBooking();
  const [config, setConfig] = useState(undefined);
  const [method, setMethod] = useState('card');
  const [agreed, setAgreed] = useState(false);
  const [processing, setProcessing] = useState(false);
  const payload = useMemo(() => toPayload(b), [b]);

  useEffect(() => {
    api
      .config()
      .then(setConfig)
      .catch(() => setConfig({ stripe: null, paypal: null, offline: true }));
  }, []);

  const live = method === 'paypal' ? config?.paypal : config?.stripe;
  const shared = { payload, agreed, total: quote.total, onProcessing: setProcessing, onPaid: (rec) => onPaid(rec) };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-[26px] font-semibold text-cream md:text-[30px]">Secure payment</h2>
        <p className="flex items-center gap-1.5 text-[14px] text-sand">
          <Lock size={14} className="text-gold" /> Encrypted checkout · you’ll be charged <b className="text-white">{gbp(quote.total)}</b>
        </p>
      </div>

      {/* Method selector */}
      <div className="grid grid-cols-3 gap-2.5" role="radiogroup" aria-label="Payment method">
        {METHODS.map((m) => {
          const active = method === m.id;
          return (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setMethod(m.id)}
              className={clsx('relative flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-all sm:p-4', active ? 'border-gold bg-gold/10 shadow-glow' : 'border-white/10 bg-ink-900/50 hover:border-white/25')}
            >
              {active && (
                <motion.span layoutId="pm-check" className="absolute -right-1.5 -top-1.5 z-10 grid h-5 w-5 place-items-center rounded-full bg-gold text-ink-900 ring-2 ring-ink-850">
                  <Check size={12} strokeWidth={3} />
                </motion.span>
              )}
              <span className="flex h-8 items-center gap-1 [&>span]:h-7 [&>span]:min-w-0 [&>span]:scale-90">
                {m.logos.slice(0, 2).map((L, i) => (
                  <L key={i} />
                ))}
              </span>
              <span className={clsx('text-[12px] font-semibold leading-tight sm:text-[13px]', active ? 'text-white' : 'text-sand')}>
                <span className="sm:hidden">{m.short ?? m.label}</span>
                <span className="hidden sm:inline">{m.label}</span>
              </span>
            </button>
          );
        })}
      </div>

      {config && !live && (
        <div className="flex items-start gap-2.5 rounded-xl border border-gold/30 bg-gold/10 p-3.5 text-[12.5px] text-gold-pale">
          <Info size={17} className="mt-0.5 shrink-0" />
          <span>
            <b>Demo mode</b> — no real payment will be taken. Add your {method === 'paypal' ? 'PayPal' : 'Stripe'} API keys to <code className="rounded bg-ink-900/60 px-1">.env</code> to accept live payments.
          </span>
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-ink-750 p-4 sm:p-6">
        <AnimatePresence mode="wait">
          <motion.div key={method + Boolean(live)} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.25 }}>
            {config === undefined ? (
              <div className="flex items-center justify-center gap-2 py-10 text-sand">
                <Loader2 size={18} className="animate-spin text-gold" /> Loading payment options…
              </div>
            ) : (
              <Suspense fallback={<div className="py-10 text-center text-sand">Loading…</div>}>
                {live && method === 'paypal' && <PayPalPay clientId={config.paypal.clientId} {...shared} />}
                {live && method !== 'paypal' && <StripePay publishableKey={config.stripe.publishableKey} method={method} {...shared} />}
                {!live && <DemoPay method={method} {...shared} />}
              </Suspense>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-ink-900/50 p-4 text-[13px] text-sand">
        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 rounded accent-[#D4AF37]" />
        <span>
          I agree to the{' '}
          <Link to="/terms" target="_blank" className="font-semibold text-gold-bright underline-offset-2 hover:underline">
            booking terms
          </Link>{' '}
          and{' '}
          <Link to="/terms#cancellation" target="_blank" className="font-semibold text-gold-bright underline-offset-2 hover:underline">
            cancellation policy
          </Link>
          . Free cancellation up to 12 hours before pickup.
        </span>
      </label>

      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12px] text-slatey">
        <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-gold" /> PCI-DSS Level 1</span>
        <span className="flex items-center gap-1.5"><Lock size={14} className="text-gold" /> 3D Secure</span>
        <span>Powered by Stripe & PayPal</span>
      </div>

      <AnimatePresence>{processing && <Processing />}</AnimatePresence>
    </div>
  );
}
