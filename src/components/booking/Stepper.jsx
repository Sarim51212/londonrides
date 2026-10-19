import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import clsx from 'clsx';

export default function Stepper({ steps, current, onJump }) {
  const idx = steps.findIndex((s) => s.id === current);
  return (
    <nav aria-label="Booking progress" className="mb-6 md:mb-8">
      <ol className="flex items-center">
        {steps.map((s, i) => {
          const done = i < idx;
          const active = i === idx;
          return (
            <li key={s.id} className={clsx('flex items-center', i < steps.length - 1 && 'flex-1')}>
              <button
                type="button"
                disabled={!done}
                onClick={() => onJump(s.id)}
                className="group flex items-center gap-2.5 disabled:cursor-default"
                aria-current={active ? 'step' : undefined}
              >
                <span
                  className={clsx(
                    'relative grid h-9 w-9 shrink-0 place-items-center rounded-full border text-[13px] font-bold transition-all duration-500',
                    done && 'border-gold bg-gold text-ink-900 group-hover:bg-gold-bright',
                    active && 'border-gold bg-ink-900 text-gold-bright shadow-[0_0_0_4px_rgba(212,175,55,0.15)]',
                    !done && !active && 'border-white/15 bg-ink-800 text-slatey',
                  )}
                >
                  {done ? (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <Check size={16} strokeWidth={3} />
                    </motion.span>
                  ) : (
                    i + 1
                  )}
                </span>
                <span className={clsx('text-[13px] font-semibold', active ? 'text-white' : done ? 'text-sand' : 'text-slatey', active ? 'block' : 'hidden md:block')}>{s.label}</span>
              </button>
              {i < steps.length - 1 && (
                <span className="mx-2 h-px flex-1 overflow-hidden bg-white/10 md:mx-4">
                  <motion.span className="block h-full origin-left bg-gradient-to-r from-gold to-gold-bright" initial={false} animate={{ scaleX: done ? 1 : 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} />
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
