import type { Metadata } from 'next';
import { CaseStudiesHub } from '../../views/CaseStudies';
export const metadata: Metadata = { title: 'Case Studies', description: 'Before-and-after results from practices that moved their revenue cycle to Affinity Core, measured in their own numbers.' };
export default function Page() { return <CaseStudiesHub />; }
