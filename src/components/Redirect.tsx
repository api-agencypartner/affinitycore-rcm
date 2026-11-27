'use client';
import { useEffect } from 'react';
import { u } from '../router';

/** Static-export redirect: meta refresh for crawlers and no-JS, location.replace for everyone else, plus a plain link. */
export function Redirect({ to }: { to: string }) {
  const href = u(to);
  useEffect(() => { window.location.replace(href); }, [href]);
  return (
    <main className="container [padding:20rem_2rem] [text-align:center]">
      <meta httpEquiv="refresh" content={`0; url=${href}`} />
      <p>This page has moved. <a href={href} className="[color:var(--purple)] [text-decoration:underline]">Go to cardiology billing services</a>.</p>
    </main>
  );
}
