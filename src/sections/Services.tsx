import { motion } from 'motion/react';
import { RefreshCw, FileText, ArrowRight } from 'lucide-react';
import { Button, CountUp, Eyebrow, SplitWords } from '../components/ui';
import { ease, vp } from '../motion';
import { go, goAnchor } from '../router';

/** Whole card opens its service page; inner CTA links keep their own target. */
const cardLink = (slug: string) => ({
  role: 'link', tabIndex: 0, style: { cursor: 'pointer' },
  onClick: (e: { target: EventTarget }) => { if (!(e.target as Element).closest('a,button')) go(`/services/${slug}`); },
  onKeyDown: (e: { key: string }) => { if (e.key === 'Enter') go(`/services/${slug}`); },
});

const card = {
  hidden: { opacity: 0, y: 70, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.9, ease: ease.out } },
};
/** child of a card: plays once the card is in view */
const inner = (delay = 0) => ({
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: ease.out, delay: 0.35 + delay } },
});

/** Text + arrow link at the foot of each bento card */
function Link({ children, to = '#assessment' }: { children: string; to?: string }) {
  return (
    <div className="svc__link [margin-top:auto] [padding-top:2.4rem] [display:flex] [@media(max-width:_1279px)]:[margin-top:2.4rem]">
      <button type="button" className="svc__go [display:inline-flex] [align-items:center] [gap:0.8rem] [padding:0] [background:none] [border:0] [color:var(--purple)] [font:500_1.8rem/1.4_var(--f-sans)] [cursor:pointer] [&_span]:[background:linear-gradient(currentColor,_currentColor)_0_100%_/_0_1px_no-repeat] [&_span]:[transition:background-size_.4s_cubic-bezier(.16,1,.3,1)] [&_svg]:[transition:transform_.4s_cubic-bezier(.16,1,.3,1)] [&:hover_span]:[background-size:100%_1px] [&:hover_svg]:[transform:translateX(0.5rem)]" onClick={() => (to.startsWith('/') ? go(to) : goAnchor(to.replace(/^#/, '')))}>
        <span>{children}</span><ArrowRight size={18} strokeWidth={2} />
      </button>
    </div>
  );
}

/* RCM — Visit → Claim → Paid orbit */
function Orbit() {
  return (
    <motion.div className="orbit [position:relative] [width:100%] [height:26.9rem] [display:grid] [place-items:center] [.svc-card>&]:[height:24rem] [.svc-card>&]:[flex-shrink:0] [.svc-card>&+div]:[margin-top:3.2rem]! [@media(max-width:_1279px)]:[width:100%] [@media(max-width:_1279px)]:[.svc-card>&]:[height:auto] [@media(max-width:_767px)]:[.svc-card_&]:[display:none]!" variants={inner()}>
      <div className="orbit__ring [position:absolute] [width:21rem] [height:21rem] [border-radius:50%] [background:radial-gradient(circle,_#fff_55%,_#f4f1ff_100%)] [box-shadow:0_2rem_5rem_rgba(106,_65,_249,_0.1)] [border:1px_solid_#ece7ff]" />
      <div className="orbit__dash [position:absolute] [width:14.2rem] [height:14.2rem] [border-radius:50%] [border:1px_dashed_rgba(106,_65,_249,_0.45)]" />
      <motion.div className="orbit__core [position:relative] [width:9.4rem] [height:9.4rem] [border-radius:50%] [background:var(--purple)] [color:#fff] [display:grid] [place-items:center] [box-shadow:0_1.4rem_3rem_rgba(106,_65,_249,_0.4)] [&_svg]:[width:3.5rem] [&_svg]:[height:3.5rem]" animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}><RefreshCw /></motion.div>
      <motion.div className="orbit__spin [position:absolute] [width:0] [height:0] [left:50%] [top:50%]" animate={{ rotate: 360 }} transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}>
        {[['Visit', -128], ['Claim', -8], ['Paid', 108]].map(([l, a]) => (
          <span key={l} className="orbit__tag [position:absolute] [left:0] [top:0] [&>span]:[display:block] [&>span]:[translate:-50%_-50%] [&>span]:[padding:0.7rem_1.6rem] [&>span]:[border-radius:3rem] [&>span]:[background:#fff] [&>span]:[border:1px_solid_#ece7ff] [&>span]:[box-shadow:0_0.6rem_1.6rem_rgba(25,_37,_51,_0.08)] [&>span]:[font-weight:500] [&>span]:[font-size:1.5rem] [&>span]:[white-space:nowrap]" style={{ transform: `rotate(${a}deg) translateX(10.4rem) rotate(${-(a as number)}deg)` }}>
            <motion.span animate={{ rotate: -360 }} transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}>{l}</motion.span>
          </span>
        ))}
      </motion.div>
    </motion.div>
  );
}

/* Billing — claims processed bars */
const BARS = [21, 29, 25, 37, 34, 46, 44, 54, 51, 61];
function Billing() {
  return (
    <motion.div className="mini mini--billing [position:relative] [border-radius:1.6rem] [background:#fff] [border:1px_solid_#f0edff] [box-shadow:0_1.6rem_4rem_rgba(106,_65,_249,_0.12)] [padding:2rem] [font-family:var(--f-man)] [.svc-card>&]:[height:24rem] [.svc-card>&]:[flex-shrink:0] [margin:0.4rem_0_0] [display:flex] [flex-direction:column] [justify-content:space-between] [.svc-card>&+div]:[margin-top:3.2rem]! [@media(max-width:_1279px)]:[.svc-card>&]:[height:auto] [@media(max-width:_767px)]:[.svc-card_&]:[display:none]!" variants={inner()}>
      <div className="mini__row [display:flex] [justify-content:space-between] [align-items:flex-start]">
        <div><p className="mini__label [white-space:nowrap] [font-size:1.15rem] [letter-spacing:0.1rem] [text-transform:uppercase] [color:#3b3f4c]">Claims processed</p><CountUp className="mini__big [display:block] [margin-top:0.4rem] [font-weight:600] [font-size:2.9rem] [color:#111]" prefix="$" value={428.5} decimals={1} suffix="k" /></div>
        <span className="mini__pill [display:inline-flex] [align-items:center] [gap:0.6rem] [padding:0.5rem_1rem] [border-radius:2rem] [border:1px_solid_#e8e5f2] [font-size:1.1rem] [color:#3b3f4c]"><i className="dot [display:inline-block] [width:0.7rem] [height:0.7rem] [border-radius:50%] [background:#18b26b]" />+12.4%</span>
      </div>
      <div className="mini__bars [.mini--billing_&]:[margin-top:auto] [display:flex] [align-items:flex-end] [gap:0.7rem] [height:6.2rem] [margin-top:2.2rem] [&_i]:[flex:1] [&_i]:[border-radius:0.6rem] [&_i]:[background:linear-gradient(180deg,_#8a6bff,_#6a41f9)] [&_i]:[transform-origin:bottom]">
        {BARS.map((h, i) => (
          <motion.i key={i} style={{ height: `${h / 10}rem` }} variants={{ hidden: { scaleY: 0 }, show: { scaleY: 1, transition: { duration: 0.7, ease: ease.out, delay: 0.5 + i * 0.06 } } }} />
        ))}
      </div>
    </motion.div>
  );
}

/* Coding — CPT rows tick from Reviewing → Ready */
function Coding() {
  const rows = [['99214', 'Ready', 98], ['93000', 'Reviewed', 96], ['36415', 'Ready', 99]] as const;
  return (
    <motion.div className="mini mini--coding [position:relative] [border-radius:1.6rem] [background:#fff] [border:1px_solid_#f0edff] [box-shadow:0_1.6rem_4rem_rgba(106,_65,_249,_0.12)] [padding:2rem] [font-family:var(--f-man)] [.svc-card>&]:[height:24rem] [.svc-card>&]:[flex-shrink:0] [margin:0.4rem_0_0] [display:flex] [flex-direction:column] [justify-content:space-between] [.svc-card>&+div]:[margin-top:3.2rem]! [@media(max-width:_1279px)]:[.svc-card>&]:[height:auto] [@media(max-width:_767px)]:[.svc-card_&]:[display:none]!" variants={inner()}>
      {rows.map(([code, st, pct], i) => (
        <motion.div key={code} className="mini__cpt [display:flex] [align-items:center] [gap:1.2rem] [padding:1rem_1.1rem] [border-radius:0.8rem] [border:1px_solid_#ecebf2] [margin-bottom:0.8rem] [font-size:1.2rem] [&:last-child]:[margin-bottom:0] [&_b]:[font-weight:600] [&_b]:[flex:1] [&_small]:[font-size:1rem] [&_small]:[color:#6b6f7c]" variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0, transition: { delay: 0.5 + i * 0.15, duration: 0.6, ease: ease.out } } }}>
          <span className="mini__doc [width:2.8rem] [height:2.8rem] [border-radius:0.6rem] [background:#efeaff] [color:var(--purple)] [display:grid] [place-items:center] [&_svg]:[width:1.4rem] [&_svg]:[height:1.4rem]"><FileText /></span><b>{code}</b>
          <motion.small variants={{ hidden: { opacity: 0 }, show: { opacity: [0, 1, 0.3, 1], transition: { delay: 1 + i * 0.25, duration: 0.6 } } }}>{st}</motion.small>
          <CountUp className="mini__pct [color:var(--purple)] [font-weight:600] [min-width:2.6rem] [text-align:right]" value={pct} suffix="%" delay={0.7 + i * 0.15} />
        </motion.div>
      ))}
    </motion.div>
  );
}

/* Peer-to-peer: a denied case, its packet ticking ready, then approved on the call */
function P2P() {
  const steps = ['Criteria mapped', 'Chart evidence', 'Physician brief'];
  return (
    <motion.div className="mini mini--ar mini--p2p [position:relative] [border-radius:1.6rem] [background:#fff] [border:1px_solid_#f0edff] [box-shadow:0_1.6rem_4rem_rgba(106,_65,_249,_0.12)] [padding:2rem] [font-family:var(--f-man)] [.svc-card>&]:[height:24rem] [.svc-card>&]:[flex-shrink:0] [.svc-card>&+div]:[margin-top:3.2rem]! [margin:0.4rem_0_0] [@media(max-width:_1279px)]:[.svc-card>&]:[height:auto] [display:flex] [flex-direction:column] [overflow:hidden] [@media(max-width:_767px)]:[.svc-card_&]:[display:none]!" variants={inner()}>
      <div className="mini__row [display:flex] [justify-content:space-between] [align-items:flex-start]"><p className="mini__label [white-space:nowrap] [font-size:1.15rem] [letter-spacing:0.1rem] [text-transform:uppercase] [color:#3b3f4c]">Peer-to-peer · 78452</p>
        <span className="mini__pill [display:inline-flex] [align-items:center] [gap:0.6rem] [padding:0.5rem_1rem] [border-radius:2rem] [border:1px_solid_#e8e5f2] [font-size:1.1rem] [color:#3b3f4c]"><motion.i className="dot [display:inline-block] [width:0.7rem] [height:0.7rem] [border-radius:50%] [background:#18b26b]" animate={{ scale: [1, 1.6, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 1.6, repeat: Infinity }} />Booked</span></div>
      <div className="mini__p2p [display:flex] [flex-direction:column] [gap:0.7rem] [margin-top:1.6rem] [.mini--p2p_&]:[gap:0.5rem] [.mini--p2p_&]:[margin-top:1.2rem]">
        {steps.map((t, i) => (
          <motion.div key={t} className="mini__p2pr [display:flex] [align-items:center] [gap:1rem] [padding:0.9rem_1.1rem] [border-radius:0.8rem] [border:1px_solid_#ecebf2] [font-size:1.25rem] [font-weight:500] [color:#23243a] [.mini--p2p_&]:[padding:0.65rem_1rem] [.mini--p2p_&]:[font-size:1.2rem]" variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0, transition: { delay: 0.6 + i * 0.18, duration: 0.45 } } }}>
            <span className="mini__ck [flex:none] [width:1.8rem] [height:1.8rem] [border-radius:50%] [background:var(--purple)] [display:grid] [place-items:center] [.mini--p2p_&]:[width:1.6rem] [.mini--p2p_&]:[height:1.6rem]"><motion.svg viewBox="0 0 16 16" width="10" height="10"><motion.path d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
              variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { delay: 0.75 + i * 0.18, duration: 0.3 } } }} /></motion.svg></span>{t}
          </motion.div>
        ))}
      </div>
      <motion.div className="mini__p2pok [display:flex] [justify-content:space-between] [align-items:center] [gap:1rem] [margin-top:1rem] [padding:1rem_1.2rem] [border-radius:0.9rem] [background:var(--grad-x)] [color:#fff] [font-size:1.25rem] [&_span]:[opacity:0.75] [&_span]:[text-decoration:line-through] [&_b]:[font-weight:600] [.mini--p2p_&]:[margin-top:auto] [.mini--p2p_&]:[padding:0.85rem_1.1rem] [.mini--p2p_&]:[font-size:1.2rem]" variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { delay: 1.4, duration: 0.5 } } }}>
        <span>Denied</span><b>Approved on the call</b>
      </motion.div>
    </motion.div>
  );
}

/* Denials — queue bars */
function Denials() {
  const rows = [['Eligibility', 24, 0.72], ['Coding', 15, 0.46], ['Authorization', 9, 0.28]] as const;
  return (
    <motion.div className="mini mini--denial [position:relative] [border-radius:1.6rem] [background:#fff] [border:1px_solid_#f0edff] [box-shadow:0_1.6rem_4rem_rgba(106,_65,_249,_0.12)] [font-family:var(--f-man)] [.svc-card>&]:[height:24rem] [.svc-card>&]:[flex-shrink:0] [.svc-card>&+div]:[margin-top:3.2rem]! [width:30.7rem] [align-self:center] [padding:1.8rem] [@media(max-width:_1279px)]:[width:100%] [@media(max-width:_1279px)]:[.svc-card>&]:[height:auto] [display:flex] [flex-direction:column] [@media(max-width:_767px)]:[.svc-card_&]:[display:none]!" variants={inner()}>
      <div className="mini__row [display:flex] [justify-content:space-between] [align-items:flex-start]"><p className="mini__label [white-space:nowrap] [font-size:1.15rem] [letter-spacing:0.1rem] [text-transform:uppercase] [color:#3b3f4c]">Denial queue</p>
        <span className="mini__pill [display:inline-flex] [align-items:center] [gap:0.6rem] [padding:0.5rem_1rem] [border-radius:2rem] [border:1px_solid_#e8e5f2] [font-size:1.1rem] [color:#3b3f4c]"><motion.i className="dot [display:inline-block] [width:0.7rem] [height:0.7rem] [border-radius:50%] [background:#18b26b]" animate={{ scale: [1, 1.6, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 1.6, repeat: Infinity }} />On track</span></div>
      {rows.map(([l, n, w], i) => (
        <div key={l} className="mini__queue [display:flex] [align-items:center] [gap:1rem] [margin-top:1.3rem] [font-size:1.05rem] [color:#6b6f7c] [&_small]:[width:8.2rem]">
          <small>{l}</small>
          <span className="mini__track mini__track--thin [display:block] [border-radius:1rem] [background:#ece8fb] [margin-top:1.4rem] [overflow:hidden] [&_i]:[display:block] [&_i]:[height:100%] [&_i]:[border-radius:1rem] [&_i]:[background:linear-gradient(90deg,_#8a6bff,_#6a41f9)] [&_i]:[transform-origin:left] [height:0.65rem] [margin:0]! [flex:1]"><motion.i variants={{ hidden: { scaleX: 0 }, show: { scaleX: w, transition: { duration: 1.1, ease: ease.out, delay: 0.6 + i * 0.15 } } }} /></span>
          <CountUp className="mini__n [width:2rem] [text-align:right] [font-weight:700] [color:#111]" value={n} delay={0.6 + i * 0.15} />
        </div>
      ))}
      {/* fills the lower half: what the queue turned into this month */}
      <motion.div className="mini__dfoot [display:grid] [align-items:end] [gap:2rem] [margin-top:auto] [padding-top:1.6rem] [border-top:1px_dashed_#ece8fa] [&_small]:[display:block] [&_small]:[font-size:1.05rem] [&_small]:[letter-spacing:0.06rem] [&_small]:[text-transform:uppercase] [&_small]:[color:#6b6f7c] [grid-template-columns:auto_auto_minmax(7rem,_1fr)]" variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { delay: 1.1, duration: 0.5 } } }}>
        <div><small>Recovered this month</small><CountUp className="mini__dbig [display:block] [margin-top:0.4rem] [font-weight:600] [font-size:2.2rem] [color:#111] [font-variant-numeric:tabular-nums]" prefix="$" value={48.2} decimals={1} suffix="k" delay={1.2} /></div>
        <div><small>Overturned</small><CountUp className="mini__dbig mini__dbig--p [display:block] [margin-top:0.4rem] [font-weight:600] [font-size:2.2rem] [font-variant-numeric:tabular-nums] [color:var(--purple)]" value={86} suffix="%" delay={1.25} /></div>
        <svg className="mini__spark [width:100%] [min-width:7rem] [max-width:14rem] [height:3.6rem] [justify-self:end]" viewBox="0 0 120 36" aria-hidden>
          <motion.path d="M2 30 L20 26 L38 28 L56 19 L74 21 L92 11 L118 5" fill="none" stroke="#6a41f9" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
            variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { delay: 1.3, duration: 1.1, ease: ease.out } } }} />
          <motion.circle cx="118" cy="5" r="3.2" fill="#6a41f9" variants={{ hidden: { scale: 0 }, show: { scale: 1, transition: { delay: 2.3 } } }} />
        </svg>
      </motion.div>
    </motion.div>
  );
}

export function Services() {
  return (
    <section className="svc container [padding-inline:var(--gutter)] [padding-top:16rem] [@media(max-width:_1279px)]:[padding-inline:2rem] [@media(max-width:_1279px)]:[max-width:100vw] [@media(max-width:_1279px)]:[padding-top:10rem]" id="services">
      <div className="svc__head [display:flex] [justify-content:space-between] [align-items:flex-end] [@media(max-width:_1279px)]:[flex-direction:column] [@media(max-width:_1279px)]:[align-items:flex-start] [@media(max-width:_1279px)]:[gap:2rem]">
        <div>
          <Eyebrow>/ Services</Eyebrow>
          <SplitWords className="h-64 [font-weight:500] [font-size:5.6rem] [line-height:1.08] [letter-spacing:-0.12rem] [color:var(--ink-2)] [text-wrap:balance] [.svc\_\_head_&]:[margin-top:1.2rem] [.plat\_\_center_&]:[color:var(--ink-2)] [@media(max-width:_1279px)]:[font-size:3.8rem] [@media(max-width:_1279px)]:[overflow-wrap:anywhere] [@media(max-width:_640px)]:[font-size:3.4rem]" lines={['Every step of the', 'revenue cycle, covered.']} />
        </div>
        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={vp} transition={{ duration: 0.8, ease: ease.out, delay: 0.3 }}>
          <Button to="/services">View All</Button>
        </motion.div>
      </div>

      <motion.div className="svc__grid [display:grid] [grid-template-columns:repeat(4,_minmax(0,_1fr))] [grid-template-rows:auto_auto] [gap:2.4rem] [margin-top:5rem] [@media(max-width:_1279px)]:[grid-template-columns:1fr] [@media(max-width:_1279px)]:[grid-template-rows:none] [@media(min-width:_768px)_and_(max-width:_1279px)]:[grid-template-columns:repeat(2,_minmax(0,_1fr))]" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}>
        <motion.article className="svc-card svc-card--tall [position:relative] [border-radius:2.4rem] [border:1px_solid_#f0edff] [background:var(--panel)] [padding:3.3rem_2.5rem_2.5rem] [display:flex] [flex-direction:column] [overflow:hidden] [&_h3]:[font-weight:500] [&_h3]:[font-size:2.4rem] [&_h3]:[line-height:1] [&_h3]:[color:var(--ink-2)] [&_p]:[margin-top:1.3rem] [&_p]:[font-size:1.8rem] [&_p]:[line-height:1.6] [&_p]:[color:var(--ink-2)] [&>div:nth-of-type(2)]:[margin-top:3.4rem] [grid-row:1_/_span_2] [@media(max-width:_1279px)]:[grid-column:auto] [@media(max-width:_1279px)]:[grid-row:auto] [@media(max-width:_1279px)]:[min-height:0] [@media(max-width:_1279px)]:[&>div:nth-of-type(2)]:[margin-top:2.4rem] [@media(max-width:_767px)]:[padding:2.8rem_2.4rem] [@media(max-width:_767px)]:[&>div:nth-of-type(2)]:[margin-top:0]" {...cardLink('revenue-cycle-management')} variants={card} whileHover={{ y: -6 }}>
          <Orbit />
          <motion.div variants={inner(0.15)}><h3>Revenue Cycle Management</h3><p>One accountable team from patient registration to final payment, with fewer handoffs and fewer leaks.</p></motion.div>
          <Link>Get a free revenue assessment</Link>
        </motion.article>

        <motion.article className="svc-card svc-card--billing [position:relative] [border-radius:2.4rem] [border:1px_solid_#f0edff] [background:var(--panel)] [padding:3.3rem_2.5rem_2.5rem] [display:flex] [flex-direction:column] [overflow:hidden] [&_h3]:[font-weight:500] [&_h3]:[font-size:2.4rem] [&_h3]:[line-height:1] [&_h3]:[color:var(--ink-2)] [&_p]:[margin-top:1.3rem] [&_p]:[font-size:1.8rem] [&_p]:[line-height:1.6] [&_p]:[color:var(--ink-2)] [@media(max-width:_1279px)]:[grid-column:auto] [@media(max-width:_1279px)]:[grid-row:auto] [@media(max-width:_1279px)]:[min-height:0] [@media(max-width:_1279px)]:[&>div:nth-of-type(2)]:[margin-top:2.4rem] [@media(max-width:_767px)]:[padding:2.8rem_2.4rem] [@media(max-width:_767px)]:[&>div:nth-of-type(2)]:[margin-top:0]" {...cardLink('medical-billing')} variants={card} whileHover={{ y: -6 }}>
          <Billing />
          <motion.div variants={inner(0.15)}><h3>Medical Billing</h3><p>Clean claims sent on time and payments posted daily, set up around your payers.</p></motion.div>
          <Link to="/services/medical-billing">Explore medical billing</Link>
        </motion.article>

        <motion.article className="svc-card svc-card--coding [position:relative] [border-radius:2.4rem] [border:1px_solid_#f0edff] [background:var(--panel)] [padding:3.3rem_2.5rem_2.5rem] [display:flex] [flex-direction:column] [overflow:hidden] [&_h3]:[font-weight:500] [&_h3]:[font-size:2.4rem] [&_h3]:[line-height:1] [&_h3]:[color:var(--ink-2)] [&_p]:[margin-top:1.3rem] [&_p]:[font-size:1.8rem] [&_p]:[line-height:1.6] [&_p]:[color:var(--ink-2)] [@media(max-width:_1279px)]:[grid-column:auto] [@media(max-width:_1279px)]:[grid-row:auto] [@media(max-width:_1279px)]:[min-height:0] [@media(max-width:_1279px)]:[&>div:nth-of-type(2)]:[margin-top:2.4rem] [@media(max-width:_767px)]:[padding:2.8rem_2.4rem] [@media(max-width:_767px)]:[&>div:nth-of-type(2)]:[margin-top:0]" {...cardLink('medical-coding')} variants={card} whileHover={{ y: -6 }}>
          <Coding />
          <motion.div variants={inner(0.15)}><h3>Medical Coding</h3><p>Certified coders who capture the full value of every visit without adding audit risk.</p></motion.div>
          <Link to="/services/medical-coding">Explore medical coding</Link>
        </motion.article>

        <motion.article className="svc-card svc-card--tall svc-card--ar [position:relative] [border-radius:2.4rem] [border:1px_solid_#f0edff] [background:var(--panel)] [padding:3.3rem_2.5rem_2.5rem] [display:flex] [flex-direction:column] [overflow:hidden] [&_h3]:[font-weight:500] [&_h3]:[font-size:2.4rem] [&_h3]:[line-height:1] [&_h3]:[color:var(--ink-2)] [&_p]:[margin-top:1.3rem] [&_p]:[font-size:1.8rem] [&_p]:[line-height:1.6] [&_p]:[color:var(--ink-2)] [&>div:nth-of-type(2)]:[margin-top:3.4rem] [grid-row:1_/_span_2] [grid-column:4] [@media(max-width:_1279px)]:[grid-column:auto] [@media(max-width:_1279px)]:[grid-row:auto] [@media(max-width:_1279px)]:[min-height:0] [@media(max-width:_1279px)]:[&>div:nth-of-type(2)]:[margin-top:2.4rem] [@media(max-width:_767px)]:[padding:2.8rem_2.4rem] [@media(max-width:_767px)]:[&>div:nth-of-type(2)]:[margin-top:0]" {...cardLink('peer-to-peer-review')} variants={card} whileHover={{ y: -6 }}>
          <P2P />
          <motion.div variants={inner(0.15)}><h3>Peer-to-Peer Review</h3><p>We book the call inside the payer’s window, build the case and brief your physician, so medical-necessity denials get turned around.</p></motion.div>
          <Link to="/services/peer-to-peer-review">See how we prep the call</Link>
        </motion.article>

        <motion.article className="svc-card svc-card--wide [position:relative] [border-radius:2.4rem] [border:1px_solid_#f0edff] [background:var(--panel)] [display:flex] [overflow:hidden] [&_h3]:[font-weight:500] [&_h3]:[font-size:2.4rem] [&_h3]:[line-height:1] [&_h3]:[color:var(--ink-2)] [&_p]:[margin-top:1.3rem] [&_p]:[font-size:1.8rem] [&_p]:[line-height:1.6] [&_p]:[color:var(--ink-2)] [grid-column:2_/_span_2] [grid-row:2] [flex-direction:row] [justify-content:space-between] [padding:2.5rem] [@media(max-width:_1279px)]:[grid-column:auto] [@media(max-width:_1279px)]:[grid-row:auto] [@media(max-width:_1279px)]:[min-height:0] [@media(max-width:_1279px)]:[flex-direction:column] [@media(max-width:_1279px)]:[gap:3rem] [@media(max-width:_1279px)]:[&>div:nth-of-type(2)]:[margin-top:2.4rem] [@media(max-width:_767px)]:[padding:2.8rem_2.4rem] [@media(max-width:_767px)]:[&>div:nth-of-type(2)]:[margin-top:0] [@media(min-width:_768px)_and_(max-width:_1279px)]:[grid-column:1_/_-1]!" {...cardLink('denial-management')} variants={card} whileHover={{ y: -6 }}>
          <div className="svc-card__copy [display:flex] [flex-direction:column] [justify-content:space-between] [flex:1] [min-width:0] [padding-top:0.8rem] [@media(max-width:_1279px)]:[width:100%]">
            <motion.div variants={inner(0.1)}><h3>Denial Management</h3><p>We fix denied claims, find out why they were denied, and stop the same denials from coming back.</p></motion.div>
            <Link>Book a consultation call</Link>
          </div>
          <Denials />
        </motion.article>
      </motion.div>
    </section>
  );
}
