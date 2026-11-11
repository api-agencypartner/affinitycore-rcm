import type { Metadata } from 'next';
import { ARTICLES, getArticle } from '../../../data/insights';
import { ArticlePage } from '../../../views/Blog';
type P = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return ARTICLES.filter((a) => a.body).map((a) => ({ slug: a.slug })); }
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const a = getArticle((await params).slug)!;
  return { title: a.title, description: a.dek };
}
export default async function Page({ params }: P) { const slug = (await params).slug; return <ArticlePage key={slug} slug={slug} />; }
