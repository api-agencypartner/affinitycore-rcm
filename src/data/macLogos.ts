import { u } from '../router';
import { MACS, MAC_OF } from './states-all';

/** Medicare contractor (MAC) logos in public/mac. Logos identify the contractor only; no affiliation implied. */
export const MAC_LOGO: Record<string, string> = {
  'CGS Administrators': '/mac/cgs.webp',
  'Wisconsin Physicians Service (WPS)': '/mac/wps.webp',
  'Noridian Healthcare Solutions': '/mac/noridian.webp',
  'First Coast Service Options': '/mac/firstcoast.webp',
  'National Government Services (NGS)': '/mac/ngs.webp',
  'Novitas Solutions': '/mac/novitas.webp',
  'Palmetto GBA': '/mac/palmetto.webp',
};
/** Stacked logos need a taller box to stay legible. */
export const MAC_TALL = new Set(['Palmetto GBA']);

/** Logo URL and contractor name for a state slug. */
export function macLogoFor(slug: string): { src: string; name: string; tall: boolean } | null {
  const mac = MACS[MAC_OF[slug]];
  if (!mac) return null;
  const src = MAC_LOGO[mac.name];
  return src ? { src: u(src), name: mac.name, tall: MAC_TALL.has(mac.name) } : null;
}
