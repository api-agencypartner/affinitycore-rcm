import type { Metadata } from 'next';
import { Redirect } from '../../../components/Redirect';

/* Old preview URL for the cardiology template. The template is now live at /specialties/cardiology/,
   so this page only forwards there (noindex, canonical to the live page). */
export const metadata: Metadata = {
  title: 'Cardiology Billing Services | Affinity Core',
  alternates: { canonical: '/specialties/cardiology/' },
  robots: { index: false, follow: true },
};
export default function Page() { return <Redirect to="/specialties/cardiology/" />; }
