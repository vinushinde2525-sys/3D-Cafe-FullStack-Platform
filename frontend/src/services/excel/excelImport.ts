/**
 * excelImport.ts — parse + validate uploaded Excel/CSV files
 */
import * as XLSX from 'xlsx';

export interface ImportRow { [key: string]: string | number | boolean | null; }
export interface ImportResult {
  rows:     ImportRow[];
  errors:   ImportError[];
  headers:  string[];
  preview:  ImportRow[];
  total:    number;
  valid:    number;
}
export interface ImportError {
  row:     number;
  column:  string;
  message: string;
  value:   unknown;
}

// ── Parsing ───────────────────────────────────────────────────────────────────
export function parseFile(file: File): Promise<ImportResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const workbook  = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const ws = workbook.Sheets[sheetName];
        const rows: ImportRow[] = XLSX.utils.sheet_to_json(ws, { defval: null });
        const headers = rows.length > 0 ? Object.keys(rows[0]) : [];

        const errors: ImportError[] = [];
        const preview = rows.slice(0, 5);

        resolve({ rows, errors, headers, preview, total: rows.length, valid: rows.length });
      } catch (err) {
        reject(new Error(`Failed to parse file: ${(err as Error).message}`));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

// ── Product Validation ────────────────────────────────────────────────────────
const VALID_CATEGORIES = ['Coffee','Tea','Burgers','Pizza','Sandwiches','Desserts','Beverages','Breakfast','Pasta','Salads'];

export function validateProductRows(rows: ImportRow[]): { valid: ImportRow[]; errors: ImportError[] } {
  const errors: ImportError[] = [];
  const valid: ImportRow[] = [];

  rows.forEach((row, i) => {
    const rowNum = i + 2; // +2 because row 1 is headers

    if (!row['name'] || String(row['name']).trim() === '') {
      errors.push({ row: rowNum, column: 'name', message: 'Name is required', value: row['name'] });
      return;
    }
    if (!row['category'] || !VALID_CATEGORIES.includes(String(row['category']))) {
      errors.push({ row: rowNum, column: 'category', message: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`, value: row['category'] });
      return;
    }
    const price = Number(row['price']);
    if (!row['price'] || isNaN(price) || price <= 0) {
      errors.push({ row: rowNum, column: 'price', message: 'Price must be a positive number', value: row['price'] });
      return;
    }

    valid.push({
      ...row,
      name:        String(row['name']).trim(),
      category:    String(row['category']),
      price,
      discountPrice: row['discountPrice'] ? Number(row['discountPrice']) : null,
      isVegetarian: ['true','yes','1'].includes(String(row['isVegetarian'] ?? '').toLowerCase()),
      isVegan:      ['true','yes','1'].includes(String(row['isVegan'] ?? '').toLowerCase()),
      isGlutenFree: ['true','yes','1'].includes(String(row['isGlutenFree'] ?? '').toLowerCase()),
      isSpicy:      ['true','yes','1'].includes(String(row['isSpicy'] ?? '').toLowerCase()),
      description: String(row['description'] ?? ''),
      tags: String(row['tags'] ?? '').split(',').map(t => t.trim()).filter(Boolean).join(','),
    });
  });

  return { valid, errors };
}

// ── Duplicate Detection ───────────────────────────────────────────────────────
export function detectDuplicates(rows: ImportRow[], existing: string[]): { dupes: string[]; unique: ImportRow[] } {
  const existingSet = new Set(existing.map(n => n.toLowerCase().trim()));
  const dupes: string[] = [];
  const unique: ImportRow[] = [];

  rows.forEach(row => {
    const name = String(row['name'] ?? '').toLowerCase().trim();
    if (existingSet.has(name)) {
      dupes.push(String(row['name']));
    } else {
      unique.push(row);
      existingSet.add(name); // prevent intra-file dupes too
    }
  });

  return { dupes, unique };
}
