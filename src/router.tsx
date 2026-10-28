import { useEffect, useState, type ReactNode, type MouseEvent } from 'react';

/**
 * Tiny hash router so the prototype works as a single published file.
 * In Framer each route becomes a real page; links map 1:1 (#/services → /services).
 */
const read = () => {
  const h = window.location.hash.replace(/^#/, '');
  return h.startsWith('/') ? h.split('?')[0] : '/';
};

export function useRoute() {
  const [path, setPath] = useState(read);
  useEffect(() => {
    const on = () => setPath(read());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return path;
}

export const go = (to: string) => { window.location.hash = to; };

/* ---------- In-page anchors that also work across pages ----------
 * "#assessment" on the homepage scrolls there; from any other page it goes home first,
 * then scrolls once the homepage has mounted. */
let scroller: (el: Element) => void = (el) => el.scrollIntoView({ behavior: 'smooth', block: 'start' });
export const setScroller = (fn: (el: Element) => void) => { scroller = fn; };
let pending: string | null = null;
export const takePendingAnchor = () => { const p = pending; pending = null; return p; };
export function goAnchor(id: string) {
  const el = id ? document.getElementById(id) : null;
  if (el) { scroller(el); return; }
  if (read() !== '/') { pending = id || null; go('/'); return; }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
export function scrollToPending() {
  const id = takePendingAnchor();
  if (!id) return;
  const tryIt = (n: number) => { const el = document.getElementById(id); if (el) scroller(el); else if (n > 0) setTimeout(() => tryIt(n - 1), 150); };
  setTimeout(() => tryIt(10), 900);
}

/** Link for page routes ("/services") and in-page anchors ("#assessment"). */
export function Link({ to, children, className, onClick, ...rest }: {
  to: string; children: ReactNode; className?: string; onClick?: (e: MouseEvent) => void; [k: string]: unknown;
}) {
  const href = to.startsWith('/') ? `#${to}` : to;
  return (
    <a href={href} className={className} onClick={(e) => {
      onClick?.(e);
      if (!to.startsWith('/') && to.startsWith('#')) { e.preventDefault(); goAnchor(to.slice(1)); }
    }} {...rest}>{children}</a>
  );
}

export const slugify = (s: string) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
