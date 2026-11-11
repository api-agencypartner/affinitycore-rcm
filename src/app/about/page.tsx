import type { Metadata } from 'next';
import { AboutPage } from '../../views/About';
export const metadata: Metadata = { title: 'About', description: 'The people who make sure care gets paid: who we are, how we work and the team that runs your billing.' };
export default function Page() { return <AboutPage />; }
