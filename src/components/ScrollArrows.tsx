'use client';
import { useEffect, useState, type RefObject } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Prev/next arrows for a horizontally scrolling row (chapter chips, filter chips, page contents).
 * Renders nothing while the row fits on screen, so on desktop layouts where the row wraps or stacks
 * the arrows simply don't appear. Each arrow is disabled at its end of the row.
 * Same 40px circle style as the States hub region arrows.
 */
export function ScrollArrows({ target, label, className = '' }: { target: RefObject<HTMLElement | null>; label: string; className?: string }) {
  const [st, setSt] = useState({ can: false, start: true, end: false });
  useEffect(() => {
    const el = target.current; if (!el) return;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      // Only rows that are set to scroll sideways at this breakpoint (desktop lists stack or wrap instead)
      const ox = getComputedStyle(el).overflowX;
      setSt({ can: (ox === 'auto' || ox === 'scroll') && max > 2, start: el.scrollLeft <= 2, end: el.scrollLeft >= max - 2 });
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => { el.removeEventListener('scroll', update); ro.disconnect(); };
  }, [target]);
  if (!st.can) return null;
  const by = (d: number) => { const el = target.current; if (el) el.scrollBy({ left: d * Math.max(160, el.clientWidth * 0.7), behavior: 'smooth' }); };
  const btn = '[width:40px] [height:40px] [flex:none] [border-radius:50%] [display:grid] [place-items:center] [background:#fff] [border:1px_solid_#e4e0f2] [color:var(--purple)] [transition:background_0.3s,_color_0.3s,_opacity_0.3s] [&:hover:not(:disabled)]:[background:var(--purple)] [&:hover:not(:disabled)]:[color:#fff] [&:disabled]:[opacity:0.4] [&:disabled]:[cursor:default]';
  return (
    <div className={`sarrows [display:flex] [gap:0.6rem] [flex:none] ${className}`} role="group" aria-label={`Scroll ${label}`}>
      <button type="button" className={btn} onClick={() => by(-1)} disabled={st.start} aria-label={`Scroll ${label} left`}><ChevronLeft size={18} /></button>
      <button type="button" className={btn} onClick={() => by(1)} disabled={st.end} aria-label={`Scroll ${label} right`}><ChevronRight size={18} /></button>
    </div>
  );
}
