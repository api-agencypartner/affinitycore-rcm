import { useCallback, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { SMOOTH } from './motion';
import { AnimatePresence, LayoutGroup, MotionConfig, motion, useReducedMotion, frame, cancelFrame } from 'motion/react';
import { useRoute, goAnchor, setScroller, scrollToPending } from './router';
import { ServicesHub } from './pages/ServicesHub';
import { ServicePage } from './pages/ServicePage';
import { SpecialtiesHub } from './pages/SpecialtiesHub';
import { SpecialtyPage } from './pages/SpecialtyPage';
import { getSpecialty } from './data/specialties';
import { CaseStudiesHub, CaseStudyPage } from './pages/CaseStudies';
import { getCase, getArticle } from './data/insights';
import { BlogHub, ArticlePage } from './pages/Blog';
import { CareersPage } from './pages/Careers';
import { ContactPage } from './pages/Contact';
import { AboutPage } from './pages/About';
import { ease } from './motion';
import { GooDefs } from './components/ui';
import { Loader } from './sections/Loader';
import { SiteSearch } from './components/Search';
import { StatesFold } from './sections/StatesFold';
import { StatePage } from './pages/StatePage';
import { getState, SHOW_STATES } from './data/states';
import { Nav } from './sections/Nav';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { Specialities } from './sections/Specialities';
import { Process } from './sections/Process';
import { Services } from './sections/Services';
import { Platforms } from './sections/Platforms';
import { Testimonials } from './sections/Testimonials';
import { Assessment } from './sections/Assessment';
import { FAQ, CTA, Footer } from './sections/Closing';

/** loading → (handoff) → ready. Reduced-motion users skip straight to ready. */
function Home({ ready }: { ready: boolean }) {
  return (
    <main>
      <Hero show={ready} />
      <About />
      <Specialities />
      <Process />
      <Services />
      <Platforms />
      <Testimonials />
      {SHOW_STATES && <StatesFold />}
      <Assessment />
      <FAQ />
      <CTA />
    </main>
  );
}

function pageFor(path: string, ready: boolean) {
  if (path === '/services') return ready ? <ServicesHub /> : null;
  const m = path.match(/^\/services\/([\w-]+)/);
  if (m) return ready ? <ServicePage slug={m[1]} /> : null;
  if (path === '/blog') return <BlogHub />;
  const bl = path.match(/^\/blog\/([\w-]+)/);
  if (bl) { const a = getArticle(bl[1]); return a?.body ? <ArticlePage key={bl[1]} slug={bl[1]} /> : <BlogHub />; }
  const st = path.match(/^\/states\/([\w-]+)/);
  if (st && SHOW_STATES) return getState(st[1]) ? <StatePage key={st[1]} slug={st[1]} /> : <Home ready={ready} />;
  if (path === '/contact') return <ContactPage />;
  if (path === '/about') return <AboutPage />;
  if (path === '/careers') return <CareersPage />;
  if (path === '/case-studies') return <CaseStudiesHub />;
  const cs = path.match(/^\/case-studies\/([\w-]+)/);
  if (cs) return getCase(cs[1]) ? <CaseStudyPage key={cs[1]} slug={cs[1]} /> : <CaseStudiesHub />;
  if (path === '/specialties') return ready ? <SpecialtiesHub /> : null;
  const sp = path.match(/^\/specialties\/([\w-]+)/);
  if (sp) return ready ? (getSpecialty(sp[1]) ? <SpecialtyPage key={sp[1]} slug={sp[1]} /> : <SpecialtiesHub />) : null;
  return <Home ready={ready} />;
}

export default function App() {
  const reduce = useReducedMotion();
  const path = useRoute();
  const child = /^\/(services|specialties|case-studies|blog|states)\/[^/?]+/.test(path);
  // The intro loader plays only when the site is entered on a parent page, with words that say what the page is.
  // Child pages (a single service, specialty, case study or article) open straight to content.
  const entry = useRef(window.location.hash.replace('#', '').split('?')[0] || '/').current;
  const LOADER_WORDS: Record<string, string[] | undefined> = {
    '/': undefined, // default: "Medical Billing Service That Gets You Paid Faster"
    '/services': ['Ten', 'Services,', 'One', 'Accountable', 'Team'],
    '/specialties': ['23', 'Specialties,', 'Each', 'Billed', 'Its', 'Own', 'Way'],
    '/case-studies': ['Results', 'Measured', 'in', 'Your', 'Own', 'Numbers'],
    '/careers': ['Build', 'Your', 'Revenue', 'Cycle', 'Career', 'Here'],
    '/blog': ['Plain-English', 'Guides', 'to', 'Getting', 'Paid'],
    '/about': ['The', 'People', 'Who', 'Get', 'Care', 'Paid'],
  };
  const hasLoader = entry in LOADER_WORDS;
  // Which page the loader is introducing. Parent pages reached by navigation get it too, once per visit.
  const [loaderFor, setLoaderFor] = useState(entry);
  const played = useRef(new Set<string>([entry]));
  const loaderWords = LOADER_WORDS[loaderFor];
  const [ready, setReady] = useState(() => !!reduce || !hasLoader);
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
    if (path === '/') document.title = 'Affinity Core Home';
    else if (path === '/services') document.title = 'Medical Billing Services · Affinity Core';
  }, [path]);

  // Any plain "#anchor" link (nav dropdowns, footer, cards) works from every page.
  useEffect(() => {
    const on = (e: MouseEvent) => {
      if (e.defaultPrevented) return;
      const a = (e.target as Element).closest?.('a');
      const href = a?.getAttribute('href');
      if (!href || !href.startsWith('#') || href.startsWith('#/')) return;
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
        {/* Child pages (one service, specialty, case study or article) open instantly: no fade-out, no curtain. */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={path} initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.01 } }} exit={{ opacity: 0, transition: { duration: child ? 0 : 0.35, ease: ease.out } }}>
            {pageFor(path, ready)}
          </motion.div>
        </AnimatePresence>
        {/* Page-change curtain: sweeps up off the new page (parent pages only) */}
        <AnimatePresence initial={false}>
          {!child && <motion.div key={path} className="curtain" aria-hidden initial={{ scaleY: 1 }} animate={{ scaleY: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: ease.curtain, delay: 0.38 }} style={{ originY: 0 }} />}
        </AnimatePresence>
        <Footer />
        <SiteSearch />
    </MotionConfig>
  );
}
