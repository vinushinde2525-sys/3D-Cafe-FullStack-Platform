import { motion } from 'framer-motion'
import { Truck, Tag, Info } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { formatPrice } from '@/utils/format'
import { CouponInput } from './CouponInput'
import { cn } from '@/utils/cn'

interface Props { showCoupon?: boolean; className?: string }

export const OrderSummary = ({ showCoupon = true, className }: Props) => {
  const { totals, couponCode } = useCart()
  const { subtotal, tax, deliveryFee, couponDiscount, total } = totals
  const freeDeliveryThreshold = 500
  const remaining = freeDeliveryThreshold - subtotal

  const rows = [
    { label: 'Subtotal', value: formatPrice(subtotal) },
    { label: 'GST (5%)', value: formatPrice(tax), sub: true },
    { label: deliveryFee === 0 ? 'Delivery (Free!)' : 'Delivery', value: deliveryFee === 0 ? '₹0' : formatPrice(deliveryFee), green: deliveryFee === 0 },
    ...(couponDiscount > 0 ? [{ label: `Coupon (${couponCode})`, value: `–${formatPrice(couponDiscount)}`, green: true }] : []),
  ]

  return (
    <div className={cn('space-y-4', className)}>
      {/* Free delivery nudge */}
      {deliveryFee > 0 && remaining > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-xl"
        >
          <Truck size={15} className="text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="font-sans text-xs text-amber-700">
            Add <strong>{formatPrice(remaining)}</strong> more for free delivery!
          </p>
        </motion.div>
      )}

      {/* Line items */}
      <div className="space-y-2.5">
        {rows.map(({ label, value, sub, green }) => (
          <div key={label} className="flex items-center justify-between">
            <span className={cn('font-sans text-sm', sub ? 'text-ink-3' : 'text-ink-2')}>{label}</span>
            <span className={cn('font-display text-sm font-medium', green ? 'text-emerald-600' : 'text-ink')}>{value}</span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-beige/50" />

      {/* Total */}
      <div className="flex items-center justify-between">
        <span className="font-serif text-lg text-espresso">Total</span>
        <span className="font-serif text-2xl text-espresso">{formatPrice(total)}</span>
      </div>

      {/* Coupon input */}
      {showCoupon && <CouponInput />}

      {/* Trust signals */}
      <div className="flex items-start gap-2 p-3 bg-canvas-2 rounded-xl">
        <Info size={13} className="text-ink-3 mt-0.5 flex-shrink-0" />
        <p className="font-sans text-xs text-ink-3">Prices include all taxes. Secure checkout powered by Stripe.</p>
      </div>
    </div>
  )
}

export default OrderSummary
