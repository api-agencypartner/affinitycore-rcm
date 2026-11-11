import type { Metadata } from 'next';
import { BlogHub } from '../../views/Blog';
export const metadata: Metadata = { title: 'Blog', description: 'Plain-English guides on denials, coding updates, prior authorization and getting paid.' };
export default function Page() { return <BlogHub />; }
