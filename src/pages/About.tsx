/**
 * About page (/about). The story is told from the practice's side: what happens on your account while you see patients.
 *  1. Hero: "a day on your account" timeline that plays beside the headline
 *  2. Manifesto: a paragraph that inks in word by word as you scroll
 *  3. What we believe: four principles
 *  4. Your account team: an orbit of the six roles around your practice (tap a role to see what they do)
 *  5. By the numbers
 *  6. Where we work: Plano office on a Texas outline, plus the sister-company note
 *  7. Careers band, FAQ, CTA
 * Anything about the company that needs Affinity Core's sign-off is marked [Confirm].
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, type MotionValue } from 'motion/react';
import {
  ArrowRight, ArrowUpRight, BadgeCheck, Building2, ClipboardCheck, FileSearch, Headset, KeyRound, MapPin, Phone, ShieldCheck, Undo2, Users,
} from 'lucide-react';
import { Button, CountUp, Eyebrow, Reveal, SplitWords } from '../components/ui';
import { CTA, FAQ } from '../sections/Closing';
import { Link } from '../router';
import { ease, vp } from '../motion';
import { US_STATES } from '../data/usMap';
import { setJsonLd, pageJsonLd } from '../data/seo';

const CONFIRM = '[Confirm with Affinity Core]';

/* ------------------------------------------------------------------ */
/* 1. Hero                                                             */
/* ------------------------------------------------------------------ */
const DAY: { t: string; what: string; who: string; tone?: 'ok' | 'win' }[] = [
  { t: '7:40 AM', what: 'Eligibility checked for today’s 38 patients', who: 'Front-end team' },
  { t: '9:15 AM', what: 'Prior auth approved for Thursday’s MRI', who: 'Auth specialist', tone: 'ok' },
  { t: '11:30 AM', what: 'Yesterday’s visits coded and scrubbed', who: 'Certified coder' },
  { t: '1:05 PM', what: 'CO-197 denial appealed with the clinical note', who: 'Denial team' },
  { t: '3:50 PM', what: '$18,240 posted, one underpayment flagged', who: 'Payment posting', tone: 'win' },
  { t: '5:10 PM', what: 'Daily summary sent to your practice manager', who: 'Account lead' },
];

function DayOnYourAccount() {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setN(DAY.length); return; }
    const t = window.setInterval(() => setN((x) => (x >= DAY.length + 2 ? 1 : x + 1)), 1100);
    return () => window.clearInterval(t);
  }, []);
  const shown = Math.min(n, DAY.length);
  return (
    <motion.div className="ab-day" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: ease.out, delay: 0.35 }} aria-label="An example day on a client account">
      <div className="ab-day__head">
        <span className="ab-day__live"><i />A day on your account</span>
        <span className="ab-day__date">While you see patients</span>
      </div>
      <ol className="ab-day__list">
        {DAY.map((d, i) => (
          <li key={d.t} className={`${i < shown ? 'is-in' : ''} ${i === shown - 1 ? 'is-now' : ''} ${d.tone ? `is-${d.tone}` : ''}`}>
            <time>{d.t}</time>
            <span className="ab-day__dot" aria-hidden />
            <span className="ab-day__txt"><b>{d.what}</b><small>{d.who}</small></span>
          </li>
        ))}
      </ol>
      <p className="ab-day__fine">Illustrative day. Every account’s rhythm is set with the practice.</p>
    </motion.div>
  );
}

function Hero() {
  return (
    <section className="ab-hero container">
      <div className="ab-hero__copy">
        <motion.p className="eyebrow" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: ease.out, delay: 0.2 }}>/ About Affinity Core</motion.p>
        <SplitWords as="h1" className="page-title" animateNow delay={0.3} stagger={0.05} lines={['The people who make', 'sure care gets paid.']} bold={['care', 'gets', 'paid.']} />
        <motion.p className="page-sub" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.75 }}>
          Affinity Core is a US-based revenue cycle team in Plano, Texas. Certified coders, billers and denial specialists who work inside your systems, answer in your time zone, and treat every claim like it’s our own money on the line.
        </motion.p>
        <motion.div className="ab-hero__cta" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.9 }}>
          <Button to="/contact">Meet your billing team</Button>
          <Link to="/case-studies" className="text-link">See our results <ArrowRight size={18} /></Link>
        </motion.div>
      </div>
      <DayOnYourAccount />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Manifesto: words ink in as the paragraph scrolls through          */
/* ------------------------------------------------------------------ */
const MANIFESTO = 'Doctors didn’t go to medical school to argue with insurance companies. So we do it for them. We believe every denial has a cause, every cause has a fix, and every fix should show up on your next report, in plain English and in your own numbers.';
const ACCENT = new Set(['cause,', 'fix,', 'plain', 'English', 'own', 'numbers.']);

function Word({ w, i, total, p }: { w: string; i: number; total: number; p: MotionValue<number> }) {
  const start = i / total, end = start + 1 / total;
  const o = useTransform(p, [start, end], [0.16, 1]);
  return <motion.span style={{ opacity: o }} className={ACCENT.has(w) ? 'is-accent' : ''}>{w} </motion.span>;
}

function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 45%'] });
  const words = useMemo(() => MANIFESTO.split(' '), []);
  return (
    <section className="ab-man container">
      <Eyebrow>/ Why we exist</Eyebrow>
      <div ref={ref} className="ab-man__p" aria-label={MANIFESTO}>
        <span aria-hidden>{words.map((w, i) => <Word key={i} w={w} i={i} total={words.length} p={scrollYProgress} />)}</span>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 3. What we believe                                                  */
/* ------------------------------------------------------------------ */
const BELIEFS = [
  { n: '01', t: 'Fix the cause, not just the claim.', b: 'Reworking a denial gets one claim paid. Fixing why it happened stops the next hundred. Every denial we touch ends with a note on what changes upstream.' },
  { n: '02', t: 'Plain English, always.', b: 'No jargon walls. You get a monthly report a practice manager can read in ten minutes, and a person who will walk you through it.' },
  { n: '03', t: 'Your numbers, not ours.', b: 'We measure ourselves on your denial rate, days in A/R and net collections, against the baseline we took before we started.' },
  { n: '04', t: 'Earn the next month.', b: `No long lock-in. If we’re not moving your numbers, you should be free to leave. ${CONFIRM}` },
];

function Beliefs() {
  return (
    <section className="ab-bel container">
      <div className="ab-bel__head">
        <div><Eyebrow>/ What we believe</Eyebrow><SplitWords className="h-56" lines={['Four rules we', 'bill by.']} stagger={0.04} /></div>
        <Reveal as="p" className="ab-bel__intro">They sound simple. Holding to them on every claim, every day, is the whole job.</Reveal>
      </div>
      <div className="ab-bel__grid">
        {BELIEFS.map((x, i) => (
          <motion.article key={x.n} className="ab-bel__card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 0.8, ease: ease.out, delay: i * 0.08 }}>
            <span className="ab-bel__n">{x.n}</span>
            <h3>{x.t}</h3>
            <p>{x.b}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Your account team: orbit                                         */
/* ------------------------------------------------------------------ */
const TEAM = [
  { icon: Headset, role: 'Account lead', line: 'Your one name and number.', body: 'Owns your account end to end, runs the monthly review and is the person you call when something looks off.' },
  { icon: KeyRound, role: 'Front-end team', line: 'Before the visit.', body: 'Verifies eligibility and benefits, secures prior authorizations and flags anything that would stop a claim before it starts.' },
  { icon: FileSearch, role: 'Certified coders', line: 'From note to code.', body: 'Code from the documentation with AAPC or AHIMA credentials and specialty experience, and send back documentation tips when a note falls short.' },
  { icon: ClipboardCheck, role: 'Billing specialists', line: 'Clean claims, same day.', body: 'Scrub every claim against payer rules, submit it, and post payments line by line so underpayments don’t slip through.' },
  { icon: Undo2, role: 'Denial & A/R team', line: 'Nothing left unpaid.', body: 'Work denials back to paid, prep peer-to-peer calls, and chase aged claims until they pay or close for a documented reason.' },
  { icon: ShieldCheck, role: 'Compliance & QA', line: 'Audit-ready, always.', body: 'Review a sample of every coder’s work, keep the team current on CPT and payer changes, and keep your account HIPAA-tight.' },
];

function Team() {
  const [on, setOn] = useState(0);
  const [hold, setHold] = useState(false);
  useEffect(() => {
    if (hold || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = window.setInterval(() => setOn((x) => (x + 1) % TEAM.length), 3200);
    return () => window.clearInterval(t);
  }, [hold]);
  const cur = TEAM[on];
  const Icon = cur.icon;
  return (
    <section className="ab-team container">
      <div className="ab-team__panel">
        <div className="ab-team__copy">
          <Eyebrow>/ Your account team</Eyebrow>
          <SplitWords className="h-56" lines={['Six roles.', 'One team on your side.']} stagger={0.04} />
          <Reveal as="p" className="ab-team__p">You don’t get a ticket queue. You get named people, each owning one part of your revenue cycle, all reporting to the account lead who knows your practice.</Reveal>
          <AnimatePresence mode="wait">
            <motion.div key={on} className="ab-team__card" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4, ease: ease.out }}>
              <span className="ab-team__ic"><Icon size={22} /></span>
              <div><small>{cur.line}</small><b>{cur.role}</b><p>{cur.body}</p></div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="ab-orbit" onMouseLeave={() => setHold(false)}>
          <svg className="ab-orbit__rings" viewBox="0 0 400 400" aria-hidden>
            <circle cx="200" cy="200" r="150" /><circle cx="200" cy="200" r="98" className="is-inner" />
            {TEAM.map((_, i) => {
              const a = (i / TEAM.length) * Math.PI * 2 - Math.PI / 2;
              return <line key={i} x1="200" y1="200" x2={200 + 150 * Math.cos(a)} y2={200 + 150 * Math.sin(a)} className={i === on ? 'is-on' : ''} />;
            })}
          </svg>
          <div className="ab-orbit__core"><Building2 size={26} /><b>Your practice</b></div>
          {TEAM.map((m, i) => {
            const a = (i / TEAM.length) * Math.PI * 2 - Math.PI / 2;
            const I = m.icon;
            return (
              <button key={m.role} type="button" className={`ab-orbit__node ${i === on ? 'is-on' : ''}`}
                style={{ left: `${50 + 37.5 * Math.cos(a)}%`, top: `${50 + 37.5 * Math.sin(a)}%` }}
                onMouseEnter={() => { setHold(true); setOn(i); }} onFocus={() => { setHold(true); setOn(i); }} onClick={() => { setHold(true); setOn(i); }}
                aria-pressed={i === on}>
                <span><I size={20} /></span><small>{m.role}</small>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 5. By the numbers                                                   */
/* ------------------------------------------------------------------ */
const NUMS: { v: number; pre?: string; suf?: string; k: string }[] = [
  { v: 96, suf: '%', k: 'Net collection rate' },
  { v: 98, suf: '%', k: 'Clean claim rate' },
  { v: 30, pre: '<', k: 'Average days in A/R' },
  { v: 30, suf: '+', k: 'US-based billers and coders' },
  { v: 23, k: 'Specialties billed' },
  { v: 50, k: 'States served' },
];
function Numbers() {
  return (
    <section className="ab-num container">
      <div className="ab-num__grid">
        {NUMS.map((x, i) => (
          <motion.div key={x.k} className="ab-num__cell" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 0.7, ease: ease.out, delay: i * 0.06 }}>
            <CountUp className="ab-num__v" value={x.v} prefix={x.pre} suffix={x.suf} duration={1.6} />
            <small>{x.k}</small>
          </motion.div>
        ))}
      </div>
      <p className="ab-num__fine">Averages across active client accounts. {CONFIRM}</p>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 6. Where we work                                                    */
/* ------------------------------------------------------------------ */
function TexasPin() {
  const tx = US_STATES.find((s) => s.id === '48');
  const view = useMemo(() => {
    if (!tx) return null;
    const nums = tx.d.match(/-?\d+(\.\d+)?/g)!.map(Number);
    const xs = nums.filter((_, i) => i % 2 === 0), ys = nums.filter((_, i) => i % 2 === 1);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const pad = (x1 - x0) * 0.08;
    // Plano, TX sits ~76% across and ~31% down the state's bounding box
    return { box: `${x0 - pad} ${y0 - pad} ${x1 - x0 + pad * 2} ${y1 - y0 + pad * 2}`, px: x0 + (x1 - x0) * 0.755, py: y0 + (y1 - y0) * 0.31, u: (x1 - x0) / 100 };
  }, [tx]);
  if (!tx || !view) return null;
  return (
    <svg className="ab-tx" viewBox={view.box} aria-hidden>
      <motion.path d={tx.d} className="ab-tx__s" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={vp} transition={{ duration: 2, ease: ease.inOut }} />
      <circle cx={view.px} cy={view.py} r={view.u * 6} className="ab-tx__pulse" />
      <circle cx={view.px} cy={view.py} r={view.u * 2.2} className="ab-tx__pin" />
    </svg>
  );
}

function Where() {
  return (
    <section className="ab-where container">
      <div className="ab-where__map">
        <TexasPin />
        <span className="ab-where__tag"><MapPin size={14} /> Plano, Texas</span>
      </div>
      <div className="ab-where__copy">
        <Eyebrow>/ Where we work</Eyebrow>
        <SplitWords className="h-56" lines={['Based in Texas.', 'Billing across the US.']} stagger={0.04} />
        <Reveal as="p" className="ab-where__p">Our team works from Plano and across the US, inside each client’s own EHR, practice management system and payer portals. No offshore handoffs, and someone who answers in your time zone.</Reveal>
        <ul className="ab-where__facts">
          <li><Building2 size={18} /><span><b>Office</b>5830 Granite Pkwy, STE 100-219, Plano, TX 75024</span></li>
          <li><Phone size={18} /><span><b>Call</b><a href="tel:+12148512698">214-851-2698</a></span></li>
          <li><BadgeCheck size={18} /><span><b>Compliance</b>HIPAA compliant, with a BAA signed for every client</span></li>
          <li><Users size={18} /><span><b>Family</b>{`A sister company of Partner Interactive, the design and technology team behind our reporting tools. ${CONFIRM}`}</span></li>
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 7. Careers band                                                     */
/* ------------------------------------------------------------------ */
function Careers() {
  return (
    <section className="ab-car container">
      <motion.div className="ab-car__band" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 0.9, ease: ease.out }}>
        <div>
          <small>/ Careers</small>
          <p>Good at getting claims paid? We’re hiring coders, billers and A/R specialists.</p>
        </div>
        <Link to="/careers" className="ab-car__go">See open roles <ArrowUpRight size={18} /></Link>
      </motion.div>
    </section>
  );
}

const FAQS = [
  ['Where is Affinity Core based?', 'Our office is in Plano, Texas, at 5830 Granite Pkwy. Our billing team is US-based and works with practices across the country.'],
  ['Is your team in-house or outsourced?', `Your account is worked by our own US-based team of billers, coders and A/R specialists, not passed to a third party. ${CONFIRM}`],
  ['Who will I actually talk to?', 'A named account lead who knows your practice, runs your monthly review and can pull in the coder or specialist working your claims.'],
  ['How is Affinity Core related to Partner Interactive?', `We’re sister companies. Partner Interactive is a design and technology agency; Affinity Core focuses on revenue cycle management for medical practices. ${CONFIRM}`],
];

export function AboutPage() {
  useEffect(() => {
    document.title = 'About Us · Affinity Core';
    const desc = 'Affinity Core is a US-based medical billing and revenue cycle team in Plano, Texas: certified coders, billers and denial specialists working inside your systems.';
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m); }
    m.setAttribute('content', desc);
    setJsonLd(pageJsonLd({ name: 'About Affinity Core', description: desc, path: '/about', crumb: ['About', '/about'], faqs: FAQS }));
    return () => setJsonLd(null);
  }, []);
  return (
    <main className="page">
      <Hero />
      <Manifesto />
      <Beliefs />
      <Team />
      <Numbers />
      <Where />
      <Careers />
      <FAQ items={FAQS} eyebrow="/ About us FAQs" lines={['Questions about', 'who we are.']} />
      <CTA eyebrow="/ Let’s get acquainted" lines={['Meet the team that', 'gets your claims paid.']} />
    </main>
  );
}
