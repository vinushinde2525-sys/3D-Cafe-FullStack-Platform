import { useMemo } from 'react'
import { motion } from 'framer-motion'

interface Props { password: string }

const getStrength = (pw: string) => {
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return score
}

const LEVELS = ['', 'Weak', 'Fair', 'Good', 'Strong']
const COLORS = ['bg-beige', 'bg-red-400', 'bg-amber-400', 'bg-blue-400', 'bg-emerald-500']
const TEXT_COLORS = ['text-ink-3', 'text-red-500', 'text-amber-600', 'text-blue-600', 'text-emerald-600']

export const PasswordStrength = ({ password }: Props) => {
  const strength = useMemo(() => getStrength(password), [password])
  if (!password) return null

  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex-1 h-1 rounded-full bg-canvas-2 overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${i <= strength ? COLORS[strength] : 'bg-canvas-2'}`}
              initial={{ width: 0 }}
              animate={{ width: i <= strength ? '100%' : '0%' }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            />
          </div>
        ))}
      </div>
      <p className={`font-display text-xs ${TEXT_COLORS[strength]}`}>{LEVELS[strength]}</p>
    </div>
  )
}

export default PasswordStrength
