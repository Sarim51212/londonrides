import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plane, Train, Ship, Building2, MapPin, Landmark, Loader2, X } from 'lucide-react';
import clsx from 'clsx';
import { searchLocations } from '../../data/locations.js';
import { geocode } from '../../lib/geocode.js';
import { toPlace } from '../../context/BookingContext.jsx';

const TYPE_ICON = { airport: Plane, fbo: Plane, station: Train, port: Ship, hotel: Building2, landmark: Landmark };

export default function LocationInput({ label, icon: Icon = MapPin, value, onChange, placeholder, variant = 'dark', error, autoFocus }) {
  const id = useId();
  const [text, setText] = useState(value?.label ?? '');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [remote, setRemote] = useState([]);
  const [loading, setLoading] = useState(false);
  const wrap = useRef(null);
  const input = useRef(null);

  // Sync from outside changes (swap, prefill) — but never wipe what the user is typing.
  useEffect(() => {
    if (value) setText(value.label);
  }, [value]);

  // Debounced address search for anything not in our curated list.
  useEffect(() => {
    if (!open || text === value?.label || text.trim().length < 3) return setRemote([]);
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        setRemote(await geocode(text, ctrl.signal));
      } catch {
        /* offline or aborted */
      } finally {
        setLoading(false);
      }
    }, 320);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [text, open, value?.label]);

  useEffect(() => {
    const close = (e) => !wrap.current?.contains(e.target) && setOpen(false);
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, []);

  const local = searchLocations(text === value?.label ? '' : text);
  const options = [...local, ...remote.filter((r) => !local.some((l) => l.name === r.name))].slice(0, 9);

  const choose = (loc) => {
    const place = loc.type === 'address' ? { id: loc.id, label: loc.name, sub: loc.sub, lat: loc.lat, lng: loc.lng, type: 'address' } : toPlace(loc);
    onChange(place);
    setText(place.label);
    setOpen(false);
    input.current?.blur();
  };

  const onKey = (e) => {
    if (!open && ['ArrowDown', 'ArrowUp'].includes(e.key)) setOpen(true);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(options.length - 1, a + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === 'Enter' && open && options[active]) {
      e.preventDefault();
      choose(options[active]);
    } else if (e.key === 'Escape') setOpen(false);
  };

  const light = variant === 'light';

  return (
    <div ref={wrap} className="relative">
      <label
        htmlFor={id}
        className={clsx(
          'flex cursor-text flex-col rounded-xl border px-3.5 py-2.5 transition-all',
          light ? 'border-slate-200 bg-slate-100 hover:bg-slate-200/70' : 'border-white/10 bg-ink-900/70 hover:border-white/20',
          open && (light ? 'border-slate-400 bg-white ring-4 ring-slate-900/5' : 'border-gold ring-4 ring-gold/15'),
          error && 'border-red-400 ring-2 ring-red-400/20',
        )}
      >
        <span className={clsx('text-[10.5px] font-bold uppercase tracking-[0.12em]', light ? 'text-slate-500' : 'text-slatey')}>{label}</span>
        <span className="mt-0.5 flex items-center gap-2">
          <Icon size={18} className={clsx('shrink-0', light ? 'text-slate-700' : 'text-gold')} />
          <input
            ref={input}
            id={id}
            role="combobox"
            aria-label={label}
            aria-expanded={open}
            aria-controls={`${id}-list`}
            aria-autocomplete="list"
            autoComplete="off"
            autoFocus={autoFocus}
            value={text}
            placeholder={placeholder}
            onFocus={(e) => {
              setOpen(true);
              setActive(0);
              e.target.select();
            }}
            onChange={(e) => {
              setText(e.target.value);
              setOpen(true);
              setActive(0);
              if (value) onChange(null);
            }}
            onKeyDown={onKey}
            className={clsx(
              'w-full min-w-0 truncate border-0 bg-transparent p-0 text-[15px] font-medium focus:outline-none focus:ring-0',
              light ? 'text-slate-900 placeholder:text-slate-400' : 'text-white placeholder:text-slatey/60',
            )}
          />
          {loading && <Loader2 size={16} className="shrink-0 animate-spin text-slatey" />}
          {text && !loading && (
            <button
              type="button"
              aria-label={`Clear ${label}`}
              onClick={() => {
                setText('');
                onChange(null);
                input.current?.focus();
              }}
              className={clsx('grid h-6 w-6 shrink-0 place-items-center rounded-full', light ? 'text-slate-400 hover:bg-slate-200' : 'text-slatey hover:bg-white/10')}
            >
              <X size={14} />
            </button>
          )}
        </span>
      </label>

      <AnimatePresence>
        {open && options.length > 0 && (
          <motion.ul
            id={`${id}-list`}
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 right-0 top-[calc(100%+6px)] z-[60] max-h-[min(340px,50vh)] min-w-[280px] overflow-y-auto overscroll-contain rounded-xl border border-white/10 bg-obsidian/95 p-1.5 shadow-elevated backdrop-blur-2xl"
          >
            {options.map((o, i) => {
              const TIcon = TYPE_ICON[o.type] ?? MapPin;
              return (
                <li key={o.id} role="option" aria-selected={i === active}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => choose(o)}
                    className={clsx('flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors', i === active ? 'bg-ink-700' : 'hover:bg-ink-700/60')}
                  >
                    <span className={clsx('grid h-9 w-9 shrink-0 place-items-center rounded-lg', o.type === 'airport' || o.type === 'fbo' ? 'bg-gold/15 text-gold-bright' : 'bg-white/5 text-sand')}>
                      <TIcon size={17} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] font-semibold text-white">{o.name}</span>
                      <span className="block truncate text-[12px] text-slatey">{o.sub}</span>
                    </span>
                    {o.code && <span className="rounded bg-gold/15 px-1.5 py-0.5 text-[10px] font-bold text-gold-bright">{o.code}</span>}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
      {error && <p className="mt-1 text-[12px] text-red-300">{error}</p>}
    </div>
  );
}
