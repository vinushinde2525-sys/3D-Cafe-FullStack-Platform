/**
 * auditLogService.ts — lightweight admin action audit trail.
 * Demo Mode: localStorage, matching the project's existing convention.
 * Production mode: backend /api/audit-logs endpoint (seam provided below).
 */
import { isBackendOnline } from '@/services/backendStatus';
import api from '@/api/axios';

export type AuditAction = 'create' | 'update' | 'delete' | 'block' | 'unblock' | 'export' | 'import' | 'login' | 'status_change';
export type AuditModule = 'menu' | 'orders' | 'customers' | 'inventory' | 'suppliers' | 'purchase_orders' | 'staff' | 'coupons' | 'excel' | 'auth';

export interface AuditLogEntry {
  _id:        string;
  action:     AuditAction;
  module:     AuditModule;
  target:     string;     // human-readable label of what was acted on
  performedBy: string;
  details?:   string;
  createdAt:  string;
}

const KEY = 'cafe_audit_log';
const MAX_ENTRIES = 200;

function readLocal(): AuditLogEntry[] {
  try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : []; }
  catch { return []; }
}

function writeLocal(entries: AuditLogEntry[]) {
  try { localStorage.setItem(KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES))); } catch { /* ignore */ }
}

export const auditLogService = {
  async getAll(): Promise<AuditLogEntry[]> {
    if (!isBackendOnline()) return readLocal();
    try { const { data } = await api.get('/audit-logs'); return data.data; }
    catch { return readLocal(); }
  },

  async record(entry: Omit<AuditLogEntry, '_id' | 'createdAt'>): Promise<void> {
    const full: AuditLogEntry = { ...entry, _id: `al-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, createdAt: new Date().toISOString() };
    if (!isBackendOnline()) { writeLocal([full, ...readLocal()]); return; }
    try { await api.post('/audit-logs', entry); }
    catch { writeLocal([full, ...readLocal()]); }
  },

  async clear(): Promise<void> { writeLocal([]); },
};
