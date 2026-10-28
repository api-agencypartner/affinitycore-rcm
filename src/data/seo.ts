/**
 * Organic-search helpers for child pages: search-intent FAQs and JSON-LD.
 * In Next.js, render the JSON-LD server-side in <head> (see HANDOFF "SEO phase").
 */
import { CONFIRM } from './specialtyKit';

export const EHRS = ['Epic', 'athenahealth', 'eClinicalWorks', 'NextGen', 'ModMed', 'Greenway', 'Oracle Health', 'MEDITECH'];
const ehrList = `${EHRS.slice(0, -1).join(', ')} and ${EHRS[EHRS.length - 1]}`;

type QA = [string, string];
const has = (faqs: string[][], words: RegExp) => faqs.some(([q]) => words.test(q));

/**
 * Questions people actually search before outsourcing billing, written for this page.
 * Existing page FAQs keep their place; search FAQs fill in what they don't already cover.
 */
export function searchFaqs(o: { name: string; kind: 'specialty' | 'service'; faqs: string[][]; detail?: string }): string[][] {
  const n = o.name;
  const lower = o.kind === 'specialty' ? `${n.toLowerCase()} ` : '';
  const what = o.kind === 'specialty' ? `${n} billing` : n;
  const out: QA[] = [];
  if (!has(o.faqs, /cost|price|pricing|fee/i)) out.push([`How much does outsourced ${what.toLowerCase()} cost?`,
    `Most practices pay a percentage of monthly collections, so we’re paid when you are. The rate depends on your volume, payer mix and which services you hand over${o.detail ? `, and the free assessment shows where you stand today, including leaks like “${o.detail}”` : ''}. You get a written quote after it. ${CONFIRM}`]);
  if (!has(o.faqs, /switch|transition|onboard|how long/i)) out.push([`How long does it take to switch ${what.toLowerCase()} to Affinity Core?`,
    `Usually 30 to 45 days. We sign a BAA, get access to your systems, review your open A/R and ${lower}payer rules, then take over new claims while your team finishes what’s already in flight, so cash flow doesn’t pause. ${CONFIRM}`]);
  out.push([`Can we keep our in-house ${o.kind === 'specialty' ? 'billing staff' : 'team'}?`,
    `Yes. Many ${lower}practices keep their front desk or a biller and hand us the work that slips: coding review, denials and aged A/R. We work from the same queues and report to both every month.`]);
  if (!has(o.faqs, /EHR|system|software|access/i)) out.push(['Which EHR and practice management systems do you work in?',
    `We work inside the systems you already use, including ${ehrList}, plus your clearinghouse and payer portals. Nothing to migrate.`]);
  // search questions lead; then the page's own expertise questions
  return [...out.slice(0, 2), ...o.faqs, ...out.slice(2)].slice(0, 8);
}

/* ---------------- JSON-LD ---------------- */
const ORG = { '@type': 'Organization', name: 'Affinity Core', url: 'https://rcm.affinitycore.co', telephone: '+1-214-851-2698',
  address: { '@type': 'PostalAddress', streetAddress: '5830 Granite Pkwy, STE 100-219', addressLocality: 'Plano', addressRegion: 'TX', postalCode: '75024', addressCountry: 'US' } };

export function pageJsonLd(o: { name: string; description: string; path: string; crumb: [string, string]; faqs: string[][] }) {
  const base = 'https://rcm.affinitycore.co';
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Service', name: o.name, description: o.description, serviceType: 'Medical billing and revenue cycle management', provider: ORG, areaServed: { '@type': 'Country', name: 'United States' }, url: base + o.path },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: base + '/' },
        { '@type': 'ListItem', position: 2, name: o.crumb[0], item: base + o.crumb[1] },
        { '@type': 'ListItem', position: 3, name: o.name, item: base + o.path },
      ] },
      { '@type': 'FAQPage', mainEntity: o.faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a.replace(/\s*\[Confirm with Affinity Core\]/g, '') } })) },
    ],
  };
}

/** Prototype only: write JSON-LD into <head> on the client. Next.js renders it on the server. */
export function setJsonLd(data: object | null) {
  let el = document.getElementById('ld-page') as HTMLScriptElement | null;
  if (!data) { el?.remove(); return; }
  if (!el) { el = document.createElement('script'); el.type = 'application/ld+json'; el.id = 'ld-page'; document.head.appendChild(el); }
  el.textContent = JSON.stringify(data);
}
