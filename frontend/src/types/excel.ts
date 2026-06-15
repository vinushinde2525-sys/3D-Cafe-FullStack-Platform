/**
 * types/excel.ts — shared types for the Excel Center
 * (import/export, validation, formatting, progress, audit history)
 */

export type ExcelEntity = 'products' | 'inventory' | 'coupons' | 'customers' | 'employees' | 'suppliers' | 'orders' | 'revenue' | 'attendance' | 'payroll' | 'performance' | 'shifts' | 'leaves';
export type ExcelExportFormat = 'xlsx' | 'pdf';

export interface ExcelColumnDef {
  key:      string;
  label:    string;
  required?: boolean;
  type?:    'string' | 'number' | 'boolean' | 'date' | 'enum';
  enumValues?: string[];
}

export interface ExcelValidationRule {
  column:   string;
  message:  string;
  validate: (value: unknown, row: Record<string, unknown>) => boolean;
}

export interface ExcelFormattingOptions {
  headerBg?:     string;
  headerColor?:  string;
  zebraStripe?:  boolean;
  columnWidths?: Record<string, number>;
  freezeHeader?: boolean;
  numberFormat?: Record<string, string>;
}

export type ExcelJobStatus = 'idle' | 'reading' | 'validating' | 'processing' | 'done' | 'error';

export interface ExcelJobProgress {
  status:    ExcelJobStatus;
  percent:   number;        // 0-100
  message?:  string;
  processedRows?: number;
  totalRows?: number;
}

export type ExcelHistoryAction = 'import' | 'export';

export interface ExcelHistoryEntry {
  _id:        string;
  action:     ExcelHistoryAction;
  entity:     ExcelEntity;
  format:     ExcelExportFormat;
  fileName:   string;
  rowCount:   number;
  errorCount: number;
  performedBy: string;
  createdAt:  string;
}
