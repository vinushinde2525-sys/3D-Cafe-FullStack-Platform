import { AnimatePresence, motion } from 'framer-motion'
import { ShoppingCart, ArrowRight, Trash2, Coffee } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { useAppSelector } from '@/store'
import { CartItemRow } from './CartItem'
import { OrderSummary } from './OrderSummary'
import { MotionButton, LinkButton} from '@/components/ui/Button'
import { formatPrice } from '@/utils/format'

// Flying bean animation
const FlyingBean = () => {
  const bean = useAppSelector(s => s.ui.activeFlyingBean)
  if (!bean) return null
  return (
    <motion.div
      className="fixed z-[9999] w-4 h-3 rounded-full bg-espresso pointer-events-none shadow-md"
      style={{ left: bean.x - 8, top: bean.y - 6, transformOrigin: 'center' }}
      initial={{ scale: 1, opacity: 1 }}
      animate={{ left: bean.targetX - 8, top: bean.targetY - 6, scale: 0.3, opacity: 0 }}
      transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
    />
  )
}

export const CartDrawer = () => {
  const { items, isOpen, closeCart, clearCart, count, totals } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleCheckout = () => {
    closeCart()
    if (!isAuthenticated) { navigate('/login?redirect=/checkout'); return }
    navigate('/checkout')
  }

  return (
    <>
      <FlyingBean />

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-40 bg-espresso/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeCart}
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-cream flex flex-col shadow-warm-xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 36 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-beige/40 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <ShoppingCart size={20} className="text-espresso" />
                  <h2 className="font-serif text-xl text-espresso">Your Cart</h2>
                  {count > 0 && (
                    <span className="w-6 h-6 rounded-full bg-gold text-espresso text-xs font-display font-bold flex items-center justify-center">{count}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {items.length > 0 && (
                    <button onClick={() => { if (confirm('Clear entire cart?')) clearCart() }}
                      className="p-2 rounded-xl text-ink-3 hover:text-red-500 hover:bg-red-50 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  )}
                  <button onClick={closeCart} className="p-2 rounded-xl text-ink-3 hover:text-espresso hover:bg-canvas-2 transition-colors font-display text-xl leading-none">&times;</button>
                </div>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto scrollbar-none px-6">
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center h-full py-16 text-center"
                  >
                    <Coffee size={52} className="text-beige mb-4" />
                    <h3 className="font-serif text-2xl text-espresso mb-2">Your cart is empty</h3>
                    <p className="font-sans text-sm text-ink-3 mb-8 max-w-xs">Time to explore the menu and add something delicious.</p>
                    <LinkButton to="/menu" onClick={closeCart} variant="espresso" pill size="md" rightIcon={<ArrowRight size={15} />}>
                      Browse Menu
                    </LinkButton>
                  </motion.div>
                ) : (
                  <AnimatePresence>
                    {items.map(item => <CartItemRow key={`${item.foodItem}-${JSON.stringify(item.customizations)}`} item={item} />)}
                  </AnimatePresence>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="flex-shrink-0 border-t border-beige/40 p-5 bg-mist space-y-4">
                  <OrderSummary showCoupon={false} />
                  <MotionButton onClick={handleCheckout} variant="espresso" fullWidth size="lg" pill rightIcon={<ArrowRight size={16} />}>
                    Checkout · {formatPrice(totals.total)}
                  </MotionButton>
                  <button onClick={closeCart} className="w-full text-center font-display text-sm text-ink-3 hover:text-espresso transition-colors">
                    Continue Shopping
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default CartDrawer
