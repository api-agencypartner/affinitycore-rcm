import type { Metadata } from 'next';
import { StatesHub } from '../../views/StatesHub';
export const metadata: Metadata = { title: { absolute: 'Medical Billing Services in All 50 States · Affinity Core' }, description: 'Medical billing and revenue cycle management in all 50 states. Find your state’s Medicare contractor, Medicaid program and prompt-pay rules.' };
export default function Page() { return <StatesHub />; }
