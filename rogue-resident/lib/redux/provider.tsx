// lib/redux/provider.tsx
'use client';

import { Provider } from 'react-redux';
import { store } from './store';

export function ReduxProviderWrapper({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}