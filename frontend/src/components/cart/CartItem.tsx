import { motion } from 'framer-motion'
import { Trash2 } from 'lucide-react'
import { QuantitySelector } from './QuantitySelector'
import { useCart } from '@/hooks/useCart'
import { formatPrice } from '@/utils/format'
import type { CartItem as CartItemType } from '@/types'

interface Props { item: CartItemType }

export const CartItemRow = ({ item }: Props) => {
  const { removeFromCart, changeQuantity } = useCart()

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20, height: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className="flex gap-4 py-4 border-b border-beige/30 last:border-0"
    >
      {/* Image */}
      <div className="w-16 h-16 rounded-xl overflow-hidden bg-canvas-2 flex-shrink-0">
        {item.image
          ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-2xl">☕</div>
        }
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h4 className="font-serif text-base text-espresso leading-tight truncate">{item.name}</h4>

        {item.customizations?.length > 0 && (
          <p className="font-sans text-xs text-ink-3 mt-0.5 truncate">
            {item.customizations.map(c => c.option).join(', ')}
          </p>
        )}

        <div className="flex items-center justify-between mt-2">
          <QuantitySelector
            value={item.quantity}
            onChange={(q) => changeQuantity(item.foodItem, item.customizations, q)}
            min={0}
            size="sm"
          />
          <div className="flex items-center gap-3">
            <span className="font-serif text-base text-espresso">{formatPrice(item.price * item.quantity)}</span>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => removeFromCart(item.foodItem, item.customizations)}
              className="text-ink-3 hover:text-red-500 transition-colors p-1"
            >
              <Trash2 size={14} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default CartItemRow
