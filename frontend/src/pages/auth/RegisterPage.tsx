import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, UserPlus, Info } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { Input } from '@/components/ui/Input'
import { MotionButton } from '@/components/ui/Button'
import { OAuthButtons } from '@/components/auth/OAuthButtons'
import { PasswordStrength } from '@/components/auth/PasswordStrength'
import { useAuth } from '@/hooks/useAuth'
import { registerSchema, type RegisterFormData } from '@/utils/validators'

export default function RegisterPage() {
  const { register: registerUser, isLoading } = useAuth()
  const navigate = useNavigate()
  const [showPw, setShowPw] = useState(false)
  const [pw, setPw] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    const result = await registerUser({ name: data.name, email: data.email, password: data.password })
    if ((result as any).meta?.requestStatus === 'fulfilled') {
      const isDemoMode = (result as any).payload?.demo
      toast.success(isDemoMode
        ? 'Account created! (demo mode — no backend needed)'
        : 'Account created! Check your email to verify.'
      )
      navigate('/')
    } else {
      toast.error((result as any).payload as string || 'Registration failed')
    }
  }

  return (
    <div className="space-y-7">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <span className="eyebrow">Join us</span>
        <h1 className="font-serif text-3xl text-espresso mt-1 mb-1">Create Account</h1>
        <p className="font-sans text-sm text-ink-3">
          Already have one?{' '}
          <Link to="/login" className="text-gold hover:underline font-medium">Sign in</Link>
        </p>
      </motion.div>

      {/* Demo mode notice */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="flex items-start gap-2.5 p-3.5 bg-gold/8 border border-gold/25 rounded-xl"
      >
        <Info size={14} className="text-gold mt-0.5 flex-shrink-0" />
        <p className="font-sans text-xs text-ink-2 leading-relaxed">
          <strong>Demo mode:</strong> Works without a backend. Your account is saved to localStorage and will persist while you browse.
        </p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <Input
          label="Full Name"
          placeholder="Priya Sharma"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Email"
          type="email"
          placeholder="you@email.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <div className="space-y-2">
          <Input
            label="Password"
            type={showPw ? 'text' : 'password'}
            placeholder="At least 6 characters"
            error={errors.password?.message}
            rightAddon={
              <button type="button" onClick={() => setShowPw(v => !v)} className="text-ink-3 hover:text-espresso transition-colors">
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            }
            {...register('password', { onChange: e => setPw(e.target.value) })}
          />
          <PasswordStrength password={pw} />
        </div>
        <Input
          label="Confirm Password"
          type="password"
          placeholder="Repeat password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        <p className="font-sans text-xs text-ink-3">
          By creating an account you agree to our{' '}
          <Link to="/terms" className="text-gold hover:underline">Terms</Link>{' '}and{' '}
          <Link to="/privacy" className="text-gold hover:underline">Privacy Policy</Link>.
        </p>
        <MotionButton
          type="submit"
          variant="espresso"
          fullWidth
          size="lg"
          pill
          isLoading={isLoading}
          leftIcon={<UserPlus size={16} />}
        >
          Create Account
        </MotionButton>
      </motion.form>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <OAuthButtons />
      </motion.div>
    </div>
  )
}
