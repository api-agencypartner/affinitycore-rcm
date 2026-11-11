/**
 * Featured-card artwork for the blog hub: an editorial desk scene made of UI pieces, not tied to one article.
 * A guide page with a highlighted line, a denial letter stamped "Fixed", a magnifier over a code,
 * a reading-progress card and topic chips that drift. Pure CSS/SVG, gentle float, still for reduced motion.
 */
import { motion, useReducedMotion } from 'motion/react';
import { BookOpen, Check, Search } from 'lucide-react';

const CHIPS: [string, string, string, number][] = [
  ['Prior auth', '8%', '14%', 0], ['Coding', '70%', '9%', 0.6], ['Denials', '40%', '6%', 1.2], ['A/R', '6%', '58%', 1.8], ['Credentialing', '40%', '91%', 2.4],
];

export function BlogArt() {
  const still = useReducedMotion();
  const float = (d: number, y = 8) => (still ? {} : { animate: { y: [0, -y, 0] }, transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' as const, delay: d } });
  return (
    <div className="bc bc--big ba [position:relative] [isolation:isolate] [overflow:hidden] [display:flex] [background:radial-gradient(120%_90%_at_85%_10%,_#ede6ff_0%,_#f6f3ff_45%,_#fbfaff_100%)] [justify-content:center] [align-items:center] [&::before]:[content:''] [&::before]:[position:absolute] [&::before]:[inset:0] [&::before]:[z-index:-1] [&::before]:[background-image:radial-gradient(rgba(106,_65,_249,_0.12)_1px,_transparent_1.2px)] [&::before]:[background-size:1.8rem_1.8rem] [&::before]:[-webkit-mask-image:linear-gradient(180deg,_#000,_transparent_85%)] [&::before]:[mask-image:linear-gradient(180deg,_#000,_transparent_85%)] [aspect-ratio:auto] [height:100%] [min-height:34rem] [border-radius:3.2rem_0_0_3.2rem] [padding:4rem] [@media(max-width:_1279px)]:[min-height:22rem] [@media(max-width:_1279px)]:[border-radius:3.2rem_3.2rem_0_0] [&.bc--big.pa-art]:[flex-direction:column] [&.bc--big.pa-art]:[justify-content:center] [&.bc--big.pa-art]:[gap:1.8rem] [&.bc--big.pa-art]:[cursor:default] [&.bc--big.pa-art]:[min-height:56rem] [&.bc--big.pa-art]:[padding:8.4rem_2rem_6.4rem] [@media(min-width:1024px)]:[&.bc--big.pa-art]:[min-height:60rem] [@media(min-width:1024px)]:[&.bc--big.pa-art]:[padding:9rem_3.2rem_6.8rem] [&.bc--big.ba]:[position:relative] [&.bc--big.ba]:[overflow:hidden] [&.bc--big.ba]:[min-height:56rem] [&.bc--big.ba]:[background:var(--soft-grain),_var(--soft-bg)] [&.bc--big.ba]:[cursor:pointer] [&.bc--big.ba]:[isolation:isolate] [@media(max-width:_1279px)]:[&.bc--big.ba]:[min-height:48rem] [@media(max-width:_640px)]:[&.bc--big.ba]:[min-height:40rem]" aria-hidden>
      <span className="ba__rings [position:absolute] [inset:-20%] [z-index:-1] [background:repeating-radial-gradient(circle_at_55%_48%,_transparent_0_4rem,_rgba(106,_65,_249,_0.06)_4rem_4.1rem)]" />
      {/* back sheet: the guide */}
      <motion.div className="ba__sheet [position:absolute] [left:20%] [top:18%] [width:54%] [padding:2.8rem] [border-radius:2.2rem] [background:#fff] [box-shadow:0_3rem_7rem_rgba(57,_28,_160,_0.16)] [@media(max-width:_640px)]:[left:14%] [@media(max-width:_640px)]:[top:16%] [@media(max-width:_640px)]:[width:66%] [@media(max-width:_640px)]:[padding:1.8rem]" initial={{ opacity: 0, rotate: -10, y: 30 }} animate={{ opacity: 1, rotate: -6, y: 0 }} transition={{ duration: 1.1, delay: 0.3 }}>
        <motion.div {...float(0, 6)}>
          <span className="ba__kick [display:inline-flex] [align-items:center] [gap:0.6rem] [font-family:var(--f-mono)] [font-size:1.1rem] [letter-spacing:0.05em] [text-transform:uppercase] [color:var(--purple)]"><BookOpen size={13} /> Guide · 6 min</span>
          <b className="ba__h [display:block] [margin:1.2rem_0_1.8rem] [font-family:var(--f-jak)] [font-weight:600] [font-size:2.6rem] [line-height:1.15] [letter-spacing:-0.06rem] [color:var(--ink-2)] [@media(max-width:_640px)]:[font-size:1.8rem] [@media(max-width:_640px)]:[margin:0.8rem_0_1rem]">Billing, explained in plain English.</b>
          <i className="ba__l [display:block] [height:0.8rem] [margin-top:1rem] [border-radius:1rem] [background:#efeaff]" style={{ width: '92%' }} /><i className="ba__l [display:block] [height:0.8rem] [margin-top:1rem] [border-radius:1rem] [background:#efeaff]" style={{ width: '84%' }} />
          <i className="ba__l ba__l--hi [display:block] [height:0.8rem] [margin-top:1rem] [border-radius:1rem] [background:linear-gradient(90deg,_rgba(1,_231,_231,_0.45),_rgba(201,_0,_251,_0.3))]" style={{ width: '70%' }} />
          <i className="ba__l [display:block] [height:0.8rem] [margin-top:1rem] [border-radius:1rem] [background:#efeaff]" style={{ width: '88%' }} /><i className="ba__l [display:block] [height:0.8rem] [margin-top:1rem] [border-radius:1rem] [background:#efeaff]" style={{ width: '60%' }} />
          <span className="ba__mini [display:flex] [align-items:flex-end] [gap:0.6rem] [height:5.6rem] [margin-top:2rem] [&_i]:[flex:1] [&_i]:[border-radius:0.6rem_0.6rem_0.2rem_0.2rem] [&_i]:[background:#e6dfff] [&_i:nth-child(1)]:[height:40%] [&_i:nth-child(2)]:[height:62%] [&_i:nth-child(3)]:[height:48%] [&_i:nth-child(4)]:[height:80%] [&_i:nth-child(4)]:[background:var(--purple)] [&_i:nth-child(5)]:[height:66%] [@media(max-width:_640px)]:[height:3.6rem]"><i /><i /><i /><i /><i /></span>
        </motion.div>
      </motion.div>
      {/* front-left: denial letter, fixed */}
      <motion.div className="ba__letter [position:absolute] [left:7%] [bottom:13%] [width:36%] [padding:2rem] [border-radius:1.8rem] [background:#fff] [box-shadow:0_2.4rem_5rem_rgba(57,_28,_160,_0.14)] [z-index:2] [&_small]:[font-family:var(--f-mono)] [&_small]:[font-size:1rem] [&_small]:[letter-spacing:0.05em] [&_small]:[text-transform:uppercase] [&_small]:[color:#8a8ea0] [@media(max-width:_640px)]:[width:46%] [@media(max-width:_640px)]:[padding:1.4rem] [@media(max-width:_640px)]:[left:5%]" initial={{ opacity: 0, x: -30, rotate: 2 }} animate={{ opacity: 1, x: 0, rotate: 5 }} transition={{ duration: 1, delay: 0.55 }}>
        <motion.div {...float(1, 7)}>
          <small>Remittance advice</small>
          <span className="ba__code [display:block] [margin-top:0.6rem] [font-family:var(--f-mono)] [font-weight:600] [font-size:2.4rem] [color:var(--ink-2)] [@media(max-width:_640px)]:[font-size:1.8rem]">CO-197</span>
          <i className="ba__l [display:block] [height:0.8rem] [margin-top:1rem] [border-radius:1rem] [background:#efeaff]" style={{ width: '90%' }} /><i className="ba__l [display:block] [height:0.8rem] [margin-top:1rem] [border-radius:1rem] [background:#efeaff]" style={{ width: '64%' }} />
          <motion.span className="ba__stamp [position:absolute] [right:-1.2rem] [top:-1.2rem] [display:inline-flex] [align-items:center] [gap:0.4rem] [padding:0.6rem_1.2rem] [border-radius:1rem] [border:2px_solid_#22c55e] [background:#f0fdf4] [color:#15803d] [font:700_1.3rem/1_var(--f-sans)] [text-transform:uppercase] [letter-spacing:0.06em]" initial={{ scale: 1.6, opacity: 0, rotate: -18 }} animate={{ scale: 1, opacity: 1, rotate: -12 }} transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 1.5 }}><Check size={14} strokeWidth={3} /> Fixed</motion.span>
        </motion.div>
      </motion.div>
      {/* magnifier */}
      <motion.div className="ba__lens [position:absolute] [right:9%] [top:30%] [z-index:3] [@media(max-width:_640px)]:[right:5%] [@media(max-width:_640px)]:[top:26%]" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.9 }}>
        <motion.div {...float(0.4, 10)} className="ba__lens-in [position:relative] [width:12rem] [height:12rem] [border-radius:50%] [display:flex] [flex-direction:column] [align-items:center] [justify-content:center] [background:rgba(255,_255,_255,_0.6)] [-webkit-backdrop-filter:blur(0.6rem)] [backdrop-filter:blur(0.6rem)] [border:0.5rem_solid_#fff] [box-shadow:0_2rem_5rem_rgba(57,_28,_160,_0.22),_inset_0_0_0_1px_#e6dfff] [&::after]:[content:''] [&::after]:[position:absolute] [&::after]:[right:-2.6rem] [&::after]:[bottom:-2.6rem] [&::after]:[width:4rem] [&::after]:[height:1.2rem] [&::after]:[border-radius:1rem] [&::after]:[background:var(--ink-2)] [&::after]:[transform:rotate(45deg)] [&_span]:[font-family:var(--f-jak)] [&_span]:[font-weight:600] [&_span]:[font-size:4rem] [&_span]:[line-height:1] [&_span]:[background:var(--grad)] [&_span]:[-webkit-background-clip:text] [&_span]:[background-clip:text]! [&_span]:[color:transparent] [&_small]:[margin-top:0.4rem] [&_small]:[font-family:var(--f-mono)] [&_small]:[font-size:1rem] [&_small]:[letter-spacing:0.05em] [&_small]:[text-transform:uppercase] [&_small]:[color:#8a8ea0] [@media(max-width:_640px)]:[width:8.4rem] [@media(max-width:_640px)]:[height:8.4rem] [@media(max-width:_640px)]:[border-width:0.4rem] [@media(max-width:_640px)]:[&_span]:[font-size:2.8rem]"><span>25</span><small>modifier</small><Search className="ba__lens-ic [position:absolute] [top:1.2rem] [right:1.6rem] [color:var(--purple)] [opacity:0.6]" size={18} /></motion.div>
      </motion.div>
      {/* reading progress */}
      <motion.div className="ba__prog [position:absolute] [right:7%] [bottom:10%] [width:34%] [padding:1.8rem_2rem] [border-radius:1.8rem] [background:rgba(255,_255,_255,_0.85)] [border:1px_solid_#fff] [box-shadow:0_2rem_4rem_rgba(57,_28,_160,_0.12)] [z-index:2] [&_small]:[font-family:var(--f-mono)] [&_small]:[font-size:1rem] [&_small]:[letter-spacing:0.05em] [&_small]:[text-transform:uppercase] [&_small]:[color:#8a8ea0] [&_b]:[display:block] [&_b]:[margin-top:0.4rem] [&_b]:[font-weight:600] [&_b]:[font-size:2rem] [&_b]:[color:var(--ink-2)] [@media(max-width:_640px)]:[width:42%] [@media(max-width:_640px)]:[padding:1.2rem_1.4rem] [@media(max-width:_640px)]:[right:5%] [@media(max-width:_640px)]:[&_b]:[font-size:1.5rem]" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.75 }}>
        <motion.div {...float(1.6, 6)}>
          <small>This month’s reading</small>
          <b>4 new guides</b>
          <span className="ba__bar [display:block] [height:0.8rem] [margin-top:1.2rem] [border-radius:1rem] [background:#efeaff] [overflow:hidden] [&_i]:[display:block] [&_i]:[height:100%] [&_i]:[border-radius:inherit] [&_i]:[background:linear-gradient(90deg,_#01e7e7,_#5696f1_45%,_#c900fb)]"><motion.i initial={{ width: 0 }} animate={{ width: '72%' }} transition={{ duration: 1.6, delay: 1.2, ease: [0.16, 1, 0.3, 1] }} /></span>
        </motion.div>
      </motion.div>
      {CHIPS.map(([t, x, y, d]) => (
        <motion.span key={t} className="ba__chip [position:absolute] [z-index:4] [padding:0.7rem_1.3rem] [border-radius:3rem] [background:#fff] [border:1px_solid_#e6dfff] [box-shadow:0_0.8rem_2rem_rgba(57,_28,_160,_0.08)] [font-size:1.3rem] [font-weight:500] [color:var(--purple)] [white-space:nowrap] [@media(max-width:_640px)]:[font-size:1.1rem] [@media(max-width:_640px)]:[padding:0.5rem_1rem] [@media(max-width:_640px)]:[&:nth-of-type(n+5)]:[display:none]" style={{ left: x, top: y }} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.6 + d * 0.2 }}>
          <motion.span {...float(d, 5)} style={{ display: 'inline-block' }}>{t}</motion.span>
        </motion.span>
      ))}
    </div>
  );
}
