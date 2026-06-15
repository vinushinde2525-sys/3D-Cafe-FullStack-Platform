/**
 * excelFormatting.ts — formatting helpers for generated workbooks.
 * SheetJS community edition has limited style support, so this focuses on
 * what's reliably supported across viewers: column widths and freeze panes.
 */
import * as XLSX from 'xlsx';
import type { ExcelFormattingOptions } from '@/types/excel';

/**
 * Auto-size columns based on the longest value (header or data) in each column.
 * Mutates the worksheet's `!cols` property, which SheetJS/Excel reads as widths.
 */
export function autoSizeColumns(ws: XLSX.WorkSheet, rows: (string | number | boolean)[][], minWidth = 8, maxWidth = 40): void {
  if (rows.length === 0) return;
  const colCount = rows[0].length;
  const widths: number[] = new Array(colCount).fill(minWidth);

  for (const row of rows) {
    row.forEach((cell, i) => {
      const len = String(cell ?? '').length;
      if (len + 2 > widths[i]) widths[i] = Math.min(len + 2, maxWidth);
    });
  }

  ws['!cols'] = widths.map(w => ({ wch: w }));
}

/**
 * Freeze the header row so it stays visible while scrolling.
 */
export function freezeHeaderRow(ws: XLSX.WorkSheet): void {
  ws['!freeze'] = { xSplit: 0, ySplit: 1 };
  // Also set the pane view that Excel/LibreOffice actually read:
  (ws as any)['!view'] = { ...(ws as any)['!view'], pane: { ySplit: 1, topLeftCell: 'A2', activePane: 'bottomLeft', state: 'frozen' } };
}

/**
 * Apply a full set of formatting options to a freshly-built worksheet.
 */
export function applyFormatting(
  ws: XLSX.WorkSheet,
  rows: (string | number | boolean)[][],
  options: ExcelFormattingOptions = {}
): void {
  autoSizeColumns(ws, rows);
  if (options.freezeHeader !== false) freezeHeaderRow(ws);
}

/**
 * Build a worksheet from array-of-arrays data with formatting applied —
 * a drop-in replacement for `XLSX.utils.aoa_to_sheet` used elsewhere
 * in the excel services when formatting is desired.
 */
export function buildFormattedSheet(
  rows: (string | number | boolean)[][],
  options?: ExcelFormattingOptions
): XLSX.WorkSheet {
  const ws = XLSX.utils.aoa_to_sheet(rows);
  applyFormatting(ws, rows, options);
  return ws;
}
