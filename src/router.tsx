'use client';
import { type ReactNode, type MouseEvent } from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Routing helpers on top of Next.js (App Router, static export).
 * Pages live at real URLs (/services/medical-coding). In-page anchors ("#assessment") still work from any page:
 * on the homepage they scroll; elsewhere they go home first and scroll once it has mounted.
 */
export const BASE = process.env.NEXT_PUBLIC_BASE ?? '';
/** Prefix a site path with the deploy base path, for plain <a href> (Next's <Link> adds it itself). */
export const u = (to: string) => (to.startsWith('/') ? `${BASE}${to}` : to);
const strip = (p: string) => (BASE && p.startsWith(BASE) ? p.slice(BASE.length) || '/' : p);
const norm = (p: string) => (p.length > 1 ? p.replace(/\/+$/, '') : p);

/** Current route path without base path or trailing slash, e.g. "/states/texas". */
export function useRoute() {
  return norm(usePathname() || '/');
}

/* Navigation is wired by the shell (it owns the Next router). */
let pushImpl: (to: string) => void = (to) => { window.location.href = u(to); };
export const setPush = (fn: (to: string) => void) => { pushImpl = fn; };
export const go = (to: string) => pushImpl(to);

let scroller: (el: Element) => void = (el) => el.scrollIntoView({ behavior: 'smooth', block: 'start' });
export const setScroller = (fn: (el: Element) => void) => { scroller = fn; };
let pending: string | null = null;
export const takePendingAnchor = () => { const p = pending; pending = null; return p; };
const here = () => norm(strip(window.location.pathname));
export function goAnchor(id: string) {
  const el = id ? document.getElementById(id) : null;
  if (el) { scroller(el); return; }
  if (here() !== '/') { pending = id || null; go('/'); return; }
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
  if (to.startsWith('/')) {
    return <NextLink href={to} className={className} onClick={onClick} scroll={false} {...rest}>{children}</NextLink>;
  }
  return (
    <a href={to} className={className} onClick={(e) => {
      onClick?.(e);
      if (to.startsWith('#')) { e.preventDefault(); goAnchor(to.slice(1)); }
    }} {...rest}>{children}</a>
  );
}

export const slugify = (s: string) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
export { strip as stripBase };
