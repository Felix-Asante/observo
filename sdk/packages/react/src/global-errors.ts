'use client';

import { useEffect } from 'react';
import { useObservoClient } from './provider.js';

export interface GlobalErrorCaptureOptions {
  /** Capture window.onerror. Default true. */
  errors?: boolean;
  /** Capture unhandledrejection. Default true. */
  rejections?: boolean;
}

/**
 * Installs browser-level error listeners that report into Observo.
 * Mount once near the app root (inside ObservoProvider).
 */
export function useGlobalErrorCapture(
  options: GlobalErrorCaptureOptions = {},
): void {
  const client = useObservoClient();
  const captureErrors = options.errors ?? true;
  const captureRejections = options.rejections ?? true;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onError = (event: ErrorEvent) => {
      if (!captureErrors) return;
      client.captureException(event.error ?? event.message, {
        operation: 'window.onerror',
      });
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      if (!captureRejections) return;
      client.captureException(event.reason, {
        operation: 'unhandledrejection',
      });
    };

    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
    };
  }, [client, captureErrors, captureRejections]);
}
