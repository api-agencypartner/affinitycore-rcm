import type { Metadata, Viewport } from 'next';
import Shell from '../Shell';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://rcm.affinitycore.co'),
  title: { default: 'Medical Billing & Revenue Cycle Management · Affinity Core', template: '%s · Affinity Core' },
  description: 'US-based certified coders, billers and A/R specialists who work inside your EHR to cut denials, speed up payments and give your staff their time back.',
  openGraph: { siteName: 'Affinity Core RCM', type: 'website' },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Rethink+Sans:wght@400;500;600&family=Roboto+Mono&family=Instrument+Sans:wght@600&family=Plus+Jakarta+Sans:wght@500;600&family=Manrope:wght@400;500;600;700&family=Inter:wght@500&family=Caveat:wght@500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
