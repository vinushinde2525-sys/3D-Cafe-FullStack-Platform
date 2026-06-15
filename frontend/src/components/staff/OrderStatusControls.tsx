import { useState } from 'react'
import { orderAPI } from '@/api/services'
import { MotionButton } from '@/components/ui/Button'
import { getOrderStatusLabel } from '@/utils/format'
import toast from 'react-hot-toast'
import type { OrderStatus } from '@/types'

interface Props { orderId: string; currentStatus: OrderStatus; onUpdate: () => void }

const FLOW: Partial<Record<OrderStatus, OrderStatus[]>> = {
  pending:   ['accepted', 'rejected'],
  accepted:  ['preparing'],
  preparing: ['ready'],
  ready:     ['out_for_delivery', 'delivered'],
  out_for_delivery: ['delivered'],
}

const VARIANT: Record<string, 'espresso' | 'gold' | 'destructive'> = {
  accepted: 'espresso', preparing: 'gold', ready: 'gold',
  out_for_delivery: 'espresso', delivered: 'espresso', rejected: 'destructive',
}

export const OrderStatusControls = ({ orderId, currentStatus, onUpdate }: Props) => {
  const [loading, setLoading] = useState<string | null>(null)
  const next = FLOW[currentStatus] || []

  const update = async (status: OrderStatus) => {
    setLoading(status)
    try {
      await orderAPI.updateStatus(orderId, status)
      toast.success(`Status → ${getOrderStatusLabel(status)}`)
      onUpdate()
    } catch { toast.error('Update failed') }
    finally { setLoading(null) }
  }

  if (!next.length) return null

  return (
    <div className="flex gap-2 flex-wrap">
      {next.map(status => (
        <MotionButton key={status} onClick={() => update(status)} isLoading={loading === status}
          variant={VARIANT[status] || 'espresso'} size="sm" pill>
          {getOrderStatusLabel(status)}
        </MotionButton>
      ))}
    </div>
  )
}

export default OrderStatusControls
