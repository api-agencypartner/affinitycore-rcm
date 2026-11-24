import type { Metadata } from 'next';
import { COPY_V2_SPECIALTIES, specialtyV2 } from '../../../../../data/copy-v2/specialties';
import { SpecialtyV2 } from '../../../../../views/CopyV2';

/* Copy v2 preview of a specialty page. Unlisted (no links, not in search or the sitemap) and noindex. */
type P = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return COPY_V2_SPECIALTIES.map((slug) => ({ slug })); }
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { s, copy } = specialtyV2((await params).slug);
  return {
    title: { absolute: copy.title ?? `${s.seoTitle} · Affinity Core` }, description: s.seoDescription,
    robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  };
}
export default async function Page({ params }: P) { return <SpecialtyV2 slug={(await params).slug} />; }
