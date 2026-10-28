import { useEffect, useRef, useState } from 'react';
import person1 from '../assets/person-1.webp';
import person2 from '../assets/person-2.webp';
import person3 from '../assets/person-3.webp';
import person4 from '../assets/person-4.webp';
import person5 from '../assets/person-5.webp';
import { motion, AnimatePresence, LayoutGroup, useScroll, useSpring } from 'motion/react';
import { ArrowRight, ChevronLeft, ExternalLink, Clock } from 'lucide-react';
import { Button, Eyebrow, Logo, Reveal, SplitWords } from '../components/ui';
import { CTA } from '../sections/Closing';
import { Link, go } from '../router';
import { ARTICLES, TOPICS, getArticle, type Article, type Block } from '../data/insights';
import { ease, vp } from '../motion';
// Perf: pre-blurred copy of fluted-purple.jpg replaces a live backdrop-filter blur on these panels
import fluted from '../assets/fluted-frost.jpg';
import { SceneCover } from '../components/BlogCover';
import { BlogArt } from '../components/BlogArt';

const setMeta = (title: string, desc: string) => {
  document.title = `${title} · Affinity Core`;
  let m = document.querySelector('meta[name="description"]');
  if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m); }
  m.setAttribute('content', desc);
};
const live = (a: Article) => !!a.body;

/* ---- Cover style: "headline" (text on image, best for Google Images / social) or "scene" (illustration). ---- */
type CoverStyle = 'headline' | 'people' | 'scene';
let coverStyle: CoverStyle = (() => { try { return (localStorage.getItem('ac-blog-cover') as CoverStyle) || 'headline'; } catch { return 'headline'; } })();
const coverSubs = new Set<(s: CoverStyle) => void>();
const setCoverStyle = (v: CoverStyle) => { coverStyle = v; try { localStorage.setItem('ac-blog-cover', v); } catch { /* ignore */ } coverSubs.forEach((f) => f(v)); };
function useCoverStyle() {
  const [v, set] = useState(coverStyle);
  useEffect(() => { coverSubs.add(set); return () => { coverSubs.delete(set); }; }, []);
  return v;
}

/** Headline cover: the article's hook written on a branded image. Built to be the featured / OG image too. */
/* Cutout people for the headline covers (Envato Elements, licensed to "Affinity Core Website"). */
const PEOPLE = [person1, person2, person3, person4, person5];
function HeadlineCover({ a, big, person }: { a: Article; big?: boolean; person?: boolean }) {
  const [lead, accent] = a.hook ?? [a.title, ''];
  const who = PEOPLE[Math.max(0, ARTICLES.findIndex((x) => x.slug === a.slug)) % PEOPLE.length];
  return (
    <div className={`bh-cover ${big ? 'bh-cover--big' : ''} ${person ? 'bh-cover--person' : ''}`}>
      <span className="bh-cover__flute" aria-hidden />
      <span className="bh-cover__glow" aria-hidden />
      {person && <img className="bh-cover__person" src={who} alt="" loading="lazy" decoding="async" />}
      <span className="bh-cover__topic">{a.topic}</span>
      <p className="bh-cover__hook">{lead}{accent && <> <em>{accent}</em></>}</p>
      <span className="bh-cover__foot"><Logo light className="bh-cover__logo" /><span>{a.read}</span></span>
    </div>
  );
}

/** Scene cover: a small, recognizable moment from the practice's day (see components/BlogCover). */
function Cover({ a, big }: { a: Article; big?: boolean }) {
  const style = useCoverStyle();
  return (
    <motion.div className={`bc ${big ? 'bc--big' : ''} ${style !== 'scene' ? 'bc--headline' : ''}`} initial="rest" animate="rest" whileHover="hover">
      {style !== 'scene' ? <HeadlineCover a={a} big={big} person={style === 'people'} /> : <>
        <span className="bc__topic">{a.topic}</span>
        {a.cover && <SceneCover c={a.cover} />}
      </>}
      {!live(a) && <span className="bc__soon">Coming soon</span>}
    </motion.div>
  );
}

/** Review switcher: compare the two cover styles (remove before launch). */
function CoverPicker() {
  const v = useCoverStyle();
  return (
    <div className="ccp" role="radiogroup" aria-label="Blog cover style (review)">
      <span>Cover style</span>
      {([['headline', 'Headline'], ['people', 'Headline + person'], ['scene', 'Illustration']] as const).map(([id, l]) => (
        <button key={id} type="button" role="radio" aria-checked={v === id} className={v === id ? 'is-on' : ''} onClick={() => setCoverStyle(id)}>{l}</button>
      ))}
    </div>
  );
}

export function Card({ a, k, still }: { a: Article; k: number; still?: boolean }) {
  const on = live(a);
  const enter = still ? {} : { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: vp, transition: { duration: 0.8, ease: ease.out, delay: (k % 3) * 0.08 } };
  return (
    <motion.article className={`bk ${on ? '' : 'is-soon'}`} onClick={() => on && go(`/blog/${a.slug}`)} {...enter}>
      <Cover a={a} />
      <div className="bk__body">
        <small className="bk__meta">{a.topic} · {a.read}</small>
        <h3>{a.title}</h3>
        <p>{a.dek}</p>
        {on && <span className="cs__more">Read article <ArrowRight size={18} /></span>}
      </div>
    </motion.article>
  );
}

export function BlogHub() {
  const [t, setT] = useState<string>('All');
  const [all, setAll] = useState(false);
  const feat = ARTICLES[0];
  const rest = ARTICLES.slice(1).filter((a) => t === 'All' || a.topic === t);
  useEffect(() => setMeta('Medical Billing Blog', 'Plain-English guides on prior auth, coding, denials, credentialing and A/R for medical practices.'), []);
  return (
    <main className="page">
      <section className="bh container">
        <div className="bh__copy">
          <motion.p className="eyebrow" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: ease.out, delay: 0.2 }}>/ Blog</motion.p>
          <SplitWords as="h1" className="page-title" animateNow delay={0.3} stagger={0.05} lines={['Billing, explained', 'in plain English.']} bold={['English.']} />
          <motion.p className="page-sub" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.75 }}>
            Rule changes, coding traps and denial fixes, written by the people who work them every day. Short, sourced, and useful at the front desk.
          </motion.p>
        </div>
        <motion.article className="bf" onClick={() => go(`/blog/${feat.slug}`)} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: ease.out, delay: 0.4 }}>
          <BlogArt />
          <div className="bf__body">
            <small className="bk__meta"><span className="bf__new">Latest</span> {feat.topic} · {feat.date} · {feat.read}</small>
            <h2>{feat.title}</h2>
            <p>{feat.dek}</p>
            <span className="cs__more">Read article <ArrowRight size={18} /></span>
          </div>
        </motion.article>
      </section>

      <section className="bl container">
        <div className="bl__head">
          <Eyebrow>/ All articles</Eyebrow>
          <LayoutGroup>
            <div className="need__chips bl__chips" role="tablist">
              {TOPICS.map((x) => (
                <button key={x} role="tab" aria-selected={t === x} className={`need__chip ${t === x ? 'is-on' : ''}`} onClick={() => setT(x)}>
                  {t === x && <motion.span layoutId="bl-pill" className="need__pill" transition={{ type: 'spring', stiffness: 260, damping: 32 }} />}
                  <span>{x}</span>
                </button>
              ))}
            </div>
          </LayoutGroup>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={t} className={`bl__grid ${all ? 'is-all' : ''}`} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: ease.out } }} exit={{ opacity: 0, y: -6, transition: { duration: 0.2, ease: 'easeIn' } }}>
            {rest.length ? rest.map((a, k) => <Card key={a.slug} a={a} k={k} still={t !== 'All'} />) : <p className="bl__none">Nothing on this topic yet. It’s on the list.</p>}
          </motion.div>
        </AnimatePresence>
        {!all && rest.length > 3 && <button type="button" className="bl__more" onClick={() => setAll(true)}>Show all {rest.length} articles</button>}
        <CoverPicker />
      </section>

      <section className="nl container">
        <Reveal className="nl__panel">
          <div className="sl__bg" aria-hidden><img src={fluted} alt="" /></div>
          <div className="nl__copy">
            <Eyebrow>/ The billing briefing</Eyebrow>
            <SplitWords className="h-56" lines={['One email a month.', 'Only what changed.']} stagger={0.04} />
            <p className="body-18">Payer rule changes, new codes and the denial trends we’re seeing, in five minutes.</p>
          </div>
          <form className="nl__form" onSubmit={(e) => { e.preventDefault(); (e.currentTarget.querySelector('button') as HTMLButtonElement).textContent = 'Subscribed ✓'; }}>
            <label htmlFor="nl-email">Work email</label>
            <div><input id="nl-email" type="email" required placeholder="you@yourpractice.com" /><button type="submit">Subscribe</button></div>
            <small>No spam. Unsubscribe any time.</small>
          </form>
        </Reveal>
      </section>

      <CTA eyebrow="/ Rather talk it through?" lines={['Ask a billing specialist.', 'Free, no obligation.']} />
    </main>
  );
}

/* ================= Article ================= */
function Body({ b }: { b: Block }) {
  switch (b.t) {
    case 'p': return <p>{b.text}</p>;
    case 'h2': return <h2 id={b.id}>{b.text}</h2>;
    case 'list': return <ul>{b.items.map((x) => <li key={x}>{x}</li>)}</ul>;
    case 'callout': return <aside className="ar__callout"><b>{b.title}</b><p>{b.text}</p></aside>;
    case 'stat': return <figure className="ar__stat"><b>{b.value}</b><figcaption>{b.text}<small>{b.source}</small></figcaption></figure>;
    case 'timeline': return (
      <ol className="ar__tl">{b.items.map(([d, x], i) => (
        <motion.li key={d} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.6, ease: ease.out, delay: i * 0.08 }}>
          <time>{d}</time><p>{x}</p>
        </motion.li>
      ))}</ol>
    );
    case 'table': return (
      <div className="ar__table"><table><thead><tr>{b.head.map((h) => <th key={h}>{h}</th>)}</tr></thead>
        <tbody>{b.rows.map((r) => <tr key={r[0]}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>)}</tbody></table></div>
    );
  }
}

export function ArticlePage({ slug }: { slug: string }) {
  const a = getArticle(slug)!;
  const { scrollYProgress } = useScroll();
  const prog = useSpring(scrollYProgress, { stiffness: 120, damping: 26 });
  const toc = (a.body ?? []).filter((b): b is Extract<Block, { t: 'h2' }> => b.t === 'h2');
  const [act, setAct] = useState(toc[0]?.id);
  const bodyRef = useRef<HTMLDivElement>(null);
  useEffect(() => setMeta(a.title, a.dek), [a]);
  useEffect(() => {
    const els = toc.map((t) => document.getElementById(t.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver((es) => { es.forEach((e) => { if (e.isIntersecting) setAct(e.target.id); }); }, { rootMargin: '-30% 0px -60% 0px' });
    els.forEach((e) => io.observe(e)); return () => io.disconnect();
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps
  const more = ARTICLES.filter((x) => x.slug !== slug).slice(0, 3);
  return (
    <main className="page">
      <motion.div className="ar__prog" style={{ scaleX: prog }} aria-hidden />
      <header className="ar__head container">
        <motion.nav className="crumbs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} aria-label="Breadcrumb">
          <Link to="/blog"><ChevronLeft size={16} /> Blog</Link><span>/</span><span>{a.topic}</span>
        </motion.nav>
        <SplitWords as="h1" className="page-title ar__title" animateNow delay={0.3} stagger={0.03} lines={[a.title]} />
        <motion.p className="page-sub ar__dek" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.6 }}>{a.dek}</motion.p>
        <motion.p className="ar__meta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>{a.author} · {a.date} · <Clock size={14} /> {a.read}</motion.p>
      </header>
      <div className="ar__wrap container">
        <aside className="ar__toc" aria-label="On this page">
          <small>On this page</small>
          {toc.map((t) => (
            <a key={t.id} href={`#${t.id}`} className={act === t.id ? 'is-on' : ''} onClick={(e) => { e.preventDefault(); document.getElementById(t.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>
              {act === t.id && <motion.i layoutId="toc-bar" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}{t.text}
            </a>
          ))}
          <div className="ar__toc-cta">
            <p>Want us to handle this for you?</p>
            <Button>Get a free assessment</Button>
          </div>
        </aside>
        <article className="ar__body" ref={bodyRef}>
          {(a.body ?? []).map((b, i) => <Body key={i} b={b} />)}
          {a.sources && (
            <section className="ar__src">
              <h3>Sources</h3>
              <ol>{a.sources.map(([t, u]) => <li key={u}><a href={u} target="_blank" rel="noopener noreferrer">{t} <ExternalLink size={13} /></a></li>)}</ol>
            </section>
          )}
        </article>
      </div>
      <section className="bl container">
        <div className="bl__head"><Eyebrow>/ Keep reading</Eyebrow></div>
        <div className="bl__grid">{more.map((m, k) => <Card key={m.slug} a={m} k={k} />)}</div>
      </section>
      <CTA eyebrow="/ Rather hand it off?" lines={['We’ll handle the paperwork.', 'You handle the patients.']} />
    </main>
  );
}
