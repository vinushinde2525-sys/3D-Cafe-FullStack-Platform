import { describe, it, expect, vi, beforeEach } from 'vitest';
import authReducer, {
  clearError,
  updateUser,
  forceLogout,
  initAuth,
  loginUser,
  registerUser,
  logoutUser,
} from './authSlice';
import type { User } from '@/types';

// ── Mock external deps ────────────────────────────────────────────────────────
vi.mock('@/api/axios', () => ({ setAccessToken: vi.fn() }));
vi.mock('@/api/services', () => ({
  authAPI: {
    getMe: vi.fn(),
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  },
}));
vi.mock('@/services/demoAuth', () => ({
  default: {
    getSession: vi.fn(() => null),
    login: vi.fn(() => null),
    register: vi.fn(() => ({ accessToken: 'demo-token', user: makeDemoUser() })),
    logout: vi.fn(),
  },
}));
vi.mock('@/services/backendStatus', () => ({
  isBackendOnline: vi.fn(() => false),
  markBackendOffline: vi.fn(),
  isNetworkError: vi.fn(() => true),
}));

const makeUser = (overrides: Partial<User> = {}): User => ({
  _id: 'u1',
  name: 'Test User',
  email: 'test@cafe.com',
  role: 'customer',
  avatar: '',
  isVerified: true,
  addresses: [],
  loyaltyPoints: 0,
  totalOrders: 0,
  totalSpent: 0,
  ...overrides,
});

const makeDemoUser = () => makeUser({ _id: 'demo-1', name: 'Demo User', email: 'demo@cafe.com' });

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  isDemoMode: false,
  error: null,
};

// ── Reducer sync actions ───────────────────────────────────────────────────────
describe('authSlice — sync reducers', () => {
  it('returns initial state', () => {
    expect(authReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('clearError sets error to null', () => {
    const state = { ...initialState, error: 'Some error' };
    expect(authReducer(state, clearError()).error).toBeNull();
  });

  it('updateUser merges partial user fields', () => {
    const state = { ...initialState, user: makeUser(), isAuthenticated: true };
    const updated = authReducer(state, updateUser({ name: 'Updated Name' }));
    expect(updated.user?.name).toBe('Updated Name');
    expect(updated.user?.email).toBe('test@cafe.com');
  });

  it('updateUser is a no-op when user is null', () => {
    const updated = authReducer(initialState, updateUser({ name: 'X' }));
    expect(updated.user).toBeNull();
  });

  it('forceLogout clears user and auth state', () => {
    const state = { ...initialState, user: makeUser(), isAuthenticated: true, isDemoMode: true };
    const after = authReducer(state, forceLogout());
    expect(after.user).toBeNull();
    expect(after.isAuthenticated).toBe(false);
    expect(after.isDemoMode).toBe(false);
  });
});

// ── Async thunks ──────────────────────────────────────────────────────────────
describe('authSlice — async thunks (demo-mode, no network)', () => {
  beforeEach(() => vi.clearAllMocks());

  it('initAuth.rejected sets isInitialized=true when no session or backend', async () => {
    const dispatch = vi.fn();
    const getState = vi.fn();
    const thunk = initAuth();
    await thunk(dispatch, getState, undefined);
    const calls = dispatch.mock.calls.map((c) => c[0]);
    const rejected = calls.find((c) => c.type === 'auth/init/rejected');
    expect(rejected).toBeTruthy();
  });

  it('loginUser.fulfilled sets user + isAuthenticated via demo fallback', async () => {
    const { default: demoAuth } = await import('@/services/demoAuth');
    (demoAuth.login as ReturnType<typeof vi.fn>).mockReturnValueOnce({
      accessToken: 'demo-token',
      user: makeDemoUser(),
    });

    const dispatch = vi.fn();
    const thunk = loginUser({ email: 'demo@cafe.com', password: 'pass' });
    await thunk(dispatch, vi.fn(), undefined);
    const calls = dispatch.mock.calls.map((c) => c[0]);
    const fulfilled = calls.find((c) => c.type === 'auth/login/fulfilled');
    expect(fulfilled?.payload?.user.email).toBe('demo@cafe.com');
    expect(fulfilled?.payload?.demo).toBe(true);
  });

  it('loginUser.rejected stores error message on bad demo credentials', async () => {
    // demoAuth.login returns null → rejected
    const state = authReducer(
      initialState,
      { type: 'auth/login/rejected', payload: 'Invalid credentials. Try: customer@cafe3d.com / Customer@1234' }
    );
    expect(state.error).toContain('Invalid credentials');
    expect(state.isLoading).toBe(false);
  });

  it('loginUser.pending sets isLoading=true', () => {
    const state = authReducer(initialState, { type: 'auth/login/pending' });
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('registerUser.fulfilled sets user + isDemoMode', async () => {
    const state = authReducer(
      initialState,
      { type: 'auth/register/fulfilled', payload: { user: makeDemoUser(), demo: true } }
    );
    expect(state.isAuthenticated).toBe(true);
    expect(state.isDemoMode).toBe(true);
    expect(state.user?.name).toBe('Demo User');
  });

  it('logoutUser.fulfilled clears user', () => {
    const state = authReducer(
      { ...initialState, user: makeUser(), isAuthenticated: true },
      { type: 'auth/logout/fulfilled' }
    );
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});
