import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tag, CheckCircle, X, Loader2 } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { couponAPI } from '@/api/services'
import { formatPrice } from '@/utils/format'

export const CouponInput = () => {
  const { couponCode, totals, applyCoupon, removeCoupon } = useCart()
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleApply = async () => {
    if (!input.trim()) return
    setLoading(true); setError('')
    try {
      const { data } = await couponAPI.validate(input.trim().toUpperCase(), totals.subtotal)
      applyCoupon(data.data.coupon.code, data.data.discount)
      setInput('')
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Invalid coupon code')
    } finally {
      setLoading(false)
    }
  }

  if (couponCode) {
    return (
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-3 bg-gold/10 border border-gold/25 rounded-xl">
        <div className="flex items-center gap-2">
          <CheckCircle size={16} className="text-gold flex-shrink-0" />
          <div>
            <p className="font-display text-sm font-semibold text-espresso">{couponCode}</p>
            <p className="font-sans text-xs text-gold">–{formatPrice(totals.couponDiscount)} saved</p>
          </div>
        </div>
        <button onClick={removeCoupon} className="text-ink-3 hover:text-espresso transition-colors">
          <X size={16} />
        </button>
      </motion.div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3" />
          <input
            value={input}
            onChange={e => { setInput(e.target.value.toUpperCase()); setError('') }}
            onKeyDown={e => e.key === 'Enter' && handleApply()}
            placeholder="Coupon code"
            className="w-full h-10 bg-cream border border-beige/60 rounded-xl pl-9 pr-3 text-sm font-display font-medium tracking-wider text-ink outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all"
          />
        </div>
        <button
          onClick={handleApply}
          disabled={loading || !input.trim()}
          className="h-10 px-4 rounded-xl bg-espresso text-cream font-display text-sm font-medium hover:bg-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : 'Apply'}
        </button>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="text-xs text-red-500 font-sans pl-1">{error}</motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CouponInput
