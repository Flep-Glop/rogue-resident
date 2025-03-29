import './globals.css';
import type { Metadata } from 'next';
import { ReduxProvider } from '@/lib/redux/provider';

export const metadata: Metadata = {
  title: 'Rogue Resident: Medical Physics Residency',
  description: 'An educational roguelike game for medical physics',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100">
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}