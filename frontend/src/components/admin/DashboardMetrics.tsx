import { RevenueTrendChart } from './charts/RevenueTrendChart'
import { OrdersTrendChart } from './charts/OrdersTrendChart'
import { PopularItemsChart } from './charts/PopularItemsChart'

interface Props { salesData: any[]; topItems: any[]; ordersByStatus: any[] }

export const DashboardMetrics = ({ salesData, topItems, ordersByStatus }: Props) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2 card-premium p-6">
      <h3 className="font-serif text-lg text-espresso mb-1">Revenue (30 days)</h3>
      <p className="font-sans text-xs text-ink-3 mb-4">Daily revenue trend</p>
      <RevenueTrendChart data={salesData} />
    </div>
    <div className="card-premium p-6">
      <h3 className="font-serif text-lg text-espresso mb-1">Orders (30 days)</h3>
      <p className="font-sans text-xs text-ink-3 mb-4">Daily order volume</p>
      <OrdersTrendChart data={salesData} />
    </div>
    <div className="lg:col-span-2 card-premium p-6">
      <h3 className="font-serif text-lg text-espresso mb-1">Top Items</h3>
      <p className="font-sans text-xs text-ink-3 mb-4">By order count</p>
      <PopularItemsChart data={topItems} />
    </div>
    <div className="card-premium p-6">
      <h3 className="font-serif text-lg text-espresso mb-4">Orders by Status</h3>
      <div className="space-y-3">
        {ordersByStatus.map((s: any) => (
          <div key={s._id} className="flex items-center justify-between">
            <span className="font-sans text-sm text-ink-2 capitalize">{s._id?.replace(/_/g,' ')}</span>
            <span className="font-display text-sm font-semibold text-espresso">{s.count}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
)

export default DashboardMetrics
