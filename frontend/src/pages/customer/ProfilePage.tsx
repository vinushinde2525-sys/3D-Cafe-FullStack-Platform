import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Lock, MapPin, Star, ShoppingBag, Edit2, Check, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Input } from '@/components/ui/Input'
import { MotionButton } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { userAPI } from '@/api/services'
import { formatPrice } from '@/utils/format'

export default function ProfilePage() {
  const { user, init } = useAuth()
  const [tab, setTab] = useState<'profile' | 'security' | 'addresses'>('profile')
  const [saving, setSaving] = useState(false)
  const [editingProfile, setEditingProfile] = useState(false)

  const { register, handleSubmit, reset } = useForm({
    defaultValues: { name: user?.name || '', phone: user?.phone || '' }
  })

  useEffect(() => {
    reset({ name: user?.name || '', phone: user?.phone || '' })
  }, [user, reset])

  const onSaveProfile = async (data: any) => {
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(data).forEach(([k, v]) => v && fd.append(k, v as string))
      await userAPI.updateProfile(fd)
      await init()
      toast.success('Profile updated!')
      setEditingProfile(false)
    } catch {
      toast.error('Update failed')
    } finally {
      setSaving(false)
    }
  }

  const TABS = [
    { id: 'profile',   label: 'Profile',   icon: <User size={15} />     },
    { id: 'security',  label: 'Security',  icon: <Lock size={15} />     },
    { id: 'addresses', label: 'Addresses', icon: <MapPin size={15} />   },
  ]

  return (
    <div className="min-h-screen bg-canvas pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-5 md:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-5">
            <div className="relative">
              {user?.avatar
                ? <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full object-cover border-4 border-cream shadow-warm" />
                : <div className="w-20 h-20 rounded-full bg-espresso border-4 border-cream shadow-warm flex items-center justify-center">
                    <span className="font-serif text-3xl text-cream">{user?.name?.[0]?.toUpperCase()}</span>
                  </div>}
            </div>
            <div>
              <h1 className="font-serif text-2xl text-espresso">{user?.name}</h1>
              <p className="font-sans text-sm text-ink-3">{user?.email}</p>
              <div className="flex gap-4 mt-2">
                {[
                  { icon: <ShoppingBag size={12} />, val: user?.totalOrders ?? 0, label: 'orders' },
                  { icon: <Star size={12} />, val: user?.loyaltyPoints ?? 0, label: 'pts' },
                  { icon: null, val: formatPrice(user?.totalSpent ?? 0), label: 'spent' },
                ].map(({ icon, val, label }) => (
                  <div key={label} className="flex items-center gap-1 text-xs font-sans text-ink-3">
                    {icon && <span className="text-gold">{icon}</span>}
                    <strong className="text-ink">{val}</strong> {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tab sidebar */}
          <aside className="lg:col-span-1">
            <nav className="space-y-1 bg-cream rounded-2xl p-2 border border-beige/40 shadow-warm-sm">
              {TABS.map(t => (
                <button key={t.id} onClick={() => setTab(t.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-display text-sm font-medium transition-all ${
                    tab === t.id ? 'bg-espresso text-cream' : 'text-ink-2 hover:bg-canvas-2'
                  }`}>
                  <span className={tab === t.id ? 'text-gold' : 'text-ink-3'}>{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Tab content */}
          <main className="lg:col-span-3">
            {tab === 'profile' && (
              <motion.div key="profile" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="card-premium p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-xl text-espresso">Personal Info</h2>
                  <button onClick={() => setEditingProfile(v => !v)} className="flex items-center gap-1.5 text-gold font-display text-sm hover:underline">
                    {editingProfile ? <><X size={14} /> Cancel</> : <><Edit2 size={14} /> Edit</>}
                  </button>
                </div>
                <form onSubmit={handleSubmit(onSaveProfile)} className="space-y-4">
                  <Input label="Full Name" {...register('name')} disabled={!editingProfile} />
                  <Input label="Phone" {...register('phone')} disabled={!editingProfile} placeholder="+91 99999 99999" />
                  <Input label="Email" value={user?.email || ''} disabled hint="Email cannot be changed" />
                  {editingProfile && (
                    <MotionButton type="submit" variant="espresso" size="md" pill isLoading={saving} leftIcon={<Check size={15} />}>
                      Save Changes
                    </MotionButton>
                  )}
                </form>
              </motion.div>
            )}

            {tab === 'security' && (
              <motion.div key="security" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="card-premium p-6">
                <h2 className="font-serif text-xl text-espresso mb-6">Security</h2>
                <SecurityForm />
              </motion.div>
            )}

            {tab === 'addresses' && (
              <motion.div key="addresses" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="card-premium p-6">
                <h2 className="font-serif text-xl text-espresso mb-6">Saved Addresses</h2>
                {user?.addresses?.length === 0
                  ? <p className="font-sans text-sm text-ink-3">No saved addresses yet.</p>
                  : user?.addresses?.map(addr => (
                    <div key={addr._id} className="p-4 border border-beige/40 rounded-xl mb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-display text-sm font-semibold text-espresso">{addr.label}</p>
                          <p className="font-sans text-sm text-ink-2">{addr.street}, {addr.city}, {addr.state} {addr.zipCode}</p>
                        </div>
                        {addr.isDefault && <span className="text-[10px] font-display text-gold bg-gold/10 border border-gold/25 px-2 py-0.5 rounded-full">Default</span>}
                      </div>
                    </div>
                  ))}
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

const SecurityForm = () => {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const onSubmit = async (data: any) => {
    setLoading(true)
    try {
      await userAPI.changePassword(data)
      toast.success('Password changed!')
      reset()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-sm">
      <Input label="Current Password" type="password" {...register('currentPassword', { required: true })} />
      <Input label="New Password"     type="password" {...register('newPassword',     { required: true, minLength: 6 })} />
      <MotionButton type="submit" variant="espresso" size="md" pill isLoading={loading}>
        Update Password
      </MotionButton>
    </form>
  )
}
