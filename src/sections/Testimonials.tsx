import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Arrow, Eyebrow, Reveal, SplitWords } from '../components/ui';
import { ease, vp } from '../motion';

// Client testimonials as published on rcm.affinitycore.co (verbatim excerpts).
const QUOTES = [
  { title: 'Fewer denials', quote: 'With AffinityCore, we reduced claim denials and improved overall financial performance. Their precision and support have been invaluable to our practice.', name: 'Dr. James', role: 'Medical Director' },
  { title: 'A smoother billing process', quote: 'AffinityCore’s Revenue Cycle Management expertise has streamlined our billing process and significantly improved collections. Their team feels like an extension of ours.', name: 'Emily', role: 'Practice Administrator' },
  { title: 'Enhancing healthcare operations with precision', quote: 'AffinityCore has transformed the way we manage our healthcare services.', name: 'Robert T.', role: 'Chief Medical Officer' },
  { title: 'A partner since 2020', quote: 'AffinityCore has been our trusted partner since 2020, providing scalable, cost-effective solutions with 24/7 global coverage. Their adaptability and ownership have freed us to focus on high-impact projects.', name: 'Joshua Arnaldo', role: 'Director, Global Data Operations' },
];
const initials = (n: string) => n.replace(/^Dr\.\s*/, '').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
const Star = () => <svg viewBox="0 0 20 20" aria-hidden><path d="M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.6 7.7l5.8-.8z" /></svg>;

const pad = (n: number) => String(n).padStart(2, '0');

export function Testimonials() {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const go = (d: number) => { const n = Math.min(QUOTES.length - 1, Math.max(0, i + d)); if (n !== i) { setDir(d); setI(n); } };

  return (
    <section className="testi [display:grid] [grid-template-columns:52rem_minmax(0,_1fr)] [gap:10rem] [padding:9rem_0_0_var(--gutter)] [overflow:hidden] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1279px)]:[gap:4rem] [@media(max-width:_1279px)]:[padding:8rem_2rem_0]">
      <div className="testi__intro [display:flex] [flex-direction:column] [gap:1.2rem] [position:relative] [z-index:2] [isolation:isolate] [&::before]:[content:''] [&::before]:[position:absolute] [&::before]:[z-index:-1] [&::before]:[top:-9rem] [&::before]:[bottom:-6rem] [&::before]:[left:calc(-1_*_var(--gutter))] [&::before]:[right:-10rem] [&::before]:[background:linear-gradient(90deg,_#fff_calc(100%_-_10rem),_rgba(255,_255,_255,_0))] [&::before]:[pointer-events:none] [@media(max-width:_1279px)]:[&::before]:[display:none]">
        <Eyebrow>/ in our clients’ words</Eyebrow>
        <SplitWords className="h-64 [font-weight:500] [font-size:5.6rem] [line-height:1.08] [letter-spacing:-0.12rem] [color:var(--ink-2)] [text-wrap:balance] [.svc\_\_head_&]:[margin-top:1.2rem] [.plat\_\_center_&]:[color:var(--ink-2)] [@media(max-width:_1279px)]:[font-size:3.8rem] [@media(max-width:_1279px)]:[overflow-wrap:anywhere] [@media(max-width:_640px)]:[font-size:3.4rem]" lines={['Practices that got', 'their time back.']} stagger={0.05} />
        <Reveal as="p" className="body-18 [font-size:1.8rem] [line-height:1.6] [color:var(--navy)] [.testi\_\_intro_&]:[margin-top:0.8rem] [.faq\_\_intro_&]:[margin-top:0.8rem] [@media(max-width:_1279px)]:[font-size:16px]! [@media(max-width:_1279px)]:[line-height:1.6] [.tk\_\_head_&]:[margin-top:0.8rem] [.tk\_\_head_&]:[max-width:52rem] [.pw\_\_head_&]:[max-width:60rem] [.pw\_\_head_&]:[color:#4a4f63] [.ac\_\_copy_&]:[margin-top:0.8rem] [.mdef\_\_head_&]:[margin-top:0.8rem] [.mdef\_\_head_&]:[max-width:48rem] [.nl\_\_copy_&]:[margin-top:0.8rem]" delay={0.25}>Providers and practice managers on what changed after they handed us their billing.</Reveal>
        <Reveal className="testi__controls [display:flex] [align-items:center] [gap:3.9rem] [margin-top:4rem]" delay={0.35}>
          <motion.button className="testi__btn [display:inline-grid] [place-items:center] [width:6.1rem] [height:6.1rem] [padding:0] [border-radius:50%] [border:1px_solid_#d9d0ff] [font-size:1.8rem] [color:var(--navy)] [transition:opacity_0.3s,_border-color_0.3s] [&:disabled]:[opacity:0.35] [&:disabled]:[border-color:#ddd] [&:disabled]:[cursor:default] [&_svg]:[width:2rem] [&_svg]:[height:2rem]" onClick={() => go(-1)} disabled={i === 0} whileHover={{ x: -4 }} whileTap={{ scale: 0.95 }} aria-label="Previous review">
            <span style={{ transform: 'scaleX(-1)', display: 'inline-flex' }}><Arrow /></span>
          </motion.button>
          <span className="testi__count [font-size:1.8rem] [color:var(--navy)] [display:inline-flex]">
            <span className="testi__digit [display:inline-block] [overflow:hidden] [height:2.6rem] [&>span]:[display:inline-block]">
              <AnimatePresence mode="popLayout" initial={false} custom={dir}>
                <motion.span key={i} custom={dir} initial={{ y: dir * 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: dir * -20, opacity: 0 }}
                  transition={{ duration: 0.35, ease: ease.out }}>{pad(i + 1)}</motion.span>
              </AnimatePresence>
            </span>/{pad(QUOTES.length)}
          </span>
          <motion.button className="testi__btn [display:inline-grid] [place-items:center] [width:6.1rem] [height:6.1rem] [padding:0] [border-radius:50%] [border:1px_solid_#d9d0ff] [font-size:1.8rem] [color:var(--navy)] [transition:opacity_0.3s,_border-color_0.3s] [&:disabled]:[opacity:0.35] [&:disabled]:[border-color:#ddd] [&:disabled]:[cursor:default] [&_svg]:[width:2rem] [&_svg]:[height:2rem]" onClick={() => go(1)} disabled={i === QUOTES.length - 1} whileHover={{ x: 4 }} whileTap={{ scale: 0.95 }} aria-label="Next review">
            <Arrow />
          </motion.button>
        </Reveal>
      </div>

      <div className="testi__viewport [position:relative] [z-index:1] [padding:2rem_0_6rem] [min-width:0]">
        <motion.div className="testi__track [display:flex] [gap:4rem] [cursor:grab] [&:active]:[cursor:grabbing]" animate={{ x: `${-i * 80.4}rem` }} transition={{ duration: 1.1, ease: ease.out }}
          drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.15}
          onDragEnd={(_, info) => { if (info.offset.x < -80) go(1); else if (info.offset.x > 80) go(-1); }}>
          {QUOTES.map((q, k) => (
            <motion.div key={k} className="testi-card__in [flex-shrink:0]" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp}
              transition={{ duration: 0.9, ease: ease.out, delay: Math.min(k, 2) * 0.12 }}>
            <motion.figure className="testi-card [width:76.4rem] [height:47.3rem] [padding:4rem] [border-radius:2.4rem] [background:linear-gradient(160deg,_#f8f6ff,_#fff_70%)] [box-shadow:0_2rem_6rem_rgba(106,_65,_249,_0.08)] [display:flex] [flex-direction:column] [user-select:none] [&_blockquote]:[margin-top:1.6rem] [&_blockquote]:[font-weight:500] [&_blockquote]:[font-size:3rem] [&_blockquote]:[line-height:4.4rem] [&_blockquote]:[color:var(--ink-2)] [&_figcaption]:[margin-top:auto] [&_figcaption]:[display:flex] [&_figcaption]:[align-items:center] [&_figcaption]:[gap:2rem] [&_figcaption]:[font-size:1.8rem] [&_figcaption]:[color:var(--navy)] [&_figcaption_img]:[width:6.4rem] [&_figcaption_img]:[height:6.4rem] [&_figcaption_img]:[border-radius:50%] [&_figcaption_b]:[display:block] [&_figcaption_b]:[font-weight:500] [&_figcaption_b]:[font-size:2rem] [&_figcaption_b]:[margin-bottom:0.4rem] [@media(max-width:_1279px)]:[width:calc(100vw_-_4rem)] [@media(max-width:_1279px)]:[height:auto] [@media(max-width:_1279px)]:[min-height:36rem] [@media(max-width:_1279px)]:[&_blockquote]:[font-size:2.4rem] [@media(max-width:_1279px)]:[&_blockquote]:[line-height:3.4rem] [@media(max-width:_640px)]:[min-height:0] [@media(max-width:_640px)]:[height:auto] [@media(max-width:_640px)]:[padding:2.8rem_2.4rem] [@media(max-width:_640px)]:[&_blockquote]:[font-size:2rem] [@media(max-width:_640px)]:[&_blockquote]:[line-height:1.5] [@media(max-width:_640px)]:[&_figcaption]:[margin-top:2.4rem]" initial={false}
              animate={{ opacity: k < i ? 0.25 : 1, scale: k === i ? 1 : 0.97 }} transition={{ duration: 0.5, ease: ease.out }}>
              <div className="testi-card__top [display:flex] [justify-content:space-between] [align-items:center]">
                <svg className="testi-card__mark [width:3.4rem] [height:2.4rem]" viewBox="0 0 34 24" aria-hidden><path d="M6 0h8L8 24H0zM26 0h8l-6 24h-8z" fill="#6a41f9" /></svg>
                <span className="testi-card__stars [display:inline-flex] [gap:0.4rem] [&_span]:[display:inline-grid] [&_svg]:[width:2.4rem] [&_svg]:[height:2.4rem] [&_svg]:[fill:#f5b82e] [filter:drop-shadow(0_0.2rem_0.4rem_rgba(229,_160,_20,_0.35))]" role="img" aria-label="5 out of 5 stars">
                  {[0, 1, 2, 3, 4].map((s) => (
                    <motion.span key={s} initial={{ opacity: 0, scale: 0.4, rotate: -30 }} whileInView={{ opacity: 1, scale: 1, rotate: 0 }} viewport={{ once: true }}
                      transition={{ type: 'spring', stiffness: 380, damping: 16, delay: 0.3 + s * 0.07 }}><Star /></motion.span>
                  ))}
                </span>
              </div>
              <p className="testi-card__title [margin-top:3.2rem] [font-family:var(--f-mono)] [font-size:1.4rem] [text-transform:uppercase] [letter-spacing:0.06em] [color:var(--purple)] [@media(max-width:_1279px)]:[font-size:16px]! [@media(max-width:_1279px)]:[line-height:1.6]">{q.title}</p>
              <blockquote>
                <AnimatePresence mode="wait">
                  <motion.span key={k === i ? `on-${i}` : 'off'} initial={{ opacity: 0.2 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>{q.quote}</motion.span>
                </AnimatePresence>
              </blockquote>
              <figcaption><span className="testi-card__av [width:6.4rem] [height:6.4rem] [border-radius:50%] [display:grid] [place-items:center] [background:#ece6ff] [color:var(--purple)] [font-weight:600] [font-size:2rem] [flex-shrink:0]" aria-hidden>{initials(q.name)}</span><span><b>{q.name}</b>{q.role}</span></figcaption>
            </motion.figure>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
