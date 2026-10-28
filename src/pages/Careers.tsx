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
    <div className="cw w-card">
      <div className="cw__head"><span><i />Today on the team</span><small>Sample day</small></div>
      <ul className="cw__list">
        <AnimatePresence initial={false} mode="popLayout">
          {rows.map(([t, w, v], i) => (
            <motion.li key={w} layout initial={{ opacity: 0, y: -24 }} animate={{ opacity: i === 0 ? 1 : 1 - i * 0.2, y: 0 }} exit={{ opacity: 0, y: 24 }} transition={{ duration: 0.6, ease: ease.out }} className={i === 0 ? 'is-new' : ''}>
              <span className="cw__tag">{t}</span><b>{w}</b><em>{v}</em>
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
    <li className={`jr2 ${open ? 'is-open' : ''}`}>
      <button className="jr2__head" onClick={onToggle} aria-expanded={open}>
        <span className="jr2__title"><b>{r.title}</b><small>{r.team}</small></span>
        <span className="jr2__meta"><span><MapPin size={14} />{r.location}</span><span><Clock size={14} />{r.type}</span><span>{r.level}</span></span>
        <motion.span className="jr2__chev" animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.4, ease: ease.out }}><ChevronDown size={20} /></motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div className="jr2__body" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: ease.out }}>
            <div className="jr2__in">
              <p className="jr2__sum">{r.summary}</p>
              <div className="jr2__cols">
                <div><small>What you’ll do</small><ul>{r.do.map((x) => <li key={x}>{x}</li>)}</ul></div>
                <div><small>What you bring</small><ul>{r.bring.map((x) => <li key={x}>{x}</li>)}</ul></div>
                <div><small>Nice to have</small><ul>{r.plus.map((x) => <li key={x}>{x}</li>)}</ul></div>
              </div>
              <AnimatePresence mode="wait" initial={false}>
                {sent ? (
                  <motion.p key="ok" className="jr2__ok" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><Check size={18} strokeWidth={3} /> Application received. We’ll be in touch about the {r.title} role.</motion.p>
                ) : applying ? (
                  <motion.form key="f" className="jr2__form" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
                    <label>Full name<input required placeholder="Jordan Lee" /></label>
                    <label>Email<input required type="email" placeholder="you@email.com" /></label>
                    <label>LinkedIn or resume link<input placeholder="linkedin.com/in/…" /></label>
                    <label>Certifications<input placeholder="CPC, CCS…" /></label>
                    <button type="submit" className="ct-submit">Send application <ArrowRight size={18} /></button>
                  </motion.form>
                ) : (
                  <motion.button key="b" className="ct-submit jr2__apply" onClick={() => setApplying(true)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Apply for this role <ArrowRight size={18} /></motion.button>
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
    <section className="cr container" id="roles">
      <div className="cr__head">
        <div>
          <Eyebrow>/ Open positions</Eyebrow>
          <SplitWords className="h-56" lines={[`${ROLES.length} open roles,`, 'all in revenue cycle.']} stagger={0.04} />
        </div>
        <LayoutGroup>
          <div className="need__chips" role="tablist">
            {TEAMS.map((x) => {
              const n = x === 'All' ? ROLES.length : ROLES.filter((r) => r.team === x).length;
              return (
                <button key={x} role="tab" aria-selected={t === x} className={`need__chip ${t === x ? 'is-on' : ''}`} onClick={() => { setT(x); setOpen(null); }}>
                  {t === x && <motion.span layoutId="cr-pill" className="need__pill" transition={{ type: 'spring', stiffness: 260, damping: 32 }} />}
                  <span>{x} <sup>{n}</sup></span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.ul key={t} className="cr__list" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.45, ease: ease.out } }} exit={{ opacity: 0, transition: { duration: 0.18 } }}>
          {list.map((r) => <RoleRow key={r.slug} r={r} open={open === r.slug} onToggle={() => setOpen(open === r.slug ? null : r.slug)} />)}
        </motion.ul>
      </AnimatePresence>
      <p className="cr__note">Don’t see your role? <a href="mailto:info@affinitycore.co?subject=Careers%20at%20Affinity%20Core">Send us your resume</a> and tell us what you’re great at.</p>
    </section>
  );
}

/* ---------- Career ladder ---------- */
function Ladder() {
  const [k, setK] = useState(0);
  const tr = LADDER[k];
  return (
    <section className="cl container">
      <div className="cl__head">
        <Eyebrow>/ Where it leads</Eyebrow>
        <SplitWords className="h-56" lines={['Start in one seat.', 'Grow into the next.']} stagger={0.04} />
        <LayoutGroup>
          <div className="need__chips cl__tabs">
            {LADDER.map((l, i) => (
              <button key={l.track} className={`need__chip ${k === i ? 'is-on' : ''}`} onClick={() => setK(i)}>
                {k === i && <motion.span layoutId="cl-pill" className="need__pill" transition={{ type: 'spring', stiffness: 260, damping: 32 }} />}
                <span>{l.track}</span>
              </button>
            ))}
          </div>
        </LayoutGroup>
      </div>
      <div className="cl__stairs">
        {tr.steps.map((r, i) => (
          <motion.div key={tr.track + r.title} className={`cl__step ${i === tr.steps.length - 1 ? 'is-top' : ''}`} style={{ ['--h' as string]: `${19 + i * 5}rem` }}
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: ease.out, delay: i * 0.08 }}>
            <div className="cl__top">
              <span className="cl__n">0{i + 1}{i === 0 && <em>Where most people start</em>}</span>
              <b>{r.title}</b>
              <small>{r.note}</small>
            </div>
            <motion.div className="cl__bar" initial={{ scaleY: 0.4, opacity: 0 }} animate={{ scaleY: 1, opacity: 1 }} transition={{ duration: 0.7, ease: ease.out, delay: 0.15 + i * 0.08 }}>
              <p className="cl__k">You’ll own</p>
              <ul>{r.owns.map((o) => <li key={o}><Check size={14} strokeWidth={3} />{o}</li>)}</ul>
              <span className="cl__badge">{r.badge}</span>
            </motion.div>
            {i < tr.steps.length - 1 && <span className="cl__arrow" aria-hidden><ArrowUpRight size={16} /></span>}
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
    <main className="page page--tail">
      <section className="ch container">
        <div className="ch__copy">
          <motion.p className="eyebrow" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: ease.out, delay: 0.2 }}>/ Careers</motion.p>
          <SplitWords as="h1" className="page-title" animateNow delay={0.3} stagger={0.05} lines={['Do the work that', 'gets doctors paid.']} bold={['paid.']} />
          <motion.p className="page-sub" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.75 }}>
            We’re a 30+ person, US-based revenue cycle team in Plano, Texas. Every claim we get right is a practice that gets paid for the care it gave.
          </motion.p>
          <motion.div className="ch__stats" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.9 }}>
            <div><b>30+</b><small>people on the team</small></div>
            <div><b>US</b><small>based, in Plano, TX</small></div>
            <div><b>{ROLES.length}</b><small>open roles</small></div>
          </motion.div>
          <motion.a href="#roles" className="ct-submit ch__cta" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 1 }}>See open roles <ArrowRight size={18} /></motion.a>
        </div>
        <motion.div className="ch__stage" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: ease.out, delay: 0.4 }}>
          <Wins />
        </motion.div>
      </section>

      <Roles />
      <Ladder />

      <section className="cp container">
        <div className="cp__head">
          <Eyebrow>/ Why people stay</Eyebrow>
          <SplitWords className="h-56" lines={['A small team where', 'your work shows.']} stagger={0.04} />
        </div>
        <div className="cp__grid">
          {PERKS.map(([t, d], i) => (
            <Reveal key={t} className="cp__card" delay={i * 0.05}>
              <span className="cp__icon">{PERK_ICONS[i]}</span>
              <b>{t}</b><p>{d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="nx container">
        <div className="nx__head">
          <Eyebrow>/ How we hire</Eyebrow>
          <SplitWords className="h-56" lines={['Four steps,', 'no guessing games.']} stagger={0.04} />
        </div>
        <ol className="nx__steps">
          <motion.span className="nx__line" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={vp} transition={{ duration: 1.6, ease: ease.inOut }} aria-hidden />
          {HIRING.map(([t, d], i) => (
            <motion.li key={t} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 0.7, ease: ease.out, delay: 0.3 + i * 0.18 }}>
              <span className="nx__n">0{i + 1}</span><b>{t}</b><p>{d}</p>
            </motion.li>
          ))}
        </ol>
      </section>

      <FAQ items={CAREER_FAQS} eyebrow="/ Careers FAQs" lines={['Questions candidates', 'ask us first.']}
        note="Something else on your mind? Email us and a real person will answer." cta={{ label: 'Email our team', href: 'mailto:info@affinitycore.co?subject=Careers%20question' }} />
    </main>
  );
}
