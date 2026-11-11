'use client';
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
    <div className="ct-form [position:relative] [isolation:isolate] [overflow:hidden] [padding:4rem] [border-radius:3.2rem] [border:1px_solid_rgba(106,_65,_249,_0.14)] [box-shadow:0_4rem_10rem_-4rem_rgba(80,_40,_220,_0.25)] [&::before]:[content:''] [&::before]:[position:absolute] [&::before]:[inset:0] [&::before]:[z-index:-1] [&::before]:[background:rgba(255,_255,_255,_0.93)] [&_label]:[display:flex] [&_label]:[flex-direction:column] [&_label]:[gap:0.8rem] [&_label]:[font-size:1.4rem] [&_label]:[color:#4a4f63] [&_input]:[width:100%] [&_input]:[padding:1.4rem_1.6rem] [&_input]:[border-radius:1.2rem] [&_input]:[border:1px_solid_#e3def5] [&_input]:[background:#fff] [&_input]:[font-family:inherit] [&_input]:[font-weight:inherit] [&_input]:[font-style:inherit] [&_input]:[line-height:inherit] [&_input]:[font-size:1.6rem] [&_input]:[color:var(--ink-2)] [&_input]:[outline:none] [&_input]:[transition:border-color_0.3s,_box-shadow_0.3s] [&_select]:[width:100%] [&_select]:[padding:1.4rem_1.6rem] [&_select]:[border-radius:1.2rem] [&_select]:[border:1px_solid_#e3def5] [&_select]:[background:#fff] [&_select]:[font-family:inherit] [&_select]:[font-weight:inherit] [&_select]:[font-style:inherit] [&_select]:[line-height:inherit] [&_select]:[font-size:1.6rem] [&_select]:[color:var(--ink-2)] [&_select]:[outline:none] [&_select]:[transition:border-color_0.3s,_box-shadow_0.3s] [&_textarea]:[width:100%] [&_textarea]:[padding:1.4rem_1.6rem] [&_textarea]:[border-radius:1.2rem] [&_textarea]:[border:1px_solid_#e3def5] [&_textarea]:[background:#fff] [&_textarea]:[font-family:inherit] [&_textarea]:[font-weight:inherit] [&_textarea]:[font-style:inherit] [&_textarea]:[line-height:inherit] [&_textarea]:[font-size:1.6rem] [&_textarea]:[color:var(--ink-2)] [&_textarea]:[outline:none] [&_textarea]:[transition:border-color_0.3s,_box-shadow_0.3s] [&_input:focus]:[border-color:var(--purple)] [&_input:focus]:[box-shadow:0_0_0_0.4rem_rgba(106,_65,_249,_0.12)] [&_select:focus]:[border-color:var(--purple)] [&_select:focus]:[box-shadow:0_0_0_0.4rem_rgba(106,_65,_249,_0.12)] [&_textarea:focus]:[border-color:var(--purple)] [&_textarea:focus]:[box-shadow:0_0_0_0.4rem_rgba(106,_65,_249,_0.12)] [&_textarea]:[resize:vertical] [@media(max-width:_1279px)]:[padding:2.4rem_2rem] [@media(max-width:_1279px)]:[border-radius:2.8rem]">
      <div className="sl__bg [position:absolute] [inset:0] [z-index:-2] [overflow:hidden] [&_img]:[position:absolute] [&_img]:[inset:-4%] [&_img]:[width:108%] [&_img]:[height:108%] [&_img]:[max-width:none] [&_img]:[object-fit:cover] [&_img]:[animation:jy-drift_26s_ease-in-out_infinite_alternate]" aria-hidden><img src={fluted} alt="" /></div>
      <AnimatePresence mode="wait" initial={false}>
        {!sent ? (
          <motion.form key="f" exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}
            onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
            <p className="ct-form__k [font-weight:500] [font-size:2.6rem] [color:var(--ink-2)] [margin-bottom:2.4rem]">Request a call back</p>
            <div className="ct-grid [display:grid] [grid-template-columns:repeat(2,_minmax(0,_1fr))] [gap:1.6rem_2rem] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)]">
              <label>Full name<input required placeholder="Dr. Jane Smith" value={name} onChange={(e) => setName(e.target.value)} /></label>
              <label>Work email<input required type="email" placeholder="jane@yourpractice.com" /></label>
              <label>Phone<input type="tel" placeholder="(214) 555-0123" /></label>
              <label>Practice name<input placeholder="Smith Family Medicine" /></label>
              <label>Specialty<select defaultValue=""><option value="" disabled>Select specialty</option>{SPECIALTIES.map((s) => <option key={s.slug}>{s.name}</option>)}<option>Other</option></select></label>
              <label>Monthly claim volume<select defaultValue=""><option value="" disabled>Select one</option>{VOLUME.map((v) => <option key={v}>{v}</option>)}</select></label>
            </div>
            <fieldset className="ct-needs [border:0] [margin-top:2rem] [display:flex] [flex-wrap:wrap] [gap:0.8rem] [&_legend]:[width:100%] [&_legend]:[font-size:1.4rem] [&_legend]:[color:#4a4f63] [&_legend]:[margin-bottom:1rem] [&_button]:[display:inline-flex] [&_button]:[align-items:center] [&_button]:[gap:0.6rem] [&_button]:[padding:1rem_1.6rem] [&_button]:[border-radius:4rem] [&_button]:[border:1px_solid_#e3def5] [&_button]:[background:#fff] [&_button]:[font-size:1.5rem] [&_button]:[color:var(--ink-2)] [&_button]:[transition:background_0.3s,_color_0.3s,_border-color_0.3s] [&_button_span]:[display:inline-flex] [&_button_span]:[overflow:hidden]">
              <legend>What can we help with?</legend>
              <LayoutGroup>
                {NEEDS.map((n) => {
                  const on = needs.includes(n);
                  return (
                    <motion.button layout type="button" key={n} className={on ? String.raw`is-on [.assess\_\_steps_span&]:[color:var(--navy)] [.assess\_\_steps_span&_b]:[background:var(--purple)] [.assess\_\_steps_span&_b]:[border-color:var(--purple)] [.assess\_\_steps_span&_b]:[color:#fff] [.assess\_\_steps_i&::after]:[transform:scaleX(1)] [.cx-read\_\_n_i&]:[width:2.4rem] [.cx-read\_\_n_i&]:[background:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [.sg\_\_toc_button&]:[color:var(--purple)] [.sg\_\_toc_button&]:[border-left-color:var(--purple)] [.pg\_\_toc_button&]:[color:#fff] [.pg\_\_toc_button&_small]:[color:rgba(255,_255,_255,_0.7)] [.pg\_\_dots_i&]:[width:2.4rem] [.pg\_\_dots_i&]:[background:var(--purple)] [.stfd\_\_tabs_button&]:[color:#fff] [.se\_\_dots_i&]:[width:6.4rem] [.sw-anes\_\_bar_i&]:[background:var(--grad)] [.sw-body_circle&]:[fill:var(--purple)] [.sw-vial\_\_body_i&]:[background:var(--grad)] [.sw-vial\_\_body_i&_small]:[color:#fff] [.sw-wound\_\_grid_i&]:[background:#c9b8ff] [.sw-wound\_\_grid_i&]:[border-color:transparent] [.sw-cal_i&]:[background:var(--purple)] [.sw-cal_i&]:[color:#fff] [.sw-wells_i&]:[background:#e2d9ff] [.sw-wells_i&]:[border-color:#c9b8ff] [.sw-shot_i&]:[background:var(--purple)] [.sw-shot_i&]:[border-color:var(--purple)] [.lf\_\_seg_button&]:[color:#fff] [.tc\_\_why_li&]:[opacity:1] [.sl\_\_tabs_button&]:[color:#fff] [.ar\_\_toc_a&]:[color:var(--ink-2)] [.ct-needs_button&]:[color:#fff] [.wa\_\_zones_li&]:[background:var(--grad)] [.wa\_\_zones_li&]:[border-color:transparent] [.wa\_\_zones_li&_small]:[color:#fff] [.wa\_\_zones_li&_b]:[color:#fff] [.wa\_\_zones_li&_em]:[color:#fff] [.se\_\_dots_i&]:[background:var(--purple)] [.ct-needs_button&]:[background:var(--grad)] [.ct-needs_button&]:[border-color:transparent] [.sc-cal_i&]:[background:var(--purple)] [.sc-cal_i&]:[color:#fff] [.ccp_button&]:[background:var(--purple)] [.ccp_button&]:[color:#fff] [.pa-art\_\_seg_button&]:[background:var(--grad)] [.pa-art\_\_seg_button&]:[color:#fff] [.pa-art\_\_steps_li&]:[background:var(--purple)] [.pa-art\_\_steps_li&]:[border-color:var(--purple)] [.pa-art\_\_steps_li&]:[color:#fff] [.ab-orbit\_\_rings_line&]:[stroke:var(--purple)] [.ab-orbit\_\_rings_line&]:[stroke-width:2]` : ''} aria-pressed={on} onClick={() => toggle(n)}>
                      <AnimatePresence initial={false}>{on && <motion.span initial={{ width: 0, opacity: 0 }} animate={{ width: 'auto', opacity: 1 }} exit={{ width: 0, opacity: 0 }}><Check size={14} strokeWidth={3} /></motion.span>}</AnimatePresence>
                      {n}
                    </motion.button>
                  );
                })}
              </LayoutGroup>
            </fieldset>
            <label className="ct-msg [margin-top:2rem]">Anything we should know?<textarea rows={3} placeholder="EHR you use, payers, what’s been hardest lately…" /></label>
            <button type="submit" className="ct-submit [margin-top:2.4rem] [width:100%] [display:inline-flex] [align-items:center] [justify-content:center] [gap:1rem] [height:5.6rem] [border-radius:6rem] [color:#fff] [font-weight:500] [font-size:1.9rem] [transition:background_0.3s] [&:hover]:[background:#5a32ec] [&_svg]:[transition:transform_0.4s_cubic-bezier(.16,1,.3,1)] [&:hover_svg]:[transform:translateX(0.5rem)] [background:var(--grad)] [.jr2\_\_form_&]:[margin-top:0] [.jr2\_\_form_&]:[width:auto] [.jr2\_\_form_&]:[padding-inline:2.4rem] [.jr2\_\_form_&]:[height:5.2rem]">Send request <ArrowRight size={18} /></button>
            <p className="ct-fine [@media(max-width:_1279px)]:[font-size:13.5px]! [@media(max-width:_1279px)]:[line-height:1.55] [margin-top:1.2rem] [font-size:1.3rem] [color:#6b6f7c] [text-align:center]">HIPAA-aware: please don’t include patient information. We’ll never share your details.</p>
          </motion.form>
        ) : (
          <motion.div key="ok" className="ct-ok [display:flex] [flex-direction:column] [align-items:flex-start] [gap:1.6rem] [min-height:50rem] [justify-content:center] [&_h3]:[font-weight:500] [&_h3]:[font-size:4rem] [&_h3]:[letter-spacing:-0.08rem] [&_h3]:[color:var(--ink-2)] [&_p]:[font-size:1.8rem] [&_p]:[line-height:1.55] [&_p]:[color:#4a4f63] [&_p]:[max-width:48rem]" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: ease.out }}>
            <motion.span className="ct-ok__tick [width:7.2rem] [height:7.2rem] [border-radius:50%] [display:grid] [place-items:center] [color:#fff] [background:var(--grad)] [border-color:transparent]" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 16, delay: 0.1 }}><Check size={32} strokeWidth={2.5} /></motion.span>
            <h3>Thanks{name ? `, ${name.split(' ').slice(-1)[0]}` : ''}. We’ve got it.</h3>
            <p>A US-based billing specialist will reach out in your time zone to set up your call.</p>
            <button className="text-link [display:inline-flex] [align-items:center] [gap:0.8rem] [font-weight:500] [font-size:1.8rem] [color:var(--purple)] [&_svg]:[transition:transform_0.4s_cubic-bezier(.16,1,.3,1)] [&:hover_svg]:[transform:translateX(0.5rem)] [.est\_\_carried_&]:[margin-top:0.6rem] [.est\_\_carried_&]:[font-size:1.5rem] [.est\_\_carried_&]:[color:#fff] [.est\_\_carried_&]:[text-decoration:underline] [.est\_\_carried_&]:[text-underline-offset:0.3em] [.est\_\_carried_&]:[opacity:0.85]" onClick={() => setSent(false)}>Send another request</button>
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
  // Clock starts after hydration: server HTML can't know the visitor's time or zone
  const [ready, setReady] = useState(false);
  const [now, setNow] = useState(() => new Date('2026-01-05T15:00:00Z'));
  useEffect(() => { setNow(new Date()); setReady(true); const id = window.setInterval(() => setNow(new Date()), 30000); return () => window.clearInterval(id); }, []);
  const mine = !ready ? null : (() => {
    try { const tz = Intl.DateTimeFormat().resolvedOptions().timeZone; return ZONES.find((z) => z.tz === tz)?.k ?? ZONE_ALIASES[tz] ?? null; } catch { return null; }
  })();
  const hi = mine ?? 'CT';
  return (
    <section className="wa container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [display:grid] [grid-template-columns:minmax(0,_1fr)_minmax(0,_1fr)] [gap:8rem] [align-items:center] [padding-top:16rem] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1279px)]:[gap:4rem] [@media(max-width:_1279px)]:[padding-top:10rem]">
      <motion.div className="wa__photo [position:relative] [aspect-ratio:5_/_4] [border-radius:2.4rem] [overflow:hidden] [&_img]:[width:100%] [&_img]:[height:100%] [&_img]:[object-fit:cover] [&_img]:[object-position:62%_40%]" initial={{ clipPath: 'inset(12% 12% 12% 12% round 2.4rem)' }} whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 2.4rem)' }} viewport={vp} transition={{ duration: 1.3, ease: ease.curtain }}>
        <img src={teamPhoto} alt="Affinity Core billing specialist on a call with a practice" loading="lazy" />
        <motion.span className="hero-chip wa__chip [display:flex] [align-items:center] [gap:1.2rem] [padding:2.4rem] [border-radius:1.4rem] [background:rgba(248,_246,_255,_0.8)] [backdrop-filter:blur(1.2rem)] [color:var(--navy)] [white-space:nowrap] [z-index:4] [&_strong]:[display:block] [&_strong]:[font-weight:500] [&_strong]:[font-size:2.4rem] [&_strong]:[line-height:2.2rem] [&_strong]:[margin-bottom:0.8rem] [&_small]:[display:block] [&_small]:[font-size:1.4rem] [&_small]:[line-height:1.8rem] [position:absolute] [left:2.4rem] [bottom:2.4rem]" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 0.8, ease: ease.out, delay: 0.6 }}>
          <span><strong>30+ people</strong><small>US-based billing team</small></span>
        </motion.span>
      </motion.div>
      <div className="wa__copy [display:flex] [flex-direction:column] [gap:1.6rem]">
        <Eyebrow>/ Who picks up</Eyebrow>
        <SplitWords className="h-56 [font-weight:500] [font-size:5.6rem] [line-height:1.08] [letter-spacing:-0.12rem] [color:var(--ink-2)] [text-wrap:balance] [@media(max-width:_1279px)]:[font-size:3.8rem] [@media(max-width:_640px)]:[font-size:3.4rem]" lines={['A real person,', 'in your time zone.']} bold={['time', 'zone.']} stagger={0.04} />
        <Reveal as="p" className="wa__p [font-size:1.8rem] [line-height:1.6] [color:#5b5f72] [max-width:48rem]">Our team is based in the US, so the specialist who answers works your hours, knows your payers and can get on a call the same day.</Reveal>
        <ul className="wa__zones [list-style:none] [display:grid] [grid-template-columns:repeat(4,_minmax(0,_1fr))] [gap:1.2rem] [margin-top:2.4rem] [&_li]:[position:relative] [&_li]:[display:flex] [&_li]:[flex-direction:column] [&_li]:[gap:0.4rem] [&_li]:[padding:1.8rem_1.6rem] [&_li]:[border-radius:1.6rem] [&_li]:[background:#fff] [&_li]:[border:1px_solid_rgba(106,_65,_249,_0.14)] [&_small]:[font-family:var(--f-mono)] [&_small]:[font-size:1.2rem] [&_small]:[letter-spacing:0.08em] [&_small]:[color:#8a8ea3] [&_b]:[font-weight:500] [&_b]:[font-size:2.4rem] [&_b]:[color:var(--ink-2)] [&_b]:[font-variant-numeric:tabular-nums] [&_em]:[font-style:normal] [&_em]:[font-size:1.3rem] [&_em]:[color:#8a8ea3] [@media(max-width:_1279px)]:[grid-template-columns:repeat(2,_minmax(0,_1fr))]" aria-label="Current time across US time zones">
          {ZONES.map((z, i) => {
            const t = new Intl.DateTimeFormat('en-US', { timeZone: z.tz, hour: 'numeric', minute: '2-digit' }).format(now);
            const on = z.k === hi;
            return (
              <motion.li key={z.k} className={on ? String.raw`is-on [.assess\_\_steps_span&]:[color:var(--navy)] [.assess\_\_steps_span&_b]:[background:var(--purple)] [.assess\_\_steps_span&_b]:[border-color:var(--purple)] [.assess\_\_steps_span&_b]:[color:#fff] [.assess\_\_steps_i&::after]:[transform:scaleX(1)] [.cx-read\_\_n_i&]:[width:2.4rem] [.cx-read\_\_n_i&]:[background:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [.sg\_\_toc_button&]:[color:var(--purple)] [.sg\_\_toc_button&]:[border-left-color:var(--purple)] [.pg\_\_toc_button&]:[color:#fff] [.pg\_\_toc_button&_small]:[color:rgba(255,_255,_255,_0.7)] [.pg\_\_dots_i&]:[width:2.4rem] [.pg\_\_dots_i&]:[background:var(--purple)] [.stfd\_\_tabs_button&]:[color:#fff] [.se\_\_dots_i&]:[width:6.4rem] [.sw-anes\_\_bar_i&]:[background:var(--grad)] [.sw-body_circle&]:[fill:var(--purple)] [.sw-vial\_\_body_i&]:[background:var(--grad)] [.sw-vial\_\_body_i&_small]:[color:#fff] [.sw-wound\_\_grid_i&]:[background:#c9b8ff] [.sw-wound\_\_grid_i&]:[border-color:transparent] [.sw-cal_i&]:[background:var(--purple)] [.sw-cal_i&]:[color:#fff] [.sw-wells_i&]:[background:#e2d9ff] [.sw-wells_i&]:[border-color:#c9b8ff] [.sw-shot_i&]:[background:var(--purple)] [.sw-shot_i&]:[border-color:var(--purple)] [.lf\_\_seg_button&]:[color:#fff] [.tc\_\_why_li&]:[opacity:1] [.sl\_\_tabs_button&]:[color:#fff] [.ar\_\_toc_a&]:[color:var(--ink-2)] [.ct-needs_button&]:[color:#fff] [.wa\_\_zones_li&]:[background:var(--grad)] [.wa\_\_zones_li&]:[border-color:transparent] [.wa\_\_zones_li&_small]:[color:#fff] [.wa\_\_zones_li&_b]:[color:#fff] [.wa\_\_zones_li&_em]:[color:#fff] [.se\_\_dots_i&]:[background:var(--purple)] [.ct-needs_button&]:[background:var(--grad)] [.ct-needs_button&]:[border-color:transparent] [.sc-cal_i&]:[background:var(--purple)] [.sc-cal_i&]:[color:#fff] [.ccp_button&]:[background:var(--purple)] [.ccp_button&]:[color:#fff] [.pa-art\_\_seg_button&]:[background:var(--grad)] [.pa-art\_\_seg_button&]:[color:#fff] [.pa-art\_\_steps_li&]:[background:var(--purple)] [.pa-art\_\_steps_li&]:[border-color:var(--purple)] [.pa-art\_\_steps_li&]:[color:#fff] [.ab-orbit\_\_rings_line&]:[stroke:var(--purple)] [.ab-orbit\_\_rings_line&]:[stroke-width:2]` : ''} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 0.6, ease: ease.out, delay: 0.2 + i * 0.08 }}>
                <small>{z.k}</small><b>{t}</b><em>{on ? (mine ? 'Your time zone' : 'Our Plano office') : z.name}</em>
                {on && <span className="wa__dot [position:absolute] [top:1.6rem] [right:1.6rem] [width:0.8rem] [height:0.8rem] [border-radius:50%] [background:#7dffb0] [animation:waPulse_2s_ease-in-out_infinite] [[data-off]_&]:[animation-play-state:paused]" aria-hidden />}
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
    <main className="page page--tail [overflow-x:clip] [@media(max-width:_640px)]:[&:has(.mbar)]:[padding-bottom:7.2rem] [padding-bottom:14rem] [@media(max-width:_1279px)]:[padding-bottom:8rem]">
      <section className="ct container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [display:grid] [grid-template-columns:minmax(0,_0.9fr)_minmax(0,_1.1fr)] [gap:6rem] [align-items:center] [padding-top:14rem] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1279px)]:[padding-top:12rem] [@media(max-width:_1279px)]:[gap:4rem]">
        <div className="ct__copy [display:flex] [flex-direction:column] [gap:2.8rem]">
          <motion.p className="eyebrow [font-family:var(--f-mono)] [font-size:1.6rem] [line-height:1.4] [text-transform:uppercase] [color:var(--ink)] [letter-spacing:0.02em] [.hero\_\_copy_&]:[margin-bottom:1.2rem] [.stmac\_\_intro_&]:[grid-column:1_/_-1]" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: ease.out, delay: 0.2 }}>/ Contact</motion.p>
          <SplitWords as="h1" className="page-title [font-weight:500] [font-size:6.12rem] [line-height:1.06] [letter-spacing:-0.18rem] [color:var(--ink-3)] [@media(max-width:_1279px)]:[font-size:4.32rem]" animateNow delay={0.3} stagger={0.05} lines={['Talk to a billing', 'specialist, not', 'a sales bot.']} bold={['bot.']} />
          <motion.p className="page-sub [font-size:1.8rem] [line-height:1.6] [color:#4a4f63] [max-width:56rem] [.ab-hero\_\_copy_&]:[max-width:64rem]" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.75 }}>
            Tell us what’s going on with your billing. We’ll come back with a straight answer, and a free assessment if it helps.
          </motion.p>
          <motion.ul className="ct-ways [list-style:none] [border-top:1px_solid_#ece8f7] [&_a]:[display:grid] [&_a]:[grid-template-columns:5.2rem_1fr_auto] [&_a]:[gap:2rem] [&_a]:[align-items:center] [&_a]:[padding:2rem_0] [&_a]:[border-bottom:1px_solid_#ece8f7] [&_a]:[color:var(--ink-2)] [&_a>svg]:[color:#c9c2e4] [&_a>svg]:[transition:transform_0.4s_cubic-bezier(.16,1,.3,1),_color_0.3s] [&_a:hover>svg]:[color:var(--purple)] [&_a:hover>svg]:[transform:translateX(0.4rem)_rotate(-45deg)]" initial="h" animate="s" variants={{ h: {}, s: { transition: { staggerChildren: 0.1, delayChildren: 0.9 } } }}>
            {WAYS.map((w) => (
              <motion.li key={w.k} variants={{ h: { opacity: 0, y: 16 }, s: { opacity: 1, y: 0, transition: { duration: 0.7, ease: ease.out } } }}>
                <a href={w.href} target={w.k === 'Visit' ? '_blank' : undefined} rel="noopener noreferrer">
                  <span className="ct-ways__i [width:5.2rem] [height:5.2rem] [border-radius:50%] [display:grid] [place-items:center] [background:#f1edff] [color:var(--purple)] [transition:background_0.35s,_color_0.35s] [&_svg]:[width:2.2rem] [&_svg]:[height:2.2rem] [.ct-ways_a:hover_&]:[color:#fff] [.ct-ways_a:hover_&]:[background:var(--grad)] [.ct-ways_a:hover_&]:[border-color:transparent]">{w.icon}</span>
                  <span className="ct-ways__t [&_small]:[font-family:var(--f-mono)] [&_small]:[font-size:1.2rem] [&_small]:[text-transform:uppercase] [&_small]:[letter-spacing:0.06em] [&_small]:[color:#8a8ea0] [&_b]:[display:block] [&_b]:[font-weight:500] [&_b]:[font-size:2.2rem] [&_em]:[font-style:normal] [&_em]:[font-size:1.4rem] [&_em]:[color:#6b6f7c]"><small>{w.k}</small><b>{w.v}</b><em>{w.note}</em></span>
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

      <section className="nx container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [padding-top:14rem] [@media(max-width:_1279px)]:[padding-top:10rem]">
        <div className="nx__head [display:flex] [flex-direction:column] [gap:1.2rem]">
          <Eyebrow>/ What happens next</Eyebrow>
          <SplitWords className="h-56 [font-weight:500] [font-size:5.6rem] [line-height:1.08] [letter-spacing:-0.12rem] [color:var(--ink-2)] [text-wrap:balance] [@media(max-width:_1279px)]:[font-size:3.8rem] [@media(max-width:_640px)]:[font-size:3.4rem]" lines={['From hello to findings,', 'in four steps.']} stagger={0.04} />
        </div>
        <ol className="nx__steps [position:relative] [list-style:none] [display:grid] [grid-template-columns:repeat(4,_minmax(0,_1fr))] [gap:2.4rem] [margin-top:5.6rem] [&_li]:[position:relative] [&_li]:[display:flex] [&_li]:[flex-direction:column] [&_li]:[gap:1rem] [&_li]:[padding-right:2rem] [&_b]:[font-weight:500] [&_b]:[font-size:2.4rem] [&_b]:[color:var(--ink-2)] [&_p]:[font-size:1.6rem] [&_p]:[line-height:1.55] [&_p]:[color:#5b5f72] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)]">
          <motion.span className="nx__line [position:absolute] [left:0] [right:0] [top:2.4rem] [height:2px] [background:linear-gradient(90deg,_#d6cdf7,_var(--purple))] [transform-origin:left] [@media(max-width:_1279px)]:[display:none]" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={vp} transition={{ duration: 1.6, ease: ease.inOut }} aria-hidden />
          {STEPS.map(([t, d], i) => (
            <motion.li key={t} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 0.7, ease: ease.out, delay: 0.3 + i * 0.18 }}>
              <span className="nx__n [width:4.8rem] [height:4.8rem] [border-radius:50%] [display:grid] [place-items:center] [background:#fff] [border:2px_solid_var(--purple)] [font-family:var(--f-mono)] [font-size:1.4rem] [color:var(--purple)] [margin-bottom:1.2rem]">0{i + 1}</span><b>{t}</b><p>{d}</p>
            </motion.li>
          ))}
        </ol>
      </section>

      <section className="of container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [padding-top:14rem] [@media(max-width:_1279px)]:[padding-top:10rem]">
        <Reveal className="of__panel [display:grid] [grid-template-columns:minmax(0,_1.3fr)_minmax(0,_1fr)] [border-radius:3.2rem] [border:1px_solid_#ece8fa] [overflow:hidden] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)]">
          <div className="of__map [position:relative] [min-height:34rem] [background:#f6f3ff] [&_svg]:[position:absolute] [&_svg]:[inset:0] [&_svg]:[width:100%] [&_svg]:[height:100%] [&_line]:[stroke:rgba(106,_65,_249,_0.1)] [&_line]:[stroke-width:1] [@media(max-width:_1279px)]:[min-height:24rem] [&>svg]:[position:absolute]" aria-hidden>
            <svg viewBox="0 0 600 340" preserveAspectRatio="xMidYMid slice">
              {Array.from({ length: 14 }, (_, i) => <line key={`h${i}`} x1="0" x2="600" y1={i * 26} y2={i * 26 + (i % 3) * 6} />)}
              {Array.from({ length: 22 }, (_, i) => <line key={`v${i}`} y1="0" y2="340" x1={i * 30} x2={i * 30 - 20 + (i % 4) * 8} />)}
              <path className="of__road [fill:none] [stroke:#fff] [stroke-width:14] [stroke-linecap:round] [filter:drop-shadow(0_0_1px_rgba(106,_65,_249,_0.3))]" d="M0 210 C 140 190 220 120 330 150 S 520 230 600 200" />
              <path className="of__road of__road--b [fill:none] [stroke:#fff] [stroke-linecap:round] [filter:drop-shadow(0_0_1px_rgba(106,_65,_249,_0.3))] [stroke-width:10]" d="M300 0 C 290 90 320 140 330 150 S 360 260 350 340" />
            </svg>
            <span className="of__pin [position:absolute] [left:55%] [top:44%] [translate:-50%_-100%] [width:6rem] [height:6rem] [border-radius:50%_50%_50%_0] [rotate:-45deg] [background:var(--purple)] [display:grid] [place-items:center] [box-shadow:0_1.6rem_3rem_rgba(106,_65,_249,_0.35)] [&_svg]:[rotate:45deg] [&_svg]:[width:2.6rem] [&_svg]:[height:2.6rem] [&_svg]:[color:#fff] [&::after]:[content:''] [&::after]:[position:absolute] [&::after]:[width:12rem] [&::after]:[height:12rem] [&::after]:[border-radius:50%] [&::after]:[background:rgba(106,_65,_249,_0.12)] [&::after]:[left:50%] [&::after]:[top:50%] [&::after]:[translate:-50%_-50%] [&::after]:[z-index:-1] [&::after]:[animation:jy-ring_2.4s_ease-out_infinite] [.of\_\_map_&_svg]:[position:static] [.of\_\_map_&_svg]:[inset:auto] [.of\_\_map_&_svg]:[width:2.6rem] [.of\_\_map_&_svg]:[height:2.6rem]"><MapPin /></span>
          </div>
          <div className="of__info [display:flex] [flex-direction:column] [justify-content:center] [gap:1.6rem] [padding:4.8rem] [&_h3]:[font-weight:500] [&_h3]:[font-size:4rem] [&_h3]:[letter-spacing:-0.08rem] [&_h3]:[color:var(--ink-2)] [&_p]:[font-size:1.8rem] [&_p]:[color:#4a4f63] [@media(max-width:_1279px)]:[padding:3.2rem_2.4rem]">
            <Eyebrow>/ Our office</Eyebrow>
            <h3>Plano, Texas</h3>
            <p>{ADDRESS}</p>
            <a className="text-link [display:inline-flex] [align-items:center] [gap:0.8rem] [font-weight:500] [font-size:1.8rem] [color:var(--purple)] [&_svg]:[transition:transform_0.4s_cubic-bezier(.16,1,.3,1)] [&:hover_svg]:[transform:translateX(0.5rem)] [.est\_\_carried_&]:[margin-top:0.6rem] [.est\_\_carried_&]:[font-size:1.5rem] [.est\_\_carried_&]:[color:#fff] [.est\_\_carried_&]:[text-decoration:underline] [.est\_\_carried_&]:[text-underline-offset:0.3em] [.est\_\_carried_&]:[opacity:0.85]" href={MAPS} target="_blank" rel="noopener noreferrer"><Navigation size={16} /> Get directions</a>
          </div>
        </Reveal>
      </section>

      <FAQ items={CONTACT_FAQS} eyebrow="/ Before you reach out" lines={['Quick answers', 'before you call.']} />
    </main>
  );
}
