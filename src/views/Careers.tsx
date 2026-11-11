'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import { ArrowRight, Check, MapPin, Clock, GraduationCap, TrendingUp, Laptop, Users, BookOpen, HeartPulse, ChevronDown, ArrowUpRight } from 'lucide-react';
import { Eyebrow, SplitWords, Reveal } from '../components/ui';
import { FAQ } from '../sections/Closing';
import { ROLES, TEAMS, LADDER, PERKS, HIRING, CAREER_FAQS, type Role } from '../data/careers';
import { ease, vp } from '../motion';

const setMeta = () => {
  document.title = 'Careers in Medical Billing & RCM · Affinity Core';
  let m = document.querySelector('meta[name="description"]');
  if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m); }
  m.setAttribute('content', 'Open roles in medical billing, coding, A/R, denials and credentialing at Affinity Core, a US-based revenue cycle team in Plano, Texas.');
};

/* ---------- Hero: a day of wins on the team ---------- */
const WINS: [string, string, string][] = [
  ['Denials', 'CO-97 appeal won', '+$1,240'],
  ['Credentialing', 'Dr. Patel enrolled with Aetna', 'Effective 10/01'],
  ['Coding', '146 visits coded, audit passed', '99.2%'],
  ['A/R', '90+ day bucket worked down', '−12%'],
  ['Prior auth', 'MRI approved inside 72 hours', 'Approved'],
  ['Posting', 'Underpayment caught on ERA', '+$55.20'],
];
function Wins() {
  const [k, setK] = useState(0);
  useEffect(() => { const id = setInterval(() => setK((v) => (v + 1) % WINS.length), 2200); return () => clearInterval(id); }, []);
  const rows = [0, 1, 2, 3].map((o) => WINS[(k + o) % WINS.length]);
  return (
    <div className="cw w-card [border-radius:2.6rem] [backdrop-filter:blur(1.6rem)] [color:var(--navy)] [padding:2.4rem] [background:#fff] [border:1px_solid_#ece8fa] [box-shadow:0_3rem_8rem_-3rem_rgba(57,_28,_160,_0.25)] [@media(max-width:_640px)]:[padding:1.8rem]">
      <div className="cw__head [display:flex] [justify-content:space-between] [align-items:baseline] [font-size:1.5rem] [color:#575568] [margin-bottom:1.2rem] [&_span]:[display:inline-flex] [&_span]:[align-items:center] [&_span]:[gap:0.8rem] [&_i]:[width:0.7rem] [&_i]:[height:0.7rem] [&_i]:[border-radius:50%] [&_i]:[background:var(--purple)] [&_i]:[box-shadow:0_0_0_0.4rem_rgba(106,_65,_249,_0.16)] [&_small]:[font-family:var(--f-mono)] [&_small]:[font-size:1.1rem] [&_small]:[color:#a7a3b9] [&_small]:[text-transform:uppercase]"><span><i />Today on the team</span><small>Sample day</small></div>
      <ul className="cw__list [@media(max-width:_1279px)]:[font-size:16px]! [@media(max-width:_1279px)]:[line-height:1.6] [display:flex] [flex-direction:column] [gap:0.8rem] [height:27.6rem] [overflow:hidden] [&_li]:[display:grid] [&_li]:[grid-template-columns:11rem_1fr_auto] [&_li]:[align-items:center] [&_li]:[gap:1.2rem] [&_li]:[padding:1.6rem_1.8rem] [&_li]:[border-radius:1.4rem] [&_li]:[background:#f8f6ff] [&_li]:[border:1px_solid_#efebfb] [&_li]:[font-size:1.5rem] [&_b]:[font-weight:500] [&_b]:[color:var(--ink-2)] [&_em]:[font-style:normal] [&_em]:[font-family:var(--f-mono)] [&_em]:[font-size:1.3rem] [&_em]:[color:var(--purple)] [&_em]:[font-weight:600] [@media(max-width:_640px)]:[height:auto] [@media(max-width:_640px)]:[max-height:34rem] [@media(max-width:_640px)]:[&_li]:[grid-template-columns:minmax(0,_1fr)_auto] [@media(max-width:_640px)]:[&_li]:[gap:0.4rem_1rem] [@media(max-width:_640px)]:[&_li]:[padding:1.2rem_1.4rem] [@media(max-width:_640px)]:[&_b]:[font-size:1.5rem] [@media(max-width:_640px)]:[&_b]:[line-height:1.35]">
        <AnimatePresence initial={false} mode="popLayout">
          {rows.map(([t, w, v], i) => (
            <motion.li key={w} layout initial={{ opacity: 0, y: -24 }} animate={{ opacity: i === 0 ? 1 : 1 - i * 0.2, y: 0 }} exit={{ opacity: 0, y: 24 }} transition={{ duration: 0.6, ease: ease.out }} className={i === 0 ? String.raw`is-new [@media(max-width:_1279px)]:[font-size:16px]! [@media(max-width:_1279px)]:[line-height:1.6] [.cw\_\_list_li&]:[background:#fff] [.cw\_\_list_li&]:[border-color:var(--purple)] [.cw\_\_list_li&]:[box-shadow:0_1rem_2.4rem_rgba(106,_65,_249,_0.12)]` : ''}>
              <span className="cw__tag [font-family:var(--f-mono)] [font-size:1.1rem] [text-transform:uppercase] [color:var(--purple)] [@media(max-width:_640px)]:[grid-column:1_/_-1]">{t}</span><b>{w}</b><em>{v}</em>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

/* ---------- Open roles ---------- */
function RoleRow({ r, open, onToggle }: { r: Role; open: boolean; onToggle: () => void }) {
  const [applying, setApplying] = useState(false);
  const [sent, setSent] = useState(false);
  return (
    <li className={String.raw`jr2 [border-bottom:1px_solid_#ece8f7] ${open ? 'is-open' : ''}`}>
      <button className="jr2__head [width:100%] [display:grid] [grid-template-columns:minmax(0,_1fr)_auto_3.2rem] [align-items:center] [gap:2.4rem] [padding:2.8rem_1.2rem] [text-align:left] [transition:background_0.3s] [border-radius:1.6rem] [&:hover]:[background:#f8f6ff] [.jr2.is-open_&]:[background:#f8f6ff] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)_3.2rem]" onClick={onToggle} aria-expanded={open}>
        <span className="jr2__title [&_b]:[display:block] [&_b]:[font-weight:500] [&_b]:[font-size:2.4rem] [&_b]:[letter-spacing:-0.04rem] [&_b]:[color:var(--ink-2)] [&_small]:[font-family:var(--f-mono)] [&_small]:[font-size:1.2rem] [&_small]:[text-transform:uppercase] [&_small]:[color:var(--purple)]"><b>{r.title}</b><small>{r.team}</small></span>
        <span className="jr2__meta [display:flex] [gap:1.2rem] [flex-wrap:wrap] [justify-content:flex-end] [&_span]:[display:inline-flex] [&_span]:[align-items:center] [&_span]:[gap:0.5rem] [&_span]:[padding:0.6rem_1.2rem] [&_span]:[border-radius:3rem] [&_span]:[background:#fff] [&_span]:[border:1px_solid_#ece8fa] [&_span]:[font-size:1.4rem] [&_span]:[color:#4a4f63] [@media(max-width:_1279px)]:[grid-column:1] [@media(max-width:_1279px)]:[justify-content:flex-start]"><span><MapPin size={14} />{r.location}</span><span><Clock size={14} />{r.type}</span><span>{r.level}</span></span>
        <motion.span className="jr2__chev [display:grid] [place-items:center] [color:var(--purple)]" animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.4, ease: ease.out }}><ChevronDown size={20} /></motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div className="jr2__body [overflow:hidden]" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: ease.out }}>
            <div className="jr2__in [padding:0.8rem_1.2rem_3.2rem] [display:flex] [flex-direction:column] [gap:2.4rem]">
              <p className="jr2__sum [font-size:1.9rem] [line-height:1.5] [color:var(--ink-2)] [max-width:80rem]">{r.summary}</p>
              <div className="jr2__cols [display:grid] [grid-template-columns:repeat(3,_minmax(0,_1fr))] [gap:2.4rem] [&_small]:[display:block] [&_small]:[font-family:var(--f-mono)] [&_small]:[font-size:1.2rem] [&_small]:[text-transform:uppercase] [&_small]:[color:#8a8ea0] [&_small]:[margin-bottom:1rem] [&_li]:[position:relative] [&_li]:[padding-left:1.8rem] [&_li]:[font-size:1.6rem] [&_li]:[line-height:1.5] [&_li]:[color:#4a4f63] [&_li]:[margin-bottom:0.6rem] [&_li::before]:[content:''] [&_li::before]:[position:absolute] [&_li::before]:[left:0] [&_li::before]:[top:1rem] [&_li::before]:[width:0.6rem] [&_li::before]:[height:0.6rem] [&_li::before]:[border-radius:50%] [&_li::before]:[background:var(--purple)] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)]">
                <div><small>What you’ll do</small><ul>{r.do.map((x) => <li key={x}>{x}</li>)}</ul></div>
                <div><small>What you bring</small><ul>{r.bring.map((x) => <li key={x}>{x}</li>)}</ul></div>
                <div><small>Nice to have</small><ul>{r.plus.map((x) => <li key={x}>{x}</li>)}</ul></div>
              </div>
              <AnimatePresence mode="wait" initial={false}>
                {sent ? (
                  <motion.p key="ok" className="jr2__ok [display:flex] [align-items:center] [gap:1rem] [padding:1.6rem_2rem] [border-radius:1.4rem] [background:#f1edff] [color:var(--purple)] [font-weight:500] [font-size:1.6rem]" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><Check size={18} strokeWidth={3} /> Application received. We’ll be in touch about the {r.title} role.</motion.p>
                ) : applying ? (
                  <motion.form key="f" className="jr2__form [display:grid] [grid-template-columns:repeat(4,_minmax(0,_1fr))_auto] [gap:1.2rem] [align-items:end] [&_label]:[display:flex] [&_label]:[flex-direction:column] [&_label]:[gap:0.6rem] [&_label]:[font-size:1.3rem] [&_label]:[color:#4a4f63] [&_input]:[height:5.2rem] [&_input]:[padding:0_1.4rem] [&_input]:[border-radius:1.2rem] [&_input]:[border:1px_solid_#e3ddf6] [&_input]:[background:#fff] [&_input]:[font-size:1.5rem] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)]" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
                    <label>Full name<input required placeholder="Jordan Lee" /></label>
                    <label>Email<input required type="email" placeholder="you@email.com" /></label>
                    <label>LinkedIn or resume link<input placeholder="linkedin.com/in/…" /></label>
                    <label>Certifications<input placeholder="CPC, CCS…" /></label>
                    <button type="submit" className="ct-submit [margin-top:2.4rem] [width:100%] [display:inline-flex] [align-items:center] [justify-content:center] [gap:1rem] [height:5.6rem] [border-radius:6rem] [color:#fff] [font-weight:500] [font-size:1.9rem] [transition:background_0.3s] [&:hover]:[background:#5a32ec] [&_svg]:[transition:transform_0.4s_cubic-bezier(.16,1,.3,1)] [&:hover_svg]:[transform:translateX(0.5rem)] [background:var(--grad)] [.jr2\_\_form_&]:[margin-top:0] [.jr2\_\_form_&]:[width:auto] [.jr2\_\_form_&]:[padding-inline:2.4rem] [.jr2\_\_form_&]:[height:5.2rem]">Send application <ArrowRight size={18} /></button>
                  </motion.form>
                ) : (
                  <motion.button key="b" className="ct-submit jr2__apply [margin-top:2.4rem] [display:inline-flex] [align-items:center] [justify-content:center] [gap:1rem] [height:5.6rem] [border-radius:6rem] [color:#fff] [font-weight:500] [font-size:1.9rem] [transition:background_0.3s] [&:hover]:[background:#5a32ec] [&_svg]:[transition:transform_0.4s_cubic-bezier(.16,1,.3,1)] [&:hover_svg]:[transform:translateX(0.5rem)] [background:var(--grad)] [width:auto] [align-self:flex-start] [padding-inline:3.2rem] [.jr2\_\_form_&]:[margin-top:0] [.jr2\_\_form_&]:[width:auto] [.jr2\_\_form_&]:[padding-inline:2.4rem] [.jr2\_\_form_&]:[height:5.2rem]" onClick={() => setApplying(true)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Apply for this role <ArrowRight size={18} /></motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

function Roles() {
  const [t, setT] = useState<(typeof TEAMS)[number]>('All');
  const [open, setOpen] = useState<string | null>(null);
  const list = ROLES.filter((r) => t === 'All' || r.team === t);
  return (
    <section className="cr container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [padding-top:14rem]" id="roles">
      <div className="cr__head [display:flex] [justify-content:space-between] [align-items:flex-end] [gap:4rem] [flex-wrap:wrap] [margin-bottom:4rem] [&_sup]:[font-size:1rem] [&_sup]:[opacity:0.7] [&_sup]:[margin-left:0.2rem]">
        <div>
          <Eyebrow>/ Open positions</Eyebrow>
          <SplitWords className="h-56 [font-weight:500] [font-size:5.6rem] [line-height:1.08] [letter-spacing:-0.12rem] [color:var(--ink-2)] [text-wrap:balance] [@media(max-width:_1279px)]:[font-size:3.8rem] [@media(max-width:_640px)]:[font-size:3.4rem]" lines={[`${ROLES.length} open roles,`, 'all in revenue cycle.']} stagger={0.04} />
        </div>
        <LayoutGroup>
          <div className="need__chips [display:flex] [flex-wrap:wrap] [gap:1.2rem] [margin-top:4rem]" role="tablist">
            {TEAMS.map((x) => {
              const n = x === 'All' ? ROLES.length : ROLES.filter((r) => r.team === x).length;
              return (
                <button key={x} role="tab" aria-selected={t === x} className={String.raw`need__chip [position:relative] [padding:1.4rem_2.4rem] [border-radius:6rem] [border:1px_solid_#e3def5] [font-size:1.8rem] [color:var(--ink-2)] [isolation:isolate] [transition:color_0.35s_0.08s,_border-color_0.35s] [&>span:not(.need\_\_pill)]:[position:relative] [&>span:not(.need\_\_pill)]:[z-index:1] [&.is-on]:[color:#fff] [&.is-on]:[border-color:var(--purple)] [&:focus-visible]:[outline:2px_solid_var(--purple)] [&:focus-visible]:[outline-offset:3px]! [@media(max-width:_1279px)]:[.xi\_\_chips_&]:[flex:0_0_auto] [@media(max-width:_1279px)]:[.xi\_\_chips_&]:[white-space:nowrap] [@media(max-width:_1279px)]:[.xi\_\_chips_&]:[font-size:1.6rem] [@media(max-width:_1279px)]:[.xi\_\_chips_&]:[padding:1.2rem_2rem] ${t === x ? String.raw`is-on [.assess\_\_steps_span&]:[color:var(--navy)] [.assess\_\_steps_span&_b]:[background:var(--purple)] [.assess\_\_steps_span&_b]:[border-color:var(--purple)] [.assess\_\_steps_span&_b]:[color:#fff] [.assess\_\_steps_i&::after]:[transform:scaleX(1)] [.cx-read\_\_n_i&]:[width:2.4rem] [.cx-read\_\_n_i&]:[background:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [.sg\_\_toc_button&]:[color:var(--purple)] [.sg\_\_toc_button&]:[border-left-color:var(--purple)] [.pg\_\_toc_button&]:[color:#fff] [.pg\_\_toc_button&_small]:[color:rgba(255,_255,_255,_0.7)] [.pg\_\_dots_i&]:[width:2.4rem] [.pg\_\_dots_i&]:[background:var(--purple)] [.stfd\_\_tabs_button&]:[color:#fff] [.se\_\_dots_i&]:[width:6.4rem] [.sw-anes\_\_bar_i&]:[background:var(--grad)] [.sw-body_circle&]:[fill:var(--purple)] [.sw-vial\_\_body_i&]:[background:var(--grad)] [.sw-vial\_\_body_i&_small]:[color:#fff] [.sw-wound\_\_grid_i&]:[background:#c9b8ff] [.sw-wound\_\_grid_i&]:[border-color:transparent] [.sw-cal_i&]:[background:var(--purple)] [.sw-cal_i&]:[color:#fff] [.sw-wells_i&]:[background:#e2d9ff] [.sw-wells_i&]:[border-color:#c9b8ff] [.sw-shot_i&]:[background:var(--purple)] [.sw-shot_i&]:[border-color:var(--purple)] [.lf\_\_seg_button&]:[color:#fff] [.tc\_\_why_li&]:[opacity:1] [.sl\_\_tabs_button&]:[color:#fff] [.ar\_\_toc_a&]:[color:var(--ink-2)] [.ct-needs_button&]:[color:#fff] [.wa\_\_zones_li&]:[background:var(--grad)] [.wa\_\_zones_li&]:[border-color:transparent] [.wa\_\_zones_li&_small]:[color:#fff] [.wa\_\_zones_li&_b]:[color:#fff] [.wa\_\_zones_li&_em]:[color:#fff] [.se\_\_dots_i&]:[background:var(--purple)] [.ct-needs_button&]:[background:var(--grad)] [.ct-needs_button&]:[border-color:transparent] [.sc-cal_i&]:[background:var(--purple)] [.sc-cal_i&]:[color:#fff] [.ccp_button&]:[background:var(--purple)] [.ccp_button&]:[color:#fff] [.pa-art\_\_seg_button&]:[background:var(--grad)] [.pa-art\_\_seg_button&]:[color:#fff] [.pa-art\_\_steps_li&]:[background:var(--purple)] [.pa-art\_\_steps_li&]:[border-color:var(--purple)] [.pa-art\_\_steps_li&]:[color:#fff] [.ab-orbit\_\_rings_line&]:[stroke:var(--purple)] [.ab-orbit\_\_rings_line&]:[stroke-width:2]` : ''}`} onClick={() => { setT(x); setOpen(null); }}>
                  {t === x && <motion.span layoutId="cr-pill" className="need__pill [position:absolute] [inset:-1px] [border-radius:6rem] [z-index:0] [background:var(--grad)]" transition={{ type: 'spring', stiffness: 260, damping: 32 }} />}
                  <span>{x} <sup>{n}</sup></span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.ul key={t} className="cr__list [border-top:1px_solid_#ece8f7]" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.45, ease: ease.out } }} exit={{ opacity: 0, transition: { duration: 0.18 } }}>
          {list.map((r) => <RoleRow key={r.slug} r={r} open={open === r.slug} onToggle={() => setOpen(open === r.slug ? null : r.slug)} />)}
        </motion.ul>
      </AnimatePresence>
      <p className="cr__note [@media(max-width:_1279px)]:[font-size:16px]! [@media(max-width:_1279px)]:[line-height:1.6] [margin-top:3.2rem] [font-size:1.7rem] [color:#4a4f63] [&_a]:[color:var(--purple)] [&_a]:[font-weight:500]">Don’t see your role? <a href="mailto:info@affinitycore.co?subject=Careers%20at%20Affinity%20Core">Send us your resume</a> and tell us what you’re great at.</p>
    </section>
  );
}

/* ---------- Career ladder ---------- */
function Ladder() {
  const [k, setK] = useState(0);
  const tr = LADDER[k];
  return (
    <section className="cl container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [padding-top:14rem]">
      <div className="cl__head [display:flex] [flex-direction:column] [gap:1.2rem]">
        <Eyebrow>/ Where it leads</Eyebrow>
        <SplitWords className="h-56 [font-weight:500] [font-size:5.6rem] [line-height:1.08] [letter-spacing:-0.12rem] [color:var(--ink-2)] [text-wrap:balance] [@media(max-width:_1279px)]:[font-size:3.8rem] [@media(max-width:_640px)]:[font-size:3.4rem]" lines={['Start in one seat.', 'Grow into the next.']} stagger={0.04} />
        <LayoutGroup>
          <div className="need__chips cl__tabs [display:flex] [flex-wrap:wrap] [gap:1.2rem] [margin-top:2rem]">
            {LADDER.map((l, i) => (
              <button key={l.track} className={String.raw`need__chip [position:relative] [padding:1.4rem_2.4rem] [border-radius:6rem] [border:1px_solid_#e3def5] [font-size:1.8rem] [color:var(--ink-2)] [isolation:isolate] [transition:color_0.35s_0.08s,_border-color_0.35s] [&>span:not(.need\_\_pill)]:[position:relative] [&>span:not(.need\_\_pill)]:[z-index:1] [&.is-on]:[color:#fff] [&.is-on]:[border-color:var(--purple)] [&:focus-visible]:[outline:2px_solid_var(--purple)] [&:focus-visible]:[outline-offset:3px]! [@media(max-width:_1279px)]:[.xi\_\_chips_&]:[flex:0_0_auto] [@media(max-width:_1279px)]:[.xi\_\_chips_&]:[white-space:nowrap] [@media(max-width:_1279px)]:[.xi\_\_chips_&]:[font-size:1.6rem] [@media(max-width:_1279px)]:[.xi\_\_chips_&]:[padding:1.2rem_2rem] ${k === i ? String.raw`is-on [.assess\_\_steps_span&]:[color:var(--navy)] [.assess\_\_steps_span&_b]:[background:var(--purple)] [.assess\_\_steps_span&_b]:[border-color:var(--purple)] [.assess\_\_steps_span&_b]:[color:#fff] [.assess\_\_steps_i&::after]:[transform:scaleX(1)] [.cx-read\_\_n_i&]:[width:2.4rem] [.cx-read\_\_n_i&]:[background:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [.sg\_\_toc_button&]:[color:var(--purple)] [.sg\_\_toc_button&]:[border-left-color:var(--purple)] [.pg\_\_toc_button&]:[color:#fff] [.pg\_\_toc_button&_small]:[color:rgba(255,_255,_255,_0.7)] [.pg\_\_dots_i&]:[width:2.4rem] [.pg\_\_dots_i&]:[background:var(--purple)] [.stfd\_\_tabs_button&]:[color:#fff] [.se\_\_dots_i&]:[width:6.4rem] [.sw-anes\_\_bar_i&]:[background:var(--grad)] [.sw-body_circle&]:[fill:var(--purple)] [.sw-vial\_\_body_i&]:[background:var(--grad)] [.sw-vial\_\_body_i&_small]:[color:#fff] [.sw-wound\_\_grid_i&]:[background:#c9b8ff] [.sw-wound\_\_grid_i&]:[border-color:transparent] [.sw-cal_i&]:[background:var(--purple)] [.sw-cal_i&]:[color:#fff] [.sw-wells_i&]:[background:#e2d9ff] [.sw-wells_i&]:[border-color:#c9b8ff] [.sw-shot_i&]:[background:var(--purple)] [.sw-shot_i&]:[border-color:var(--purple)] [.lf\_\_seg_button&]:[color:#fff] [.tc\_\_why_li&]:[opacity:1] [.sl\_\_tabs_button&]:[color:#fff] [.ar\_\_toc_a&]:[color:var(--ink-2)] [.ct-needs_button&]:[color:#fff] [.wa\_\_zones_li&]:[background:var(--grad)] [.wa\_\_zones_li&]:[border-color:transparent] [.wa\_\_zones_li&_small]:[color:#fff] [.wa\_\_zones_li&_b]:[color:#fff] [.wa\_\_zones_li&_em]:[color:#fff] [.se\_\_dots_i&]:[background:var(--purple)] [.ct-needs_button&]:[background:var(--grad)] [.ct-needs_button&]:[border-color:transparent] [.sc-cal_i&]:[background:var(--purple)] [.sc-cal_i&]:[color:#fff] [.ccp_button&]:[background:var(--purple)] [.ccp_button&]:[color:#fff] [.pa-art\_\_seg_button&]:[background:var(--grad)] [.pa-art\_\_seg_button&]:[color:#fff] [.pa-art\_\_steps_li&]:[background:var(--purple)] [.pa-art\_\_steps_li&]:[border-color:var(--purple)] [.pa-art\_\_steps_li&]:[color:#fff] [.ab-orbit\_\_rings_line&]:[stroke:var(--purple)] [.ab-orbit\_\_rings_line&]:[stroke-width:2]` : ''}`} onClick={() => setK(i)}>
                {k === i && <motion.span layoutId="cl-pill" className="need__pill [position:absolute] [inset:-1px] [border-radius:6rem] [z-index:0] [background:var(--grad)]" transition={{ type: 'spring', stiffness: 260, damping: 32 }} />}
                <span>{l.track}</span>
              </button>
            ))}
          </div>
        </LayoutGroup>
      </div>
      <div className="cl__stairs [display:grid] [grid-template-columns:repeat(4,_minmax(0,_1fr))] [gap:1.6rem] [align-items:end] [margin-top:4.8rem] [@media(max-width:_1279px)]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] [@media(max-width:_640px)]:[grid-template-columns:minmax(0,_1fr)]! [@media(max-width:_640px)]:[align-items:stretch]">
        {tr.steps.map((r, i) => (
          <motion.div key={tr.track + r.title} className={String.raw`cl__step [position:relative] [display:flex] [flex-direction:column] [border-radius:2.4rem] [background:#f8f6ff] [border:1px_solid_#efebfb] [&_b]:[font-weight:500] [&_b]:[font-size:2.2rem] [&_b]:[letter-spacing:-0.04rem] [&_b]:[color:var(--ink-2)] [&_small]:[font-size:1.5rem] [&_small]:[color:#6b6f7c] [@media(max-width:_640px)]:[margin-top:0]! [@media(max-width:_640px)]:[transform:none]! ${i === tr.steps.length - 1 ? 'is-top' : ''}`} style={{ ['--h' as string]: `${19 + i * 5}rem` }}
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: ease.out, delay: i * 0.08 }}>
            <div className="cl__top [display:flex] [flex-direction:column] [gap:0.6rem] [padding:2.4rem_2.4rem_2rem]">
              <span className="cl__n [display:flex] [align-items:center] [gap:1rem] [font-family:var(--f-mono)] [font-size:1.2rem] [color:var(--purple)] [&_em]:[font-style:normal] [&_em]:[padding:0.3rem_0.8rem] [&_em]:[border-radius:99rem] [&_em]:[background:#ebe5ff] [&_em]:[font-size:1.1rem] [&_em]:[letter-spacing:0.02em]">0{i + 1}{i === 0 && <em>Where most people start</em>}</span>
              <b>{r.title}</b>
              <small>{r.note}</small>
            </div>
            <motion.div className="cl__bar [min-height:var(--h)] [display:flex] [flex-direction:column] [gap:1.2rem] [padding:2.4rem] [border-radius:0_0_2.3rem_2.3rem] [background:linear-gradient(180deg,_#efe9ff,_#ddd2ff)] [transform-origin:bottom] [&_ul]:[list-style:none] [&_ul]:[display:flex] [&_ul]:[flex-direction:column] [&_ul]:[gap:1rem] [&_li]:[display:flex] [&_li]:[gap:0.9rem] [&_li]:[align-items:flex-start] [&_li]:[font-size:1.5rem] [&_li]:[line-height:1.4] [&_li]:[color:#3b3f52] [&_li_svg]:[flex:none] [&_li_svg]:[margin-top:0.3rem] [&_li_svg]:[color:var(--purple)] [.cl\_\_step.is-top_&]:[background:var(--grad)] [.cl\_\_step.is-top_&_li]:[color:#fff] [.cl\_\_step.is-top_&_li_svg]:[color:#fff] [@media(max-width:_640px)]:[min-height:0]" initial={{ scaleY: 0.4, opacity: 0 }} animate={{ scaleY: 1, opacity: 1 }} transition={{ duration: 0.7, ease: ease.out, delay: 0.15 + i * 0.08 }}>
              <p className="cl__k [font-family:var(--f-mono)] [font-size:1.15rem] [letter-spacing:0.08em] [text-transform:uppercase] [color:#7a62e8] [.cl\_\_step.is-top_&]:[color:rgba(255,_255,_255,_0.75)]">You’ll own</p>
              <ul>{r.owns.map((o) => <li key={o}><Check size={14} strokeWidth={3} />{o}</li>)}</ul>
              <span className="cl__badge [margin-top:auto] [align-self:flex-start] [padding:0.6rem_1.2rem] [border-radius:99rem] [background:rgba(255,_255,_255,_0.75)] [font-size:1.3rem] [color:var(--purple)] [font-weight:500] [.cl\_\_step.is-top_&]:[background:rgba(255,_255,_255,_0.2)] [.cl\_\_step.is-top_&]:[color:#fff] [@media(max-width:_640px)]:[margin-top:0.8rem]">{r.badge}</span>
            </motion.div>
            {i < tr.steps.length - 1 && <span className="cl__arrow [position:absolute] [z-index:2] [right:-2.2rem] [top:2rem] [width:2.8rem] [height:2.8rem] [border-radius:50%] [display:grid] [place-items:center] [background:#fff] [border:1px_solid_#e3dbfd] [color:var(--purple)] [box-shadow:0_0.6rem_1.4rem_rgba(80,_40,_220,_0.12)] [@media(max-width:_1279px)]:[display:none]" aria-hidden><ArrowUpRight size={16} /></span>}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

const PERK_ICONS = [<GraduationCap key="a" />, <TrendingUp key="b" />, <Laptop key="c" />, <Users key="d" />, <BookOpen key="e" />, <HeartPulse key="f" />];

export function CareersPage() {
  useEffect(setMeta, []);
  return (
    <main className="page page--tail [overflow-x:clip] [@media(max-width:_640px)]:[&:has(.mbar)]:[padding-bottom:7.2rem] [padding-bottom:14rem] [@media(max-width:_1279px)]:[padding-bottom:8rem]">
      <section className="ch container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [display:grid] [grid-template-columns:minmax(0,_1fr)_minmax(0,_1fr)] [gap:6rem] [align-items:center] [padding-top:16.4rem] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1279px)]:[padding-top:12rem] [@media(max-width:_1279px)]:[gap:4rem]">
        <div className="ch__copy [display:flex] [flex-direction:column] [gap:2.4rem]">
          <motion.p className="eyebrow [font-family:var(--f-mono)] [font-size:1.6rem] [line-height:1.4] [text-transform:uppercase] [color:var(--ink)] [letter-spacing:0.02em] [.hero\_\_copy_&]:[margin-bottom:1.2rem] [.stmac\_\_intro_&]:[grid-column:1_/_-1]" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: ease.out, delay: 0.2 }}>/ Careers</motion.p>
          <SplitWords as="h1" className="page-title [font-weight:500] [font-size:6.12rem] [line-height:1.06] [letter-spacing:-0.18rem] [color:var(--ink-3)] [@media(max-width:_1279px)]:[font-size:4.32rem]" animateNow delay={0.3} stagger={0.05} lines={['Do the work that', 'gets doctors paid.']} bold={['paid.']} />
          <motion.p className="page-sub [font-size:1.8rem] [line-height:1.6] [color:#4a4f63] [max-width:56rem] [.ab-hero\_\_copy_&]:[max-width:64rem]" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.75 }}>
            We’re a 30+ person, US-based revenue cycle team in Plano, Texas. Every claim we get right is a practice that gets paid for the care it gave.
          </motion.p>
          <motion.div className="ch__stats [display:flex] [gap:4rem] [margin-top:0.8rem] [&_b]:[display:block] [&_b]:[font-weight:500] [&_b]:[font-size:4rem] [&_b]:[letter-spacing:-0.1rem] [&_b]:[color:var(--ink-2)] [&_small]:[font-size:1.4rem] [&_small]:[color:#6b6f7c]" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.9 }}>
            <div><b>30+</b><small>people on the team</small></div>
            <div><b>US</b><small>based, in Plano, TX</small></div>
            <div><b>{ROLES.length}</b><small>open roles</small></div>
          </motion.div>
          <motion.a href="#roles" className="ct-submit ch__cta [display:inline-flex] [align-items:center] [justify-content:center] [gap:1rem] [height:5.6rem] [border-radius:6rem] [color:#fff] [font-weight:500] [font-size:1.9rem] [transition:background_0.3s] [&:hover]:[background:#5a32ec] [&_svg]:[transition:transform_0.4s_cubic-bezier(.16,1,.3,1)] [&:hover_svg]:[transform:translateX(0.5rem)] [background:var(--grad)] [width:auto] [align-self:flex-start] [padding-inline:3.2rem] [margin-top:0.8rem] [.jr2\_\_form_&]:[margin-top:0] [.jr2\_\_form_&]:[width:auto] [.jr2\_\_form_&]:[padding-inline:2.4rem] [.jr2\_\_form_&]:[height:5.2rem]" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 1 }}>See open roles <ArrowRight size={18} /></motion.a>
        </div>
        <motion.div className="ch__stage [position:relative] [padding:4rem] [border-radius:3.2rem] [background:radial-gradient(120%_90%_at_85%_10%,_#ede6ff_0%,_#f6f3ff_45%,_#fbfaff_100%)] [border:1px_solid_var(--lav-border)]" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: ease.out, delay: 0.4 }}>
          <Wins />
        </motion.div>
      </section>

      <Roles />
      <Ladder />

      <section className="cp container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [padding-top:14rem]">
        <div className="cp__head [display:flex] [flex-direction:column] [gap:1.2rem] [margin-bottom:4rem]">
          <Eyebrow>/ Why people stay</Eyebrow>
          <SplitWords className="h-56 [font-weight:500] [font-size:5.6rem] [line-height:1.08] [letter-spacing:-0.12rem] [color:var(--ink-2)] [text-wrap:balance] [@media(max-width:_1279px)]:[font-size:3.8rem] [@media(max-width:_640px)]:[font-size:3.4rem]" lines={['A small team where', 'your work shows.']} stagger={0.04} />
        </div>
        <div className="cp__grid [display:grid] [grid-template-columns:repeat(3,_minmax(0,_1fr))] [gap:1.6rem] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)]">
          {PERKS.map(([t, d], i) => (
            <Reveal key={t} className="cp__card [@media(max-width:_1279px)]:[font-size:16px]! [@media(max-width:_1279px)]:[line-height:1.6] [padding:3.2rem] [border-radius:2.4rem] [background:#f8f6ff] [border:1px_solid_#efebfb] [display:flex] [flex-direction:column] [gap:1rem] [&_b]:[font-weight:500] [&_b]:[font-size:2.2rem] [&_b]:[color:var(--ink-2)] [&_p]:[font-size:1.6rem] [&_p]:[line-height:1.55] [&_p]:[color:#5b5f72]" delay={i * 0.05}>
              <span className="cp__icon [width:4.8rem] [height:4.8rem] [border-radius:1.4rem] [display:grid] [place-items:center] [background:#fff] [color:var(--purple)] [box-shadow:0_0.8rem_2rem_rgba(106,_65,_249,_0.1)] [margin-bottom:0.8rem]">{PERK_ICONS[i]}</span>
              <b>{t}</b><p>{d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="nx container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [padding-top:14rem] [@media(max-width:_1279px)]:[padding-top:10rem]">
        <div className="nx__head [display:flex] [flex-direction:column] [gap:1.2rem]">
          <Eyebrow>/ How we hire</Eyebrow>
          <SplitWords className="h-56 [font-weight:500] [font-size:5.6rem] [line-height:1.08] [letter-spacing:-0.12rem] [color:var(--ink-2)] [text-wrap:balance] [@media(max-width:_1279px)]:[font-size:3.8rem] [@media(max-width:_640px)]:[font-size:3.4rem]" lines={['Four steps,', 'no guessing games.']} stagger={0.04} />
        </div>
        <ol className="nx__steps [position:relative] [list-style:none] [display:grid] [grid-template-columns:repeat(4,_minmax(0,_1fr))] [gap:2.4rem] [margin-top:5.6rem] [&_li]:[position:relative] [&_li]:[display:flex] [&_li]:[flex-direction:column] [&_li]:[gap:1rem] [&_li]:[padding-right:2rem] [&_b]:[font-weight:500] [&_b]:[font-size:2.4rem] [&_b]:[color:var(--ink-2)] [&_p]:[font-size:1.6rem] [&_p]:[line-height:1.55] [&_p]:[color:#5b5f72] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)]">
          <motion.span className="nx__line [position:absolute] [left:0] [right:0] [top:2.4rem] [height:2px] [background:linear-gradient(90deg,_#d6cdf7,_var(--purple))] [transform-origin:left] [@media(max-width:_1279px)]:[display:none]" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={vp} transition={{ duration: 1.6, ease: ease.inOut }} aria-hidden />
          {HIRING.map(([t, d], i) => (
            <motion.li key={t} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 0.7, ease: ease.out, delay: 0.3 + i * 0.18 }}>
              <span className="nx__n [width:4.8rem] [height:4.8rem] [border-radius:50%] [display:grid] [place-items:center] [background:#fff] [border:2px_solid_var(--purple)] [font-family:var(--f-mono)] [font-size:1.4rem] [color:var(--purple)] [margin-bottom:1.2rem]">0{i + 1}</span><b>{t}</b><p>{d}</p>
            </motion.li>
          ))}
        </ol>
      </section>

      <FAQ items={CAREER_FAQS} eyebrow="/ Careers FAQs" lines={['Questions candidates', 'ask us first.']}
        note="Something else on your mind? Email us and a real person will answer." cta={{ label: 'Email our team', href: 'mailto:info@affinitycore.co?subject=Careers%20question' }} />
    </main>
  );
}
