import { useState, useEffect } from 'react'
import { inventoryService } from '@/services/analytics'
import { InventoryAlertCard } from '@/components/staff/InventoryAlertCard'
import { DashboardSkeleton } from '@/components/common/Skeletons'

export default function StaffInventoryPage() {
  const [items, setItems]   = useState<any[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([inventoryService.getAll(), inventoryService.getLowStock()])
      .then(([all, low]) => { setItems(all); setAlerts(low) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <DashboardSkeleton />

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl text-espresso">Inventory Monitor</h1>
      {alerts.length > 0 && (
        <div className="card-premium p-6">
          <h2 className="font-serif text-lg text-espresso mb-4">⚠ Low Stock Alerts</h2>
          <InventoryAlertCard alerts={alerts} />
        </div>
      )}
      <div className="card-premium overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-canvas-2 border-b border-beige/40">
            <tr>{['Ingredient','Stock','Min','Unit','Status'].map(h => (
              <th key={h} className="text-left px-4 py-3 font-display text-xs text-ink-3 uppercase tracking-wide">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-beige/30">
            {items.map((item: any) => (
              <tr key={item._id} className="hover:bg-canvas-2/50 transition-colors">
                <td className="px-4 py-3 font-sans text-ink-2">{item.ingredient}</td>
                <td className="px-4 py-3 font-display font-semibold text-espresso">{item.currentStock}</td>
                <td className="px-4 py-3 font-sans text-ink-3">{item.minimumStock}</td>
                <td className="px-4 py-3 font-sans text-ink-3">{item.unit}</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-display font-semibold px-2 py-0.5 rounded-full border ${item.isLowStock ? 'text-red-600 bg-red-50 border-red-200' : 'text-emerald-600 bg-emerald-50 border-emerald-200'}`}>
                    {item.isLowStock ? 'Low' : 'OK'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
