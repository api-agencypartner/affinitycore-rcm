/**
 * Copy v2 (marketing doc, Nov 2026): specialty page rewrites, generated from the document into specialties.json.
 * FAQ rewrites are [current text, new text] pairs, matched against the page's built FAQ list.
 * Used by the unlisted /preview/ pages only.
 */
import data from './specialties.json';
import { getSpecialty, type SpecialtyFull } from '../specialties';
import type { SpecialtyPageCopy } from '../../views/SpecialtyPage';

type Entry = {
  title?: string; description?: string; intro: { lead?: string; body?: string; more?: string }; handleLines?: string[];
  platformsCopy?: string; midBody?: string; guide: { answer?: string; askQ3?: string; related?: string }; faqSwap: string[][];
};
const D = data as unknown as Record<string, Entry>;
export const COPY_V2_SPECIALTIES = Object.keys(D);

export function specialtyV2(slug: string): { s: SpecialtyFull; copy: SpecialtyPageCopy } {
  const live = getSpecialty(slug)!, e = D[slug];
  const s: SpecialtyFull = { ...live, seoDescription: e.description ?? live.seoDescription };
  return {
    s,
    copy: {
      title: e.title, intro: e.intro, handleLines: e.handleLines, platformsCopy: e.platformsCopy, midBody: e.midBody,
      guide: e.guide, faqSwap: e.faqSwap, source: `copy-v2:${slug}`, jsonLd: false,
    },
  };
}

