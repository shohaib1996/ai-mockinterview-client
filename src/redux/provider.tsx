"use client";

import { Provider } from "react-redux";
import { makeStore } from "./store/store";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  const { store } = makeStore();
  return <Provider store={store}>{children}</Provider>;
}
