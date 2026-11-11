'use client';
/**
 * State landing page (/states/<slug>). Built to convert from local search and PPC:
 * hero with the ask and the phone, the state's own billing rules, specialties, services, local coverage,
 * proof, testimonials, what switching takes, then form, FAQ, CTA. Every section is readable without interaction.
 */
import { IntroBlock, stateIntro } from '../components/IntroBlock';
import { PageGuide, stateGuide } from '../components/PageGuide';
import { HeroCapture } from '../components/HeroCapture';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight, Building2, ChevronLeft, Clock, ExternalLink, Mail, MapPin, Phone } from 'lucide-react';
import { Button, Eyebrow, Reveal, SplitWords } from '../components/ui';
import { TrustRow, MidCta, Switching } from '../components/ChildFolds';
import { Testimonials } from '../sections/Testimonials';
import { StateShape } from '../components/USMap';
import { Assessment } from '../sections/Assessment';
import { CTA, FAQ } from '../sections/Closing';
import { Proof } from './ServicesHub';
import { Link } from '../router';
import { ease, vp } from '../motion';
import { getState, STATES, type StatePage as State } from '../data/states';
import { MAC_OF, REGION_OF } from '../data/states-all';
import { getSpecialtyLite } from '../data/specialties';
import { SERVICES } from '../data/services';
import { setJsonLd, pageJsonLd } from '../data/seo';

const REGION: Record<string, string> = { texas: 'Texas|Dallas|Houston|Austin', florida: 'Florida|Miami|Tampa|Orlando', california: 'California|Los Angeles|San Diego' };

function Hero({ s }: { s: State }) {
  return (
    <section className="sp-hero stp-hero [display:grid] [grid-template-columns:minmax(0,_1fr)_minmax(0,_1fr)] [gap:6rem] [align-items:center] [padding:16.4rem_var(--gutter)_6rem] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1279px)]:[padding-top:12rem] [@media(max-width:_1279px)]:[min-height:0]">
      <div className="sp-hero__copy [display:flex] [flex-direction:column] [gap:2.8rem]">
        <motion.nav className="crumbs [display:flex] [align-items:center] [gap:1rem] [font-family:var(--f-mono)] [font-size:1.4rem] [text-transform:uppercase] [letter-spacing:0.04em] [color:#8a8ea0] [&_a]:[display:inline-flex] [&_a]:[align-items:center] [&_a]:[gap:0.4rem] [&_a]:[color:var(--purple)]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} aria-label="Breadcrumb">
          <Link to="/states"><ChevronLeft size={16} /> States</Link><span>/</span><span>{s.name}</span>
        </motion.nav>
        <SplitWords as="h1" className="page-title [font-weight:500] [font-size:6.12rem] [line-height:1.06] [letter-spacing:-0.18rem] [color:var(--ink-3)] [@media(max-width:_1279px)]:[font-size:4.32rem]" animateNow delay={0.3} stagger={0.05} lines={s.heroTitle} bold={[s.heroAccent]} />
        <motion.p className="page-sub [font-size:1.8rem] [line-height:1.6] [color:#4a4f63] [max-width:56rem] [.ab-hero\_\_copy_&]:[max-width:64rem]" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.7 }}>{s.heroSub}</motion.p>
        <motion.div className="sh-hero__cta [display:flex] [align-items:center] [gap:3.2rem] [flex-wrap:wrap]" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.85 }}>
          <HeroCapture source={`state:${s.slug}`} />
        </motion.div>
        <TrustRow />
      </div>
      <motion.div className="stp-card [position:relative] [padding:4rem] [border-radius:3.2rem] [background:linear-gradient(160deg,_#7a55ff_0%,_var(--purple)_50%,_#4b23d6_100%)] [color:#fff] [overflow:hidden] [box-shadow:0_4rem_10rem_-3rem_rgba(80,_40,_220,_0.45)] [&::before]:[content:''] [&::before]:[position:absolute] [&::before]:[inset:0] [&::before]:[background:repeating-linear-gradient(90deg,_rgba(255,_255,_255,_0.08)_0_0.7rem,_transparent_0.7rem_1.8rem)] [&::before]:[-webkit-mask-image:linear-gradient(90deg,_transparent_30%,_#000)] [&::before]:[mask-image:linear-gradient(90deg,_transparent_30%,_#000)] [&::before]:[pointer-events:none] [@media(max-width:_1279px)]:[padding:3.2rem_2.4rem]" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: ease.out, delay: 0.25 }}>
        <div className="stp-card__map [position:relative] [height:30rem] [display:grid] [place-items:center] [@media(max-width:_1279px)]:[height:22rem]"><StateShape id={s.id} className="stp-shape [width:100%] [height:100%] [&_path]:[fill:rgba(255,_255,_255,_0.18)] [&_path]:[stroke:#fff] [&_path]:[stroke-width:2] [&_path]:[vector-effect:non-scaling-stroke] [&_path]:[stroke-linejoin:round]" /></div>
        <p className="stp-card__k [position:relative] [display:flex] [align-items:center] [gap:0.6rem] [margin-top:2.4rem] [font-family:var(--f-mono)] [font-size:1.2rem] [letter-spacing:0.06em] [text-transform:uppercase] [color:rgba(255,_255,_255,_0.8)]"><MapPin size={14} /> {s.name} billing, at a glance</p>
        <ul className="stp-card__chips [position:relative] [display:grid] [grid-template-columns:repeat(3,_minmax(0,_1fr))] [gap:1rem] [margin-top:1.2rem] [&_li]:[padding:1.4rem_1.6rem] [&_li]:[border-radius:1.6rem] [&_li]:[background:rgba(255,_255,_255,_0.12)] [&_li]:[border:1px_solid_rgba(255,_255,_255,_0.22)] [&_small]:[display:block] [&_small]:[font-size:1.2rem] [&_small]:[color:rgba(255,_255,_255,_0.75)] [&_b]:[display:block] [&_b]:[margin-top:0.4rem] [&_b]:[font-weight:600] [&_b]:[font-size:1.6rem] [@media(max-width:_640px)]:[grid-template-columns:minmax(0,_1fr)]">
          {s.chips.map(([k, v]) => <li key={k}><small>{k}</small><b>{v}</b></li>)}
        </ul>
        <p className="stp-card__cities [@media(max-width:_1279px)]:[font-size:16px]! [@media(max-width:_1279px)]:[line-height:1.6] [position:relative] [margin-top:1.6rem] [font-size:1.4rem] [color:rgba(255,_255,_255,_0.8)]">{s.cities.join(' · ')}</p>
      </motion.div>
    </section>
  );
}

function Rules({ s }: { s: State }) {
  return (
    <section className="stp-rules container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [padding-top:12rem] [@media(max-width:_1279px)]:[padding-top:8rem]">
      <div className="stp-head [display:flex] [flex-direction:column] [gap:1.2rem]">
        <Eyebrow>{`/ ${s.name} rules we bill by`}</Eyebrow>
        <SplitWords className="h-56 [font-weight:500] [font-size:5.6rem] [line-height:1.08] [letter-spacing:-0.12rem] [color:var(--ink-2)] [text-wrap:balance] [@media(max-width:_1279px)]:[font-size:3.8rem] [@media(max-width:_640px)]:[font-size:3.4rem]" lines={[`Your payers are in ${s.name}.`, 'So are their rules.']} stagger={0.04} />
      </div>
      <div className="stp-rules__grid [display:grid] [grid-template-columns:repeat(4,_minmax(0,_1fr))] [gap:2rem] [margin-top:4rem] [@media(max-width:_1279px)]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] [@media(max-width:_640px)]:[grid-template-columns:minmax(0,_1fr)]">
        {s.facts.map((f, i) => (
          <motion.article key={f.k} className="stp-rule [@media(max-width:_1279px)]:[font-size:16px]! [@media(max-width:_1279px)]:[line-height:1.6] [display:flex] [flex-direction:column] [gap:1.2rem] [padding:2.8rem] [border-radius:2.4rem] [background:#fff] [border:1px_solid_#ece8fa] [box-shadow:0_2rem_5rem_rgba(40,_20,_120,_0.06)] [&_h3]:[font-weight:500] [&_h3]:[font-size:2.2rem] [&_h3]:[line-height:1.2] [&_h3]:[color:var(--ink-2)] [&_p]:[font-size:1.55rem] [&_p]:[line-height:1.6] [&_p]:[color:#4a4f63]" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 0.7, ease: ease.out, delay: i * 0.08 }}>
            <span className="stp-rule__k [align-self:flex-start] [padding:0.4rem_1rem] [border-radius:2rem] [background:#f1edff] [font-family:var(--f-mono)] [font-size:1.15rem] [letter-spacing:0.06em] [text-transform:uppercase] [color:var(--purple)]">{f.k}</span>
            <h3>{f.title}</h3>
            <p>{f.body}</p>
            {f.src && <a href={f.src.href} target="_blank" rel="noopener noreferrer" className="stp-rule__src [margin-top:auto] [display:inline-flex] [align-items:center] [gap:0.4rem] [font-family:var(--f-mono)] [font-size:1.15rem] [color:#8a8ea0] [text-decoration:underline] [text-underline-offset:0.3em]">{f.src.label} <ExternalLink size={12} /></a>}
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function Specialties({ s }: { s: State }) {
  const sp = s.specialties.map(getSpecialtyLite).filter((x): x is NonNullable<typeof x> => !!x);
  return (
    <section className="stp-sp container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [padding-top:12rem] [@media(max-width:_1279px)]:[padding-top:8rem]">
      <div className="stp-head stp-head--row [display:flex] [flex-direction:row] [justify-content:space-between] [align-items:flex-end] [gap:2.4rem] [text-align:left] [@media(max-width:_767px)]:[flex-direction:column] [@media(max-width:_767px)]:[align-items:flex-start]">
        <div>
          <Eyebrow>{`/ Specialties we bill in ${s.name}`}</Eyebrow>
          <SplitWords className="h-56 [font-weight:500] [font-size:5.6rem] [line-height:1.08] [letter-spacing:-0.12rem] [color:var(--ink-2)] [text-wrap:balance] [@media(max-width:_1279px)]:[font-size:3.8rem] [@media(max-width:_640px)]:[font-size:3.4rem]" lines={[`What ${s.name} practices`, 'hand us most.']} stagger={0.04} />
        </div>
        <Link to="/specialties" className="text-link [display:inline-flex] [align-items:center] [gap:0.8rem] [font-weight:500] [font-size:1.8rem] [color:var(--purple)] [&_svg]:[transition:transform_0.4s_cubic-bezier(.16,1,.3,1)] [&:hover_svg]:[transform:translateX(0.5rem)] [.est\_\_carried_&]:[margin-top:0.6rem] [.est\_\_carried_&]:[font-size:1.5rem] [.est\_\_carried_&]:[color:#fff] [.est\_\_carried_&]:[text-decoration:underline] [.est\_\_carried_&]:[text-underline-offset:0.3em] [.est\_\_carried_&]:[opacity:0.85]">All 23 specialties <ArrowRight size={18} /></Link>
      </div>
      <div className="stp-sp__grid [display:grid] [grid-template-columns:repeat(4,_minmax(0,_1fr))] [gap:1.6rem] [margin-top:4.8rem] [&>div]:[min-width:0] [@media(max-width:_1279px)]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] [@media(max-width:_767px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_767px)]:[gap:1.2rem] [@media(max-width:_767px)]:[margin-top:3.2rem]">
        {sp.map((x, i) => {
          const Icon = x.icon;
          return (
            <motion.div key={x.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 0.6, ease: ease.out, delay: (i % 4) * 0.06 }}>
              <Link to={`/specialties/${x.slug}`} className="stp-sp__card [@media(max-width:_1279px)]:[font-size:16px]! [@media(max-width:_1279px)]:[line-height:1.6] [height:100%] [display:flex] [flex-direction:column] [gap:1.2rem] [padding:2.8rem] [border-radius:2.4rem] [background:#fff] [border:1px_solid_#ece8fa] [transition:border-color_0.3s,_box-shadow_0.4s,_transform_0.4s_cubic-bezier(.16,1,.3,1)] [&:hover]:[border-color:var(--purple)] [&:hover]:[box-shadow:0_2rem_5rem_rgba(106,_65,_249,_0.12)] [&:hover]:[transform:translateY(-0.4rem)] [&_b]:[font-weight:500] [&_b]:[font-size:2.2rem] [&_b]:[color:var(--ink-2)] [&_b]:[margin-top:0.4rem] [&_p]:[flex:1] [&_p]:[font-size:1.5rem] [&_p]:[line-height:1.55] [&_p]:[color:#5b5f72] [&_p]:[display:-webkit-box] [&_p]:[-webkit-line-clamp:3] [&_p]:[-webkit-box-orient:vertical] [&_p]:[overflow:hidden] [@media(max-width:_767px)]:[padding:2.4rem]">
                <span className="stp-sp__ic [width:4.8rem] [height:4.8rem] [border-radius:1.4rem] [display:grid] [place-items:center] [background:#f1ecff] [color:var(--purple)]"><Icon size={22} /></span>
                <b>{x.name}</b>
                <p>{x.watch}</p>
                <span className="stp-sp__go [display:inline-flex] [align-items:center] [gap:0.6rem] [font-size:1.4rem] [font-weight:500] [color:var(--purple)]">See {x.name.toLowerCase()} billing <ArrowUpRight size={16} /></span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

function Services({ s }: { s: State }) {
  return (
    <section className="stp-sv container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [padding-top:12rem] [@media(max-width:_1279px)]:[padding-top:8rem]">
      <div className="stp-sv__panel [display:grid] [grid-template-columns:minmax(0,_0.85fr)_minmax(0,_1.15fr)] [gap:6.4rem] [padding:7.2rem] [border-radius:4rem] [background:linear-gradient(150deg,_#7a55ff_0%,_var(--purple)_45%,_#5430e6_100%)] [color:#fff] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1279px)]:[gap:4rem] [@media(max-width:_1279px)]:[padding:5.6rem_4rem] [@media(max-width:_767px)]:[padding:4.8rem_2.4rem] [@media(max-width:_767px)]:[border-radius:3.2rem]">
        <div className="stp-sv__head [display:flex] [flex-direction:column] [align-items:flex-start] [gap:2rem] [position:sticky] [top:12rem] [align-self:start] [&_h2]:[color:#fff] [&_p]:[font-size:1.8rem] [&_p]:[line-height:1.6] [&_p]:[color:rgba(255,_255,_255,_0.82)] [@media(max-width:_1279px)]:[position:static]">
          <Eyebrow className="eyebrow--light [color:#fff]! [.process\_\_panel_&]:[color:var(--purple)]! [.stp-sv\_\_head_&]:[color:rgba(255,_255,_255,_0.82)]! [.se\_\_panel_&]:[color:var(--ink)]!">/ Services</Eyebrow>
          <h2 className="h-56 [font-weight:500] [font-size:5.6rem] [line-height:1.08] [letter-spacing:-0.12rem] [color:var(--ink-2)] [text-wrap:balance] [@media(max-width:_1279px)]:[font-size:3.8rem] [@media(max-width:_640px)]:[font-size:3.4rem]">One team for the whole cycle, or just the part you need.</h2>
          <p>{`Most ${s.name} practices start with full revenue cycle management. Others hand us one stubborn piece, like denials, aged A/R or credentialing, and add more later.`}</p>
          <Button>Get a free revenue assessment</Button>
        </div>
        <ol className="stp-sv__list [display:flex] [flex-direction:column] [&_a]:[display:grid] [&_a]:[grid-template-columns:4rem_minmax(0,_1fr)_2rem] [&_a]:[gap:1.6rem] [&_a]:[align-items:center] [&_a]:[padding:2rem_0] [&_a]:[border-bottom:1px_solid_rgba(255,_255,_255,_0.16)] [&_a]:[color:#fff] [&_a]:[transition:padding_0.4s_cubic-bezier(.16,1,.3,1)] [&_li:first-child_a]:[border-top:1px_solid_rgba(255,_255,_255,_0.16)] [&_small]:[font-family:var(--f-mono)] [&_small]:[font-size:1.3rem] [&_small]:[color:rgba(255,_255,_255,_0.6)] [&_b]:[display:block] [&_b]:[font-weight:500] [&_b]:[font-size:2rem] [&_em]:[display:block] [&_em]:[margin-top:0.4rem] [&_em]:[font-style:normal] [&_em]:[font-size:1.5rem] [&_em]:[color:rgba(255,_255,_255,_0.72)] [&_svg]:[opacity:0.6] [&_svg]:[transition:opacity_0.3s,_transform_0.3s] [&_a:hover]:[padding-left:1rem] [&_a:hover_svg]:[opacity:1] [&_a:hover_svg]:[transform:translate(0.3rem,_-0.3rem)] [@media(max-width:_767px)]:[&_b]:[font-size:1.8rem] [list-style:none] [padding:0] [margin:0]">
          {SERVICES.map((x, i) => (
            <li key={x.slug}>
              <Link to={`/services/${x.slug}`}>
                <small>{String(i + 1).padStart(2, '0')}</small>
                <span><b>{x.name}</b><em>{x.line}</em></span>
                <ArrowUpRight size={18} />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Local coverage: who answers, when, and where. Live clock in the state's own time zone. */
function Coverage({ s }: { s: State }) {
  // Clock starts after hydration: server HTML can't know the visitor's time
  const [now, setNow] = useState(() => new Date('2026-01-05T15:00:00Z'));
  const [ready, setReady] = useState(false);
  useEffect(() => { setNow(new Date()); setReady(true); const t = window.setInterval(() => setNow(new Date()), 30000); return () => window.clearInterval(t); }, []);
  const time = new Intl.DateTimeFormat('en-US', { timeZone: s.tz, hour: 'numeric', minute: '2-digit' }).format(now);
  const day = new Intl.DateTimeFormat('en-US', { timeZone: s.tz, weekday: 'short' }).format(now);
  const hour = +new Intl.DateTimeFormat('en-US', { timeZone: s.tz, hour: 'numeric', hourCycle: 'h23' }).format(now);
  const open = !['Sat', 'Sun'].includes(day) && hour >= 8 && hour < 18;
  return (
    <section className="stp-cov container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [padding-top:12rem] [display:grid] [grid-template-columns:minmax(0,_1fr)_minmax(0,_1fr)] [gap:6.4rem] [align-items:center] [@media(max-width:_1279px)]:[padding-top:8rem] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1279px)]:[gap:4rem]">
      <div className="stp-cov__copy [display:flex] [flex-direction:column] [gap:1.6rem] [min-width:0]">
        <Eyebrow>{`/ Local to ${s.name}`}</Eyebrow>
        <SplitWords className="h-56 [font-weight:500] [font-size:5.6rem] [line-height:1.08] [letter-spacing:-0.12rem] [color:var(--ink-2)] [text-wrap:balance] [@media(max-width:_1279px)]:[font-size:3.8rem] [@media(max-width:_640px)]:[font-size:3.4rem]" lines={['A billing team that', 'keeps your hours.']} stagger={0.04} />
        <Reveal as="p" className="stp-cov__p [font-size:1.8rem] [line-height:1.6] [color:#4a4f63] [max-width:58rem]">{s.local}</Reveal>
        <div className="stp-cov__cities [margin-top:1.6rem] [&_small]:[font-family:var(--f-mono)] [&_small]:[font-size:1.3rem] [&_small]:[letter-spacing:0.04em] [&_small]:[text-transform:uppercase] [&_small]:[color:#8a8ea0] [&_ul]:[display:flex] [&_ul]:[flex-wrap:wrap] [&_ul]:[gap:0.8rem] [&_ul]:[margin-top:1.2rem] [&_li]:[display:inline-flex] [&_li]:[align-items:center] [&_li]:[gap:0.6rem] [&_li]:[padding:0.9rem_1.4rem] [&_li]:[border-radius:3rem] [&_li]:[background:#f6f3ff] [&_li]:[border:1px_solid_#ece6ff] [&_li]:[font-size:1.5rem] [&_li]:[color:var(--ink-2)] [&_li_svg]:[color:var(--purple)]">
          <small>{`Practices we serve across ${s.name}`}</small>
          <ul>{s.cities.map((c) => <li key={c}><MapPin size={14} />{c}</li>)}</ul>
        </div>
      </div>
      <motion.div className="stp-cov__card [min-width:0] [padding:4rem] [border-radius:3.2rem] [background:#fff] [border:1px_solid_#ece8fa] [box-shadow:0_3rem_8rem_rgba(106,_65,_249,_0.1)] [@media(max-width:_767px)]:[padding:2.4rem]" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 0.9, ease: ease.out }}>
        <div className="stp-cov__clock [padding:3.2rem] [border-radius:2.4rem] [background:linear-gradient(150deg,_#7a55ff,_var(--purple)_50%,_#5430e6)] [color:#fff] [&_small]:[font-family:var(--f-mono)] [&_small]:[font-size:1.3rem] [&_small]:[letter-spacing:0.04em] [&_small]:[text-transform:uppercase] [&_small]:[color:rgba(255,_255,_255,_0.75)] [&_b]:[display:block] [&_b]:[margin-top:0.6rem] [&_b]:[font-family:var(--f-jak)] [&_b]:[font-weight:500] [&_b]:[font-size:6.4rem] [&_b]:[line-height:1] [&_b]:[letter-spacing:-0.2rem] [@media(max-width:_767px)]:[padding:2.4rem] [@media(max-width:_767px)]:[&_b]:[font-size:4.8rem]">
          <small>{`Right now in ${s.name}`}</small>
          <b>{time}</b>
          <span className={String.raw`stp-cov__status [display:inline-flex] [align-items:center] [gap:0.8rem] [margin-top:1.6rem] [padding:0.7rem_1.4rem] [border-radius:3rem] [background:rgba(255,_255,_255,_0.14)] [font-size:1.4rem] [&_i]:[width:0.8rem] [&_i]:[height:0.8rem] [&_i]:[border-radius:50%] [&_i]:[background:#cfc4ff] [&.is-open_i]:[background:#4ade80] [&.is-open_i]:[box-shadow:0_0_0_0.4rem_rgba(74,_222,_128,_0.25)] ${open ? 'is-open' : ''}`}><i />{open ? 'Our team is online' : 'We reply first thing next business day'}</span>
        </div>
        <dl className="stp-cov__dl [display:flex] [flex-direction:column] [margin-top:1.6rem] [&_div]:[display:grid] [&_div]:[grid-template-columns:11rem_minmax(0,_1fr)] [&_div]:[gap:1.6rem] [&_div]:[padding:1.6rem_0] [&_div]:[border-bottom:1px_solid_#f0edf9] [&_div]:[font-size:1.6rem] [&_dt]:[display:inline-flex] [&_dt]:[align-items:center] [&_dt]:[gap:0.8rem] [&_dt]:[color:#8a8ea0] [&_dt_svg]:[color:var(--purple)] [&_dd]:[color:var(--ink-2)] [&_a]:[color:var(--purple)] [&_a]:[font-weight:500] [@media(max-width:_767px)]:[&_div]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_767px)]:[&_div]:[gap:0.4rem]">
          <div><dt><Clock size={16} /> Hours</dt><dd>{`Mon–Fri, 8 am – 6 pm ${s.tzName}`}</dd></div>
          <div><dt><Phone size={16} /> Call</dt><dd><a href="tel:+12148512698">214-851-2698</a></dd></div>
          <div><dt><Mail size={16} /> Email</dt><dd><a href="mailto:info@affinitycore.co">info@affinitycore.co</a></dd></div>
          <div><dt><Building2 size={16} /> Office</dt><dd>5830 Granite Pkwy, STE 100-219, Plano, TX 75024</dd></div>
        </dl>
        <p className="stp-cov__fine [@media(max-width:_1279px)]:[font-size:13.5px]! [@media(max-width:_1279px)]:[line-height:1.55] [margin-top:1.2rem] [font-size:1.2rem] [color:#a0a3b1]">Hours shown for illustration. [Confirm with Affinity Core]</p>
      </motion.div>
    </section>
  );
}

function OtherStates({ s }: { s: State }) {
  // Same Medicare jurisdiction first (genuinely related pages), then fill to 8 from the same region
  const mac = MAC_OF[s.slug], reg = REGION_OF[s.abbr];
  const same = STATES.filter((x) => x.slug !== s.slug && MAC_OF[x.slug] === mac);
  const near = STATES.filter((x) => x.slug !== s.slug && REGION_OF[x.abbr] === reg && !same.includes(x));
  const others = [...same, ...near].slice(0, 8);
  return (
    <nav className="ab container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [display:flex] [flex-wrap:wrap] [align-items:center] [gap:1rem_1.2rem] [padding-top:4rem] [font-size:1.6rem] [color:#6b6f7c] [&_a]:[padding:0.8rem_1.6rem] [&_a]:[border-radius:2rem] [&_a]:[border:1px_solid_var(--lav-border)] [&_a]:[color:var(--ink-2)] [&_a]:[transition:border-color_0.3s,_color_0.3s] [&_a:hover]:[border-color:var(--purple)] [&_a:hover]:[color:var(--purple)]" aria-label="Nearby states">
      <span>{same.length ? `Same Medicare contractor (${mac}):` : 'Nearby states:'}</span>
      {others.map((x) => <Link key={x.slug} to={`/states/${x.slug}`}>{x.name}</Link>)}
      <Link to="/states" className="ab__all [.ab_&]:[display:inline-flex] [.ab_&]:[align-items:center] [.ab_&]:[gap:0.6rem] [.ab_&]:[border:0] [.ab_&]:[color:var(--purple)] [.ab_&]:[font-weight:500]">All 50 states <ArrowRight size={16} /></Link>
    </nav>
  );
}

export function StatePage({ slug }: { slug: string }) {
  const s = getState(slug)!;
  const faqs = useMemo(() => s.faqs, [s]);
  useEffect(() => {
    document.title = `${s.seoTitle} · Affinity Core`;
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m); }
    m.setAttribute('content', s.seoDescription);
    setJsonLd(pageJsonLd({ name: `Medical Billing Services in ${s.name}`, description: s.seoDescription, path: `/states/${s.slug}`, crumb: ['States', '/states'], faqs }));
    return () => setJsonLd(null);
  }, [s, faqs]);
  return (
    <main className="page [overflow-x:clip] [@media(max-width:_640px)]:[&:has(.mbar)]:[padding-bottom:7.2rem]">
      <Hero s={s} />
      <IntroBlock d={stateIntro(s)} />
      <Rules s={s} />
      <Specialties s={s} />
      <Services s={s} />
      <Coverage s={s} />
      <MidCta title={`Billing for a ${s.name} practice? Let’s look at your numbers.`} body={`We’ll review a month of your claims against ${s.name} payer rules and show you the dollars, line by line. Free, no contract.`} />
      <Proof region={REGION[s.slug]} />
      <Testimonials />
      <Switching what={`a ${s.name} practice’s billing`} />
      <OtherStates s={s} />
      <PageGuide g={stateGuide(s)} />
      <Assessment source={`state:${s.slug}`} />
      <FAQ items={faqs} eyebrow={`/ ${s.name} billing FAQs`} lines={[`What ${s.name} practices ask`, 'before switching billers.']} />
      <CTA eyebrow={s.closing.eyebrow} lines={s.closing.lines} />
    </main>
  );
}
