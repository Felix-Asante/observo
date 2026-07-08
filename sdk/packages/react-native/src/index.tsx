'use client';

import {
  ObservoProvider as ReactObservoProvider,
  useObservoClient,
  type ObservoProviderProps,
} from '@observo/react';
import { useObservoNativeLifecycle } from './lifecycle.js';

function NativeLifecycleBridge() {
  const client = useObservoClient();
  useObservoNativeLifecycle(client);
  return null;
}

/**
 * Observo provider for React Native / Expo.
 * Same keyless contract as web: point `endpoint` at your BFF.
 */
export function ObservoProvider(props: ObservoProviderProps) {
  return (
    <ReactObservoProvider {...props}>
      <NativeLifecycleBridge />
      {props.children}
    </ReactObservoProvider>
  );
}

export {
  useObservo,
  useObservoClient,
  ObservoErrorBoundary,
  createClient,
  ObservoClient,
} from '@observo/react';

export type {
  ObservoProviderProps,
  UseObservoResult,
  ObservoErrorBoundaryProps,
  LogInput,
  LogPayload,
  LogType,
  ObservoClientOptions,
} from '@observo/react';

export { useObservoNativeLifecycle } from './lifecycle.js';
