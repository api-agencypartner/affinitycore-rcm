import type { Metadata } from 'next';
import { SPECIALTIES, getSpecialty } from '../../../data/specialties';
import { COPY_V2_SPECIALTIES, specialtyV2 } from '../../../data/copy-v2/specialties';
import { SpecialtyPage } from '../../../views/SpecialtyPage';
type P = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return SPECIALTIES.filter((s) => getSpecialty(s.slug)).map((s) => ({ slug: s.slug })); }
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const slug = (await params).slug;
  if (COPY_V2_SPECIALTIES.includes(slug)) {
    const { s, copy } = specialtyV2(slug);
    return { title: copy.title ? { absolute: copy.title } : s.seoTitle, description: s.seoDescription, alternates: { canonical: `/specialties/${slug}/` } };
  }
  const s = getSpecialty(slug)!;
  return { title: s.seoTitle, description: s.seoDescription, alternates: { canonical: `/specialties/${slug}/` } };
}
export default async function Page({ params }: P) { const slug = (await params).slug; return <SpecialtyPage key={slug} slug={slug} />; }
