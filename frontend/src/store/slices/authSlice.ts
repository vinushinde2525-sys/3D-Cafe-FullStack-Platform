import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authAPI } from '@/api/services';
import { setAccessToken } from '@/api/axios';
import demoAuth from '@/services/demoAuth';
import { isBackendOnline, markBackendOffline, isNetworkError } from '@/services/backendStatus';
import type { User, LoginCredentials, RegisterData } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  isDemoMode: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null, isAuthenticated: false,
  isLoading: false, isInitialized: false,
  isDemoMode: false, error: null,
};

// ── Init ──────────────────────────────────────────────────────────────────────
// Priority: demo session (localStorage) → backend (only if online) → guest
export const initAuth = createAsyncThunk('auth/init', async (_, { rejectWithValue }) => {
  // 1. Restore demo session — fast, no network, always first
  const demoSession = demoAuth.getSession();
  if (demoSession) {
    setAccessToken(demoSession.accessToken);
    return { user: demoSession.user, demo: true };
  }
  // 2. Skip backend if known offline
  if (!isBackendOnline()) return rejectWithValue(null);
  // 3. Try backend
  try {
    const { data } = await authAPI.getMe();
    return { user: data.data, demo: false };
  } catch (err) {
    if (isNetworkError(err)) markBackendOffline();
    return rejectWithValue(null);
  }
});

// ── Login ─────────────────────────────────────────────────────────────────────
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    // Skip backend if offline — go straight to demo
    if (isBackendOnline()) {
      try {
        const { data } = await authAPI.login(credentials);
        setAccessToken(data.data.accessToken);
        return { user: data.data.user, demo: false };
      } catch (err: unknown) {
        const status = (err as any)?.response?.status;
        if (status === 401) return rejectWithValue('Invalid email or password');
        if (isNetworkError(err)) markBackendOffline();
        // Fall through to demo
      }
    }
    // Demo fallback
    const demoResult = demoAuth.login(credentials.email, credentials.password);
    if (demoResult) {
      setAccessToken(demoResult.accessToken);
      return { user: demoResult.user, demo: true };
    }
    return rejectWithValue('Invalid credentials. Try: customer@cafe3d.com / Customer@1234');
  }
);

// ── Register ──────────────────────────────────────────────────────────────────
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: RegisterData, { rejectWithValue }) => {
    if (isBackendOnline()) {
      try {
        const { data } = await authAPI.register(userData);
        setAccessToken(data.data.accessToken);
        return { user: data.data.user, demo: false };
      } catch (err: unknown) {
        const status = (err as any)?.response?.status;
        if (status === 409) return rejectWithValue('Email already registered');
        if (isNetworkError(err)) markBackendOffline();
        // Fall through to demo register
      }
    }
    const demoResult = demoAuth.register(userData.name, userData.email);
    setAccessToken(demoResult.accessToken);
    return { user: demoResult.user, demo: true };
  }
);

// ── Logout ────────────────────────────────────────────────────────────────────
export const logoutUser = createAsyncThunk('auth/logout', async () => {
  if (isBackendOnline()) {
    try { await authAPI.logout(); } catch { /* ignore */ }
  }
  demoAuth.logout();
  setAccessToken(null);
});

// ── Slice ─────────────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) state.user = { ...state.user, ...action.payload };
    },
    forceLogout: (state) => {
      state.user = null; state.isAuthenticated = false; state.isDemoMode = false;
      demoAuth.logout(); setAccessToken(null);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initAuth.pending,  (s) => { s.isLoading = true; })
      .addCase(initAuth.fulfilled,(s, a) => {
        s.user = a.payload.user; s.isAuthenticated = true;
        s.isLoading = false; s.isInitialized = true; s.isDemoMode = a.payload.demo;
      })
      .addCase(initAuth.rejected, (s) => { s.isLoading = false; s.isInitialized = true; })
      .addCase(loginUser.pending,  (s) => { s.isLoading = true; s.error = null; })
      .addCase(loginUser.fulfilled,(s, a) => {
        s.user = a.payload.user; s.isAuthenticated = true;
        s.isLoading = false; s.isDemoMode = a.payload.demo;
      })
      .addCase(loginUser.rejected, (s, a) => { s.isLoading = false; s.error = a.payload as string; })
      .addCase(registerUser.pending,  (s) => { s.isLoading = true; s.error = null; })
      .addCase(registerUser.fulfilled,(s, a) => {
        s.user = a.payload.user; s.isAuthenticated = true;
        s.isLoading = false; s.isDemoMode = a.payload.demo;
      })
      .addCase(registerUser.rejected, (s, a) => { s.isLoading = false; s.error = a.payload as string; })
      .addCase(logoutUser.fulfilled, (s) => {
        s.user = null; s.isAuthenticated = false; s.isDemoMode = false;
      });
  },
});

export const { clearError, updateUser, forceLogout } = authSlice.actions;
export default authSlice.reducer;
