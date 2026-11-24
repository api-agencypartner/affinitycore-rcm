import type { Metadata } from 'next';
import { HOME_V2_META } from '../data/copy-v2/home';
import { HomeV2 } from '../views/CopyV2';
export const metadata: Metadata = { title: { absolute: HOME_V2_META.title }, description: HOME_V2_META.description };
export default function Page() { return <HomeV2 />; }
