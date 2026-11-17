import type { Metadata } from 'next';
import { LegalPage } from '../../views/Legal';
export const metadata: Metadata = { title: 'Privacy Policy', description: 'How Affinity Core collects, uses and protects information on this website, and how patient information is handled under HIPAA.' };
export default function Page() { return <LegalPage kind="privacy" />; }
