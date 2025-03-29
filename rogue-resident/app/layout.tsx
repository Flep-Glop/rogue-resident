// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Providers } from '@/lib/providers';
import { Inter, VT323 } from 'next/font/google';

// Load fonts
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap'
});

const vt323 = VT323({
  weight: '400',
  variable: '--font-pixel',
  subsets: ['latin'],
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Rogue Resident: Medical Physics Residency',
  description: 'An educational roguelike game teaching medical physics through engaging, scenario-based gameplay',
  keywords: ['medical physics', 'education', 'game', 'roguelike', 'radiation', 'physics'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${vt323.variable}`}>
      <body className="min-h-screen bg-gray-100 font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}