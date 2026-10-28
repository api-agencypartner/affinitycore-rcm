import { useEffect, useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import { Phone, Mail, MapPin, ArrowRight, Check, Navigation } from 'lucide-react';
import { Eyebrow, Reveal, SplitWords } from '../components/ui';
import { FAQ } from '../sections/Closing';
import { SPECIALTIES } from '../data/specialties';
import { ease, vp } from '../motion';
// Perf: pre-blurred copy of fluted-purple.jpg replaces a live backdrop-filter blur on these panels
import fluted from '../assets/fluted-frost.jpg';
// Envato, licensed to project "Affinity Core Website"
import teamPhoto from '../assets/sp/contact.webp';

/**
 * Contact page. The form posts to GoHighLevel at launch (embed/webhook still needed from the client);
 * in the prototype it shows the success state locally.
 */
const ADDRESS = '5830 Granite Pkwy, STE 100-219, Plano, TX 75024';
const MAPS = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`;

const WAYS = [
  { icon: <Phone />, k: 'Call', v: '214-851-2698', note: 'Talk to a billing specialist', href: 'tel:+12148512698' },
  { icon: <Mail />, k: 'Email', v: 'info@affinitycore.co', note: 'US-based team, working in your time zone', href: 'mailto:info@affinitycore.co' },
  { icon: <MapPin />, k: 'Visit', v: 'Plano, Texas', note: ADDRESS, href: MAPS },
];

const NEEDS = ['Denials', 'Aged A/R', 'Credentialing', 'Coding', 'Full RCM', 'Something else'];
const VOLUME = ['Under 500 claims / month', '500–2,000', '2,000–5,000', '5,000+'];

function Form() {
  const [needs, setNeeds] = useState<string[]>([]);
  const [sent, setSent] = useState(false);
  const [name, setName] = useState('');
  const toggle = (n: string) => setNeeds((v) => (v.includes(n) ? v.filter((x) => x !== n) : [...v, n]));
  return (
    <div className="ct-form">
      <div className="sl__bg" aria-hidden><img src={fluted} alt="" /></div>
      <AnimatePresence mode="wait" initial={false}>
        {!sent ? (
          <motion.form key="f" exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}
            onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
            <p className="ct-form__k">Request a call back</p>
            <div className="ct-grid">
              <label>Full name<input required placeholder="Dr. Jane Smith" value={name} onChange={(e) => setName(e.target.value)} /></label>
              <label>Work email<input required type="email" placeholder="jane@yourpractice.com" /></label>
              <label>Phone<input type="tel" placeholder="(214) 555-0123" /></label>
              <label>Practice name<input placeholder="Smith Family Medicine" /></label>
              <label>Specialty<select defaultValue=""><option value="" disabled>Select specialty</option>{SPECIALTIES.map((s) => <option key={s.slug}>{s.name}</option>)}<option>Other</option></select></label>
              <label>Monthly claim volume<select defaultValue=""><option value="" disabled>Select one</option>{VOLUME.map((v) => <option key={v}>{v}</option>)}</select></label>
            </div>
            <fieldset className="ct-needs">
              <legend>What can we help with?</legend>
              <LayoutGroup>
                {NEEDS.map((n) => {
                  const on = needs.includes(n);
                  return (
                    <motion.button layout type="button" key={n} className={on ? 'is-on' : ''} aria-pressed={on} onClick={() => toggle(n)}>
                      <AnimatePresence initial={false}>{on && <motion.span initial={{ width: 0, opacity: 0 }} animate={{ width: 'auto', opacity: 1 }} exit={{ width: 0, opacity: 0 }}><Check size={14} strokeWidth={3} /></motion.span>}</AnimatePresence>
                      {n}
                    </motion.button>
                  );
                })}
              </LayoutGroup>
            </fieldset>
            <label className="ct-msg">Anything we should know?<textarea rows={3} placeholder="EHR you use, payers, what’s been hardest lately…" /></label>
            <button type="submit" className="ct-submit">Send request <ArrowRight size={18} /></button>
            <p className="ct-fine">HIPAA-aware: please don’t include patient information. We’ll never share your details.</p>
          </motion.form>
        ) : (
          <motion.div key="ok" className="ct-ok" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: ease.out }}>
            <motion.span className="ct-ok__tick" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 16, delay: 0.1 }}><Check size={32} strokeWidth={2.5} /></motion.span>
            <h3>Thanks{name ? `, ${name.split(' ').slice(-1)[0]}` : ''}. We’ve got it.</h3>
            <p>A US-based billing specialist will reach out in your time zone to set up your call.</p>
            <button className="text-link" onClick={() => setSent(false)}>Send another request</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


/** US time zones with a live clock; the viewer's zone (or our Plano office, CT) is highlighted. */
const ZONES = [
  { k: 'PT', name: 'Pacific', tz: 'America/Los_Angeles' },
  { k: 'MT', name: 'Mountain', tz: 'America/Denver' },
  { k: 'CT', name: 'Central', tz: 'America/Chicago' },
  { k: 'ET', name: 'Eastern', tz: 'America/New_York' },
];
const ZONE_ALIASES: Record<string, string> = { 'America/Phoenix': 'MT', 'America/Boise': 'MT', 'America/Detroit': 'ET', 'America/Indiana/Indianapolis': 'ET', 'America/Anchorage': 'PT', 'Pacific/Honolulu': 'PT' };

function WhoAnswers() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const id = window.setInterval(() => setNow(new Date()), 30000); return () => window.clearInterval(id); }, []);
  const mine = (() => {
    try { const tz = Intl.DateTimeFormat().resolvedOptions().timeZone; return ZONES.find((z) => z.tz === tz)?.k ?? ZONE_ALIASES[tz] ?? null; } catch { return null; }
  })();
  const hi = mine ?? 'CT';
  return (
    <section className="wa container">
      <motion.div className="wa__photo" initial={{ clipPath: 'inset(12% 12% 12% 12% round 2.4rem)' }} whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 2.4rem)' }} viewport={vp} transition={{ duration: 1.3, ease: ease.curtain }}>
        <img src={teamPhoto} alt="Affinity Core billing specialist on a call with a practice" loading="lazy" />
        <motion.span className="hero-chip wa__chip" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 0.8, ease: ease.out, delay: 0.6 }}>
          <span><strong>30+ people</strong><small>US-based billing team</small></span>
        </motion.span>
      </motion.div>
      <div className="wa__copy">
        <Eyebrow>/ Who picks up</Eyebrow>
        <SplitWords className="h-56" lines={['A real person,', 'in your time zone.']} bold={['time', 'zone.']} stagger={0.04} />
        <Reveal as="p" className="wa__p">Our team is based in the US, so the specialist who answers works your hours, knows your payers and can get on a call the same day.</Reveal>
        <ul className="wa__zones" aria-label="Current time across US time zones">
          {ZONES.map((z, i) => {
            const t = new Intl.DateTimeFormat('en-US', { timeZone: z.tz, hour: 'numeric', minute: '2-digit' }).format(now);
            const on = z.k === hi;
            return (
              <motion.li key={z.k} className={on ? 'is-on' : ''} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 0.6, ease: ease.out, delay: 0.2 + i * 0.08 }}>
                <small>{z.k}</small><b>{t}</b><em>{on ? (mine ? 'Your time zone' : 'Our Plano office') : z.name}</em>
                {on && <span className="wa__dot" aria-hidden />}
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

const STEPS = [
  ['We reply', 'A US-based billing specialist (not a sales bot) gets back to you, in your time zone.'],
  ['15-minute call', 'We ask about your payers, volume and what’s hurting most. No pitch deck.'],
  ['Free assessment', 'We look at your real denial and A/R reports and show where the money is going.'],
  ['Your call', 'You get findings in dollars and a plan. Hire us or don’t; the findings are yours.'],
];

export const CONTACT_FAQS = [
  ['Is the assessment really free?', 'Yes. No contract and no obligation. You get the findings either way.'],
  ['What should we have ready for the call?', 'Nothing is required. If you have recent denial and A/R aging reports handy, they make the first call more specific.'],
  ['Do you work outside Texas?', 'Yes. We’re US-based and work with practices across the country, in your time zone, inside the systems you already use.'],
  ['How quickly could you start?', 'After the call and system access, handover happens in phases so your team keeps working while we ramp up. [Confirm with Affinity Core]'],
];

export function ContactPage() {
  useEffect(() => {
    document.title = 'Contact Affinity Core · Medical Billing in Plano, TX';
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m); }
    m.setAttribute('content', 'Talk to a medical billing specialist at Affinity Core. Call 214-851-2698, email info@affinitycore.co, or request a call back.');
  }, []);
  return (
    <main className="page page--tail">
      <section className="ct container">
        <div className="ct__copy">
          <motion.p className="eyebrow" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: ease.out, delay: 0.2 }}>/ Contact</motion.p>
          <SplitWords as="h1" className="page-title" animateNow delay={0.3} stagger={0.05} lines={['Talk to a billing', 'specialist, not', 'a sales bot.']} bold={['bot.']} />
          <motion.p className="page-sub" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.75 }}>
            Tell us what’s going on with your billing. We’ll come back with a straight answer, and a free assessment if it helps.
          </motion.p>
          <motion.ul className="ct-ways" initial="h" animate="s" variants={{ h: {}, s: { transition: { staggerChildren: 0.1, delayChildren: 0.9 } } }}>
            {WAYS.map((w) => (
              <motion.li key={w.k} variants={{ h: { opacity: 0, y: 16 }, s: { opacity: 1, y: 0, transition: { duration: 0.7, ease: ease.out } } }}>
                <a href={w.href} target={w.k === 'Visit' ? '_blank' : undefined} rel="noopener noreferrer">
                  <span className="ct-ways__i">{w.icon}</span>
                  <span className="ct-ways__t"><small>{w.k}</small><b>{w.v}</b><em>{w.note}</em></span>
                  <ArrowRight size={18} />
                </a>
              </motion.li>
            ))}
          </motion.ul>
        </div>
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: ease.out, delay: 0.4 }}>
          <Form />
        </motion.div>
      </section>

      <WhoAnswers />

      <section className="nx container">
        <div className="nx__head">
          <Eyebrow>/ What happens next</Eyebrow>
          <SplitWords className="h-56" lines={['From hello to findings,', 'in four steps.']} stagger={0.04} />
        </div>
        <ol className="nx__steps">
          <motion.span className="nx__line" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={vp} transition={{ duration: 1.6, ease: ease.inOut }} aria-hidden />
          {STEPS.map(([t, d], i) => (
            <motion.li key={t} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 0.7, ease: ease.out, delay: 0.3 + i * 0.18 }}>
              <span className="nx__n">0{i + 1}</span><b>{t}</b><p>{d}</p>
            </motion.li>
          ))}
        </ol>
      </section>

      <section className="of container">
        <Reveal className="of__panel">
          <div className="of__map" aria-hidden>
            <svg viewBox="0 0 600 340" preserveAspectRatio="xMidYMid slice">
              {Array.from({ length: 14 }, (_, i) => <line key={`h${i}`} x1="0" x2="600" y1={i * 26} y2={i * 26 + (i % 3) * 6} />)}
              {Array.from({ length: 22 }, (_, i) => <line key={`v${i}`} y1="0" y2="340" x1={i * 30} x2={i * 30 - 20 + (i % 4) * 8} />)}
              <path className="of__road" d="M0 210 C 140 190 220 120 330 150 S 520 230 600 200" />
              <path className="of__road of__road--b" d="M300 0 C 290 90 320 140 330 150 S 360 260 350 340" />
            </svg>
            <span className="of__pin"><MapPin /></span>
          </div>
          <div className="of__info">
            <Eyebrow>/ Our office</Eyebrow>
            <h3>Plano, Texas</h3>
            <p>{ADDRESS}</p>
            <a className="text-link" href={MAPS} target="_blank" rel="noopener noreferrer"><Navigation size={16} /> Get directions</a>
          </div>
        </Reveal>
      </section>

      <FAQ items={CONTACT_FAQS} eyebrow="/ Before you reach out" lines={['Quick answers', 'before you call.']} />
    </main>
  );
}
