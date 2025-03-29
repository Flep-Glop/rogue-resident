'use client';

import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';

// Optional: Add more providers here as needed (theme, etc.)

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Client-side providers wrapper component
 * Includes all the client-side context providers like Redux
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}