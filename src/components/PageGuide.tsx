/**
 * Content fold for child pages (services, specialties, states): a long-read guide built for SEO and
 * answer engines (AEO). It opens with a 40–60 word direct answer, then question-shaped H3s that each
 * answer themselves in the first sentence, so the text can be quoted on its own. All copy is plain HTML
 * (no hover or tab needed), which also keeps it in the server-rendered markup in the Next.js build.
 * Content is assembled from each page's own data, so every page reads differently.
 */
import { useEffect, useState, type ReactNode } from 'react';
import { ArrowRight, BookOpen, CheckCircle2, Sparkles } from 'lucide-react';
import { Eyebrow } from './ui';
import { Link } from '../router';
import type { ServiceFull } from '../data/services';
import type { SpecialtyFull } from '../data/specialties';
import { getSpecialtyLite } from '../data/specialties';
import type { StatePage } from '../data/states';

type Sec = { id: string; title: string; body: ReactNode };
type Guide = { key: string; tocTitle: string; title: string; answer: string; secs: Sec[]; cta: [string, string] };

/** lowercase a phrase's first word unless it's an acronym (ECG, MRI, CT) */
const soft = (t: string) => (/^[A-Z][a-z]/.test(t) ? t.charAt(0).toLowerCase() + t.slice(1) : t);
const strip = (t: string) => t.replace(/\s*\[Confirm with Affinity Core\]/g, '');
const words = (g: Guide) => g.answer.split(' ').length + g.secs.length * 140;

export function PageGuide({ g }: { g: Guide }) {
  const [on, setOn] = useState(g.secs[0].id);
  useEffect(() => {
    const els = g.secs.map((s) => document.getElementById(`pg-${g.key}-${s.id}`)).filter(Boolean) as HTMLElement[];
    const o = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setOn(e.target.id.split('-').pop()!); }), { rootMargin: '-35% 0px -55% 0px' });
    els.forEach((e) => o.observe(e)); return () => o.disconnect();
  }, [g]);
  const jump = (id: string) => document.getElementById(`pg-${g.key}-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return (
    <section className="sg pg container" aria-labelledby={`pg-${g.key}-t`} id="guide">
      <aside className="sg__toc">
        <Eyebrow>/ The guide</Eyebrow>
        <p className="sg__toc-t">{g.tocTitle}</p>
        <ol>{g.secs.map((s, i) => <li key={s.id}><button type="button" className={on === s.id ? 'is-on' : ''} onClick={() => jump(s.id)}><small>{String(i + 1).padStart(2, '0')}</small>{s.title}</button></li>)}</ol>
        <p className="sg__read"><BookOpen size={16} /> {Math.max(3, Math.round(words(g) / 220))} min read</p>
      </aside>
      <article className="sg__body">
        <h2 id={`pg-${g.key}-t`} className="h-56">{g.title}</h2>
        <div className="pg__answer"><span><Sparkles size={16} /> The short answer</span><p>{g.answer}</p></div>
        {g.secs.map((s) => (
          <div key={s.id} className="pg__sec">
            <h3 id={`pg-${g.key}-${s.id}`}>{s.title}</h3>
            {s.body}
          </div>
        ))}
        <p className="sg__end">{g.cta[0]} <Link to="#assessment" className="text-link">{g.cta[1]} <ArrowRight size={16} /></Link></p>
      </article>
    </section>
  );
}

/* ================================================================== */
/* Services                                                            */
/* ================================================================== */
export function serviceGuide(s: ServiceFull): Guide {
  const n = s.name, low = n.toLowerCase();
  const scope = s.ticket.scope.map(strip);
  return {
    key: s.slug,
    tocTitle: `${n}, explained`,
    title: `What ${low} is, how it works, and when to outsource it.`,
    answer: `${n} is one stage of the medical revenue cycle. In short: ${s.line.charAt(0).toLowerCase()}${s.line.slice(1)} Done well, it is the step that decides whether a claim is paid in full the first time, paid late after rework, or not paid at all. Practices either run it in-house or hand it to a specialist team that reports results monthly.`,
    secs: [
      { id: 'what', title: `What is ${low}?`, body: <>
        <p>{strip(s.heroSub)}</p>
        <p>{strip(s.ticket.intro)}</p>
      </> },
      { id: 'how', title: `How does ${low} work, step by step?`, body: <>
        <p>A well-run {low} process follows the same order on every claim. This is ours:</p>
        <ol className="pg__steps">{s.steps.map((st, i) => <li key={st.title}><b><small>{String(i + 1).padStart(2, '0')}</small>{strip(st.title)}</b><p>{strip(st.body)}</p></li>)}</ol>
      </> },
      { id: 'inc', title: `What should a ${low} service include?`, body: <>
        <p>Whoever runs it, in-house or outsourced, these are the parts to expect. If one is missing, that is usually where the money goes.</p>
        <ul className="sg__ask">{scope.map((t) => <li key={t}><CheckCircle2 size={18} />{t}</li>)}</ul>
        <p>Reporting: {strip(s.ticket.reporting)}. Owner: {strip(s.ticket.owner)}.</p>
      </> },
      { id: 'why', title: `Why does ${low} matter for revenue?`, body: <>
        <p>{s.stat.prefix ?? ''}{s.stat.value}{s.stat.suffix ?? ''} {strip(s.stat.label)} (<a href={s.stat.href} target="_blank" rel="noopener noreferrer">{s.stat.source}</a>). That gap is rarely one big failure. It is small, repeatable misses: a field left blank, a rule that changed, a follow-up that never happened.</p>
        <p>Because the misses repeat, fixing the cause is worth more than fixing the claim. That is why every {low} engagement ends each month with the pattern behind the numbers, not only the numbers.</p>
      </> },
      { id: 'when', title: `When should a practice outsource ${low}?`, body: <>
        <p>Outsourcing makes sense when the work is falling behind, when one person holds all the knowledge, or when the numbers are drifting and nobody has time to find out why. Common signs:</p>
        <ul className="pg__list">
          <li>Denial rate above 5–10%, or rising quarter over quarter.</li>
          <li>Days in A/R above 40, or a growing 90+ day bucket.</li>
          <li>Staff overtime or turnover in the billing office.</li>
          <li>No monthly report that explains why the numbers moved.</li>
        </ul>
        <p>You can also hand over just this part of the cycle and keep the rest in-house. It starts with a free review of one month of your claims.</p>
      </> },
    ],
    cta: [`Want to see how your ${low} compares?`, 'Get a free revenue assessment'],
  };
}

/* ================================================================== */
/* Specialties                                                         */
/* ================================================================== */
export function specialtyGuide(s: SpecialtyFull): Guide {
  const n = s.name, low = s.short && /^[A-Z/]+$/.test(s.short) ? s.short : n.toLowerCase();
  const codes = s.ledger.rows.slice(0, 6);
  const leaks = s.leak?.leaks ?? [];
  const seen = new Set<string>();
  const top = s.ledger.rows.filter((c) => { const k = c.name.split(',')[0]; if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, 3);
  const rel = s.related.map(getSpecialtyLite).filter(Boolean).slice(0, 3);
  return {
    key: s.slug,
    tocTitle: `${n} billing, explained`,
    title: `${n} billing: the codes, rules and leaks that decide what you get paid.`,
    answer: `${n} billing is the coding, claim submission and follow-up for ${low} services, from ${top.map((c) => soft(c.name.split(',')[0])).join(', ')} and beyond (CPT ${top.map((c) => c.code).join(', ')}). It differs from general medical billing because ${low} claims depend on specialty-specific codes, modifiers${s.auth ? ', prior authorizations' : ''} and payer policies that a generalist biller rarely sees.`,
    secs: [
      { id: 'what', title: `What makes ${low} billing different?`, body: <>
        <p>{strip(s.heroSub)}</p>
        <p>{strip(s.ledger.intro)}</p>
      </> },
      { id: 'codes', title: `Which codes matter most in ${low}?`, body: <>
        <p>These are the codes we see on {low} claims every day, what usually goes wrong with each, and how it gets caught before the claim goes out.</p>
        <div className="sg__table pg__codes" role="table" aria-label={`${n} codes`}>
          <div role="row" className="sg__tr sg__th"><span role="columnheader">Code</span><span role="columnheader">What trips it</span><span role="columnheader">How we catch it</span></div>
          {codes.map((c) => <div role="row" className="sg__tr" key={c.code}><b role="rowheader"><code>{c.code}</code> {c.name}</b><span role="cell">{strip(c.trip)}</span><span role="cell" className="is-us">{strip(c.catch)}</span></div>)}
        </div>
      </> },
      ...(leaks.length ? [{ id: 'leaks', title: `Where do ${low} practices lose revenue?`, body: <>
        <p>Most lost {low} revenue never shows up as a denial. It leaks in a few predictable places:</p>
        <ul className="sg__breaks">{leaks.map((l) => <li key={l.label}><b>{l.label}</b><p>{strip(l.cause)}</p><p className="pg__fix"><CheckCircle2 size={14} /> {strip(l.fix)}</p></li>)}</ul>
      </> } as Sec] : []),
      ...(s.auth ? [{ id: 'auth', title: `How does prior authorization work in ${low}?`, body: <>
        <p>{strip(s.auth.body)}</p>
        <p>Under the CMS Interoperability and Prior Authorization rule (CMS-0057-F), Medicare Advantage, Medicaid and CHIP plans must decide urgent requests within 72 hours and standard requests within 7 calendar days. We request the authorization before the patient is scheduled and track every one against that clock (<a href={s.auth.href} target="_blank" rel="noopener noreferrer">{s.auth.source}</a>).</p>
      </> } as Sec] : []),
      { id: 'ask', title: `What should you ask a ${low} billing company?`, body: <>
        <ul className="sg__ask">{[
          `How many ${low} practices do you bill for today, and which coders work them?`,
          `What are the top denial reasons you see in ${low}, and what do you change upstream to stop them?`,
          `How do you handle ${codes[0]?.code ?? 'our highest-volume'} and our other high-dollar codes before they go out?`,
          `Can you report our denial rate and days in A/R against ${low} benchmarks every month?`,
        ].map((q) => <li key={q}><CheckCircle2 size={18} />{q}</li>)}</ul>
        {rel.length > 0 && <p>Practices that bill {low} often bill {rel.map((r, i) => <span key={r!.slug}>{i > 0 && (i === rel.length - 1 ? ' and ' : ', ')}<Link to={`/specialties/${r!.slug}`}>{r!.name.toLowerCase()}</Link></span>)} as well. Each follows its own rulebook, and we bill all of them.</p>}
      </> },
    ],
    cta: [`Send us a month of ${low} claims.`, 'Get a free revenue assessment'],
  };
}

/* ================================================================== */
/* States                                                              */
/* ================================================================== */
export function stateGuide(s: StatePage): Guide {
  const n = s.name;
  const sp = s.specialties.map(getSpecialtyLite).filter(Boolean);
  const med = s.facts.find((f) => f.k === 'Medicare'), mcd = s.facts.find((f) => f.k === 'Medicaid'), pp = s.facts.find((f) => f.k === 'Prompt pay');
  return {
    key: s.slug,
    tocTitle: `Billing in ${n}, explained`,
    title: `Medical billing in ${n}: the payers, rules and deadlines to know.`,
    answer: `Medical billing in ${n} means working ${med ? med.title : 'the state’s Medicare contractor'} for Medicare Part B, ${mcd ? mcd.title : `${n} Medicaid`} for Medicaid, and holding state-regulated commercial plans to ${n}’s prompt-pay law${pp ? ` (${pp.title})` : ''}. Practices that miss these local rules lose money to avoidable denials and late payments.`,
    secs: [
      { id: 'diff', title: `What is different about billing in ${n}?`, body: <>
        <p>Federal rules are the same everywhere, but who processes the claim and how fast they must pay is set state by state. In {n}, four things shape every claim:</p>
        <ul className="sg__breaks">{s.facts.map((f) => <li key={f.k}><b>{f.k}: {f.title}</b><p>{strip(f.body)}{f.src && <> (<a href={f.src.href} target="_blank" rel="noopener noreferrer">{f.src.label}</a>)</>}</p></li>)}</ul>
      </> },
      ...(pp ? [{ id: 'pay', title: `How fast must ${n} payers pay a clean claim?`, body: <>
        <p>{n}’s prompt-pay rule sets the deadline for state-regulated plans: {pp.title}. {strip(pp.body)}</p>
        <p>Self-funded employer plans (ERISA) and Medicare follow federal timelines instead, so knowing which kind of plan a patient has is the first step in holding a payer to the clock.</p>
      </> } as Sec] : []),
      { id: 'who', title: `Which ${n} practices do we bill for?`, body: <>
        <p>We bill for practices across {n}, including {s.cities.slice(0, -1).join(', ')} and {s.cities[s.cities.length - 1]}. {strip(s.local)}</p>
        <p>The specialties we bill most often in {n}: {sp.map((x, i) => <span key={x!.slug}>{i > 0 && ', '}<Link to={`/specialties/${x!.slug}`}>{x!.name}</Link></span>)}.</p>
      </> },
      { id: 'choose', title: `How do you choose a billing company in ${n}?`, body: <>
        <ul className="sg__ask">{[
          `Do they work ${med ? med.title.split(',')[0] : 'your Medicare contractor'} and ${mcd ? mcd.title.split(' and ')[0] : `${n} Medicaid`} every day?`,
          `Do they track ${n} prompt-pay deadlines and request penalties when payers are late?`,
          `Do they work in your time zone (${s.tzName}), so questions get answered the same day?`,
          'Will they show denial rate and days in A/R by payer every month?',
        ].map((q) => <li key={q}><CheckCircle2 size={18} />{q}</li>)}</ul>
      </> },
    ],
    cta: [`Billing in ${n}?`, `Get a free ${n} revenue review`],
  };
}
