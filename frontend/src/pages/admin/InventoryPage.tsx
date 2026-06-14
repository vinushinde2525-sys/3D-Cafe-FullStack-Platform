import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { inventoryService } from '@/services/analytics'
import { InventoryTable } from '@/components/admin/InventoryTable'
import { InventoryAlertCard } from '@/components/staff/InventoryAlertCard'
import { MotionButton } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { useForm } from 'react-hook-form'
import { DashboardSkeleton } from '@/components/common/Skeletons'
import toast from 'react-hot-toast'

export default function InventoryManagementPage() {
  const [items, setItems]     = useState<any[]>([])
  const [alerts, setAlerts]   = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding]   = useState(false)
  const [saving, setSaving]   = useState(false)
  const { register, handleSubmit, reset } = useForm()

  const fetch = async () => {
    setLoading(true)
    try {
      const [all, low] = await Promise.all([inventoryService.getAll(), inventoryService.getLowStock()])
      setItems(all); setAlerts(low)
    } finally { setLoading(false) }
  }

  useEffect(() => { fetch() }, [])

  const onCreate = async (data: any) => {
    setSaving(true)
    try {
      await inventoryService.create({ ...data, currentStock: Number(data.currentStock), minimumStock: Number(data.minimumStock), costPerUnit: Number(data.costPerUnit || 0) })
      toast.success('Item added!'); setAdding(false); reset(); fetch()
    } catch { toast.error('Create failed') }
    finally { setSaving(false) }
  }

  const UNITS = ['kg','g','liter','ml','pieces','dozen']
  const CATS  = ['produce','dairy','meat','beverages','dry_goods','spices','other']

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-espresso">Inventory</h1>
        <MotionButton onClick={() => setAdding(true)} variant="espresso" size="sm" pill leftIcon={<Plus size={14} />}>Add Item</MotionButton>
      </div>
      {alerts.length > 0 && (
        <div className="card-premium p-5">
          <h3 className="font-serif text-base text-espresso mb-3">⚠ Low Stock ({alerts.length})</h3>
          <InventoryAlertCard alerts={alerts} />
        </div>
      )}
      <div className="card-premium overflow-hidden">
        {loading ? <DashboardSkeleton /> : <InventoryTable items={items} onUpdate={fetch} />}
      </div>
      <Modal isOpen={adding} onClose={() => setAdding(false)} title="Add Inventory Item" size="md">
        <form onSubmit={handleSubmit(onCreate)} className="space-y-4">
          <Input label="Ingredient" placeholder="Arabica Coffee Beans" {...register('ingredient', { required: true })} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-display text-sm font-medium text-ink-2 mb-1.5">Unit</label>
              <select {...register('unit', { required: true })} className="w-full h-11 bg-cream border border-beige/60 rounded-xl px-4 text-sm font-sans text-ink outline-none focus:border-gold/50">
                {UNITS.map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-display text-sm font-medium text-ink-2 mb-1.5">Category</label>
              <select {...register('category')} className="w-full h-11 bg-cream border border-beige/60 rounded-xl px-4 text-sm font-sans text-ink outline-none focus:border-gold/50">
                {CATS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Current Stock" type="number" {...register('currentStock', { required: true })} />
            <Input label="Minimum Stock" type="number" {...register('minimumStock', { required: true })} />
          </div>
          <Input label="Cost per Unit (₹)" type="number" step="0.01" {...register('costPerUnit')} />
          <MotionButton type="submit" variant="espresso" pill isLoading={saving} fullWidth>Add Item</MotionButton>
        </form>
      </Modal>
    </div>
  )
}
