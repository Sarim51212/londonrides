import { useEffect } from 'react';

/** Sets document title + meta description per route. */
export default function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title ? `${title} | London Rides` : 'London Rides | Luxury Chauffeur & Airport Transfers';
    if (description) document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  }, [title, description]);
}
