/**
 * notify.tsx — non-component toast helpers.
 * Kept in a separate file from NotificationCenter so Vite Fast Refresh
 * never sees components and non-component exports in the same module.
 */
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { ShoppingBag, ChefHat, AlertTriangle, Bike, CheckCircle } from 'lucide-react'
import { formatPrice } from '@/utils/format'

// ── Shared toast renderer (component — internal only, not exported) ───────────
const OrderToast = ({
  title, detail, icon, accent,
}: {
  title: string; detail: string; icon: React.ReactNode; accent: string
}) => (
  <div className="flex items-start gap-3 min-w-[260px] max-w-[340px]">
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${accent}`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-display text-sm font-semibold text-espresso leading-tight">{title}</p>
      <p className="font-sans text-xs text-ink-3 mt-0.5 truncate">{detail}</p>
    </div>
  </div>
)

// ── Notification helpers ──────────────────────────────────────────────────────
export const notify = {
  newOrder: (orderNumber: string, total: number, itemCount: number) =>
    toast.custom(() => (
      <motion.div
        initial={{ opacity: 0, x: 60, scale: 0.94 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 60, scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        className="bg-cream border border-amber-200 rounded-2xl shadow-warm-lg px-4 py-3"
      >
        <OrderToast
          title="New Order!"
          detail={`${orderNumber} · ${itemCount} items · ${formatPrice(total)}`}
          icon={<ShoppingBag size={16} className="text-amber-600" />}
          accent="bg-amber-50"
        />
      </motion.div>
    ), { duration: 6000 }),

  orderReady: (orderNumber: string) =>
    toast.custom(() => (
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        className="bg-cream border border-emerald-300 rounded-2xl shadow-warm-lg px-4 py-3"
      >
        <OrderToast
          title="Order Ready! 🎉"
          detail={`${orderNumber} is ready for pickup/delivery`}
          icon={<CheckCircle size={16} className="text-emerald-600" />}
          accent="bg-emerald-50"
        />
      </motion.div>
    ), { duration: 8000 }),

  orderStatusChange: (orderNumber: string, status: string) => {
    const map: Record<string, { icon: React.ReactNode; accent: string; title: string }> = {
      accepted:         { icon: <ChefHat size={16} className="text-blue-600" />,        accent: 'bg-blue-50',    title: 'Order Accepted' },
      preparing:        { icon: <ChefHat size={16} className="text-orange-600" />,      accent: 'bg-orange-50',  title: 'Being Prepared' },
      out_for_delivery: { icon: <Bike size={16} className="text-purple-600" />,         accent: 'bg-purple-50',  title: 'Out for Delivery' },
      delivered:        { icon: <CheckCircle size={16} className="text-emerald-600" />, accent: 'bg-emerald-50', title: 'Order Delivered!' },
      cancelled:        { icon: <AlertTriangle size={16} className="text-red-600" />,   accent: 'bg-red-50',     title: 'Order Cancelled' },
      rejected:         { icon: <AlertTriangle size={16} className="text-red-600" />,   accent: 'bg-red-50',     title: 'Order Rejected' },
    }
    const cfg = map[status]
    if (!cfg) return
    toast.custom(() => (
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 60 }}
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        className={`bg-cream border rounded-2xl shadow-warm-lg px-4 py-3 ${
          status === 'delivered' ? 'border-emerald-300'
          : status === 'cancelled' || status === 'rejected' ? 'border-red-300'
          : 'border-beige/60'
        }`}
      >
        <OrderToast title={cfg.title} detail={orderNumber} icon={cfg.icon} accent={cfg.accent} />
      </motion.div>
    ), { duration: 5000 })
  },

  lowStock: (ingredient: string) =>
    toast.custom(() => (
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        className="bg-cream border border-red-300 rounded-2xl shadow-warm-lg px-4 py-3"
      >
        <OrderToast
          title="Low Stock Alert"
          detail={`${ingredient} is running low`}
          icon={<AlertTriangle size={16} className="text-red-600" />}
          accent="bg-red-50"
        />
      </motion.div>
    ), { duration: 7000 }),
}
