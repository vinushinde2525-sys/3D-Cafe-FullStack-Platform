import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CreditCard, Lock, ShoppingBag, Zap } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { MotionButton } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { OrderSummary } from '@/components/cart/OrderSummary'
import { makeMockOrder } from '@/services/mockData'
import { formatPrice } from '@/utils/format'
import toast from 'react-hot-toast'

type Step = 'address' | 'payment'

const MOCK_CARD = { number: '4242 4242 4242 4242', expiry: '12/26', cvv: '123', name: 'Demo User' }

export default function CheckoutPage() {
  const navigate  = useNavigate()
  const { items, totals, clearCart } = useCart()
  const { user }  = useAuth()

  const [step, setStep]           = useState<Step>('address')
  const [paying, setPaying]       = useState(false)
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery')
  const [address, setAddress]     = useState({
    street: user?.addresses?.[0]?.street  || '',
    city:   user?.addresses?.[0]?.city    || '',
    state:  user?.addresses?.[0]?.state   || 'Maharashtra',
    zip:    user?.addresses?.[0]?.zipCode || '',
  })
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' })

  const STEPS = [
    { id: 'address', label: 'Delivery' },
    { id: 'payment', label: 'Payment' },
  ]

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-canvas pt-28 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={52} className="text-beige mx-auto mb-4" />
          <h2 className="font-serif text-2xl text-espresso mb-2">Your cart is empty</h2>
          <button onClick={() => navigate('/menu')} className="text-gold font-display text-sm hover:underline">
            Browse Menu
          </button>
        </div>
      </div>
    )
  }

  const fillDemoCard = () => {
    setCard(MOCK_CARD)
    toast('Demo card filled!', { icon: '💳' })
  }

  const processPayment = async () => {
    setPaying(true)
    await new Promise(r => setTimeout(r, 1800))
    const order = makeMockOrder(user?._id || 'guest', items, totals.total)
    const history = JSON.parse(localStorage.getItem('cafe_orders') || '[]')
    history.unshift(order)
    localStorage.setItem('cafe_orders', JSON.stringify(history.slice(0, 20)))
    clearCart()
    setPaying(false)
    navigate(`/order-confirm/${order._id}`)
  }

  const stepIndex = STEPS.findIndex(s => s.id === step)
  const addressValid = orderType === 'pickup' || (address.street && address.city && address.zip)

  return (
    <div className="min-h-screen bg-canvas pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-5 md:px-8">

        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-10 max-w-xs mx-auto">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-display text-sm font-semibold transition-all ${
                  i === stepIndex ? 'bg-espresso text-cream' :
                  i < stepIndex   ? 'bg-gold text-cream' :
                                    'bg-canvas-2 text-ink-3'
                }`}>
                  {i < stepIndex ? '✓' : i + 1}
                </div>
                <span className="font-display text-[10px] text-ink-3 mt-1">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-2 transition-all ${i < stepIndex ? 'bg-gold' : 'bg-beige/50'}`} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* ── Address step ──────────────────────────────────────────── */}
          {step === 'address' && (
            <motion.div key="address"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2 card-premium p-7 space-y-5">
                <h2 className="font-serif text-xl text-espresso">Delivery Details</h2>

                {/* Order type toggle */}
                <div className="flex gap-3">
                  {(['delivery', 'pickup'] as const).map(t => (
                    <button key={t} onClick={() => setOrderType(t)}
                      className={`flex-1 py-3 rounded-xl border-2 font-display text-sm font-medium capitalize transition-all ${
                        orderType === t
                          ? 'border-espresso bg-espresso text-cream'
                          : 'border-beige/60 text-ink-2 hover:border-gold/40'
                      }`}
                    >
                      {t === 'delivery' ? '🛵 ' : '🏪 '}{t}
                    </button>
                  ))}
                </div>

                {orderType === 'delivery' && (
                  <div className="space-y-4">
                    <Input label="Street Address" placeholder="12 Artisan Lane"
                      value={address.street} onChange={e => setAddress(a => ({ ...a, street: e.target.value }))} required />
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="City" placeholder="Pune"
                        value={address.city} onChange={e => setAddress(a => ({ ...a, city: e.target.value }))} required />
                      <Input label="ZIP Code" placeholder="411001"
                        value={address.zip} onChange={e => setAddress(a => ({ ...a, zip: e.target.value }))} required />
                    </div>
                  </div>
                )}

                <MotionButton
                  onClick={() => setStep('payment')}
                  disabled={!addressValid}
                  variant="espresso" fullWidth size="lg" pill
                >
                  Continue to Payment →
                </MotionButton>
              </div>

              <div className="lg:col-span-1 card-premium p-5">
                <h3 className="font-serif text-base text-espresso mb-4">Order Summary</h3>
                <OrderSummary showCoupon={false} />
              </div>
            </motion.div>
          )}

          {/* ── Payment step ──────────────────────────────────────────── */}
          {step === 'payment' && (
            <motion.div key="payment"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2 card-premium p-7 space-y-5">
                <div className="flex items-center gap-3">
                  <h2 className="font-serif text-xl text-espresso">Payment</h2>
                  <span className="flex items-center gap-1 text-xs font-display text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                    <Lock size={11} /> Secure (Demo)
                  </span>
                </div>

                {/* Demo card notice */}
                <div className="flex items-start gap-3 p-4 bg-gold/8 border border-gold/20 rounded-xl">
                  <Zap size={15} className="text-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-display text-sm font-semibold text-espresso mb-1">Demo Payment Mode</p>
                    <p className="font-sans text-xs text-ink-3 mb-2">No real charges. Use the demo card or enter anything.</p>
                    <button onClick={fillDemoCard}
                      className="px-3 py-1.5 bg-espresso text-cream rounded-lg font-display text-xs hover:bg-gold transition-colors">
                      Fill Demo Card
                    </button>
                  </div>
                </div>

                {/* Card form */}
                <div className="space-y-4">
                  <Input label="Cardholder Name" placeholder="Name on card"
                    value={card.name} onChange={e => setCard(c => ({ ...c, name: e.target.value }))} />
                  <Input label="Card Number" placeholder="1234 5678 9012 3456"
                    value={card.number} onChange={e => setCard(c => ({ ...c, number: e.target.value }))}
                    leftAddon={<CreditCard size={14} />} />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Expiry" placeholder="MM/YY"
                      value={card.expiry} onChange={e => setCard(c => ({ ...c, expiry: e.target.value }))} />
                    <Input label="CVV" placeholder="123"
                      value={card.cvv} onChange={e => setCard(c => ({ ...c, cvv: e.target.value }))} />
                  </div>
                </div>

                <MotionButton
                  onClick={processPayment}
                  isLoading={paying}
                  variant="espresso" fullWidth size="lg" pill
                  leftIcon={<Lock size={16} />}
                >
                  {paying ? 'Processing…' : `Pay ${formatPrice(totals.total)}`}
                </MotionButton>

                <button onClick={() => setStep('address')}
                  className="w-full text-center font-display text-sm text-ink-3 hover:text-espresso transition-colors">
                  ← Back to Delivery
                </button>
              </div>

              <div className="lg:col-span-1 space-y-4">
                <div className="card-premium p-5">
                  <h3 className="font-serif text-base text-espresso mb-4">Order Summary</h3>
                  <OrderSummary showCoupon={false} />
                </div>
                <div className="card-premium p-4 space-y-3">
                  {items.map(item => (
                    <div key={item.foodItem} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-canvas-2 flex-shrink-0">
                        {item.image
                          ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-lg">☕</div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display text-xs font-medium text-espresso truncate">{item.name}</p>
                        <p className="font-sans text-xs text-ink-3">×{item.quantity}</p>
                      </div>
                      <p className="font-sans text-xs text-ink-2">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
