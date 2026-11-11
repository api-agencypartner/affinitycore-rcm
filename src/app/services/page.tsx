import type { Metadata } from 'next';
import { ServicesHub } from '../../views/ServicesHub';
import { AfterLoader } from '../../views/Home';
export const metadata: Metadata = { title: 'Medical Billing Services', description: 'Ten revenue cycle services from one accountable team: billing, coding, denial management, A/R recovery, credentialing, peer-to-peer review and more.' };
export default function Page() { return <AfterLoader><ServicesHub /></AfterLoader>; }
