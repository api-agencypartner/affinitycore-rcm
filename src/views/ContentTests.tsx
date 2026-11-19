'use client';
import { MEDICAL_BILLING_TEST } from '../data/content-tests';
import { ServicePageView } from './ServicePage';

/** Content-test pages. Client side, because the page data carries functions (the calculator). */
export function MedicalBillingTest() {
  return <ServicePageView s={MEDICAL_BILLING_TEST.s} copy={MEDICAL_BILLING_TEST.copy} />;
}
