/**
 * Specialty page, straight-to-the-point version (v75).
 * Scan path: hero → what we handle → where the money leaks → proof → ask.
 * Everything that matters is readable without hovering or tapping; the only interaction kept is the
 * practice-size toggle on the leak list (and the FAQ).
 */
import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Check, Phone, X } from 'lucide-react';
import { CountUp, Eyebrow, Reveal, SplitWords } from './ui';
import { Link, goAnchor } from '../router';
import { ease, vp } from '../motion';
import { getSpecialtyLite, type SpecialtyFull } from '../data/specialties';

const plain = (s: SpecialtyFull) => (s.short && /^[A-Z/]+$/.test(s.short) ? s.short : s.name.toLowerCase());

/* ================================================================== */
/* 1. What we handle: what we bill + what we run, no clicks needed     */
/* ================================================================== */
export function Handle({ s }: { s: SpecialtyFull }) {
  const p = plain(s);
  const run: [string, string, string][] = [
    ['Eligibility and benefits', 'Checked before every visit.', '/services/revenue-cycle-management'],
    ['Prior authorizations', s.auth ? 'Requested before scheduling, tracked against the 72-hour / 7-day CMS clock.' : 'Checked for every service that needs one.', '/services/revenue-cycle-management'],
    ['Certified coding', `Coders who bill ${p} every day.`, '/services/medical-coding'],
    ['Same-day claim submission', 'Scrubbed against each payer’s rules first.', '/services/medical-billing'],
    ['Denials and appeals', 'Worked by reason code, appealed before the deadline.', '/services/denial-management'],
    ['A/R follow-up', 'Aged claims chased until they pay or close.', '/services/ar-recovery'],
    ['Credentialing', 'New providers enrolled before their first visit.', '/services/credentialing'],
    ['Monthly report', 'Denial rate, days in A/R and collections, reviewed with you.', '/services/revenue-cycle-management'],
  ];
  return (
    <section className="hd container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [padding-top:12rem] [@media(max-width:_1279px)]:[padding-top:8rem]" id="handle">
      <div className="hd__head [display:flex] [flex-direction:column] [align-items:center] [gap:1.2rem] [text-align:center]">
        <Eyebrow>/ What we handle</Eyebrow>
        <SplitWords className="h-56 [font-weight:500] [font-size:5.6rem] [line-height:1.08] [letter-spacing:-0.12rem] [color:var(--ink-2)] [text-wrap:balance] [@media(max-width:_1279px)]:[font-size:3.8rem] [@media(max-width:_640px)]:[font-size:3.4rem]" lines={[`Everything ${p} billing needs,`, 'handled by one team.']} stagger={0.04} />
      </div>
      <div className="hd__grid [display:grid] [grid-template-columns:minmax(0,_1fr)_minmax(0,_1.2fr)] [gap:2.4rem] [margin-top:4.8rem] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1279px)]:[gap:1.6rem] [@media(max-width:_1279px)]:[margin-top:3.2rem]">
        <motion.div className="hd__col [padding:3.6rem] [border-radius:3.2rem] [background:#f8f6ff] [border:1px_solid_#eee9ff] [@media(max-width:_1279px)]:[padding:2.4rem_2rem] [@media(max-width:_1279px)]:[border-radius:2.4rem]" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 0.8, ease: ease.out }}>
          <p className="hd__kicker [font-family:var(--f-mono)] [font-size:1.3rem] [letter-spacing:0.08em] [text-transform:uppercase] [color:var(--purple)]">What we bill for {p}</p>
          <ul className="hd__bill [@media(max-width:_1279px)]:[font-size:16px]! [@media(max-width:_1279px)]:[line-height:1.6] [display:flex] [flex-direction:column] [margin-top:2rem] [&_li]:[display:grid] [&_li]:[grid-template-columns:7.6rem_minmax(0,_1fr)] [&_li]:[align-items:baseline] [&_li]:[gap:1.2rem] [&_li]:[padding:1.4rem_0] [&_li]:[border-bottom:1px_solid_#ebe6fb] [&_li]:[font-size:1.7rem] [&_li]:[color:var(--ink-2)] [&_li:last-child]:[border-bottom:0] [&_code]:[font-family:var(--f-mono)] [&_code]:[font-size:1.4rem] [&_code]:[color:var(--purple)]">
            {s.ledger.rows.map((r) => <li key={r.code}><code>{r.code}</code><span>{r.name}</span></li>)}
          </ul>
        </motion.div>
        <motion.div className="hd__col hd__col--run [padding:3.6rem] [border-radius:3.2rem] [border:1px_solid_#eee9ff] [background:#fff] [border-color:#ece8fa]! [box-shadow:0_2.4rem_6rem_rgba(40,_20,_120,_0.07)] [@media(max-width:_1279px)]:[padding:2.4rem_2rem] [@media(max-width:_1279px)]:[border-radius:2.4rem]" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 0.8, ease: ease.out, delay: 0.1 }}>
          <p className="hd__kicker [font-family:var(--f-mono)] [font-size:1.3rem] [letter-spacing:0.08em] [text-transform:uppercase] [color:var(--purple)]">What we run for you</p>
          <ul className="hd__run [display:grid] [grid-template-columns:repeat(2,_minmax(0,_1fr))] [gap:2.4rem_2.8rem] [margin-top:2.4rem] [&_li]:[display:flex] [&_li]:[gap:1.2rem] [&_a]:[display:flex] [&_a]:[flex-direction:column] [&_a]:[gap:0.4rem] [&_a]:[min-width:0] [&_b]:[font-weight:500] [&_b]:[font-size:1.8rem] [&_b]:[color:var(--ink-2)] [&_b]:[transition:color_0.3s] [&_a:hover_b]:[color:var(--purple)] [&_small]:[font-size:1.5rem] [&_small]:[line-height:1.5] [&_small]:[color:#5b5f72] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1279px)]:[gap:1.8rem]">
            {run.map(([t, d, to]) => (
              <li key={t}><span className="hd__tick [flex:none] [width:2.4rem] [height:2.4rem] [margin-top:0.1rem] [border-radius:50%] [display:grid] [place-items:center] [background:var(--purple)] [color:#fff] [&_svg]:[width:1.3rem] [&_svg]:[height:1.3rem]"><Check strokeWidth={3} /></span><Link to={to}><b>{t}</b><small>{d}</small></Link></li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* 2. Where the money leaks: readable rows + practice-size toggle      */
/* ================================================================== */
export function LeakList({ s }: { s: SpecialtyFull }) {
  const L = s.leak!;
  const [size, setSize] = useState(L.sizes[1]);
  const expected = L.perProvider * size;
  const lost = L.leaks.reduce((t, l) => t + l.pct, 0);
  const max = Math.max(...L.leaks.map((l) => l.pct));
  const money = (pct: number) => Math.round((expected * pct) / 100);
  const usd = (n: number) => `$${n.toLocaleString('en-US')}`;
  return (
    <section className="ll container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [padding-top:12rem] [@media(max-width:_1279px)]:[padding-top:8rem]">
      <div className="ll__head [display:grid] [grid-template-columns:minmax(0,_1fr)_minmax(0,_1fr)] [gap:4rem] [align-items:end] [&>div]:[display:flex] [&>div]:[flex-direction:column] [&>div]:[gap:1.2rem] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1279px)]:[gap:1.6rem]">
        <div>
          <Eyebrow>{L.eyebrow}</Eyebrow>
          <SplitWords className="h-56 [font-weight:500] [font-size:5.6rem] [line-height:1.08] [letter-spacing:-0.12rem] [color:var(--ink-2)] [text-wrap:balance] [@media(max-width:_1279px)]:[font-size:3.8rem] [@media(max-width:_640px)]:[font-size:3.4rem]" lines={L.lines} stagger={0.04} />
        </div>
        <Reveal as="p" className="ll__intro [font-size:1.8rem] [line-height:1.6] [color:#4a4f63] [max-width:60rem]">{L.intro}</Reveal>
      </div>

      <motion.div className="ll__card [margin-top:4rem] [padding:3.6rem] [border-radius:3.2rem] [background:#fff] [border:1px_solid_#ece8fa] [box-shadow:0_3rem_8rem_rgba(40,_20,_120,_0.08)] [@media(max-width:_1279px)]:[padding:2.4rem_2rem] [@media(max-width:_1279px)]:[border-radius:2.4rem]" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 1, ease: ease.out }}>
        <div className="ll__top [display:flex] [justify-content:space-between] [align-items:center] [gap:2.4rem] [flex-wrap:wrap] [padding-bottom:2.8rem] [border-bottom:1px_solid_#ece8fa]">
          <div className="ll__total [display:flex] [align-items:baseline] [gap:1.6rem] [flex-wrap:wrap] [min-width:0] [&_b]:[font-weight:600] [&_b]:[font-size:5.6rem] [&_b]:[line-height:1] [&_b]:[letter-spacing:-0.16rem] [&_b]:[color:var(--purple)] [&_b]:[font-variant-numeric:tabular-nums] [&>span]:[font-size:1.7rem] [&>span]:[color:#4a4f63] [&>span]:[max-width:44rem] [&_strong]:[color:var(--ink-2)] [&_strong]:[font-weight:600] [@media(max-width:_1279px)]:[&_b]:[font-size:4.4rem]">
            <b><CountUp value={money(lost)} prefix="$" duration={1.2} /></b>
            <span>leaks out every month for {size === 1 ? `a solo ${L.unit[0]}` : `${size} ${L.unit[1]}`}, about <strong>{usd(money(lost) * 12)}</strong> a year</span>
          </div>
          <div className="lf__seg [display:inline-flex] [padding:0.4rem] [border-radius:99rem] [background:#fff] [border:1px_solid_var(--lav-border)] [&_button]:[position:relative] [&_button]:[padding:0.9rem_1.8rem] [&_button]:[border-radius:99rem] [&_button]:[font-size:1.4rem] [&_button]:[color:#5b5f72] [&_button]:[transition:color_0.25s] [&_button>span:last-child]:[position:relative] [&_button]:[white-space:nowrap] [@media(max-width:_640px)]:[&_button]:[padding:0.8rem_1.6rem]" role="radiogroup" aria-label="Practice size">
            {L.sizes.map((n) => (
              <button key={n} role="radio" aria-checked={size === n} className={size === n ? String.raw`is-on [.assess\_\_steps_span&]:[color:var(--navy)] [.assess\_\_steps_span&_b]:[background:var(--purple)] [.assess\_\_steps_span&_b]:[border-color:var(--purple)] [.assess\_\_steps_span&_b]:[color:#fff] [.assess\_\_steps_i&::after]:[transform:scaleX(1)] [.cx-read\_\_n_i&]:[width:2.4rem] [.cx-read\_\_n_i&]:[background:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [.sg\_\_toc_button&]:[color:var(--purple)] [.sg\_\_toc_button&]:[border-left-color:var(--purple)] [.pg\_\_toc_button&]:[color:#fff] [.pg\_\_toc_button&_small]:[color:rgba(255,_255,_255,_0.7)] [.pg\_\_dots_i&]:[width:2.4rem] [.pg\_\_dots_i&]:[background:var(--purple)] [.stfd\_\_tabs_button&]:[color:#fff] [.se\_\_dots_i&]:[width:6.4rem] [.sw-anes\_\_bar_i&]:[background:var(--grad)] [.sw-body_circle&]:[fill:var(--purple)] [.sw-vial\_\_body_i&]:[background:var(--grad)] [.sw-vial\_\_body_i&_small]:[color:#fff] [.sw-wound\_\_grid_i&]:[background:#c9b8ff] [.sw-wound\_\_grid_i&]:[border-color:transparent] [.sw-cal_i&]:[background:var(--purple)] [.sw-cal_i&]:[color:#fff] [.sw-wells_i&]:[background:#e2d9ff] [.sw-wells_i&]:[border-color:#c9b8ff] [.sw-shot_i&]:[background:var(--purple)] [.sw-shot_i&]:[border-color:var(--purple)] [.lf\_\_seg_button&]:[color:#fff] [.tc\_\_why_li&]:[opacity:1] [.sl\_\_tabs_button&]:[color:#fff] [.ar\_\_toc_a&]:[color:var(--ink-2)] [.ct-needs_button&]:[color:#fff] [.wa\_\_zones_li&]:[background:var(--grad)] [.wa\_\_zones_li&]:[border-color:transparent] [.wa\_\_zones_li&_small]:[color:#fff] [.wa\_\_zones_li&_b]:[color:#fff] [.wa\_\_zones_li&_em]:[color:#fff] [.se\_\_dots_i&]:[background:var(--purple)] [.ct-needs_button&]:[background:var(--grad)] [.ct-needs_button&]:[border-color:transparent] [.sc-cal_i&]:[background:var(--purple)] [.sc-cal_i&]:[color:#fff] [.ccp_button&]:[background:var(--purple)] [.ccp_button&]:[color:#fff] [.pa-art\_\_seg_button&]:[background:var(--grad)] [.pa-art\_\_seg_button&]:[color:#fff] [.pa-art\_\_steps_li&]:[background:var(--purple)] [.pa-art\_\_steps_li&]:[border-color:var(--purple)] [.pa-art\_\_steps_li&]:[color:#fff] [.ab-orbit\_\_rings_line&]:[stroke:var(--purple)] [.ab-orbit\_\_rings_line&]:[stroke-width:2]` : ''} onClick={() => setSize(n)}>
                {size === n && <motion.span layoutId={`ll-seg-${s.slug}`} className="lf__segbg [position:absolute] [inset:0] [border-radius:inherit] [background:var(--grad)]" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                <span>{n === 1 ? 'Solo' : <>{n}<em className="lf__unit [font-style:normal] [@media(max-width:_640px)]:[display:none]"> {L.unit[1]}</em></>}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="ll__cols [display:grid] [grid-template-columns:minmax(0,_1.2fr)_minmax(0,_1fr)_18rem] [padding:2rem_0_1rem] [font-family:var(--f-mono)] [font-size:1.2rem] [letter-spacing:0.06em] [text-transform:uppercase] [color:#8a8ea0] [@media(max-width:_1279px)]:[display:none] [gap:1.2rem] [&_span:nth-child(1)]:[color:#d93a43] [&_span:nth-child(2)]:[color:#128a5b] [&_span:nth-child(1)]:[padding-left:2rem] [&_span:nth-child(2)]:[padding-left:2rem]" aria-hidden><span>Where it leaks</span><span>How we stop it</span><span>Per month</span></div>
        <ol className="ll__rows [&_li]:[display:grid] [&_li]:[grid-template-columns:minmax(0,_1.2fr)_minmax(0,_1fr)_18rem] [&_li]:[align-items:start] [@media(max-width:_1279px)]:[&_li]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1279px)]:[&_li]:[position:relative] [&_li]:[gap:1.2rem] [&_li]:[padding:1rem_0] [&_li]:[border-top:0] [@media(max-width:_1279px)]:[&_li]:[gap:0.8rem] [@media(max-width:_1279px)]:[&_li]:[padding:1.6rem_0] [@media(max-width:_1279px)]:[&_li]:[border-top:1px_solid_#f0edf8]">
          {L.leaks.map((l, i) => (
            <motion.li key={l.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.6, ease: ease.out, delay: i * 0.06 }}>
              <div className="ll__leak [@media(max-width:_1279px)]:[font-size:16px]! [display:flex] [gap:1.2rem] [font-size:1.6rem] [line-height:1.55] [color:#4a4f63] [&_b]:[color:var(--ink-2)] [&_b]:[font-weight:600] [height:100%] [padding:1.6rem_2rem] [border-radius:1.6rem] [background:linear-gradient(90deg,_#fff1f1,_#fff8f8)] [box-shadow:inset_3px_0_0_#f2777d] [.ll\_\_rows_li:hover_&]:[background:#ffeaea] [@media(max-width:_1279px)]:[padding:1.4rem_1.6rem]"><X className="ll__x [flex:none] [width:2rem] [height:2rem] [margin-top:0.2rem] [padding:0.35rem] [border-radius:50%] [background:#fde2e3] [color:#d93a43]" strokeWidth={3} aria-hidden /><p><b>{l.label}.</b> {l.cause}</p></div>
              <div className="ll__fix [@media(max-width:_1279px)]:[font-size:16px]! [display:flex] [gap:1.2rem] [font-size:1.6rem] [line-height:1.55] [height:100%] [padding:1.6rem_2rem] [border-radius:1.6rem] [background:linear-gradient(90deg,_#ecfaf3,_#f5fcf8)] [box-shadow:inset_3px_0_0_#2fb67c] [color:#2c4a3d] [.ll\_\_rows_li:hover_&]:[background:#e3f7ed] [@media(max-width:_1279px)]:[padding:1.4rem_1.6rem]"><Check className="ll__ok [flex:none] [width:2rem] [height:2rem] [margin-top:0.2rem] [padding:0.35rem] [border-radius:50%] [background:#1fa86f] [color:#fff]" strokeWidth={3} aria-hidden /><p>{l.fix}</p></div>
              <div className="ll__amt [display:flex] [flex-direction:column] [gap:0.8rem] [align-items:flex-end] [&_b]:[font-weight:600] [&_b]:[font-size:2rem] [&_b]:[font-variant-numeric:tabular-nums] [@media(max-width:_1279px)]:[order:-1] [@media(max-width:_1279px)]:[flex-direction:row] [@media(max-width:_1279px)]:[align-items:center] [@media(max-width:_1279px)]:[gap:1.6rem] [@media(max-width:_1279px)]:[&_b]:[flex:none] [@media(max-width:_1279px)]:[&_b]:[font-size:1.8rem] [justify-content:center] [height:100%] [padding:1.6rem_0_1.6rem_1.2rem] [&_b]:[color:#d93a43] [@media(max-width:_1279px)]:[padding:0]">
                <b>−{usd(money(l.pct))}</b>
                <span className="ll__meter [width:100%] [height:0.6rem] [border-radius:1rem] [overflow:hidden] [display:flex] [justify-content:flex-end] [&_i]:[display:block] [&_i]:[width:100%] [&_i]:[height:100%] [&_i]:[border-radius:1rem] [&_i]:[transform-origin:right_center] [background:#fdeaea] [&_i]:[background:linear-gradient(90deg,_#f2777d,_#d93a43)]"><motion.i initial={{ scaleX: 0 }} whileInView={{ scaleX: l.pct / max }} viewport={{ once: true }} transition={{ duration: 0.8, ease: ease.out, delay: 0.2 + i * 0.06 }} /></span>
              </div>
            </motion.li>
          ))}
        </ol>
        <p className="lf__note [@media(max-width:_1279px)]:[font-size:13.5px]! [margin-top:2rem] [font-size:1.3rem] [line-height:1.5] [color:#8a8ea0] [&_a]:[color:#8a8ea0] [&_a]:[text-decoration:underline] [&_a]:[text-underline-offset:0.25em]">{L.note}{L.source && <> <a href={L.source.href} target="_blank" rel="noopener noreferrer">{L.source.label}</a>.</>}</p>
      </motion.div>
    </section>
  );
}

/* ================================================================== */
/* 3. "Often billed alongside": one line of links under the FAQ        */
/* ================================================================== */
export function AlsoBilled({ s }: { s: SpecialtyFull }) {
  const rel = s.related.map(getSpecialtyLite).filter(Boolean);
  if (!rel.length) return null;
  return (
    <nav className="ab container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [display:flex] [flex-wrap:wrap] [align-items:center] [gap:1rem_1.2rem] [padding-top:4rem] [font-size:1.6rem] [color:#6b6f7c] [&_a]:[padding:0.8rem_1.6rem] [&_a]:[border-radius:2rem] [&_a]:[border:1px_solid_var(--lav-border)] [&_a]:[color:var(--ink-2)] [&_a]:[transition:border-color_0.3s,_color_0.3s] [&_a:hover]:[border-color:var(--purple)] [&_a:hover]:[color:var(--purple)]" aria-label="Related specialties">
      <span>Often billed alongside {s.name.toLowerCase()}:</span>
      {rel.map((r) => <Link key={r!.slug} to={`/specialties/${r!.slug}`}>{r!.name}</Link>)}
      <Link to="/specialties" className="ab__all [.ab_&]:[display:inline-flex] [.ab_&]:[align-items:center] [.ab_&]:[gap:0.6rem] [.ab_&]:[border:0] [.ab_&]:[color:var(--purple)] [.ab_&]:[font-weight:500]">All specialties <ArrowRight size={16} /></Link>
    </nav>
  );
}

/* ================================================================== */
/* 4. Sticky mobile bar: call or start the assessment from anywhere    */
/* ================================================================== */
export function MobileBar() {
  return (
    <div className="mbar [display:none] [@media(max-width:_640px)]:[position:fixed] [@media(max-width:_640px)]:[z-index:60] [@media(max-width:_640px)]:[left:0] [@media(max-width:_640px)]:[right:0] [@media(max-width:_640px)]:[bottom:0] [@media(max-width:_640px)]:[display:flex] [@media(max-width:_640px)]:[gap:0.8rem] [@media(max-width:_640px)]:[padding:1rem_max(1.6rem,_env(safe-area-inset-right,_0px))_calc(1rem_+_env(safe-area-inset-bottom,_0px))_max(1.6rem,_env(safe-area-inset-left,_0px))] [@media(max-width:_640px)]:[background:rgba(255,_255,_255,_0.94)] [@media(max-width:_640px)]:[backdrop-filter:blur(10px)] [@media(max-width:_640px)]:[-webkit-backdrop-filter:blur(10px)] [@media(max-width:_640px)]:[border-top:1px_solid_#ece8fa] [@media(max-width:_640px)]:[&_a]:[height:4.8rem] [@media(max-width:_640px)]:[&_a]:[display:inline-flex] [@media(max-width:_640px)]:[&_a]:[align-items:center] [@media(max-width:_640px)]:[&_a]:[justify-content:center] [@media(max-width:_640px)]:[&_a]:[gap:0.8rem] [@media(max-width:_640px)]:[&_a]:[border-radius:3rem] [@media(max-width:_640px)]:[&_a]:[font-weight:600] [@media(max-width:_640px)]:[&_a]:[font-size:1.5rem] [@media(max-width:_640px)]:[&_button]:[height:4.8rem] [@media(max-width:_640px)]:[&_button]:[display:inline-flex] [@media(max-width:_640px)]:[&_button]:[align-items:center] [@media(max-width:_640px)]:[&_button]:[justify-content:center] [@media(max-width:_640px)]:[&_button]:[gap:0.8rem] [@media(max-width:_640px)]:[&_button]:[border-radius:3rem] [@media(max-width:_640px)]:[&_button]:[font-weight:600] [@media(max-width:_640px)]:[&_button]:[font-size:1.5rem]" role="region" aria-label="Quick contact">
      <a className="mbar__call [@media(max-width:_640px)]:[flex:none] [@media(max-width:_640px)]:[padding:0_2rem] [@media(max-width:_640px)]:[border:1px_solid_var(--lav-border)] [@media(max-width:_640px)]:[color:var(--purple)]" href="tel:+12148512698"><Phone size={18} /> Call</a>
      <button type="button" className="mbar__go [@media(max-width:_640px)]:[flex:1] [@media(max-width:_640px)]:[background:var(--purple)] [@media(max-width:_640px)]:[color:#fff]" onClick={() => goAnchor('assessment')}>Free revenue assessment <ArrowRight size={18} /></button>
    </div>
  );
}
