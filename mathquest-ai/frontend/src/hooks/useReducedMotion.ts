import { useState, useEffect } from 'react';

export function useReducedMotion() {
  const [appReducedMotion, setAppReducedMotion] = useState<boolean>(() => {
    const saved = localStorage.getItem('mathquest_reduced_motion');
    if (saved !== null) return saved === 'true';
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('mathquest_reduced_motion', String(appReducedMotion));
  }, [appReducedMotion]);

  const toggleReducedMotion = () => {
    setAppReducedMotion((prev) => !prev);
  };

  return { reducedMotion: appReducedMotion, toggleReducedMotion };
}
