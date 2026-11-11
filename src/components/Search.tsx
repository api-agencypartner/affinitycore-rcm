/**
 * Global site search (nav button, ⌘K / Ctrl+K or "/").
 * One in-memory index over every page the site has: pages, services, specialties (with other names and
 * CPT codes), case studies, articles, open roles and every FAQ answer. Results are grouped by type and
 * open the matching page. Strapi later: the same index can be built at build time from the CMS.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search as SearchIcon, X, ArrowRight, FileText, Stethoscope, Briefcase, BarChart3, HelpCircle, Layers, CornerDownLeft, Phone, MapPin } from 'lucide-react';
import { go, goAnchor } from '../router';
import { ease } from '../motion';
import { SERVICES, SERVICE_PAGES } from '../data/services';
import { SPECIALTIES, SPECIALTY_PAGES, ALIASES, norm } from '../data/specialties';
import { CASES, ARTICLES } from '../data/insights';
import { STATES, SHOW_STATES } from '../data/states';
import { ROLES, CAREER_FAQS } from '../data/careers';
import { FAQS } from '../sections/Closing';
import { HUB_FAQS } from '../views/ServicesHub';
import { CONTACT_FAQS } from '../views/Contact';

type Kind = 'State' | 'Page' | 'Service' | 'Specialty' | 'Case study' | 'Article' | 'Job' | 'FAQ';
type Entry = { kind: Kind; title: string; sub: string; to: string; hay: string; t: string };
const LABEL: Record<Kind, string> = { State: 'States', Page: 'Pages', Service: 'Services', Specialty: 'Specialties', 'Case study': 'Case studies', Article: 'Articles', Job: 'Jobs', FAQ: 'Questions' };
const ORDER: Kind[] = ['State', 'Page', 'Service', 'Specialty', 'Case study', 'Article', 'Job', 'FAQ'];
const ICON: Record<Kind, JSX.Element> = {
  State: <MapPin />, Page: <Layers />, Service: <Layers />, Specialty: <Stethoscope />, 'Case study': <BarChart3 />, Article: <FileText />, Job: <Briefcase />, FAQ: <HelpCircle />,
};
const strip = (s: string) => s.replace(/\[Confirm[^\]]*\]/g, '').replace(/\s+/g, ' ').trim();
const cut = (s: string, n = 110) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);

function buildIndex(): Entry[] {
  const e: Entry[] = [];
  const add = (kind: Kind, title: string, sub: string, to: string, extra = '') =>
    e.push({ kind, title, sub: cut(strip(sub)), to, t: ` ${norm(title)} `, hay: ` ${norm(`${title} ${sub} ${extra}`)} ` });

  add('Page', 'Home', 'Revenue cycle management for medical practices', '/', 'rcm medical billing company');
  add('Page', 'All services', 'Ten services, from credentialing to appeals', '/services', 'rcm billing coding');
  add('Page', 'All specialties', '23 specialties, each billed its own way', '/specialties');
  add('Page', 'Case studies', 'Before-and-after results from real practices', '/case-studies', 'results proof');
  add('Page', 'Blog', 'Plain-English guides to getting paid', '/blog', 'articles guides news');
  add('Page', 'Careers', 'Open roles on the billing team', '/careers', 'jobs hiring work');
  add('Page', 'Contact', 'Call 214-851-2698 or request a call back · Plano, TX', '/contact', 'phone email address office call talk sales');
  add('Page', 'Free revenue assessment', 'See where your revenue is leaking, free', '#assessment', 'audit review estimate quote pricing cost');

  if (SHOW_STATES) STATES.forEach((s) => add('State', `${s.name} medical billing`, s.chips.map(([k, v]) => `${k}: ${v}`).join(' · '), `/states/${s.slug}`, `${s.abbr} ${s.cities.join(' ')} ${s.facts.map((f) => f.title + ' ' + f.body).join(' ')}`));
  if (SHOW_STATES) add('Page', 'States we serve', 'Billing in all 50 states', '/states', 'states nationwide map locations where');
  SERVICES.forEach((s) => {
    const p = SERVICE_PAGES[s.slug];
    add('Service', s.name, s.line, `/services/${s.slug}`, p ? `${p.heroSub} ${p.ticket.scope.join(' ')} ${p.steps.map((x) => x.title).join(' ')}` : '');
  });
  SPECIALTIES.forEach((s) => {
    const p = SPECIALTY_PAGES[s.slug];
    const codes = [...s.codes.map(([c, l]) => `${c} ${l}`), ...(p?.ledger.rows.map((r) => `${r.code} ${r.name}`) ?? [])].join(' ');
    add('Specialty', `${s.name} billing`, s.watch, `/specialties/${s.slug}`, `${s.name} ${ALIASES[s.slug] ?? ''} ${codes} ${s.group}`);
  });
  CASES.forEach((c) => add('Case study', c.title, `${c.tag} · ${c.profile.find(([k]) => k === 'Location')?.[1] ?? ''}`, `/case-studies/${c.slug}`, `${c.specialty} ${c.challenge.join(' ')}`));
  ARTICLES.forEach((a) => add('Article', a.title, a.body ? a.dek : `Coming soon · ${a.dek}`, a.body ? `/blog/${a.slug}` : '/blog', a.topic));
  ROLES.forEach((r) => add('Job', r.title, `${r.team} · ${r.location} · ${r.type}`, '/careers', `${r.summary} ${r.level}`));

  const faqs = (list: string[][], to: string, where: string) => list.forEach(([q, a]) => add('FAQ', q, `${where} · ${a}`, to, a));
  faqs(FAQS, '#faq', 'Home');
  faqs(HUB_FAQS, '/services', 'Services');
  faqs(CONTACT_FAQS, '/contact', 'Contact');
  faqs(CAREER_FAQS, '/careers', 'Careers');
  Object.values(SERVICE_PAGES).forEach((p) => faqs(p.faqs, `/services/${p.slug}`, p.name));
  Object.values(SPECIALTY_PAGES).forEach((p) => faqs(p.faqs, `/specialties/${p.slug}`, p.name));
  // the same question can live on many pages; keep the first of each
  const seen = new Set<string>();
  return e.filter((x) => (x.kind !== 'FAQ' ? true : seen.has(x.t) ? false : (seen.add(x.t), true)));
}

function search(index: Entry[], q: string) {
  const words = norm(q).split(' ').filter(Boolean);
  if (!words.length) return [];
  const hits: (Entry & { score: number })[] = [];
  for (const x of index) {
    if (!words.every((w) => x.hay.includes(` ${w}`) || (w.length > 3 && x.hay.includes(w)))) continue;
    let score = 0;
    for (const w of words) { if (x.t.includes(` ${w}`)) score += 4; else if (x.t.includes(w)) score += 2; else score += 1; }
    if (x.t.trim().startsWith(words.join(' '))) score += 3;
    score -= ORDER.indexOf(x.kind) * 0.15;
    hits.push({ ...x, score });
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, 14);
}

/** Bold the parts of a title the visitor typed. */
function Mark({ text, q }: { text: string; q: string }) {
  const words = norm(q).split(' ').filter((w) => w.length > 1);
  if (!words.length) return <>{text}</>;
  const re = new RegExp(`(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'ig');
  return <>{text.split(re).map((p, i) => (i % 2 === 1 ? <mark key={i}>{p}</mark> : <span key={i}>{p}</span>))}</>;
}

const SUGGEST = ['Prior authorization', 'Denial management', 'Cardiology', '99214', 'Credentialing', 'Pricing', 'Switching'];

/* ------------------------------------------------------------------ */
let openSearch: () => void = () => {};

export function SearchButton({ className = '' }: { className?: string }) {
  return (
    <button type="button" className={String.raw`nav__search [height:4.8rem] [display:inline-flex] [align-items:center] [gap:1rem] [border-radius:6rem] [border:1px_solid_var(--lav-border)] [background:#f8f6ff] [color:#5b5f72] [font-size:1.6rem] [transition:border-color_0.3s,_color_0.3s,_background_0.3s] [&_svg]:[color:var(--purple)] [&:hover]:[border-color:var(--purple)] [&:hover]:[color:var(--ink-2)] [&:hover]:[background:#fff] [&:focus-visible]:[outline:2px_solid_var(--purple)] [&:focus-visible]:[outline-offset:2px]! [width:4.8rem] [padding:0] [justify-content:center] [@media(max-width:_480px)]:[width:4.2rem]! [@media(max-width:_480px)]:[height:4.2rem]! ${className}`} onClick={() => openSearch()} aria-label="Search the site" title="Search (Ctrl K)">
      <SearchIcon size={20} />
    </button>
  );
}

export function SiteSearch() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [hi, setHi] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const index = useMemo(() => (open ? buildIndex() : []), [open]);
  const results = useMemo(() => search(index, q), [index, q]);
  openSearch = () => setOpen(true);

  // ⌘K / Ctrl+K anywhere, "/" when not typing
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      const typing = /INPUT|TEXTAREA|SELECT/.test((e.target as HTMLElement)?.tagName) || (e.target as HTMLElement)?.isContentEditable;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen((o) => !o); }
      else if (e.key === '/' && !typing && !open) { e.preventDefault(); setOpen(true); }
    };
    window.addEventListener('keydown', on);
    return () => window.removeEventListener('keydown', on);
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => input.current?.focus(), 30);
    document.documentElement.classList.add('is-searching');
    return () => { clearTimeout(t); document.documentElement.classList.remove('is-searching'); };
  }, [open]);
  useEffect(() => setHi(0), [q]);
  useEffect(() => { list.current?.querySelector<HTMLElement>(`[data-i="${hi}"]`)?.scrollIntoView({ block: 'nearest' }); }, [hi]);

  const close = () => { setOpen(false); setTimeout(() => setQ(''), 250); };
  const pick = (x: Entry) => { close(); if (x.to.startsWith('#')) goAnchor(x.to.slice(1)); else go(x.to); };

  // group in a fixed order, keep a flat index for keyboard movement
  const groups = ORDER.map((k) => ({ k, items: results.filter((r) => r.kind === k) })).filter((g) => g.items.length);
  const flat = groups.flatMap((g) => g.items);

  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div className="gs [position:fixed] [inset:0] [z-index:200] [display:flex] [justify-content:center] [align-items:flex-start] [padding:max(10vh,_6rem)_max(1.6rem,_env(safe-area-inset-right,_0px))_2rem_max(1.6rem,_env(safe-area-inset-left,_0px))] [background:rgba(20,_11,_48,_0.42)] [backdrop-filter:blur(6px)] [-webkit-backdrop-filter:blur(6px)] [@media(max-width:_640px)]:[padding-top:1.6rem]" role="dialog" aria-modal="true" aria-label="Search the site"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
          onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
          <motion.div className="gs__panel [width:min(72rem,_100%)] [max-height:min(72rem,_80vh)] [display:flex] [flex-direction:column] [border-radius:2.4rem] [background:#fff] [box-shadow:0_4rem_10rem_rgba(20,_11,_48,_0.3)] [overflow:hidden] [@media(max-width:_640px)]:[max-height:calc(100svh_-_3.2rem)] [@media(max-width:_640px)]:[border-radius:2rem]" initial={{ opacity: 0, y: -16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.98 }} transition={{ duration: 0.3, ease: ease.out }}>
            <div className="gs__bar [flex:none] [display:flex] [align-items:center] [gap:1.2rem] [padding:0_1.2rem_0_2.4rem] [height:7.2rem] [border-bottom:1px_solid_#ece8fa] [@media(max-width:_640px)]:[height:6.4rem] [@media(max-width:_640px)]:[padding-left:1.8rem]">
              <SearchIcon className="gs__icon [flex:none] [width:2.2rem] [height:2.2rem] [color:var(--purple)]" aria-hidden />
              <input ref={input} id="site-search" className="gs__input [flex:1] [min-width:0] [height:100%] [border:0] [outline:0] [background:none] [font-family:inherit] [font-weight:inherit] [font-style:inherit] [line-height:inherit] [font-size:2rem] [color:var(--ink-2)] [&::placeholder]:[color:#a29cbc] [&::-webkit-search-cancel-button]:[display:none] [@media(max-width:_640px)]:[font-size:1.7rem]" type="search" value={q} autoComplete="off" spellCheck={false}
                placeholder="Search services, specialties, CPT codes, questions…" aria-label="Search the site" role="combobox" aria-expanded={!!flat.length} aria-controls="gs-list"
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') { e.preventDefault(); setHi((h) => Math.min(h + 1, flat.length - 1)); }
                  else if (e.key === 'ArrowUp') { e.preventDefault(); setHi((h) => Math.max(h - 1, 0)); }
                  else if (e.key === 'Enter' && flat[hi]) { e.preventDefault(); pick(flat[hi]); }
                  else if (e.key === 'Escape') { e.preventDefault(); if (q) setQ(''); else close(); }
                }} />
              <button type="button" className="gs__close [flex:none] [width:4rem] [height:4rem] [border-radius:50%] [display:grid] [place-items:center] [color:#6b6f7c] [background:#f4f0ff]" onClick={close} aria-label="Close search"><X size={18} /></button>
            </div>

            <div className="gs__body [flex:1] [overflow-y:auto] [overscroll-behavior:contain] [padding:1.2rem]" ref={list} id="gs-list" role="listbox">
              {!q.trim() && (
                <div className="gs__empty">
                  <p className="gs__label [padding:1.2rem_1.2rem_0.6rem] [font-family:var(--f-mono)] [font-size:1.15rem] [letter-spacing:0.08em] [text-transform:uppercase] [color:#8a8ea0]">Try</p>
                  <div className="gs__chips [display:flex] [flex-wrap:wrap] [gap:0.8rem] [padding:0.4rem_1.2rem_1.2rem] [&_button]:[padding:0.8rem_1.4rem] [&_button]:[border-radius:2rem] [&_button]:[border:1px_solid_var(--lav-border)] [&_button]:[font-size:1.5rem] [&_button]:[color:var(--ink-2)] [&_button]:[transition:border-color_0.3s,_color_0.3s] [&_button:hover]:[border-color:var(--purple)] [&_button:hover]:[color:var(--purple)]">{SUGGEST.map((s) => <button key={s} type="button" onClick={() => setQ(s)}>{s}</button>)}</div>
                </div>
              )}
              {q.trim() && !flat.length && (
                <div className="gs__none [display:flex] [flex-direction:column] [gap:0.6rem] [padding:2.4rem] [font-size:1.6rem] [color:#5b5f72] [&_b]:[font-weight:600] [&_b]:[color:var(--ink-2)]">
                  <b>Nothing found for “{q.trim()}”.</b>
                  <span>Ask a billing specialist instead. We usually answer the same day.</span>
                  <div className="gs__noneact [display:flex] [flex-wrap:wrap] [gap:1.6rem] [margin-top:1rem] [&_button]:[display:inline-flex] [&_button]:[align-items:center] [&_button]:[gap:0.6rem] [&_button]:[font-weight:600] [&_button]:[color:var(--purple)] [&_a]:[display:inline-flex] [&_a]:[align-items:center] [&_a]:[gap:0.6rem] [&_a]:[font-weight:600] [&_a]:[color:var(--purple)]">
                    <button type="button" onClick={() => { close(); go('/contact'); }}>Contact us <ArrowRight size={16} /></button>
                    <a href="tel:+12148512698"><Phone size={16} /> 214-851-2698</a>
                  </div>
                </div>
              )}
              {groups.map((g) => (
                <div key={g.k} className="gs__group">
                  <p className="gs__label [padding:1.2rem_1.2rem_0.6rem] [font-family:var(--f-mono)] [font-size:1.15rem] [letter-spacing:0.08em] [text-transform:uppercase] [color:#8a8ea0]">{LABEL[g.k]}</p>
                  {g.items.map((x) => {
                    const i = flat.indexOf(x);
                    return (
                      <button key={x.kind + x.title + x.to} type="button" role="option" aria-selected={hi === i} data-i={i}
                        className={String.raw`gs__row [width:100%] [display:grid] [grid-template-columns:4rem_minmax(0,_1fr)_2rem] [gap:1.4rem] [align-items:center] [padding:1rem_1.2rem] [border-radius:1.4rem] [text-align:left] [&.is-hi]:[background:#f6f3ff] ${hi === i ? 'is-hi' : ''}`} onMouseMove={() => setHi(i)} onClick={() => pick(x)}>
                        <span className="gs__ic [width:4rem] [height:4rem] [border-radius:1.1rem] [display:grid] [place-items:center] [background:#f1edff] [color:var(--purple)] [transition:background_0.2s,_color_0.2s] [&_svg]:[width:1.9rem] [&_svg]:[height:1.9rem] [.gs\_\_row.is-hi_&]:[background:var(--purple)] [.gs\_\_row.is-hi_&]:[color:#fff]">{ICON[x.kind]}</span>
                        <span className="gs__txt [min-width:0] [display:flex] [flex-direction:column] [gap:0.2rem] [&_b]:[font-weight:500] [&_b]:[font-size:1.7rem] [&_b]:[color:var(--ink-2)] [&_mark]:[background:none] [&_mark]:[color:var(--purple)] [&_mark]:[font-weight:600] [&_small]:[font-size:1.4rem] [&_small]:[color:#6b6f7c] [&_small]:[white-space:nowrap] [&_small]:[overflow:hidden] [&_small]:[text-overflow:ellipsis]"><b><Mark text={x.title} q={q} /></b><small>{x.sub}</small></span>
                        <CornerDownLeft className="gs__enter [color:var(--purple)] [opacity:0] [transition:opacity_0.2s] [.gs\_\_row.is-hi_&]:[opacity:1]" size={16} aria-hidden />
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="gs__foot [flex:none] [display:flex] [gap:2.4rem] [padding:1.2rem_2.4rem] [border-top:1px_solid_#ece8fa] [font-size:1.3rem] [color:#8a8ea0] [&_kbd]:[display:inline-block] [&_kbd]:[min-width:2.2rem] [&_kbd]:[margin-right:0.4rem] [&_kbd]:[padding:0.1rem_0.6rem] [&_kbd]:[border-radius:0.6rem] [&_kbd]:[border:1px_solid_var(--lav-border)] [&_kbd]:[font-family:var(--f-mono)] [&_kbd]:[font-size:1.15rem] [&_kbd]:[text-align:center] [@media(max-width:_640px)]:[display:none]">
              <span><kbd>↑</kbd><kbd>↓</kbd> to move</span><span><kbd>↵</kbd> to open</span><span><kbd>Esc</kbd> to close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
