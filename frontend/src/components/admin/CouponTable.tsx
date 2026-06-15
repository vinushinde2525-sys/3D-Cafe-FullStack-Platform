import { useState } from 'react'
import { Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import { couponAPI } from '@/api/services'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/utils/format'
import toast from 'react-hot-toast'
import type { Coupon } from '@/types'

interface Props { coupons: Coupon[]; onUpdate: () => void }

export const CouponTable = ({ coupons, onUpdate }: Props) => {
  const [loading, setLoading] = useState<string | null>(null)

  const del = async (id: string) => {
    if (!confirm('Delete this coupon?')) return
    setLoading(id)
    try { await couponAPI.delete(id); onUpdate(); toast.success('Coupon deleted') }
    catch { toast.error('Delete failed') }
    finally { setLoading(null) }
  }

  const toggle = async (c: Coupon) => {
    setLoading(c._id)
    try { await couponAPI.update(c._id, { isActive: !c.isActive } as any); onUpdate() }
    catch { toast.error('Update failed') }
    finally { setLoading(null) }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-beige/40">
          <tr>{['Code','Type','Value','Min Order','Used','Expires','Status','Actions'].map(h => (
            <th key={h} className="text-left px-4 py-3 font-display text-xs text-ink-3 uppercase tracking-wide">{h}</th>
          ))}</tr>
        </thead>
        <tbody className="divide-y divide-beige/20">
          {coupons.map(c => (
            <tr key={c._id} className="hover:bg-canvas-2/50 transition-colors">
              <td className="px-4 py-3 font-display font-semibold text-espresso tracking-wider">{c.code}</td>
              <td className="px-4 py-3"><Badge variant="default">{c.discountType}</Badge></td>
              <td className="px-4 py-3 font-display text-espresso">{c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`}</td>
              <td className="px-4 py-3 font-sans text-ink-3">{c.minOrderAmount ? `₹${c.minOrderAmount}` : '—'}</td>
              <td className="px-4 py-3 font-sans text-ink-3">{c.usedCount}{c.usageLimit ? `/${c.usageLimit}` : ''}</td>
              <td className="px-4 py-3 font-sans text-xs text-ink-3">{formatDate(c.expiryDate)}</td>
              <td className="px-4 py-3"><Badge variant={c.isActive ? 'success' : 'error'}>{c.isActive ? 'Active' : 'Inactive'}</Badge></td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button onClick={() => toggle(c)} disabled={loading === c._id} className="text-ink-3 hover:text-gold transition-colors">
                    {c.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                  </button>
                  <button onClick={() => del(c._id)} disabled={loading === c._id} className="text-ink-3 hover:text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {coupons.length === 0 && <p className="text-center font-sans text-sm text-ink-3 py-12">No coupons yet.</p>}
    </div>
  )
}

export default CouponTable
