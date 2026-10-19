import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ChevronUp, X } from 'lucide-react';
import Stepper from '../components/booking/Stepper.jsx';
import Summary, { PriceLines, TripDetails } from '../components/booking/Summary.jsx';
import JourneyForm, { validateJourney } from '../components/booking/JourneyForm.jsx';
import StepVehicle from '../components/booking/StepVehicle.jsx';
import StepDetails, { validateDetails } from '../components/booking/StepDetails.jsx';
import StepPayment from '../components/booking/StepPayment.jsx';
import { useBooking } from '../context/BookingContext.jsx';
import { vehicleById } from '../data/vehicles.js';
import { byId } from '../data/locations.js';
import { toPlace } from '../context/BookingContext.jsx';
import { rememberBooking } from '../lib/booking.js';
import { gbp } from '../lib/format.js';
import usePageMeta from '../lib/usePageMeta.js';

const STEPS = [
  { id: 'journey', label: 'Journey' },
  { id: 'vehicle', label: 'Vehicle' },
  { id: 'details', label: 'Details' },
  { id: 'payment', label: 'Payment' },
];

/** First step whose prerequisites are missing — stops deep links skipping ahead. */
function firstIncomplete(b) {
  if (Object.keys(validateJourney(b)).length) return 'journey';
  const v = vehicleById[b.vehicleId];
  if (!v || v.passengers < b.passengers || v.suitcases < b.luggage) return 'vehicle';
  if (Object.keys(validateDetails(b)).length) return 'details';
  return 'payment';
}

export default function Book() {
  usePageMeta('Book Your Chauffeur', 'Get an instant fixed fare and book your London chauffeur or airport transfer in under 60 seconds.');
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { booking: b, update, quote } = useBooking();
  const [sheet, setSheet] = useState(false);
  const details = useRef(null);
  const dir = useRef(1);

  // Prefill from links like /book?type=hourly or /book?to=sou
  useEffect(() => {
    const patch = {};
    if (['oneway', 'return', 'hourly'].includes(params.get('type'))) patch.journeyType = params.get('type');
    if (byId[params.get('to')]) patch.dropoff = toPlace(byId[params.get('to')]);
    if (byId[params.get('from')]) patch.pickup = toPlace(byId[params.get('from')]);
    if (Object.keys(patch).length) {
      update(patch);
      setParams({}, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requested = STEPS.some((s) => s.id === params.get('step')) ? params.get('step') : 'journey';
  const limit = firstIncomplete(b);
  const step = STEPS.findIndex((s) => s.id === requested) > STEPS.findIndex((s) => s.id === limit) ? limit : requested;
  const index = STEPS.findIndex((s) => s.id === step);

  const go = (id) => {
    dir.current = STEPS.findIndex((s) => s.id === id) >= index ? 1 : -1;
    setParams({ step: id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const next = () => {
    if (step === 'journey') go('vehicle');
    else if (step === 'vehicle' && limit !== 'vehicle' && limit !== 'journey') go('details');
    else if (step === 'details' && details.current?.validate()) go('payment');
  };

  const onPaid = (record) => {
    rememberBooking(record);
    update({ vehicleId: null, flightNumber: '', returnDatetime: '' });
    navigate(`/booking/${record.ref}`, { state: { record } });
  };

  const canContinue = step === 'journey' || (step === 'vehicle' && quote && limit !== 'vehicle') || step === 'details';

  return (
    <div className="min-h-screen bg-ink-850 pb-40 pt-24 md:pt-28 lg:pb-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.12),transparent_60%)]" />
      <div className="container-site relative">
        <Stepper steps={STEPS} current={step} onJump={go} />
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-7 xl:col-span-8">
            <AnimatePresence mode="wait" custom={dir.current}>
              <motion.div
                key={step}
                custom={dir.current}
                variants={{
                  enter: (d) => ({ opacity: 0, x: d * 40 }),
                  center: { opacity: 1, x: 0 },
                  exit: (d) => ({ opacity: 0, x: d * -40 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {step === 'journey' && (
                  <div className="space-y-5">
                    <div>
                      <h1 className="font-display text-[28px] font-semibold text-cream md:text-[34px]">Where can we take you?</h1>
                      <p className="text-[14px] text-sand">Instant fixed fares for any address in the UK.</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-ink-750 p-4 sm:p-6">
                      <JourneyForm variant="panel" submitLabel="See Vehicles & Prices" onSubmit={() => go('vehicle')} />
                    </div>
                  </div>
                )}
                {step === 'vehicle' && <StepVehicle onNext={() => go('details')} />}
                {step === 'details' && <StepDetails ref={details} />}
                {step === 'payment' && quote && <StepPayment onPaid={onPaid} />}
              </motion.div>
            </AnimatePresence>

            {/* Desktop nav buttons */}
            {step !== 'journey' && (
              <div className="mt-8 hidden items-center justify-between lg:flex">
                <button type="button" onClick={() => go(STEPS[index - 1].id)} className="btn-dark">
                  <ArrowLeft size={16} /> Back
                </button>
                {step !== 'payment' && (
                  <button type="button" onClick={next} disabled={!canContinue} className="btn-gold shine !px-8">
                    Continue <ArrowRight size={16} />
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="hidden lg:col-span-5 lg:block xl:col-span-4">
            <Summary />
          </div>
        </div>
      </div>

      {/* Mobile bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink-900/95 px-4 pt-3 shadow-[0_-10px_30px_rgba(0,0,0,0.6)] backdrop-blur-xl pb-safe lg:hidden">
        <div className="flex items-center gap-3">
          {index > 0 && (
            <button type="button" onClick={() => go(STEPS[index - 1].id)} aria-label="Back" className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-white/10 bg-ink-700 text-cream">
              <ArrowLeft size={19} />
            </button>
          )}
          <button type="button" onClick={() => setSheet(true)} className="min-w-0 flex-1 text-left">
            <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slatey">
              {quote ? 'Total fixed fare' : 'Your journey'} <ChevronUp size={14} />
            </span>
            <span className="block truncate text-[20px] font-bold text-white">{quote ? gbp(quote.total) : b.pickup?.label ?? 'Add details'}</span>
          </button>
          {step !== 'payment' && (
            <button type="button" onClick={step === 'journey' ? () => document.querySelector('form button[type=submit]')?.click() : next} disabled={!canContinue} className="btn-gold shine shrink-0 !px-5">
              Continue <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Mobile summary sheet */}
      <AnimatePresence>
        {sheet && (
          <motion.div className="fixed inset-0 z-[80] lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/70" onClick={() => setSheet(false)} />
            <motion.div
              role="dialog"
              aria-label="Journey summary"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.6 }}
              onDragEnd={(_, i) => i.offset.y > 100 && setSheet(false)}
              className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl border-t border-hairline bg-ink-800 p-5 pb-safe"
            >
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/20" />
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-[20px] text-white">Your journey</h3>
                <button type="button" onClick={() => setSheet(false)} aria-label="Close" className="grid h-10 w-10 place-items-center rounded-full bg-ink-700">
                  <X size={18} />
                </button>
              </div>
              {quote && (
                <div className="mb-4 flex items-center gap-3 rounded-xl bg-ink-700/60 p-2.5">
                  <img src={quote.vehicle.image} alt="" className="h-14 w-20 rounded-lg object-cover" />
                  <div>
                    <div className="font-semibold text-white">{quote.vehicle.name}</div>
                    <div className="text-[12px] text-gold-muted">{quote.vehicle.model}</div>
                  </div>
                </div>
              )}
              <TripDetails booking={b} />
              <div className="mt-5 border-t border-white/10 pt-4">
                <PriceLines quote={quote} />
              </div>
              {quote && (
                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="text-label-caps uppercase text-slatey">Total · fixed</span>
                  <span className="font-display text-[28px] font-bold text-gold-bright">{gbp(quote.total)}</span>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
