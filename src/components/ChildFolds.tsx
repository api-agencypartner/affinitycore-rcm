import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight, CalendarCheck, FileSearch, Send, Wallet, ShieldCheck, BarChart3, Phone, Users, BadgeCheck, KeyRound, LineChart, GitMerge } from 'lucide-react';
import { Button, Eyebrow, Reveal, SplitWords } from './ui';
import { SPECIALTIES } from '../data/specialties';
import hipaa from '../assets/hipaa-badge.png';
import { Link } from '../router';
import { ease, vp } from '../motion';
import type { SpecialtyFull } from '../data/specialties';
import { ARTICLES, type Article } from '../data/insights';
import { Card } from '../pages/Blog';
import { Platforms } from '../sections/Platforms';

/* ================================================================== */
/* What's included: the whole cycle, written for this specialty       */
/* ================================================================== */
/** "cardiology", but acronyms stay as they are ("GI", "OB/GYN", "ASC") */
const plain = (s: SpecialtyFull) => (s.short && /^[A-Z/]+$/.test(s.short) ? s.short : s.name.toLowerCase());

type Item = { name: string; note: string; to: string; icon: JSX.Element };

function itemsFor(s: SpecialtyFull): { phase: string; when: string; items: Item[] }[] {
  const plainShort = plain(s);
  const codes = s.ledger.rows.slice(0, 3).map((r) => r.code).join(', ');
  const leak = s.leak?.leaks.find((l) => /auth|approval/i.test(l.label));
  return [
    { phase: 'Before the visit', when: '01', items: [
      { name: 'Eligibility and benefits', note: 'Coverage, copays and deductibles checked before the patient arrives.', to: '/services/revenue-cycle-management', icon: <CalendarCheck /> },
      { name: 'Prior authorizations', note: s.auth || leak ? 'Requested before scheduling and tracked against each payer’s deadline.' : 'Checked for every service that needs one, before it’s scheduled.', to: '/services/revenue-cycle-management', icon: <ShieldCheck /> },
      { name: 'Credentialing', note: 'New providers enrolled with every payer you bill, before their first visit.', to: '/services/credentialing', icon: <FileSearch /> },
    ] },
    { phase: 'After the visit', when: '02', items: [
      { name: 'Medical coding', note: `Certified coders who know ${plainShort} codes like ${codes}.`, to: '/services/medical-coding', icon: <FileSearch /> },
      { name: 'Charge entry', note: 'Every service on the encounter becomes a claim line, same day.', to: '/services/charge-entry', icon: <Send /> },
      { name: 'Claim submission', note: `Scrubbed against ${plainShort} payer rules, then sent the same day.`, to: '/services/medical-billing', icon: <Send /> },
    ] },
    { phase: 'After the claim', when: '03', items: [
      { name: 'Payment posting', note: 'Remits matched line by line; underpayments flagged.', to: '/services/payment-posting', icon: <Wallet /> },
      { name: 'Denials and appeals', note: 'Worked by reason code and appealed before the deadline.', to: '/services/denial-management', icon: <ShieldCheck /> },
      { name: 'A/R follow-up', note: 'Aged claims chased until they pay or close.', to: '/services/ar-recovery', icon: <Wallet /> },
      { name: 'Monthly reporting', note: 'Denial rate, days in A/R and collections, with what we fixed.', to: '/services/revenue-cycle-management', icon: <BarChart3 /> },
    ] },
  ];
}

export function Included({ s }: { s: SpecialtyFull }) {
  const cols = itemsFor(s);
  return (
    <section className="inc container">
      <div className="inc__head">
        <div>
          <Eyebrow>/ What’s included</Eyebrow>
          <SplitWords className="h-56" lines={['Every step of the cycle,', `run for ${plain(s)}.`]} stagger={0.04} />
        </div>
        <Reveal as="p" className="inc__intro">One accountable team handles the whole revenue cycle, or just the parts you hand over. Every step below is done by people who bill {plain(s)} every day.</Reveal>
      </div>
      <div className="inc__cols">
        {cols.map((c, ci) => (
          <motion.div key={c.phase} className="inc__col" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 0.8, ease: ease.out, delay: ci * 0.1 }}>
            <p className="inc__phase"><span>{c.when}</span>{c.phase}</p>
            <ul>
              {c.items.map((it) => (
                <li key={it.name}>
                  <Link to={it.to} className="inc__item">
                    <span className="inc__ic" aria-hidden>{it.icon}</span>
                    <span className="inc__t"><b>{it.name}</b><small>{it.note}</small></span>
                    <ArrowUpRight className="inc__go" size={18} aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
      <Link to="/services/revenue-cycle-management" className="text-link inc__all">See full revenue cycle management <ArrowRight size={18} /></Link>
    </section>
  );
}

/* ================================================================== */
/* EHR strip                                                          */
/* ================================================================== */
/** Same fold as the homepage "Platforms we work with", worded for the page. */
export function EhrStrip({ what }: { what: string }) {
  return (
    <Platforms copy={`No new software for your staff to learn. We bill ${what} directly in your EHR and practice management system, plus your clearinghouse and payer portals, and map access with you before anything changes.`} />
  );
}

/* ================================================================== */
/* Guides for this specialty (replaces the case-study fold here)      */
/* ================================================================== */
function pick(s: SpecialtyFull): Article[] {
  const codes = new Set(s.ledger.rows.map((r) => r.code));
  const name = s.name.toLowerCase();
  const behavioral = /mental|psychiatry/.test(s.slug);
  const score = (a: Article) => {
    const text = `${a.title} ${a.dek}`.toLowerCase();
    let v = 0;
    if (text.includes(name) || (s.short && text.includes(s.short.toLowerCase()))) v += 6;
    const c = a.cover as { code?: string } | undefined;
    if (c?.code && codes.has(c.code)) v += 5;
    if ((s.auth || s.leak?.leaks.some((l) => /auth|approval/i.test(l.label))) && a.topic === 'Prior auth') v += 3;
    if (behavioral && /telehealth|90837/i.test(text + (c?.code ?? ''))) v += 4;
    if (a.topic === 'Denials' || a.topic === 'Coding') v += 1;
    if (a.body) v += 10; // published articles first
    return v;
  };
  return [...ARTICLES].sort((a, b) => score(b) - score(a)).slice(0, 3);
}

export function SpecialtyReads({ s }: { s: SpecialtyFull }) {
  const list = pick(s);
  return (
    <section className="cs container sr">
      <div className="cs__head">
        <div><Eyebrow>{`/ Guides for ${plain(s)} practices`}</Eyebrow><SplitWords className="h-56" lines={['Read before', 'your next claim run.']} stagger={0.04} /></div>
        <Link to="/blog" className="text-link">All articles <ArrowRight size={18} /></Link>
      </div>
      <div className="bl__grid sr__grid">{list.map((a, k) => <Card key={a.slug} a={a} k={k} />)}</div>
    </section>
  );
}

/* ================================================================== */
/* Trust row under every child-page hero CTA                          */
/* ================================================================== */
export function TrustRow() {
  return (
    <motion.ul className="tr" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: ease.out, delay: 1.05 }} aria-label="Why practices trust us">
      <li><img src={hipaa} alt="" /> <span><b>HIPAA compliant</b><small>BAA with every client</small></span></li>
      <li><Users /> <span><b>30+ US-based</b><small>billers and coders</small></span></li>
      <li><BadgeCheck /> <span><b>Certified coders</b><small>CPC, CCS and specialty credentials</small></span></li>
    </motion.ul>
  );
}

/* ================================================================== */
/* Mid-page CTA band, at the moment interest peaks                    */
/* ================================================================== */
export function MidCta({ title, body }: { title: string; body: string }) {
  return (
    <section className="mc container">
      <motion.div className="mc__band" initial={{ opacity: 0, y: 30, scale: 0.98 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={vp} transition={{ duration: 0.9, ease: ease.out }}>
        <div className="mc__copy">
          <p className="mc__h">{title}</p>
          <p className="mc__p">{body}</p>
        </div>
        <div className="mc__act">
          <Button>Get a free revenue assessment</Button>
          <a className="mc__call" href="tel:+12148512698"><Phone size={18} /> 214-851-2698</a>
        </div>
      </motion.div>
    </section>
  );
}

/* ================================================================== */
/* Switching in 30 days: the objection nobody answered                 */
/* ================================================================== */
const STEPS: { when: string; title: string; body: string; you: string; icon: JSX.Element }[] = [
  { when: 'Week 1', title: 'Access and BAA', body: 'We sign a business associate agreement and get access to your EHR, practice management system and clearinghouse.', you: 'Logins and one 30-minute kickoff call', icon: <KeyRound /> },
  { when: 'Week 2', title: 'Baseline', body: 'We pull 90 days of claims, denials and A/R aging, and map your payers, fee schedules and workflows.', you: 'Nothing. Your team keeps billing as usual', icon: <LineChart /> },
  { when: 'Week 3', title: 'Handover, no gap', body: 'We take over new claims while your team finishes what’s already in flight, so nothing is dropped and cash keeps coming in.', you: 'A short handover with your billing lead', icon: <GitMerge /> },
  { when: 'Day 30', title: 'First report', body: 'Your first monthly report: denial rate, days in A/R and clean claim rate against the baseline, and what we fixed.', you: 'A 30-minute review call', icon: <BarChart3 /> },
];

export function Switching({ what }: { what: string }) {
  return (
    <section className="swt container">
      <div className="swt__head">
        <div>
          <Eyebrow>/ What switching takes</Eyebrow>
          <SplitWords className="h-56" lines={['Live in 30 days,', 'with no gap in cash flow.']} stagger={0.04} />
        </div>
        <Reveal as="p" className="swt__intro">{`Moving ${what} to a new team is the part practices worry about most. Here’s exactly what happens, and how little it asks of your staff.`}</Reveal>
      </div>
      <ol className="swt__steps">
        <motion.span className="swt__line" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={vp} transition={{ duration: 1.6, ease: ease.inOut }} aria-hidden />
        {STEPS.map((st, i) => (
          <motion.li key={st.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 0.7, ease: ease.out, delay: 0.2 + i * 0.15 }}>
            <span className="swt__dot" aria-hidden>{st.icon}</span>
            <small className="swt__when">{st.when}</small>
            <b>{st.title}</b>
            <p>{st.body}</p>
            <p className="swt__you"><em>From you:</em> {st.you}</p>
          </motion.li>
        ))}
      </ol>
      <p className="swt__note">Typical timeline; your onboarding plan confirms the dates. [Confirm with Affinity Core]</p>
    </section>
  );
}

/* ================================================================== */
/* Service pages: which specialties this service is run for            */
/* ================================================================== */
export function SpecialtyChips({ service }: { service: string }) {
  const list = SPECIALTIES.filter((x) => x.page);
  return (
    <section className="spc container">
      <div className="spc__head">
        <Eyebrow>/ Specialties we do this for</Eyebrow>
        <p className="spc__h">{`${service}, run by people who know your specialty’s rules.`}</p>
      </div>
      <motion.ul className="spc__chips" initial="h" whileInView="s" viewport={vp} variants={{ h: {}, s: { transition: { staggerChildren: 0.025 } } }}>
        {list.map((x) => (
          <motion.li key={x.slug} variants={{ h: { opacity: 0, y: 10 }, s: { opacity: 1, y: 0, transition: { duration: 0.5, ease: ease.out } } }}>
            <Link to={`/specialties/${x.slug}`}>{x.name} <ArrowUpRight size={14} /></Link>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
