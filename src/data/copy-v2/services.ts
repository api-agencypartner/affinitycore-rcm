/**
 * Copy v2 (marketing doc "Affinity-Core-Website-Copy", Nov 2026): service page rewrites.
 * Built from services.json, which is generated from the document; the doc's item numbers are kept under `n`.
 * Used by the unlisted /preview/ pages only. The live pages are untouched until the copy is approved.
 */
import data from './services.json';
import { getService, type ServiceFull } from '../services';
import { searchFaqs } from '../seo';
import type { ServicePageCopy } from '../../views/ServicePage';
import { MEDICAL_BILLING_TEST } from '../content-tests';

type Entry = {
  title?: string; description?: string; heroTitle?: string[]; heroAccent?: string;
  intro: { lead?: string; body?: string; more?: string }; workTitle?: string; turnaround?: string;
  platformsLines?: string[]; platformsCopy?: string; specEyebrow?: string; specHeading?: string; midBody?: string;
  guide: Record<string, string>; included: Record<string, string>; faqs: Record<string, (string | null)[]>;
};
const D = data as unknown as Record<string, Entry>;

export const COPY_V2_SERVICES = ['medical-billing', ...Object.keys(D)];

/** Live service entry with the v2 copy applied, plus the page-level overrides. */
export function serviceV2(slug: string): { s: ServiceFull; copy: ServicePageCopy } {
  if (slug === 'medical-billing') return MEDICAL_BILLING_TEST;
  const live = getService(slug), e = D[slug];
  const s: ServiceFull = {
    ...live,
    seoDescription: e.description ?? live.seoDescription,
    ...(e.heroTitle ? { heroTitle: [e.heroTitle[0], e.heroTitle[1]] as [string, string], heroAccent: e.heroAccent ?? live.heroAccent } : {}),
    ticket: { ...live.ticket, turnaround: e.turnaround ?? live.ticket.turnaround },
  };
  const base = searchFaqs({ name: live.name, kind: 'service', faqs: live.faqs });
  const faqs = base.map(([q, a], i) => [e.faqs[i]?.[0] ?? q, e.faqs[i]?.[1] ?? a]);
  const inc = Object.keys(e.included).length ? [0, 1, 2, 3].map((i) => e.included[i]).filter(Boolean) : undefined;
  const copy: ServicePageCopy = {
    title: e.title,
    intro: e.intro,
    workTitle: e.workTitle,
    platforms: { lines: e.platformsLines, copy: e.platformsCopy },
    specialties: { eyebrow: e.specEyebrow, heading: e.specHeading },
    midBody: e.midBody,
    guide: e.guide,
    included: inc,
    faqs,
    source: `copy-v2:${slug}`,
    jsonLd: false,
  };
  return { s, copy };
}
