import type { Metadata } from 'next';
import { Fredoka, Nunito, Space_Mono } from 'next/font/google';
import './globals.css';

const fredokaOne = Fredoka({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-fredoka',
  display: 'swap',
});

const nunito = Nunito({
  weight: ['400', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
});

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SmartMath: Space Voyage',
  description: 'Learn math on a cosmic adventure! Master addition, subtraction, multiplication, and division tables 1-20.',
  manifest: '/manifest.json',
  openGraph: {
    title: 'SmartMath: Space Voyage',
    description: 'Educational math game for kids ages 5-12. Space-themed, bilingual (English/Spanish), offline-capable.',
    type: 'website',
  },
  icons: {
    icon: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      suppressHydrationWarning
      className={`${fredokaOne.variable} ${nunito.variable} ${spaceMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
