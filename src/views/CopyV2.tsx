'use client';
import { serviceV2 } from '../data/copy-v2/services';
import { ServicePageView } from './ServicePage';
import { HomePage } from './Home';
import { HomeCopyCtx } from '../copyContext';
import { HOME_V2 } from '../data/copy-v2/home';
import { specialtyV2 } from '../data/copy-v2/specialties';
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
