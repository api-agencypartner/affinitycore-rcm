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
    <section className="about container [padding-inline:var(--gutter)] [padding-top:14.8rem] [display:flex] [flex-direction:column] [@media(max-width:_1279px)]:[padding-inline:2rem] [@media(max-width:_1279px)]:[padding-top:10rem]" id="about">
      <Eyebrow>/ Why practices switch</Eyebrow>
      <SplitWords className="h-40 [font-weight:500] [font-size:5.6rem] [line-height:1.08] [letter-spacing:-0.12rem] [color:var(--ink-2)] [text-wrap:balance] [.about_&]:[margin-top:1.2rem] [@media(max-width:_1279px)]:[font-size:3.8rem] [@media(max-width:_640px)]:[font-size:3.4rem]" lines={['Results you can see', 'on your monthly report.']} stagger={0.035} />
      <motion.div className="about__grid [display:grid] [grid-template-columns:repeat(4,_1fr)] [gap:2.4rem] [margin-top:4.8rem] [@media(max-width:_1279px)]:[grid-template-columns:1fr_1fr] [@media(min-width:_768px)_and_(max-width:_1279px)]:[grid-template-columns:repeat(4,_minmax(0,_1fr))] [@media(min-width:_768px)_and_(max-width:_1279px)]:[gap:1.6rem] [@media(max-width:_640px)]:[gap:1.2rem]" initial="hidden" whileInView="show" viewport={vp}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}>
        {CARDS.map((c) => (
          <motion.article key={c.label} className="about-card [min-height:34rem] [padding:4.8rem] [border-radius:3.2rem] [background:var(--lav)] [display:flex] [flex-direction:column] [justify-content:space-between] [&>div:first-child]:[display:flex] [&>div:first-child]:[flex-direction:column] [@media(max-width:_1279px)]:[height:auto] [@media(max-width:_1279px)]:[padding:3rem] [@media(max-width:_1279px)]:[gap:3rem] [@media(min-width:_768px)_and_(max-width:_1279px)]:[padding:2.8rem_2.4rem] [@media(max-width:_640px)]:[padding:2.4rem_2rem] [@media(max-width:_640px)]:[gap:1.6rem] [@media(max-width:_640px)]:[min-height:0] [@media(max-width:_640px)]:[border-radius:2.4rem]"
            variants={{ hidden: { opacity: 0, y: 60 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: ease.out } } }}
            whileHover={{ y: -8, backgroundColor: 'rgba(220,210,255,0.42)' }} transition={{ duration: 0.35, ease: ease.out }}>
            <motion.span className="about-card__icon [width:5.6rem] [height:5.6rem] [color:var(--purple)] [display:grid] [place-items:center] [margin-bottom:3.2rem] [&_svg]:[width:5rem] [&_svg]:[height:5rem] [&_svg]:[stroke-width:1.8] [@media(max-width:_640px)]:[margin-bottom:1.6rem] [@media(max-width:_640px)]:[&_svg]:[width:3.6rem] [@media(max-width:_640px)]:[&_svg]:[height:3.6rem]"
              variants={{ hidden: { scale: 0, rotate: -120 }, show: { scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 220, damping: 15, delay: 0.25 } } }}
              whileHover={c.hover}>
              {c.icon}
            </motion.span>
            <CountUp className="about-card__num [display:block] [font-weight:600] [font-size:4.8rem] [line-height:1.1] [letter-spacing:-0.096rem] [margin-right:auto] [@media(max-width:_640px)]:[font-size:3.6rem]" value={c.value} prefix={c.prefix} suffix={c.suffix} duration={1.8} />
            <div className="about-card__foot [margin-top:auto]"><p className="about-card__label [font-weight:600] [font-size:2.8rem] [line-height:1.3] [@media(max-width:_1279px)]:[font-size:2.4rem] [@media(min-width:_768px)_and_(max-width:_1279px)]:[font-size:2rem] [@media(max-width:_640px)]:[font-size:1.8rem]">{c.label}</p><p className="about-card__note [margin-top:0.6rem] [font-size:1.7rem] [color:#5b5f72] [@media(max-width:_640px)]:[font-size:1.5rem] [@media(max-width:_1279px)]:[font-size:16px]! [@media(max-width:_1279px)]:[line-height:1.6]">{c.note}</p></div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
