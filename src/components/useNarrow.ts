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
