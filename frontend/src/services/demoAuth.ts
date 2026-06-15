/**
 * Demo Auth Service
 * Works fully offline — no backend required.
 * Stores session in localStorage under 'cafe_demo_session'.
 */
import type { User } from '@/types';
import { findDemoUser, makeMockToken } from './mockData';

const SESSION_KEY = 'cafe_demo_session';
const TOKEN_KEY   = 'cafe_demo_token';

export interface DemoSession {
  user: User;
  token: string;
}

export const demoAuth = {
  login(email: string, password: string): { user: User; accessToken: string } | null {
    const found = findDemoUser(email, password);
    if (!found) return null;
    const { password: _pw, ...user } = found;
    const token = makeMockToken(user._id);
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_KEY, token);
    return { user, accessToken: token };
  },

  register(name: string, email: string): { user: User; accessToken: string } {
    // Demo registration — creates a temporary customer session
    const user: User = {
      _id: `demo-new-${Date.now()}`,
      name,
      email,
      role: 'customer',
      isVerified: false,
      isBlocked: false,
      addresses: [],
      loyaltyPoints: 0,
      totalOrders: 0,
      totalSpent: 0,
      createdAt: new Date().toISOString(),
    };
    const token = makeMockToken(user._id);
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_KEY, token);
    return { user, accessToken: token };
  },

  logout() {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TOKEN_KEY);
  },

  getSession(): { user: User; accessToken: string } | null {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      const token = localStorage.getItem(TOKEN_KEY);
      if (!raw || !token) return null;
      const user = JSON.parse(raw) as User;
      return { user, accessToken: token };
    } catch {
      return null;
    }
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  isOnline: false, // set true if backend responds
};

export default demoAuth;
