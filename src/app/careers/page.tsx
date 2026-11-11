import type { Metadata } from 'next';
import { CareersPage } from '../../views/Careers';
export const metadata: Metadata = { title: 'Careers', description: 'Revenue cycle careers at Affinity Core: open roles, career ladders and how we hire.' };
export default function Page() { return <CareersPage />; }
