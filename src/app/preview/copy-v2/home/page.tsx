import type { Metadata } from 'next';
import { HOME_V2_META } from '../../../../data/copy-v2/home';
import { HomeV2 } from '../../../../views/CopyV2';

/* Copy v2 preview of the home page. Unlisted and noindex. */
export const metadata: Metadata = {
  title: { absolute: HOME_V2_META.title }, description: HOME_V2_META.description,
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};
export default function Page() { return <HomeV2 />; }
