import type { Metadata } from 'next';
import { ContactPage } from '../../views/Contact';
export const metadata: Metadata = { title: 'Contact', description: 'Talk to a billing specialist: call, email or request a call-back.' };
export default function Page() { return <ContactPage />; }
