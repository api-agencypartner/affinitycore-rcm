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
    <section className="testi">
      <div className="testi__intro">
        <Eyebrow>/ in our clients’ words</Eyebrow>
        <SplitWords className="h-64" lines={['Practices that got', 'their time back.']} stagger={0.05} />
        <Reveal as="p" className="body-18" delay={0.25}>Providers and practice managers on what changed after they handed us their billing.</Reveal>
        <Reveal className="testi__controls" delay={0.35}>
          <motion.button className="testi__btn" onClick={() => go(-1)} disabled={i === 0} whileHover={{ x: -4 }} whileTap={{ scale: 0.95 }} aria-label="Previous review">
            <span style={{ transform: 'scaleX(-1)', display: 'inline-flex' }}><Arrow /></span>
          </motion.button>
          <span className="testi__count">
            <span className="testi__digit">
              <AnimatePresence mode="popLayout" initial={false} custom={dir}>
                <motion.span key={i} custom={dir} initial={{ y: dir * 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: dir * -20, opacity: 0 }}
                  transition={{ duration: 0.35, ease: ease.out }}>{pad(i + 1)}</motion.span>
              </AnimatePresence>
            </span>/{pad(QUOTES.length)}
          </span>
          <motion.button className="testi__btn" onClick={() => go(1)} disabled={i === QUOTES.length - 1} whileHover={{ x: 4 }} whileTap={{ scale: 0.95 }} aria-label="Next review">
            <Arrow />
          </motion.button>
        </Reveal>
      </div>

      <div className="testi__viewport">
        <motion.div className="testi__track" animate={{ x: `${-i * 80.4}rem` }} transition={{ duration: 1.1, ease: ease.out }}
          drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.15}
          onDragEnd={(_, info) => { if (info.offset.x < -80) go(1); else if (info.offset.x > 80) go(-1); }}>
          {QUOTES.map((q, k) => (
            <motion.div key={k} className="testi-card__in" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp}
              transition={{ duration: 0.9, ease: ease.out, delay: Math.min(k, 2) * 0.12 }}>
            <motion.figure className="testi-card" initial={false}
              animate={{ opacity: k < i ? 0.25 : 1, scale: k === i ? 1 : 0.97 }} transition={{ duration: 0.5, ease: ease.out }}>
              <div className="testi-card__top">
                <svg className="testi-card__mark" viewBox="0 0 34 24" aria-hidden><path d="M6 0h8L8 24H0zM26 0h8l-6 24h-8z" fill="#6a41f9" /></svg>
                <span className="testi-card__stars" role="img" aria-label="5 out of 5 stars">
                  {[0, 1, 2, 3, 4].map((s) => (
                    <motion.span key={s} initial={{ opacity: 0, scale: 0.4, rotate: -30 }} whileInView={{ opacity: 1, scale: 1, rotate: 0 }} viewport={{ once: true }}
                      transition={{ type: 'spring', stiffness: 380, damping: 16, delay: 0.3 + s * 0.07 }}><Star /></motion.span>
                  ))}
                </span>
              </div>
              <p className="testi-card__title">{q.title}</p>
              <blockquote>
                <AnimatePresence mode="wait">
                  <motion.span key={k === i ? `on-${i}` : 'off'} initial={{ opacity: 0.2 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>{q.quote}</motion.span>
                </AnimatePresence>
              </blockquote>
              <figcaption><span className="testi-card__av" aria-hidden>{initials(q.name)}</span><span><b>{q.name}</b>{q.role}</span></figcaption>
            </motion.figure>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
