/**
 * excelValidation.ts — generic, reusable row validation engine.
 * Entity-specific validators (e.g. validateProductRows in excelImport.ts)
 * can stay as-is; this module is for entities that don't have a bespoke
 * validator yet (employees, suppliers) and for shared primitive checks.
 */
import type { ExcelColumnDef, ExcelValidationRule } from '@/types/excel';
import type { ImportRow, ImportError } from './excelImport';

// ── Primitive checks ────────────────────────────────────────────────────────
export const isNonEmpty = (v: unknown) => v !== null && v !== undefined && String(v).trim() !== '';
export const isEmail = (v: unknown) => typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
export const isPhone = (v: unknown) => typeof v === 'string' && /^[+]?[\d\s-]{7,15}$/.test(v);
export const isPositiveNumber = (v: unknown) => !isNaN(Number(v)) && Number(v) > 0;
export const isNonNegativeNumber = (v: unknown) => !isNaN(Number(v)) && Number(v) >= 0;
export const isOneOf = (allowed: string[]) => (v: unknown) => allowed.includes(String(v));
export const isDate = (v: unknown) => !isNaN(new Date(String(v)).getTime());

// ── Column-driven validation ────────────────────────────────────────────────
export function validateColumns(columns: ExcelColumnDef[], rows: ImportRow[]): { valid: ImportRow[]; errors: ImportError[] } {
  const errors: ImportError[] = [];
  const valid: ImportRow[] = [];

  rows.forEach((row, i) => {
    const rowNum = i + 2;
    let rowOk = true;

    for (const col of columns) {
      const value = row[col.key];

      if (col.required && !isNonEmpty(value)) {
        errors.push({ row: rowNum, column: col.key, message: `${col.label} is required`, value });
        rowOk = false;
        continue;
      }
      if (!isNonEmpty(value)) continue; // optional + empty is fine

      if (col.type === 'number' && isNaN(Number(value))) {
        errors.push({ row: rowNum, column: col.key, message: `${col.label} must be a number`, value });
        rowOk = false;
      }
      if (col.type === 'enum' && col.enumValues && !col.enumValues.includes(String(value))) {
        errors.push({ row: rowNum, column: col.key, message: `${col.label} must be one of: ${col.enumValues.join(', ')}`, value });
        rowOk = false;
      }
      if (col.type === 'date' && !isDate(value)) {
        errors.push({ row: rowNum, column: col.key, message: `${col.label} must be a valid date`, value });
        rowOk = false;
      }
    }

    if (rowOk) valid.push(row);
  });

  return { valid, errors };
}

// ── Custom-rule validation (for cross-field or business rules) ─────────────
export function applyRules(rules: ExcelValidationRule[], rows: ImportRow[]): ImportError[] {
  const errors: ImportError[] = [];
  rows.forEach((row, i) => {
    const rowNum = i + 2;
    rules.forEach(rule => {
      const value = row[rule.column];
      if (!rule.validate(value, row)) {
        errors.push({ row: rowNum, column: rule.column, message: rule.message, value });
      }
    });
  });
  return errors;
}

// ── Ready-made column sets for entities without a bespoke validator ────────
export const EMPLOYEE_COLUMNS: ExcelColumnDef[] = [
  { key: 'name',     label: 'Name',     required: true, type: 'string' },
  { key: 'email',    label: 'Email',    required: true, type: 'string' },
  { key: 'phone',    label: 'Phone',    required: true, type: 'string' },
  { key: 'role',     label: 'Role',     required: true, type: 'string' },
  { key: 'salary',   label: 'Salary',   required: true, type: 'number' },
];

export const SUPPLIER_COLUMNS: ExcelColumnDef[] = [
  { key: 'name',         label: 'Company Name', required: true, type: 'string' },
  { key: 'contactName',  label: 'Contact Name', required: true, type: 'string' },
  { key: 'email',        label: 'Email',        required: true, type: 'string' },
  { key: 'phone',        label: 'Phone',         required: true, type: 'string' },
];
