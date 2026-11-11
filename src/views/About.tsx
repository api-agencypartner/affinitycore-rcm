'use client';
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
    <motion.div className="ab-day [position:relative] [padding:3.2rem] [border-radius:3.2rem] [background:var(--soft-grain),_var(--soft-bg)] [border:1px_solid_#ebe5ff] [box-shadow:0_3rem_8rem_rgba(106,_65,_249,_0.1)] [min-width:0] [@media(max-width:_767px)]:[padding:2rem]" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: ease.out, delay: 0.35 }} aria-label="An example day on a client account">
      <div className="ab-day__head [display:flex] [justify-content:space-between] [align-items:center] [gap:1.2rem] [padding-bottom:2rem] [border-bottom:1px_solid_rgba(106,_65,_249,_0.12)]">
        <span className="ab-day__live [display:inline-flex] [align-items:center] [gap:0.8rem] [font-family:var(--f-mono)] [font-size:1.3rem] [letter-spacing:0.06em] [text-transform:uppercase] [color:var(--purple)] [&_i]:[width:0.8rem] [&_i]:[height:0.8rem] [&_i]:[border-radius:50%] [&_i]:[background:#22c55e] [&_i]:[box-shadow:0_0_0_0.4rem_rgba(34,_197,_94,_0.2)]"><i />A day on your account</span>
        <span className="ab-day__date [font-size:1.4rem] [color:#7b7f92] [@media(max-width:_767px)]:[display:none]">While you see patients</span>
      </div>
      <ol className="ab-day__list [list-style:none] [margin:0] [padding:1.6rem_0_0] [position:relative] [&::before]:[content:''] [&::before]:[position:absolute] [&::before]:[left:9.85rem] [&::before]:[top:2.8rem] [&::before]:[bottom:1.6rem] [&::before]:[width:2px] [&::before]:[background:rgba(106,_65,_249,_0.14)] [&_li]:[position:relative] [&_li]:[display:grid] [&_li]:[grid-template-columns:8rem_2.2rem_minmax(0,_1fr)] [&_li]:[gap:1.2rem] [&_li]:[align-items:start] [&_li]:[padding:1.1rem_0] [&_li]:[opacity:0.28] [&_li]:[transform:translateX(-0.6rem)] [&_li]:[transition:opacity_0.6s,_transform_0.6s_cubic-bezier(.16,1,.3,1)] [&_time]:[padding-top:0.3rem] [&_time]:[font-family:var(--f-mono)] [&_time]:[font-size:1.3rem] [&_time]:[color:#8a8ea0] [&_time]:[text-align:right] [@media(max-width:_767px)]:[&::before]:[left:7.05rem] [@media(max-width:_767px)]:[&_li]:[grid-template-columns:5.6rem_1.6rem_minmax(0,_1fr)] [@media(max-width:_767px)]:[&_li]:[gap:0.8rem] [@media(max-width:_767px)]:[&_time]:[font-size:1.15rem]">
        {DAY.map((d, i) => (
          <li key={d.t} className={`${i < shown ? String.raw`is-in [.ab-day\_\_list_li&]:[opacity:1] [.ab-day\_\_list_li&]:[transform:none]` : ''} ${i === shown - 1 ? String.raw`is-now [.sc-stat\_\_bars_i&]:[background:var(--grad)]` : ''} ${d.tone ? `is-${d.tone}` : ''}`}>
            <time>{d.t}</time>
            <span className="ab-day__dot [position:relative] [z-index:1] [width:1.4rem] [height:1.4rem] [margin:0.4rem_auto_0] [border-radius:50%] [background:#fff] [border:2px_solid_#cfc3ff] [transition:background_0.4s,_border-color_0.4s,_box-shadow_0.4s] [.ab-day\_\_list_li.is-in_&]:[background:var(--purple)] [.ab-day\_\_list_li.is-in_&]:[border-color:var(--purple)] [.ab-day\_\_list_li.is-now_&]:[box-shadow:0_0_0_0.6rem_rgba(106,_65,_249,_0.16)] [.ab-day\_\_list_li.is-ok.is-in_&]:[background:#22c55e] [.ab-day\_\_list_li.is-ok.is-in_&]:[border-color:#22c55e] [.ab-day\_\_list_li.is-win.is-in_&]:[background:#22c55e] [.ab-day\_\_list_li.is-win.is-in_&]:[border-color:#22c55e]" aria-hidden />
            <span className="ab-day__txt [padding:1.2rem_1.6rem] [border-radius:1.6rem] [background:rgba(255,_255,_255,_0.7)] [border:1px_solid_#fff] [transition:box-shadow_0.4s,_background_0.4s] [.ab-day\_\_list_li.is-now_&]:[background:#fff] [.ab-day\_\_list_li.is-now_&]:[box-shadow:0_1.2rem_3rem_rgba(80,_50,_200,_0.1)] [&_b]:[display:block] [&_b]:[font-weight:500] [&_b]:[font-size:1.6rem] [&_b]:[line-height:1.35] [&_b]:[color:var(--ink-2)] [&_small]:[display:block] [&_small]:[margin-top:0.3rem] [&_small]:[font-size:1.3rem] [&_small]:[color:#7b7f92] [.ab-day\_\_list_li.is-win_&_b]:[color:var(--purple)] [@media(max-width:_767px)]:[padding:1rem_1.2rem] [@media(max-width:_767px)]:[&_b]:[font-size:1.45rem]"><b>{d.what}</b><small>{d.who}</small></span>
          </li>
        ))}
      </ol>
      <p className="ab-day__fine [@media(max-width:_1279px)]:[font-size:13.5px]! [@media(max-width:_1279px)]:[line-height:1.55] [margin-top:1.2rem] [font-size:1.2rem] [color:#9a9db0]">Illustrative day. Every account’s rhythm is set with the practice.</p>
    </motion.div>
  );
}

function Hero() {
  return (
    <section className="ab-hero container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [display:grid] [grid-template-columns:minmax(0,_1.05fr)_minmax(0,_0.95fr)] [gap:6.4rem] [align-items:center] [padding-top:18rem] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1279px)]:[gap:4.8rem] [@media(max-width:_1279px)]:[padding-top:14rem] [@media(max-width:_767px)]:[padding-top:12rem]">
      <div className="ab-hero__copy [display:flex] [flex-direction:column] [gap:2rem] [min-width:0]">
        <motion.p className="eyebrow [font-family:var(--f-mono)] [font-size:1.6rem] [line-height:1.4] [text-transform:uppercase] [color:var(--ink)] [letter-spacing:0.02em] [.hero\_\_copy_&]:[margin-bottom:1.2rem] [.stmac\_\_intro_&]:[grid-column:1_/_-1]" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: ease.out, delay: 0.2 }}>/ About Affinity Core</motion.p>
        <SplitWords as="h1" className="page-title [font-weight:500] [font-size:6.12rem] [line-height:1.06] [letter-spacing:-0.18rem] [color:var(--ink-3)] [@media(max-width:_1279px)]:[font-size:4.32rem]" animateNow delay={0.3} stagger={0.05} lines={['The people who make', 'sure care gets paid.']} bold={['care', 'gets', 'paid.']} />
        <motion.p className="page-sub [font-size:1.8rem] [line-height:1.6] [color:#4a4f63] [max-width:56rem] [.ab-hero\_\_copy_&]:[max-width:64rem]" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.75 }}>
          Affinity Core is a US-based revenue cycle team in Plano, Texas. Certified coders, billers and denial specialists who work inside your systems, answer in your time zone, and treat every claim like it’s our own money on the line.
        </motion.p>
        <motion.div className="ab-hero__cta [display:flex] [flex-wrap:wrap] [align-items:center] [gap:2.4rem] [margin-top:1.2rem]" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.9 }}>
          <Button to="/contact">Meet your billing team</Button>
          <Link to="/case-studies" className="text-link [display:inline-flex] [align-items:center] [gap:0.8rem] [font-weight:500] [font-size:1.8rem] [color:var(--purple)] [&_svg]:[transition:transform_0.4s_cubic-bezier(.16,1,.3,1)] [&:hover_svg]:[transform:translateX(0.5rem)] [.est\_\_carried_&]:[margin-top:0.6rem] [.est\_\_carried_&]:[font-size:1.5rem] [.est\_\_carried_&]:[color:#fff] [.est\_\_carried_&]:[text-decoration:underline] [.est\_\_carried_&]:[text-underline-offset:0.3em] [.est\_\_carried_&]:[opacity:0.85]">See our results <ArrowRight size={18} /></Link>
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
  return <motion.span style={{ opacity: o }} className={ACCENT.has(w) ? String.raw`is-accent [.ab-man\_\_p_&]:[background:var(--grad)] [.ab-man\_\_p_&]:[-webkit-background-clip:text] [.ab-man\_\_p_&]:[background-clip:text]! [.ab-man\_\_p_&]:[color:transparent]` : ''}>{w} </motion.span>;
}

function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 45%'] });
  const words = useMemo(() => MANIFESTO.split(' '), []);
  return (
    <section className="ab-man container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [padding-top:16rem] [max-width:128rem] [@media(max-width:_1279px)]:[padding-top:10rem] [@media(max-width:_767px)]:[padding-top:8rem]">
      <Eyebrow>/ Why we exist</Eyebrow>
      <div ref={ref} className="ab-man__p [margin-top:2.4rem] [font-family:var(--f-jak)] [font-weight:500] [font-size:5.2rem] [line-height:1.22] [letter-spacing:-0.16rem] [color:var(--ink-2)] [@media(max-width:_1279px)]:[font-size:4rem] [@media(max-width:_767px)]:[font-size:2.8rem] [@media(max-width:_767px)]:[letter-spacing:-0.08rem]" aria-label={MANIFESTO}>
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
    <section className="ab-bel container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [padding-top:16rem] [@media(max-width:_1279px)]:[padding-top:10rem] [@media(max-width:_767px)]:[padding-top:8rem]">
      <div className="ab-bel__head [display:flex] [justify-content:space-between] [align-items:flex-end] [gap:4rem] [@media(max-width:_767px)]:[flex-direction:column] [@media(max-width:_767px)]:[align-items:flex-start] [@media(max-width:_767px)]:[gap:1.6rem]">
        <div><Eyebrow>/ What we believe</Eyebrow><SplitWords className="h-56 [font-weight:500] [font-size:5.6rem] [line-height:1.08] [letter-spacing:-0.12rem] [color:var(--ink-2)] [text-wrap:balance] [@media(max-width:_1279px)]:[font-size:3.8rem] [@media(max-width:_640px)]:[font-size:3.4rem]" lines={['Four rules we', 'bill by.']} stagger={0.04} /></div>
        <Reveal as="p" className="ab-bel__intro [max-width:44rem] [font-size:1.8rem] [line-height:1.6] [color:#4a4f63]">They sound simple. Holding to them on every claim, every day, is the whole job.</Reveal>
      </div>
      <div className="ab-bel__grid [display:grid] [grid-template-columns:repeat(4,_minmax(0,_1fr))] [gap:1.6rem] [margin-top:5.6rem] [@media(max-width:_1279px)]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] [@media(max-width:_767px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_767px)]:[margin-top:3.2rem]">
        {BELIEFS.map((x, i) => (
          <motion.article key={x.n} className="ab-bel__card [@media(max-width:_1279px)]:[font-size:16px]! [@media(max-width:_1279px)]:[line-height:1.6] [position:relative] [display:flex] [flex-direction:column] [gap:1.4rem] [min-height:34rem] [padding:3.2rem] [border-radius:2.8rem] [background:#fff] [border:1px_solid_#ece8fa] [overflow:hidden] [transition:border-color_0.4s,_box-shadow_0.4s,_transform_0.5s_cubic-bezier(.16,1,.3,1)] [&:hover]:[border-color:var(--purple)] [&:hover]:[box-shadow:0_2.4rem_6rem_rgba(106,_65,_249,_0.12)] [&:hover]:[transform:translateY(-0.6rem)] [&_h3]:[margin-top:auto] [&_h3]:[font-family:var(--f-jak)] [&_h3]:[font-weight:500] [&_h3]:[font-size:2.4rem] [&_h3]:[line-height:1.25] [&_h3]:[letter-spacing:-0.06rem] [&_h3]:[color:var(--ink-2)] [&_p]:[font-size:1.5rem] [&_p]:[line-height:1.6] [&_p]:[color:#5b5f72] [@media(max-width:_1279px)]:[min-height:28rem] [@media(max-width:_767px)]:[min-height:0] [@media(max-width:_767px)]:[padding:2.4rem]" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 0.8, ease: ease.out, delay: i * 0.08 }}>
            <span className="ab-bel__n [font-family:var(--f-jak)] [font-weight:600] [font-size:8rem] [line-height:1] [letter-spacing:-0.3rem] [background:linear-gradient(180deg,_#d9cfff,_rgba(217,_207,_255,_0.2))] [-webkit-background-clip:text] [background-clip:text]! [color:transparent] [transition:background_0.4s] [.ab-bel\_\_card:hover_&]:[background:var(--grad)]! [.ab-bel\_\_card:hover_&]:[-webkit-background-clip:text] [.ab-bel\_\_card:hover_&]:[background-clip:text]! [@media(max-width:_767px)]:[font-size:5.6rem]">{x.n}</span>
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
    <section className="ab-team container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [padding-top:16rem] [@media(max-width:_1279px)]:[padding-top:10rem] [@media(max-width:_767px)]:[padding-top:8rem]">
      <div className="ab-team__panel [display:grid] [grid-template-columns:minmax(0,_1fr)_minmax(0,_1fr)] [gap:6.4rem] [align-items:center] [padding:7.2rem] [border-radius:4rem] [background:var(--soft-grain),_var(--soft-bg)] [border:1px_solid_#ebe5ff] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1279px)]:[padding:5.6rem_4rem] [@media(max-width:_767px)]:[padding:4rem_2rem] [@media(max-width:_767px)]:[border-radius:3.2rem]">
        <div className="ab-team__copy [display:flex] [flex-direction:column] [gap:1.6rem] [min-width:0]">
          <Eyebrow>/ Your account team</Eyebrow>
          <SplitWords className="h-56 [font-weight:500] [font-size:5.6rem] [line-height:1.08] [letter-spacing:-0.12rem] [color:var(--ink-2)] [text-wrap:balance] [@media(max-width:_1279px)]:[font-size:3.8rem] [@media(max-width:_640px)]:[font-size:3.4rem]" lines={['Six roles.', 'One team on your side.']} stagger={0.04} />
          <Reveal as="p" className="ab-team__p [font-size:1.8rem] [line-height:1.6] [color:#4a4f63] [max-width:56rem]">You don’t get a ticket queue. You get named people, each owning one part of your revenue cycle, all reporting to the account lead who knows your practice.</Reveal>
          <AnimatePresence mode="wait">
            <motion.div key={on} className="ab-team__card [display:flex] [gap:1.6rem] [align-items:flex-start] [margin-top:1.6rem] [padding:2.4rem] [border-radius:2.4rem] [background:rgba(255,_255,_255,_0.8)] [border:1px_solid_#fff] [box-shadow:0_1.6rem_4rem_rgba(80,_50,_200,_0.08)] [min-height:15rem] [&_small]:[font-family:var(--f-mono)] [&_small]:[font-size:1.2rem] [&_small]:[letter-spacing:0.05em] [&_small]:[text-transform:uppercase] [&_small]:[color:var(--purple)] [&_b]:[display:block] [&_b]:[margin-top:0.4rem] [&_b]:[font-weight:500] [&_b]:[font-size:2.2rem] [&_b]:[color:var(--ink-2)] [&_p]:[margin-top:0.6rem] [&_p]:[font-size:1.5rem] [&_p]:[line-height:1.6] [&_p]:[color:#5b5f72]" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4, ease: ease.out }}>
              <span className="ab-team__ic [flex:none] [width:4.8rem] [height:4.8rem] [border-radius:1.4rem] [display:grid] [place-items:center] [background:var(--purple)] [color:#fff]"><Icon size={22} /></span>
              <div><small>{cur.line}</small><b>{cur.role}</b><p>{cur.body}</p></div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="ab-orbit [position:relative] [width:100%] [max-width:56rem] [aspect-ratio:1] [justify-self:center]" onMouseLeave={() => setHold(false)}>
          <svg className="ab-orbit__rings [position:absolute] [inset:0] [width:100%] [height:100%] [&_circle]:[fill:none] [&_circle]:[stroke:rgba(106,_65,_249,_0.18)] [&_circle]:[stroke-width:1] [&_circle]:[stroke-dasharray:3_5] [&_line]:[stroke:rgba(106,_65,_249,_0.1)] [&_line]:[stroke-width:1] [&_line]:[transition:stroke_0.4s,_stroke-width_0.4s]" viewBox="0 0 400 400" aria-hidden>
            <circle cx="200" cy="200" r="150" /><circle cx="200" cy="200" r="98" className="is-inner [.ab-orbit\_\_rings_circle&]:[stroke-dasharray:none] [.ab-orbit\_\_rings_circle&]:[fill:rgba(255,_255,_255,_0.5)] [.ab-orbit\_\_rings_circle&]:[stroke:rgba(106,_65,_249,_0.12)]" />
            {TEAM.map((_, i) => {
              const a = (i / TEAM.length) * Math.PI * 2 - Math.PI / 2;
              return <line key={i} x1="200" y1="200" x2={200 + 150 * Math.cos(a)} y2={200 + 150 * Math.sin(a)} className={i === on ? String.raw`is-on [.assess\_\_steps_span&]:[color:var(--navy)] [.assess\_\_steps_span&_b]:[background:var(--purple)] [.assess\_\_steps_span&_b]:[border-color:var(--purple)] [.assess\_\_steps_span&_b]:[color:#fff] [.assess\_\_steps_i&::after]:[transform:scaleX(1)] [.cx-read\_\_n_i&]:[width:2.4rem] [.cx-read\_\_n_i&]:[background:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [.sg\_\_toc_button&]:[color:var(--purple)] [.sg\_\_toc_button&]:[border-left-color:var(--purple)] [.pg\_\_toc_button&]:[color:#fff] [.pg\_\_toc_button&_small]:[color:rgba(255,_255,_255,_0.7)] [.pg\_\_dots_i&]:[width:2.4rem] [.pg\_\_dots_i&]:[background:var(--purple)] [.stfd\_\_tabs_button&]:[color:#fff] [.se\_\_dots_i&]:[width:6.4rem] [.sw-anes\_\_bar_i&]:[background:var(--grad)] [.sw-body_circle&]:[fill:var(--purple)] [.sw-vial\_\_body_i&]:[background:var(--grad)] [.sw-vial\_\_body_i&_small]:[color:#fff] [.sw-wound\_\_grid_i&]:[background:#c9b8ff] [.sw-wound\_\_grid_i&]:[border-color:transparent] [.sw-cal_i&]:[background:var(--purple)] [.sw-cal_i&]:[color:#fff] [.sw-wells_i&]:[background:#e2d9ff] [.sw-wells_i&]:[border-color:#c9b8ff] [.sw-shot_i&]:[background:var(--purple)] [.sw-shot_i&]:[border-color:var(--purple)] [.lf\_\_seg_button&]:[color:#fff] [.tc\_\_why_li&]:[opacity:1] [.sl\_\_tabs_button&]:[color:#fff] [.ar\_\_toc_a&]:[color:var(--ink-2)] [.ct-needs_button&]:[color:#fff] [.wa\_\_zones_li&]:[background:var(--grad)] [.wa\_\_zones_li&]:[border-color:transparent] [.wa\_\_zones_li&_small]:[color:#fff] [.wa\_\_zones_li&_b]:[color:#fff] [.wa\_\_zones_li&_em]:[color:#fff] [.se\_\_dots_i&]:[background:var(--purple)] [.ct-needs_button&]:[background:var(--grad)] [.ct-needs_button&]:[border-color:transparent] [.sc-cal_i&]:[background:var(--purple)] [.sc-cal_i&]:[color:#fff] [.ccp_button&]:[background:var(--purple)] [.ccp_button&]:[color:#fff] [.pa-art\_\_seg_button&]:[background:var(--grad)] [.pa-art\_\_seg_button&]:[color:#fff] [.pa-art\_\_steps_li&]:[background:var(--purple)] [.pa-art\_\_steps_li&]:[border-color:var(--purple)] [.pa-art\_\_steps_li&]:[color:#fff] [.ab-orbit\_\_rings_line&]:[stroke:var(--purple)] [.ab-orbit\_\_rings_line&]:[stroke-width:2]` : ''} />;
            })}
          </svg>
          <div className="ab-orbit__core [position:absolute] [left:50%] [top:50%] [translate:-50%_-50%] [width:30%] [aspect-ratio:1] [border-radius:50%] [display:flex] [flex-direction:column] [align-items:center] [justify-content:center] [gap:0.6rem] [background:linear-gradient(150deg,_#7a55ff,_var(--purple)_55%,_#5430e6)] [color:#fff] [box-shadow:0_2rem_5rem_rgba(106,_65,_249,_0.35),_0_0_0_1rem_rgba(106,_65,_249,_0.08)] [&_b]:[font-weight:500] [&_b]:[font-size:1.6rem] [@media(max-width:_767px)]:[&_b]:[font-size:1.2rem] [@media(max-width:_767px)]:[&_svg]:[width:2rem] [@media(max-width:_767px)]:[&_svg]:[height:2rem]"><Building2 size={26} /><b>Your practice</b></div>
          {TEAM.map((m, i) => {
            const a = (i / TEAM.length) * Math.PI * 2 - Math.PI / 2;
            const I = m.icon;
            return (
              <button key={m.role} type="button" className={String.raw`ab-orbit__node [position:absolute] [translate:-50%_-50%] [display:flex] [flex-direction:column] [align-items:center] [gap:0.8rem] [border:0] [background:none] [cursor:pointer] [&_span]:[width:6.4rem] [&_span]:[height:6.4rem] [&_span]:[border-radius:50%] [&_span]:[display:grid] [&_span]:[place-items:center] [&_span]:[background:#fff] [&_span]:[color:var(--purple)] [&_span]:[border:1px_solid_#e6dfff] [&_span]:[box-shadow:0_1rem_2.4rem_rgba(80,_50,_200,_0.1)] [&_span]:[transition:background_0.4s,_color_0.4s,_transform_0.5s_cubic-bezier(.16,1,.3,1),_box-shadow_0.4s] [&_small]:[font-size:1.3rem] [&_small]:[font-weight:500] [&_small]:[color:#5b5f72] [&_small]:[white-space:nowrap] [&_small]:[transition:color_0.4s] [&.is-on_span]:[background:var(--purple)] [&.is-on_span]:[color:#fff] [&.is-on_span]:[transform:scale(1.12)] [&.is-on_span]:[box-shadow:0_1.4rem_3.2rem_rgba(106,_65,_249,_0.35)] [&.is-on_small]:[color:var(--purple)] [&:focus-visible_span]:[outline:2px_solid_var(--purple)] [&:focus-visible_span]:[outline-offset:3px]! [@media(max-width:_767px)]:[&_span]:[width:4.8rem] [@media(max-width:_767px)]:[&_span]:[height:4.8rem] [@media(max-width:_767px)]:[&_small]:[font-size:1.1rem] ${i === on ? String.raw`is-on [.assess\_\_steps_span&]:[color:var(--navy)] [.assess\_\_steps_span&_b]:[background:var(--purple)] [.assess\_\_steps_span&_b]:[border-color:var(--purple)] [.assess\_\_steps_span&_b]:[color:#fff] [.assess\_\_steps_i&::after]:[transform:scaleX(1)] [.cx-read\_\_n_i&]:[width:2.4rem] [.cx-read\_\_n_i&]:[background:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [.sg\_\_toc_button&]:[color:var(--purple)] [.sg\_\_toc_button&]:[border-left-color:var(--purple)] [.pg\_\_toc_button&]:[color:#fff] [.pg\_\_toc_button&_small]:[color:rgba(255,_255,_255,_0.7)] [.pg\_\_dots_i&]:[width:2.4rem] [.pg\_\_dots_i&]:[background:var(--purple)] [.stfd\_\_tabs_button&]:[color:#fff] [.se\_\_dots_i&]:[width:6.4rem] [.sw-anes\_\_bar_i&]:[background:var(--grad)] [.sw-body_circle&]:[fill:var(--purple)] [.sw-vial\_\_body_i&]:[background:var(--grad)] [.sw-vial\_\_body_i&_small]:[color:#fff] [.sw-wound\_\_grid_i&]:[background:#c9b8ff] [.sw-wound\_\_grid_i&]:[border-color:transparent] [.sw-cal_i&]:[background:var(--purple)] [.sw-cal_i&]:[color:#fff] [.sw-wells_i&]:[background:#e2d9ff] [.sw-wells_i&]:[border-color:#c9b8ff] [.sw-shot_i&]:[background:var(--purple)] [.sw-shot_i&]:[border-color:var(--purple)] [.lf\_\_seg_button&]:[color:#fff] [.tc\_\_why_li&]:[opacity:1] [.sl\_\_tabs_button&]:[color:#fff] [.ar\_\_toc_a&]:[color:var(--ink-2)] [.ct-needs_button&]:[color:#fff] [.wa\_\_zones_li&]:[background:var(--grad)] [.wa\_\_zones_li&]:[border-color:transparent] [.wa\_\_zones_li&_small]:[color:#fff] [.wa\_\_zones_li&_b]:[color:#fff] [.wa\_\_zones_li&_em]:[color:#fff] [.se\_\_dots_i&]:[background:var(--purple)] [.ct-needs_button&]:[background:var(--grad)] [.ct-needs_button&]:[border-color:transparent] [.sc-cal_i&]:[background:var(--purple)] [.sc-cal_i&]:[color:#fff] [.ccp_button&]:[background:var(--purple)] [.ccp_button&]:[color:#fff] [.pa-art\_\_seg_button&]:[background:var(--grad)] [.pa-art\_\_seg_button&]:[color:#fff] [.pa-art\_\_steps_li&]:[background:var(--purple)] [.pa-art\_\_steps_li&]:[border-color:var(--purple)] [.pa-art\_\_steps_li&]:[color:#fff] [.ab-orbit\_\_rings_line&]:[stroke:var(--purple)] [.ab-orbit\_\_rings_line&]:[stroke-width:2]` : ''}`}
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
    <section className="ab-num container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [padding-top:14rem] [@media(max-width:_767px)]:[padding-top:8rem]">
      <div className="ab-num__grid [display:grid] [grid-template-columns:repeat(6,_minmax(0,_1fr))] [border-top:1px_solid_#ece8fa] [border-bottom:1px_solid_#ece8fa] [@media(max-width:_1279px)]:[grid-template-columns:repeat(3,_minmax(0,_1fr))] [@media(max-width:_767px)]:[grid-template-columns:repeat(2,_minmax(0,_1fr))]">
        {NUMS.map((x, i) => (
          <motion.div key={x.k} className="ab-num__cell [padding:4rem_2.4rem] [border-left:1px_solid_#ece8fa] [&:first-child]:[border-left:0] [&:first-child]:[padding-left:0] [&_small]:[display:block] [&_small]:[margin-top:1.2rem] [&_small]:[font-size:1.5rem] [&_small]:[line-height:1.4] [&_small]:[color:#6b6f7c] [@media(max-width:_1279px)]:[&:nth-child(4)]:[border-left:0] [@media(max-width:_1279px)]:[&:nth-child(4)]:[padding-left:0] [@media(max-width:_1279px)]:[&:nth-child(n+4)]:[border-top:1px_solid_#ece8fa] [@media(max-width:_767px)]:[padding:2.8rem_1.6rem] [@media(max-width:_767px)]:[border-left:1px_solid_#ece8fa]! [@media(max-width:_767px)]:[padding-left:1.6rem]! [@media(max-width:_767px)]:[border-top:1px_solid_#ece8fa] [@media(max-width:_767px)]:[&:nth-child(odd)]:[border-left:0]! [@media(max-width:_767px)]:[&:nth-child(odd)]:[padding-left:0]! [@media(max-width:_767px)]:[&:nth-child(-n+2)]:[border-top:0]" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 0.7, ease: ease.out, delay: i * 0.06 }}>
            <CountUp className="ab-num__v [display:block] [font-family:var(--f-jak)] [font-weight:500] [font-size:5.6rem] [line-height:1] [letter-spacing:-0.2rem] [color:var(--ink-2)] [@media(max-width:_767px)]:[font-size:4rem]" value={x.v} prefix={x.pre} suffix={x.suf} duration={1.6} />
            <small>{x.k}</small>
          </motion.div>
        ))}
      </div>
      <p className="ab-num__fine [@media(max-width:_1279px)]:[font-size:13.5px]! [@media(max-width:_1279px)]:[line-height:1.55] [margin-top:1.2rem] [font-size:1.2rem] [color:#a0a3b1]">Averages across active client accounts. {CONFIRM}</p>
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
    <svg className="ab-tx [display:block] [width:100%] [height:auto] [overflow:visible]" viewBox={view.box} aria-hidden>
      <motion.path d={tx.d} className="ab-tx__s [fill:rgba(255,_255,_255,_0.75)] [stroke:var(--purple)] [stroke-width:1.5] [vector-effect:non-scaling-stroke] [stroke-linejoin:round]" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={vp} transition={{ duration: 2, ease: ease.inOut }} />
      <circle cx={view.px} cy={view.py} r={view.u * 6} className="ab-tx__pulse [fill:rgba(106,_65,_249,_0.25)] [transform-box:fill-box] [transform-origin:center] [animation:abpulse_2.4s_ease-out_infinite] [@media(prefers-reduced-motion:_reduce)]:[animation:none]" />
      <circle cx={view.px} cy={view.py} r={view.u * 2.2} className="ab-tx__pin [fill:var(--purple)] [stroke:#fff] [stroke-width:2] [vector-effect:non-scaling-stroke]" />
    </svg>
  );
}

function Where() {
  return (
    <section className="ab-where container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [padding-top:16rem] [display:grid] [grid-template-columns:minmax(0,_0.9fr)_minmax(0,_1.1fr)] [gap:6.4rem] [align-items:center] [@media(max-width:_1279px)]:[padding-top:10rem] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1279px)]:[gap:4rem] [@media(max-width:_767px)]:[padding-top:8rem]">
      <div className="ab-where__map [position:relative] [padding:4.8rem] [border-radius:3.2rem] [background:var(--soft-grain),_var(--soft-bg)] [border:1px_solid_#ebe5ff] [min-width:0] [@media(max-width:_767px)]:[padding:2.4rem_2.4rem_6.4rem]">
        <TexasPin />
        <span className="ab-where__tag [position:absolute] [left:50%] [bottom:2.4rem] [translate:-50%_0] [display:inline-flex] [align-items:center] [gap:0.6rem] [padding:0.8rem_1.4rem] [border-radius:3rem] [background:#fff] [box-shadow:0_1rem_2.4rem_rgba(80,_50,_200,_0.12)] [font-size:1.4rem] [font-weight:500] [color:var(--ink-2)] [white-space:nowrap] [&_svg]:[color:var(--purple)]"><MapPin size={14} /> Plano, Texas</span>
      </div>
      <div className="ab-where__copy [display:flex] [flex-direction:column] [gap:1.6rem] [min-width:0]">
        <Eyebrow>/ Where we work</Eyebrow>
        <SplitWords className="h-56 [font-weight:500] [font-size:5.6rem] [line-height:1.08] [letter-spacing:-0.12rem] [color:var(--ink-2)] [text-wrap:balance] [@media(max-width:_1279px)]:[font-size:3.8rem] [@media(max-width:_640px)]:[font-size:3.4rem]" lines={['Based in Texas.', 'Billing across the US.']} stagger={0.04} />
        <Reveal as="p" className="ab-where__p [font-size:1.8rem] [line-height:1.6] [color:#4a4f63]">Our team works from Plano and across the US, inside each client’s own EHR, practice management system and payer portals. No offshore handoffs, and someone who answers in your time zone.</Reveal>
        <ul className="ab-where__facts [@media(max-width:_1279px)]:[font-size:16px]! [@media(max-width:_1279px)]:[line-height:1.6] [list-style:none] [padding:0] [margin:1.2rem_0_0] [display:flex] [flex-direction:column] [&_li]:[display:flex] [&_li]:[gap:1.4rem] [&_li]:[align-items:flex-start] [&_li]:[padding:1.6rem_0] [&_li]:[border-bottom:1px_solid_#f0edf9] [&_li]:[font-size:1.6rem] [&_li]:[line-height:1.5] [&_li]:[color:#4a4f63] [&_svg]:[flex:none] [&_svg]:[margin-top:0.2rem] [&_svg]:[color:var(--purple)] [&_b]:[display:block] [&_b]:[font-weight:500] [&_b]:[color:var(--ink-2)] [&_a]:[color:var(--purple)] [&_a]:[font-weight:500]">
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
    <section className="ab-car container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [padding-top:12rem] [@media(max-width:_767px)]:[padding-top:8rem]">
      <motion.div className="ab-car__band [display:flex] [justify-content:space-between] [align-items:center] [gap:3.2rem] [padding:4rem_4.8rem] [border-radius:3.2rem] [background:var(--ink-2,_#192533)] [color:#fff] [&_small]:[font-family:var(--f-mono)] [&_small]:[font-size:1.3rem] [&_small]:[letter-spacing:0.06em] [&_small]:[text-transform:uppercase] [&_small]:[color:#b9a8ff] [&_p]:[margin-top:0.8rem] [&_p]:[font-family:var(--f-jak)] [&_p]:[font-weight:500] [&_p]:[font-size:2.8rem] [&_p]:[line-height:1.3] [&_p]:[letter-spacing:-0.06rem] [&_p]:[max-width:72rem] [@media(max-width:_767px)]:[flex-direction:column] [@media(max-width:_767px)]:[align-items:flex-start] [@media(max-width:_767px)]:[padding:3.2rem_2.4rem] [@media(max-width:_767px)]:[&_p]:[font-size:2.2rem]" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 0.9, ease: ease.out }}>
        <div>
          <small>/ Careers</small>
          <p>Good at getting claims paid? We’re hiring coders, billers and A/R specialists.</p>
        </div>
        <Link to="/careers" className="ab-car__go [flex:none] [display:inline-flex] [align-items:center] [gap:0.8rem] [height:5.6rem] [padding-inline:2.8rem] [border-radius:3rem] [background:#fff] [color:var(--ink-2)] [font-weight:500] [font-size:1.8rem] [transition:background_0.3s,_color_0.3s] [&:hover]:[background:var(--purple)] [&:hover]:[color:#fff] [@media(max-width:_767px)]:[align-self:stretch] [@media(max-width:_767px)]:[justify-content:center]">See open roles <ArrowUpRight size={18} /></Link>
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
    <main className="page [overflow-x:clip] [@media(max-width:_640px)]:[&:has(.mbar)]:[padding-bottom:7.2rem]">
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
