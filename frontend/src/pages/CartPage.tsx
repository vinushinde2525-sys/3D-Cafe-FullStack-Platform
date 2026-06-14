import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, ArrowRight, Trash2 } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { CartItemRow } from '@/components/cart/CartItem'
import { OrderSummary } from '@/components/cart/OrderSummary'
import { MotionButton, LinkButton} from '@/components/ui/Button'
import { formatPrice } from '@/utils/format'

export default function CartPage() {
  const { items, totals, clearCart, count } = useCart()
  const { isAuthenticated } = useAuth()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-canvas pt-28 pb-16 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm"
        >
          <ShoppingBag size={56} className="text-beige mx-auto mb-5" />
          <h1 className="font-serif text-3xl text-espresso mb-2">Your cart is empty</h1>
          <p className="font-sans text-sm text-ink-3 mb-8">
            Add some artisan coffee and food to get started.
          </p>
          <LinkButton to="/menu" variant="espresso" pill size="lg" rightIcon={<ArrowRight size={16} />}>
            Browse Menu
          </LinkButton>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-5 md:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="eyebrow">Your Order</span>
            <h1 className="font-serif text-display text-espresso mt-1">
              Cart{' '}
              <span className="text-ink-3 font-sans text-2xl font-normal">({count})</span>
            </h1>
          </div>
          <button
            onClick={() => { if (confirm('Clear entire cart?')) clearCart() }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-ink-3 hover:text-red-500 hover:bg-red-50 font-display text-sm transition-colors"
          >
            <Trash2 size={15} /> Clear all
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items list */}
          <div className="lg:col-span-2 card-premium p-6">
            <AnimatePresence>
              {items.map(item => (
                <CartItemRow
                  key={`${item.foodItem}-${JSON.stringify(item.customizations)}`}
                  item={item}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1 space-y-4">
            <div className="card-premium p-6">
              <h3 className="font-serif text-lg text-espresso mb-5">Order Summary</h3>
              <OrderSummary showCoupon />
            </div>
            <LinkButton
              to={isAuthenticated ? '/checkout' : '/login?redirect=/checkout'}
              variant="espresso"
              fullWidth
              size="lg"
              pill
              rightIcon={<ArrowRight size={16} />}
            >
              {isAuthenticated ? `Checkout · ${formatPrice(totals.total)}` : 'Sign in to Checkout'}
            </LinkButton>
            <Link
              to="/menu"
              className="block text-center font-display text-sm text-ink-3 hover:text-espresso transition-colors"
            >
              ← Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
