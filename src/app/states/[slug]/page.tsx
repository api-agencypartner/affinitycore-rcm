import type { Metadata } from 'next';
import { STATES, getState } from '../../../data/states';
import { StatePage } from '../../../views/StatePage';
type P = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return STATES.map((s) => ({ slug: s.slug })); }
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const s = getState((await params).slug)!;
  return { title: { absolute: s.seoTitle }, description: s.seoDescription, alternates: { canonical: `/states/${s.slug}/` } };
}
export default async function Page({ params }: P) { const slug = (await params).slug; return <StatePage key={slug} slug={slug} />; }
