// app/game/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Play Rogue Resident',
  description: 'Navigate the challenges of a medical physics residency in this educational roguelike',
};

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col">
      {children}
    </main>
  );
}