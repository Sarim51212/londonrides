import { useEffect, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';

/** Animates a number from 0 (or the previous value) when it scrolls into view. */
export default function CountUp({ value, decimals = 0, prefix = '', suffix = '', duration = 1.6, className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? value : 0);
  const from = useRef(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) return setDisplay(value);
    const controls = animate(from.current, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v),
    });
    from.current = value;
    return () => controls.stop();
  }, [inView, value, duration, reduce]);

  const text = display.toLocaleString('en-GB', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return (
    <span ref={ref} className={className}>
      {prefix}
      {text}
      {suffix}
    </span>
  );
}
