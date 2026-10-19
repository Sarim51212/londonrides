import { motion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

export const stagger = (gap = 0.08, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
});

/** Fades + lifts its children into view once, as they scroll on screen. */
export function Reveal({ as = 'div', delay = 0, y = 28, className, children, ...rest }) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease }}
      {...rest}
    >
      {children}
    </Comp>
  );
}

/** Staggers direct <RevealItem> children. */
export function RevealGroup({ as = 'div', gap = 0.08, delay = 0, className, children, ...rest }) {
  const Comp = motion[as];
  return (
    <Comp className={className} variants={stagger(gap, delay)} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} {...rest}>
      {children}
    </Comp>
  );
}

export function RevealItem({ as = 'div', className, children, ...rest }) {
  const Comp = motion[as];
  return (
    <Comp className={className} variants={fadeUp} {...rest}>
      {children}
    </Comp>
  );
}
