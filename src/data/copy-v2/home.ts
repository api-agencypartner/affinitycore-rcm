/** Copy v2: home page rewrites (doc items 1, 2, 4, 5, 25, 59, 98). Preview only. */
import type { HomeCopy } from '../../copyContext';

export const HOME_V2_META = {
  title: 'Medical Billing Company & RCM Services | Affinity Core', // 1
  description: 'A US medical billing company and RCM team: certified coders, billers and A/R specialists who work in your EHR to cut denials and get you paid faster.', // 2
};
export const HOME_V2: HomeCopy = {
  heroTitle: ['Medical billing services', 'that get practices paid.'], heroBold: ['paid.'], // 4
  heroSub: 'A US medical billing company with 30+ certified coders, billers and A/R specialists who work inside your EHR, in your own time zone, to cut denials and get you paid fast.', // 5 (confirm "30+ certified")
  specialtiesLines: ['Medical billing built', 'around your specialty.'], // 25
  servicesLines: ['Medical billing & RCM,', 'every step covered.'], // 59 (full stop added to match the site's headings)
  statesLines: ['Medical billing for all 50 states,', 'by experts in each.'], // 98
};
