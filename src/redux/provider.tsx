'use client';

import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { makeStore } from './store/store';
import { PersistGate } from 'redux-persist/integration/react';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  const { store, persistor } = makeStore();
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
          {children}
        </GoogleOAuthProvider>
      </PersistGate>
    </Provider>
  );
}