import type { Metadata } from 'next';
import { SERVICES, getService } from '../../../data/services';
import { ServicePage } from '../../../views/ServicePage';
type P = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return SERVICES.map((s) => ({ slug: s.slug })); }
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const s = getService((await params).slug);
  return { title: s.seoTitle, description: s.seoDescription, alternates: { canonical: `/services/${s.slug}/` } };
}
export default async function Page({ params }: P) { return <ServicePage slug={(await params).slug} />; }
