import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, KeyRound } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { Input } from '@/components/ui/Input'
import { MotionButton } from '@/components/ui/Button'
import { PasswordStrength } from '@/components/auth/PasswordStrength'
import { authAPI } from '@/api/services'
import { resetPasswordSchema, type ResetPasswordFormData } from '@/utils/validators'

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const [showPw, setShowPw] = useState(false)
  const [pw, setPw] = useState('')
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return
    setLoading(true)
    try {
      await authAPI.resetPassword(token, data.password, data.confirmPassword)
      toast.success('Password reset! Please sign in.')
      navigate('/login')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Reset failed. Link may have expired.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-7">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <span className="eyebrow">New password</span>
        <h1 className="font-serif text-3xl text-espresso mt-1 mb-1">Reset Password</h1>
      </motion.div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Input
            label="New Password"
            type={showPw ? 'text' : 'password'}
            placeholder="At least 6 characters"
            error={errors.password?.message}
            rightAddon={<button type="button" onClick={() => setShowPw(v => !v)} className="text-ink-3 hover:text-espresso"><Eye size={15} /></button>}
            {...register('password', { onChange: e => setPw(e.target.value) })}
          />
          <PasswordStrength password={pw} />
        </div>
        <Input label="Confirm Password" type="password" placeholder="Repeat password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
        <MotionButton type="submit" variant="espresso" fullWidth size="lg" pill isLoading={loading} leftIcon={<KeyRound size={16} />}>
          Reset Password
        </MotionButton>
      </form>
      <Link to="/login" className="text-gold font-display text-sm hover:underline">Back to login</Link>
    </div>
  )
}
