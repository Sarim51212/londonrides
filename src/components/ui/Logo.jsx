import { Link } from 'react-router-dom';
import clsx from 'clsx';

export default function Logo({ className, compact = false }) {
  return (
    <Link to="/" className={clsx('group flex items-center gap-2.5', className)} aria-label="London Rides home">
      <img
        src="/images/logo.webp"
        alt=""
        width="480"
        height="320"
        className={clsx('w-auto object-contain mix-blend-screen transition-transform duration-500 group-hover:scale-105', compact ? 'h-10' : 'h-12 md:h-14')}
      />
      <span className="sr-only">London Rides</span>
    </Link>
  );
}
