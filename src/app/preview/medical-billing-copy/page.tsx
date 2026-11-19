import type { Metadata } from 'next';
import { MedicalBillingTest } from '../../../views/ContentTests';

/* Content test: the medical billing page with the rewritten copy. Unlisted (no links, not in search or any
   sitemap) and noindex, nofollow so search engines skip it. Delete this folder when the test is done. */
export const metadata: Metadata = {
  title: { absolute: 'Medical Billing Services for US Practices | Affinity Core' },
  description: 'Outsourced medical billing services for US practices: claims scrubbed against payer rules and filed same day. Get a free review of one month of claims.',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};
export default function Page() {
  return <MedicalBillingTest />;
}
