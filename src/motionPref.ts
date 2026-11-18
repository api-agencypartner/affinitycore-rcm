'use client';
import { useSyncExternalStore } from 'react';

/**
 * One switch for "less motion" (WCAG 2.2.2 Pause, Stop, Hide and 2.3.3 Animation from Interactions).
 * Motion is off when the visitor's OS asks for reduced motion OR they press "Pause animations" on the site.
 * Autoplaying carousels, looping widgets, CSS animations and smooth scrolling all read this.
 */
const KEY = 'ac_motion_paused';
const subs = new Set<() => void>();
let paused = false;
let mq: MediaQueryList | null = null;

function init() {
  if (typeof window === 'undefined' || mq) return;
  mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  try { paused = localStorage.getItem(KEY) === '1'; } catch { /* storage blocked */ }
  apply();
  mq.addEventListener('change', () => { apply(); subs.forEach((f) => f()); });
}
function apply() {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('motion-off', isMotionOff());
}

/** True when animations should not run. Safe to call anywhere on the client. */
export function isMotionOff() {
  init();
  return paused || !!mq?.matches;
}
/** True only when the site toggle is on (for the toggle's own label). */
export function isPausedBySite() { init(); return paused; }

export function setMotionPaused(v: boolean) {
  init();
  paused = v;
  try { localStorage.setItem(KEY, v ? '1' : '0'); } catch { /* storage blocked */ }
  apply();
  subs.forEach((f) => f());
}

const subscribe = (f: () => void) => { init(); subs.add(f); return () => { subs.delete(f); }; };

/** React hook: re-renders when the preference changes. */
export function useMotionOff() {
  return useSyncExternalStore(subscribe, isMotionOff, () => false);
}
export function useSitePaused() {
  return useSyncExternalStore(subscribe, isPausedBySite, () => false);
}
