import { Star } from 'lucide-react';

export default function Stars({ size = 16, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-0.5 text-star ${className}`} aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={size} fill="currentColor" strokeWidth={0} />
      ))}
    </span>
  );
}
