import { useState, useEffect, useCallback } from 'react'
import { RefreshCw, Wifi, WifiOff } from 'lucide-react'
import { orderAPI } from '@/api/services'
import { inventoryService } from '@/services/analytics'
import { KitchenQueue } from '@/components/staff/KitchenQueue'
import { StaffStats } from '@/components/staff/StaffStats'
import { LiveOrderFeed } from '@/components/staff/LiveOrderFeed'
import { InventoryAlertCard } from '@/components/staff/InventoryAlertCard'
import { useSocket } from '@/hooks/useSocket'
import { PageLoader } from '@/components/common/LoadingScreen'
import toast from 'react-hot-toast'
import type { Order } from '@/types'

export default function KitchenPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { isConnected, joinKitchen, onNewOrder, onOrderUpdated } = useSocket()

  const fetchOrders = useCallback(async () => {
    try {
      const { data } = await orderAPI.getAll({ status: 'pending,accepted,preparing,ready', limit: '50' })
      setOrders(data.data.orders ?? [])
    } catch { toast.error('Failed to load orders') }
    finally { setLoading(false) }
  }, [])

  const fetchAlerts = useCallback(async () => {
    try {
      const list = await inventoryService.getLowStock()
      setAlerts(list)
    } catch (err) {
      console.warn('Failed to load inventory alerts:', err)
    }
  }, [])

  useEffect(() => {
    fetchOrders(); fetchAlerts()
    joinKitchen()
    const unNew = onNewOrder(() => fetchOrders())
    const unUpd = onOrderUpdated(() => fetchOrders())
    const timer = setInterval(fetchOrders, 30000)
    return () => { unNew(); unUpd(); clearInterval(timer) }
  }, [fetchOrders, fetchAlerts, joinKitchen, onNewOrder, onOrderUpdated])

  if (loading) return <PageLoader />

  const pending   = orders.filter(o => o.status === 'pending').length
  const preparing = orders.filter(o => ['accepted','preparing'].includes(o.status)).length
  const ready     = orders.filter(o => o.status === 'ready').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-espresso">Kitchen Display</h1>
          <div className="flex items-center gap-2 mt-1">
            {isConnected
              ? <><Wifi size={12} className="text-emerald-500" /><span className="font-sans text-xs text-emerald-600">Live</span></>
              : <><WifiOff size={12} className="text-red-400" /><span className="font-sans text-xs text-red-500">Offline</span></>}
          </div>
        </div>
        <button onClick={fetchOrders} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-canvas-2 font-display text-sm text-ink-2 hover:bg-beige/30 transition-colors">
          <RefreshCw size={14} />Refresh
        </button>
      </div>

      {/* Stats */}
      <StaffStats pending={pending} preparing={preparing} completed={ready} alerts={alerts.length} />

      {/* Main: queue + sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3">
          <KitchenQueue orders={orders} onUpdate={fetchOrders} />
        </div>
        <div className="xl:col-span-1 space-y-5">
          <div className="card-premium p-5">
            <h3 className="font-serif text-base text-espresso mb-4">Live Feed</h3>
            <LiveOrderFeed />
          </div>
          {alerts.length > 0 && (
            <div className="card-premium p-5">
              <h3 className="font-serif text-base text-espresso mb-4">Stock Alerts</h3>
              <InventoryAlertCard alerts={alerts} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
