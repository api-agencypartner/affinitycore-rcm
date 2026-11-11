/**
 * Interactive featured cover for the CMS prior-auth article: a dial that runs the payer's decision clock
 * (urgent 72 hours / standard 7 days), with play/pause and a scrubber. Pauses off screen and for reduced motion.
 */
import { useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import type { Article } from '../data/insights';

export function PaClock({ a }: { a: Article }) {
  const [mode, setMode] = useState<'u' | 's'>('u');
  const [h, setH] = useState(0);
  const [playing, setPlaying] = useState(true);
  const vis = useRef(true);
  const box = useRef<HTMLDivElement>(null);
  const D = mode === 'u' ? 72 : 168;

  useEffect(() => {
    const el = box.current; if (!el || typeof IntersectionObserver === 'undefined') return;
    const o = new IntersectionObserver(([x]) => { vis.current = x.isIntersecting; }, { threshold: 0.1 });
    o.observe(el); return () => o.disconnect();
  }, []);
  useEffect(() => {
    let rm = false; try { rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { /* ignore */ }
    if (rm) { setH(Math.round(D * 0.62)); return; }
    if (!playing) return;
    let raf = 0, last = performance.now(), acc = 0;
    const CYC = 7000, HOLD = 2600;
    const step = (t: number) => {
      const dt = t - last; last = t;
      if (vis.current && !document.hidden) { acc += dt; const c = acc % (CYC + HOLD); setH(Math.min(1, c / CYC) * D); }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [mode, playing, D]);

  const fr = Math.min(1, h / D), left = Math.max(0, D - h), done = fr >= 0.999;
  const R = 56, C = 2 * Math.PI * R, ang = fr * 2 * Math.PI - Math.PI / 2;
  const kx = 70 + R * Math.cos(ang), ky = 70 + R * Math.sin(ang);
  const fmt = mode === 'u' ? `${Math.ceil(left)}h` : left >= 24 ? `${Math.floor(left / 24)}d ${Math.round(left % 24)}h` : `${Math.ceil(left)}h`;
  const stage = done ? 2 : fr < 0.1 ? 0 : 1;
  const stop = (x: React.SyntheticEvent) => x.stopPropagation();
  const ticks = mode === 'u' ? 24 : 28, major = mode === 'u' ? 6 : 4;

  return (
    <div ref={box} className="bc bc--big pa-art [position:relative] [isolation:isolate] [overflow:hidden] [display:flex] [background:radial-gradient(120%_90%_at_85%_10%,_#ede6ff_0%,_#f6f3ff_45%,_#fbfaff_100%)] [justify-content:center] [align-items:center] [&::before]:[background-image:radial-gradient(rgba(106,_65,_249,_0.12)_1px,_transparent_1.2px)] [&::before]:[background-size:1.8rem_1.8rem] [&::before]:[-webkit-mask-image:linear-gradient(180deg,_#000,_transparent_85%)] [&::before]:[mask-image:linear-gradient(180deg,_#000,_transparent_85%)] [aspect-ratio:auto] [height:100%] [min-height:34rem] [border-radius:3.2rem_0_0_3.2rem] [padding:4rem] [@media(max-width:_1279px)]:[min-height:22rem] [@media(max-width:_1279px)]:[border-radius:3.2rem_3.2rem_0_0] [&.bc--big.pa-art]:[flex-direction:column] [&.bc--big.pa-art]:[justify-content:center] [&.bc--big.pa-art]:[gap:1.8rem] [&.bc--big.pa-art]:[cursor:default] [&.bc--big.pa-art]:[min-height:56rem] [&.bc--big.pa-art]:[padding:8.4rem_2rem_6.4rem] [&::before]:[content:''] [&::before]:[position:absolute] [&::before]:[inset:-30%] [&::before]:[background:repeating-radial-gradient(circle_at_50%_46%,transparent_0_3.6rem,#6a41f914_3.6rem_3.7rem)]! [&::before]:[z-index:-1] [&::before]:[pointer-events:none] [@media(min-width:1024px)]:[&.bc--big.pa-art]:[min-height:60rem] [@media(min-width:1024px)]:[&.bc--big.pa-art]:[padding:9rem_3.2rem_6.8rem] [&.bc--big.ba]:[position:relative] [&.bc--big.ba]:[overflow:hidden] [&.bc--big.ba]:[min-height:56rem] [&.bc--big.ba]:[background:var(--soft-grain),_var(--soft-bg)]! [&.bc--big.ba]:[cursor:pointer] [&.bc--big.ba]:[isolation:isolate] [@media(max-width:_1279px)]:[&.bc--big.ba]:[min-height:48rem] [@media(max-width:_640px)]:[&.bc--big.ba]:[min-height:40rem]" role="group" aria-label="Interactive: how the prior authorization decision clock runs">
      <div className="pa-art__top [position:absolute] [top:2rem] [left:2rem] [right:2rem] [display:flex] [flex-wrap:wrap] [justify-content:space-between] [align-items:center] [gap:1rem] [z-index:2] [@media(min-width:1024px)]:[top:2.6rem] [@media(min-width:1024px)]:[left:3.2rem] [@media(min-width:1024px)]:[right:3.2rem]">
        <span className="pa-art__kick [display:inline-flex] [align-items:center] [gap:.8rem] [font:500_1.15rem/1_var(--f-mono)] [letter-spacing:.08em] [text-transform:uppercase] [color:#6a41f9] [&_i]:[width:.8rem] [&_i]:[height:.8rem] [&_i]:[border-radius:50%] [&_i]:[background:#6a41f9] [&_i]:[animation:paPulse_1.8s_ease-out_infinite] [@media(prefers-reduced-motion:reduce)]:[&_i]:[animation:none]"><i />Try it · {a.topic}</span>
        <div className="pa-art__seg [display:inline-flex] [padding:.4rem] [border-radius:99px] [background:#fff] [border:1px_solid_#e6dfff] [box-shadow:0_.8rem_2rem_-.8rem_#391ca040] [&_button]:[border:0] [&_button]:[background:none] [&_button]:[font:500_1.25rem/1_var(--f-sans)] [&_button]:[padding:.8rem_1.2rem] [&_button]:[border-radius:99px] [&_button]:[color:#5b5f72] [&_button]:[cursor:pointer] [&_button]:[transition:background_.3s,color_.3s]" role="radiogroup" aria-label="Request type" onClick={stop}>
          {([['u', 'Urgent · 72 hrs'], ['s', 'Standard · 7 days']] as const).map(([k, l]) => (
            <button key={k} type="button" role="radio" aria-checked={mode === k} className={mode === k ? String.raw`is-on [.assess\_\_steps_span&]:[color:var(--navy)] [.assess\_\_steps_span&_b]:[background:var(--purple)] [.assess\_\_steps_span&_b]:[border-color:var(--purple)] [.assess\_\_steps_span&_b]:[color:#fff] [.assess\_\_steps_i&::after]:[transform:scaleX(1)] [.cx-read\_\_n_i&]:[width:2.4rem] [.cx-read\_\_n_i&]:[background:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [.sg\_\_toc_button&]:[color:var(--purple)] [.sg\_\_toc_button&]:[border-left-color:var(--purple)] [.pg\_\_toc_button&]:[color:#fff] [.pg\_\_toc_button&_small]:[color:rgba(255,_255,_255,_0.7)] [.pg\_\_dots_i&]:[width:2.4rem] [.pg\_\_dots_i&]:[background:var(--purple)] [.stfd\_\_tabs_button&]:[color:#fff] [.se\_\_dots_i&]:[width:6.4rem] [.sw-anes\_\_bar_i&]:[background:var(--grad)] [.sw-body_circle&]:[fill:var(--purple)] [.sw-vial\_\_body_i&]:[background:var(--grad)] [.sw-vial\_\_body_i&_small]:[color:#fff] [.sw-wound\_\_grid_i&]:[background:#c9b8ff] [.sw-wound\_\_grid_i&]:[border-color:transparent] [.sw-cal_i&]:[background:var(--purple)] [.sw-cal_i&]:[color:#fff] [.sw-wells_i&]:[background:#e2d9ff] [.sw-wells_i&]:[border-color:#c9b8ff] [.sw-shot_i&]:[background:var(--purple)] [.sw-shot_i&]:[border-color:var(--purple)] [.lf\_\_seg_button&]:[color:#fff] [.tc\_\_why_li&]:[opacity:1] [.sl\_\_tabs_button&]:[color:#fff] [.ar\_\_toc_a&]:[color:var(--ink-2)] [.ct-needs_button&]:[color:#fff] [.wa\_\_zones_li&]:[background:var(--grad)] [.wa\_\_zones_li&]:[border-color:transparent] [.wa\_\_zones_li&_small]:[color:#fff] [.wa\_\_zones_li&_b]:[color:#fff] [.wa\_\_zones_li&_em]:[color:#fff] [.se\_\_dots_i&]:[background:var(--purple)] [.ct-needs_button&]:[background:var(--grad)] [.ct-needs_button&]:[border-color:transparent] [.sc-cal_i&]:[background:var(--purple)] [.sc-cal_i&]:[color:#fff] [.ccp_button&]:[background:var(--purple)] [.ccp_button&]:[color:#fff] [.pa-art\_\_seg_button&]:[background:var(--grad)] [.pa-art\_\_seg_button&]:[color:#fff] [.pa-art\_\_steps_li&]:[background:var(--purple)] [.pa-art\_\_steps_li&]:[border-color:var(--purple)] [.pa-art\_\_steps_li&]:[color:#fff] [.ab-orbit\_\_rings_line&]:[stroke:var(--purple)] [.ab-orbit\_\_rings_line&]:[stroke-width:2]` : ''}
              onClick={(x) => { x.stopPropagation(); setMode(k); setH(0); setPlaying(true); }}>{l}</button>
          ))}
        </div>
      </div>
      <div className="pa-art__dial [position:relative] [width:min(24rem,70%)] [aspect-ratio:1] [&_svg]:[width:100%] [&_svg]:[height:100%] [&_svg]:[overflow:visible] [&_svg]:[filter:drop-shadow(0_1.6rem_3rem_#391ca02e)] [@media(min-width:1024px)]:[width:min(28rem,64%)]">
        <svg viewBox="0 0 140 140" aria-hidden>
          <defs><linearGradient id="paGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#8a6bff" /><stop offset="1" stopColor="#6a41f9" /></linearGradient></defs>
          <circle cx="70" cy="70" r="67" className="pa-art__face [fill:#fff]" />
          {Array.from({ length: ticks }, (_, i) => {
            const t = (i / ticks) * 2 * Math.PI - Math.PI / 2, big = i % (ticks / major) === 0, r1 = big ? 44 : 46.5;
            return <line key={i} x1={70 + r1 * Math.cos(t)} y1={70 + r1 * Math.sin(t)} x2={70 + 49 * Math.cos(t)} y2={70 + 49 * Math.sin(t)}
              className={String.raw`pa-art__tick [stroke:#ddd3ff] [stroke-width:1.2] [stroke-linecap:round] [&.is-major]:[stroke:#b9a6ff] [&.is-major]:[stroke-width:2] [&.is-past]:[stroke:#6a41f9] ${big ? 'is-major' : ''} ${i / ticks <= fr ? 'is-past' : ''}`} />;
          })}
          <circle cx="70" cy="70" r={R} className="pa-art__track [fill:none] [stroke:#efeaff] [stroke-width:8]" />
          <circle cx="70" cy="70" r={R} className="pa-art__arc [fill:none] [stroke:var(--u3)] [stroke-width:8] [stroke-linecap:round] [transform:rotate(-90deg)] [transform-origin:70px_70px]" strokeDasharray={C} strokeDashoffset={C * (1 - fr)} />
          <circle cx={kx} cy={ky} r="6" className="pa-art__knob [fill:#fff] [stroke:#6a41f9] [stroke-width:3]" />
        </svg>
        <div className="pa-art__c [position:absolute] [inset:0] [display:flex] [flex-direction:column] [align-items:center] [justify-content:center] [text-align:center] [gap:.5rem] [padding:0_22%] [&_b]:[font:600_4.4rem/1_var(--f-sans)] [&_b]:[letter-spacing:-.12rem] [&_b]:[color:var(--ink-2)] [&_b]:[font-variant-numeric:tabular-nums] [&_small]:[font:500_1.05rem/1.25_var(--f-mono)] [&_small]:[color:#7b7f92] [&_small]:[text-transform:uppercase] [&_small]:[letter-spacing:.05em] [@media(min-width:1024px)]:[&_b]:[font-size:5.2rem]">
          {done ? <>
            <span className="pa-art__ok [width:3.6rem] [height:3.6rem] [border-radius:50%] [display:grid] [place-items:center] [background:var(--grad)] [color:#fff] [animation:paPop_.5s_cubic-bezier(.16,1,.3,1)] [@media(prefers-reduced-motion:reduce)]:[animation:none]"><Check size={22} strokeWidth={3} /></span>
            <b className="pa-art__b--sm [.pa-art\_\_c_b&]:[font-size:2.2rem] [.pa-art\_\_c_b&]:[letter-spacing:-.04rem]">Decision due</b>
            <small>with a specific reason if denied</small>
          </> : <>
            <small>Payer must decide in</small>
            <b>{fmt}</b>
            <small>{mode === 'u' ? 'urgent request' : 'standard request'}</small>
          </>}
        </div>
      </div>
      <ol className="pa-art__steps [display:flex] [flex-wrap:wrap] [justify-content:center] [gap:.6rem] [list-style:none] [margin:0] [padding:0] [&_li]:[font:500_1.2rem/1_var(--f-sans)] [&_li]:[padding:.7rem_1.1rem] [&_li]:[border-radius:99px] [&_li]:[background:#ffffffc7] [&_li]:[border:1px_solid_#e6dfff] [&_li]:[color:#8a8ea0] [&_li]:[transition:background_.3s,color_.3s,border-color_.3s]" aria-hidden>
        {['Request sent', 'Payer review', 'Decision'].map((l, i) => <li key={l} className={i === stage ? String.raw`is-on [.assess\_\_steps_span&]:[color:var(--navy)] [.assess\_\_steps_span&_b]:[background:var(--purple)] [.assess\_\_steps_span&_b]:[border-color:var(--purple)] [.assess\_\_steps_span&_b]:[color:#fff]! [.assess\_\_steps_i&::after]:[transform:scaleX(1)] [.cx-read\_\_n_i&]:[width:2.4rem] [.cx-read\_\_n_i&]:[background:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [.sg\_\_toc_button&]:[color:var(--purple)] [.sg\_\_toc_button&]:[border-left-color:var(--purple)] [.pg\_\_toc_button&]:[color:#fff] [.pg\_\_toc_button&_small]:[color:rgba(255,_255,_255,_0.7)]! [.pg\_\_dots_i&]:[width:2.4rem] [.pg\_\_dots_i&]:[background:var(--purple)] [.stfd\_\_tabs_button&]:[color:#fff] [.se\_\_dots_i&]:[width:6.4rem] [.sw-anes\_\_bar_i&]:[background:var(--grad)] [.sw-body_circle&]:[fill:var(--purple)] [.sw-vial\_\_body_i&]:[background:var(--grad)] [.sw-vial\_\_body_i&_small]:[color:#fff]! [.sw-wound\_\_grid_i&]:[background:#c9b8ff] [.sw-wound\_\_grid_i&]:[border-color:transparent] [.sw-cal_i&]:[background:var(--purple)] [.sw-cal_i&]:[color:#fff] [.sw-wells_i&]:[background:#e2d9ff] [.sw-wells_i&]:[border-color:#c9b8ff] [.sw-shot_i&]:[background:var(--purple)] [.sw-shot_i&]:[border-color:var(--purple)] [.lf\_\_seg_button&]:[color:#fff] [.tc\_\_why_li&]:[opacity:1] [.sl\_\_tabs_button&]:[color:#fff] [.ar\_\_toc_a&]:[color:var(--ink-2)] [.ct-needs_button&]:[color:#fff] [.wa\_\_zones_li&]:[background:var(--grad)] [.wa\_\_zones_li&]:[border-color:transparent] [.wa\_\_zones_li&_small]:[color:#fff]! [.wa\_\_zones_li&_b]:[color:#fff]! [.wa\_\_zones_li&_em]:[color:#fff]! [.se\_\_dots_i&]:[background:var(--purple)] [.ct-needs_button&]:[background:var(--grad)] [.ct-needs_button&]:[border-color:transparent] [.sc-cal_i&]:[background:var(--purple)] [.sc-cal_i&]:[color:#fff] [.ccp_button&]:[background:var(--purple)] [.ccp_button&]:[color:#fff] [.pa-art\_\_seg_button&]:[background:var(--grad)] [.pa-art\_\_seg_button&]:[color:#fff] [.pa-art\_\_steps_li&]:[background:var(--purple)] [.pa-art\_\_steps_li&]:[border-color:var(--purple)] [.pa-art\_\_steps_li&]:[color:#fff]! [.ab-orbit\_\_rings_line&]:[stroke:var(--purple)] [.ab-orbit\_\_rings_line&]:[stroke-width:2]` : i < stage ? String.raw`is-done [.pp\_\_list_li&]:[color:var(--ink-2)] [.pa-art\_\_steps_li&]:[color:#6a41f9]` : ''}>{l}</li>)}
      </ol>
      <div className="pa-art__scrub [display:flex] [align-items:center] [gap:1.2rem] [width:min(34rem,90%)] [&_input]:[flex:1] [&_input]:[min-width:0] [&_input]:[accent-color:#6a41f9] [&_input]:[cursor:pointer]" onClick={stop} onPointerDown={stop}>
        <button type="button" className="pa-art__play [flex:none] [width:3.4rem] [height:3.4rem] [border-radius:50%] [border:1px_solid_#e6dfff] [background:#fff] [color:#6a41f9] [cursor:pointer] [display:grid] [place-items:center] [font-size:1.1rem] [line-height:1]" aria-label={playing ? 'Pause' : 'Play'} onClick={(x) => { x.stopPropagation(); setPlaying(!playing); }}>{playing ? '❚❚' : '▶'}</button>
        <input type="range" min={0} max={D} step={1} value={Math.round(h)} aria-label="Hours since the request was sent" onChange={(x) => { setPlaying(false); setH(+x.target.value); }} />
      </div>
      <p className="pa-art__src [position:absolute] [bottom:1.8rem] [left:2rem] [right:2rem] [margin:0] [text-align:center] [font:400_1.05rem/1.35_var(--f-mono)] [color:#8a8ea0]">CMS-0057-F · Medicare Advantage, Medicaid &amp; CHIP · since Jan 1, 2026</p>
    </div>
  );
}
