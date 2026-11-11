'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { SMOOTH } from './motion';
import { AnimatePresence, LayoutGroup, MotionConfig, motion, useReducedMotion, frame, cancelFrame } from 'motion/react';
import { useRoute, goAnchor, setScroller, scrollToPending, setPush, stripBase } from './router';
import { useRouter } from 'next/navigation';
import { ReadyContext } from './ready';
import { ease } from './motion';
import { GooDefs } from './components/ui';
import { Loader } from './sections/Loader';
import { SiteSearch } from './components/Search';
import { Nav } from './sections/Nav';
import { Footer } from './sections/Closing';

/** loading → (handoff) → ready. Reduced-motion users skip straight to ready. */
export default function Shell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const path = useRoute();
  // The intro loader plays only when the site is entered on the home page; every other page opens straight to content.
  const entry = useRef(path).current;
  const LOADER_WORDS: Record<string, string[] | undefined> = {
    '/': undefined, // default: "Medical Billing Service That Gets You Paid Faster"
  };
  const hasLoader = entry in LOADER_WORDS;
  // Which page the loader is introducing (only ever the home page now).
  const [loaderFor, setLoaderFor] = useState(entry);
  const played = useRef(new Set<string>([entry]));
  const loaderWords = LOADER_WORDS[loaderFor];
  const [ready, setReady] = useState(() => !hasLoader);
  useEffect(() => { if (reduce) setReady(true); }, [reduce]);
  const handoff = useCallback(() => setReady(true), []);

  // Smooth scrolling (Lenis). Motion's useScroll reads native scroll, so everything stays in sync.
  const lenis = useRef<Lenis | null>(null);
  useEffect(() => {
    if (reduce) return;
    const l = new Lenis({ lerp: SMOOTH.lerp, wheelMultiplier: SMOOTH.wheelMultiplier });
    setScroller((el) => l.scrollTo(el as HTMLElement, { offset: -120, duration: 1.4 }));
    lenis.current = l;
    // Perf: drive Lenis from Motion's frame loop, so the new scroll position is set before Motion's
    // read/render phases in the same frame (one pass per frame, no 1-frame lag for scroll-linked effects).
    const tick = ({ timestamp }: { timestamp: number }) => l.raf(timestamp);
    frame.update(tick, true);
    return () => { cancelFrame(tick); l.destroy(); };
  }, [reduce]);
  useEffect(() => { if (ready) lenis.current?.start(); else lenis.current?.stop(); }, [ready]);

  // New page: jump to top (the curtain hides the jump)
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const page = path.split('?')[0];
    if (!reduce && page !== '/' && page in LOADER_WORDS && !played.current.has(page)) {
      played.current.add(page); setLoaderFor(page); setReady(false);
    }
    lenis.current?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    scrollToPending();
  }, [path]);

  // Navigation: Next router for internal links; old "#/path" links (shared before the move) redirect to real URLs
  useEffect(() => {
    setPush((to) => router.push(to, { scroll: false }));
    const h = window.location.hash;
    if (h.startsWith('#/')) router.replace(h.slice(1));
  }, [router]);
  useEffect(() => {
    const on = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.('a');
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || (a.getAttribute('href') ?? '').startsWith('#')) return;
      if (a.dataset.nextLink !== undefined) return;
      e.preventDefault();
      router.push(stripBase(url.pathname) + url.search, { scroll: false });
    };
    document.addEventListener('click', on);
    return () => document.removeEventListener('click', on);
  }, [router]);

  // Any plain "#anchor" link (nav dropdowns, footer, cards) works from every page.
  useEffect(() => {
    const on = (e: MouseEvent) => {
      if (e.defaultPrevented) return;
      const a = (e.target as Element).closest?.('a');
      const href = a?.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      e.preventDefault();
      goAnchor(href.slice(1));
    };
    document.addEventListener('click', on);
    return () => document.removeEventListener('click', on);
  }, []);

  // Perf: pause every looping CSS animation inside sections that are off screen
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.target.toggleAttribute('data-off', !e.isIntersecting)), { rootMargin: '200px 0px' });
    const seen = new WeakSet<Element>();
    const scan = () => document.querySelectorAll('main section, footer').forEach((el) => { if (!seen.has(el)) { seen.add(el); io.observe(el); } });
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('is-loading', !ready);
    if (!ready) window.scrollTo(0, 0);
  }, [ready]);

  return (
    <MotionConfig reducedMotion="user">
      <GooDefs />
      {/* Perf: the layout group only spans the loader→nav handoff; pages and footer stay outside it,
          so a nav state change never re-renders the whole site. */}
      <LayoutGroup>
        <AnimatePresence>{!ready && <Loader key={`loader${loaderFor}`} onHandoff={handoff} words={loaderWords} />}</AnimatePresence>
        {ready && <Nav show={ready} />}
      </LayoutGroup>
        <ReadyContext.Provider value={ready}>{children}</ReadyContext.Provider>
        {/* Page-change curtain: sweeps up off the page (home page only) */}
        <AnimatePresence initial={false}>
          {path.split('?')[0] === '/' && <motion.div key={path} className="curtain" aria-hidden initial={{ scaleY: 1 }} animate={{ scaleY: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: ease.curtain, delay: 0.38 }} style={{ originY: 0 }} />}
        </AnimatePresence>
        <Footer />
        <SiteSearch />
    </MotionConfig>
  );
}
