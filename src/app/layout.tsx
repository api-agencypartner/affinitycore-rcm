import type { Metadata, Viewport } from 'next';
import Shell from '../Shell';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://rcm.affinitycore.co'),
  title: { default: 'Medical Billing & Revenue Cycle Management · Affinity Core', template: '%s · Affinity Core' },
  description: 'US-based certified coders, billers and A/R specialists who work inside your EHR to cut denials, speed up payments and give your staff their time back.',
  openGraph: { siteName: 'Affinity Core RCM', type: 'website' },
  icons: {
    icon: [{ url: `${process.env.NEXT_PUBLIC_BASE ?? ''}/icon.svg`, type: 'image/svg+xml' }, { url: `${process.env.NEXT_PUBLIC_BASE ?? ''}/favicon.ico`, sizes: '48x48' }],
    apple: `${process.env.NEXT_PUBLIC_BASE ?? ''}/apple-touch-icon.png`,
  },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Rethink+Sans:wght@400;500;600;700&family=Roboto+Mono&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
