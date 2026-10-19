// Lightweight brand marks for accepted payment methods.
import clsx from 'clsx';

const Box = ({ children, bg = 'bg-white', label }) => (
  <span role="img" aria-label={label} className={clsx('inline-flex h-8 min-w-[52px] items-center justify-center rounded-md px-2 shadow-sm', bg)}>
    {children}
  </span>
);

export const Visa = () => (
  <Box label="Visa">
    <span className="text-[15px] font-black italic tracking-tight text-[#1A1F71]">VISA</span>
  </Box>
);

export const Mastercard = () => (
  <Box label="Mastercard">
    <svg width="34" height="22" viewBox="0 0 34 22" aria-hidden>
      <circle cx="12" cy="11" r="10" fill="#EB001B" />
      <circle cx="22" cy="11" r="10" fill="#F79E1B" />
      <path d="M17 2.3a10 10 0 0 1 0 17.4a10 10 0 0 1 0-17.4z" fill="#FF5F00" />
    </svg>
  </Box>
);

export const Amex = () => (
  <Box label="American Express" bg="bg-[#2E77BC]">
    <span className="text-[11px] font-extrabold tracking-wide text-white">AMEX</span>
  </Box>
);

export const GooglePay = () => (
  <Box label="Google Pay">
    <span className="flex items-center gap-1 text-[14px] font-semibold text-[#3c4043]">
      <svg width="15" height="15" viewBox="0 0 48 48" aria-hidden>
        <path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h11.8c-.5 2.8-2.1 5.1-4.4 6.7v5.6h7.1c4.2-3.9 6.6-9.6 6.6-16.3z" />
        <path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.3l-7.1-5.6c-2 1.3-4.5 2.1-7.4 2.1-5.7 0-10.5-3.8-12.2-9H4.5v5.7C8.1 41 15.5 46 24 46z" />
        <path fill="#FBBC05" d="M11.8 28.2c-.4-1.3-.7-2.7-.7-4.2s.3-2.9.7-4.2v-5.7H4.5A22 22 0 0 0 2 24c0 3.6.9 6.9 2.5 9.9l7.3-5.7z" />
        <path fill="#EA4335" d="M24 10.8c3.2 0 6.1 1.1 8.4 3.3l6.3-6.3C34.9 4.2 29.9 2 24 2 15.5 2 8.1 7 4.5 14.1l7.3 5.7c1.7-5.2 6.5-9 12.2-9z" />
      </svg>
      Pay
    </span>
  </Box>
);

export const ApplePay = () => (
  <Box label="Apple Pay" bg="bg-black ring-1 ring-white/20">
    <span className="flex items-center gap-0.5 text-[14px] font-semibold text-white">
      <svg width="12" height="14" viewBox="0 0 17 20" fill="currentColor" aria-hidden>
        <path d="M14.1 10.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9C3.6 4.8 2 5.8 1.1 7.4c-1.8 3.2-.5 7.9 1.3 10.5.9 1.3 1.9 2.7 3.3 2.6 1.3-.1 1.8-.8 3.4-.8s2 .8 3.4.8c1.4 0 2.3-1.3 3.2-2.6 1-1.5 1.4-2.9 1.4-3-.1 0-2.9-1.1-3-4.3zM11.6 3c.7-.9 1.2-2.1 1.1-3.3-1 0-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.2 1.1.1 2.3-.6 3-1.5z" />
      </svg>
      Pay
    </span>
  </Box>
);

export const PayPal = () => (
  <Box label="PayPal">
    <span className="text-[14px] font-extrabold italic">
      <span className="text-[#003087]">Pay</span>
      <span className="text-[#009CDE]">Pal</span>
    </span>
  </Box>
);

export const Stripe = () => (
  <Box label="Stripe" bg="bg-[#635BFF]">
    <span className="text-[13px] font-bold tracking-tight text-white">stripe</span>
  </Box>
);

export default function PaymentLogos({ className, withStripe = false }) {
  return (
    <div className={clsx('flex flex-wrap items-center gap-2', className)}>
      <Visa />
      <Mastercard />
      <Amex />
      <GooglePay />
      <ApplePay />
      <PayPal />
      {withStripe && <Stripe />}
    </div>
  );
}
