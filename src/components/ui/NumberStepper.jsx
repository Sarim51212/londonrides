import { Minus, Plus } from 'lucide-react';

export default function NumberStepper({ value, onChange, min = 0, max = 16, label, icon: Icon, dark = true }) {
  const set = (n) => onChange(Math.min(max, Math.max(min, n)));
  const btn = dark
    ? 'border-white/10 bg-ink-700 text-cream hover:border-gold/50 hover:text-gold-bright'
    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400';
  return (
    <div className="flex items-center justify-between gap-3">
      {label && (
        <span className={`flex items-center gap-2 text-[14px] font-medium ${dark ? 'text-cream' : 'text-slate-700'}`}>
          {Icon && <Icon size={18} className={dark ? 'text-gold' : 'text-slate-500'} />}
          {label}
        </span>
      )}
      <div className="flex items-center gap-2">
        <button type="button" aria-label={`Decrease ${label}`} disabled={value <= min} onClick={() => set(value - 1)} className={`grid h-10 w-10 place-items-center rounded-lg border transition disabled:opacity-30 ${btn}`}>
          <Minus size={16} />
        </button>
        <span className={`w-7 text-center text-[16px] font-bold tabular-nums ${dark ? 'text-white' : 'text-slate-900'}`} aria-live="polite">
          {value}
        </span>
        <button type="button" aria-label={`Increase ${label}`} disabled={value >= max} onClick={() => set(value + 1)} className={`grid h-10 w-10 place-items-center rounded-lg border transition disabled:opacity-30 ${btn}`}>
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
