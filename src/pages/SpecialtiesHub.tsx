import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import { ArrowRight, BookOpen, Check, CheckCircle2, X, Search } from 'lucide-react';
import { Button, Eyebrow, Reveal, SplitWords, CountUp } from '../components/ui';
import { CTA, FAQ } from '../sections/Closing';
import { Assessment } from '../sections/Assessment';
import { Proof } from './ServicesHub';
import { Link } from '../router';
import { SPECIALTIES, GROUPS, RULES, SPOT, ERROR_TYPES, getSpecialtyLite, matches, type RuleId, type SpecialtyLite } from '../data/specialties';
import { ease } from '../motion';
// Perf: pre-blurred copy of fluted-purple.jpg replaces a live backdrop-filter blur on these panels
import fluted from '../assets/fluted-frost.jpg';

const CONFIRM = '[Confirm with Affinity Core]';
const ruleShort = (id: RuleId) => RULES.find((r) => r.id === id)!.short;

/** "?focus=slug" on the hash (from nav / footer links) */
const readFocus = () => new URLSearchParams(window.location.hash.split('?')[1] ?? '').get('focus');

/* ================= 1. Hero: the rulebook deck ================= */
const DECK = ['cardiology', 'mental-health', 'anesthesia', 'orthopedics', 'gastroenterology', 'radiology', 'oncology'].map((s) => getSpecialtyLite(s)!);

function RuleCard({ s }: { s: SpecialtyLite }) {
  const Icon = s.icon;
  const [code, label] = s.codes[0];
  return (
    <>
      <div className="rb__top">
        <span className="rb__icon"><Icon /></span>
        <span className="rb__name"><b>{s.name}</b><small>{s.group}</small></span>
      </div>
      <div className="rb__code"><code>{code}</code><span>{label}</span></div>
      <div className="rb__watch"><small>Watch for</small><p>{s.watch}</p></div>
      <ul className="rb__rules">{(Object.keys(s.rules) as RuleId[]).map((r) => <li key={r}>{ruleShort(r)}</li>)}</ul>
    </>
  );
}

function Rulebook() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setI((v) => (v + 1) % DECK.length), 3200);
    return () => clearInterval(id);
  }, [paused]);
  const s = DECK[i];
  return (
    <div className="rb" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="rb__bg" aria-hidden><img src={fluted} alt="" /></div>
      <div className="rb__count" aria-hidden>
        <span className="rb__count-n">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.b key={i} initial={{ y: '100%' }} animate={{ y: '0%' }} exit={{ y: '-100%' }} transition={{ duration: 0.6, ease: ease.out }}>0{i + 1}</motion.b>
          </AnimatePresence>
        </span>
        <span>/ 0{DECK.length} rulebooks</span>
      </div>
      <div className="rb__stack">
        <span className="rb__ghost rb__ghost--2" aria-hidden />
        <span className="rb__ghost rb__ghost--1" aria-hidden />
        <div className="rb__card" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={s.slug} className="rb__in"
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: ease.out } }} exit={{ opacity: 0, y: -6, transition: { duration: 0.18 } }}>
              <RuleCard s={s} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <div className="rb__dots" role="tablist" aria-label="Specialty examples">
        {DECK.map((d, k) => (
          <button key={d.slug} role="tab" aria-selected={k === i} aria-label={d.name} className={k === i ? 'is-on' : ''} onClick={() => setI(k)}>
            {k === i && !paused && <motion.i key={i} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 3.2, ease: 'linear' }} />}
            {k === i && paused && <i style={{ transform: 'scaleX(1)' }} />}
          </button>
        ))}
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="xh">
      <div className="xh__copy">
        <motion.p className="eyebrow" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: ease.out, delay: 0.2 }}>/ Specialty billing</motion.p>
        <SplitWords as="h1" className="page-title" animateNow delay={0.3} stagger={0.05} lines={['Every specialty', 'bills by its own', 'rulebook.']} bold={['rulebook.']} />
        <motion.p className="page-sub" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.8 }}>
          Time units in anesthesia. Split components in cardiology. Global periods in orthopedics. Your claims are coded by people who know your specialty’s rules, so they go out right the first time.
        </motion.p>
        <motion.div className="sh-hero__cta" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.95 }}>
          <Button>Get a free revenue assessment</Button>
          <Link to="#index" className="text-link">Find your specialty <ArrowRight size={18} /></Link>
        </motion.div>
      </div>
      <motion.div className="xh__stage" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: ease.out, delay: 0.4 }}>
        <Rulebook />
      </motion.div>
    </section>
  );
}

/* ================= 2. Index with rule lenses ================= */
function SpecialtySearch({ q, setQ }: { q: string; setQ: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const show = open || !!q;
  useEffect(() => { if (open) input.current?.focus(); }, [open]);
  return (
    <motion.div className={`xs ${show ? 'is-open' : ''}`} layout transition={{ type: 'spring', stiffness: 320, damping: 32 }}>
      <button type="button" className="xs__btn" aria-label={show ? 'Search specialties' : 'Open specialty search'} onClick={() => (show ? input.current?.focus() : setOpen(true))}>
        <Search size={18} />
      </button>
      <input ref={input} className="xs__input" type="search" value={q} placeholder="Specialty or CPT code"
        aria-label="Search specialties" tabIndex={show ? 0 : -1}
        onChange={(e) => setQ(e.target.value)} onBlur={() => { if (!q) setOpen(false); }}
        onKeyDown={(e) => { if (e.key === 'Escape') { setQ(''); setOpen(false); (e.target as HTMLInputElement).blur(); } }} />
      {q && <button type="button" className="xs__clear" aria-label="Clear search" onClick={() => { setQ(''); input.current?.focus(); }}><X size={16} /></button>}
    </motion.div>
  );
}

function Tile({ s, lens, focus }: { s: SpecialtyLite; lens: RuleId | null; focus: boolean }) {
  const Icon = s.icon;
  const hit = lens ? !!s.rules[lens] : true;
  const [hover, setHover] = useState(false);
  const mode = lens ? (hit ? 'rule' : 'miss') : hover ? 'watch' : 'codes';
  const body = (
    <>
      <span className="xt__top">
        <span className="xt__icon"><Icon /></span>
        {s.page && <span className="xt__go"><ArrowRight size={16} /></span>}
      </span>
      <b className="xt__name">{s.name}</b>
      <span className="xt__body">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={mode + (lens ?? '')} className={`xt__swap xt__swap--${mode}`}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.28, ease: ease.out }}>
            {mode === 'codes' && s.codes.map(([c, l]) => <code key={c} title={l}>{c}</code>)}
            {mode === 'watch' && s.watch}
            {mode === 'rule' && lens && s.rules[lens]}
            {mode === 'miss' && 'Not a usual issue'}
          </motion.span>
        </AnimatePresence>
      </span>
    </>
  );
  const cls = `xt ${lens ? (hit ? 'is-hit' : 'is-miss') : ''} ${focus ? 'is-focus' : ''} ${s.page ? 'has-page' : ''}`;
  const props = { onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false), onFocus: () => setHover(true), onBlur: () => setHover(false) };
  return (
    <motion.li layout="position" id={`sp-${s.slug}`} className="xt__li"
      variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: ease.out } } }}>
      {s.page
        ? <Link to={`/specialties/${s.slug}`} className={cls} aria-label={`${s.name} billing`} {...props}>{body}</Link>
        : <div className={cls} tabIndex={0} {...props}>{body}</div>}
    </motion.li>
  );
}

function Index() {
  const [lens, setLens] = useState<RuleId | null>(null);
  const [focus, setFocus] = useState<string | null>(readFocus);
  const [q, setQ] = useState('');
  const shown = SPECIALTIES.filter((s) => matches(s, q));
  const hits = lens ? shown.filter((s) => s.rules[lens]).length : shown.length;
  const rule = RULES.find((r) => r.id === lens);

  // Focus a specialty from "?focus=" links (on load and when the hash changes on this page)
  useEffect(() => {
    const on = () => setFocus(readFocus());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  useEffect(() => {
    if (!focus) return;
    const t = setTimeout(() => document.getElementById(`sp-${focus}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 1100);
    const u = setTimeout(() => setFocus(null), 5200);
    return () => { clearTimeout(t); clearTimeout(u); };
  }, [focus]);

  return (
    <section className="xi container" id="index">
      <div className="xi__head">
        <div className="xi__title">
          <Eyebrow>/ Find your specialty</Eyebrow>
          <SplitWords className="h-56" lines={['Pick your specialty.', 'See which rules hit it.']} stagger={0.04} />
        </div>
        <div className="xi__count" aria-live="polite">
          <b><CountUp value={hits} duration={0.6} /></b>
          <small>{q ? (shown.length === 1 ? 'specialty matches' : 'specialties match') : lens ? `of ${SPECIALTIES.length} specialties hit by this rule` : 'specialties we bill for'}</small>
        </div>
      </div>

      <div className="xi__bar">
      <LayoutGroup>
        <div className="need__chips xi__chips" role="tablist" aria-label="Billing rule lens">
          {[null, ...RULES.map((r) => r.id)].map((id) => {
            const on = lens === id;
            return (
              <button key={id ?? 'all'} role="tab" aria-selected={on} className={`need__chip ${on ? 'is-on' : ''}`} onClick={() => setLens(id)}>
                {on && <motion.span layoutId="xi-pill" className="need__pill" transition={{ type: 'spring', stiffness: 260, damping: 32, mass: 0.9 }} />}
                <span>{id ? RULES.find((r) => r.id === id)!.chip : 'All specialties'}</span>
              </button>
            );
          })}
        </div>
      </LayoutGroup>
      <SpecialtySearch q={q} setQ={setQ} />
      </div>
      <div className="xi__why">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p key={lens ?? 'all'} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }}>
            {rule ? <><b>{rule.label}.</b> {rule.why}</> : 'Hover a specialty for the one thing that trips its claims most often. Pick a rule above to see who it hits.'}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="xi__groups">
        {GROUPS.filter((g) => shown.some((s) => s.group === g)).map((g) => (
          <div key={g} className="xi__group">
            <p className="xi__glabel">{g} <span>{shown.filter((s) => s.group === g).length}</span></p>
            <motion.ul className="xi__grid" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}>
              {shown.filter((s) => s.group === g).map((s) => <Tile key={s.slug} s={s} lens={lens} focus={focus === s.slug} />)}
            </motion.ul>
          </div>
        ))}
        {q && !shown.length && (
          <div className="xi__empty">
            <p><b>No match for “{q}”.</b> We bill for more specialties than we list here.</p>
            <Link to="#assessment" className="text-link">Ask us about yours <ArrowRight size={18} /></Link>
          </div>
        )}
      </div>
      <Reveal className="xi__foot">
        <p>Don’t see yours? We likely bill for it.</p>
        <Link to="#assessment" className="text-link">Ask us on a free call <ArrowRight size={18} /></Link>
      </Reveal>
    </section>
  );
}

/* ================= 3. Spot the error ================= */
function SpotTheError() {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [score, setScore] = useState<boolean[]>([]);
  const c = SPOT[i];
  const done = pick !== null;
  const right = pick === c.answer;
  const choose = (k: number) => { if (done) return; setPick(k); setScore((s) => { const n = [...s]; n[i] = k === c.answer; return n; }); };
  const next = () => { setPick(null); setI((v) => (v + 1) % SPOT.length); };
  const spotted = score.filter(Boolean).length;
  return (
    <section className="se container">
      <motion.div className="se__panel" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 1, ease: ease.out }}>
        <div className="se__head">
          <div>
            <Eyebrow className="eyebrow--light">/ Try it yourself</Eyebrow>
            <SplitWords className="h-56 se__title" lines={['Spot the error', 'before the payer does.']} stagger={0.04} />
          </div>
          <div className="se__score">
            <small>Spotted</small>
            <b>{spotted}<span> / {SPOT.length}</span></b>
          </div>
        </div>

        <div className="se__main">
          <div className="se__slip-wrap">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={i} className="se__slip" initial={{ opacity: 0, x: 40, rotate: 2 }} animate={{ opacity: 1, x: 0, rotate: -1 }} exit={{ opacity: 0, x: -30, rotate: -3 }} transition={{ duration: 0.55, ease: ease.out }}>
                <div className="se__slip-top"><span>Claim line · {c.specialty}</span><span>0{i + 1} / 0{SPOT.length}</span></div>
                <div className="se__line">
                  <code className={done ? 'is-struck' : ''}>{c.code}</code>
                  <span>{c.desc}</span>
                </div>
                <div className="se__note"><small>From the note</small><p>{c.note}</p></div>
                <AnimatePresence>
                  {done && (
                    <motion.div className="se__fix" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.5, ease: ease.out }}>
                      <small>Corrected</small><b>{c.fix}</b>
                    </motion.div>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {done && (
                    <motion.span className="se__stamp" initial={{ scale: 2.2, opacity: 0, rotate: -24 }} animate={{ scale: 1, opacity: 1, rotate: -12 }} transition={{ type: 'spring', stiffness: 420, damping: 18 }}>
                      {right ? 'CAUGHT' : 'FIXED'}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="se__ask">
            <p className="se__q">What’s wrong with this line?</p>
            <div className="se__opts">
              {ERROR_TYPES.map((t, k) => {
                const isAns = done && k === c.answer;
                const isWrong = done && k === pick && !right;
                return (
                  <button key={t} className={`se__opt ${isAns ? 'is-ans' : ''} ${isWrong ? 'is-wrong' : ''} ${done && !isAns && !isWrong ? 'is-dim' : ''}`} onClick={() => choose(k)} disabled={done && !isAns && !isWrong}>
                    <span className="se__key">{String.fromCharCode(65 + k)}</span>
                    <span>{t}</span>
                    {isAns && <Check size={18} strokeWidth={2.5} />}
                    {isWrong && <X size={18} strokeWidth={2.5} />}
                  </button>
                );
              })}
            </div>
            <div className="se__why" aria-live="polite">
              <AnimatePresence mode="wait">
                {done && (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: ease.out }}>
                    <p><b>{right ? 'Right. ' : 'Close. '}</b>{c.why}</p>
                    <button className="se__next" onClick={next}>{i === SPOT.length - 1 ? 'Start over' : 'Next claim'} <ArrowRight size={18} /></button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        <div className="se__dots" aria-hidden>{SPOT.map((_, k) => <i key={k} className={`${k === i ? 'is-on' : ''} ${score[k] === true ? 'is-ok' : ''}`} />)}</div>
      </motion.div>
    </section>
  );
}

/* ================================================================== */
/* Editorial guide: the long-read fold (also the page's main SEO copy) */
/* ================================================================== */
const BREAKS: [string, string, string][] = [
  ['Modifiers', '25 · 59 · XU · 26 · TC', 'The same CPT code pays, gets cut, or gets denied depending on one two-character modifier, and every specialty leans on different ones.'],
  ['Bundling edits', 'NCCI PTP · MUE', 'Payers bundle services that are often done together. Unbundling them correctly needs documentation that proves the work was separate.'],
  ['Global periods', '0 · 10 · 90 days', 'Visits after a procedure are usually included in its fee. Bill one inside the window without the right modifier and it’s denied.'],
  ['Prior authorization', 'Imaging · infusions · surgery', 'Each payer keeps its own list. A study done without an approval on file is one of the hardest denials to overturn.'],
  ['Drugs and supplies', 'J-codes · NDC · units', 'Infusion, oncology and injection-heavy practices get underpaid when billed units don’t match the vial size and the dose given.'],
  ['Time and place', 'POS 02/10 · anesthesia units', 'Telehealth place-of-service codes, psychotherapy minutes and anesthesia base and time units all follow their own math.'],
];
const ASK = [
  'Which of your coders work our specialty every day, and what are their credentials?',
  'What are the top three denial reasons you see for practices like ours?',
  'How do you handle our high-dollar codes, and which ones do you review before they go out?',
  'How fast do you turn a CPT or payer policy change into a claim-scrubber rule?',
  'Can you show our denial rate and days in A/R against the specialty benchmark every month?',
];
const TOC = [['why', 'Why specialty billing is its own job'], ['breaks', 'Where specialty claims break'], ['ask', 'What to ask a billing company'], ['vs', 'Generalist vs specialty billing']];

function Guide() {
  const [on, setOn] = useState('why');
  useEffect(() => {
    const els = TOC.map(([id]) => document.getElementById(`sg-${id}`)).filter(Boolean) as HTMLElement[];
    const o = new IntersectionObserver((es) => { es.forEach((e) => { if (e.isIntersecting) setOn(e.target.id.slice(3)); }); }, { rootMargin: '-35% 0px -55% 0px' });
    els.forEach((e) => o.observe(e)); return () => o.disconnect();
  }, []);
  const jump = (id: string) => document.getElementById(`sg-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return (
    <section className="sg container" aria-labelledby="sg-title">
      <aside className="sg__toc">
        <Eyebrow>/ The guide</Eyebrow>
        <p className="sg__toc-t">Specialty billing, explained</p>
        <ol>{TOC.map(([id, t], i) => <li key={id}><button type="button" className={on === id ? 'is-on' : ''} onClick={() => jump(id)}><small>{String(i + 1).padStart(2, '0')}</small>{t}</button></li>)}</ol>
        <p className="sg__read"><BookOpen size={16} /> 5 min read</p>
      </aside>
      <article className="sg__body">
        <h2 id="sg-title" className="h-56">Why the same claim pays in one specialty and fails in another.</h2>
        <p className="sg__lede">Medical billing looks like one job from the outside: code the visit, send the claim, collect the money. Inside, every specialty plays by its own rulebook, and most lost revenue hides in the gaps between them.</p>

        <h3 id="sg-why">Why specialty billing is its own job</h3>
        <p>A family practice bills a high volume of office visits, vaccines and preventive care. An orthopedic group bills surgeries with 90-day global periods, injections and imaging. A behavioral health practice bills by the minute. The codes, modifiers, payer policies and documentation each one needs barely overlap.</p>
        <p>A generalist biller can submit all of those claims. What they usually can’t do is spot the specialty-specific mistake before the payer does: the missing modifier, the unit count that doesn’t match the dose, the authorization that expired a week before the procedure. Those small misses add up to the 5–10% of revenue many practices never see.</p>
        <blockquote className="sg__quote">Every denial has a cause. In specialty billing, the cause is almost always a rule the biller didn’t know applied.</blockquote>

        <h3 id="sg-breaks">Where specialty claims break</h3>
        <p>Across the 23 specialties we bill, the same six pressure points cause most denials and underpayments:</p>
        <ul className="sg__breaks">
          {BREAKS.map(([t, codes, body]) => <li key={t}><b>{t}</b><code>{codes}</code><p>{body}</p></li>)}
        </ul>

        <h3 id="sg-ask">What to ask a billing company about your specialty</h3>
        <p>Before you hand over your billing, ask questions that only a team with real specialty experience can answer well:</p>
        <ol className="sg__ask">{ASK.map((q) => <li key={q}><CheckCircle2 size={18} />{q}</li>)}</ol>

        <h3 id="sg-vs">Generalist vs specialty billing</h3>
        <div className="sg__table" role="table" aria-label="Generalist vs specialty billing">
          <div role="row" className="sg__tr sg__th"><span role="columnheader" /><span role="columnheader">Generalist billing</span><span role="columnheader">Specialty billing</span></div>
          {[
            ['Coding', 'Codes what’s on the superbill', 'Checks the note supports the code and modifier'],
            ['Denials', 'Resubmits and hopes', 'Fixes the root cause so it stops recurring'],
            ['Payer rules', 'General payer guidelines', 'Specialty LCDs, auth lists and bundling edits'],
            ['Reporting', 'Collections total', 'Denial rate and A/R vs your specialty’s benchmark'],
          ].map(([k, a, b]) => <div role="row" className="sg__tr" key={k}><b role="rowheader">{k}</b><span role="cell">{a}</span><span role="cell" className="is-us">{b}</span></div>)}
        </div>
        <p className="sg__end">Not sure where your specialty stands? <Link to="/contact" className="text-link">Get a free specialty billing review <ArrowRight size={16} /></Link></p>
      </article>
    </section>
  );
}

const FAQS = [
  ['What if my specialty isn’t listed?', 'We likely bill for it. Tell us on a free call and we’ll say plainly whether we’re a good fit.'],
  ['Do you work with multi-specialty groups?', 'Yes. Each specialty’s claims are coded by people who know its rules, under one point of contact and one monthly report.'],
  ['Are your coders certified?', `Yes, our coders hold AAPC or AHIMA credentials. ${CONFIRM}`],
  ['Do you bill for ASCs and hospital-based physicians?', 'Yes. ASC facility claims and professional claims for anesthesia, radiology and pathology each follow their own rules, and we bill both.'],
  ['How do you keep up with coding changes?', 'CPT codes update every January and ICD-10 every October, and payers change policies all year. We turn each change into a claim-scrubber rule before it costs you.'],
];

export function SpecialtiesHub() {
  useEffect(() => {
    document.title = 'Medical Billing by Specialty · Affinity Core';
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m); }
    m.setAttribute('content', 'Specialty-specific medical billing and coding for 23 specialties, from cardiology and anesthesia to mental health and wound care.');
  }, []);
  return (
    <main className="page">
      <Hero />
      <Index />
      <Guide />
      <Proof />
      <Assessment />
      <FAQ items={FAQS} eyebrow="/ Specialty FAQs" lines={['What practices ask', 'about specialty billing.']} />
      <CTA eyebrow="/ Your specialty, your numbers" lines={['See how your specialty', 'is really getting paid.']} />
    </main>
  );
}

