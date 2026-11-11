import { u } from '../router';
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
    <motion.section id="faq" className="faq container [padding-inline:var(--gutter)] [padding-top:16rem] [@media(max-width:_1279px)]:[padding-inline:2rem] [@media(max-width:_1279px)]:[padding-top:8rem] [@media(max-width:_1279px)]:[&_p]:[font-size:16px]! [@media(max-width:_1279px)]:[&_p]:[line-height:1.6]" initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, ease: ease.out }}>
      <div className="faq__panel [display:grid] [grid-template-columns:repeat(4,_minmax(0,_1fr))] [column-gap:2.4rem] [row-gap:4rem] [align-items:start] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)]">
        <div className="faq__intro [grid-column:1_/_span_2] [padding-right:8rem] [position:sticky] [top:14rem] [display:flex] [flex-direction:column] [gap:1.2rem] [@media(max-width:_1279px)]:[grid-column:auto] [@media(max-width:_1279px)]:[padding-right:0] [@media(max-width:_1279px)]:[position:static]">
          <Eyebrow>{eyebrow}</Eyebrow>
          <SplitWords className="h-56 [font-weight:500] [font-size:5.6rem] [line-height:1.08] [letter-spacing:-0.12rem] [color:var(--ink-2)] [text-wrap:balance] [@media(max-width:_1279px)]:[font-size:3.8rem] [@media(max-width:_640px)]:[font-size:3.4rem]" lines={lines} stagger={0.06} />
          <Reveal as="p" className="body-18 [font-size:1.8rem] [line-height:1.6] [color:var(--navy)] [.testi\_\_intro_&]:[margin-top:0.8rem] [.faq\_\_intro_&]:[margin-top:0.8rem] [@media(max-width:_1279px)]:[font-size:16px]! [@media(max-width:_1279px)]:[line-height:1.6] [.tk\_\_head_&]:[margin-top:0.8rem] [.tk\_\_head_&]:[max-width:52rem] [.pw\_\_head_&]:[max-width:60rem] [.pw\_\_head_&]:[color:#4a4f63] [.ac\_\_copy_&]:[margin-top:0.8rem] [.mdef\_\_head_&]:[margin-top:0.8rem] [.mdef\_\_head_&]:[max-width:48rem] [.nl\_\_copy_&]:[margin-top:0.8rem]" delay={0.3}>{note}</Reveal>
          <Reveal className="faq__cta [display:flex] [flex-direction:column] [align-items:flex-start] [gap:1.6rem] [margin-top:2.4rem]" delay={0.4}>
            {cta ? <Button onClick={() => { window.location.href = cta.href; }}>{cta.label}</Button> : <>
              <Button onClick={() => { window.location.href = 'tel:+12148512698'; }}>Ask us a question</Button>
              <a className="faq__tel [display:inline-flex] [align-items:center] [gap:0.8rem] [font-size:1.6rem] [color:#5b5f72] [transition:color_0.3s] [&:hover]:[color:var(--purple)]" href="tel:+12148512698"><Phone size={16} /> Or call 214-851-2698</a>
            </>}
          </Reveal>
        </div>
        <motion.ul className="faq__list [grid-column:3_/_span_2] [border-top:1px_solid_#e4e0f2] [@media(max-width:_1279px)]:[grid-column:auto] [@media(max-width:_1279px)]:[padding-right:0] [@media(max-width:_1279px)]:[position:static]" initial="hidden" whileInView="show" viewport={vp}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } } }}>
          {items.map(([q, a], i) => {
            const isOpen = open === i;
            return (
              <motion.li key={q} className="faq__item [border-bottom:1px_solid_#e4e0f2] [padding-block:2.4rem] [&:last-child]:[border-bottom:0] [&:last-child]:[padding-bottom:0]" variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: ease.out } } }}>
                <button className="faq__q [width:100%] [display:flex] [justify-content:space-between] [align-items:center] [gap:4rem] [text-align:left] [font-weight:500] [font-size:2.4rem] [line-height:3.4rem] [color:var(--ink-2)] [@media(max-width:_1279px)]:[font-size:2rem]" onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen}>
                  <span>{q}</span>
                  <motion.span className="faq__icon [display:grid] [&_svg]:[width:2.4rem] [&_svg]:[height:2.4rem]" animate={{ rotate: isOpen ? 45 : 0, color: isOpen ? '#6a41f9' : '#192533' }} transition={{ duration: 0.35, ease: ease.out }}><Plus /></motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div className="faq__a [overflow:hidden] [&_p]:[padding-top:2.4rem] [&_p]:[max-width:78.2rem] [&_p]:[font-size:1.8rem] [&_p]:[line-height:2.9rem] [&_p]:[color:var(--navy)] [@media(max-width:_1279px)]:[font-size:16px]! [@media(max-width:_1279px)]:[line-height:1.6]" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
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
    <div className={String.raw`cta__pattern [position:absolute] [top:4.5rem] [width:49.4rem] [height:38rem] [@media(max-width:_1279px)]:[opacity:0.5] cta__pattern--${side === -1 ? 'l' : 'r'}`}>
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
    <motion.div className="cta__row [position:absolute] [display:flex] [&:nth-child(1)]:[top:0] [&:nth-child(2)]:[top:7.8rem] [&:nth-child(3)]:[top:15.6rem] [&:nth-child(4)]:[top:23.4rem] [&:nth-child(5)]:[top:31.3rem] [will-change:transform] [gap:0]" style={{ left: `${r.x}rem`, x: drift }}>
      <motion.div className="cta__row-in [display:flex] [gap:0.7rem] [will-change:transform,_opacity]" initial={{ opacity: 0, x: side * 220 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }}
        transition={{ type: 'spring', stiffness: 60, damping: 18, mass: 1, delay: i * 0.07, opacity: { duration: 0.8, ease: ease.out, delay: i * 0.07 } }}>
        {r.parts.map((t, k) => <span key={k} className={t === 'p' ? String.raw`cta__p [width:36.8rem] [height:6.6rem] [border-radius:4rem] [background:#e6defe]` : String.raw`cta__c [width:6.6rem]! [height:6.6rem] [border-radius:50%]! [background:#e6defe]`} />)}
      </motion.div>
    </motion.div>
  );
}

export function CTA({ eyebrow = '/ Ready when you are', lines = ['Your focus: better care.', 'Ours: a healthier revenue cycle.'] }: { eyebrow?: string; lines?: string[] } = {}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  return (
    <section className="cta [position:relative] [height:47rem] [margin-top:16rem] [display:grid] [place-items:center] [overflow:hidden] [@media(max-width:_1279px)]:[max-width:100vw] [@media(max-width:_1279px)]:[margin-top:8rem] [@media(max-width:_1279px)]:[padding-inline:2rem] [@media(max-width:_1279px)]:[&_p]:[font-size:16px]! [@media(max-width:_1279px)]:[&_p]:[line-height:1.6]" ref={ref}>
      <motion.div className="cta__bg [position:absolute] [inset:0] [background:#f6f3ff]" initial={{ scaleY: 0.6, opacity: 0 }} whileInView={{ scaleY: 1, opacity: 1 }} viewport={vp} transition={{ duration: 1, ease: ease.out }} />
      <Pattern side={-1} p={scrollYProgress} />
      <Pattern side={1} p={scrollYProgress} />
      <div className="cta__inner [position:relative] [width:112rem] [display:flex] [flex-direction:column] [align-items:center] [gap:1.2rem] [text-align:center] [&>div:last-child]:[margin-top:2.8rem] [@media(max-width:_1279px)]:[width:100%]">
        <Eyebrow>{eyebrow}</Eyebrow>
        <SplitWords className="h-64 [font-weight:500] [font-size:5.6rem] [line-height:1.08] [letter-spacing:-0.12rem] [color:var(--ink-2)] [text-wrap:balance] [.svc\_\_head_&]:[margin-top:1.2rem] [.plat\_\_center_&]:[color:var(--ink-2)] [@media(max-width:_1279px)]:[font-size:3.8rem] [@media(max-width:_1279px)]:[overflow-wrap:anywhere] [@media(max-width:_640px)]:[font-size:3.4rem]" lines={lines} stagger={0.05} />
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
  ['Company', ['About Us', 'Careers', 'Case Studies', 'Blog', 'Contact']],
  ['Services', ['All services', 'Revenue Cycle Management', 'Credentialing', 'Charge Entry', 'Medical Coding', 'Medical Billing', 'Payment Posting', 'Denial Management', 'A/R Recovery', 'Peer-to-Peer Review', 'Medical Billing Audits']],
  ['Specialties', ['All specialties', 'Internal Medicine', 'Cardiology', 'Mental Health', 'Urgent Care', 'Orthopedics', 'Radiology']],
  ...(SHOW_STATES ? [['States', ['All 50 states', 'Texas', 'Florida', 'California', 'New York', 'Pennsylvania', 'Illinois']] as const] : []),
] as const;

const FOOT_LINKS: Record<string, string> = {
  'Revenue Cycle Management': u('/services/revenue-cycle-management'), 'Medical Billing': u('/services/medical-billing'),
  'Medical Coding': u('/services/medical-coding'), 'Denial Management': u('/services/denial-management'),
  'A/R Recovery': u('/services/ar-recovery'), 'Peer-to-Peer Review': u('/services/peer-to-peer-review'), 'Credentialing': u('/services/credentialing'),
  'Charge Entry': u('/services/charge-entry'), 'Payment Posting': u('/services/payment-posting'), 'Medical Billing Audits': u('/services/medical-billing-audits'),
  'All services': u('/services'), 'All specialties': u('/specialties'),
  'Internal Medicine': u('/specialties/internal-medicine'), 'Cardiology': u('/specialties/cardiology'), 'Mental Health': u('/specialties/mental-health'),
  'Urgent Care': u('/specialties/urgent-care'), 'Orthopedics': u('/specialties/orthopedics'), 'Radiology': u('/specialties/radiology'),
  'FAQs': '#faq', 'Case Studies': u('/case-studies'), 'Blog': u('/blog'), 'Contact': u('/contact'), 'Free assessment': u('/contact'),
  'About Us': u('/about'), 'Careers': u('/careers'),
  'Texas': u('/states/texas'), 'Florida': u('/states/florida'), 'California': u('/states/california'), 'New York': u('/states/new-york'), 'Pennsylvania': u('/states/pennsylvania'), 'Illinois': u('/states/illinois'), 'All 50 states': u('/states'),
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
    <footer className="foot [position:relative] [margin-top:0] [background:var(--foot)] [color:#fff] [overflow:hidden] [overflow-x:clip]! [@media(max-width:_1279px)]:[display:flex] [@media(max-width:_1279px)]:[flex-direction:column]">
      <div className="foot__top [display:grid] [grid-template-columns:66rem_1fr] [border-bottom:1px_solid_#372f4f] [@media(max-width:_1279px)]:[grid-template-columns:1fr] [@media(max-width:_1279px)]:[display:contents]">
        <Reveal className="foot__brand [padding:6rem_5.6rem_6rem_var(--gutter)] [border-right:1px_solid_#372f4f] [&_p]:[margin-top:2.4rem] [&_p]:[max-width:58.7rem] [&_p]:[font-size:1.8rem] [&_p]:[line-height:2.9rem] [&_p]:[color:#c9c5d6] [@media(max-width:_1279px)]:[border-right:0]! [@media(max-width:_1279px)]:[padding:4rem_2rem]! [@media(max-width:_1279px)]:[order:1] [@media(max-width:_1279px)]:[border-bottom:1px_solid_#372f4f]">
          <Logo light className="logo--xl" />
          <a className="foot__addr [display:flex] [align-items:flex-start] [gap:1.2rem] [margin-top:3.2rem] [font-size:1.7rem] [line-height:1.5] [color:#d8d3ea] [transition:color_0.3s] [&_svg]:[flex:none] [&_svg]:[margin-top:0.3rem] [&_svg]:[color:#b9a5ff] [&:hover]:[color:#fff]" href="https://www.google.com/maps/search/?api=1&query=5830%20Granite%20Pkwy%2C%20STE%20100-219%2C%20Plano%2C%20TX%2075024" target="_blank" rel="noopener noreferrer">
            <MapPin size={18} /><span>5830 Granite Pkwy, STE 100-219<br />Plano, TX 75024</span>
          </a>
          <div className="foot__reach [display:flex] [flex-wrap:wrap] [gap:1.2rem] [margin-top:2.4rem] [&_a]:[display:inline-flex] [&_a]:[align-items:center] [&_a]:[gap:1rem] [&_a]:[height:4.8rem] [&_a]:[padding-inline:2rem] [&_a]:[border-radius:4rem] [&_a]:[border:1px_solid_#3a3157] [&_a]:[color:#fff] [&_a]:[font-size:1.6rem] [&_a]:[transition:background_0.3s,_border-color_0.3s] [&_a:hover]:[background:var(--purple)] [&_a:hover]:[border-color:var(--purple)] [&_svg]:[color:#b9a5ff] [&_svg]:[transition:color_0.3s] [&_a:hover_svg]:[color:#fff]">
            <motion.a href="tel:+12148512698" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}><Phone size={18} /> 214-851-2698</motion.a>
            <motion.a href="mailto:info@affinitycore.co" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}><Mail size={18} /> info@affinitycore.co</motion.a>
          </div>
        </Reveal>
        <motion.div className="foot__cols [display:flex] [justify-content:space-between] [gap:4rem] [padding:6rem_var(--gutter)_6rem_8.8rem] [&>div]:[display:flex] [&>div]:[flex-direction:column] [&>div]:[gap:0.8rem] [&_a]:[font-size:1.8rem] [&_a]:[line-height:2.9rem] [&_a]:[display:inline-block] [@media(max-width:_1279px)]:[padding:4rem_2rem]! [@media(max-width:_1279px)]:[flex-wrap:wrap] [@media(max-width:_1279px)]:[order:3] [@media(max-width:_1279px)]:[display:grid] [@media(max-width:_1279px)]:[grid-template-columns:repeat(4,_auto)] [@media(max-width:_1279px)]:[justify-content:space-between] [@media(max-width:_1279px)]:[gap:3.2rem_2.4rem] [@media(max-width:_1279px)]:[border-bottom:1px_solid_#372f4f] [@media(max-width:_767px)]:[grid-template-columns:1fr_1fr] [@media(max-width:_767px)]:[justify-content:stretch] [@media(max-width:_767px)]:[gap:4rem_2rem]" initial="hidden" whileInView="show" viewport={vp}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}>
          {COLS.map(([h, links]) => (
            <motion.div key={h} className={`foot__col foot__col--${h.toLowerCase()}`} variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}>
              <motion.p className="foot__h [font-size:1.8rem] [color:#9d97b3] [margin-bottom:1.2rem] [@media(max-width:_767px)]:[.foot\_\_col--services_&]:[column-span:all] [@media(max-width:_767px)]:[.foot\_\_col--company_&]:[column-span:all]" variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>{h}</motion.p>
              {links.map((l) => (
                <motion.a key={l} href={footHref(l)} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: ease.out } } }}
                  whileHover={{ x: 6, color: '#b9a5ff' }}>{l}</motion.a>
              ))}
            </motion.div>
          ))}
        </motion.div>
      </div>
      <div className="foot__mid [display:grid] [grid-template-columns:66rem_1fr_48rem] [border-bottom:1px_solid_#372f4f] [&>div]:[padding:4rem_5.6rem] [@media(max-width:_1279px)]:[&>div]:[padding:4rem_2rem]! [@media(max-width:_1279px)]:[order:2] [@media(max-width:_1279px)]:[grid-template-columns:1fr_1fr] [@media(max-width:_767px)]:[grid-template-columns:1fr]">
        <Reveal className="foot__news [padding-left:var(--gutter)]! [border-right:1px_solid_#372f4f] [&>p]:[font-size:1.8rem] [&>p]:[margin-bottom:1.2rem] [@media(max-width:_1279px)]:[border-right:0]! [@media(max-width:_1279px)]:[grid-column:1_/_-1] [@media(max-width:_1279px)]:[border-bottom:1px_solid_#372f4f]">
          <p>Subscribe to our Newsletter</p>
          <form className="foot__input [display:flex] [align-items:center] [&_input]:[flex:1] [&_input]:[height:5.6rem] [&_input]:[padding-inline:3.2rem] [&_input]:[border-radius:6rem] [&_input]:[border:0] [&_input]:[background:#372f4f] [&_input]:[color:#fff] [&_input]:[font-family:inherit] [&_input]:[font-weight:inherit] [&_input]:[font-style:inherit] [&_input]:[line-height:inherit] [&_input]:[font-size:2rem] [&_input]:[outline:none] [&_input::placeholder]:[color:#8a84a0] [&_button]:[width:5.6rem] [&_button]:[height:5.6rem] [&_button]:[border-radius:50%] [&_button]:[background:var(--purple)] [&_button]:[display:grid] [&_button]:[place-items:center] [&_svg]:[width:2rem] [&_svg]:[height:2rem] [@media(max-width:_640px)]:[width:100%] [@media(max-width:_640px)]:[max-width:100%] [@media(max-width:_640px)]:[gap:0.8rem] [@media(max-width:_640px)]:[&_input]:[min-width:0] [@media(max-width:_640px)]:[&_input]:[width:100%] [@media(max-width:_640px)]:[&_input]:[height:5.2rem] [@media(max-width:_640px)]:[&_input]:[padding-inline:2rem] [@media(max-width:_640px)]:[&_input]:[font-size:1.6rem] [@media(max-width:_640px)]:[&_button]:[flex:none] [@media(max-width:_640px)]:[&_button]:[width:5.2rem] [@media(max-width:_640px)]:[&_button]:[height:5.2rem]" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email address" aria-label="Email address" />
            <motion.button type="submit" aria-label="Subscribe" whileHover={{ scale: 1.08, rotate: -45 }} whileTap={{ scale: 0.92 }}><Arrow /></motion.button>
          </form>
        </Reveal>
        <Reveal className="foot__contact [padding-left:8.8rem]! [border-right:1px_solid_#372f4f] [@media(max-width:_1279px)]:[border-right:0]! [@media(max-width:_767px)]:[border-bottom:1px_solid_#372f4f]" delay={0.1}>
          <p className="foot__h [font-size:1.8rem] [color:#9d97b3] [margin-bottom:1.2rem] [@media(max-width:_767px)]:[.foot\_\_col--services_&]:[column-span:all] [@media(max-width:_767px)]:[.foot\_\_col--company_&]:[column-span:all]">Follow us</p>
          <ul className="foot__social foot__social--mid [display:flex] [gap:1.2rem] [&_a]:[width:4.8rem] [&_a]:[height:4.8rem] [&_a]:[border-radius:50%] [&_a]:[display:grid] [&_a]:[place-items:center] [&_a]:[border:1px_solid_#3a3157] [&_a]:[color:#fff] [&_a]:[transition:background_0.3s,_border-color_0.3s] [&_a:hover]:[background:var(--purple)] [&_a:hover]:[border-color:var(--purple)] [&_svg]:[width:2rem] [&_svg]:[height:2rem] [&_svg]:[fill:currentColor] [margin-top:0]">
            {SOCIAL.map((s) => (
              <li key={s.label}>
                <motion.a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`Affinity Core on ${s.label}`} whileHover={{ y: -3 }} whileTap={{ scale: 0.92 }}>
                  <svg viewBox="0 0 24 24" aria-hidden><path d={s.d} /></svg>
                </motion.a>
              </li>
            ))}
          </ul>

        </Reveal>
        <Reveal className="foot__awards [padding-left:5.2rem]! [padding-right:var(--gutter)]! [display:flex] [align-items:center] [gap:1.6rem]" delay={0.2}>
          <span className="foot__badge [width:8.4rem] [height:8.4rem] [flex:none] [border-radius:50%] [background:#fff] [display:grid] [place-items:center] [box-shadow:0_0_0_0.6rem_rgba(255,_255,_255,_0.08)] [&_img]:[width:7rem] [&_img]:[height:7rem] [&_img]:[object-fit:contain]"><img src={hipaaBadge} alt="HIPAA compliant" /></span><p className="foot__badge-t [font-weight:500] [font-size:1.7rem] [color:#fff] [line-height:1.35] [&_small]:[font-weight:400] [&_small]:[font-size:1.4rem] [&_small]:[color:#a59fc4]">HIPAA compliant<br /><small>BAA signed with every client</small></p>
        </Reveal>
      </div>
      <p className="foot__copy [text-align:center] [padding:1.3rem_0] [font-size:1.8rem] [color:#c9c5d6] [border-bottom:1px_solid_#372f4f] [position:relative] [z-index:1] [@media(max-width:_1279px)]:[order:4]">© 2026 AffinityCore. All rights reserved.</p>
      <motion.div className="foot__bars [position:relative] [height:38.7rem] [overflow:hidden] [&_span]:[position:absolute] [&_span]:[bottom:0] [&_span]:[height:auto] [&_span]:[transform-origin:bottom] [&_span]:[background:linear-gradient(180deg,_rgba(106,_65,_249,_0)_0%,_rgba(96,_56,_220,_0.6)_100%)] [&_span]:[border-left:1px_dashed_rgba(255,_255,_255,_0.25)] [&_span]:[border-right:1px_dashed_rgba(255,_255,_255,_0.25)] [@media(max-width:_1279px)]:[height:20rem] [@media(max-width:_1279px)]:[order:5]" aria-hidden initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
        <div className="foot__bars-in [position:absolute] [left:50%] [top:0] [bottom:0] [width:192rem] [margin-left:-96rem] [transform:scaleX(0.875)]">
        {BARS.map(([l, t, w], i) => (
          <motion.span key={i} style={{ left: `${l / 10}rem`, top: `${t / 10}rem`, width: `${w / 10}rem` }}
            variants={{ hidden: { scaleY: 0 }, show: { scaleY: 1, transition: { duration: 1.2, ease: ease.out, delay: 0.15 + Math.abs(3 - i) * 0.12 } } }} />
        ))}
      </div>
      </motion.div>
    </footer>
  );
}
