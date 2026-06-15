import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Send, CheckCircle, ArrowLeft } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { Input } from '@/components/ui/Input'
import { MotionButton } from '@/components/ui/Button'
import { authAPI } from '@/api/services'
import { isBackendOnline } from '@/services/backendStatus'
import { findDemoUserByEmail } from '@/services/mockData'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/utils/validators'

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors }, getValues } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true)
    try {
      if (!isBackendOnline()) {
        // Demo mode: simulate the flow without a backend, but still validate
        // against known demo accounts so the form behaves realistically.
        await new Promise(r => setTimeout(r, 500))
        if (!findDemoUserByEmail(data.email)) {
          toast.error('No account found with that email (demo mode)')
          return
        }
        setSent(true)
        return
      }
      await authAPI.forgotPassword(data.email)
      setSent(true)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  if (sent) return (
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-4 py-8">
      <CheckCircle size={52} className="text-green-500 mx-auto" />
      <h2 className="font-serif text-2xl text-espresso">Check your inbox</h2>
      <p className="font-sans text-sm text-ink-3">Reset link sent to <strong>{getValues('email')}</strong>. Expires in 30 minutes.</p>
      <Link to="/login" className="inline-flex items-center gap-2 text-gold font-display text-sm hover:underline"><ArrowLeft size={14} /> Back to login</Link>
    </motion.div>
  )

  return (
    <div className="space-y-7">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <span className="eyebrow">Password reset</span>
        <h1 className="font-serif text-3xl text-espresso mt-1 mb-1">Forgot Password?</h1>
        <p className="font-sans text-sm text-ink-3">Enter your email and we'll send a reset link.</p>
      </motion.div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Email" type="email" placeholder="you@email.com" error={errors.email?.message} {...register('email')} />
        <MotionButton type="submit" variant="espresso" fullWidth size="lg" pill isLoading={loading} leftIcon={<Send size={16} />}>
          Send Reset Link
        </MotionButton>
      </form>
      <Link to="/login" className="flex items-center gap-2 text-gold font-display text-sm hover:underline"><ArrowLeft size={14} /> Back to login</Link>
    </div>
  )
}
