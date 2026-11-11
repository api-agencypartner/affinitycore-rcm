import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight, CalendarCheck, FileSearch, Send, Wallet, ShieldCheck, BarChart3, Phone, Users, BadgeCheck, KeyRound, LineChart, GitMerge } from 'lucide-react';
import { Button, Eyebrow, Reveal, SplitWords } from './ui';
import { SPECIALTIES } from '../data/specialties';
import hipaa from '../assets/hipaa-badge.png';
import { Link } from '../router';
import { ease, vp } from '../motion';
import type { SpecialtyFull } from '../data/specialties';
import { ARTICLES, type Article } from '../data/insights';
import { Card } from '../views/Blog';
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
    <section className="inc container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [padding-top:14rem]">
      <div className="inc__head [display:grid] [grid-template-columns:minmax(0,_1fr)_minmax(0,_1fr)] [gap:6rem] [align-items:end] [&>div:first-child]:[display:flex] [&>div:first-child]:[flex-direction:column] [&>div:first-child]:[gap:1.6rem] [@media(max-width:_1024px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1024px)]:[gap:2rem]">
        <div>
          <Eyebrow>/ What’s included</Eyebrow>
          <SplitWords className="h-56 [font-weight:500] [font-size:5.6rem] [line-height:1.08] [letter-spacing:-0.12rem] [color:var(--ink-2)] [text-wrap:balance] [@media(max-width:_1279px)]:[font-size:3.8rem] [@media(max-width:_640px)]:[font-size:3.4rem]" lines={['Every step of the cycle,', `run for ${plain(s)}.`]} stagger={0.04} />
        </div>
        <Reveal as="p" className="inc__intro [font-size:1.8rem] [line-height:1.6] [color:#5b5f72] [max-width:56rem] [margin-bottom:-0.4rem]">One accountable team handles the whole revenue cycle, or just the parts you hand over. Every step below is done by people who bill {plain(s)} every day.</Reveal>
      </div>
      <div className="inc__cols [display:grid] [grid-template-columns:repeat(3,_minmax(0,_1fr))] [gap:2.4rem] [margin-top:5.6rem] [@media(max-width:_1024px)]:[grid-template-columns:minmax(0,_1fr)]">
        {cols.map((c, ci) => (
          <motion.div key={c.phase} className="inc__col [padding:2.8rem_2.4rem_2rem] [border-radius:3.2rem] [background:linear-gradient(165deg,_#f4f0ff_0%,_#fbfaff_60%,_#fff_100%)] [border:1px_solid_var(--lav-border)] [&_ul]:[list-style:none] [&_ul]:[display:flex] [&_ul]:[flex-direction:column] [&_li+li]:[border-top:1px_solid_#ebe5fd]" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 0.8, ease: ease.out, delay: ci * 0.1 }}>
            <p className="inc__phase [display:flex] [align-items:center] [gap:1.2rem] [font-family:var(--f-mono)] [font-size:1.3rem] [letter-spacing:0.08em] [text-transform:uppercase] [color:var(--purple)] [margin-bottom:1.6rem] [&_span]:[width:3.2rem] [&_span]:[height:3.2rem] [&_span]:[border-radius:50%] [&_span]:[display:grid] [&_span]:[place-items:center] [&_span]:[background:var(--grad)] [&_span]:[color:#fff] [&_span]:[letter-spacing:0] [&_span]:[font-size:1.2rem]"><span>{c.when}</span>{c.phase}</p>
            <ul>
              {c.items.map((it) => (
                <li key={it.name}>
                  <Link to={it.to} className="inc__item [display:grid] [grid-template-columns:4rem_minmax(0,_1fr)_2rem] [gap:1.4rem] [align-items:start] [padding:1.8rem_0.8rem] [margin:0_-0.8rem] [border-radius:1.6rem] [transition:background_0.3s] [&:hover]:[background:#fff]">
                    <span className="inc__ic [width:4rem] [height:4rem] [border-radius:1.2rem] [display:grid] [place-items:center] [background:#fff] [border:1px_solid_#e6dfff] [color:var(--purple)] [&_svg]:[width:1.9rem] [&_svg]:[height:1.9rem]" aria-hidden>{it.icon}</span>
                    <span className="inc__t [display:flex] [flex-direction:column] [gap:0.4rem] [&_b]:[font-weight:500] [&_b]:[font-size:1.8rem] [&_b]:[color:var(--ink-2)] [&_small]:[font-size:1.45rem] [&_small]:[line-height:1.45] [&_small]:[color:#6b6f7c]"><b>{it.name}</b><small>{it.note}</small></span>
                    <ArrowUpRight className="inc__go [margin-top:0.4rem] [color:#b9a5ff] [transition:transform_0.4s_cubic-bezier(.16,1,.3,1),_color_0.3s] [.inc\_\_item:hover_&]:[color:var(--purple)] [.inc\_\_item:hover_&]:[transform:translate(0.3rem,_-0.3rem)]" size={18} aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
      <Link to="/services/revenue-cycle-management" className="text-link inc__all [display:inline-flex] [align-items:center] [gap:0.8rem] [font-weight:500] [font-size:1.8rem] [color:var(--purple)] [&_svg]:[transition:transform_0.4s_cubic-bezier(.16,1,.3,1)] [&:hover_svg]:[transform:translateX(0.5rem)] [margin-top:3.2rem] [.est\_\_carried_&]:[margin-top:0.6rem] [.est\_\_carried_&]:[font-size:1.5rem] [.est\_\_carried_&]:[color:#fff] [.est\_\_carried_&]:[text-decoration:underline] [.est\_\_carried_&]:[text-underline-offset:0.3em] [.est\_\_carried_&]:[opacity:0.85]">See full revenue cycle management <ArrowRight size={18} /></Link>
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
    <section className="cs container sr [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [padding-top:14rem] [@media(max-width:_1279px)]:[padding-top:10rem]">
      <div className="cs__head [display:flex] [justify-content:space-between] [align-items:flex-end] [gap:2rem] [&>div]:[display:flex] [&>div]:[flex-direction:column] [&>div]:[gap:1.2rem] [@media(max-width:_1279px)]:[flex-direction:column] [@media(max-width:_1279px)]:[align-items:flex-start]">
        <div><Eyebrow>{`/ Guides for ${plain(s)} practices`}</Eyebrow><SplitWords className="h-56 [font-weight:500] [font-size:5.6rem] [line-height:1.08] [letter-spacing:-0.12rem] [color:var(--ink-2)] [text-wrap:balance] [@media(max-width:_1279px)]:[font-size:3.8rem] [@media(max-width:_640px)]:[font-size:3.4rem]" lines={['Read before', 'your next claim run.']} stagger={0.04} /></div>
        <Link to="/blog" className="text-link [display:inline-flex] [align-items:center] [gap:0.8rem] [font-weight:500] [font-size:1.8rem] [color:var(--purple)] [&_svg]:[transition:transform_0.4s_cubic-bezier(.16,1,.3,1)] [&:hover_svg]:[transform:translateX(0.5rem)] [.est\_\_carried_&]:[margin-top:0.6rem] [.est\_\_carried_&]:[font-size:1.5rem] [.est\_\_carried_&]:[color:#fff] [.est\_\_carried_&]:[text-decoration:underline] [.est\_\_carried_&]:[text-underline-offset:0.3em] [.est\_\_carried_&]:[opacity:0.85]">All articles <ArrowRight size={18} /></Link>
      </div>
      <div className="bl__grid sr__grid [@media(max-width:_767px)]:[&:not(.is-all)>:nth-child(n+4)]:[display:none] [.sr_&]:[margin-top:4rem] [display:grid] [grid-template-columns:repeat(3,_minmax(0,_1fr))] [gap:2.4rem] [margin-top:3.2rem] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)]">{list.map((a, k) => <Card key={a.slug} a={a} k={k} />)}</div>
    </section>
  );
}

/* ================================================================== */
/* Trust row under every child-page hero CTA                          */
/* ================================================================== */
export function TrustRow() {
  return (
    <motion.ul className="tr [list-style:none] [display:flex] [flex-wrap:wrap] [margin-top:3.2rem] [padding-top:2.4rem] [border-top:1px_solid_#ece8f8] [&_li]:[display:flex] [&_li]:[align-items:center] [&_img]:[border-radius:50%] [&_img]:[background:#fff] [&_img]:[box-shadow:0_0_0_1px_#ebe7f7] [&_img]:[object-fit:contain] [&_svg]:[border-radius:50%] [&_svg]:[background:#f1ecff] [&_svg]:[color:var(--purple)] [&_span]:[display:flex] [&_span]:[flex-direction:column] [&_span]:[line-height:1.25] [&_b]:[font-weight:500] [&_b]:[color:var(--ink-2)] [&_small]:[color:#7a7e90] [gap:1.5rem_3.5rem] [&_li]:[gap:1.25rem] [&_img]:[width:4.5rem] [&_img]:[height:4.5rem] [&_svg]:[width:4.5rem] [&_svg]:[height:4.5rem] [&_svg]:[padding:1rem] [&_b]:[font-size:1.875rem] [&_small]:[font-size:1.56rem]" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: ease.out, delay: 1.05 }} aria-label="Why practices trust us">
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
    <section className="mc container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [padding-top:10rem] [.eng+&]:[padding-top:4rem]">
      <motion.div className="mc__band [position:relative] [display:flex] [justify-content:space-between] [align-items:center] [gap:4rem] [padding:4rem_4.8rem] [border-radius:3.2rem] [background:var(--grad-x)] [color:#fff] [overflow:hidden] [box-shadow:0_3rem_8rem_-3rem_rgba(80,_40,_220,_0.45)] [&::after]:[content:''] [&::after]:[position:absolute] [&::after]:[right:-10rem] [&::after]:[top:-14rem] [&::after]:[width:40rem] [&::after]:[height:40rem] [&::after]:[border-radius:50%] [&::after]:[background:radial-gradient(circle,_rgba(255,_255,_255,_0.22),_transparent_65%)] [&::after]:[pointer-events:none] [@media(max-width:_1024px)]:[flex-direction:column] [@media(max-width:_1024px)]:[align-items:flex-start] [@media(max-width:_1024px)]:[padding:3.2rem_2.4rem]" initial={{ opacity: 0, y: 30, scale: 0.98 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={vp} transition={{ duration: 0.9, ease: ease.out }}>
        <div className="mc__copy [position:relative] [display:flex] [flex-direction:column] [gap:0.8rem] [max-width:64rem]">
          <p className="mc__h [font-weight:500] [font-size:3.2rem] [line-height:1.15] [letter-spacing:-0.06rem]">{title}</p>
          <p className="mc__p [@media(max-width:_1279px)]:[font-size:16px]! [font-size:1.7rem] [line-height:1.5] [color:rgba(255,_255,_255,_0.85)]">{body}</p>
        </div>
        <div className="mc__act [position:relative] [display:flex] [flex-direction:column] [align-items:flex-end] [gap:1.2rem] [flex:none] [@media(max-width:_1024px)]:[align-items:flex-start] [@media(max-width:_640px)]:[width:100%]">
          <Button>Get a free revenue assessment</Button>
          <a className="mc__call [display:inline-flex] [align-items:center] [gap:0.8rem] [font-size:1.6rem] [color:#fff] [opacity:0.9] [&:hover]:[opacity:1]" href="tel:+12148512698"><Phone size={18} /> 214-851-2698</a>
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
    <section className="swt container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [padding-top:14rem]">
      <div className="swt__head [display:grid] [grid-template-columns:minmax(0,_1fr)_minmax(0,_1fr)] [gap:6rem] [align-items:end] [&>div:first-child]:[display:flex] [&>div:first-child]:[flex-direction:column] [&>div:first-child]:[gap:1.6rem] [@media(max-width:_1024px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1024px)]:[gap:2rem]">
        <div>
          <Eyebrow>/ What switching takes</Eyebrow>
          <SplitWords className="h-56 [font-weight:500] [font-size:5.6rem] [line-height:1.08] [letter-spacing:-0.12rem] [color:var(--ink-2)] [text-wrap:balance] [@media(max-width:_1279px)]:[font-size:3.8rem] [@media(max-width:_640px)]:[font-size:3.4rem]" lines={['Live in 30 days,', 'with no gap in cash flow.']} stagger={0.04} />
        </div>
        <Reveal as="p" className="swt__intro [font-size:1.8rem] [line-height:1.6] [color:#5b5f72] [max-width:56rem] [margin-bottom:-0.4rem]">{`Moving ${what} to a new team is the part practices worry about most. Here’s exactly what happens, and how little it asks of your staff.`}</Reveal>
      </div>
      <ol className="swt__steps [position:relative] [list-style:none] [display:grid] [grid-template-columns:repeat(4,_minmax(0,_1fr))] [gap:2.4rem] [margin-top:5.6rem] [&_li]:[position:relative] [&_li]:[display:flex] [&_li]:[flex-direction:column] [&_li]:[gap:0.8rem] [&_li]:[padding-right:1.2rem] [&_b]:[font-weight:500] [&_b]:[font-size:2.2rem] [&_b]:[color:var(--ink-2)] [&_p]:[font-size:1.55rem] [&_p]:[line-height:1.55] [&_p]:[color:#5b5f72] [@media(max-width:_1024px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1024px)]:[gap:3.2rem]">
        <motion.span className="swt__line [position:absolute] [left:2.8rem] [right:2.8rem] [top:2.8rem] [height:2px] [background:linear-gradient(90deg,_#d6cdf7,_var(--purple))] [transform-origin:left] [@media(max-width:_1024px)]:[display:none]" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={vp} transition={{ duration: 1.6, ease: ease.inOut }} aria-hidden />
        {STEPS.map((st, i) => (
          <motion.li key={st.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 0.7, ease: ease.out, delay: 0.2 + i * 0.15 }}>
            <span className="swt__dot [width:5.6rem] [height:5.6rem] [border-radius:50%] [display:grid] [place-items:center] [background:#fff] [border:2px_solid_var(--purple)] [color:var(--purple)] [margin-bottom:1.6rem] [position:relative] [&_svg]:[width:2.2rem] [&_svg]:[height:2.2rem] [.swt\_\_steps_li:last-child_&]:[background:var(--grad)] [.swt\_\_steps_li:last-child_&]:[color:#fff] [.swt\_\_steps_li:last-child_&]:[border-color:transparent]" aria-hidden>{st.icon}</span>
            <small className="swt__when [font-family:var(--f-mono)] [font-size:1.2rem] [letter-spacing:0.08em] [text-transform:uppercase] [color:var(--purple)]">{st.when}</small>
            <b>{st.title}</b>
            <p>{st.body}</p>
            <p className="swt__you [@media(max-width:_1279px)]:[line-height:1.6] [margin-top:0.4rem] [padding:1rem_1.2rem] [border-radius:1.2rem] [background:#f7f4ff] [font-size:1.4rem]! [color:#4a4f63]! [&_em]:[font-style:normal] [&_em]:[font-weight:600] [&_em]:[color:var(--purple)]"><em>From you:</em> {st.you}</p>
          </motion.li>
        ))}
      </ol>
      <p className="swt__note [@media(max-width:_1279px)]:[font-size:13.5px]! [@media(max-width:_1279px)]:[line-height:1.55] [margin-top:2.4rem] [font-size:1.3rem] [color:#8a8ea0]">Typical timeline; your onboarding plan confirms the dates. [Confirm with Affinity Core]</p>
    </section>
  );
}

/* ================================================================== */
/* Service pages: which specialties this service is run for            */
/* ================================================================== */
export function SpecialtyChips({ service }: { service: string }) {
  const list = SPECIALTIES.filter((x) => x.page);
  return (
    <section className="spc container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [padding-top:10rem]">
      <div className="spc__head [display:flex] [flex-direction:column] [gap:1.2rem]">
        <Eyebrow>/ Specialties we do this for</Eyebrow>
        <p className="spc__h [font-weight:500] [font-size:3.2rem] [line-height:1.2] [letter-spacing:-0.06rem] [color:var(--ink-2)] [max-width:80rem]">{`${service}, run by people who know your specialty’s rules.`}</p>
      </div>
      <motion.ul className="spc__chips [list-style:none] [display:flex] [flex-wrap:wrap] [gap:1rem] [margin-top:3.2rem] [&_a]:[display:inline-flex] [&_a]:[align-items:center] [&_a]:[gap:0.6rem] [&_a]:[padding:1.1rem_1.8rem] [&_a]:[border-radius:99rem] [&_a]:[border:1px_solid_#e6dfff] [&_a]:[background:#fff] [&_a]:[font-size:1.55rem] [&_a]:[color:var(--ink-2)] [&_a]:[transition:background_0.3s,_color_0.3s,_border-color_0.3s] [&_a_svg]:[color:#b9a5ff] [&_a_svg]:[transition:color_0.3s,_transform_0.3s] [&_a:hover]:[background:var(--purple)] [&_a:hover]:[border-color:var(--purple)] [&_a:hover]:[color:#fff] [&_a:hover_svg]:[color:#fff] [&_a:hover_svg]:[transform:translate(0.2rem,_-0.2rem)]" initial="h" whileInView="s" viewport={vp} variants={{ h: {}, s: { transition: { staggerChildren: 0.025 } } }}>
        {list.map((x) => (
          <motion.li key={x.slug} variants={{ h: { opacity: 0, y: 10 }, s: { opacity: 1, y: 0, transition: { duration: 0.5, ease: ease.out } } }}>
            <Link to={`/specialties/${x.slug}`}>{x.name} <ArrowUpRight size={14} /></Link>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
