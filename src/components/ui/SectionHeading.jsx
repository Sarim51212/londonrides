import clsx from 'clsx';
import { Reveal } from './Reveal.jsx';

export default function SectionHeading({ eyebrow, title, text, center = false, className, children }) {
  return (
    <div className={clsx('mb-10 flex flex-col gap-5 md:mb-14', center ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between', className)}>
      <Reveal className={clsx(center && 'max-w-2xl')}>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2 className="h-section">{title}</h2>
        {text && <p className={clsx('mt-3 max-w-xl text-[15px] leading-relaxed text-sand', center && 'mx-auto')}>{text}</p>}
      </Reveal>
      {children && <Reveal delay={0.1}>{children}</Reveal>}
    </div>
  );
}
