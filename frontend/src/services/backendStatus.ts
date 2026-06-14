/**
 * backendStatus.ts
 *
 * Single module-level flag. Once the backend is confirmed offline (first
 * network error), ALL subsequent API calls and socket connections are
 * skipped immediately — no retries, no spam, no reconnect loops.
 *
 * Usage:
 *   import { isBackendOnline, markBackendOffline } from '@/services/backendStatus';
 *   if (!isBackendOnline()) return useMockData();
 */

let _online = true;        // Optimistic — assume backend exists until proven otherwise
let _checked = false;      // Has the first attempt completed?

/** Returns false once any network failure has been recorded. */
export function isBackendOnline(): boolean {
  return _online;
}

/** Call this from any catch block that receives an ERR_CONNECTION_RESET or ECONNREFUSED. */
export function markBackendOffline(): void {
  if (_online) {
    _online = false;
    _checked = true;
    // Suppress any further Axios noise by notifying listeners
    window.dispatchEvent(new CustomEvent('backend:offline'));
  }
}

/** True once at least one connectivity check has completed (success or fail). */
export function isChecked(): boolean {
  return _checked;
}

/** Mark as confirmed online (called on first successful response). */
export function markBackendOnline(): void {
  _online = true;
  _checked = true;
}

/**
 * Returns true if the error is a network connectivity failure
 * (not a 4xx/5xx — those mean backend IS reachable).
 */
export function isNetworkError(err: unknown): boolean {
  const e = err as any;
  // Axios network error has no response object
  if (e?.response) return false;
  // code is set by Axios for network failures
  const code: string = e?.code ?? '';
  return (
    code === 'ERR_NETWORK' ||
    code === 'ECONNABORTED' ||
    code === 'ERR_CONNECTION_RESET' ||
    code === 'ECONNREFUSED' ||
    e?.message === 'Network Error'
  );
}
