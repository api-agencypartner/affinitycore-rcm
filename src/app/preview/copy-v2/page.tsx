import type { Metadata } from 'next';
import { COPY_V2_SERVICES } from '../../../data/copy-v2/services';
import { COPY_V2_SPECIALTIES } from '../../../data/copy-v2/specialties';
import { getService } from '../../../data/services';
import { getSpecialtyLite } from '../../../data/specialties';
import { Link } from '../../../router';

/* Copy v2 review index: links to every preview page. Unlisted and noindex. */
export const metadata: Metadata = {
  title: { absolute: 'Copy v2 previews · Affinity Core' },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};
const box = 'container [padding-inline:var(--gutter)] [@media(max-width:_1099px)]:[padding-inline:2rem] [padding-top:16rem] [padding-bottom:12rem] [&_h1]:[font-size:4.8rem] [&_h1]:[font-weight:500] [&_h1]:[color:var(--ink-2)] [&_h2]:[margin-top:4.8rem] [&_h2]:[font-size:2.6rem] [&_h2]:[font-weight:500] [&_p]:[color:#4a4f63] [&_p]:[font-size:max(1.7rem,16px)] [&_ul]:[margin-top:1.6rem] [&_ul]:[display:grid] [&_ul]:[grid-template-columns:repeat(auto-fill,_minmax(26rem,_1fr))] [&_ul]:[gap:0.8rem_2.4rem] [&_a]:[color:var(--purple)] [&_a]:[text-decoration:underline] [&_a]:[font-size:max(1.7rem,16px)]';
export default function Page() {
  return (
    <main className={box}>
      <h1>Copy v2 previews</h1>
      <p>Pages with the marketing team’s rewritten copy (November 2026 document). The live pages are unchanged. These links are not listed anywhere and are hidden from search engines.</p>
      <h2>Home</h2>
      <ul><li><Link to="/preview/copy-v2/home">Home page</Link></li></ul>
      <h2>Services ({COPY_V2_SERVICES.length})</h2>
      <ul>{COPY_V2_SERVICES.map((s) => <li key={s}><Link to={`/preview/copy-v2/services/${s}`}>{getService(s).name}</Link></li>)}</ul>
      <h2>Specialties ({COPY_V2_SPECIALTIES.length})</h2>
      <ul>{COPY_V2_SPECIALTIES.map((s) => <li key={s}><Link to={`/preview/copy-v2/specialties/${s}`}>{getSpecialtyLite(s)?.name ?? s}</Link></li>)}</ul>
    </main>
  );
}
