'use client';

import { Provider } from 'react-redux';
import { makeStore } from './store/store';
import { PersistGate } from 'redux-persist/integration/react';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  const { store, persistor } = makeStore();
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}