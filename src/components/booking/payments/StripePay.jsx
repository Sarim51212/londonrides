import { useEffect, useMemo, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, ExpressCheckoutElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Loader2, Lock } from 'lucide-react';
import ErrorBox from './ErrorBox.jsx';
import { api } from '../../../lib/api.js';
import { gbp } from '../../../lib/format.js';

const stripeCache = {};
const getStripe = (pk) => (stripeCache[pk] ??= loadStripe(pk));

// Matches the Obsidian & Gold design tokens.
const appearance = {
  theme: 'night',
  variables: {
    colorPrimary: '#D4AF37',
    colorBackground: '#090e1c',
    colorText: '#dee2f6',
    colorTextSecondary: '#94A3B8',
    colorDanger: '#ffb4ab',
    fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
    borderRadius: '12px',
    spacingUnit: '4px',
  },
  rules: {
    '.Input': { border: '1px solid rgba(255,255,255,0.1)', padding: '14px' },
    '.Input:focus': { border: '1px solid #D4AF37', boxShadow: '0 0 0 4px rgba(212,175,55,0.15)' },
    '.Label': { textTransform: 'uppercase', fontSize: '11px', fontWeight: '700', letterSpacing: '0.12em' },
    '.Tab': { border: '1px solid rgba(255,255,255,0.1)' },
    '.Tab--selected': { borderColor: '#D4AF37' },
  },
};

/**
 * Creates the PaymentIntent server-side (which re-prices the booking), then renders
 * either the card form or the Google Pay / Apple Pay express buttons.
 */
export default function StripePay({ publishableKey, payload, method, agreed, total, onPaid, onProcessing }) {
  const [intent, setIntent] = useState(null);
  const [error, setError] = useState('');
  const key = useMemo(() => JSON.stringify(payload), [payload]);

  useEffect(() => {
    let live = true;
    setIntent(null);
    setError('');
    api
      .stripeIntent(payload)
      .then((r) => live && setIntent(r))
      .catch((e) => live && setError(e.message));
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  if (error) return <ErrorBox message={error} />;
  if (!intent) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-ink-900/60 py-10 text-[14px] text-sand">
        <Loader2 size={18} className="animate-spin text-gold" /> Preparing secure checkout…
      </div>
    );
  }

  return (
    <Elements stripe={getStripe(publishableKey)} options={{ clientSecret: intent.clientSecret, appearance }}>
      {method === 'wallet' ? (
        <WalletButtons intent={intent} agreed={agreed} onPaid={onPaid} onProcessing={onProcessing} />
      ) : (
        <CardForm intent={intent} agreed={agreed} total={total} email={payload.passenger.email} onPaid={onPaid} onProcessing={onProcessing} />
      )}
    </Elements>
  );
}

const returnUrl = (ref) => `${window.location.origin}/booking/${ref}?provider=stripe`;

function CardForm({ intent, agreed, total, email, onPaid, onProcessing }) {
  const stripe = useStripe();
  const elements = useElements();
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const pay = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !agreed) return;
    setBusy(true);
    setError('');
    onProcessing(true);
    const { error: err, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl(intent.ref), receipt_email: email },
      redirect: 'if_required',
    });
    if (err) {
      setError(err.message);
      setBusy(false);
      onProcessing(false);
      return;
    }
    if (paymentIntent?.status === 'succeeded') {
      try {
        onPaid(await api.stripeConfirm(intent.ref));
      } catch (e2) {
        setError(e2.message);
        onProcessing(false);
      }
    }
    setBusy(false);
  };

  return (
    <form onSubmit={pay} className="space-y-4">
      <PaymentElement
        onReady={() => setReady(true)}
        options={{ layout: 'tabs', wallets: { applePay: 'never', googlePay: 'never' }, defaultValues: { billingDetails: { email } } }}
      />
      {error && <ErrorBox message={error} />}
      <button type="submit" disabled={!stripe || !ready || busy || !agreed} className="btn-gold shine w-full !min-h-[56px] text-[15px]">
        {busy ? <Loader2 size={18} className="animate-spin" /> : <Lock size={17} />}
        {busy ? 'Processing…' : `Pay ${gbp(total)} securely`}
      </button>
    </form>
  );
}

function WalletButtons({ intent, agreed, onPaid, onProcessing }) {
  const stripe = useStripe();
  const elements = useElements();
  const [available, setAvailable] = useState(null);
  const [error, setError] = useState('');

  const onConfirm = async () => {
    if (!stripe || !elements) return;
    onProcessing(true);
    const { error: err, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl(intent.ref) },
      redirect: 'if_required',
    });
    if (err) {
      setError(err.message);
      onProcessing(false);
      return;
    }
    if (paymentIntent?.status === 'succeeded') {
      try {
        onPaid(await api.stripeConfirm(intent.ref));
      } catch (e) {
        setError(e.message);
        onProcessing(false);
      }
    }
  };

  return (
    <div className="space-y-3">
      <div className={agreed ? '' : 'pointer-events-none opacity-40'} aria-disabled={!agreed}>
        <ExpressCheckoutElement
          onReady={({ availablePaymentMethods }) => setAvailable(Boolean(availablePaymentMethods && Object.values(availablePaymentMethods).some(Boolean)))}
          onConfirm={onConfirm}
          options={{
            paymentMethods: { googlePay: 'always', applePay: 'always', link: 'never', paypal: 'never', amazonPay: 'never' },
            buttonType: { googlePay: 'book', applePay: 'book' },
            buttonHeight: 52,
            layout: { maxColumns: 1, overflow: 'never' },
          }}
        />
      </div>
      {available === false && (
        <p className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-[13px] text-amber-200">
          Google Pay and Apple Pay are not available in this browser. Use Chrome with a saved Google Pay card, Safari on an Apple device, or pay by card.
        </p>
      )}
      {!agreed && <p className="text-center text-[12px] text-slatey">Accept the terms below to enable express checkout.</p>}
      {error && <ErrorBox message={error} />}
    </div>
  );
}

