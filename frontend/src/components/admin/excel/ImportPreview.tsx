import { CheckCircle, AlertTriangle } from 'lucide-react';
import type { ImportRow } from '@/services/excel/excelImport';

interface Props {
  headers: string[];
  rows:    ImportRow[];
  dupes?:  string[];
}

export const ImportPreview = ({ headers, rows, dupes = []}: Props) => {
  const preview = rows.slice(0, 10);
  const dupeSet = new Set(dupes.map(d => d.toLowerCase()));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="font-display text-xs text-ink-3 uppercase tracking-widest">
          Preview ({preview.length} of {rows.length} rows)
        </p>
        {dupes.length > 0 && (
          <div className="flex items-center gap-1.5 text-amber-600 text-xs">
            <AlertTriangle size={12} />
            <span className="font-display font-medium">{dupes.length} duplicate{dupes.length !== 1 ? 's' : ''} found</span>
          </div>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border border-beige/40">
        <table className="w-full text-xs">
          <thead className="bg-canvas-2 border-b border-beige/40">
            <tr>
              <th className="px-3 py-2 text-left font-display text-[10px] text-ink-3 uppercase tracking-wide w-8">#</th>
              {headers.slice(0, 7).map(h => (
                <th key={h} className="px-3 py-2 text-left font-display text-[10px] text-ink-3 uppercase tracking-wide">
                  {h}
                </th>
              ))}
              <th className="px-3 py-2 w-8" />
            </tr>
          </thead>
          <tbody className="divide-y divide-beige/20">
            {preview.map((row, i) => {
              const isDupe = dupeSet.has(String(row['name'] ?? '').toLowerCase());
              return (
                <tr key={i} className={isDupe ? 'bg-amber-50' : i % 2 === 0 ? 'bg-white' : 'bg-canvas/40'}>
                  <td className="px-3 py-2 font-display text-[10px] text-ink-3">{i + 1}</td>
                  {headers.slice(0, 7).map(h => (
                    <td key={h} className="px-3 py-2 font-sans text-ink-2 max-w-[120px] truncate">
                      {row[h] === null || row[h] === undefined ? (
                        <span className="text-ink-3">—</span>
                      ) : String(row[h])}
                    </td>
                  ))}
                  <td className="px-3 py-2">
                    {isDupe
                      ? <AlertTriangle size={12} className="text-amber-500" />
                      : <CheckCircle size={12} className="text-emerald-500" />
                    }
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {rows.length > 10 && (
        <p className="font-sans text-[11px] text-ink-3 text-center">
          +{rows.length - 10} more rows not shown
        </p>
      )}
    </div>
  );
};
