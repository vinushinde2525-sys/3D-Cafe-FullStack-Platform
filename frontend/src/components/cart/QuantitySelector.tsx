import { motion } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import { cn } from '@/utils/cn'

interface Props { value: number; onChange: (v: number) => void; min?: number; max?: number; size?: 'sm' | 'md' }

export const QuantitySelector = ({ value, onChange, min = 1, max = 99, size = 'md' }: Props) => {
  const sm = size === 'sm'
  return (
    <div className={cn('flex items-center gap-2 bg-canvas-2 rounded-full', sm ? 'px-1.5 py-1' : 'px-2 py-1.5')}>
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={cn('rounded-full bg-cream flex items-center justify-center text-ink-2 hover:text-espresso hover:bg-mist transition-colors shadow-warm-sm disabled:opacity-30 disabled:cursor-not-allowed', sm ? 'w-6 h-6' : 'w-7 h-7')}
      >
        <Minus size={sm ? 11 : 13} />
      </motion.button>
      <span className={cn('font-display font-semibold text-espresso text-center tabular-nums', sm ? 'text-sm w-4' : 'text-base w-5')}>{value}</span>
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={cn('rounded-full bg-espresso flex items-center justify-center text-cream hover:bg-gold transition-colors shadow-warm-sm disabled:opacity-30 disabled:cursor-not-allowed', sm ? 'w-6 h-6' : 'w-7 h-7')}
      >
        <Plus size={sm ? 11 : 13} />
      </motion.button>
    </div>
  )
}

export default QuantitySelector
