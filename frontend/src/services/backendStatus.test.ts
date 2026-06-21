import { describe, it, expect, beforeEach, vi } from 'vitest';

const fresh = async () => {
  vi.resetModules();
  return import('./backendStatus');
};

describe('backendStatus', () => {
  beforeEach(() => {
    vi.spyOn(window, 'dispatchEvent').mockImplementation(() => true);
  });

  it('is online by default', async () => {
    const { isBackendOnline } = await fresh();
    expect(isBackendOnline()).toBe(true);
  });

  it('markBackendOffline sets online to false', async () => {
    const { isBackendOnline, markBackendOffline } = await fresh();
    markBackendOffline();
    expect(isBackendOnline()).toBe(false);
  });

  it('markBackendOnline restores online status', async () => {
    const { isBackendOnline, markBackendOffline, markBackendOnline } = await fresh();
    markBackendOffline();
    markBackendOnline();
    expect(isBackendOnline()).toBe(true);
  });

  it('isChecked is false before any connectivity check', async () => {
    const { isChecked } = await fresh();
    expect(isChecked()).toBe(false);
  });

  it('isChecked is true after markBackendOffline', async () => {
    const { isChecked, markBackendOffline } = await fresh();
    markBackendOffline();
    expect(isChecked()).toBe(true);
  });

  it('isChecked is true after markBackendOnline', async () => {
    const { isChecked, markBackendOnline } = await fresh();
    markBackendOnline();
    expect(isChecked()).toBe(true);
  });
});

describe('isNetworkError', () => {
  it('returns true for ERR_NETWORK code', async () => {
    const { isNetworkError } = await fresh();
    expect(isNetworkError({ code: 'ERR_NETWORK' })).toBe(true);
  });

  it('returns true for ECONNREFUSED code', async () => {
    const { isNetworkError } = await fresh();
    expect(isNetworkError({ code: 'ECONNREFUSED' })).toBe(true);
  });

  it('returns true for "Network Error" message without response', async () => {
    const { isNetworkError } = await fresh();
    expect(isNetworkError({ message: 'Network Error' })).toBe(true);
  });

  it('returns false when response exists (4xx/5xx from server)', async () => {
    const { isNetworkError } = await fresh();
    expect(isNetworkError({ response: { status: 401 }, code: 'ERR_NETWORK' })).toBe(false);
  });

  it('returns false for non-network errors', async () => {
    const { isNetworkError } = await fresh();
    expect(isNetworkError({ message: 'Something else' })).toBe(false);
    expect(isNetworkError(null)).toBe(false);
    expect(isNetworkError(undefined)).toBe(false);
  });
});