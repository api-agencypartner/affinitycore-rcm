'use client';
import { useEffect } from 'react';
import { Pause, Play } from 'lucide-react';
import { setMotionPaused, useSitePaused, useMotionOff } from '../motionPref';

/** Moves keyboard and screen-reader focus to the page's main content (WCAG 2.4.1 Bypass Blocks). */
export function focusMain() {
  const m = document.querySelector('main');
  if (!m) return;
  if (!m.hasAttribute('tabindex')) m.setAttribute('tabindex', '-1');
  m.scrollIntoView({ block: 'start' });
  (m as HTMLElement).focus({ preventScroll: true });
}

/** First things a keyboard user reaches: skip to content, and pause all motion. Hidden until focused. */
export function SkipLinks() {
  const paused = useSitePaused();
  const cls = 'a11y-skip';
  return (
    <div className="a11y-skips">
      <a href="#main" className={cls} onClick={(e) => { e.preventDefault(); focusMain(); }}>Skip to main content</a>
      <button type="button" className={cls} onClick={() => setMotionPaused(!paused)} aria-pressed={paused}>
        {paused ? 'Play animations' : 'Pause animations'}
      </button>
    </div>
  );
}

/** Visible toggle for the footer (WCAG 2.2.2 Pause, Stop, Hide). */
export function MotionToggle({ className = '' }: { className?: string }) {
  const paused = useSitePaused();
  const off = useMotionOff();
  const osReduced = off && !paused;
  return (
    <button type="button" className={`motion-toggle ${className}`} onClick={() => setMotionPaused(!paused)} aria-pressed={paused}
      title={osReduced ? 'Your device is set to reduce motion, so animations are already minimised.' : undefined}>
      {paused ? <Play size={14} aria-hidden /> : <Pause size={14} aria-hidden />}
      {paused ? 'Play animations' : 'Pause animations'}
    </button>
  );
}

/**
 * Dialog focus handling (WCAG 2.4.3, 2.1.2): moves focus into the dialog, keeps Tab inside it,
 * and puts focus back on whatever opened it when it closes.
 */
export function useDialogFocus(ref: React.RefObject<HTMLElement | null>, active = true) {
  useEffect(() => {
    if (!active) return;
    const back = document.activeElement as HTMLElement | null;
    const sel = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';
    const t = setTimeout(() => {
      const root = ref.current; if (!root) return;
      if (!root.contains(document.activeElement)) root.querySelector<HTMLElement>(sel)?.focus();
    }, 40);
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const root = ref.current; if (!root) return;
      const items = [...root.querySelectorAll<HTMLElement>(sel)].filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || !root.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (document.activeElement === last || !root.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => { clearTimeout(t); document.removeEventListener('keydown', onKey); if (back && document.contains(back)) back.focus({ preventScroll: true }); };
  }, [ref, active]);
}
