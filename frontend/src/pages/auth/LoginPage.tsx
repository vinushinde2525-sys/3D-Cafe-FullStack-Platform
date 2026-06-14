import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, LogIn, Info } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { Input } from '@/components/ui/Input'
import { MotionButton } from '@/components/ui/Button'
import { OAuthButtons } from '@/components/auth/OAuthButtons'
import { useAuth } from '@/hooks/useAuth'
import { loginSchema, type LoginFormData } from '@/utils/validators'

const DEMO_ACCOUNTS = [
  { label: 'Customer',  email: 'customer@cafe3d.com', password: 'Customer@1234' },
  { label: 'Admin',     email: 'admin@cafe3d.com',    password: 'Admin@1234'    },
]

export default function LoginPage() {
  const { login, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as any)?.from?.pathname || '/'
  const [showPw, setShowPw] = useState(false)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const fillDemo = (email: string, password: string) => {
    setValue('email', email)
    setValue('password', password)
    toast('Demo credentials filled — click Sign In', { icon: '☕' })
  }

  const onSubmit = async (data: LoginFormData) => {
    const result = await login(data)
    if ((result as any).meta?.requestStatus === 'fulfilled') {
      const isDemoMode = (result as any).payload?.demo
      toast.success(isDemoMode ? 'Signed in (demo mode)' : 'Welcome back!')
      navigate(from, { replace: true })
    } else {
      toast.error((result as any).payload as string || 'Login failed')
    }
  }

  return (
    <div className="space-y-7">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <span className="eyebrow">Welcome back</span>
        <h1 className="font-serif text-3xl text-espresso mt-1 mb-1">Sign In</h1>
        <p className="font-sans text-sm text-ink-3">
          New here?{' '}
          <Link to="/register" className="text-gold hover:underline font-medium">Create an account</Link>
        </p>
      </motion.div>

      {/* Demo credentials banner */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="p-4 bg-gold/8 border border-gold/25 rounded-2xl"
      >
        <div className="flex items-start gap-2.5 mb-3">
          <Info size={15} className="text-gold mt-0.5 flex-shrink-0" />
          <p className="font-display text-xs font-semibold text-espresso">Demo credentials — click to fill</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {DEMO_ACCOUNTS.map(acc => (
            <button
              key={acc.label}
              type="button"
              onClick={() => fillDemo(acc.email, acc.password)}
              className="px-3 py-1.5 bg-cream border border-beige/60 rounded-xl font-display text-xs text-ink-2 hover:border-gold/50 hover:bg-mist transition-all"
            >
              {acc.label} →
            </button>
          ))}
        </div>
        <p className="font-sans text-[10px] text-ink-3 mt-2 leading-relaxed">
          Works without a backend. Auth is stored in localStorage.
        </p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <Input
          label="Email"
          type="email"
          placeholder="you@email.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Password"
          type={showPw ? 'text' : 'password'}
          placeholder="••••••••"
          error={errors.password?.message}
          rightAddon={
            <button type="button" onClick={() => setShowPw(v => !v)} className="text-ink-3 hover:text-espresso transition-colors">
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          }
          {...register('password')}
        />
        <div className="flex justify-end">
          <Link to="/forgot-password" className="font-display text-sm text-gold hover:underline">
            Forgot password?
          </Link>
        </div>
        <MotionButton
          type="submit"
          variant="espresso"
          fullWidth
          size="lg"
          pill
          isLoading={isLoading}
          leftIcon={<LogIn size={16} />}
        >
          Sign In
        </MotionButton>
      </motion.form>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <OAuthButtons />
      </motion.div>
    </div>
  )
}
