import type { Metadata } from 'next';
import { CASES, getCase } from '../../../data/insights';
import { CaseStudyPage } from '../../../views/CaseStudies';
type P = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return CASES.map((c) => ({ slug: c.slug })); }
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const c = getCase((await params).slug)!;
  return { title: `${c.title} · ${c.specialty} case study`, description: c.challenge[0] };
}
export default async function Page({ params }: P) { const slug = (await params).slug; return <CaseStudyPage key={slug} slug={slug} />; }
