import type { Metadata } from 'next';
import { CARDIOLOGY_B_META } from '../../../data/copy-v2/cardiology-b';
import { CardiologyB } from '../../../views/CopyV2';

/* Cardiology page, variation B. Not linked from the navigation or the sitemap, and noindex while it is
   being reviewed, so it doesn't compete with /specialties/cardiology/ in search. */
export const metadata: Metadata = {
  title: { absolute: CARDIOLOGY_B_META.title }, description: CARDIOLOGY_B_META.description,
  alternates: { canonical: `${CARDIOLOGY_B_META.path}/` },
  robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
};
export default function Page() { return <CardiologyB />; }
