'use client';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Mail } from 'lucide-react';
import { Eyebrow, SplitWords } from '../components/ui';
import { Link } from '../router';
import { PRIVACY, TERMS, type LegalDoc } from '../data/legal';
import { ease } from '../motion';
import '../styles/pages.css';

export function LegalPage({ kind }: { kind: 'privacy' | 'terms' }) {
  const doc: LegalDoc = kind === 'privacy' ? PRIVACY : TERMS;
  const other = kind === 'privacy' ? { to: '/terms', label: 'Terms and conditions' } : { to: '/privacy-policy', label: 'Privacy policy' };
  const [active, setActive] = useState(doc.sections[0].id);

  // Scroll-spy: the section nearest the top of the viewport lights up in the contents list.
  useEffect(() => {
    const els = doc.sections.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver((entries) => {
      const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (vis[0]) setActive(vis[0].target.id);
    }, { rootMargin: '-20% 0px -65% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [doc]);

  const idx = doc.sections.findIndex((s) => s.id === active);

  return (
    <main className="lg page">
      <header className="lg-hero container">
        <div className="lg-hero__glow" aria-hidden />
        <Eyebrow>{doc.eyebrow}</Eyebrow>
        <SplitWords as="h1" className="lg-hero__title" lines={[doc.title]} animateNow />
        <motion.p className="lg-hero__intro" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.35 }}>{doc.intro}</motion.p>
        <motion.div className="lg-hero__meta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.55 }}>
          <span><i aria-hidden /> Last updated {doc.updated}</span>
          <span>{doc.sections.length} sections</span>
        </motion.div>
      </header>

      <div className="lg-body container">
        <aside className="lg-toc" aria-label="On this page">
          <p className="lg-toc__h">On this page</p>
          <div className="lg-toc__rail" aria-hidden><motion.i animate={{ scaleY: (idx + 1) / doc.sections.length }} transition={{ duration: 0.6, ease: ease.out }} /></div>
          <ol>
            {doc.sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className={s.id === active ? 'is-on' : ''}
                  onClick={(e) => { e.preventDefault(); document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>
                  <span>{String(i + 1).padStart(2, '0')}</span>{s.h}
                </a>
              </li>
            ))}
          </ol>
          <Link to={other.to} className="lg-toc__other">{other.label} <ArrowUpRight size={15} /></Link>
        </aside>

        <article className="lg-doc">
          {doc.sections.map((s, i) => (
            <motion.section key={s.id} id={s.id} className="lg-sec"
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.8, ease: ease.out }}>
              <h2><span>{String(i + 1).padStart(2, '0')}</span>{s.h}</h2>
              {s.body.map((b, k) => Array.isArray(b)
                ? <ul key={k}>{b.map((li) => <li key={li}>{li}</li>)}</ul>
                : <p key={k}>{b}</p>)}
            </motion.section>
          ))}
          <div className="lg-cta">
            <span className="lg-cta__ico"><Mail size={20} /></span>
            <div><b>Questions about this page?</b><p>Email info@affinitycore.co and a person on our team will reply.</p></div>
            <a href="mailto:info@affinitycore.co" className="lg-cta__btn">Email us <ArrowUpRight size={16} /></a>
          </div>
        </article>
      </div>
    </main>
  );
}
