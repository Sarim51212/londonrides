import { Lock, ShieldCheck, Receipt } from 'lucide-react';
import { Reveal } from '../ui/Reveal.jsx';
import PaymentLogos from '../ui/PaymentLogos.jsx';

export default function PaymentBand() {
  return (
    <section className="bg-ink-900 py-12">
      <div className="container-site">
        <Reveal className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-hairline bg-gradient-to-r from-ink-750 via-ink-800 to-ink-750 p-6 text-center md:p-8 lg:flex-row lg:text-left">
          <div>
            <span className="eyebrow">Secure Checkout</span>
            <h3 className="font-display text-[24px] font-semibold text-cream md:text-[28px]">Pay your way — safely</h3>
            <p className="mt-2 max-w-lg text-[14px] text-sand">Cards, Google Pay, Apple Pay and PayPal, processed by Stripe and PayPal. Your card details never touch our servers.</p>
            <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[12px] text-slatey lg:justify-start">
              <span className="flex items-center gap-1.5"><Lock size={14} className="text-gold" /> 256-bit SSL</span>
              <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-gold" /> 3D Secure / SCA</span>
              <span className="flex items-center gap-1.5"><Receipt size={14} className="text-gold" /> Instant VAT receipt</span>
            </div>
          </div>
          <PaymentLogos withStripe className="max-w-sm justify-center lg:justify-end" />
        </Reveal>
      </div>
    </section>
  );
}
