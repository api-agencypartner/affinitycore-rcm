import { motion } from 'motion/react';
import { HandCoins, FileCheck2, Target, CalendarClock } from 'lucide-react';
import { CountUp, Eyebrow, SplitWords } from '../components/ui';
import { ease, vp } from '../motion';

/* Icons match the metric they sit on (same lucide line style); each has its own small hover motion. */
const CARDS = [
  { icon: <HandCoins />, value: 96, prefix: '', suffix: '%', label: 'Net collection rate', note: 'Of what you’re owed, collected',
    hover: { y: [0, -6, 0, -3, 0], transition: { duration: 0.7 } } },
  { icon: <FileCheck2 />, value: 98, prefix: '', suffix: '%', label: 'Clean claim rate', note: 'Claims accepted on first submission',
    hover: { rotate: [0, -10, 8, 0], transition: { duration: 0.6 } } },
  { icon: <Target />, value: 97, prefix: '', suffix: '%', label: 'First-pass resolution', note: 'Paid without rework or appeal',
    hover: { scale: [1, 1.18, 0.95, 1], transition: { duration: 0.6 } } },
  { icon: <CalendarClock />, value: 30, prefix: '<', suffix: '', label: 'Average days in A/R', note: 'From visit to payment in the bank',
    hover: { rotate: [0, 14, -8, 0], transition: { duration: 0.6 } } },
];

export function About() {
  return (
    <section className="about container" id="about">
      <Eyebrow>/ Why practices switch</Eyebrow>
      <SplitWords className="h-40" lines={['Results you can see', 'on your monthly report.']} stagger={0.035} />
      <motion.div className="about__grid" initial="hidden" whileInView="show" viewport={vp}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}>
        {CARDS.map((c) => (
          <motion.article key={c.label} className="about-card"
            variants={{ hidden: { opacity: 0, y: 60 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: ease.out } } }}
            whileHover={{ y: -8, backgroundColor: 'rgba(220,210,255,0.42)' }} transition={{ duration: 0.35, ease: ease.out }}>
            <motion.span className="about-card__icon"
              variants={{ hidden: { scale: 0, rotate: -120 }, show: { scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 220, damping: 15, delay: 0.25 } } }}
              whileHover={c.hover}>
              {c.icon}
            </motion.span>
            <CountUp className="about-card__num" value={c.value} prefix={c.prefix} suffix={c.suffix} duration={1.8} />
            <div className="about-card__foot"><p className="about-card__label">{c.label}</p><p className="about-card__note">{c.note}</p></div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
