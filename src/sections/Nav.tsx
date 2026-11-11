import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';
import {
  RefreshCw, Receipt, FileCheck2, ShieldAlert, Hourglass, BadgeCheck, UserCheck, ClipboardCheck, MessageSquareText, PhoneCall,
  Scissors, Flower2, Ribbon, Brain, Salad, Radiation, Droplets, Bandage, BrainCircuit, Microscope, Pill, Footprints, HeartPulse, Eye,
  Siren, Droplet, Stethoscope, Activity, Venus, Baby, Syringe, Bone, ScanFace, ArrowRight, BarChart3, BookOpen, Users, Menu as MenuIcon, X, Plus,
} from 'lucide-react';
import { Button, Logo, UsFlag } from '../components/ui';
import { SERVICES as SVC_DATA } from '../data/services';
import { getSpecialtyLite, SPECIALTIES as SP_ALL } from '../data/specialties';
import { SearchButton } from '../components/Search';
import { STATES as STATE_DATA, FEATURED as STATE_FEATURED, SHOW_STATES } from '../data/states';
const STATE_TOP = STATE_FEATURED.map((slug) => STATE_DATA.find((x) => x.slug === slug)!);
import { slugify, u, go } from '../router';

// lets menu links close the panel after navigating
let closeAll = () => {};
import { ease } from '../motion';

const Chevron = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden><path d="m8 10 4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

/* ---------- Menu content ---------- */
// Services offered on rcm.affinitycore.co
const SERVICES: [ReactNode, string, string][] = [
  [<RefreshCw />, 'Revenue Cycle Management', 'One team from registration to payment'],
  [<Receipt />, 'Medical Billing', 'Clean claims, sent on time'],
  [<FileCheck2 />, 'Medical Coding', 'Certified, specialty-specific coding'],
  [<BadgeCheck />, 'Credentialing & Enrollment', 'Get in-network with payers faster'],
  [<ClipboardCheck />, 'Charge Entry', 'Every billable service captured'],
  [<MessageSquareText />, 'Payment Posting', 'Payments matched and reconciled daily'],
  [<ShieldAlert />, 'Denial Management', 'Fix denials and stop repeats'],
  [<Hourglass />, 'A/R Recovery', 'Collect aged and unpaid claims'],
  [<UserCheck />, 'Medical Billing Audits', 'Find leaks before payers do'],
  [<PhoneCall />, 'Peer-to-Peer Review', 'Denials prepped for the physician call'],
];
const SPECIALTIES: [ReactNode, string][] = [
  [<Scissors />, 'Ambulatory Surgery Centers'], [<Flower2 />, 'Allergy & Immunology'], [<Syringe />, 'Anesthesia'], [<HeartPulse />, 'Cardiology'],
  [<ScanFace />, 'Dermatology'], [<Salad />, 'Gastroenterology'], [<Stethoscope />, 'Internal Medicine'], [<BrainCircuit />, 'Mental Health'],
  [<Droplet />, 'Nephrology'], [<Brain />, 'Neurology'], [<Venus />, 'Obstetrics & Gynecology'], [<Ribbon />, 'Oncology'],
  [<Eye />, 'Ophthalmology'], [<Bone />, 'Orthopedics'], [<Activity />, 'Pain Management'], [<Microscope />, 'Pathology'],
  [<Baby />, 'Pediatrics'], [<Footprints />, 'Podiatry'], [<Pill />, 'Psychiatry'], [<Radiation />, 'Radiology'],
  [<Siren />, 'Urgent Care'], [<Droplets />, 'Urology'], [<Bandage />, 'Wound Care'],
];

type Menu = 'services' | 'specialties' | 'states' | 'insights' | null;
const ORDER = { services: 0, specialties: 1, states: 2, insights: 3 } as const;

const list = {
  hidden: {},
  show: { transition: { staggerChildren: 0.018, delayChildren: 0.05 } },
};
const itemV = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: ease.out } },
};

function ServicesMenu() {
  return (
    <div className="dd__services [display:grid] [grid-template-columns:1fr_30rem] [gap:2.4rem] [padding:2.4rem] [width:104rem]">
      <motion.ul className="dd__svc-list [display:grid] [grid-template-columns:1fr_1fr] [gap:0.4rem]" variants={list} initial="hidden" animate="show">
        {SERVICES.map(([icon, t, d]) => (
          <motion.li key={t} variants={itemV}>
            <a href={u(`/services/${SVC_DATA.find((x) => x.name === t)?.slug ?? ''}`)} className="dd__svc [display:flex] [align-items:center] [gap:1.4rem] [padding:1.2rem] [border-radius:1.4rem] [transition:background_0.3s] [&_b]:[display:block] [&_b]:[font-weight:500] [&_b]:[font-size:1.8rem] [&_b]:[color:var(--ink-2)] [&_small]:[display:block] [&_small]:[margin-top:0.2rem] [&_small]:[font-size:1.5rem] [&_small]:[color:#6b6f7c] [&:hover]:[background:#f7f5ff]" onClick={() => closeAll()}>
              <span className="dd__icon [width:4.4rem] [height:4.4rem] [border-radius:1.2rem] [background:#f1edff] [color:var(--purple)] [display:grid] [place-items:center] [flex-shrink:0] [transition:background_0.3s,_color_0.3s] [&_svg]:[width:2.2rem] [&_svg]:[height:2.2rem] [&_svg]:[stroke-width:1.7] [.dd\_\_svc:hover_&]:[background:var(--purple)] [.dd\_\_svc:hover_&]:[color:#fff] [.dd\_\_spec:hover_&]:[background:var(--purple)] [.dd\_\_spec:hover_&]:[color:#fff] [.dd\_\_insight_&]:[margin-bottom:0.8rem] [.dd\_\_insight:hover_&]:[background:var(--purple)] [.dd\_\_insight:hover_&]:[color:#fff]">{icon}</span>
              <span><b>{t}</b><small>{d}</small></span>
            </a>
          </motion.li>
        ))}
      </motion.ul>
      <motion.a href="#assessment" className="dd__feature [display:flex] [flex-direction:column] [gap:1.2rem] [padding:3.2rem] [border-radius:1.8rem] [color:#fff] [background:radial-gradient(120%_90%_at_100%_0%,_#8a6bff,_var(--purple)_50%,_#4b23d6)] [&_b]:[font-weight:500] [&_b]:[font-size:2.8rem] [&_b]:[line-height:1.1] [&>span:nth-of-type(2)]:[font-size:1.6rem] [&>span:nth-of-type(2)]:[line-height:1.5] [&>span:nth-of-type(2)]:[opacity:0.88]" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: ease.out, delay: 0.1 }}>
        <span className="dd__feature-kicker [font-family:var(--f-mono)] [font-size:1.3rem] [letter-spacing:0.08em] [text-transform:uppercase] [opacity:0.8] [.dd\_\_insight_&]:[color:var(--purple)]">Free for practices</span>
        <b>Revenue assessment</b>
        <span>Find out where your revenue is leaking, with numbers from your own claims.</span>
        <span className="dd__feature-link [margin-top:auto] [display:inline-flex] [align-items:center] [gap:0.8rem] [font-weight:600] [font-size:1.7rem] [&_svg]:[width:1.8rem] [&_svg]:[height:1.8rem] [&_svg]:[transition:transform_0.4s_cubic-bezier(.16,1,.3,1)] [.dd\_\_feature:hover_&_svg]:[transform:translateX(0.6rem)] [.dd\_\_insight_&]:[color:var(--purple)] [.dd\_\_insight_&]:[margin-top:0.8rem]">Get yours <ArrowRight /></span>
      </motion.a>
    </div>
  );
}

/** Built specialty pages open directly; the rest open the overview focused on that specialty. */
const specHref = (name: string) => {
  const slug = slugify(name);
  return getSpecialtyLite(slug)?.page ? u(`/specialties/${slug}`) : u(`/specialties?focus=${slug}`);
};

function SpecialtiesMenu() {
  return (
    <div className="dd__specs [width:120rem] [padding:2.4rem]">
      <motion.ul className="dd__spec-grid [display:grid] [grid-template-columns:repeat(4,_1fr)] [gap:0.2rem_0.8rem]" variants={list} initial="hidden" animate="show">
        {SPECIALTIES.map(([icon, t]) => (
          <motion.li key={t} variants={itemV}>
            <a href={specHref(t)} className="dd__spec [&:hover]:[background:#f7f5ff] [display:flex] [align-items:center] [gap:1.2rem] [padding:0.9rem_1rem] [border-radius:1.2rem] [font-size:1.7rem] [color:var(--ink-2)] [transition:background_0.3s]" onClick={() => closeAll()}><span className="dd__icon dd__icon--sm [background:#f1edff] [color:var(--purple)] [display:grid] [place-items:center] [flex-shrink:0] [transition:background_0.3s,_color_0.3s] [&_svg]:[stroke-width:1.7] [width:3.6rem] [height:3.6rem] [border-radius:1rem] [&_svg]:[width:1.9rem] [&_svg]:[height:1.9rem] [.dd\_\_svc:hover_&]:[background:var(--purple)] [.dd\_\_svc:hover_&]:[color:#fff] [.dd\_\_spec:hover_&]:[background:var(--purple)] [.dd\_\_spec:hover_&]:[color:#fff] [.dd\_\_insight_&]:[margin-bottom:0.8rem] [.dd\_\_insight:hover_&]:[background:var(--purple)] [.dd\_\_insight:hover_&]:[color:#fff]">{icon}</span>{t}</a>
          </motion.li>
        ))}
      </motion.ul>
      <a href={u("/specialties")} className="dd__foot [display:flex] [justify-content:space-between] [align-items:center] [margin-top:1.6rem] [padding:1.6rem_2rem] [border-radius:1.4rem] [background:#f7f5ff] [font-size:1.7rem] [color:#4a4f63] [&_span]:[display:inline-flex] [&_span]:[align-items:center] [&_span]:[gap:0.6rem] [&_span]:[color:var(--purple)] [&_span]:[font-weight:600] [&_svg]:[width:1.8rem] [&_svg]:[height:1.8rem] [.dd\_\_states_&]:[margin-top:1.2rem]" onClick={() => closeAll()}>Don’t see your specialty? We likely bill for it. <span>Talk to us <ArrowRight /></span></a>
    </div>
  );
}

function StatesMenu() {
  return (
    <div className="dd__states [padding:2.4rem] [width:64rem]">
      <motion.ul className="dd__state-list [flex-direction:column] [display:grid]! [grid-template-columns:repeat(2,_minmax(0,_1fr))] [gap:0.6rem]" variants={list} initial="hidden" animate="show">
        {STATE_TOP.map((s) => (
          <motion.li key={s.slug} variants={itemV}>
            <a href={u(`/states/${s.slug}`)} className="dd__state [display:grid] [grid-template-columns:4.8rem_minmax(0,_1fr)_2rem] [gap:1.4rem] [align-items:center] [padding:1.2rem_1.4rem_1.2rem_1.2rem] [border-radius:1.6rem] [color:var(--ink-2)] [transition:background_0.3s] [&:hover]:[background:#f7f5ff] [&_b]:[display:block] [&_b]:[font-weight:500] [&_b]:[font-size:1.9rem] [&_small]:[display:block] [&_small]:[font-size:1.4rem] [&_small]:[color:#6b6f7c]" onClick={() => closeAll()}>
              <span className="dd__abbr [width:4.8rem] [height:4.8rem] [border-radius:1.3rem] [display:grid] [place-items:center] [background:#efeaff] [color:var(--purple)] [font-family:var(--f-mono)] [font-weight:600] [font-size:1.6rem] [transition:background_0.3s,_color_0.3s] [.dd\_\_state:hover_&]:[background:var(--purple)] [.dd\_\_state:hover_&]:[color:#fff]">{s.abbr}</span>
              <span><b>{s.name}</b><small>{s.chips[0][1]} · {s.chips[1][1]}</small></span>
              <ArrowRight className="dd__state-go [width:1.8rem] [height:1.8rem] [color:var(--purple)] [opacity:0] [transition:opacity_0.3s,_transform_0.3s] [.dd\_\_state:hover_&]:[opacity:1] [.dd\_\_state:hover_&]:[transform:translateX(0.3rem)]" />
            </a>
          </motion.li>
        ))}
      </motion.ul>
      <a href={u("/states")} className="dd__foot [display:flex] [justify-content:space-between] [align-items:center] [margin-top:1.6rem] [padding:1.6rem_2rem] [border-radius:1.4rem] [background:#f7f5ff] [font-size:1.7rem] [color:#4a4f63] [&_span]:[display:inline-flex] [&_span]:[align-items:center] [&_span]:[gap:0.6rem] [&_span]:[color:var(--purple)] [&_span]:[font-weight:600] [&_svg]:[width:1.8rem] [&_svg]:[height:1.8rem] [.dd\_\_states_&]:[margin-top:1.2rem]" onClick={() => closeAll()}>Every state has its own page. <span>All 50 states <ArrowRight /></span></a>
    </div>
  );
}

function InsightsMenu() {
  const cards = [
    { href: u('/case-studies'), icon: <BarChart3 />, kicker: 'Proof', title: 'Case Studies', body: 'Before-and-after numbers from practices that switched to Affinity Core.' },
    { href: u('/blog'), icon: <BookOpen />, kicker: 'Learn', title: 'Blog', body: 'Plain-English guides on denials, coding updates and getting paid faster.' },
    { href: u('/about'), icon: <Users />, kicker: 'Company', title: 'About us', body: 'Who we are, how we work, and the team that will run your billing.' },
  ];
  return (
    <motion.div className="dd__insights [display:grid] [gap:1.2rem] [padding:2.4rem] [grid-template-columns:repeat(3,_1fr)] [width:96rem]" variants={list} initial="hidden" animate="show">
      {cards.map((c) => (
        <motion.a key={c.title} href={c.href} className="dd__insight [display:flex] [flex-direction:column] [gap:1rem] [padding:2.4rem] [border-radius:1.8rem] [background:#f7f5ff] [color:var(--ink-2)] [transition:background_0.3s] [&_b]:[font-weight:500] [&_b]:[font-size:2.4rem] [&>span:nth-of-type(3)]:[font-size:1.6rem] [&>span:nth-of-type(3)]:[line-height:1.5] [&>span:nth-of-type(3)]:[color:#5b5f72] [&:hover]:[background:#efeaff]" variants={itemV} onClick={() => closeAll()}>
          <span className="dd__icon [width:4.4rem] [height:4.4rem] [border-radius:1.2rem] [background:#f1edff] [color:var(--purple)] [display:grid] [place-items:center] [flex-shrink:0] [transition:background_0.3s,_color_0.3s] [&_svg]:[width:2.2rem] [&_svg]:[height:2.2rem] [&_svg]:[stroke-width:1.7] [.dd\_\_svc:hover_&]:[background:var(--purple)] [.dd\_\_svc:hover_&]:[color:#fff] [.dd\_\_spec:hover_&]:[background:var(--purple)] [.dd\_\_spec:hover_&]:[color:#fff] [.dd\_\_insight_&]:[margin-bottom:0.8rem] [.dd\_\_insight:hover_&]:[background:var(--purple)] [.dd\_\_insight:hover_&]:[color:#fff]">{c.icon}</span>
          <span className="dd__feature-kicker [font-family:var(--f-mono)] [font-size:1.3rem] [letter-spacing:0.08em] [text-transform:uppercase] [opacity:0.8] [.dd\_\_insight_&]:[color:var(--purple)]">{c.kicker}</span>
          <b>{c.title}</b>
          <span>{c.body}</span>
          <span className="dd__feature-link [margin-top:auto] [display:inline-flex] [align-items:center] [gap:0.8rem] [font-weight:600] [font-size:1.7rem] [&_svg]:[width:1.8rem] [&_svg]:[height:1.8rem] [&_svg]:[transition:transform_0.4s_cubic-bezier(.16,1,.3,1)] [.dd\_\_feature:hover_&_svg]:[transform:translateX(0.6rem)] [.dd\_\_insight_&]:[color:var(--purple)] [.dd\_\_insight_&]:[margin-top:0.8rem]">Explore <ArrowRight /></span>
        </motion.a>
      ))}
    </motion.div>
  );
}

const item = {
  hidden: { opacity: 0, y: -14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: ease.out } },
};

/* ---------- Drawer menu for tablet, small desktop and phone (below 1280px) ---------- */
function MobileMenu({ onClose }: { onClose: () => void }) {
  const [sec, setSec] = useState<string | null>('services');
  const groups: { id: string; label: string; all?: [string, string]; links: [string, string][] }[] = [
    { id: 'services', label: 'Services', all: [u('/services'), 'All services'], links: SVC_DATA.map((x) => [u(`/services/${x.slug}`), x.name]) },
    { id: 'specialties', label: 'Specialties', all: [u('/specialties'), 'All 23 specialties'], links: SP_ALL.filter((x) => x.page).map((x) => [u(`/specialties/${x.slug}`), x.name]) },
    ...(SHOW_STATES ? [{ id: 'states', label: 'States', all: [u('/states'), 'All 50 states'] as [string, string], links: STATE_TOP.map((x) => [u(`/states/${x.slug}`), x.name] as [string, string]) }] : []),
    { id: 'company', label: 'Insights & company', links: [[u('/case-studies'), 'Case Studies'], [u('/blog'), 'Blog'], [u('/about'), 'About us'], [u('/careers'), 'Careers'], [u('/contact'), 'Contact']] },
  ];
  useEffect(() => {
    const prev = document.body.style.overflow; document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey); window.addEventListener('hashchange', onClose);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); window.removeEventListener('hashchange', onClose); };
  }, [onClose]);
  return (
    <motion.div className="mm [position:fixed] [inset:0] [z-index:1000] [background:rgba(20,_14,_48,_0.35)] [-webkit-backdrop-filter:blur(0.6rem)] [backdrop-filter:blur(0.6rem)] [overflow-y:auto] [overscroll-behavior:contain]" role="dialog" aria-modal="true" aria-label="Site menu" data-lenis-prevent
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.25 } }} transition={{ duration: 0.3 }}>
      <motion.div className="mm__panel [min-height:100%] [background:#fff] [display:flex] [flex-direction:column] [padding:2rem_2.4rem_3.2rem]" initial={{ y: -24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -16, opacity: 0 }} transition={{ duration: 0.45, ease: ease.out }}>
        <div className="mm__head [display:flex] [justify-content:space-between] [align-items:center] [padding-bottom:1.6rem] [border-bottom:1px_solid_#f0edf9]">
          <a href={u("/")} className="nav__logo [display:inline-flex] [align-items:center] [gap:1.4rem]" onClick={onClose} aria-label="Affinity Core Billers, home"><Logo /></a>
          <button type="button" className="mm__close [width:4.8rem] [height:4.8rem] [border-radius:50%] [border:1px_solid_#e6dfff] [background:#f8f6ff] [color:var(--ink-2)] [display:grid] [place-items:center] [cursor:pointer] [&_svg]:[width:2.2rem] [&_svg]:[height:2.2rem]" onClick={onClose} aria-label="Close menu"><X /></button>
        </div>
        <nav className="mm__body [flex:1] [padding-top:0.8rem]">
          {groups.map((g, gi) => (
            <motion.div key={g.id} className={String.raw`mm__group [border-bottom:1px_solid_#f0edf9] ${sec === g.id ? 'is-open' : ''}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: ease.out, delay: 0.08 + gi * 0.05 }}>
              <button type="button" className="mm__tog [width:100%] [display:flex] [justify-content:space-between] [align-items:center] [padding:2rem_0] [border:0] [background:none] [font:500_2.6rem/1.2_var(--f-jak)] [letter-spacing:-0.06rem] [color:var(--ink-2)] [cursor:pointer] [text-align:left] [@media(max-width:_640px)]:[font-size:2.2rem]" aria-expanded={sec === g.id} onClick={() => setSec(sec === g.id ? null : g.id)}>
                <span className="mm__lab [display:inline-flex] [align-items:center]">{g.id === 'states' && <UsFlag className="nav__flag [width:1.9rem] [margin-right:-0.3rem] [.mm\_\_lab_&]:[margin-right:0.6rem]" />}{g.label}</span><span className="mm__plus [width:3.6rem] [height:3.6rem] [border-radius:50%] [display:grid] [place-items:center] [background:#f1ecff] [color:var(--purple)] [transition:transform_0.4s_cubic-bezier(.16,1,.3,1),_background_0.3s,_color_0.3s] [&_svg]:[width:1.8rem] [&_svg]:[height:1.8rem] [.mm\_\_group.is-open_&]:[transform:rotate(45deg)] [.mm\_\_group.is-open_&]:[background:var(--purple)] [.mm\_\_group.is-open_&]:[color:#fff]"><Plus /></span>
              </button>
              <AnimatePresence initial={false}>
                {sec === g.id && (
                  <motion.div className="mm__links [overflow:hidden] [&_ul]:[list-style:none] [&_ul]:[margin:0] [&_ul]:[padding:0_0_1.2rem] [&_ul]:[display:grid] [&_ul]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] [&_ul]:[gap:0_2.4rem] [&_li_a]:[display:block] [&_li_a]:[padding:1.1rem_0] [&_li_a]:[font-size:1.7rem] [&_li_a]:[color:#4a4f63] [&_li_a]:[border-bottom:1px_dashed_#f0edf9] [&_li_a:hover]:[color:var(--purple)] [@media(max-width:_640px)]:[&_ul]:[grid-template-columns:minmax(0,_1fr)]" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: ease.out }}>
                    <ul>
                      {g.links.map(([h, l]) => <li key={h}><a href={h} onClick={onClose}>{l}</a></li>)}
                    </ul>
                    {g.all && <a href={g.all[0]} className="mm__all [display:inline-flex] [align-items:center] [gap:0.6rem] [margin:0.4rem_0_2rem] [font-weight:500] [font-size:1.6rem] [color:var(--purple)] [&_svg]:[width:1.6rem] [&_svg]:[height:1.6rem]" onClick={onClose}>{g.all[1]} <ArrowRight /></a>}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </nav>
        <div className="mm__foot [display:flex] [flex-direction:column] [gap:1.2rem] [padding-top:2.4rem]">
          <a href={u("/contact")} className="mm__cta [display:flex] [justify-content:center] [align-items:center] [gap:0.8rem] [height:5.6rem] [border-radius:3rem] [background:var(--purple)] [color:#fff] [font-weight:500] [font-size:1.8rem] [&_svg]:[width:1.8rem] [&_svg]:[height:1.8rem]" onClick={onClose}>Get a free revenue assessment <ArrowRight /></a>
          <a href="tel:+12148512698" className="mm__call [display:flex] [justify-content:center] [align-items:center] [height:5.6rem] [border-radius:3rem] [border:1.5px_solid_var(--purple)] [color:var(--purple)] [font-weight:500] [font-size:1.8rem]">Call 214-851-2698</a>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Nav({ show }: { show: boolean }) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState<Menu>(null);
  const [mob, setMob] = useState(false);
  const closeMob = useRef(() => setMob(false)).current;
  const [dir, setDir] = useState(1);
  // Perf: the shared-layout link to the loader bar is only needed for the intro handoff; afterwards
  // drop it so the nav isn't re-projected on every scroll frame.
  const [shell, setShell] = useState(true);
  useEffect(() => { const t = window.setTimeout(() => setShell(false), 1800); return () => window.clearTimeout(t); }, []);
  const closeT = useRef<number | undefined>(undefined);

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    if (!open) setHidden(y > prev && y > 400);
    setScrolled(y > 40);
  });

  const openMenu = (m: Menu) => {
    window.clearTimeout(closeT.current);
    if (m && open && m !== open) setDir(ORDER[m] > ORDER[open] ? 1 : -1);
    setOpen(m);
  };
  closeAll = () => setOpen(null);
  const scheduleClose = () => { window.clearTimeout(closeT.current); closeT.current = window.setTimeout(() => setOpen(null), 160); };

  return (
    <motion.header className="nav-wrap [position:fixed] [top:calc(1.2rem_+_env(safe-area-inset-top,_0px))] [left:calc(var(--gutter)_-_3.2rem)] [right:calc(var(--gutter)_-_3.2rem)] [z-index:50] [@media(max-width:_1279px)]:[top:1rem] [@media(max-width:_1279px)]:[left:1rem] [@media(max-width:_1279px)]:[right:1rem]" animate={{ y: hidden ? '-130%' : '0%' }} transition={{ duration: 0.6, ease: ease.out }}
      onMouseLeave={scheduleClose} onMouseEnter={() => window.clearTimeout(closeT.current)}
      onKeyDown={(e) => { if (e.key === 'Escape') setOpen(null); }}>
      <motion.nav layoutId={shell ? 'shell' : undefined} className={String.raw`nav [position:relative] [height:7.7rem] [border-radius:2.4rem]! [display:flex] [align-items:center] [justify-content:space-between] [padding-inline:3.2rem] [background:rgba(255,_255,_255,_0.8)] [backdrop-filter:blur(1.6rem)] [box-shadow:0_0_0_rgba(0,_0,_0,_0)] [transition:box-shadow_0.4s] [&.is-scrolled]:[box-shadow:0_1rem_4rem_rgba(40,_20,_120,_0.08)] [@media(max-width:_1279px)]:[padding-inline:2rem] [@media(max-width:_1279px)]:[height:7.6rem] [@media(max-width:_480px)]:[padding-inline:1.4rem] ${scrolled || open ? 'is-scrolled' : ''}`} style={{ borderRadius: 24 }}
        transition={{ duration: 1, ease: ease.curtain }}
        initial="hidden" animate={show ? 'show' : 'hidden'}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.55 } } }}>
        <motion.a href={u("/")} variants={item} className="nav__logo [display:inline-flex] [align-items:center] [gap:1.4rem]" aria-label="Affinity Core Billers, home" onMouseEnter={() => scheduleClose()}><Logo /></motion.a>
        <ul className="nav__links [margin-left:6.4rem] [margin-right:auto] [display:flex] [gap:3.2rem] [font-size:2rem] [letter-spacing:-0.01rem] [&_svg]:[width:2.4rem] [&_svg]:[height:2.4rem] [@media(max-width:_1440px)]:[margin-left:4rem] [@media(max-width:_1440px)]:[gap:2.4rem] [@media(max-width:_1279px)]:[display:none]">
          {(SHOW_STATES ? (['services', 'specialties', 'states', 'insights'] as const) : (['services', 'specialties', 'insights'] as const)).map((m) => (
            <motion.li key={m} variants={item}>
              <button className={String.raw`nav__trigger [display:flex] [align-items:center] [gap:0.8rem] [line-height:6rem] [color:#000] [position:relative] [font-size:2rem] [&::after]:[content:''] [&::after]:[position:absolute] [&::after]:[left:0] [&::after]:[right:3.2rem] [&::after]:[bottom:1.2rem] [&::after]:[height:1px] [&::after]:[background:currentColor] [&::after]:[transform:scaleX(0)] [&::after]:[transform-origin:right] [&::after]:[transition:transform_0.5s_cubic-bezier(.16,_1,_.3,_1)] [a&::after]:[right:0] [&:hover::after]:[transform:scaleX(1)] [&:hover::after]:[transform-origin:left] [&.is-open::after]:[transform:scaleX(1)] [&.is-open::after]:[transform-origin:left] [&.is-open]:[color:var(--purple)] [&:focus-visible]:[outline:2px_solid_var(--purple)] [&:focus-visible]:[outline-offset:4px]! [&:focus-visible]:[border-radius:0.6rem] ${open === m ? 'is-open' : ''}`} aria-expanded={open === m} aria-haspopup="true"
                onMouseEnter={() => openMenu(m)} onFocus={() => openMenu(m)} onClick={() => { if (m === 'services' || m === 'specialties' || m === 'states') { go(`/${m}`); setOpen(null); } else setOpen(open === m ? null : m); }}>
                {m === 'services' ? 'Services' : m === 'specialties' ? 'Specialties' : m === 'states' ? <><UsFlag className="nav__flag [width:1.9rem] [margin-right:-0.3rem] [.mm\_\_lab_&]:[margin-right:0.6rem]" />States</> : 'Insights'}
                <motion.span animate={{ rotate: open === m ? 180 : 0 }} transition={{ duration: 0.4, ease: ease.out }} style={{ display: 'grid' }}><Chevron /></motion.span>
              </button>
            </motion.li>
          ))}
        </ul>
        <div className="nav__actions [display:flex] [align-items:center] [gap:1.6rem] [@media(max-width:_480px)]:[gap:0.6rem]" onMouseEnter={() => scheduleClose()}>
          <motion.div variants={item}><SearchButton /></motion.div>
          <motion.a variants={{ hidden: { scale: 0, opacity: 0 }, show: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 22 } } }}
            className="nav__phone [height:4.8rem] [padding:0_2.2rem_0_1.8rem] [border-radius:6rem] [background:var(--purple)] [color:#fff] [display:inline-flex] [align-items:center] [gap:1rem] [font-weight:500] [font-size:1.8rem] [white-space:nowrap] [&_svg]:[width:2.2rem] [&_svg]:[height:2.2rem] [&_svg]:[flex:none] [@media(max-width:_1440px)]:[padding:0] [@media(max-width:_1440px)]:[justify-content:center] [@media(max-width:_1440px)]:[width:4.8rem] [@media(max-width:_480px)]:[width:4.2rem]! [@media(max-width:_480px)]:[height:4.2rem]!" href="tel:+12148512698" aria-label="Call us at 214-851-2698" whileHover="ring">
            <motion.svg variants={{ ring: { rotate: [0, -14, 12, -8, 0], transition: { duration: 0.6 } } }} width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M21 16.5v2.6a1.8 1.8 0 0 1-2 1.8A17.8 17.8 0 0 1 3.1 5 1.8 1.8 0 0 1 4.9 3h2.6c.9 0 1.6.6 1.8 1.5l.5 2.2c.1.6-.1 1.3-.6 1.7L7.9 9.6a14.4 14.4 0 0 0 6.5 6.5l1.2-1.3c.4-.5 1.1-.7 1.7-.6l2.2.5c.9.2 1.5.9 1.5 1.8Z" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" /></motion.svg>
            <span className="nav__phone-n [@media(max-width:_1440px)]:[display:none]">214-851-2698</span>
          </motion.a>
          <motion.div variants={item}><Button to="/contact">Get a free revenue assessment</Button></motion.div>
          <motion.button variants={item} type="button" className="nav__burger [display:none] [width:4.8rem] [height:4.8rem] [border-radius:50%] [border:1px_solid_var(--lav-border,_#e6dfff)] [background:#fff] [color:var(--ink-2)] [place-items:center] [cursor:pointer] [&_svg]:[width:2.2rem] [&_svg]:[height:2.2rem] [@media(max-width:_1279px)]:[display:grid]" aria-label="Open menu" aria-expanded={mob} onClick={() => setMob(true)}><MenuIcon /></motion.button>
        </div>
      </motion.nav>

      <AnimatePresence>{mob && <MobileMenu onClose={closeMob} />}</AnimatePresence>

      {/* One panel that morphs its size between menus; content slides in the direction you moved */}
      <div className="dd-wrap [position:absolute] [left:0] [right:0] [top:100%] [display:flex] [justify-content:center] [padding-top:1.2rem] [pointer-events:none] [@media(max-width:_1279px)]:[display:none]">
        <AnimatePresence>
          {open && (
            <motion.div className="dd [pointer-events:auto] [background:rgba(255,_255,_255,_0.96)] [backdrop-filter:blur(2rem)] [border:1px_solid_#ece8fb] [box-shadow:0_3rem_8rem_rgba(40,_20,_120,_0.14)] [overflow:hidden]" layout key="dd"
              initial={{ opacity: 0, y: -10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.25, ease: [0.4, 0, 1, 1] } }}
              transition={{ duration: 0.5, ease: ease.out, layout: { duration: 0.55, ease: ease.out } }}
              style={{ borderRadius: 24 }}>
              <AnimatePresence mode="popLayout" initial={false} custom={dir}>
                <motion.div key={open} layout="position" custom={dir}
                  initial={{ opacity: 0, x: dir * 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: dir * -40 }}
                  transition={{ duration: 0.45, ease: ease.out }}>
                  {open === 'services' ? <ServicesMenu /> : open === 'specialties' ? <SpecialtiesMenu /> : open === 'states' ? <StatesMenu /> : <InsightsMenu />}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}


