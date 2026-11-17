import type { Metadata } from 'next';
import { LegalPage } from '../../views/Legal';
export const metadata: Metadata = { title: 'Terms and Conditions', description: 'The terms for using the Affinity Core website.' };
export default function Page() { return <LegalPage kind="terms" />; }
