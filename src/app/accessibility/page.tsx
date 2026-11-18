import type { Metadata } from 'next';
import { LegalPage } from '../../views/Legal';
export const metadata: Metadata = { title: 'Accessibility Statement', description: 'How Affinity Core makes this website accessible, the standard we follow (WCAG 2.1 AA) and how to report a problem.' };
export default function Page() { return <LegalPage kind="accessibility" />; }
