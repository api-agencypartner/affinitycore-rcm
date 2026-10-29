import { useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import { Plus, Phone, Mail, MapPin } from 'lucide-react';
import { Arrow, Button, Eyebrow, Logo, Reveal, SplitWords } from '../components/ui';
import { ease, vp } from '../motion';
import hipaaBadge from '../assets/hipaa-badge.png';
import { SHOW_STATES } from '../data/states';

/* ---------------- FAQ ---------------- */
export const FAQS = [
  ['Can we start with just one part of our revenue cycle?', 'Yes. Many practices start with the area that hurts most, often denials or aged A/R, and expand once they see results in their own numbers.'],
  ['Will we need to change our EHR or practice management system?', 'No. We work inside the systems you already use. Before anything changes, we map access and workflow with your team so nothing gets dropped.'],
  ['How will we know it’s working?', 'You get a baseline at kickoff and a monthly report on collections, clean claim rate, denials and days in A/R, so progress shows up in your own data.'],
  ['What does onboarding look like?', 'A short discovery call, system access and workflow mapping, then a phased handover. Your staff keep working while we ramp up.'],
  ['How do you keep patient data secure?', 'We handle protected health information under HIPAA-compliant processes, with role-based access and a business associate agreement in place before we start.'],
  ['What should we prepare for the free assessment?', 'Recent A/R aging and denial reports are enough to start. If you don’t have them handy, we’ll tell you exactly what to pull.'],
];

export function FAQ({ items = FAQS, eyebrow = '/ FAQs', lines = ['Questions practices', 'ask before switching.'], note = 'Still unsure? Ask us anything on a free 15-minute call.', cta }:
  { items?: string[][]; eyebrow?: string; lines?: string[]; note?: string; cta?: { label: string; href: string } } = {}) {
  const [open, setOpen] = useState(0);
  return (
    <motion.section id="faq" className="faq container" initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, ease: ease.out }}>
      <div className="faq__panel">
        <div className="faq__intro">
          <Eyebrow>{eyebrow}</Eyebrow>
          <SplitWords className="h-56" lines={lines} stagger={0.06} />
          <Reveal as="p" className="body-18" delay={0.3}>{note}</Reveal>
          <Reveal className="faq__cta" delay={0.4}>
            {cta ? <Button onClick={() => { window.location.href = cta.href; }}>{cta.label}</Button> : <>
              <Button onClick={() => { window.location.href = 'tel:+12148512698'; }}>Ask us a question</Button>
              <a className="faq__tel" href="tel:+12148512698"><Phone size={16} /> Or call 214-851-2698</a>
            </>}
          </Reveal>
        </div>
        <motion.ul className="faq__list" initial="hidden" whileInView="show" viewport={vp}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } } }}>
          {items.map(([q, a], i) => {
            const isOpen = open === i;
            return (
              <motion.li key={q} className="faq__item" variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: ease.out } } }}>
                <button className="faq__q" onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen}>
                  <span>{q}</span>
                  <motion.span className="faq__icon" animate={{ rotate: isOpen ? 45 : 0, color: isOpen ? '#6a41f9' : '#192533' }} transition={{ duration: 0.35, ease: ease.out }}><Plus /></motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div className="faq__a" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: ease.out }}>
                      <motion.p initial={{ y: -8 }} animate={{ y: 0 }} exit={{ y: -8 }} transition={{ duration: 0.45, ease: ease.out }}>{a}</motion.p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </motion.section>
  );
}

/* ---------------- CTA band ---------------- */
/* Pill-and-dot rows (Figma 524:1982 / 524:1983) */
const ROWS: { x: number; parts: ('p' | 'c')[] }[] = [
  { x: -22, parts: ['p', 'c'] }, { x: -40.8, parts: ['p', 'c', 'p'] }, { x: -12, parts: ['p', 'c'] }, { x: -42.8, parts: ['p', 'c', 'p'] }, { x: -1.8, parts: ['c', 'p', 'c'] },
];
function Pattern({ side, p }: { side: 1 | -1; p: ReturnType<typeof useScroll>['scrollYProgress'] }) {
  return (
    <div className={`cta__pattern cta__pattern--${side === -1 ? 'l' : 'r'}`}>
      {ROWS.map((r, i) => <Row key={i} r={r} i={i} side={side} p={p} />)}
    </div>
  );
}
function Row({ r, i, side, p }: { r: (typeof ROWS)[number]; i: number; side: 1 | -1; p: ReturnType<typeof useScroll>['scrollYProgress'] }) {
  // Two layers so the scroll drift and the entrance never fight over the same `x` (that caused the jerk):
  // outer = gentle scroll parallax (sprung), inner = one-time slide-in.
  const raw = useTransform(p, [0, 1], [(i % 2 ? 60 : -60) * side, (i % 2 ? -60 : 60) * side]);
  const drift = useSpring(raw, { stiffness: 70, damping: 22, mass: 0.6 });
  return (
    <motion.div className="cta__row" style={{ left: `${r.x}rem`, x: drift }}>
      <motion.div className="cta__row-in" initial={{ opacity: 0, x: side * 220 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }}
        transition={{ type: 'spring', stiffness: 60, damping: 18, mass: 1, delay: i * 0.07, opacity: { duration: 0.8, ease: ease.out, delay: i * 0.07 } }}>
        {r.parts.map((t, k) => <span key={k} className={t === 'p' ? 'cta__p' : 'cta__c'} />)}
      </motion.div>
    </motion.div>
  );
}

export function CTA({ eyebrow = '/ Ready when you are', lines = ['Your focus: better care.', 'Ours: a healthier revenue cycle.'] }: { eyebrow?: string; lines?: string[] } = {}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  return (
    <section className="cta" ref={ref}>
      <motion.div className="cta__bg" initial={{ scaleY: 0.6, opacity: 0 }} whileInView={{ scaleY: 1, opacity: 1 }} viewport={vp} transition={{ duration: 1, ease: ease.out }} />
      <Pattern side={-1} p={scrollYProgress} />
      <Pattern side={1} p={scrollYProgress} />
      <div className="cta__inner">
        <Eyebrow>{eyebrow}</Eyebrow>
        <SplitWords className="h-64" lines={lines} stagger={0.05} />
        <Reveal delay={0.4}><Button>Get a free revenue assessment</Button></Reveal>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */
// Stepped "chart" bars at the bottom of the footer (Figma 475:3554): [left, width, height] in px
// [left, top, width] — tops from Figma; bars run past the bottom edge and are clipped
const BARS: [number, number, number][] = [[55, 296, 259], [313, 240, 259], [572, 149, 258], [830, 1, 258], [1088, 149, 258], [1346, 240, 259], [1605, 296, 259]];
const COLS = [
  ['Company', ['About Us', 'Careers', 'Case Studies', 'Contact']],
  ['Services', ['All services', 'Revenue Cycle Management', 'Medical Billing', 'Medical Coding', 'Denial Management', 'Peer-to-Peer Review', 'A/R Recovery', 'Credentialing']],
  ['Specialties', ['All specialties', 'Internal Medicine', 'Cardiology', 'Mental Health', 'Urgent Care', 'Orthopedics', 'Radiology']],
  ...(SHOW_STATES ? [['States', ['Texas', 'Florida', 'California', 'All 50 states']] as const] : []),
  ['Resources', ['Blog', 'Case Studies', 'Free assessment', 'FAQs']],
] as const;

const FOOT_LINKS: Record<string, string> = {
  'Revenue Cycle Management': '#/services/revenue-cycle-management', 'Medical Billing': '#/services/medical-billing',
  'Medical Coding': '#/services/medical-coding', 'Denial Management': '#/services/denial-management',
  'A/R Recovery': '#/services/ar-recovery', 'Peer-to-Peer Review': '#/services/peer-to-peer-review', 'Credentialing': '#/services/credentialing',
  'All services': '#/services', 'All specialties': '#/specialties',
  'Internal Medicine': '#/specialties/internal-medicine', 'Cardiology': '#/specialties/cardiology', 'Mental Health': '#/specialties/mental-health',
  'Urgent Care': '#/specialties/urgent-care', 'Orthopedics': '#/specialties/orthopedics', 'Radiology': '#/specialties/radiology',
  'FAQs': '#faq', 'Case Studies': '#/case-studies', 'Blog': '#/blog', 'Contact': '#/contact', 'Free assessment': '#/contact',
  'About Us': '#/about', 'Careers': '#/careers',
  'Texas': '#/states/texas', 'Florida': '#/states/florida', 'California': '#/states/california', 'All 50 states': '#states',
};
const footHref = (l: string) => FOOT_LINKS[l] ?? '#';

/* Profiles linked from rcm.affinitycore.co */
const SOCIAL = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/affinitycore/', d: 'M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.8v1.6h.06c.53-1 1.82-2.05 3.75-2.05 4 0 4.74 2.63 4.74 6.06v5.39h-4v-4.78c0-1.14-.02-2.6-1.59-2.6-1.59 0-1.83 1.24-1.83 2.52v4.86h-4v-11Z' },
  { label: 'Facebook', href: 'https://www.facebook.com/affinitycore', d: 'M13.5 21v-7.8h2.6l.4-3.05h-3V8.2c0-.88.25-1.48 1.5-1.48h1.6V4a21 21 0 0 0-2.33-.12c-2.3 0-3.88 1.4-3.88 3.98v2.29H7.8v3.05h2.6V21h3.1Z' },
  { label: 'Instagram', href: 'https://www.instagram.com/affinitycore', d: 'M12 7.3a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4Zm0 7.75a3.05 3.05 0 1 1 0-6.1 3.05 3.05 0 0 1 0 6.1ZM17 6a1.1 1.1 0 1 0 0 2.2A1.1 1.1 0 0 0 17 6ZM12 3.6c2.73 0 3.06.01 4.13.06 2.77.13 4.07 1.44 4.2 4.2.05 1.08.06 1.4.06 4.14s-.01 3.06-.06 4.13c-.13 2.76-1.42 4.07-4.2 4.2-1.07.05-1.4.06-4.13.06s-3.06-.01-4.13-.06c-2.78-.13-4.07-1.44-4.2-4.2C3.62 15.06 3.6 14.74 3.6 12s.02-3.06.07-4.14c.12-2.76 1.42-4.07 4.2-4.2C8.94 3.61 9.27 3.6 12 3.6Z' },
  { label: 'X', href: 'https://x.com/affinitycore_it', d: 'M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.19L2 3h6.33l4.37 5.77L17.75 3Zm-1.08 16.18h1.7L7.4 4.73H5.58l11.09 14.45Z' },
];

export function Footer() {
  return (
    <footer className="foot">
      <div className="foot__top">
        <Reveal className="foot__brand">
          <Logo light className="logo--xl" />
          <a className="foot__addr" href="https://www.google.com/maps/search/?api=1&query=5830%20Granite%20Pkwy%2C%20STE%20100-219%2C%20Plano%2C%20TX%2075024" target="_blank" rel="noopener noreferrer">
            <MapPin size={18} /><span>5830 Granite Pkwy, STE 100-219<br />Plano, TX 75024</span>
          </a>
          <div className="foot__reach">
            <motion.a href="tel:+12148512698" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}><Phone size={18} /> 214-851-2698</motion.a>
            <motion.a href="mailto:info@affinitycore.co" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}><Mail size={18} /> info@affinitycore.co</motion.a>
          </div>
        </Reveal>
        <motion.div className="foot__cols" initial="hidden" whileInView="show" viewport={vp}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}>
          {COLS.map(([h, links]) => (
            <motion.div key={h} variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}>
              <motion.p className="foot__h" variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>{h}</motion.p>
              {links.map((l) => (
                <motion.a key={l} href={footHref(l)} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: ease.out } } }}
                  whileHover={{ x: 6, color: '#b9a5ff' }}>{l}</motion.a>
              ))}
            </motion.div>
          ))}
        </motion.div>
      </div>
      <div className="foot__mid">
        <Reveal className="foot__news">
          <p>Subscribe to our Newsletter</p>
          <form className="foot__input" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email address" aria-label="Email address" />
            <motion.button type="submit" aria-label="Subscribe" whileHover={{ scale: 1.08, rotate: -45 }} whileTap={{ scale: 0.92 }}><Arrow /></motion.button>
          </form>
        </Reveal>
        <Reveal className="foot__contact" delay={0.1}>
          <p className="foot__h">Follow us</p>
          <ul className="foot__social foot__social--mid">
            {SOCIAL.map((s) => (
              <li key={s.label}>
                <motion.a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`Affinity Core on ${s.label}`} whileHover={{ y: -3 }} whileTap={{ scale: 0.92 }}>
                  <svg viewBox="0 0 24 24" aria-hidden><path d={s.d} /></svg>
                </motion.a>
              </li>
            ))}
          </ul>

        </Reveal>
        <Reveal className="foot__awards" delay={0.2}>
          <span className="foot__badge"><img src={hipaaBadge} alt="HIPAA compliant" /></span><p className="foot__badge-t">HIPAA compliant<br /><small>BAA signed with every client</small></p>
        </Reveal>
      </div>
      <p className="foot__copy">© 2026 AffinityCore. All rights reserved.</p>
      <motion.div className="foot__bars" aria-hidden initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
        <div className="foot__bars-in">
        {BARS.map(([l, t, w], i) => (
          <motion.span key={i} style={{ left: `${l / 10}rem`, top: `${t / 10}rem`, width: `${w / 10}rem` }}
            variants={{ hidden: { scaleY: 0 }, show: { scaleY: 1, transition: { duration: 1.2, ease: ease.out, delay: 0.15 + Math.abs(3 - i) * 0.12 } } }} />
        ))}
      </div>
      </motion.div>
    </footer>
  );
}
