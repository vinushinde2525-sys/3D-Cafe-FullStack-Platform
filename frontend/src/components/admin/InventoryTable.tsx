import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { inventoryService } from '@/services/analytics'
import { Badge } from '@/components/ui/Badge'
import toast from 'react-hot-toast'

interface Props { items: any[]; onUpdate: () => void }

export const InventoryTable = ({ items, onUpdate }: Props) => {
  const [loading, setLoading] = useState<string | null>(null)

  const adjust = async (id: string, qty: number, type: 'restock' | 'usage') => {
    const q = Number(prompt(`Enter quantity to ${type}:`))
    if (!q || q <= 0) return
    setLoading(id)
    try {
      await inventoryService.updateStock(id, q, type, `Manual ${type}`)
      onUpdate(); toast.success('Stock updated')
    } catch { toast.error('Update failed') }
    finally { setLoading(null) }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-beige/40">
          <tr>{['Ingredient','Category','Stock','Min','Cost/Unit','Status','Actions'].map(h => (
            <th key={h} className="text-left px-4 py-3 font-display text-xs text-ink-3 uppercase tracking-wide">{h}</th>
          ))}</tr>
        </thead>
        <tbody className="divide-y divide-beige/20">
          {items.map((item: any) => (
            <tr key={item._id} className="hover:bg-canvas-2/50 transition-colors">
              <td className="px-4 py-3 font-display text-sm font-medium text-espresso">{item.ingredient}</td>
              <td className="px-4 py-3"><Badge variant="default" size="sm">{item.category}</Badge></td>
              <td className="px-4 py-3 font-serif text-lg text-espresso">{item.currentStock} <span className="font-sans text-xs text-ink-3">{item.unit}</span></td>
              <td className="px-4 py-3 font-sans text-xs text-ink-3">{item.minimumStock} {item.unit}</td>
              <td className="px-4 py-3 font-sans text-sm text-ink-2">₹{item.costPerUnit ?? '—'}</td>
              <td className="px-4 py-3"><Badge variant={item.isLowStock ? 'error' : 'success'} size="sm">{item.isLowStock ? 'Low' : 'OK'}</Badge></td>
              <td className="px-4 py-3">
                <div className="flex gap-1">
                  <button onClick={() => adjust(item._id, 0, 'restock')} disabled={loading === item._id}
                    className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 flex items-center justify-center transition-colors">
                    <Plus size={12} />
                  </button>
                  <button onClick={() => adjust(item._id, 0, 'usage')} disabled={loading === item._id}
                    className="w-7 h-7 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors">
                    <Minus size={12} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default InventoryTable
