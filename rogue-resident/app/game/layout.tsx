// app/game/layout.tsx
'use client';

import { ReduxProvider } from '@/lib/redux/provider';

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ReduxProvider>{children}</ReduxProvider>;
}