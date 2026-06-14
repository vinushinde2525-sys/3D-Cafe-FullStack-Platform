import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { markBackendOffline, markBackendOnline, isBackendOnline, isNetworkError } from '@/services/backendStatus';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 3000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Token management ──────────────────────────────────────────────────────────
let accessToken: string | null = null;
export const setAccessToken = (token: string | null) => { accessToken = token; };
export const getAccessToken = () => accessToken;

// ── Request interceptor: block all calls when backend known offline ───────────
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (!isBackendOnline()) {
    // Cancel immediately — no network round-trip, no console error
    const controller = new AbortController();
    controller.abort();
    config.signal = controller.signal;
  }
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

// ── Response interceptor ──────────────────────────────────────────────────────
api.interceptors.response.use(
  (res) => {
    markBackendOnline();
    return res;
  },
  async (error: AxiosError) => {
    // Network failure → mark offline, suppress retry spam
    if (isNetworkError(error) || error.code === 'ERR_CANCELED') {
      if (isNetworkError(error)) markBackendOffline();
      return Promise.reject(error);
    }

    // 401 refresh logic — only run if backend is online
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== '/auth/refresh-token' &&
      isBackendOnline()
    ) {
      originalRequest._retry = true;
      try {
        const { data } = await api.post<{ data: { accessToken: string } }>('/auth/refresh-token');
        const newToken = data.data.accessToken;
        setAccessToken(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        setAccessToken(null);
        window.dispatchEvent(new CustomEvent('auth:logout'));
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
