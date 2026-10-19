import { useState } from 'react';
import { CreditCard, Lock, CalendarDays, KeyRound } from 'lucide-react';
import { api } from '../../../lib/api.js';
import { quote } from '../../../lib/pricing.js';
import { gbp } from '../../../lib/format.js';
import ErrorBox from './ErrorBox.jsx';

const fmtCard = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
const fmtExp = (v) => v.replace(/\D/g, '').slice(0, 4).replace(/^(\d{2})(\d)/, '$1 / $2');

/** Offline record so the demo still completes when the API isn't running (e.g. static preview). */
function localRecord(payload, method) {
  const q = quote(payload);
  const ref = 'LR-DEMO' + Math.random().toString(36).slice(2, 6).toUpperCase();
  return { ref, status: 'confirmed', paymentMethod: method, demo: true, local: true, total: q.total, currency: 'GBP', lines: q.lines, miles: q.miles, minutes: q.minutes, booking: payload, createdAt: new Date().toISOString() };
}

/**
 * Simulated checkout used when Stripe / PayPal keys aren't configured.
 * Mirrors the live UI so the full journey can be tested end to end.
 */
export default function DemoPay({ method, payload, agreed, total, onPaid, onProcessing }) {
  const [card, setCard] = useState({ number: '4242 4242 4242 4242', exp: '12 / 30', cvc: '123', name: payload.passenger.name });
  const [error, setError] = useState('');

  const pay = async (m) => {
    if (!agreed) return setError('Please accept the booking terms first.');
    if (m === 'card' && (card.number.replace(/\s/g, '').length < 15 || card.exp.length < 7 || card.cvc.length < 3)) return setError('Please complete your card details.');
    setError('');
    onProcessing(true);
    await new Promise((r) => setTimeout(r, 1400));
    try {
      onPaid(await api.demoPay(payload, m));
    } catch (e) {
      if (e.offline) return onPaid(localRecord(payload, m));
      setError(e.message);
      onProcessing(false);
    }
  };

  if (method === 'wallet') {
    return (
      <div className="space-y-3">
        <button type="button" onClick={() => pay('google_pay')} className="flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-black text-[16px] font-medium text-white ring-1 ring-white/15 transition hover:bg-neutral-900 active:scale-[0.98]">
          Book with
          <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden>
            <path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h11.8c-.5 2.8-2.1 5.1-4.4 6.7v5.6h7.1c4.2-3.9 6.6-9.6 6.6-16.3z" />
            <path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.3l-7.1-5.6c-2 1.3-4.5 2.1-7.4 2.1-5.7 0-10.5-3.8-12.2-9H4.5v5.7C8.1 41 15.5 46 24 46z" />
            <path fill="#FBBC05" d="M11.8 28.2c-.4-1.3-.7-2.7-.7-4.2s.3-2.9.7-4.2v-5.7H4.5A22 22 0 0 0 2 24c0 3.6.9 6.9 2.5 9.9l7.3-5.7z" />
            <path fill="#EA4335" d="M24 10.8c3.2 0 6.1 1.1 8.4 3.3l6.3-6.3C34.9 4.2 29.9 2 24 2 15.5 2 8.1 7 4.5 14.1l7.3 5.7c1.7-5.2 6.5-9 12.2-9z" />
          </svg>
          <span className="font-semibold">Pay</span>
        </button>
        <button type="button" onClick={() => pay('apple_pay')} className="flex h-[52px] w-full items-center justify-center gap-1.5 rounded-xl bg-white text-[16px] font-medium text-black transition hover:bg-neutral-100 active:scale-[0.98]">
          Book with
          <svg width="16" height="19" viewBox="0 0 17 20" fill="currentColor" aria-hidden>
            <path d="M14.1 10.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9C3.6 4.8 2 5.8 1.1 7.4c-1.8 3.2-.5 7.9 1.3 10.5.9 1.3 1.9 2.7 3.3 2.6 1.3-.1 1.8-.8 3.4-.8s2 .8 3.4.8c1.4 0 2.3-1.3 3.2-2.6 1-1.5 1.4-2.9 1.4-3-.1 0-2.9-1.1-3-4.3zM11.6 3c.7-.9 1.2-2.1 1.1-3.3-1 0-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.2 1.1.1 2.3-.6 3-1.5z" />
          </svg>
          <span className="font-semibold">Pay</span>
        </button>
        {error && <ErrorBox message={error} />}
      </div>
    );
  }

  if (method === 'paypal') {
    return (
      <div className="space-y-3">
        <button type="button" aria-label="Pay with PayPal" onClick={() => pay('paypal')} className="flex h-[52px] w-full items-center justify-center rounded-xl bg-[#FFC439] text-[19px] font-extrabold italic transition hover:brightness-95 active:scale-[0.98]">
          <span className="text-[#003087]">Pay</span>
          <span className="text-[#009CDE]">Pal</span>
        </button>
        <button type="button" onClick={() => pay('paypal')} className="flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#2C2E2F] text-[15px] font-semibold text-white transition hover:bg-black active:scale-[0.98]">
          <CreditCard size={18} /> Debit or Credit Card
        </button>
        <p className="text-center text-[12px] text-slatey">Pay in 3 interest-free payments available with PayPal.</p>
        {error && <ErrorBox message={error} />}
      </div>
    );
  }

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        pay('card');
      }}
    >
      <div>
        <label className="label" htmlFor="cc-number">Card number</label>
        <div className="relative">
          <CreditCard size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gold" />
          <input id="cc-number" inputMode="numeric" autoComplete="cc-number" className="field w-full pl-10 tracking-wider" value={card.number} onChange={(e) => setCard({ ...card, number: fmtCard(e.target.value) })} placeholder="1234 1234 1234 1234" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label" htmlFor="cc-exp">Expiry</label>
          <div className="relative">
            <CalendarDays size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gold" />
            <input id="cc-exp" inputMode="numeric" autoComplete="cc-exp" className="field w-full pl-10" value={card.exp} onChange={(e) => setCard({ ...card, exp: fmtExp(e.target.value) })} placeholder="MM / YY" />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="cc-cvc">CVC</label>
          <div className="relative">
            <KeyRound size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gold" />
            <input id="cc-cvc" inputMode="numeric" autoComplete="cc-csc" className="field w-full pl-10" value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })} placeholder="123" />
          </div>
        </div>
      </div>
      <div>
        <label className="label" htmlFor="cc-name">Name on card</label>
        <input id="cc-name" autoComplete="cc-name" className="field w-full" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} />
      </div>
      {error && <ErrorBox message={error} />}
      <button type="submit" className="btn-gold shine w-full !min-h-[56px] text-[15px]">
        <Lock size={17} /> Pay {gbp(total)} securely
      </button>
    </form>
  );
}
