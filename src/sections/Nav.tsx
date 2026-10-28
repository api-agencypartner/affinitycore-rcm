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
import { STATES as STATE_DATA, SHOW_STATES } from '../data/states';
import { slugify } from '../router';

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
    <div className="dd__services">
      <motion.ul className="dd__svc-list" variants={list} initial="hidden" animate="show">
        {SERVICES.map(([icon, t, d]) => (
          <motion.li key={t} variants={itemV}>
            <a href={`#/services/${SVC_DATA.find((x) => x.name === t)?.slug ?? ''}`} className="dd__svc" onClick={() => closeAll()}>
              <span className="dd__icon">{icon}</span>
              <span><b>{t}</b><small>{d}</small></span>
            </a>
          </motion.li>
        ))}
      </motion.ul>
      <motion.a href="#assessment" className="dd__feature" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: ease.out, delay: 0.1 }}>
        <span className="dd__feature-kicker">Free for practices</span>
        <b>Revenue assessment</b>
        <span>Find out where your revenue is leaking, with numbers from your own claims.</span>
        <span className="dd__feature-link">Get yours <ArrowRight /></span>
      </motion.a>
    </div>
  );
}

/** Built specialty pages open directly; the rest open the overview focused on that specialty. */
const specHref = (name: string) => {
  const slug = slugify(name);
  return getSpecialtyLite(slug)?.page ? `#/specialties/${slug}` : `#/specialties?focus=${slug}`;
};

function SpecialtiesMenu() {
  return (
    <div className="dd__specs">
      <motion.ul className="dd__spec-grid" variants={list} initial="hidden" animate="show">
        {SPECIALTIES.map(([icon, t]) => (
          <motion.li key={t} variants={itemV}>
            <a href={specHref(t)} className="dd__spec" onClick={() => closeAll()}><span className="dd__icon dd__icon--sm">{icon}</span>{t}</a>
          </motion.li>
        ))}
      </motion.ul>
      <a href="#/specialties" className="dd__foot" onClick={() => closeAll()}>Don’t see your specialty? We likely bill for it. <span>Talk to us <ArrowRight /></span></a>
    </div>
  );
}

function StatesMenu() {
  return (
    <div className="dd__states">
      <motion.ul className="dd__state-list" variants={list} initial="hidden" animate="show">
        {STATE_DATA.map((s) => (
          <motion.li key={s.slug} variants={itemV}>
            <a href={`#/states/${s.slug}`} className="dd__state" onClick={() => closeAll()}>
              <span className="dd__abbr">{s.abbr}</span>
              <span><b>{s.name}</b><small>{s.chips[0][1]} · {s.chips[1][1]}</small></span>
              <ArrowRight className="dd__state-go" />
            </a>
          </motion.li>
        ))}
      </motion.ul>
      <a href="#states" className="dd__foot" onClick={() => closeAll()}>We bill in all 50 states. <span>See the map <ArrowRight /></span></a>
    </div>
  );
}

function InsightsMenu() {
  const cards = [
    { href: '#/case-studies', icon: <BarChart3 />, kicker: 'Proof', title: 'Case Studies', body: 'Before-and-after numbers from practices that switched to Affinity Core.' },
    { href: '#/blog', icon: <BookOpen />, kicker: 'Learn', title: 'Blog', body: 'Plain-English guides on denials, coding updates and getting paid faster.' },
    { href: '#/about', icon: <Users />, kicker: 'Company', title: 'About us', body: 'Who we are, how we work, and the team that will run your billing.' },
  ];
  return (
    <motion.div className="dd__insights" variants={list} initial="hidden" animate="show">
      {cards.map((c) => (
        <motion.a key={c.title} href={c.href} className="dd__insight" variants={itemV} onClick={() => closeAll()}>
          <span className="dd__icon">{c.icon}</span>
          <span className="dd__feature-kicker">{c.kicker}</span>
          <b>{c.title}</b>
          <span>{c.body}</span>
          <span className="dd__feature-link">Explore <ArrowRight /></span>
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
    { id: 'services', label: 'Services', all: ['#/services', 'All services'], links: SVC_DATA.map((x) => [`#/services/${x.slug}`, x.name]) },
    { id: 'specialties', label: 'Specialties', all: ['#/specialties', 'All 23 specialties'], links: SP_ALL.filter((x) => x.page).map((x) => [`#/specialties/${x.slug}`, x.name]) },
    ...(SHOW_STATES ? [{ id: 'states', label: 'States', all: ['#states', 'All 50 states'] as [string, string], links: STATE_DATA.map((x) => [`#/states/${x.slug}`, x.name] as [string, string]) }] : []),
    { id: 'company', label: 'Insights & company', links: [['#/case-studies', 'Case Studies'], ['#/blog', 'Blog'], ['#/about', 'About us'], ['#/careers', 'Careers'], ['#/contact', 'Contact']] },
  ];
  useEffect(() => {
    const prev = document.body.style.overflow; document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey); window.addEventListener('hashchange', onClose);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); window.removeEventListener('hashchange', onClose); };
  }, [onClose]);
  return (
    <motion.div className="mm" role="dialog" aria-modal="true" aria-label="Site menu" data-lenis-prevent
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.25 } }} transition={{ duration: 0.3 }}>
      <motion.div className="mm__panel" initial={{ y: -24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -16, opacity: 0 }} transition={{ duration: 0.45, ease: ease.out }}>
        <div className="mm__head">
          <a href="#/" className="nav__logo" onClick={onClose} aria-label="Affinity Core RCM, home"><Logo /><span className="nav__sub" aria-hidden><i />RCM<UsFlag className="nav__sub-flag" /></span></a>
          <button type="button" className="mm__close" onClick={onClose} aria-label="Close menu"><X /></button>
        </div>
        <nav className="mm__body">
          {groups.map((g, gi) => (
            <motion.div key={g.id} className={`mm__group ${sec === g.id ? 'is-open' : ''}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: ease.out, delay: 0.08 + gi * 0.05 }}>
              <button type="button" className="mm__tog" aria-expanded={sec === g.id} onClick={() => setSec(sec === g.id ? null : g.id)}>
                {g.label}<span className="mm__plus"><Plus /></span>
              </button>
              <AnimatePresence initial={false}>
                {sec === g.id && (
                  <motion.div className="mm__links" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: ease.out }}>
                    <ul>
                      {g.links.map(([h, l]) => <li key={h}><a href={h} onClick={onClose}>{l}</a></li>)}
                    </ul>
                    {g.all && <a href={g.all[0]} className="mm__all" onClick={onClose}>{g.all[1]} <ArrowRight /></a>}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </nav>
        <div className="mm__foot">
          <a href="#/contact" className="mm__cta" onClick={onClose}>Get a free revenue assessment <ArrowRight /></a>
          <a href="tel:+12148512698" className="mm__call">Call 214-851-2698</a>
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
  const closeT = useRef<number>();

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
    <motion.header className="nav-wrap" animate={{ y: hidden ? '-130%' : '0%' }} transition={{ duration: 0.6, ease: ease.out }}
      onMouseLeave={scheduleClose} onMouseEnter={() => window.clearTimeout(closeT.current)}
      onKeyDown={(e) => { if (e.key === 'Escape') setOpen(null); }}>
      <motion.nav layoutId={shell ? 'shell' : undefined} className={`nav ${scrolled || open ? 'is-scrolled' : ''}`} style={{ borderRadius: 24 }}
        transition={{ duration: 1, ease: ease.curtain }}
        initial="hidden" animate={show ? 'show' : 'hidden'}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.55 } } }}>
        <motion.a href="#/" variants={item} className="nav__logo" aria-label="Affinity Core RCM, home" onMouseEnter={() => scheduleClose()}><Logo /><span className="nav__sub" aria-hidden><i />RCM<UsFlag className="nav__sub-flag" /></span></motion.a>
        <ul className="nav__links">
          {(SHOW_STATES ? (['services', 'specialties', 'states', 'insights'] as const) : (['services', 'specialties', 'insights'] as const)).map((m) => (
            <motion.li key={m} variants={item}>
              <button className={`nav__trigger ${open === m ? 'is-open' : ''}`} aria-expanded={open === m} aria-haspopup="true"
                onMouseEnter={() => openMenu(m)} onFocus={() => openMenu(m)} onClick={() => { if (m === 'services' || m === 'specialties') { window.location.hash = `/${m}`; setOpen(null); } else setOpen(open === m ? null : m); }}>
                {m === 'services' ? 'Services' : m === 'specialties' ? 'Specialties' : m === 'states' ? 'States' : 'Insights'}
                <motion.span animate={{ rotate: open === m ? 180 : 0 }} transition={{ duration: 0.4, ease: ease.out }} style={{ display: 'grid' }}><Chevron /></motion.span>
              </button>
            </motion.li>
          ))}
        </ul>
        <div className="nav__actions" onMouseEnter={() => scheduleClose()}>
          <motion.span variants={item} className="nav__us" title="Medical billing for US practices, by a US-based team"><UsFlag /><span className="nav__us-t">US-based</span></motion.span>
          <motion.div variants={item}><SearchButton /></motion.div>
          <motion.a variants={{ hidden: { scale: 0, opacity: 0 }, show: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 22 } } }}
            className="nav__phone" href="tel:+12148512698" aria-label="Call us at 214-851-2698" whileHover="ring">
            <motion.svg variants={{ ring: { rotate: [0, -14, 12, -8, 0], transition: { duration: 0.6 } } }} width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M21 16.5v2.6a1.8 1.8 0 0 1-2 1.8A17.8 17.8 0 0 1 3.1 5 1.8 1.8 0 0 1 4.9 3h2.6c.9 0 1.6.6 1.8 1.5l.5 2.2c.1.6-.1 1.3-.6 1.7L7.9 9.6a14.4 14.4 0 0 0 6.5 6.5l1.2-1.3c.4-.5 1.1-.7 1.7-.6l2.2.5c.9.2 1.5.9 1.5 1.8Z" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" /></motion.svg>
            <span className="nav__phone-n">214-851-2698</span>
          </motion.a>
          <motion.div variants={item}><Button to="/contact">Get a free revenue assessment</Button></motion.div>
          <motion.button variants={item} type="button" className="nav__burger" aria-label="Open menu" aria-expanded={mob} onClick={() => setMob(true)}><MenuIcon /></motion.button>
        </div>
      </motion.nav>

      <AnimatePresence>{mob && <MobileMenu onClose={closeMob} />}</AnimatePresence>

      {/* One panel that morphs its size between menus; content slides in the direction you moved */}
      <div className="dd-wrap">
        <AnimatePresence>
          {open && (
            <motion.div className="dd" layout key="dd"
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


