'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import person1 from '../assets/person-1.webp';
import person2 from '../assets/person-2.webp';
import person3 from '../assets/person-3.webp';
import person4 from '../assets/person-4.webp';
import person5 from '../assets/person-5.webp';
import { motion, AnimatePresence, LayoutGroup, useScroll, useSpring } from 'motion/react';
import { ArrowRight, ChevronLeft, ExternalLink, Clock } from 'lucide-react';
import { Button, Eyebrow, Logo, Reveal, SplitWords } from '../components/ui';
import { CTA } from '../sections/Closing';
import { Link, go } from '../router';
import { ARTICLES, TOPICS, getArticle, type Article, type Block } from '../data/insights';
import { ease, vp } from '../motion';
// Perf: pre-blurred copy of fluted-purple.jpg replaces a live backdrop-filter blur on these panels
import fluted from '../assets/fluted-frost.jpg';
import { SceneCover } from '../components/BlogCover';
import { BlogArt } from '../components/BlogArt';

const setMeta = (title: string, desc: string) => {
  document.title = `${title} · Affinity Core`;
  let m = document.querySelector('meta[name="description"]');
  if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m); }
  m.setAttribute('content', desc);
};
const live = (a: Article) => !!a.body;

/* ---- Cover style: "headline" (text on image, best for Google Images / social), "split" (title + illustration) or "scene" (illustration). ---- */
type CoverStyle = 'headline' | 'people' | 'split' | 'scene';
let coverStyle: CoverStyle = (() => { try { return (localStorage.getItem('ac-blog-cover') as CoverStyle) || 'headline'; } catch { return 'headline'; } })();
const coverSubs = new Set<(s: CoverStyle) => void>();
const setCoverStyle = (v: CoverStyle) => { coverStyle = v; try { localStorage.setItem('ac-blog-cover', v); } catch { /* ignore */ } coverSubs.forEach((f) => f(v)); };
function useCoverStyle() {
  const [v, set] = useState(coverStyle);
  useEffect(() => { coverSubs.add(set); return () => { coverSubs.delete(set); }; }, []);
  return v;
}

/** Headline cover: the article's hook written on a branded image. Built to be the featured / OG image too. */
/* Cutout people for the headline covers (Envato Elements, licensed to "Affinity Core Website"). */
const PEOPLE = [person1, person2, person3, person4, person5];
function HeadlineCover({ a, big, person }: { a: Article; big?: boolean; person?: boolean }) {
  const [lead, accent] = a.hook ?? [a.title, ''];
  const who = PEOPLE[Math.max(0, ARTICLES.findIndex((x) => x.slug === a.slug)) % PEOPLE.length];
  return (
    <div className={String.raw`bh-cover [position:absolute] [inset:0] [display:flex] [flex-direction:column] [justify-content:center] [padding:2.4rem_2.8rem] [overflow:hidden] [isolation:isolate] [color:#fff] [background:radial-gradient(120%_120%_at_100%_0%,_#8a6bff_0%,_#6a41f9_38%,_#3b1cc4_75%,_#22106e_100%)] [@media(max-width:_640px)]:[padding:2rem_2.2rem] [container-type:size] ${big ? String.raw`bh-cover--big [padding:3.2rem]!` : ''} ${person ? 'bh-cover--person' : ''}`}>
      <span className="bh-cover__flute [position:absolute] [z-index:-1] [top:0] [bottom:0] [right:0] [width:46%] [background:repeating-linear-gradient(90deg,_rgba(255,_255,_255,_0.16)_0_0.7rem,_rgba(255,_255,_255,_0.02)_0.7rem_1.8rem)] [-webkit-mask-image:linear-gradient(90deg,_transparent,_#000_45%)] [mask-image:linear-gradient(90deg,_transparent,_#000_45%)] [.bc--headline:hover_&]:[transform:translateX(-1rem)] [.bc--headline:hover_&]:[transition:transform_1.2s_cubic-bezier(.16,1,.3,1)]" aria-hidden />
      <span className="bh-cover__glow [position:absolute] [z-index:-1] [width:70%] [aspect-ratio:1] [right:-18%] [top:-40%] [border-radius:50%] [background:radial-gradient(circle,_rgba(1,_231,_231,_0.35),_transparent_62%)] [filter:blur(1rem)] [.bh-cover--person_&]:[right:-8%] [.bh-cover--person_&]:[top:auto] [.bh-cover--person_&]:[bottom:-30%] [.bh-cover--person_&]:[width:60%] [.bh-cover--person_&]:[background:radial-gradient(circle,_rgba(185,_168,_255,_0.55),_transparent_62%)]" aria-hidden />
      {person && <img className="bh-cover__person [position:absolute] [z-index:0] [right:-1%] [bottom:0] [height:90%] [width:auto] [max-width:48%] [object-fit:contain] [object-position:right_bottom] [filter:saturate(0.92)_contrast(1.03)_drop-shadow(0_1.6rem_3rem_rgba(20,_8,_90,_0.45))] [transition:transform_0.9s_cubic-bezier(.16,1,.3,1)] [pointer-events:none] [.bh-cover--person.bh-cover--big_&]:[height:94%] [.bc--headline:hover_&]:[transform:translateY(-0.6rem)_scale(1.02)]" src={who} alt="" loading="lazy" decoding="async" />}
      <span className="bh-cover__topic [position:absolute] [left:2.8rem] [top:2.2rem] [padding:0.5rem_1.1rem] [border-radius:2rem] [background:rgba(255,_255,_255,_0.16)] [border:1px_solid_rgba(255,_255,_255,_0.28)] [font-family:var(--f-mono)] [font-size:1.15rem] [letter-spacing:0.06em] [text-transform:uppercase] [.bh-cover--big_&]:[font-size:1.3rem] [@media(max-width:_640px)]:[left:2.2rem] [@media(max-width:_640px)]:[top:1.8rem] [z-index:1] [.bh-cover--big_&]:[left:3.2rem] [.bh-cover--big_&]:[top:3.2rem]">{a.topic}</span>
      <p className="bh-cover__hook [max-width:86%] [margin-top:1.6rem] [font-weight:600] [font-size:3.4rem] [line-height:1.08] [letter-spacing:-0.1rem] [text-wrap:balance] [&_em]:[font-style:normal] [&_em]:[background:linear-gradient(90deg,_#7ff6f6,_#b9a8ff_55%,_#f0a8ff)] [&_em]:[-webkit-background-clip:text] [&_em]:[background-clip:text]! [&_em]:[color:transparent] [.bh-cover--big_&]:[max-width:90%] [@media(max-width:_640px)]:[font-size:2.8rem] [z-index:1] [position:relative] [.bh-cover--person_&]:[max-width:58%] [.bh-cover--person.bh-cover--big_&]:[max-width:56%] [@media(max-width:_640px)]:[.bh-cover--person_&]:[max-width:60%] [@media(max-width:_640px)]:[.bh-cover--person_&]:[font-size:2.4rem] [.bh-cover--big_&]:[font-size:clamp(2.6rem,_8.4cqi,_6rem)] [.bh-cover--big_&]:[letter-spacing:-0.04em]">{lead}{accent && <> <em>{accent}</em></>}</p>
      <span className="bh-cover__foot [position:absolute] [left:2.8rem] [right:2.8rem] [bottom:2rem] [display:flex] [justify-content:space-between] [align-items:center] [font-family:var(--f-mono)] [font-size:1.15rem] [color:rgba(255,_255,_255,_0.75)] [.bh-cover--big_&]:[right:4.8rem] [.bh-cover--big_&]:[font-size:1.3rem] [@media(max-width:_640px)]:[left:2.2rem] [@media(max-width:_640px)]:[right:2.2rem] [@media(max-width:_640px)]:[bottom:1.6rem] [z-index:1] [.bh-cover--person_&]:[right:auto] [.bh-cover--person_&]:[gap:1.6rem] [.bh-cover--person_&>span:last-child]:[padding:0.3rem_0.9rem] [.bh-cover--person_&>span:last-child]:[border-radius:2rem] [.bh-cover--person_&>span:last-child]:[background:rgba(28,_10,_92,_0.55)] [.bh-cover--big_&]:[left:3.2rem] [.bh-cover--big_&]:[bottom:3.2rem] [.bh-cover--person_&>span:last-child]:[-webkit-backdrop-filter:blur(0.6rem)] [.bh-cover--person_&>span:last-child]:[backdrop-filter:blur(0.6rem)]"><Logo light className="bh-cover__logo [width:11rem]! [.bh-cover--big_&]:[width:15rem]!" /><span>{a.read}</span></span>
    </div>
  );
}

/** Title + illustration: the hook on the left, the article's scene on the right, on the light brand background. */
const ART_W = 33, ART_H = 26; // scene's natural box, rem
function ArtFit({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(0.5);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const fit = () => {
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 10;
      const { width, height } = el.getBoundingClientRect();
      setK(Math.min(1, width / (ART_W * rem), height / (ART_H * rem)));
    };
    fit();
    const ro = new ResizeObserver(fit); ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} className="bsp__art [position:relative] [width:100%] [height:100%] [min-height:0]">
      <div className="bsp__art-in [position:absolute] [left:50%] [top:50%] [width:38rem] [height:30rem] [&_.scene]:[padding:2rem]!" style={{ transform: `translate(-50%, -50%) scale(${k})` }}>{children}</div>
    </div>
  );
}
function SplitCover({ a, big }: { a: Article; big?: boolean }) {
  const [lead, accent] = a.hook ?? [a.title, ''];
  return (
    <div className={String.raw`bsp [position:absolute] [inset:0] [display:grid] [grid-template-columns:minmax(0,_1.05fr)_minmax(0,_1fr)] [gap:0.8rem] [padding:2.4rem_1.6rem_2.2rem_2.8rem] [container-type:size] [@media(max-width:_640px)]:[padding:2rem_1.2rem_1.8rem_2.2rem] ${big ? String.raw`bsp--big [padding:4rem_3.2rem_3.6rem_4.4rem]!` : ''}`}>
      <div className="bsp__text [position:relative] [z-index:1] [display:flex] [flex-direction:column] [justify-content:space-between] [min-width:0]">
        <span className="bsp__topic [align-self:flex-start] [padding:0.5rem_1.1rem] [border-radius:2rem] [background:#fff] [border:1px_solid_#e6defc] [font-family:var(--f-mono)] [font-size:1.15rem] [letter-spacing:0.06em] [text-transform:uppercase] [color:var(--purple)] [.bsp--big_&]:[font-size:1.3rem]">{a.topic}</span>
        <p className="bsp__hook [font-weight:600] [font-size:clamp(1.9rem,_6.6cqi,_3.4rem)] [line-height:1.08] [letter-spacing:-0.04em] [color:var(--ink-2)] [text-wrap:balance] [&_em]:[font-style:normal] [&_em]:[background:linear-gradient(90deg,_#6a41f9,_#9b5cff_60%,_#c54bff)] [&_em]:[-webkit-background-clip:text] [&_em]:[background-clip:text]! [&_em]:[color:transparent] [.bsp--big_&]:[font-size:clamp(2.6rem,_5.6cqi,_6rem)]">{lead}{accent && <> <em>{accent}</em></>}</p>
        <span className="bsp__foot [display:flex] [align-items:center] [gap:1.2rem] [font-family:var(--f-mono)] [font-size:1.15rem] [color:#7b7f92] [.bsp--big_&]:[font-size:1.3rem]"><Logo className="bsp__logo [width:9.6rem]! [.bsp--big_&]:[width:13rem]!" /><span>{a.read}</span></span>
      </div>
      <ArtFit>{a.cover && <SceneCover c={a.cover} />}</ArtFit>
    </div>
  );
}

/** Scene cover: a small, recognizable moment from the practice's day (see components/BlogCover). */
function Cover({ a, big }: { a: Article; big?: boolean }) {
  const style = useCoverStyle();
  return (
    <motion.div className={String.raw`bc [position:relative] [isolation:isolate] [overflow:hidden] [aspect-ratio:16_/_9] [border-radius:2.4rem_2.4rem_0_0] [display:flex] [padding:2.4rem] [background:radial-gradient(120%_90%_at_85%_10%,_#ede6ff_0%,_#f6f3ff_45%,_#fbfaff_100%)] [justify-content:center] [align-items:center] [&::before]:[content:''] [&::before]:[position:absolute] [&::before]:[inset:0] [&::before]:[z-index:-1] [&::before]:[background-image:radial-gradient(rgba(106,_65,_249,_0.12)_1px,_transparent_1.2px)]! [&::before]:[background-size:1.8rem_1.8rem]! [&::before]:[-webkit-mask-image:linear-gradient(180deg,_#000,_transparent_85%)] [&::before]:[mask-image:linear-gradient(180deg,_#000,_transparent_85%)] [&.bc--big.pa-art]:[flex-direction:column] [&.bc--big.pa-art]:[justify-content:center] [&.bc--big.pa-art]:[gap:1.8rem] [&.bc--big.pa-art]:[cursor:default] [&.bc--big.pa-art]:[min-height:56rem] [&.bc--big.pa-art]:[padding:8.4rem_2rem_6.4rem]! [@media(min-width:1024px)]:[&.bc--big.pa-art]:[min-height:60rem] [@media(min-width:1024px)]:[&.bc--big.pa-art]:[padding:9rem_3.2rem_6.8rem]! [&.bc--big.ba]:[position:relative] [&.bc--big.ba]:[overflow:hidden] [&.bc--big.ba]:[min-height:56rem] [&.bc--big.ba]:[background:var(--soft-grain),_var(--soft-bg)]! [&.bc--big.ba]:[cursor:pointer] [&.bc--big.ba]:[isolation:isolate] [@media(max-width:_1279px)]:[&.bc--big.ba]:[min-height:48rem] [@media(max-width:_640px)]:[&.bc--big.ba]:[min-height:40rem] ${big ? String.raw`bc--big [aspect-ratio:auto]! [height:100%] [min-height:34rem] [border-radius:3.2rem_0_0_3.2rem]! [padding:4rem]! [@media(max-width:_1279px)]:[min-height:22rem] [@media(max-width:_1279px)]:[border-radius:3.2rem_3.2rem_0_0]!` : ''} ${style === 'headline' || style === 'people' ? String.raw`bc--headline [padding:0]! [background:#2a1580]! [&::before]:[display:none]` : ''} ${style === 'split' ? String.raw`bc--split [padding:0]!` : ''}`} initial="rest" animate="rest" whileHover="hover">
      {style === 'split' ? <SplitCover a={a} big={big} /> : style !== 'scene' ? <HeadlineCover a={a} big={big} person={style === 'people'} /> : <>
        <span className="bc__topic [position:absolute] [left:2.4rem] [top:2.4rem] [padding:0.6rem_1.2rem] [border-radius:3rem] [background:#fff] [font-family:var(--f-mono)] [font-size:1.2rem] [text-transform:uppercase] [letter-spacing:0.06em] [color:var(--purple)]">{a.topic}</span>
        {a.cover && <SceneCover c={a.cover} />}
      </>}
      {!live(a) && <span className="bc__soon [position:absolute] [right:2.4rem] [top:2.4rem] [padding:0.6rem_1.2rem] [border-radius:3rem] [background:rgba(20,_11,_48,_0.85)] [color:#fff] [font-size:1.2rem] [font-weight:600] [.bc--headline_&]:[z-index:2]">Coming soon</span>}
    </motion.div>
  );
}

/** Review switcher: compare the two cover styles (remove before launch). */
function CoverPicker() {
  const v = useCoverStyle();
  return (
    <div className="ccp [display:flex] [align-items:center] [gap:0.4rem] [width:max-content] [max-width:100%] [margin:3.2rem_auto_0] [padding:0.5rem] [border-radius:3rem] [border:1px_dashed_#cfc6f3] [background:#fff] [font-size:1.4rem] [&>span]:[padding:0_1.2rem_0_1rem] [&>span]:[font-family:var(--f-mono)] [&>span]:[font-size:1.15rem] [&>span]:[letter-spacing:0.05em] [&>span]:[text-transform:uppercase] [&>span]:[color:#8a8ea0] [&_button]:[padding:0.8rem_1.6rem] [&_button]:[border-radius:2.4rem] [&_button]:[color:var(--ink-2)] [&_button]:[transition:background_0.3s,_color_0.3s] [@media(max-width:_640px)]:[flex-wrap:wrap] [@media(max-width:_640px)]:[justify-content:center] [@media(max-width:_640px)]:[border-radius:2rem]" role="radiogroup" aria-label="Blog cover style (review)">
      <span>Cover style</span>
      {([['headline', 'Headline'], ['people', 'Headline + person'], ['split', 'Title + illustration'], ['scene', 'Illustration']] as const).map(([id, l]) => (
        <button key={id} type="button" role="radio" aria-checked={v === id} className={v === id ? String.raw`is-on [.assess\_\_steps_span&]:[color:var(--navy)] [.assess\_\_steps_span&_b]:[background:var(--purple)] [.assess\_\_steps_span&_b]:[border-color:var(--purple)] [.assess\_\_steps_span&_b]:[color:#fff] [.assess\_\_steps_i&::after]:[transform:scaleX(1)] [.cx-read\_\_n_i&]:[width:2.4rem] [.cx-read\_\_n_i&]:[background:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [.sg\_\_toc_button&]:[color:var(--purple)] [.sg\_\_toc_button&]:[border-left-color:var(--purple)] [.pg\_\_toc_button&]:[color:#fff] [.pg\_\_toc_button&_small]:[color:rgba(255,_255,_255,_0.7)] [.pg\_\_dots_i&]:[width:2.4rem] [.pg\_\_dots_i&]:[background:var(--purple)] [.stfd\_\_tabs_button&]:[color:#fff] [.se\_\_dots_i&]:[width:6.4rem] [.sw-anes\_\_bar_i&]:[background:var(--grad)] [.sw-body_circle&]:[fill:var(--purple)] [.sw-vial\_\_body_i&]:[background:var(--grad)] [.sw-vial\_\_body_i&_small]:[color:#fff] [.sw-wound\_\_grid_i&]:[background:#c9b8ff] [.sw-wound\_\_grid_i&]:[border-color:transparent] [.sw-cal_i&]:[background:var(--purple)] [.sw-cal_i&]:[color:#fff] [.sw-wells_i&]:[background:#e2d9ff] [.sw-wells_i&]:[border-color:#c9b8ff] [.sw-shot_i&]:[background:var(--purple)] [.sw-shot_i&]:[border-color:var(--purple)] [.lf\_\_seg_button&]:[color:#fff] [.tc\_\_why_li&]:[opacity:1] [.sl\_\_tabs_button&]:[color:#fff] [.ar\_\_toc_a&]:[color:var(--ink-2)] [.ct-needs_button&]:[color:#fff] [.wa\_\_zones_li&]:[background:var(--grad)] [.wa\_\_zones_li&]:[border-color:transparent] [.wa\_\_zones_li&_small]:[color:#fff] [.wa\_\_zones_li&_b]:[color:#fff] [.wa\_\_zones_li&_em]:[color:#fff] [.se\_\_dots_i&]:[background:var(--purple)] [.ct-needs_button&]:[background:var(--grad)] [.ct-needs_button&]:[border-color:transparent] [.sc-cal_i&]:[background:var(--purple)] [.sc-cal_i&]:[color:#fff] [.ccp_button&]:[background:var(--purple)] [.ccp_button&]:[color:#fff] [.pa-art\_\_seg_button&]:[background:var(--grad)] [.pa-art\_\_seg_button&]:[color:#fff] [.pa-art\_\_steps_li&]:[background:var(--purple)] [.pa-art\_\_steps_li&]:[border-color:var(--purple)] [.pa-art\_\_steps_li&]:[color:#fff] [.ab-orbit\_\_rings_line&]:[stroke:var(--purple)] [.ab-orbit\_\_rings_line&]:[stroke-width:2]` : ''} onClick={() => setCoverStyle(id)}>{l}</button>
      ))}
    </div>
  );
}

export function Card({ a, k, still }: { a: Article; k: number; still?: boolean }) {
  const on = live(a);
  const enter = still ? {} : { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: vp, transition: { duration: 0.8, ease: ease.out, delay: (k % 3) * 0.08 } };
  return (
    <motion.article className={String.raw`bk [display:flex] [flex-direction:column] [border-radius:2.4rem] [border:1px_solid_#ece8fa] [background:#fff] [overflow:hidden] [cursor:pointer] [transition:transform_0.5s_cubic-bezier(.16,1,.3,1),_box-shadow_0.5s] [&:not(.is-soon):hover]:[transform:translateY(-0.6rem)] [&:not(.is-soon):hover]:[box-shadow:0_2.4rem_6rem_rgba(106,_65,_249,_0.12)] [&.is-soon]:[cursor:default] ${on ? '' : 'is-soon'}`} onClick={() => on && go(`/blog/${a.slug}`)} {...enter}>
      <Cover a={a} />
      <div className="bk__body [@media(max-width:_1279px)]:[font-size:16px]! [@media(max-width:_1279px)]:[line-height:1.6] [display:flex] [flex-direction:column] [gap:1.2rem] [padding:2.8rem] [flex:1] [&_h3]:[font-weight:500] [&_h3]:[font-size:2.4rem] [&_h3]:[line-height:1.2] [&_h3]:[letter-spacing:-0.04rem] [&_h3]:[color:var(--ink-2)] [&_p]:[font-size:1.6rem] [&_p]:[line-height:1.55] [&_p]:[color:#5b5f72]">
        <small className="bk__meta [font-family:var(--f-mono)] [font-size:1.2rem] [text-transform:uppercase] [letter-spacing:0.06em] [color:#8a8ea0]">{a.topic} · {a.read}</small>
        <h3>{a.title}</h3>
        <p>{a.dek}</p>
        {on && <span className="cs__more [margin-top:auto] [padding-top:1.2rem] [display:inline-flex] [align-items:center] [gap:0.6rem] [font-weight:500] [font-size:1.7rem] [color:var(--purple)] [&_svg]:[transition:transform_0.4s_cubic-bezier(.16,1,.3,1)] [.cs\_\_card:hover_&_svg]:[transform:translateX(0.5rem)]">Read article <ArrowRight size={18} /></span>}
      </div>
    </motion.article>
  );
}

export function BlogHub() {
  const [t, setT] = useState<string>('All');
  const [all, setAll] = useState(false);
  const feat = ARTICLES[0];
  const rest = ARTICLES.slice(1).filter((a) => t === 'All' || a.topic === t);
  useEffect(() => setMeta('Medical Billing Blog', 'Plain-English guides on prior auth, coding, denials, credentialing and A/R for medical practices.'), []);
  return (
    <main className="page [overflow-x:clip] [@media(max-width:_640px)]:[&:has(.mbar)]:[padding-bottom:7.2rem]">
      <section className="bh container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [display:grid] [grid-template-columns:minmax(0,_0.9fr)_minmax(0,_1.1fr)] [gap:6rem] [align-items:center] [padding-top:14rem] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1279px)]:[padding-top:12rem] [@media(max-width:_1279px)]:[gap:4rem]">
        <div className="bh__copy [display:flex] [flex-direction:column] [gap:2.8rem]">
          <motion.p className="eyebrow [font-family:var(--f-mono)] [font-size:1.6rem] [line-height:1.4] [text-transform:uppercase] [color:var(--ink)] [letter-spacing:0.02em] [.hero\_\_copy_&]:[margin-bottom:1.2rem] [.stmac\_\_intro_&]:[grid-column:1_/_-1]" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: ease.out, delay: 0.2 }}>/ Blog</motion.p>
          <SplitWords as="h1" className="page-title [font-weight:500] [font-size:6.12rem] [line-height:1.06] [letter-spacing:-0.18rem] [color:var(--ink-3)] [@media(max-width:_1279px)]:[font-size:4.32rem]" animateNow delay={0.3} stagger={0.05} lines={['Billing, explained', 'in plain English.']} bold={['English.']} />
          <motion.p className="page-sub [font-size:1.8rem] [line-height:1.6] [color:#4a4f63] [max-width:56rem] [.ab-hero\_\_copy_&]:[max-width:64rem]" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.75 }}>
            Rule changes, coding traps and denial fixes, written by the people who work them every day. Short, sourced, and useful at the front desk.
          </motion.p>
        </div>
        <motion.article className="bf [display:grid] [grid-template-columns:minmax(0,_0.9fr)_minmax(0,_1fr)] [border-radius:3.2rem] [border:1px_solid_#ece8fa] [background:#fff] [overflow:hidden] [cursor:pointer] [box-shadow:0_3rem_8rem_-2rem_rgba(57,_28,_160,_0.16)] [transition:transform_0.6s_cubic-bezier(.16,1,.3,1)] [&:hover]:[transform:translateY(-0.6rem)] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)]" onClick={() => go(`/blog/${feat.slug}`)} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: ease.out, delay: 0.4 }}>
          <BlogArt />
          <div className="bf__body [@media(max-width:_1279px)]:[font-size:16px]! [@media(max-width:_1279px)]:[line-height:1.6] [display:flex] [flex-direction:column] [gap:1.6rem] [padding:4rem] [&_h2]:[font-weight:500] [&_h2]:[font-size:3.2rem] [&_h2]:[line-height:1.15] [&_h2]:[letter-spacing:-0.06rem] [&_h2]:[color:var(--ink-2)] [&_p]:[font-size:1.7rem] [&_p]:[line-height:1.55] [&_p]:[color:#5b5f72] [@media(max-width:_1279px)]:[padding:2.8rem] [@media(max-width:_1279px)]:[&_h2]:[font-size:2.6rem]">
            <small className="bk__meta [font-family:var(--f-mono)] [font-size:1.2rem] [text-transform:uppercase] [letter-spacing:0.06em] [color:#8a8ea0]"><span className="bf__new [display:inline-block] [margin-right:0.6rem] [padding:0.3rem_0.8rem] [border-radius:2rem] [color:#fff] [background:var(--grad)] [border-color:transparent]">Latest</span> {feat.topic} · {feat.date} · {feat.read}</small>
            <h2>{feat.title}</h2>
            <p>{feat.dek}</p>
            <span className="cs__more [margin-top:auto] [padding-top:1.2rem] [display:inline-flex] [align-items:center] [gap:0.6rem] [font-weight:500] [font-size:1.7rem] [color:var(--purple)] [&_svg]:[transition:transform_0.4s_cubic-bezier(.16,1,.3,1)] [.cs\_\_card:hover_&_svg]:[transform:translateX(0.5rem)]">Read article <ArrowRight size={18} /></span>
          </div>
        </motion.article>
      </section>

      <section className="bl container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [padding-top:12rem] [@media(max-width:_1279px)]:[padding-top:8rem]">
        <div className="bl__head [display:flex] [flex-direction:column] [gap:2.4rem]">
          <Eyebrow>/ All articles</Eyebrow>
          <LayoutGroup>
            <div className="need__chips bl__chips [display:flex] [flex-wrap:wrap] [gap:1.2rem] [margin-top:0]" role="tablist">
              {TOPICS.map((x) => (
                <button key={x} role="tab" aria-selected={t === x} className={String.raw`need__chip [position:relative] [padding:1.4rem_2.4rem] [border-radius:6rem] [border:1px_solid_#e3def5] [font-size:1.8rem] [color:var(--ink-2)] [isolation:isolate] [transition:color_0.35s_0.08s,_border-color_0.35s] [&>span:not(.need\_\_pill)]:[position:relative] [&>span:not(.need\_\_pill)]:[z-index:1] [&.is-on]:[color:#fff] [&.is-on]:[border-color:var(--purple)] [&:focus-visible]:[outline:2px_solid_var(--purple)] [&:focus-visible]:[outline-offset:3px]! [@media(max-width:_1279px)]:[.xi\_\_chips_&]:[flex:0_0_auto] [@media(max-width:_1279px)]:[.xi\_\_chips_&]:[white-space:nowrap] [@media(max-width:_1279px)]:[.xi\_\_chips_&]:[font-size:1.6rem] [@media(max-width:_1279px)]:[.xi\_\_chips_&]:[padding:1.2rem_2rem] ${t === x ? String.raw`is-on [.assess\_\_steps_span&]:[color:var(--navy)] [.assess\_\_steps_span&_b]:[background:var(--purple)] [.assess\_\_steps_span&_b]:[border-color:var(--purple)] [.assess\_\_steps_span&_b]:[color:#fff] [.assess\_\_steps_i&::after]:[transform:scaleX(1)] [.cx-read\_\_n_i&]:[width:2.4rem] [.cx-read\_\_n_i&]:[background:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [.sg\_\_toc_button&]:[color:var(--purple)] [.sg\_\_toc_button&]:[border-left-color:var(--purple)] [.pg\_\_toc_button&]:[color:#fff] [.pg\_\_toc_button&_small]:[color:rgba(255,_255,_255,_0.7)] [.pg\_\_dots_i&]:[width:2.4rem] [.pg\_\_dots_i&]:[background:var(--purple)] [.stfd\_\_tabs_button&]:[color:#fff] [.se\_\_dots_i&]:[width:6.4rem] [.sw-anes\_\_bar_i&]:[background:var(--grad)] [.sw-body_circle&]:[fill:var(--purple)] [.sw-vial\_\_body_i&]:[background:var(--grad)] [.sw-vial\_\_body_i&_small]:[color:#fff] [.sw-wound\_\_grid_i&]:[background:#c9b8ff] [.sw-wound\_\_grid_i&]:[border-color:transparent] [.sw-cal_i&]:[background:var(--purple)] [.sw-cal_i&]:[color:#fff] [.sw-wells_i&]:[background:#e2d9ff] [.sw-wells_i&]:[border-color:#c9b8ff] [.sw-shot_i&]:[background:var(--purple)] [.sw-shot_i&]:[border-color:var(--purple)] [.lf\_\_seg_button&]:[color:#fff] [.tc\_\_why_li&]:[opacity:1] [.sl\_\_tabs_button&]:[color:#fff] [.ar\_\_toc_a&]:[color:var(--ink-2)] [.ct-needs_button&]:[color:#fff] [.wa\_\_zones_li&]:[background:var(--grad)] [.wa\_\_zones_li&]:[border-color:transparent] [.wa\_\_zones_li&_small]:[color:#fff] [.wa\_\_zones_li&_b]:[color:#fff] [.wa\_\_zones_li&_em]:[color:#fff] [.se\_\_dots_i&]:[background:var(--purple)] [.ct-needs_button&]:[background:var(--grad)] [.ct-needs_button&]:[border-color:transparent] [.sc-cal_i&]:[background:var(--purple)] [.sc-cal_i&]:[color:#fff] [.ccp_button&]:[background:var(--purple)] [.ccp_button&]:[color:#fff] [.pa-art\_\_seg_button&]:[background:var(--grad)] [.pa-art\_\_seg_button&]:[color:#fff] [.pa-art\_\_steps_li&]:[background:var(--purple)] [.pa-art\_\_steps_li&]:[border-color:var(--purple)] [.pa-art\_\_steps_li&]:[color:#fff] [.ab-orbit\_\_rings_line&]:[stroke:var(--purple)] [.ab-orbit\_\_rings_line&]:[stroke-width:2]` : ''}`} onClick={() => setT(x)}>
                  {t === x && <motion.span layoutId="bl-pill" className="need__pill [position:absolute] [inset:-1px] [border-radius:6rem] [z-index:0] [background:var(--grad)]" transition={{ type: 'spring', stiffness: 260, damping: 32 }} />}
                  <span>{x}</span>
                </button>
              ))}
            </div>
          </LayoutGroup>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={t} className={String.raw`bl__grid [@media(max-width:_767px)]:[&:not(.is-all)>:nth-child(n+4)]:[display:none] [display:grid] [grid-template-columns:repeat(3,_minmax(0,_1fr))] [gap:2.4rem] [margin-top:3.2rem] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)] ${all ? 'is-all' : ''}`} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: ease.out } }} exit={{ opacity: 0, y: -6, transition: { duration: 0.2, ease: 'easeIn' } }}>
            {rest.length ? rest.map((a, k) => <Card key={a.slug} a={a} k={k} still={t !== 'All'} />) : <p className="bl__none [grid-column:1_/_-1] [font-size:2rem] [color:#6b6f7c] [padding:4rem_0]">Nothing on this topic yet. It’s on the list.</p>}
          </motion.div>
        </AnimatePresence>
        {!all && rest.length > 3 && <button type="button" className="bl__more [display:none] [@media(max-width:_767px)]:[display:flex] [@media(max-width:_767px)]:[justify-content:center] [@media(max-width:_767px)]:[width:100%] [@media(max-width:_767px)]:[margin-top:2rem] [@media(max-width:_767px)]:[padding:1.4rem] [@media(max-width:_767px)]:[border-radius:3rem] [@media(max-width:_767px)]:[border:1px_solid_var(--lav-border)] [@media(max-width:_767px)]:[color:var(--purple)] [@media(max-width:_767px)]:[font-weight:600] [@media(max-width:_767px)]:[font-size:1.6rem]" onClick={() => setAll(true)}>Show all {rest.length} articles</button>}
        <CoverPicker />
      </section>

      <section className="nl container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [padding-top:14rem] [@media(max-width:_1279px)]:[padding-top:10rem]">
        <Reveal className="nl__panel [position:relative] [isolation:isolate] [overflow:hidden] [display:grid] [grid-template-columns:minmax(0,_1fr)_minmax(0,_1fr)] [gap:6rem] [align-items:center] [padding:6.4rem] [border-radius:4rem] [border:1px_solid_rgba(106,_65,_249,_0.14)] [&::before]:[content:''] [&::before]:[position:absolute] [&::before]:[inset:0] [&::before]:[z-index:-1] [&::before]:[background:rgba(255,_255,_255,_0.7)] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1279px)]:[padding:3.2rem_2rem] [@media(max-width:_1279px)]:[gap:3.2rem] [@media(max-width:_1279px)]:[border-radius:2.8rem]">
          <div className="sl__bg [position:absolute] [inset:0] [z-index:-2] [overflow:hidden] [&_img]:[position:absolute] [&_img]:[inset:-4%] [&_img]:[width:108%] [&_img]:[height:108%] [&_img]:[max-width:none] [&_img]:[object-fit:cover] [&_img]:[animation:jy-drift_26s_ease-in-out_infinite_alternate]" aria-hidden><img src={fluted} alt="" /></div>
          <div className="nl__copy [display:flex] [flex-direction:column] [gap:1.2rem]">
            <Eyebrow>/ The billing briefing</Eyebrow>
            <SplitWords className="h-56 [font-weight:500] [font-size:5.6rem] [line-height:1.08] [letter-spacing:-0.12rem] [color:var(--ink-2)] [text-wrap:balance] [@media(max-width:_1279px)]:[font-size:3.8rem] [@media(max-width:_640px)]:[font-size:3.4rem]" lines={['One email a month.', 'Only what changed.']} stagger={0.04} />
            <p className="body-18 [font-size:1.8rem] [line-height:1.6] [color:var(--navy)] [.testi\_\_intro_&]:[margin-top:0.8rem] [.faq\_\_intro_&]:[margin-top:0.8rem] [@media(max-width:_1279px)]:[font-size:16px]! [@media(max-width:_1279px)]:[line-height:1.6] [.tk\_\_head_&]:[margin-top:0.8rem] [.tk\_\_head_&]:[max-width:52rem] [.pw\_\_head_&]:[max-width:60rem] [.pw\_\_head_&]:[color:#4a4f63] [.ac\_\_copy_&]:[margin-top:0.8rem] [.mdef\_\_head_&]:[margin-top:0.8rem] [.mdef\_\_head_&]:[max-width:48rem] [.nl\_\_copy_&]:[margin-top:0.8rem]">Payer rule changes, new codes and the denial trends we’re seeing, in five minutes.</p>
          </div>
          <form className="nl__form [&_label]:[font-size:1.5rem] [&_label]:[color:var(--ink-2)] [&>div]:[display:flex] [&>div]:[gap:0.8rem] [&>div]:[margin-top:1rem] [&>div]:[padding:0.8rem] [&>div]:[border-radius:4rem] [&>div]:[background:#fff] [&>div]:[border:1px_solid_var(--lav-border)] [&_input]:[flex:1] [&_input]:[min-width:0] [&_input]:[border:0] [&_input]:[outline:0] [&_input]:[padding:0_1.6rem] [&_input]:[font-family:inherit] [&_input]:[font-weight:inherit] [&_input]:[font-style:inherit] [&_input]:[line-height:inherit] [&_input]:[font-size:1.7rem] [&_input]:[background:transparent] [&_button]:[padding:1.4rem_2.6rem] [&_button]:[border-radius:4rem] [&_button]:[color:#fff] [&_button]:[font-weight:500] [&_button]:[font-size:1.7rem] [&_small]:[display:block] [&_small]:[margin-top:1rem] [&_small]:[font-size:1.3rem] [&_small]:[color:#6b6f7c] [&_button]:[background:var(--grad)]" onSubmit={(e) => { e.preventDefault(); (e.currentTarget.querySelector('button') as HTMLButtonElement).textContent = 'Subscribed ✓'; }}>
            <label htmlFor="nl-email">Work email</label>
            <div><input id="nl-email" type="email" required placeholder="you@yourpractice.com" /><button type="submit">Subscribe</button></div>
            <small>No spam. Unsubscribe any time.</small>
          </form>
        </Reveal>
      </section>

      <CTA eyebrow="/ Rather talk it through?" lines={['Ask a billing specialist.', 'Free, no obligation.']} />
    </main>
  );
}

/* ================= Article ================= */
function Body({ b }: { b: Block }) {
  switch (b.t) {
    case 'p': return <p>{b.text}</p>;
    case 'h2': return <h2 id={b.id}>{b.text}</h2>;
    case 'list': return <ul>{b.items.map((x) => <li key={x}>{x}</li>)}</ul>;
    case 'callout': return <aside className="ar__callout [padding:2.8rem_3.2rem] [border-radius:2rem] [background:var(--panel)] [border-left:4px_solid_var(--purple)] [&_b]:[display:block] [&_b]:[font-weight:600] [&_b]:[font-size:1.8rem] [&_b]:[color:var(--purple)] [&_p]:[margin-top:0.6rem] [&_p]:[font-size:1.8rem]"><b>{b.title}</b><p>{b.text}</p></aside>;
    case 'stat': return <figure className="ar__stat [display:grid] [grid-template-columns:auto_1fr] [gap:3.2rem] [align-items:center] [padding:3.2rem_0] [border-top:1px_solid_#ece8f7] [border-bottom:1px_solid_#ece8f7] [&_b]:[font-weight:500] [&_b]:[font-size:12rem] [&_b]:[line-height:0.9] [&_b]:[letter-spacing:-0.5rem] [&_b]:[color:var(--purple)] [&_figcaption]:[font-size:2.2rem] [&_figcaption]:[line-height:1.35] [&_figcaption]:[color:var(--ink-2)] [&_small]:[display:block] [&_small]:[margin-top:1rem] [&_small]:[font-family:var(--f-mono)] [&_small]:[font-size:1.25rem] [&_small]:[color:#8a8ea0] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1279px)]:[gap:1.2rem] [@media(max-width:_1279px)]:[&_b]:[font-size:9rem]"><b>{b.value}</b><figcaption>{b.text}<small>{b.source}</small></figcaption></figure>;
    case 'timeline': return (
      <ol className="ar__tl [list-style:none] [position:relative] [padding-left:3.2rem] [&::before]:[content:''] [&::before]:[position:absolute] [&::before]:[left:0.7rem] [&::before]:[top:0.8rem] [&::before]:[bottom:0.8rem] [&::before]:[width:2px] [&::before]:[background:linear-gradient(#b7a3ff,_var(--purple))] [&_li]:[position:relative] [&_li+li]:[margin-top:2rem] [&_li::before]:[content:''] [&_li::before]:[position:absolute] [&_li::before]:[left:-3.2rem] [&_li::before]:[top:0.6rem] [&_li::before]:[width:1.6rem] [&_li::before]:[height:1.6rem] [&_li::before]:[border-radius:50%] [&_li::before]:[background:#fff] [&_li::before]:[border:3px_solid_var(--purple)] [&_time]:[font-family:var(--f-mono)] [&_time]:[font-size:1.4rem] [&_time]:[text-transform:uppercase] [&_time]:[letter-spacing:0.04em] [&_time]:[color:var(--purple)] [&_p]:[margin-top:0.4rem]">{b.items.map(([d, x], i) => (
        <motion.li key={d} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.6, ease: ease.out, delay: i * 0.08 }}>
          <time>{d}</time><p>{x}</p>
        </motion.li>
      ))}</ol>
    );
    case 'table': return (
      <div className="ar__table [overflow-x:auto] [border-radius:1.6rem] [border:1px_solid_#ece8f7] [&_table]:[width:100%] [&_table]:[border-collapse:collapse] [&_table]:[font-size:1.7rem] [&_th]:[text-align:left] [&_th]:[padding:1.4rem_2rem] [&_th]:[background:var(--panel)] [&_th]:[font-family:var(--f-mono)] [&_th]:[font-weight:400] [&_th]:[font-size:1.3rem] [&_th]:[text-transform:uppercase] [&_th]:[letter-spacing:0.04em] [&_th]:[color:#6b6f7c] [&_td]:[padding:1.6rem_2rem] [&_td]:[border-top:1px_solid_#ece8f7] [&_td]:[vertical-align:top] [&_td:first-child]:[font-weight:600] [&_td:first-child]:[color:var(--ink-2)] [&_td:first-child]:[white-space:nowrap] [@media(max-width:_1279px)]:[&_td:first-child]:[white-space:normal]"><table><thead><tr>{b.head.map((h) => <th key={h}>{h}</th>)}</tr></thead>
        <tbody>{b.rows.map((r) => <tr key={r[0]}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>)}</tbody></table></div>
    );
  }
}

export function ArticlePage({ slug }: { slug: string }) {
  const a = getArticle(slug)!;
  const { scrollYProgress } = useScroll();
  const prog = useSpring(scrollYProgress, { stiffness: 120, damping: 26 });
  const toc = (a.body ?? []).filter((b): b is Extract<Block, { t: 'h2' }> => b.t === 'h2');
  const [act, setAct] = useState(toc[0]?.id);
  const bodyRef = useRef<HTMLDivElement>(null);
  useEffect(() => setMeta(a.title, a.dek), [a]);
  useEffect(() => {
    const els = toc.map((t) => document.getElementById(t.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver((es) => { es.forEach((e) => { if (e.isIntersecting) setAct(e.target.id); }); }, { rootMargin: '-30% 0px -60% 0px' });
    els.forEach((e) => io.observe(e)); return () => io.disconnect();
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps
  const more = ARTICLES.filter((x) => x.slug !== slug).slice(0, 3);
  return (
    <main className="page [overflow-x:clip] [@media(max-width:_640px)]:[&:has(.mbar)]:[padding-bottom:7.2rem]">
      <motion.div className="ar__prog [will-change:transform] [position:fixed] [left:0] [right:0] [top:0] [height:0.4rem] [z-index:60] [background:linear-gradient(90deg,_#b7a3ff,_var(--purple))] [transform-origin:left]" style={{ scaleX: prog }} aria-hidden />
      <header className="ar__head container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [padding-top:16rem] [max-width:132rem] [display:flex] [flex-direction:column] [gap:2.4rem] [@media(max-width:_1279px)]:[padding-top:12rem]">
        <motion.nav className="crumbs [display:flex] [align-items:center] [gap:1rem] [font-family:var(--f-mono)] [font-size:1.4rem] [text-transform:uppercase] [letter-spacing:0.04em] [color:#8a8ea0] [&_a]:[display:inline-flex] [&_a]:[align-items:center] [&_a]:[gap:0.4rem] [&_a]:[color:var(--purple)]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} aria-label="Breadcrumb">
          <Link to="/blog"><ChevronLeft size={16} /> Blog</Link><span>/</span><span>{a.topic}</span>
        </motion.nav>
        <SplitWords as="h1" className="page-title ar__title [font-weight:500] [line-height:1.06] [letter-spacing:-0.18rem] [color:var(--ink-3)] [font-size:5.6rem] [@media(max-width:_1279px)]:[font-size:3.8rem]" animateNow delay={0.3} stagger={0.03} lines={[a.title]} />
        <motion.p className="page-sub ar__dek [line-height:1.6] [color:#4a4f63] [max-width:80rem] [font-size:2rem] [.ab-hero\_\_copy_&]:[max-width:64rem]" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.6 }}>{a.dek}</motion.p>
        <motion.p className="ar__meta [display:inline-flex] [align-items:center] [gap:0.6rem] [font-family:var(--f-mono)] [font-size:1.3rem] [text-transform:uppercase] [letter-spacing:0.04em] [color:#8a8ea0] [@media(max-width:_640px)]:[flex-wrap:wrap]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>{a.author} · {a.date} · <Clock size={14} /> {a.read}</motion.p>
      </header>
      <div className="ar__wrap container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [display:grid] [grid-template-columns:30rem_minmax(0,_76rem)] [gap:8rem] [margin-top:6rem] [padding-top:5rem] [border-top:1px_solid_#ece8f7] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1279px)]:[gap:3.2rem] [@media(max-width:_1279px)]:[margin-top:3.2rem] [@media(max-width:_1279px)]:[padding-top:3.2rem]">
        <aside className="ar__toc [position:sticky] [top:12rem] [align-self:start] [display:flex] [flex-direction:column] [gap:0.4rem] [&>small]:[font-family:var(--f-mono)] [&>small]:[font-size:1.2rem] [&>small]:[text-transform:uppercase] [&>small]:[letter-spacing:0.06em] [&>small]:[color:#8a8ea0] [&>small]:[margin-bottom:1rem] [&_a]:[position:relative] [&_a]:[padding:0.8rem_0_0.8rem_1.6rem] [&_a]:[font-size:1.6rem] [&_a]:[line-height:1.35] [&_a]:[color:#6b6f7c] [&_a]:[transition:color_0.3s] [&_a::before]:[content:''] [&_a::before]:[position:absolute] [&_a::before]:[left:0] [&_a::before]:[top:0] [&_a::before]:[bottom:0] [&_a::before]:[width:2px] [&_a::before]:[background:#ece8f7] [&_a_i]:[position:absolute] [&_a_i]:[left:0] [&_a_i]:[top:0] [&_a_i]:[bottom:0] [&_a_i]:[width:2px] [&_a_i]:[background:var(--purple)] [&_a_i]:[z-index:1] [@media(max-width:_1279px)]:[position:static]" aria-label="On this page">
          <small>On this page</small>
          {toc.map((t) => (
            <a key={t.id} href={`#${t.id}`} className={act === t.id ? String.raw`is-on [.assess\_\_steps_span&]:[color:var(--navy)] [.assess\_\_steps_span&_b]:[background:var(--purple)] [.assess\_\_steps_span&_b]:[border-color:var(--purple)] [.assess\_\_steps_span&_b]:[color:#fff] [.assess\_\_steps_i&::after]:[transform:scaleX(1)] [.cx-read\_\_n_i&]:[width:2.4rem] [.cx-read\_\_n_i&]:[background:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [.sg\_\_toc_button&]:[color:var(--purple)] [.sg\_\_toc_button&]:[border-left-color:var(--purple)] [.pg\_\_toc_button&]:[color:#fff] [.pg\_\_toc_button&_small]:[color:rgba(255,_255,_255,_0.7)] [.pg\_\_dots_i&]:[width:2.4rem] [.pg\_\_dots_i&]:[background:var(--purple)] [.stfd\_\_tabs_button&]:[color:#fff] [.se\_\_dots_i&]:[width:6.4rem] [.sw-anes\_\_bar_i&]:[background:var(--grad)] [.sw-body_circle&]:[fill:var(--purple)] [.sw-vial\_\_body_i&]:[background:var(--grad)] [.sw-vial\_\_body_i&_small]:[color:#fff] [.sw-wound\_\_grid_i&]:[background:#c9b8ff] [.sw-wound\_\_grid_i&]:[border-color:transparent] [.sw-cal_i&]:[background:var(--purple)] [.sw-cal_i&]:[color:#fff] [.sw-wells_i&]:[background:#e2d9ff] [.sw-wells_i&]:[border-color:#c9b8ff] [.sw-shot_i&]:[background:var(--purple)] [.sw-shot_i&]:[border-color:var(--purple)] [.lf\_\_seg_button&]:[color:#fff] [.tc\_\_why_li&]:[opacity:1] [.sl\_\_tabs_button&]:[color:#fff] [.ar\_\_toc_a&]:[color:var(--ink-2)] [.ct-needs_button&]:[color:#fff] [.wa\_\_zones_li&]:[background:var(--grad)] [.wa\_\_zones_li&]:[border-color:transparent] [.wa\_\_zones_li&_small]:[color:#fff] [.wa\_\_zones_li&_b]:[color:#fff] [.wa\_\_zones_li&_em]:[color:#fff] [.se\_\_dots_i&]:[background:var(--purple)] [.ct-needs_button&]:[background:var(--grad)] [.ct-needs_button&]:[border-color:transparent] [.sc-cal_i&]:[background:var(--purple)] [.sc-cal_i&]:[color:#fff] [.ccp_button&]:[background:var(--purple)] [.ccp_button&]:[color:#fff] [.pa-art\_\_seg_button&]:[background:var(--grad)] [.pa-art\_\_seg_button&]:[color:#fff] [.pa-art\_\_steps_li&]:[background:var(--purple)] [.pa-art\_\_steps_li&]:[border-color:var(--purple)] [.pa-art\_\_steps_li&]:[color:#fff] [.ab-orbit\_\_rings_line&]:[stroke:var(--purple)] [.ab-orbit\_\_rings_line&]:[stroke-width:2]` : ''} onClick={(e) => { e.preventDefault(); document.getElementById(t.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>
              {act === t.id && <motion.i layoutId="toc-bar" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}{t.text}
            </a>
          ))}
          <div className="ar__toc-cta [margin-top:3.2rem] [padding:2.4rem] [border-radius:2rem] [background:var(--panel)] [border:1px_solid_#efebfb] [display:flex] [flex-direction:column] [gap:1.6rem] [&_p]:[font-size:1.6rem] [&_p]:[color:var(--ink-2)] [@media(max-width:_1279px)]:[display:none]">
            <p>Want us to handle this for you?</p>
            <Button>Get a free assessment</Button>
          </div>
        </aside>
        <article className="ar__body [font-size:1.9rem] [line-height:1.7] [color:#2c2f40] [&>*+*]:[margin-top:2.4rem] [&_h2]:[margin-top:5.6rem] [&_h2]:[font-weight:500] [&_h2]:[font-size:3.2rem] [&_h2]:[line-height:1.2] [&_h2]:[letter-spacing:-0.06rem] [&_h2]:[color:var(--ink-2)] [&_h2]:[scroll-margin-top:12rem] [&_ul]:[padding-left:2.4rem] [&_ul]:[list-style:none] [&_ul_li]:[position:relative] [&_ul_li]:[padding-left:0.8rem] [&_ul_li+li]:[margin-top:1rem] [&_ul_li::before]:[content:''] [&_ul_li::before]:[position:absolute] [&_ul_li::before]:[left:-1.6rem] [&_ul_li::before]:[top:1.2rem] [&_ul_li::before]:[width:0.8rem] [&_ul_li::before]:[height:0.8rem] [&_ul_li::before]:[border-radius:50%] [&_ul_li::before]:[background:var(--purple)] [@media(max-width:_1279px)]:[font-size:1.8rem]" ref={bodyRef}>
          {(a.body ?? []).map((b, i) => <Body key={i} b={b} />)}
          {a.sources && (
            <section className="ar__src [margin-top:5.6rem]! [padding-top:3.2rem] [border-top:1px_solid_#ece8f7] [&_h3]:[font-family:var(--f-mono)] [&_h3]:[font-weight:400] [&_h3]:[font-size:1.3rem] [&_h3]:[text-transform:uppercase] [&_h3]:[letter-spacing:0.06em] [&_h3]:[color:#8a8ea0] [&_ol]:[margin-top:1.2rem] [&_ol]:[padding-left:2rem] [&_ol]:[font-size:1.6rem] [&_a]:[color:var(--purple)] [&_a]:[display:inline-flex] [&_a]:[align-items:center] [&_a]:[gap:0.4rem]">
              <h3>Sources</h3>
              <ol>{a.sources.map(([t, u]) => <li key={u}><a href={u} target="_blank" rel="noopener noreferrer">{t} <ExternalLink size={13} /></a></li>)}</ol>
            </section>
          )}
        </article>
      </div>
      <section className="bl container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [padding-top:12rem] [@media(max-width:_1279px)]:[padding-top:8rem]">
        <div className="bl__head [display:flex] [flex-direction:column] [gap:2.4rem]"><Eyebrow>/ Keep reading</Eyebrow></div>
        <div className="bl__grid [@media(max-width:_767px)]:[&:not(.is-all)>:nth-child(n+4)]:[display:none] [display:grid] [grid-template-columns:repeat(3,_minmax(0,_1fr))] [gap:2.4rem] [margin-top:3.2rem] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)]">{more.map((m, k) => <Card key={m.slug} a={m} k={k} />)}</div>
      </section>
      <CTA eyebrow="/ Rather hand it off?" lines={['We’ll handle the paperwork.', 'You handle the patients.']} />
    </main>
  );
}
