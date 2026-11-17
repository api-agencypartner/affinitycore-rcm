import type { Metadata } from 'next';
import { ThankYouPage } from '../../views/ThankYou';
export const metadata: Metadata = { title: 'Thank you', description: 'Your free revenue assessment request has been received.', robots: { index: false, follow: true } };
export default function Page() { return <ThankYouPage />; }
