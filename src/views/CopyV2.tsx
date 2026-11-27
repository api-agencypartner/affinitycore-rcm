'use client';
import { serviceV2 } from '../data/copy-v2/services';
import { ServicePageView } from './ServicePage';
import { HomePage } from './Home';
import { HomeCopyCtx } from '../copyContext';
import { HOME_V2 } from '../data/copy-v2/home';
import { specialtyV2 } from '../data/copy-v2/specialties';
import { CARDIOLOGY_B_META } from '../data/copy-v2/cardiology-b';
import { CARDIOLOGY_V2_FAQS } from '../components/CardiologyV2';
import { SpecialtyPageView } from './SpecialtyPage';

/** Copy v2 preview pages. Client side, because the page data carries functions (the calculator). */
export function ServiceV2({ slug }: { slug: string }) {
  const { s, copy } = serviceV2(slug);
  return <ServicePageView s={s} copy={copy} />;
}

export function HomeV2() {
  return <HomeCopyCtx.Provider value={HOME_V2}><HomePage /></HomeCopyCtx.Provider>;
}

export function SpecialtyV2({ slug }: { slug: string }) {
  const { s, copy } = specialtyV2(slug);
  return <SpecialtyPageView s={s} copy={copy} />;
}

export function CardiologyB() {
  const base = specialtyV2('cardiology');
  const s = { ...base.s, seoDescription: CARDIOLOGY_B_META.description, heroTitle: ['Cardiology billing services,', 'coded beat by beat.'] as [string, string], heroAccent: 'beat.' };
  const copy = { ...base.copy, title: CARDIOLOGY_B_META.title, source: 'specialty:cardiology-b', jsonLd: undefined, variant: 'cardiology-b' as const, faqs: CARDIOLOGY_V2_FAQS, path: CARDIOLOGY_B_META.path };
  return <SpecialtyPageView s={s} copy={copy} />;
}
