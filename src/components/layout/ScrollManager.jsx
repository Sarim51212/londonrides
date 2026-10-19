import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Scroll to top on navigation, or to the #hash target once it has rendered. */
export default function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }
    let tries = 0;
    const seek = () => {
      const el = document.getElementById(hash.slice(1));
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else if (tries++ < 20) setTimeout(seek, 50);
    };
    seek();
  }, [pathname, hash]);
  return null;
}
