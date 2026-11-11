import { motion } from 'motion/react';
import { Phone, Check } from 'lucide-react';

/**
 * Blog covers as tiny scenes from a practice's day, the things doctors and office managers
 * actually stare at: an EOB with a denial, a claim box missing its modifier, a timely-filing
 * countdown, a payer hold screen, a sticky note on the front desk, a KPI moving the right way.
 * Pure CSS/SVG in the purple palette, so every cover is on-brand and costs no stock photo.
 */
export type Cover =
  | { k: 'eob'; code: string; desc: string; amt: string; reason: string; stamp: string }
  | { k: 'claim'; code: string; mod: string; box: string; label: string }
  | { k: 'clock'; n: number; of: number; unit: string; label: string }
  | { k: 'hold'; payer: string; time: string; label: string }
  | { k: 'sticky'; note: string; sub: string }
  | { k: 'stat'; from: string; to: string; label: string; bars: number[] };

const lift = { rest: { y: 0, rotate: -2 }, hover: { y: -6, rotate: -1, transition: { type: 'spring', stiffness: 260, damping: 18 } } } as const;

function EOB({ c }: { c: Extract<Cover, { k: 'eob' }> }) {
  return (
    <motion.div className="sc sc--paper [position:relative] [width:min(34rem,_82%)] [padding:1.8rem_2rem] [border-radius:1.6rem] [background:#fff] [border:1px_solid_#ece8fa] [box-shadow:0_2.4rem_5rem_-1.6rem_rgba(57,_28,_160,_0.28)] [font-size:1.3rem] [color:var(--ink-2)] [.bc--big_&]:[width:min(46rem,_80%)] [.bc--big_&]:[font-size:1.6rem] [.bc--big_&]:[padding:2.4rem_2.8rem] [@media(max-width:_640px)]:[padding:1.4rem_1.6rem]" variants={lift}>
      <p className="sc__k [font-family:var(--f-mono)] [font-size:1rem] [letter-spacing:0.08em] [text-transform:uppercase] [color:#8a8ea0] [margin-bottom:1.2rem] [.bc--big_&]:[font-size:1.2rem]">Explanation of benefits</p>
      <div className="sc-eob__row sc-eob__head [display:grid] [grid-template-columns:5rem_1fr_5rem_6.4rem] [gap:0.8rem] [align-items:center] [padding:0.9rem_0] [border-top:0] [padding-top:0]! [font-family:var(--f-mono)] [font-size:0.95rem] [text-transform:uppercase] [color:#a7a3b9] [&_code]:[font-family:var(--f-mono)] [&_code]:[color:var(--purple)] [&_b]:[font-weight:600] [&_em]:[position:relative] [&_em]:[font-style:normal] [&_em]:[font-family:var(--f-mono)] [&_em]:[font-weight:600] [&_em]:[color:var(--purple)] [&_em]:[justify-self:start] [&_em]:[padding:0_0.4rem]! [&_em_svg]:[position:absolute] [&_em_svg]:[inset:-0.9rem_-1.2rem] [&_em_svg]:[width:calc(100%_+_2.4rem)] [&_em_svg]:[height:calc(100%_+_1.8rem)] [&_em_svg]:[fill:none] [&_em_svg]:[stroke:var(--purple)] [&_em_svg]:[stroke-width:2.2] [&_em_svg]:[stroke-linecap:round]"><span>Code</span><span>Service</span><span>Paid</span><span>Reason</span></div>
      <div className="sc-eob__row [display:grid] [grid-template-columns:5rem_1fr_5rem_6.4rem] [gap:0.8rem] [align-items:center] [padding:0.9rem_0] [border-top:1px_solid_#f0edf8] [&_code]:[font-family:var(--f-mono)] [&_code]:[color:var(--purple)] [&_b]:[font-weight:600] [&_em]:[position:relative] [&_em]:[font-style:normal] [&_em]:[font-family:var(--f-mono)] [&_em]:[font-weight:600] [&_em]:[color:var(--purple)] [&_em]:[justify-self:start] [&_em]:[padding:0_0.4rem] [&_em_svg]:[position:absolute] [&_em_svg]:[inset:-0.9rem_-1.2rem] [&_em_svg]:[width:calc(100%_+_2.4rem)] [&_em_svg]:[height:calc(100%_+_1.8rem)] [&_em_svg]:[fill:none] [&_em_svg]:[stroke:var(--purple)] [&_em_svg]:[stroke-width:2.2] [&_em_svg]:[stroke-linecap:round]"><code>{c.code}</code><span>{c.desc}</span><b>{c.amt}</b>
        <em>{c.reason}<svg viewBox="0 0 80 34" aria-hidden><path d="M8 18 C 6 4, 70 2, 74 16 S 30 34, 12 26" /></svg></em>
      </div>
      <div className="sc-eob__row sc-eob__ghost [display:grid] [grid-template-columns:5rem_1fr_5rem_6.4rem] [gap:0.8rem] [align-items:center] [padding:0.9rem_0] [border-top:1px_solid_#f0edf8] [&_code]:[font-family:var(--f-mono)] [&_code]:[color:var(--purple)] [&_b]:[font-weight:600] [&_em]:[position:relative] [&_em]:[font-style:normal] [&_em]:[font-family:var(--f-mono)] [&_em]:[font-weight:600] [&_em]:[color:var(--purple)] [&_em]:[justify-self:start] [&_em]:[padding:0_0.4rem] [&_em_svg]:[position:absolute] [&_em_svg]:[inset:-0.9rem_-1.2rem] [&_em_svg]:[width:calc(100%_+_2.4rem)] [&_em_svg]:[height:calc(100%_+_1.8rem)] [&_em_svg]:[fill:none] [&_em_svg]:[stroke:var(--purple)] [&_em_svg]:[stroke-width:2.2] [&_em_svg]:[stroke-linecap:round] [&_i]:[display:block] [&_i]:[height:0.7rem] [&_i]:[border-radius:1rem] [&_i]:[background:#f1eef9]"><i /><i /><i /><i /></div>
      <motion.span className="sc__stamp [position:absolute] [right:-1.6rem] [bottom:-1.4rem] [padding:0.5rem_1.2rem] [border:2.5px_solid_var(--purple)] [border-radius:0.8rem] [font-family:var(--f-mono)] [font-weight:700] [font-size:1.3rem] [letter-spacing:0.14em] [text-transform:uppercase] [color:var(--purple)] [background:rgba(255,_255,_255,_0.92)]" variants={{ rest: { scale: 1, rotate: -12 }, hover: { scale: 1.08, rotate: -8 } }}>{c.stamp}</motion.span>
    </motion.div>
  );
}

function Claim({ c }: { c: Extract<Cover, { k: 'claim' }> }) {
  return (
    <motion.div className="sc sc--paper sc-claim [position:relative] [width:min(34rem,_82%)] [padding:1.8rem_2rem] [border-radius:1.6rem] [background:#fff] [border:1px_solid_#ece8fa] [box-shadow:0_2.4rem_5rem_-1.6rem_rgba(57,_28,_160,_0.28)] [font-size:1.3rem] [color:var(--ink-2)] [.bc--big_&]:[width:min(46rem,_80%)] [.bc--big_&]:[font-size:1.6rem] [.bc--big_&]:[padding:2.4rem_2.8rem] [@media(max-width:_640px)]:[padding:1.4rem_1.6rem]" variants={lift}>
      <p className="sc__k [font-family:var(--f-mono)] [font-size:1rem] [letter-spacing:0.08em] [text-transform:uppercase] [color:#8a8ea0] [margin-bottom:1.2rem] [.bc--big_&]:[font-size:1.2rem]">CMS-1500 · {c.box}</p>
      <div className="sc-claim__grid [display:grid] [grid-template-columns:1.4fr_1fr] [border:1px_solid_#e5e0f5] [border-radius:0.8rem] [overflow:hidden] [&>div]:[padding:1rem_1.2rem] [&>div]:[display:flex] [&>div]:[flex-direction:column] [&>div]:[gap:0.4rem] [&>div+div]:[border-left:1px_solid_#e5e0f5] [&_small]:[font-family:var(--f-mono)] [&_small]:[font-size:0.95rem] [&_small]:[text-transform:uppercase] [&_small]:[color:#a7a3b9] [&_b]:[font-family:var(--f-mono)] [&_b]:[font-size:2.6rem] [&_b]:[font-weight:500] [&_b]:[letter-spacing:-0.04em] [&_b]:[display:flex] [&_b]:[align-items:center] [&_b]:[gap:0.3rem] [.bc--big_&_b]:[font-size:4rem]">
        <div><small>CPT/HCPCS</small><b>{c.code}</b></div>
        <div className="is-mod [.sc-claim\_\_grid_&]:[background:#f4f0ff] [.sc-claim\_\_grid_&_b]:[color:var(--purple)]"><small>Modifier</small>
          <b><motion.span variants={{ rest: { opacity: 1 }, hover: { opacity: 1 } }}>{c.mod}</motion.span><i className="sc-claim__caret [width:2px] [height:1em] [background:var(--purple)] [animation:sc-blink_1s_steps(1)_infinite]" /></b>
        </div>
      </div>
      <p className="sc-claim__note [position:relative] [margin-top:1.4rem] [font-family:'Caveat',_'Segoe_Print',_cursive] [font-size:1.9rem] [color:var(--purple)] [padding-top:0.6rem] [&_svg]:[position:absolute] [&_svg]:[left:0] [&_svg]:[top:-0.2rem] [&_svg]:[width:12rem] [&_svg]:[height:1.2rem] [&_svg]:[fill:none] [&_svg]:[stroke:var(--purple)] [&_svg]:[stroke-width:2] [&_svg]:[stroke-linecap:round] [&_svg]:[opacity:0.6] [@media(max-width:_640px)]:[font-size:1.6rem]"><svg viewBox="0 0 120 12" aria-hidden><path d="M2 8 C 30 2, 60 12, 90 6 S 112 4, 118 7" /></svg>{c.label}</p>
    </motion.div>
  );
}

function Clock({ c }: { c: Extract<Cover, { k: 'clock' }> }) {
  const R = 46, C = 2 * Math.PI * R, p = Math.min(1, c.n / c.of);
  return (
    <motion.div className="sc sc--paper sc-clock [position:relative] [padding:1.8rem_2rem] [border-radius:1.6rem] [background:#fff] [border:1px_solid_#ece8fa] [box-shadow:0_2.4rem_5rem_-1.6rem_rgba(57,_28,_160,_0.28)] [font-size:1.3rem] [color:var(--ink-2)] [.bc--big_&]:[width:min(46rem,_80%)] [.bc--big_&]:[font-size:1.6rem] [.bc--big_&]:[padding:2.4rem_2.8rem] [display:grid] [grid-template-columns:auto_1fr] [align-items:center] [gap:1.6rem] [width:min(30rem,_78%)] [&_svg]:[width:9.6rem] [&_svg]:[height:9.6rem] [&_svg]:[rotate:-90deg] [&_svg]:[grid-row:span_2] [.bc--big_&_svg]:[width:14rem] [.bc--big_&_svg]:[height:14rem] [@media(max-width:_640px)]:[padding:1.4rem_1.6rem]" variants={lift}>
      <svg viewBox="0 0 120 120" aria-hidden>
        <circle cx="60" cy="60" r={R} className="sc-clock__track [fill:none] [stroke:#ece6ff] [stroke-width:9]" />
        <motion.circle cx="60" cy="60" r={R} className="sc-clock__arc [fill:none] [stroke:var(--purple)] [stroke-width:9] [stroke-linecap:round]" strokeDasharray={C}
          initial={{ strokeDashoffset: C }} whileInView={{ strokeDashoffset: C * (1 - p) }} viewport={{ once: true }} transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }} />
      </svg>
      <div className="sc-clock__n [&_b]:[display:block] [&_b]:[font-weight:500] [&_b]:[font-size:4.4rem] [&_b]:[line-height:1] [&_b]:[letter-spacing:-0.12rem] [&_b]:[color:var(--purple)] [.bc--big_&_b]:[font-size:6.4rem] [&_small]:[font-family:var(--f-mono)] [&_small]:[font-size:1.1rem] [&_small]:[color:#8a8ea0] [&_small]:[text-transform:uppercase]"><b>{c.n}</b><small>of {c.of} {c.unit}</small></div>
      <p className="sc-clock__label [align-self:start] [font-size:1.4rem] [color:#4a4f63]">{c.label}</p>
    </motion.div>
  );
}

function Hold({ c }: { c: Extract<Cover, { k: 'hold' }> }) {
  return (
    <motion.div className="sc sc-hold [position:relative] [border:1px_solid_#ece8fa] [box-shadow:0_2.4rem_5rem_-1.6rem_rgba(57,_28,_160,_0.28)] [font-size:1.3rem] [.bc--big_&]:[width:min(46rem,_80%)] [.bc--big_&]:[font-size:1.6rem] [.bc--big_&]:[padding:2.4rem_2.8rem] [width:min(26rem,_70%)] [text-align:center] [background:#1d1440] [border-color:#2c2160]! [color:#fff] [padding:2rem] [border-radius:2.4rem] [@media(max-width:_640px)]:[padding:1.4rem_1.6rem]" variants={lift}>
      <span className="sc-hold__icon [width:4rem] [height:4rem] [margin:0_auto_1rem] [border-radius:50%] [display:grid] [place-items:center] [background:var(--grad)]"><Phone size={18} /></span>
      <p className="sc-hold__payer [font-size:1.2rem] [color:#b9b3d1]">{c.payer}</p>
      <p className="sc-hold__time [margin:0.4rem_0_1.2rem] [font-family:var(--f-mono)] [font-size:3rem] [letter-spacing:-0.04em] [font-variant-numeric:tabular-nums]">{c.time}</p>
      <div className="sc-hold__wave [height:3rem] [display:flex] [align-items:center] [justify-content:center] [gap:0.35rem] [&_i]:[width:0.35rem] [&_i]:[border-radius:1rem] [&_i]:[background:#8a6bff] [&_i]:[animation:sc-wave_1s_ease-in-out_infinite_alternate] [&_i]:[transform-origin:center]" aria-hidden>{Array.from({ length: 18 }, (_, i) => <i key={i} style={{ animationDelay: `${(i % 6) * 0.12}s`, height: `${30 + ((i * 37) % 60)}%` }} />)}</div>
      <p className="sc-hold__label [margin-top:1.2rem] [font-size:1.2rem] [color:#d7d2ea]">{c.label}</p>
    </motion.div>
  );
}

function Sticky({ c }: { c: Extract<Cover, { k: 'sticky' }> }) {
  return (
    <div className="sc-sticky-wrap [position:relative] [width:min(34rem,_82%)]">
      <div className="sc sc--paper sc-cal [position:relative] [width:min(34rem,_82%)] [border-radius:1.6rem] [background:#fff] [border:1px_solid_#ece8fa] [box-shadow:0_2.4rem_5rem_-1.6rem_rgba(57,_28,_160,_0.28)] [font-size:1.3rem] [color:var(--ink-2)] [.bc--big_&]:[width:min(46rem,_80%)] [.bc--big_&]:[font-size:1.6rem] [.bc--big_&]:[padding:2.4rem_2.8rem] [display:grid] [grid-template-columns:repeat(7,_1fr)] [gap:0.5rem] [padding:1.6rem] [&_i]:[font-style:normal] [&_i]:[font-family:var(--f-mono)] [&_i]:[font-size:1.1rem] [&_i]:[color:#b0abc4] [&_i]:[text-align:center] [&_i]:[padding:0.5rem_0] [&_i]:[border-radius:0.6rem] [@media(max-width:_640px)]:[padding:1.4rem_1.6rem]" aria-hidden>
        {Array.from({ length: 21 }, (_, i) => <i key={i} className={i === 15 ? String.raw`is-on [.assess\_\_steps_span&]:[color:var(--navy)] [.assess\_\_steps_span&_b]:[background:var(--purple)] [.assess\_\_steps_span&_b]:[border-color:var(--purple)] [.assess\_\_steps_span&_b]:[color:#fff] [.assess\_\_steps_i&::after]:[transform:scaleX(1)] [.cx-read\_\_n_i&]:[width:2.4rem] [.cx-read\_\_n_i&]:[background:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [.sg\_\_toc_button&]:[color:var(--purple)] [.sg\_\_toc_button&]:[border-left-color:var(--purple)] [.pg\_\_toc_button&]:[color:#fff] [.pg\_\_toc_button&_small]:[color:rgba(255,_255,_255,_0.7)] [.pg\_\_dots_i&]:[width:2.4rem] [.pg\_\_dots_i&]:[background:var(--purple)] [.stfd\_\_tabs_button&]:[color:#fff] [.se\_\_dots_i&]:[width:6.4rem] [.sw-anes\_\_bar_i&]:[background:var(--grad)] [.sw-body_circle&]:[fill:var(--purple)] [.sw-vial\_\_body_i&]:[background:var(--grad)] [.sw-vial\_\_body_i&_small]:[color:#fff] [.sw-wound\_\_grid_i&]:[background:#c9b8ff] [.sw-wound\_\_grid_i&]:[border-color:transparent] [.sw-cal_i&]:[background:var(--purple)] [.sw-cal_i&]:[color:#fff] [.sw-wells_i&]:[background:#e2d9ff] [.sw-wells_i&]:[border-color:#c9b8ff] [.sw-shot_i&]:[background:var(--purple)] [.sw-shot_i&]:[border-color:var(--purple)] [.lf\_\_seg_button&]:[color:#fff] [.tc\_\_why_li&]:[opacity:1] [.sl\_\_tabs_button&]:[color:#fff] [.ar\_\_toc_a&]:[color:var(--ink-2)] [.ct-needs_button&]:[color:#fff] [.wa\_\_zones_li&]:[background:var(--grad)] [.wa\_\_zones_li&]:[border-color:transparent] [.wa\_\_zones_li&_small]:[color:#fff] [.wa\_\_zones_li&_b]:[color:#fff] [.wa\_\_zones_li&_em]:[color:#fff] [.se\_\_dots_i&]:[background:var(--purple)] [.ct-needs_button&]:[background:var(--grad)] [.ct-needs_button&]:[border-color:transparent] [.sc-cal_i&]:[background:var(--purple)] [.sc-cal_i&]:[color:#fff] [.ccp_button&]:[background:var(--purple)] [.ccp_button&]:[color:#fff] [.pa-art\_\_seg_button&]:[background:var(--grad)] [.pa-art\_\_seg_button&]:[color:#fff] [.pa-art\_\_steps_li&]:[background:var(--purple)] [.pa-art\_\_steps_li&]:[border-color:var(--purple)] [.pa-art\_\_steps_li&]:[color:#fff] [.ab-orbit\_\_rings_line&]:[stroke:var(--purple)] [.ab-orbit\_\_rings_line&]:[stroke-width:2]` : ''}>{i + 1}</i>)}
      </div>
      <motion.div className="sc-sticky [position:absolute] [right:-1.2rem] [top:-2.4rem] [width:58%] [padding:1.6rem_1.6rem_2rem] [background:#fff6c9] [box-shadow:0_1.6rem_3rem_-1rem_rgba(60,_40,_0,_0.28)] [border-radius:0.4rem] [&_p]:[font-family:'Caveat',_'Segoe_Print',_cursive] [&_p]:[font-size:2.2rem] [&_p]:[line-height:1.05] [&_p]:[color:#2a2550] [&_small]:[display:block] [&_small]:[margin-top:0.6rem] [&_small]:[font-family:'Caveat',_'Segoe_Print',_cursive] [&_small]:[font-size:1.8rem] [&_small]:[color:var(--purple)] [@media(max-width:_640px)]:[width:62%] [@media(max-width:_640px)]:[right:-0.4rem] [@media(max-width:_640px)]:[top:-1.2rem] [@media(max-width:_640px)]:[padding:1.2rem_1.2rem_1.4rem] [@media(max-width:_640px)]:[&_p]:[font-size:1.8rem] [@media(max-width:_640px)]:[&_small]:[font-size:1.5rem]" variants={{ rest: { rotate: 4, y: 0 }, hover: { rotate: 1, y: -6 } }}>
        <p>{c.note}</p><small>{c.sub}</small>
      </motion.div>
    </div>
  );
}

function Stat({ c }: { c: Extract<Cover, { k: 'stat' }> }) {
  const max = Math.max(...c.bars);
  return (
    <motion.div className="sc sc--paper sc-stat [position:relative] [width:min(34rem,_82%)] [padding:1.8rem_2rem] [border-radius:1.6rem] [background:#fff] [border:1px_solid_#ece8fa] [box-shadow:0_2.4rem_5rem_-1.6rem_rgba(57,_28,_160,_0.28)] [font-size:1.3rem] [color:var(--ink-2)] [.bc--big_&]:[width:min(46rem,_80%)] [.bc--big_&]:[font-size:1.6rem] [.bc--big_&]:[padding:2.4rem_2.8rem] [@media(max-width:_640px)]:[padding:1.4rem_1.6rem]" variants={lift}>
      <p className="sc__k [font-family:var(--f-mono)] [font-size:1rem] [letter-spacing:0.08em] [text-transform:uppercase] [color:#8a8ea0] [margin-bottom:1.2rem] [.bc--big_&]:[font-size:1.2rem]">{c.label}</p>
      <p className="sc-stat__n [display:flex] [align-items:baseline] [gap:1rem] [font-weight:500] [&_s]:[font-size:2.4rem] [&_s]:[color:#b0abc4] [&_span]:[color:#b0abc4] [&_b]:[font-size:4.4rem] [&_b]:[letter-spacing:-0.12rem] [&_b]:[color:var(--purple)]"><s>{c.from}</s><span>→</span><b>{c.to}</b></p>
      <div className="sc-stat__bars [margin-top:1.2rem] [height:5.6rem] [display:flex] [align-items:flex-end] [gap:0.6rem] [&_i]:[flex:1] [&_i]:[height:100%] [&_i]:[border-radius:0.6rem] [&_i]:[background:#e6e0fb] [&_i]:[transform-origin:bottom]" aria-hidden>
        {c.bars.map((v, i) => <motion.i key={i} initial={{ scaleY: 0 }} whileInView={{ scaleY: v / max }} viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }} className={i === c.bars.length - 1 ? String.raw`is-now [.sc-stat\_\_bars_i&]:[background:var(--grad)]` : ''} />)}
      </div>
      <span className="sc-stat__ok [position:absolute] [right:1.6rem] [top:1.6rem] [width:2.4rem] [height:2.4rem] [border-radius:50%] [display:grid] [place-items:center] [background:var(--purple)] [color:#fff]"><Check size={12} strokeWidth={3} /></span>
    </motion.div>
  );
}

export function SceneCover({ c }: { c: Cover }) {
  return (
    <div className={String.raw`scene [position:relative] [width:100%] [height:100%] [display:grid] [place-items:center] [padding:4.8rem_2.4rem_2rem] [.bk.is-soon_&]:[opacity:0.88] scene--${c.k}`} aria-hidden>
      {c.k === 'eob' && <EOB c={c} />}
      {c.k === 'claim' && <Claim c={c} />}
      {c.k === 'clock' && <Clock c={c} />}
      {c.k === 'hold' && <Hold c={c} />}
      {c.k === 'sticky' && <Sticky c={c} />}
      {c.k === 'stat' && <Stat c={c} />}
    </div>
  );
}
