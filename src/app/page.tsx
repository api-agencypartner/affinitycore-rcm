import type { Metadata } from 'next';
import { HomePage } from '../views/Home';
export const metadata: Metadata = { title: { absolute: 'Affinity Core RCM · Medical Billing That Gets You Paid Faster' } };
export default function Page() { return <HomePage />; }
