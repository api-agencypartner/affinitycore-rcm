import { Fragment, useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { Check } from 'lucide-react';
import { Eyebrow, SplitWords } from '../components/ui';
import { ease } from '../motion';

const STEPS = [
  { n: '01', title: 'Before the visit', head: 'Catch problems before they start.', items: ['Insurance eligibility verified', 'Prior authorizations secured', 'Provider credentials current'] },
  { n: '02', title: 'From care to claim', head: 'Code it right the first time.', items: ['Documentation reviewed', 'Specialty-certified coding', 'Claim scrubbed before submission'] },
  { n: '03', title: 'Claim to cash', head: 'Get every dollar you earned.', items: ['Payments posted and reconciled', 'Denials appealed and fixed', 'Aged A/R followed up'] },
];
const STEP_DELAY = 0.45; // each step lights up after the one before it

const CYCLE_MS = 2800;

/**
 * How it works: one normal-height fold inside a rounded purple panel (no pinned scroll).
 * The panel has a soft light that follows the cursor and two slow drifting glows.
 * Steps are joined by connectors (horizontal on desktop, vertical on phones) with a pulse travelling along them.
 * While the fold is on screen the highlight walks 01 → 02 → 03 on a timer; hover or focus takes over.
 */
export function Process() {
  const [hot, setHot] = useState<number | null>(null);
  const [auto, setAuto] = useState(0);
  const panel = useRef<HTMLDivElement>(null);
  const seen = useInView(panel, { amount: 0.35 });
  useEffect(() => {
    if (!seen || hot !== null || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = window.setInterval(() => setAuto((a) => (a + 1) % STEPS.length), CYCLE_MS);
    return () => window.clearInterval(t);
  }, [seen, hot]);
  const active = hot ?? auto;
  // Leaving the row hands control back to the timer from the card the visitor was on (no jump back)
  const leave = () => { if (hot !== null) setAuto(hot); setHot(null); };
  const onMove = (e: React.MouseEvent) => {
    const el = panel.current; if (!el) return; const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`); el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  return (
    <section className="process [position:relative] [height:300vh] [background:var(--purple)] [margin-top:16rem] [@media(max-width:_1279px)]:[height:auto] [@media(max-width:_1279px)]:[margin-top:10rem] [&.process]:[height:auto] [&.process]:[background:none] [&.process]:[margin-top:16rem] [&.process]:[padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[&.process]:[margin-top:10rem] [@media(max-width:_1279px)]:[&.process]:[padding-inline:1.6rem]" id="process">
      <div className="process__panel [border-radius:4rem] [padding:10rem_8rem] [display:flex] [flex-direction:column] [align-items:center] [gap:7.2rem] [@media(max-width:_1279px)]:[padding:7.2rem_2.4rem] [@media(max-width:_1279px)]:[gap:4.8rem] [@media(max-width:_1279px)]:[border-radius:3.2rem] [position:relative] [overflow:hidden] [isolation:isolate] [&::after]:[content:''] [&::after]:[position:absolute] [&::after]:[inset:0] [&::after]:[z-index:0] [&::after]:[pointer-events:none] [background:var(--soft-grain),_linear-gradient(180deg,_#f8f8fb_0%,_#f4f4f8_100%)] [color:var(--ink-2)] [border:1px_solid_#ececf3] [&::after]:[background-image:radial-gradient(rgba(106,_65,_249,_0.55)_1.1px,_transparent_1.3px)] [&::after]:[background-size:2rem_2rem] [&::after]:[opacity:0.42] [&::after]:[-webkit-mask-image:radial-gradient(ellipse_85%_80%_at_50%_45%,_#000_35%,_rgba(0,0,0,0.35)_100%)] [&::after]:[mask-image:radial-gradient(ellipse_85%_80%_at_50%_45%,_#000_35%,_rgba(0,0,0,0.35)_100%)]" ref={panel} onMouseMove={onMove}>
        <span className="process__glow process__glow--a [position:absolute] [z-index:0] [width:60rem] [height:60rem] [border-radius:50%] [filter:blur(8rem)] [opacity:0.55] [pointer-events:none] [animation:pglow_16s_ease-in-out_infinite_alternate] [left:-16rem] [top:-22rem] [background:#a58cff] [[data-off]_&]:[animation-play-state:paused] [@media(max-width:_1279px)]:[width:36rem] [@media(max-width:_1279px)]:[height:36rem] [@media(prefers-reduced-motion:_reduce)]:[animation:none] [display:none]" aria-hidden />
        <span className="process__glow process__glow--b [position:absolute] [z-index:0] [width:60rem] [height:60rem] [border-radius:50%] [filter:blur(8rem)] [opacity:0.55] [pointer-events:none] [animation:pglow_16s_ease-in-out_infinite_alternate] [right:-18rem] [bottom:-26rem] [background:#3d1fd0] [animation-duration:20s]! [animation-direction:alternate-reverse] [[data-off]_&]:[animation-play-state:paused] [@media(max-width:_1279px)]:[width:36rem] [@media(max-width:_1279px)]:[height:36rem] [@media(prefers-reduced-motion:_reduce)]:[animation:none]! [display:none]" aria-hidden />
        <span className="process__spot [position:absolute] [inset:0] [z-index:0] [pointer-events:none] [opacity:0] [transition:opacity_0.5s] [.process\_\_panel:hover_&]:[opacity:1] [background:radial-gradient(36rem_circle_at_var(--mx,_50%)_var(--my,_50%),_rgba(106,_65,_249,_0.05),_transparent_70%)]" aria-hidden />
        <div className="process__head [display:flex] [flex-direction:column] [align-items:center] [gap:1.2rem] [text-align:center] [position:relative] [z-index:1]">
          <Eyebrow className="eyebrow--light [color:#fff]! [.process\_\_panel_&]:[color:var(--purple)]! [.stp-sv\_\_head_&]:[color:rgba(255,_255,_255,_0.82)]! [.se\_\_panel_&]:[color:var(--ink)]!">/ How it works</Eyebrow>
          <SplitWords className="h-64 process__title [font-weight:500] [font-size:5.6rem] [line-height:1.08] [letter-spacing:-0.12rem] [text-wrap:balance] [.svc\_\_head_&]:[margin-top:1.2rem] [.plat\_\_center_&]:[color:var(--ink-2)] [@media(max-width:_1279px)]:[font-size:3.8rem] [@media(max-width:_1279px)]:[overflow-wrap:anywhere] [@media(max-width:_640px)]:[font-size:3.4rem] [color:var(--ink-2)]" lines={['Care moves forward.', 'Your revenue should too.']} stagger={0.04} />
        </div>

        <div className="prail [position:relative] [z-index:1] [width:100%] [display:grid] [grid-template-columns:repeat(3,_minmax(0,_1fr))] [column-gap:2.4rem] [margin-bottom:-7.2rem] [@media(max-width:_1279px)]:[display:none]" aria-hidden style={{ ['--p' as string]: active / (STEPS.length - 1) }}>
          <span className="prail__track [position:absolute] [top:2.4rem] [left:calc((100%_-_4.8rem)_/_6)] [right:calc((100%_-_4.8rem)_/_6)] [height:2px] [border-radius:2px] [background:#e4e4ec]"><i className="prail__fill [position:absolute] [inset:0] [border-radius:inherit] [transform-origin:left_center] [transform:scaleX(var(--p,_0))] [background:linear-gradient(90deg,_#8a6bff,_var(--purple))] [box-shadow:0_0_1rem_rgba(106,_65,_249,_0.3)] [transition:transform_0.7s_cubic-bezier(.22,_1,_.36,_1)]" /></span>
          {STEPS.map((s, i) => (
            <span key={s.n} className={String.raw`prail__node [position:relative] [justify-self:center] [display:flex] [flex-direction:column] [align-items:center] [&_b]:[position:relative] [&_b]:[width:4.8rem] [&_b]:[height:4.8rem] [&_b]:[border-radius:50%] [&_b]:[display:grid] [&_b]:[place-items:center] [&_b]:[border:1.5px_solid_rgba(255,_255,_255,_0.35)] [&_b]:[font-family:'Inter',_sans-serif] [&_b]:[font-weight:500] [&_b]:[font-size:1.6rem] [&.is-now_b::after]:[content:''] [&.is-now_b::after]:[position:absolute] [&.is-now_b::after]:[inset:-0.6rem] [&.is-now_b::after]:[border-radius:50%] [&.is-now_b::after]:[border:1.5px_solid_rgba(255,_255,_255,_0.55)]! [&.is-now_b::after]:[animation:pring_2.4s_ease-out_infinite] [@media(prefers-reduced-motion:_reduce)]:[&_b::after]:[animation:none] [&_b]:[background:#fff] [&_b]:[border-color:#e0e0ea]! [&_b]:[color:#8a8ea0] [&.is-on_b]:[background:var(--purple)] [&.is-on_b]:[border-color:var(--purple)]! [&.is-on_b]:[color:#fff] [&.is-now_b::after]:[border-color:rgba(106,_65,_249,_0.4)]! [&_b]:[transition:background-color_0.45s_cubic-bezier(.22,_1,_.36,_1),_color_0.45s_cubic-bezier(.22,_1,_.36,_1),_border-color_0.45s_cubic-bezier(.22,_1,_.36,_1),_transform_0.45s_cubic-bezier(.22,_1,_.36,_1)] [&.is-now_b]:[transform:scale(1.08)] ${active >= i ? String.raw`is-on [.assess\_\_steps_span&]:[color:var(--navy)] [.assess\_\_steps_span&_b]:[background:var(--purple)] [.assess\_\_steps_span&_b]:[border-color:var(--purple)] [.assess\_\_steps_span&_b]:[color:#fff] [.assess\_\_steps_i&::after]:[transform:scaleX(1)] [.cx-read\_\_n_i&]:[width:2.4rem] [.cx-read\_\_n_i&]:[background:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [.sg\_\_toc_button&]:[color:var(--purple)] [.sg\_\_toc_button&]:[border-left-color:var(--purple)] [.pg\_\_toc_button&]:[color:#fff] [.pg\_\_toc_button&_small]:[color:rgba(255,_255,_255,_0.7)] [.pg\_\_dots_i&]:[width:2.4rem] [.pg\_\_dots_i&]:[background:var(--purple)] [.stfd\_\_tabs_button&]:[color:#fff] [.se\_\_dots_i&]:[width:6.4rem] [.sw-anes\_\_bar_i&]:[background:var(--grad)] [.sw-body_circle&]:[fill:var(--purple)] [.sw-vial\_\_body_i&]:[background:var(--grad)] [.sw-vial\_\_body_i&_small]:[color:#fff] [.sw-wound\_\_grid_i&]:[background:#c9b8ff] [.sw-wound\_\_grid_i&]:[border-color:transparent] [.sw-cal_i&]:[background:var(--purple)] [.sw-cal_i&]:[color:#fff] [.sw-wells_i&]:[background:#e2d9ff] [.sw-wells_i&]:[border-color:#c9b8ff] [.sw-shot_i&]:[background:var(--purple)] [.sw-shot_i&]:[border-color:var(--purple)] [.lf\_\_seg_button&]:[color:#fff] [.tc\_\_why_li&]:[opacity:1] [.sl\_\_tabs_button&]:[color:#fff] [.ar\_\_toc_a&]:[color:var(--ink-2)] [.ct-needs_button&]:[color:#fff] [.wa\_\_zones_li&]:[background:var(--grad)] [.wa\_\_zones_li&]:[border-color:transparent] [.wa\_\_zones_li&_small]:[color:#fff] [.wa\_\_zones_li&_b]:[color:#fff] [.wa\_\_zones_li&_em]:[color:#fff] [.se\_\_dots_i&]:[background:var(--purple)] [.ct-needs_button&]:[background:var(--grad)] [.ct-needs_button&]:[border-color:transparent] [.sc-cal_i&]:[background:var(--purple)] [.sc-cal_i&]:[color:#fff] [.ccp_button&]:[background:var(--purple)] [.ccp_button&]:[color:#fff] [.pa-art\_\_seg_button&]:[background:var(--grad)] [.pa-art\_\_seg_button&]:[color:#fff] [.pa-art\_\_steps_li&]:[background:var(--purple)] [.pa-art\_\_steps_li&]:[border-color:var(--purple)] [.pa-art\_\_steps_li&]:[color:#fff] [.ab-orbit\_\_rings_line&]:[stroke:var(--purple)] [.ab-orbit\_\_rings_line&]:[stroke-width:2]` : ''} ${active === i ? String.raw`is-now [.sc-stat\_\_bars_i&]:[background:var(--grad)]` : ''}`}>
              <b>{s.n}</b><i className="prail__stem [width:2px] [height:4.8rem] [background:#e4e4ec] [.prail\_\_node.is-now_&]:[background:linear-gradient(var(--purple),_rgba(106,_65,_249,_0.5))] [transition:background_0.45s_cubic-bezier(.22,_1,_.36,_1)]" />
            </span>
          ))}
        </div>
        <motion.ol className="process__steps [width:100%] [display:grid] [position:relative] [z-index:1] [grid-template-columns:repeat(3,_minmax(0,_1fr))] [gap:2.4rem] [align-items:stretch] [margin-top:0] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1279px)]:[gap:3.2rem] [@media(max-width:_1279px)]:[margin-top:0]" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.35 }} onMouseLeave={leave}>
          {STEPS.map((s, i) => (
            <Fragment key={s.n}>
            <motion.li className={String.raw`pstep [position:relative] [z-index:1] [display:flex] [flex-direction:column] [gap:1.6rem] [padding:3.2rem] [border-radius:2.8rem] [border:1px_solid_rgba(255,_255,_255,_0.16)] [outline:none] [&:focus-visible]:[outline:2px_solid_#fff] [&:focus-visible]:[outline-offset:3px]! [@media(max-width:_1279px)]:[padding:3.2rem_2.4rem_2.8rem] [@media(max-width:_1279px)]:[&+.pstep::before]:[content:''] [@media(max-width:_1279px)]:[&+.pstep::before]:[position:absolute] [@media(max-width:_1279px)]:[&+.pstep::before]:[left:calc(2.4rem_+_2.2rem_-_1px)] [@media(max-width:_1279px)]:[&+.pstep::before]:[top:-3.3rem] [@media(max-width:_1279px)]:[&+.pstep::before]:[width:2px] [@media(max-width:_1279px)]:[&+.pstep::before]:[height:3.3rem] [border-color:#ebebf2]! [color:var(--ink-2)] [-webkit-backdrop-filter:none] [backdrop-filter:none] [box-shadow:0_1rem_3rem_rgba(25,_37,_51,_0.04)] [&.is-hot]:[background:linear-gradient(150deg,_#7a55ff,_var(--purple)_55%,_#5430e6)] [&+.pstep::before]:[background:#e0e0ea]! [--e:cubic-bezier(.22,_1,_.36,_1)] [background:#fff]! [isolation:isolate] [overflow:hidden] [transition:transform_0.6s_var(--e),_box-shadow_0.6s_var(--e),_border-color_0.5s_var(--e),_color_0.5s_var(--e)] [will-change:transform] [&>:not(.pstep\_\_hl)]:[position:relative] [&>:not(.pstep\_\_hl)]:[z-index:1] [&.is-hot]:[transform:translateY(-0.8rem)] [&.is-hot]:[box-shadow:0_2.4rem_6rem_rgba(106,_65,_249,_0.22)] [&.is-hot]:[border-color:transparent]! [&.is-hot]:[color:#fff] [&:not(.is-hot):hover]:[border-color:#d9d1fb]! [@media(prefers-reduced-motion:_reduce)]:[transition:none]! [@media(prefers-reduced-motion:_reduce)]:[&_*]:[transition:none]! ${active === i ? 'is-hot' : ''}`} tabIndex={0}
              onMouseEnter={() => setHot(i)} onFocus={() => setHot(i)} onBlur={leave}
              variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: ease.out, delay: 0.1 + i * 0.12 } } }}>
              {/* Purple layer cross-fades with the text colour on one curve, so text never sits white-on-white */}
              <span className="pstep__hl [position:absolute] [inset:-1px] [z-index:0] [border-radius:inherit] [opacity:0] [transform:scale(0.985)] [transition:opacity_0.5s_var(--e),_transform_0.6s_var(--e)] [background:linear-gradient(150deg,_#7a55ff,_var(--purple)_55%,_#5430e6)] [box-shadow:inset_0_1px_0_rgba(255,_255,_255,_0.25)] [.pstep.is-hot_&]:[opacity:1] [.pstep.is-hot_&]:[transform:none]" aria-hidden />
              <div className="pstep__top [display:flex] [align-items:center] [gap:1.4rem]">
                <motion.span className="pstep__num [flex:none] [width:4.4rem] [height:4.4rem] [border-radius:50%] [display:grid] [place-items:center] [border:1px_solid_rgba(255,_255,_255,_0.4)] [font-family:'Inter',_sans-serif] [font-weight:500] [font-size:1.5rem] [@media(min-width:_1280px)]:[display:none] [border-color:#e3e3ec]! [color:var(--ink-2)]! [background:#fff]! [.pstep.is-hot_&]:[background:#fff]! [.pstep.is-hot_&]:[color:var(--purple)]! [.pstep.is-hot_&]:[border-color:#fff]! [transition:color_0.5s_var(--e),_background-color_0.5s_var(--e),_border-color_0.5s_var(--e)]!"
                  variants={{ hidden: { backgroundColor: 'rgba(255,255,255,0.1)', color: '#ffffff' }, show: { backgroundColor: '#ffffff', color: '#6a41f9', transition: { duration: 0.4, delay: 0.2 + i * STEP_DELAY } } }}>
                  {s.n}
                </motion.span>
                <span className="pstep__title [font-family:var(--f-mono)] [font-size:1.3rem] [letter-spacing:0.06em] [text-transform:uppercase] [color:#8a8ea0] [.pstep.is-hot_&]:[color:rgba(255,_255,_255,_0.78)] [transition:color_0.5s_var(--e),_background-color_0.5s_var(--e),_border-color_0.5s_var(--e)]!">{s.title}</span>
              </div>
              <h3 className="pstep__head [font-family:var(--f-jak)] [font-weight:500] [font-size:2.4rem] [line-height:1.3] [letter-spacing:-0.06rem] [@media(max-width:_1279px)]:[font-size:2.2rem] [transition:color_0.5s_var(--e),_background-color_0.5s_var(--e),_border-color_0.5s_var(--e)]!">{s.head}</h3>
              <ul className="pstep__list [display:flex] [flex-direction:column] [gap:1.2rem] [padding-top:1.6rem] [border-top:1px_solid_rgba(255,_255,_255,_0.16)] [&_li]:[display:flex] [&_li]:[align-items:center] [&_li]:[gap:1.2rem] [&_li]:[font-family:var(--f-jak)] [&_li]:[font-weight:500] [&_li]:[font-size:1.6rem] [&_li]:[line-height:2.2rem] [border-top-color:#efeff5]! [.pstep.is-hot_&]:[border-color:rgba(255,_255,_255,_0.22)]! [transition:color_0.5s_var(--e),_background-color_0.5s_var(--e),_border-color_0.5s_var(--e)]! [&_li]:[transition:color_0.5s_var(--e),_background-color_0.5s_var(--e),_border-color_0.5s_var(--e)]!">
                {s.items.map((it, k) => (
                  <li key={it}>
                    <motion.span className="pstep__tick [flex:none] [width:2.2rem] [height:2.2rem] [border-radius:50%] [display:grid] [place-items:center] [&_svg]:[width:1.3rem] [&_svg]:[height:1.3rem] [background:#f1ecff] [color:var(--purple)] [.pstep.is-hot_&]:[background:#fff] [.pstep.is-hot_&]:[color:var(--purple)] [transition:color_0.5s_var(--e),_background-color_0.5s_var(--e),_border-color_0.5s_var(--e)]! [&_svg]:[transition:transform_0.45s_var(--e)] [.pstep.is-hot_&_svg]:[transform:scale(1.08)]" aria-hidden
                      variants={{ hidden: { scale: 0.4, opacity: 0 }, show: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 420, damping: 22, delay: 0.45 + i * STEP_DELAY + k * 0.1 } } }}>
                      <Check strokeWidth={3} />
                    </motion.span>
                    {it}
                  </li>
                ))}
              </ul>
            </motion.li>
            </Fragment>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
