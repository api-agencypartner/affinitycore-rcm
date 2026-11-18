'use client';
import { useEffect, useState } from 'react';
/** True below `px` wide; used to swap long placeholders for short ones on phones. */
export function useNarrow(px = 640) {
  const [n, setN] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${px}px)`);
    const on = () => setN(mq.matches); on();
    mq.addEventListener('change', on); return () => mq.removeEventListener('change', on);
  }, [px]);
  return n;
}

/** True on touch-first screens (phones, iPad), so "Hover…" hints can say "Tap…" instead. */
export function useTouch() {
  const [t, setT] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(hover: none), (pointer: coarse)');
    const on = () => setT(mq.matches); on();
    mq.addEventListener('change', on); return () => mq.removeEventListener('change', on);
  }, []);
  return t;
}
