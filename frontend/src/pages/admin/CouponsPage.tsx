import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { couponAPI } from '@/api/services'
import { CouponTable } from '@/components/admin/CouponTable'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { MotionButton } from '@/components/ui/Button'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import type { Coupon } from '@/types'

export default function CouponsManagementPage() {
  const [coupons, setCoupons]   = useState<Coupon[]>([])
  const [loading, setLoading]   = useState(true)
  const [creating, setCreating] = useState(false)
  const [saving, setSaving]     = useState(false)
  const { register, handleSubmit, reset } = useForm()

  const fetch = async () => {
    setLoading(true)
    try { const { data } = await couponAPI.getAll(); setCoupons(data.data ?? []) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetch() }, [])

  const onCreate = async (data: any) => {
    setSaving(true)
    try {
      await couponAPI.create({ ...data, discountValue: Number(data.discountValue), minOrderAmount: Number(data.minOrderAmount || 0) })
      toast.success('Coupon created!'); setCreating(false); reset(); fetch()
    } catch { toast.error('Create failed') }
    finally { setSaving(false) }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-espresso">Coupons</h1>
        <MotionButton onClick={() => setCreating(true)} variant="espresso" size="sm" pill leftIcon={<Plus size={14} />}>
          New Coupon
        </MotionButton>
      </div>
      <div className="card-premium overflow-hidden">
        {loading ? <p className="p-8 text-center font-sans text-sm text-ink-3">Loading…</p> : <CouponTable coupons={coupons} onUpdate={fetch} />}
      </div>

      <Modal isOpen={creating} onClose={() => setCreating(false)} title="Create Coupon" size="md">
        <form onSubmit={handleSubmit(onCreate)} className="space-y-4">
          <Input label="Code" placeholder="WELCOME20" {...register('code', { required: true })} hint="Will be uppercased" />
          <Input label="Description" {...register('description')} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-display text-sm font-medium text-ink-2 mb-1.5">Discount Type</label>
              <select {...register('discountType', { required: true })} className="w-full h-11 bg-cream border border-beige/60 rounded-xl px-4 text-sm font-sans text-ink outline-none focus:border-gold/50">
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
            <Input label="Value" type="number" placeholder="20" {...register('discountValue', { required: true })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Min Order (₹)" type="number" placeholder="300" {...register('minOrderAmount')} />
            <Input label="Expiry Date" type="date" {...register('expiryDate', { required: true })} />
          </div>
          <Input label="Usage Limit" type="number" placeholder="Unlimited" {...register('usageLimit')} hint="Leave blank for unlimited" />
          <MotionButton type="submit" variant="espresso" pill isLoading={saving} fullWidth>Create Coupon</MotionButton>
        </form>
      </Modal>
    </div>
  )
}
