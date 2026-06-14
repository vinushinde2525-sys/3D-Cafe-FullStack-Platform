import { useState, useEffect } from 'react'
import { Plus, Search, Trash2, Edit2 } from 'lucide-react'
import { foodAPI } from '@/api/services'
import { FoodEditorModal } from '@/components/admin/FoodEditorModal'
import { MotionButton } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { FoodGridSkeleton } from '@/components/common/Skeletons'
import { formatPrice } from '@/utils/format'
import { resolveItemImage } from '@/utils/foodImage'
import { isBackendOnline } from '@/services/backendStatus'
import toast from 'react-hot-toast'
import type { FoodItem } from '@/types'

export default function MenuManagementPage() {
  const [items, setItems]       = useState<FoodItem[]>([])
  const [search, setSearch]     = useState('')
  const [category, setCategory] = useState('all')
  const [loading, setLoading]   = useState(true)
  const [editing, setEditing]   = useState<FoodItem | null | undefined>(undefined)

  const CATS = ['all','Coffee','Tea','Burgers','Pizza','Sandwiches','Desserts','Beverages','Breakfast','Pasta','Salads']

  const fetch = async () => {
    setLoading(true)
    try {
      if (isBackendOnline()) {
        const params: any = { limit: 100 }
        if (search) params.search = search
        if (category !== 'all') params.category = category
        const { data } = await foodAPI.getAll(params)
        setItems(data.data.items ?? [])
      } else {
        // Offline — show mock data
        const { MOCK_FOOD_ITEMS } = await import('@/services/mockData')
        let filtered = MOCK_FOOD_ITEMS
        if (search) filtered = filtered.filter(i => i.name.toLowerCase().includes(search.toLowerCase()))
        if (category !== 'all') filtered = filtered.filter(i => i.category === category)
        setItems(filtered)
      }
    } catch {
      const { MOCK_FOOD_ITEMS } = await import('@/services/mockData')
      setItems(MOCK_FOOD_ITEMS)
    } finally { setLoading(false) }
  }

  useEffect(() => { fetch() }, [search, category])

  const del = async (id: string) => {
    if (!confirm('Delete this item?')) return
    try { await foodAPI.delete(id); fetch(); toast.success('Item deleted') }
    catch { toast.error('Delete failed') }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-espresso">Menu Management</h1>
        <MotionButton onClick={() => setEditing(null)} variant="espresso" size="sm" pill leftIcon={<Plus size={14} />}>
          Add Item
        </MotionButton>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search items…"
            className="w-full h-10 bg-cream border border-beige/60 rounded-xl pl-9 text-sm font-sans text-ink outline-none focus:border-gold/50" />
        </div>
        <select value={category} onChange={e => setCategory(e.target.value)}
          className="h-10 bg-cream border border-beige/60 rounded-xl px-4 text-sm font-display text-ink-2 outline-none focus:border-gold/50">
          {CATS.map(c => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>)}
        </select>
      </div>

      {loading ? <FoodGridSkeleton /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {items.map(item => (
            <div key={item._id} className="card-premium overflow-hidden group">
              <div className="aspect-video overflow-hidden bg-canvas-2">
                <img src={resolveItemImage(item.images?.[0]?.url, item.name, item.category)} alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-serif text-base text-espresso leading-tight line-clamp-1">{item.name}</h4>
                  <Badge variant={item.isAvailable ? 'success' : 'error'} size="sm">{item.isAvailable ? 'Live' : 'Off'}</Badge>
                </div>
                <p className="font-sans text-xs text-ink-3 mb-3">{item.category} · {formatPrice(item.price)}</p>
                <div className="flex gap-2">
                  <button onClick={() => setEditing(item)} className="flex-1 py-2 rounded-xl bg-canvas-2 text-ink-2 hover:bg-beige/30 font-display text-xs flex items-center justify-center gap-1 transition-colors">
                    <Edit2 size={12} /> Edit
                  </button>
                  <button onClick={() => del(item._id)} className="flex-1 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 font-display text-xs flex items-center justify-center gap-1 transition-colors">
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <FoodEditorModal isOpen={editing !== undefined} item={editing} onClose={() => setEditing(undefined)} onSave={fetch} />
    </div>
  )
}
