/**
 * excelHistoryService.ts — audit log for Excel Center import/export actions.
 * Demo Mode: persisted to localStorage, matching the project's existing
 * convention (see demoAuth.ts). Production mode would POST to a backend
 * audit-log endpoint instead — this module is the seam for that swap.
 */
import { isBackendOnline } from '@/services/backendStatus';
import api from '@/api/axios';
import type { ExcelHistoryEntry, ExcelHistoryAction, ExcelEntity, ExcelExportFormat } from '@/types/excel';

const KEY = 'cafe_excel_history';
const MAX_ENTRIES = 100;

function readLocal(): ExcelHistoryEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function writeLocal(entries: ExcelHistoryEntry[]) {
  try { localStorage.setItem(KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES))); } catch { /* storage full / disabled */ }
}

export const excelHistoryService = {
  async getAll(): Promise<ExcelHistoryEntry[]> {
    if (!isBackendOnline()) return readLocal();
    try { const { data } = await api.get('/excel/history'); return data.data; }
    catch { return readLocal(); }
  },

  async log(entry: Omit<ExcelHistoryEntry, '_id' | 'createdAt'>): Promise<void> {
    const full: ExcelHistoryEntry = { ...entry, _id: `xh-${Date.now()}`, createdAt: new Date().toISOString() };
    if (!isBackendOnline()) {
      writeLocal([full, ...readLocal()]);
      return;
    }
    try { await api.post('/excel/history', entry); }
    catch { writeLocal([full, ...readLocal()]); }
  },

  async clear(): Promise<void> {
    writeLocal([]);
  },

  helper: {
    logExport(entity: ExcelEntity, format: ExcelExportFormat, fileName: string, rowCount: number) {
      return excelHistoryService.log({ action: 'export', entity, format, fileName, rowCount, errorCount: 0, performedBy: 'admin' });
    },
    logImport(entity: ExcelEntity, fileName: string, rowCount: number, errorCount: number) {
      return excelHistoryService.log({ action: 'import' as ExcelHistoryAction, entity, format: 'xlsx', fileName, rowCount, errorCount, performedBy: 'admin' });
    },
  },
};
