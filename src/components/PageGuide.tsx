/**
 * Content fold for child pages (services, specialties, states): a long-read guide built for SEO and
 * answer engines (AEO). It opens with a 40–60 word direct answer, then question-shaped H3s that each
 * answer themselves in the first sentence, so the text can be quoted on its own. All copy is plain HTML
 * (no hover or tab needed), which also keeps it in the server-rendered markup in the Next.js build.
 * Content is assembled from each page's own data, so every page reads differently.
 */
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Sparkles } from 'lucide-react';
import { Eyebrow } from './ui';
import { Link } from '../router';
import type { ServiceFull } from '../data/services';
import type { SpecialtyFull } from '../data/specialties';
import { getSpecialtyLite } from '../data/specialties';
import type { StatePage } from '../data/states';

type Sec = { id: string; title: string; body: ReactNode };
type Guide = { key: string; tocTitle: string; title: string; answer: string; secs: Sec[]; cta: [string, string] };

/** lowercase a phrase's first word unless it's an acronym (ECG, MRI, CT) */
const soft = (t: string) => (/^[A-Z][a-z]/.test(t) ? t.charAt(0).toLowerCase() + t.slice(1) : t);
const strip = (t: string) => t.replace(/\s*\[Confirm with Affinity Core\]/g, '');
const words = (g: Guide) => g.answer.split(' ').length + g.secs.length * 140;

export function PageGuide({ g }: { g: Guide }) {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const bodyRef = useRef<HTMLDivElement>(null);
  const n = g.secs.length;
  const go = (k: number) => { const nk = (k + n) % n; setDir(nk > i ? 1 : -1); setI(nk); bodyRef.current?.scrollTo({ top: 0 }); };
  const mins = Math.max(3, Math.round(words(g) / 220));
  // The chapter pane keeps the wheel only while it can still scroll that way; otherwise the page scrolls.
  // (Lenis skips events whose path carries data-lenis-prevent, so it is toggled per wheel event.)
  useEffect(() => {
    const el = bodyRef.current; if (!el) return;
    const onWheel = (e: WheelEvent) => {
      const room = e.deltaY > 0 ? el.scrollHeight - el.clientHeight - el.scrollTop > 1 : e.deltaY < 0 ? el.scrollTop > 0 : false;
      if (room) el.setAttribute('data-lenis-prevent', ''); else el.removeAttribute('data-lenis-prevent');
    };
    el.addEventListener('wheel', onWheel, { passive: true });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);
  return (
    <section className="pg container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [padding-top:12rem] [@media(max-width:_1279px)]:[padding-top:8rem]" aria-labelledby={`pg-${g.key}-t`} id="guide">
      <div className="pg__panel [position:relative] [display:grid] [grid-template-columns:46rem_minmax(0,_1fr)] [height:min(78rem,_calc(100svh_-_14rem))] [min-height:60rem] [border-radius:3.2rem] [overflow:hidden] [background:#fff] [border:1px_solid_#ece8fa] [box-shadow:0_3rem_8rem_rgba(106,_65,_249,_0.08)] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1279px)]:[grid-template-rows:auto_minmax(0,_1fr)] [@media(max-width:_1279px)]:[height:auto] [@media(max-width:_1279px)]:[min-height:0] [@media(max-width:_1279px)]:[border-radius:2.4rem]">
        {/* Left rail: title, the AEO answer, chapter list */}
        <aside className="pg__rail [position:relative] [display:flex] [flex-direction:column] [gap:2rem] [padding:4rem_3.6rem] [overflow-y:auto] [scrollbar-width:none] [background:var(--u2)_right_bottom_/_46rem_46rem_no-repeat,_radial-gradient(40rem_32rem_at_100%_100%,_rgba(122,_85,_255,_0.18),_transparent_70%),_radial-gradient(48rem_36rem_at_0%_0%,_rgba(122,_85,_255,_0.12),_transparent_65%),_linear-gradient(180deg,_#f8f6ff,_#f3efff)] [border-right:1px_solid_#ece8fa] [&::-webkit-scrollbar]:[display:none] [@media(max-width:_1279px)]:[padding:2.8rem_2.2rem_2rem] [@media(max-width:_1279px)]:[gap:1.6rem] [@media(max-width:_1279px)]:[border-right:0] [@media(max-width:_1279px)]:[border-bottom:1px_solid_#ece8fa] [@media(max-width:_1279px)]:[overflow:visible]">
          <div className="pg__rail-top [display:flex] [align-items:center] [justify-content:space-between] [gap:1.2rem] [flex-wrap:wrap]">
            <Eyebrow>/ The guide</Eyebrow>
            <span className="pg__read [display:inline-flex] [align-items:center] [gap:0.6rem] [font-family:var(--f-mono)] [font-size:1.2rem] [color:#8a8ea0]"><BookOpen size={14} /> {mins} min read · {n} chapters</span>
          </div>
          <h2 id={`pg-${g.key}-t`} className="pg__title [font-family:var(--f-jak)] [font-weight:500] [font-size:3.4rem] [line-height:1.2] [letter-spacing:-0.06rem] [color:var(--ink-2)] [text-wrap:balance] [@media(max-width:_1279px)]:[font-size:2.6rem]">{g.title}</h2>
          <ol className="pg__toc [list-style:none] [padding:0] [margin:0] [display:flex] [flex-direction:column] [gap:0.4rem] [&_button]:[position:relative] [&_button]:[display:flex] [&_button]:[gap:1.2rem] [&_button]:[align-items:baseline] [&_button]:[width:100%] [&_button]:[padding:1.2rem_1.4rem] [&_button]:[border-radius:1.4rem] [&_button]:[text-align:left] [&_button]:[font:500_1.5rem/1.4_var(--f-jak)] [&_button]:[color:#6b6f7c] [&_button]:[transition:color_0.3s] [&_button>*]:[position:relative] [&_button>*]:[z-index:1] [&_small]:[font-family:var(--f-mono)] [&_small]:[font-size:1.2rem] [&_small]:[color:#b0b3c2] [&_small]:[transition:color_0.3s] [&_button:hover]:[color:var(--purple)] [@media(max-width:_1279px)]:[flex-direction:row] [@media(max-width:_1279px)]:[overflow-x:auto] [@media(max-width:_1279px)]:[gap:0.6rem] [@media(max-width:_1279px)]:[margin:0_-2.2rem] [@media(max-width:_1279px)]:[padding:0_2.2rem_0.4rem] [@media(max-width:_1279px)]:[scrollbar-width:none] [@media(max-width:_1279px)]:[scroll-snap-type:x_mandatory] [@media(max-width:_1279px)]:[&::-webkit-scrollbar]:[display:none] [@media(max-width:_1279px)]:[&_li]:[flex:none] [@media(max-width:_1279px)]:[&_li]:[scroll-snap-align:start] [@media(max-width:_1279px)]:[&_button]:[width:auto] [@media(max-width:_1279px)]:[&_button]:[max-width:28rem] [@media(max-width:_1279px)]:[&_button]:[white-space:nowrap] [@media(max-width:_1279px)]:[&_button]:[padding:1rem_1.4rem] [@media(max-width:_1279px)]:[&_button]:[background:#fff] [@media(max-width:_1279px)]:[&_button]:[border:1px_solid_#ece8fa] [@media(max-width:_1279px)]:[&_button_span]:[overflow:hidden] [@media(max-width:_1279px)]:[&_button_span]:[text-overflow:ellipsis]" role="tablist" aria-label={g.tocTitle}>
            {g.secs.map((s, k) => (
              <li key={s.id}>
                <button type="button" role="tab" aria-selected={k === i} aria-controls={`pg-${g.key}-${s.id}`} className={k === i ? String.raw`is-on [.assess\_\_steps_span&]:[color:var(--navy)] [.assess\_\_steps_span&_b]:[background:var(--purple)] [.assess\_\_steps_span&_b]:[border-color:var(--purple)] [.assess\_\_steps_span&_b]:[color:#fff] [.assess\_\_steps_i&::after]:[transform:scaleX(1)] [.cx-read\_\_n_i&]:[width:2.4rem] [.cx-read\_\_n_i&]:[background:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [.sg\_\_toc_button&]:[color:var(--purple)] [.sg\_\_toc_button&]:[border-left-color:var(--purple)] [.pg\_\_toc_button&]:[color:#fff] [.pg\_\_toc_button&_small]:[color:rgba(255,_255,_255,_0.7)] [.pg\_\_dots_i&]:[width:2.4rem] [.pg\_\_dots_i&]:[background:var(--purple)] [.stfd\_\_tabs_button&]:[color:#fff] [.se\_\_dots_i&]:[width:6.4rem] [.sw-anes\_\_bar_i&]:[background:var(--grad)] [.sw-body_circle&]:[fill:var(--purple)] [.sw-vial\_\_body_i&]:[background:var(--grad)] [.sw-vial\_\_body_i&_small]:[color:#fff] [.sw-wound\_\_grid_i&]:[background:#c9b8ff] [.sw-wound\_\_grid_i&]:[border-color:transparent] [.sw-cal_i&]:[background:var(--purple)] [.sw-cal_i&]:[color:#fff] [.sw-wells_i&]:[background:#e2d9ff] [.sw-wells_i&]:[border-color:#c9b8ff] [.sw-shot_i&]:[background:var(--purple)] [.sw-shot_i&]:[border-color:var(--purple)] [.lf\_\_seg_button&]:[color:#fff] [.tc\_\_why_li&]:[opacity:1] [.sl\_\_tabs_button&]:[color:#fff] [.ar\_\_toc_a&]:[color:var(--ink-2)] [.ct-needs_button&]:[color:#fff] [.wa\_\_zones_li&]:[background:var(--grad)] [.wa\_\_zones_li&]:[border-color:transparent] [.wa\_\_zones_li&_small]:[color:#fff] [.wa\_\_zones_li&_b]:[color:#fff] [.wa\_\_zones_li&_em]:[color:#fff] [.se\_\_dots_i&]:[background:var(--purple)] [.ct-needs_button&]:[background:var(--grad)] [.ct-needs_button&]:[border-color:transparent] [.sc-cal_i&]:[background:var(--purple)] [.sc-cal_i&]:[color:#fff] [.ccp_button&]:[background:var(--purple)] [.ccp_button&]:[color:#fff] [.pa-art\_\_seg_button&]:[background:var(--grad)] [.pa-art\_\_seg_button&]:[color:#fff] [.pa-art\_\_steps_li&]:[background:var(--purple)] [.pa-art\_\_steps_li&]:[border-color:var(--purple)] [.pa-art\_\_steps_li&]:[color:#fff] [.ab-orbit\_\_rings_line&]:[stroke:var(--purple)] [.ab-orbit\_\_rings_line&]:[stroke-width:2]` : ''} onClick={() => go(k)}>
                  <small>{String(k + 1).padStart(2, '0')}</small><span>{s.title}</span>
                  {k === i && <motion.i layoutId={`pg-hl-${g.key}`} className="pg__toc-hl [.pg\_\_toc_&]:[position:absolute]! [.pg\_\_toc_&]:[inset:0] [.pg\_\_toc_&]:[z-index:0]! [.pg\_\_toc_&]:[border-radius:1.4rem] [.pg\_\_toc_&]:[background:linear-gradient(135deg,_#8a6bff,_#6a41f9)] [.pg\_\_toc_&]:[box-shadow:0_1rem_2.4rem_rgba(106,_65,_249,_0.28)]" transition={{ type: 'spring', stiffness: 380, damping: 34 }} />}
                </button>
              </li>
            ))}
          </ol>
        </aside>

        {/* Right: one chapter at a time. All chapters stay in the DOM for search engines. */}
        <div className="pg__stage [position:relative] [display:flex] [flex-direction:column] [min-width:0] [min-height:0]">
          <div className="pg__prog [height:3px] [background:#f1eefb] [&_i]:[display:block] [&_i]:[height:100%] [&_i]:[background:linear-gradient(90deg,_#8a6bff,_#6a41f9)] [&_i]:[transform-origin:left]" aria-hidden><motion.i animate={{ scaleX: (i + 1) / n }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} /></div>
          <div className="pg__body [position:relative] [flex:1] [min-height:0] [overflow-y:auto] [padding:4.8rem_5.6rem_3.2rem] [scrollbar-width:thin] [scrollbar-color:#ddd6f7_transparent] [@media(max-width:_1279px)]:[max-height:70svh] [@media(max-width:_1279px)]:[padding:3.2rem_2.2rem_2.4rem]" ref={bodyRef}>
            {g.secs.map((s, k) => (
              <article key={s.id} id={`pg-${g.key}-${s.id}`} role="tabpanel" className={String.raw`pg__sec [display:none] [position:relative] [&.is-on]:[display:block] [&_h3]:[position:relative] [&_h3]:[max-width:64rem] [&_h3]:[margin:1rem_0_2rem] [&_h3]:[font-family:var(--f-jak)] [&_h3]:[font-weight:500] [&_h3]:[font-size:3.4rem] [&_h3]:[line-height:1.2] [&_h3]:[letter-spacing:-0.08rem] [&_h3]:[color:var(--ink-2)] [.pg\_\_body_&_p]:[margin-top:1.4rem] [.pg\_\_body_&_p]:[max-width:76rem] [.pg\_\_body_&_p]:[font-size:1.8rem] [.pg\_\_body_&_p]:[line-height:1.7] [.pg\_\_body_&_p]:[color:#4a4f63] [&_a:not(.text-link)]:[color:var(--purple)] [&_a:not(.text-link)]:[text-decoration:underline] [&_a:not(.text-link)]:[text-underline-offset:0.2em] [@media(max-width:_1279px)]:[&_h3]:[font-size:2.6rem] [@media(max-width:_1279px)]:[&_p]:[font-size:16px]! ${k === i ? String.raw`is-on [.assess\_\_steps_span&]:[color:var(--navy)] [.assess\_\_steps_span&_b]:[background:var(--purple)] [.assess\_\_steps_span&_b]:[border-color:var(--purple)] [.assess\_\_steps_span&_b]:[color:#fff] [.assess\_\_steps_i&::after]:[transform:scaleX(1)] [.cx-read\_\_n_i&]:[width:2.4rem] [.cx-read\_\_n_i&]:[background:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [.sg\_\_toc_button&]:[color:var(--purple)] [.sg\_\_toc_button&]:[border-left-color:var(--purple)] [.pg\_\_toc_button&]:[color:#fff] [.pg\_\_toc_button&_small]:[color:rgba(255,_255,_255,_0.7)] [.pg\_\_dots_i&]:[width:2.4rem] [.pg\_\_dots_i&]:[background:var(--purple)] [.stfd\_\_tabs_button&]:[color:#fff] [.se\_\_dots_i&]:[width:6.4rem] [.sw-anes\_\_bar_i&]:[background:var(--grad)] [.sw-body_circle&]:[fill:var(--purple)] [.sw-vial\_\_body_i&]:[background:var(--grad)] [.sw-vial\_\_body_i&_small]:[color:#fff] [.sw-wound\_\_grid_i&]:[background:#c9b8ff] [.sw-wound\_\_grid_i&]:[border-color:transparent] [.sw-cal_i&]:[background:var(--purple)] [.sw-cal_i&]:[color:#fff] [.sw-wells_i&]:[background:#e2d9ff] [.sw-wells_i&]:[border-color:#c9b8ff] [.sw-shot_i&]:[background:var(--purple)] [.sw-shot_i&]:[border-color:var(--purple)] [.lf\_\_seg_button&]:[color:#fff] [.tc\_\_why_li&]:[opacity:1] [.sl\_\_tabs_button&]:[color:#fff] [.ar\_\_toc_a&]:[color:var(--ink-2)] [.ct-needs_button&]:[color:#fff] [.wa\_\_zones_li&]:[background:var(--grad)] [.wa\_\_zones_li&]:[border-color:transparent] [.wa\_\_zones_li&_small]:[color:#fff] [.wa\_\_zones_li&_b]:[color:#fff] [.wa\_\_zones_li&_em]:[color:#fff] [.se\_\_dots_i&]:[background:var(--purple)] [.ct-needs_button&]:[background:var(--grad)] [.ct-needs_button&]:[border-color:transparent] [.sc-cal_i&]:[background:var(--purple)] [.sc-cal_i&]:[color:#fff] [.ccp_button&]:[background:var(--purple)] [.ccp_button&]:[color:#fff] [.pa-art\_\_seg_button&]:[background:var(--grad)] [.pa-art\_\_seg_button&]:[color:#fff] [.pa-art\_\_steps_li&]:[background:var(--purple)] [.pa-art\_\_steps_li&]:[border-color:var(--purple)] [.pa-art\_\_steps_li&]:[color:#fff] [.ab-orbit\_\_rings_line&]:[stroke:var(--purple)] [.ab-orbit\_\_rings_line&]:[stroke-width:2]` : ''}`} aria-hidden={k !== i}>
                {k === i ? (
                  <motion.div key={s.id} initial={{ opacity: 0, x: 24 * dir }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>
                    <span className="pg__num [position:absolute] [right:-1rem] [top:-3.6rem] [font-family:'Instrument_Sans',_var(--f-sans)] [font-weight:600] [font-size:18rem] [line-height:1] [letter-spacing:-0.6rem] [color:transparent] [-webkit-text-stroke:1px_#e6dfff] [pointer-events:none] [user-select:none] [@media(max-width:_1279px)]:[font-size:11rem] [@media(max-width:_1279px)]:[top:-2rem] [@media(max-width:_1279px)]:[right:-0.4rem]" aria-hidden>{String(k + 1).padStart(2, '0')}</span>
                    <p className="pg__kick [font-family:var(--f-mono)] [font-size:1.3rem] [text-transform:uppercase] [letter-spacing:0.04em] [color:var(--purple)]">Chapter {k + 1} of {n}</p>
                    {k === 0 && <div className="pg__answer [position:relative] [max-width:76rem] [margin:2rem_0_3.6rem] [padding:2rem_2.2rem] [border-radius:2rem] [background:#fff] [border:1px_solid_#e6dfff] [box-shadow:0_1rem_2.4rem_rgba(106,_65,_249,_0.06)] [&_span]:[display:inline-flex] [&_span]:[align-items:center] [&_span]:[gap:0.6rem] [&_span]:[font-family:var(--f-mono)] [&_span]:[font-size:1.2rem] [&_span]:[text-transform:uppercase] [&_span]:[letter-spacing:0.04em] [&_span]:[color:var(--purple)] [&_p]:[margin-top:0.8rem]! [&_p]:[font-size:1.7rem] [&_p]:[line-height:1.6] [&_p]:[color:var(--ink-2)] [@media(max-width:_1279px)]:[&_p]:[font-size:16px]!"><span><Sparkles size={14} /> The short answer</span><p>{g.answer}</p></div>}
                    <h3>{s.title}</h3>
                    {s.body}
                  </motion.div>
                ) : (<>{k === 0 && <div className="pg__answer [position:relative] [max-width:76rem] [margin:2rem_0_3.6rem] [padding:2rem_2.2rem] [border-radius:2rem] [background:#fff] [border:1px_solid_#e6dfff] [box-shadow:0_1rem_2.4rem_rgba(106,_65,_249,_0.06)] [&_span]:[display:inline-flex] [&_span]:[align-items:center] [&_span]:[gap:0.6rem] [&_span]:[font-family:var(--f-mono)] [&_span]:[font-size:1.2rem] [&_span]:[text-transform:uppercase] [&_span]:[letter-spacing:0.04em] [&_span]:[color:var(--purple)] [&_p]:[margin-top:0.8rem]! [&_p]:[font-size:1.7rem] [&_p]:[line-height:1.6] [&_p]:[color:var(--ink-2)] [@media(max-width:_1279px)]:[&_p]:[font-size:16px]!"><p>{g.answer}</p></div>}<h3>{s.title}</h3>{s.body}</>)}
              </article>
            ))}
          </div>
          <div className="pg__nav [display:flex] [align-items:center] [gap:1.6rem] [padding:1.6rem_3.2rem] [border-top:1px_solid_#f1eefb] [background:rgba(255,_255,_255,_0.9)] [@media(max-width:_1279px)]:[padding:1.2rem_1.6rem]">
            <button type="button" className="pg__arrow [display:grid] [place-items:center] [width:4.4rem] [height:4.4rem] [border-radius:50%] [border:1px_solid_#e4e0f2] [color:var(--ink-2)] [transition:border-color_0.3s,_color_0.3s] [flex:none] [&:hover]:[border-color:var(--purple)] [&:hover]:[color:var(--purple)]" onClick={() => go(i - 1)} aria-label="Previous chapter"><ArrowLeft size={18} /></button>
            <span className="pg__dots [display:flex] [gap:0.6rem] [margin-right:auto] [&_i]:[width:0.8rem] [&_i]:[height:0.8rem] [&_i]:[border-radius:1rem] [&_i]:[background:#e4e0f2] [&_i]:[transition:width_0.4s,_background_0.4s] [@media(max-width:_1279px)]:[display:none]" aria-hidden>{g.secs.map((s, k) => <i key={s.id} className={k === i ? String.raw`is-on [.assess\_\_steps_span&]:[color:var(--navy)] [.assess\_\_steps_span&_b]:[background:var(--purple)] [.assess\_\_steps_span&_b]:[border-color:var(--purple)] [.assess\_\_steps_span&_b]:[color:#fff] [.assess\_\_steps_i&::after]:[transform:scaleX(1)] [.cx-read\_\_n_i&]:[width:2.4rem] [.cx-read\_\_n_i&]:[background:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [.sg\_\_toc_button&]:[color:var(--purple)] [.sg\_\_toc_button&]:[border-left-color:var(--purple)] [.pg\_\_toc_button&]:[color:#fff] [.pg\_\_toc_button&_small]:[color:rgba(255,_255,_255,_0.7)] [.pg\_\_dots_i&]:[width:2.4rem] [.pg\_\_dots_i&]:[background:var(--purple)] [.stfd\_\_tabs_button&]:[color:#fff] [.se\_\_dots_i&]:[width:6.4rem] [.sw-anes\_\_bar_i&]:[background:var(--grad)] [.sw-body_circle&]:[fill:var(--purple)] [.sw-vial\_\_body_i&]:[background:var(--grad)] [.sw-vial\_\_body_i&_small]:[color:#fff] [.sw-wound\_\_grid_i&]:[background:#c9b8ff] [.sw-wound\_\_grid_i&]:[border-color:transparent] [.sw-cal_i&]:[background:var(--purple)] [.sw-cal_i&]:[color:#fff] [.sw-wells_i&]:[background:#e2d9ff] [.sw-wells_i&]:[border-color:#c9b8ff] [.sw-shot_i&]:[background:var(--purple)] [.sw-shot_i&]:[border-color:var(--purple)] [.lf\_\_seg_button&]:[color:#fff] [.tc\_\_why_li&]:[opacity:1] [.sl\_\_tabs_button&]:[color:#fff] [.ar\_\_toc_a&]:[color:var(--ink-2)] [.ct-needs_button&]:[color:#fff] [.wa\_\_zones_li&]:[background:var(--grad)] [.wa\_\_zones_li&]:[border-color:transparent] [.wa\_\_zones_li&_small]:[color:#fff] [.wa\_\_zones_li&_b]:[color:#fff] [.wa\_\_zones_li&_em]:[color:#fff] [.se\_\_dots_i&]:[background:var(--purple)] [.ct-needs_button&]:[background:var(--grad)] [.ct-needs_button&]:[border-color:transparent] [.sc-cal_i&]:[background:var(--purple)] [.sc-cal_i&]:[color:#fff] [.ccp_button&]:[background:var(--purple)] [.ccp_button&]:[color:#fff] [.pa-art\_\_seg_button&]:[background:var(--grad)] [.pa-art\_\_seg_button&]:[color:#fff] [.pa-art\_\_steps_li&]:[background:var(--purple)] [.pa-art\_\_steps_li&]:[border-color:var(--purple)] [.pa-art\_\_steps_li&]:[color:#fff] [.ab-orbit\_\_rings_line&]:[stroke:var(--purple)] [.ab-orbit\_\_rings_line&]:[stroke-width:2]` : ''} />)}</span>
            {i < n - 1 ? (
              <button type="button" className="pg__next [display:inline-flex] [align-items:center] [gap:0.8rem] [min-width:0] [max-width:60%] [height:4.4rem] [padding-inline:2rem_1.6rem] [border-radius:6rem] [background:#f6f3ff] [color:var(--purple)] [font-weight:500] [font-size:1.5rem] [white-space:nowrap] [overflow:hidden] [text-overflow:ellipsis] [transition:background_0.3s,_color_0.3s] [&:hover]:[background:var(--purple)] [&:hover]:[color:#fff] [&.is-cta]:[background:var(--purple)] [&.is-cta]:[color:#fff] [&_svg]:[flex:none] [@media(max-width:_1279px)]:[max-width:none] [@media(max-width:_1279px)]:[flex:1] [@media(max-width:_1279px)]:[justify-content:center]" onClick={() => go(i + 1)}>Next: {g.secs[i + 1].title} <ArrowRight size={16} /></button>
            ) : (
              <Link to="#assessment" className="pg__next is-cta [display:inline-flex] [align-items:center] [gap:0.8rem] [min-width:0] [max-width:60%] [height:4.4rem] [padding-inline:2rem_1.6rem] [border-radius:6rem] [background:#f6f3ff] [color:var(--purple)] [font-weight:500] [font-size:1.5rem] [white-space:nowrap] [overflow:hidden] [text-overflow:ellipsis] [transition:background_0.3s,_color_0.3s] [&:hover]:[background:var(--purple)] [&:hover]:[color:#fff] [&.is-cta]:[background:var(--purple)] [&.is-cta]:[color:#fff] [&_svg]:[flex:none] [@media(max-width:_1279px)]:[max-width:none] [@media(max-width:_1279px)]:[flex:1] [@media(max-width:_1279px)]:[justify-content:center]">{g.cta[1]} <ArrowRight size={16} /></Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* Services                                                            */
/* ================================================================== */
export function serviceGuide(s: ServiceFull): Guide {
  const n = s.name, low = n.toLowerCase();
  const scope = s.ticket.scope.map(strip);
  return {
    key: s.slug,
    tocTitle: `${n}, explained`,
    title: `What ${low} is, how it works, and when to outsource it.`,
    answer: `${n} is one stage of the medical revenue cycle. In short: ${s.line.charAt(0).toLowerCase()}${s.line.slice(1)} Done well, it is the step that decides whether a claim is paid in full the first time, paid late after rework, or not paid at all. Practices either run it in-house or hand it to a specialist team that reports results monthly.`,
    secs: [
      { id: 'what', title: `What is ${low}?`, body: <>
        <p>{strip(s.heroSub)}</p>
        <p>{strip(s.ticket.intro)}</p>
      </> },
      { id: 'how', title: `How does ${low} work, step by step?`, body: <>
        <p>A well-run {low} process follows the same order on every claim. This is ours:</p>
        <ol className="pg__steps [list-style:none] [padding:0] [margin:2.4rem_0_0] [display:grid] [grid-template-columns:repeat(2,_minmax(0,_1fr))] [gap:1.4rem] [counter-reset:st] [&_li]:[padding:2rem_2.2rem] [&_li]:[border-radius:1.8rem] [&_li]:[background:#faf9ff] [&_li]:[border:1px_solid_#eee9ff] [&_b]:[display:flex] [&_b]:[gap:1rem] [&_b]:[align-items:baseline] [&_b]:[font-weight:500] [&_b]:[font-size:1.8rem] [&_b]:[color:var(--ink-2)] [&_small]:[font-family:var(--f-mono)] [&_small]:[font-size:1.2rem] [&_small]:[color:var(--purple)] [.pg\_\_body_.pg\_\_sec_&_p]:[margin-top:0.6rem] [.pg\_\_body_.pg\_\_sec_&_p]:[font-size:1.5rem] [.pg\_\_body_.pg\_\_sec_&_p]:[line-height:1.6] [.pg\_\_body_.pg\_\_sec_&_p]:[color:#5b5f72] [@media(max-width:_1279px)]:[&_p]:[font-size:16px]! [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)]">{s.steps.map((st, i) => <li key={st.title}><b><small>{String(i + 1).padStart(2, '0')}</small>{strip(st.title)}</b><p>{strip(st.body)}</p></li>)}</ol>
      </> },
      { id: 'inc', title: `What should a ${low} service include?`, body: <>
        <p>Whoever runs it, in-house or outsourced, these are the parts to expect. If one is missing, that is usually where the money goes.</p>
        <ul className="sg__ask [@media(max-width:_1279px)]:[font-size:16px]! [@media(max-width:_1279px)]:[line-height:1.6] [list-style:none] [padding:0] [margin:2.4rem_0_0] [display:flex] [flex-direction:column] [gap:1rem] [&_li]:[display:flex] [&_li]:[gap:1.2rem] [&_li]:[align-items:flex-start] [&_li]:[padding:1.6rem_2rem] [&_li]:[border-radius:1.6rem] [&_li]:[border:1px_solid_#ece8fa] [&_li]:[font-size:1.7rem] [&_li]:[line-height:1.5] [&_li]:[color:var(--ink-2)] [&_svg]:[flex:none] [&_svg]:[margin-top:0.3rem] [&_svg]:[color:var(--purple)] [.pg\_\_sec_&]:[margin-top:2rem]">{scope.map((t) => <li key={t}><CheckCircle2 size={18} />{t}</li>)}</ul>
        <p>Reporting: {strip(s.ticket.reporting)}. Owner: {strip(s.ticket.owner)}.</p>
      </> },
      { id: 'why', title: `Why does ${low} matter for revenue?`, body: <>
        <p>{s.stat.prefix ?? ''}{s.stat.value}{s.stat.suffix ?? ''} {strip(s.stat.label)} (<a href={s.stat.href} target="_blank" rel="noopener noreferrer">{s.stat.source}</a>). That gap is rarely one big failure. It is small, repeatable misses: a field left blank, a rule that changed, a follow-up that never happened.</p>
        <p>Because the misses repeat, fixing the cause is worth more than fixing the claim. That is why every {low} engagement ends each month with the pattern behind the numbers, not only the numbers.</p>
      </> },
      { id: 'when', title: `When should a practice outsource ${low}?`, body: <>
        <p>Outsourcing makes sense when the work is falling behind, when one person holds all the knowledge, or when the numbers are drifting and nobody has time to find out why. Common signs:</p>
        <ul className="pg__list [margin:1.6rem_0_0] [padding-left:2.2rem] [display:flex] [flex-direction:column] [gap:0.8rem] [font-size:1.7rem] [line-height:1.6] [color:#4a4f63] [&_li::marker]:[color:var(--purple)] [@media(max-width:_1279px)]:[font-size:16px]!">
          <li>Denial rate above 5–10%, or rising quarter over quarter.</li>
          <li>Days in A/R above 40, or a growing 90+ day bucket.</li>
          <li>Staff overtime or turnover in the billing office.</li>
          <li>No monthly report that explains why the numbers moved.</li>
        </ul>
        <p>You can also hand over just this part of the cycle and keep the rest in-house. It starts with a free review of one month of your claims.</p>
      </> },
    ],
    cta: [`Want to see how your ${low} compares?`, 'Get a free revenue assessment'],
  };
}

/* ================================================================== */
/* Specialties                                                         */
/* ================================================================== */
export function specialtyGuide(s: SpecialtyFull): Guide {
  const n = s.name, low = s.short && /^[A-Z/]+$/.test(s.short) ? s.short : n.toLowerCase();
  const codes = s.ledger.rows.slice(0, 6);
  const leaks = s.leak?.leaks ?? [];
  const seen = new Set<string>();
  const top = s.ledger.rows.filter((c) => { const k = c.name.split(',')[0]; if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, 3);
  const rel = s.related.map(getSpecialtyLite).filter(Boolean).slice(0, 3);
  return {
    key: s.slug,
    tocTitle: `${n} billing, explained`,
    title: `${n} billing: the codes, rules and leaks that decide what you get paid.`,
    answer: `${n} billing is the coding, claim submission and follow-up for ${low} services, from ${top.map((c) => soft(c.name.split(',')[0])).join(', ')} and beyond (CPT ${top.map((c) => c.code).join(', ')}). It differs from general medical billing because ${low} claims depend on specialty-specific codes, modifiers${s.auth ? ', prior authorizations' : ''} and payer policies that a generalist biller rarely sees.`,
    secs: [
      { id: 'what', title: `What makes ${low} billing different?`, body: <>
        <p>{strip(s.heroSub)}</p>
        <p>{strip(s.ledger.intro)}</p>
      </> },
      { id: 'codes', title: `Which codes matter most in ${low}?`, body: <>
        <p>These are the codes we see on {low} claims every day, what usually goes wrong with each, and how it gets caught before the claim goes out.</p>
        <div className="sg__table pg__codes [margin-top:2.4rem] [border-radius:2rem] [border:1px_solid_#ece8fa] [overflow:hidden] [.pg\_\_sec_&]:[margin-top:2rem] [&_code]:[display:inline-block] [&_code]:[margin-right:0.6rem] [&_code]:[padding:0.2rem_0.7rem] [&_code]:[border-radius:0.6rem] [&_code]:[background:#f6f3ff] [&_code]:[border:1px_solid_#e6dfff] [&_code]:[font-family:var(--f-mono)] [&_code]:[font-size:1.3rem] [&_code]:[color:var(--purple)]" role="table" aria-label={`${n} codes`}>
          <div role="row" className="sg__tr sg__th [display:grid] [grid-template-columns:14rem_minmax(0,_1fr)_minmax(0,_1fr)] [gap:2rem] [padding:1.8rem_2.4rem] [line-height:1.5] [&_b]:[font-weight:500] [&_b]:[color:var(--ink-2)] [border-top:0] [background:#f8f6ff] [font-family:var(--f-mono)] [font-size:1.3rem] [text-transform:uppercase] [letter-spacing:0.04em] [color:#8a8ea0] [&_span:last-child]:[color:var(--purple)] [@media(max-width:_767px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_767px)]:[gap:0.6rem] [@media(max-width:_767px)]:[padding:1.6rem_1.8rem] [@media(max-width:_767px)]:[display:none] [@media(max-width:_767px)]:[&_span:nth-child(2)::before]:[content:'Generalist:_'] [@media(max-width:_767px)]:[&_span:nth-child(2)::before]:[color:#8a8ea0] [@media(max-width:_767px)]:[&_span:nth-child(3)::before]:[content:'Specialty:_'] [@media(max-width:_767px)]:[&_span:nth-child(3)::before]:[color:#8a8ea0] [@media(max-width:_767px)]:[&_span:nth-child(3)::before]:[font-weight:400] [.pg\_\_codes_&]:[grid-template-columns:22rem_minmax(0,_1fr)_minmax(0,_1fr)] [@media(max-width:_1279px)]:[font-size:16px]! [@media(max-width:_767px)]:[.pg\_\_codes_&]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_767px)]:[.pg\_\_codes_&_span:nth-child(2)::before]:[content:'What_trips_it:_'] [@media(max-width:_767px)]:[.pg\_\_codes_&_span:nth-child(3)::before]:[content:'How_we_catch_it:_']"><span role="columnheader">Code</span><span role="columnheader">What trips it</span><span role="columnheader">How we catch it</span></div>
          {codes.map((c) => <div role="row" className="sg__tr [display:grid] [grid-template-columns:14rem_minmax(0,_1fr)_minmax(0,_1fr)] [gap:2rem] [padding:1.8rem_2.4rem] [border-top:1px_solid_#f0edf9] [font-size:1.6rem] [line-height:1.5] [color:#5b5f72] [&_b]:[font-weight:500] [&_b]:[color:var(--ink-2)] [@media(max-width:_767px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_767px)]:[gap:0.6rem] [@media(max-width:_767px)]:[padding:1.6rem_1.8rem] [@media(max-width:_767px)]:[&_span:nth-child(2)::before]:[content:'Generalist:_'] [@media(max-width:_767px)]:[&_span:nth-child(2)::before]:[color:#8a8ea0] [@media(max-width:_767px)]:[&_span:nth-child(3)::before]:[content:'Specialty:_'] [@media(max-width:_767px)]:[&_span:nth-child(3)::before]:[color:#8a8ea0] [@media(max-width:_767px)]:[&_span:nth-child(3)::before]:[font-weight:400] [.pg\_\_codes_&]:[grid-template-columns:22rem_minmax(0,_1fr)_minmax(0,_1fr)] [@media(max-width:_1279px)]:[font-size:16px]! [@media(max-width:_767px)]:[.pg\_\_codes_&]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_767px)]:[.pg\_\_codes_&_span:nth-child(2)::before]:[content:'What_trips_it:_'] [@media(max-width:_767px)]:[.pg\_\_codes_&_span:nth-child(3)::before]:[content:'How_we_catch_it:_']" key={c.code}><b role="rowheader"><code>{c.code}</code> {c.name}</b><span role="cell">{strip(c.trip)}</span><span role="cell" className="is-us [.sg\_\_tr_&]:[color:var(--purple)] [.sg\_\_tr_&]:[font-weight:500] [.sg\_\_th_&]:[color:var(--purple)]">{strip(c.catch)}</span></div>)}
        </div>
      </> },
      ...(leaks.length ? [{ id: 'leaks', title: `Where do ${low} practices lose revenue?`, body: <>
        <p>Most lost {low} revenue never shows up as a denial. It leaks in a few predictable places:</p>
        <ul className="sg__breaks [list-style:none] [padding:0] [margin:2.4rem_0_0] [display:grid] [grid-template-columns:repeat(2,_minmax(0,_1fr))] [gap:1.6rem] [&_li]:[padding:2.4rem] [&_li]:[border-radius:2rem] [&_li]:[background:#f8f6ff] [&_li]:[border:1px_solid_#eee9ff] [&_b]:[display:block] [&_b]:[font-weight:500] [&_b]:[font-size:2rem] [&_b]:[color:var(--ink-2)] [&_code]:[display:inline-block] [&_code]:[margin-top:0.8rem] [&_code]:[padding:0.3rem_0.8rem] [&_code]:[border-radius:0.6rem] [&_code]:[background:#fff] [&_code]:[border:1px_solid_#e6dfff] [&_code]:[font-family:var(--f-mono)] [&_code]:[font-size:1.2rem] [&_code]:[color:var(--purple)] [&_p]:[margin-top:1.2rem] [&_p]:[font-size:1.5rem] [&_p]:[line-height:1.6] [&_p]:[color:#5b5f72] [@media(max-width:_767px)]:[grid-template-columns:minmax(0,_1fr)] [.pg\_\_sec_&]:[margin-top:2rem] [@media(max-width:_1279px)]:[&_p]:[font-size:16px]!">{leaks.map((l) => <li key={l.label}><b>{l.label}</b><p>{strip(l.cause)}</p><p className="pg__fix [display:flex] [gap:0.6rem] [align-items:flex-start] [color:var(--purple)]! [font-weight:500] [&_svg]:[flex:none] [&_svg]:[margin-top:0.3rem]"><CheckCircle2 size={14} /> {strip(l.fix)}</p></li>)}</ul>
      </> } as Sec] : []),
      ...(s.auth ? [{ id: 'auth', title: `How does prior authorization work in ${low}?`, body: <>
        <p>{strip(s.auth.body)}</p>
        <p>Under the CMS Interoperability and Prior Authorization rule (CMS-0057-F), Medicare Advantage, Medicaid and CHIP plans must decide urgent requests within 72 hours and standard requests within 7 calendar days. We request the authorization before the patient is scheduled and track every one against that clock (<a href={s.auth.href} target="_blank" rel="noopener noreferrer">{s.auth.source}</a>).</p>
      </> } as Sec] : []),
      { id: 'ask', title: `What should you ask a ${low} billing company?`, body: <>
        <ul className="sg__ask [@media(max-width:_1279px)]:[font-size:16px]! [@media(max-width:_1279px)]:[line-height:1.6] [list-style:none] [padding:0] [margin:2.4rem_0_0] [display:flex] [flex-direction:column] [gap:1rem] [&_li]:[display:flex] [&_li]:[gap:1.2rem] [&_li]:[align-items:flex-start] [&_li]:[padding:1.6rem_2rem] [&_li]:[border-radius:1.6rem] [&_li]:[border:1px_solid_#ece8fa] [&_li]:[font-size:1.7rem] [&_li]:[line-height:1.5] [&_li]:[color:var(--ink-2)] [&_svg]:[flex:none] [&_svg]:[margin-top:0.3rem] [&_svg]:[color:var(--purple)] [.pg\_\_sec_&]:[margin-top:2rem]">{[
          `How many ${low} practices do you bill for today, and which coders work them?`,
          `What are the top denial reasons you see in ${low}, and what do you change upstream to stop them?`,
          `How do you handle ${codes[0]?.code ?? 'our highest-volume'} and our other high-dollar codes before they go out?`,
          `Can you report our denial rate and days in A/R against ${low} benchmarks every month?`,
        ].map((q) => <li key={q}><CheckCircle2 size={18} />{q}</li>)}</ul>
        {rel.length > 0 && <p>Practices that bill {low} often bill {rel.map((r, i) => <span key={r!.slug}>{i > 0 && (i === rel.length - 1 ? ' and ' : ', ')}<Link to={`/specialties/${r!.slug}`}>{r!.name.toLowerCase()}</Link></span>)} as well. Each follows its own rulebook, and we bill all of them.</p>}
      </> },
    ],
    cta: [`Send us a month of ${low} claims.`, 'Get a free revenue assessment'],
  };
}

/* ================================================================== */
/* States                                                              */
/* ================================================================== */
export function stateGuide(s: StatePage): Guide {
  const n = s.name;
  const sp = s.specialties.map(getSpecialtyLite).filter(Boolean);
  const med = s.facts.find((f) => f.k === 'Medicare'), mcd = s.facts.find((f) => f.k === 'Medicaid'), pp0 = s.facts.find((f) => f.k === 'Prompt pay'), pp = pp0 && /\d/.test(pp0.title) ? pp0 : undefined;
  return {
    key: s.slug,
    tocTitle: `Billing in ${n}, explained`,
    title: `Medical billing in ${n}: the payers, rules and deadlines to know.`,
    answer: `Medical billing in ${n} means working ${med ? med.title : 'the state’s Medicare contractor'} for Medicare Part B, ${mcd ? mcd.title : `${n} Medicaid`} for Medicaid, and holding state-regulated commercial plans to ${n}’s prompt-pay law${pp ? ` (${pp.title})` : ''}. Practices that miss these local rules lose money to avoidable denials and late payments.`,
    secs: [
      { id: 'diff', title: `What is different about billing in ${n}?`, body: <>
        <p>Federal rules are the same everywhere, but who processes the claim and how fast they must pay is set state by state. In {n}, four things shape every claim:</p>
        <ul className="sg__breaks [list-style:none] [padding:0] [margin:2.4rem_0_0] [display:grid] [grid-template-columns:repeat(2,_minmax(0,_1fr))] [gap:1.6rem] [&_li]:[padding:2.4rem] [&_li]:[border-radius:2rem] [&_li]:[background:#f8f6ff] [&_li]:[border:1px_solid_#eee9ff] [&_b]:[display:block] [&_b]:[font-weight:500] [&_b]:[font-size:2rem] [&_b]:[color:var(--ink-2)] [&_code]:[display:inline-block] [&_code]:[margin-top:0.8rem] [&_code]:[padding:0.3rem_0.8rem] [&_code]:[border-radius:0.6rem] [&_code]:[background:#fff] [&_code]:[border:1px_solid_#e6dfff] [&_code]:[font-family:var(--f-mono)] [&_code]:[font-size:1.2rem] [&_code]:[color:var(--purple)] [&_p]:[margin-top:1.2rem] [&_p]:[font-size:1.5rem] [&_p]:[line-height:1.6] [&_p]:[color:#5b5f72] [@media(max-width:_767px)]:[grid-template-columns:minmax(0,_1fr)] [.pg\_\_sec_&]:[margin-top:2rem] [@media(max-width:_1279px)]:[&_p]:[font-size:16px]!">{s.facts.map((f) => <li key={f.k}><b>{f.k}: {f.title}</b><p>{strip(f.body)}{f.src && <> (<a href={f.src.href} target="_blank" rel="noopener noreferrer">{f.src.label}</a>)</>}</p></li>)}</ul>
      </> },
      ...(pp ? [{ id: 'pay', title: `How fast must ${n} payers pay a clean claim?`, body: <>
        <p>{n}’s prompt-pay rule sets the deadline for state-regulated plans: {pp.title}. {strip(pp.body)}</p>
        <p>Self-funded employer plans (ERISA) and Medicare follow federal timelines instead, so knowing which kind of plan a patient has is the first step in holding a payer to the clock.</p>
      </> } as Sec] : []),
      { id: 'who', title: `Which ${n} practices do we bill for?`, body: <>
        <p>We bill for practices across {n}, including {s.cities.slice(0, -1).join(', ')} and {s.cities[s.cities.length - 1]}. {strip(s.local)}</p>
        <p>The specialties we bill most often in {n}: {sp.map((x, i) => <span key={x!.slug}>{i > 0 && ', '}<Link to={`/specialties/${x!.slug}`}>{x!.name}</Link></span>)}.</p>
      </> },
      { id: 'choose', title: `How do you choose a billing company in ${n}?`, body: <>
        <ul className="sg__ask [@media(max-width:_1279px)]:[font-size:16px]! [@media(max-width:_1279px)]:[line-height:1.6] [list-style:none] [padding:0] [margin:2.4rem_0_0] [display:flex] [flex-direction:column] [gap:1rem] [&_li]:[display:flex] [&_li]:[gap:1.2rem] [&_li]:[align-items:flex-start] [&_li]:[padding:1.6rem_2rem] [&_li]:[border-radius:1.6rem] [&_li]:[border:1px_solid_#ece8fa] [&_li]:[font-size:1.7rem] [&_li]:[line-height:1.5] [&_li]:[color:var(--ink-2)] [&_svg]:[flex:none] [&_svg]:[margin-top:0.3rem] [&_svg]:[color:var(--purple)] [.pg\_\_sec_&]:[margin-top:2rem]">{[
          `Do they work ${med ? med.title.split(',')[0] : 'your Medicare contractor'} and ${mcd ? mcd.title.split(' and ')[0] : `${n} Medicaid`} every day?`,
          `Do they track ${n} prompt-pay deadlines and request penalties when payers are late?`,
          `Do they work in your time zone (${s.tzName}), so questions get answered the same day?`,
          'Will they show denial rate and days in A/R by payer every month?',
        ].map((q) => <li key={q}><CheckCircle2 size={18} />{q}</li>)}</ul>
      </> },
    ],
    cta: [`Billing in ${n}?`, `Get a free ${n} revenue review`],
  };
}
