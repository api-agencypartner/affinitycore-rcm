import type { Metadata } from 'next';
import { SpecialtiesHub } from '../../views/SpecialtiesHub';
import { AfterLoader } from '../../views/Home';
export const metadata: Metadata = { title: 'Medical Billing by Specialty', description: 'Billing and coding for 23 specialties, each with its own codes, modifiers and payer rules. Find yours and see how we bill it.' };
export default function Page() { return <AfterLoader><SpecialtiesHub /></AfterLoader>; }
