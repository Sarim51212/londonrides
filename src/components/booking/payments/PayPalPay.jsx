import { useRef, useState } from 'react';
import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { Loader2 } from 'lucide-react';
import { api } from '../../../lib/api.js';
import ErrorBox from './ErrorBox.jsx';

function Buttons({ payload, agreed, total, onPaid, onProcessing }) {
  const [{ isPending }] = usePayPalScriptReducer();
  const [error, setError] = useState('');
  const ref = useRef(null);

  return (
    <div className="space-y-3">
      {isPending && (
        <div className="flex items-center justify-center gap-2 py-6 text-[14px] text-sand">
          <Loader2 size={18} className="animate-spin text-gold" /> Loading PayPal…
        </div>
      )}
      <div className="rounded-xl bg-white p-3">
        <PayPalButtons
          disabled={!agreed}
          forceReRender={[agreed, total]}
          style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay', height: 48 }}
          createOrder={async () => {
            setError('');
            const order = await api.paypalOrder(payload);
            ref.current = order.ref;
            return order.id;
          }}
          onApprove={async (data) => {
            onProcessing(true);
            try {
              onPaid(await api.paypalCapture(ref.current, data.orderID));
            } catch (e) {
              setError(e.message);
              onProcessing(false);
            }
          }}
          onError={(e) => setError(e?.message || 'PayPal could not complete the payment.')}
        />
      </div>
      {!agreed && <p className="text-center text-[12px] text-slatey">Accept the terms below to enable PayPal.</p>}
      {error && <ErrorBox message={error} />}
    </div>
  );
}

export default function PayPalPay({ clientId, ...props }) {
  return (
    <PayPalScriptProvider options={{ clientId, currency: 'GBP', intent: 'capture', components: 'buttons', enableFunding: 'paylater,card' }}>
      <Buttons {...props} />
    </PayPalScriptProvider>
  );
}
