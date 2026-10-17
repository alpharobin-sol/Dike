import type { Metadata, Viewport } from 'next';
import { Archivo, Barlow_Condensed, IBM_Plex_Mono } from 'next/font/google';
import { site } from '@/content/site';
import './globals.css';

const display = Barlow_Condensed({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-display' });
const text = Archivo({ subsets: ['latin'], variable: '--font-text' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono' });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.name} · ${site.tagline}`,
  description: site.mission,
  openGraph: {
    type: 'website',
    url: '/',
    siteName: site.name,
    title: site.name,
    description: site.mission,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: site.manifesto }],
  },
  twitter: { card: 'summary_large_image', title: site.name, description: site.mission, images: ['/og.png'] },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = { themeColor: '#070809' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${text.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
