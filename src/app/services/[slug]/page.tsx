import type { Metadata } from 'next';
import { SERVICES, getService } from '../../../data/services';
import { COPY_V2_SERVICES, serviceV2 } from '../../../data/copy-v2/services';
import { ServicePage } from '../../../views/ServicePage';
type P = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return SERVICES.map((s) => ({ slug: s.slug })); }
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const slug = (await params).slug;
  if (COPY_V2_SERVICES.includes(slug)) {
    const { s, copy } = serviceV2(slug);
    return { title: copy.title ? { absolute: copy.title } : s.seoTitle, description: s.seoDescription, alternates: { canonical: `/services/${slug}/` } };
  }
  const s = getService(slug);
  return { title: s.seoTitle, description: s.seoDescription, alternates: { canonical: `/services/${s.slug}/` } };
}
export default async function Page({ params }: P) { return <ServicePage slug={(await params).slug} />; }
