import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

// Geist (headings/display) — shipped locally with the project.
const geist = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist',
  weight: '100 900',
  display: 'swap',
});

// Inter (body / interface text).
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

// JetBrains Mono (metadata, labels, system status).
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['500'],
  variable: '--font-mono',
  display: 'swap',
});

// IMP-016: Prevent iOS Safari auto-zoom on input focus (font-size ≥ 16px also helps).
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

const DESC = 'Build form fields on the fly and watch your data render live. Unlock the Power of Pre-IPO.';

// IMP-018: Open Graph + Twitter card for rich link previews.
export const metadata: Metadata = {
  title: 'Supremus Angel — Dynamic Form Builder',
  description: DESC,
  openGraph: {
    title: 'Supremus Angel — Dynamic Form Builder',
    description: DESC,
    type: 'website',
    siteName: 'Supremus Angel',
  },
  twitter: {
    card: 'summary',
    title: 'Supremus Angel — Dynamic Form Builder',
    description: DESC,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
