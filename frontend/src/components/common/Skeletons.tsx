import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

// ── Base shimmer — slow, cinematic, premium ───────────────────────────────────
const shimmer = {
  initial:  { backgroundPosition: '-400px 0' },
  animate:  { backgroundPosition:  '400px 0' },
  transition: {
    duration: 1.8,
    ease: 'linear',
    repeat: Infinity,
  },
};

interface SkeletonProps { className?: string; }

export const Skeleton = ({ className }: SkeletonProps) => (
  <motion.div
    variants={shimmer}
    initial="initial"
    animate="animate"
    transition={shimmer.transition}
    className={cn(
      'rounded-lg',
      'bg-[length:800px_100%]',
      'bg-gradient-to-r from-beige/60 via-cream to-beige/60',
      className
    )}
  />
);

// ── Food card skeleton — matches real card proportions ─────────────────────────
export const FoodCardSkeleton = ({ index = 0 }: { index?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
    className="card-premium overflow-hidden"
  >
    {/* Image placeholder */}
    <div className="relative overflow-hidden aspect-[4/3] bg-beige/30">
      <Skeleton className="absolute inset-0 rounded-none" />
      {/* Subtle inner glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
    </div>

    <div className="p-5 space-y-3">
      {/* Name + price row */}
      <div className="flex items-start justify-between gap-3">
        <Skeleton className="h-5 w-3/5" />
        <Skeleton className="h-5 w-14 flex-shrink-0" />
      </div>
      {/* Description lines */}
      <Skeleton className="h-3.5 w-full" />
      <Skeleton className="h-3.5 w-4/5" />
      {/* Rating + time */}
      <div className="flex items-center gap-3 pt-1">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-12" />
      </div>
      {/* CTA */}
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-9 w-28 rounded-full" />
      </div>
    </div>
  </motion.div>
);

export const FoodGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <FoodCardSkeleton key={i} index={i} />
    ))}
  </div>
);

export const OrderCardSkeleton = () => (
  <div className="card-premium p-5 space-y-4">
    <div className="flex items-center justify-between">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
    <div className="flex items-center justify-between">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-16" />
    </div>
  </div>
);

export const ProfileSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-5">
      <Skeleton className="w-20 h-20 rounded-full flex-shrink-0" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-36" />
      </div>
    </div>
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="space-y-1.5">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-11 w-full rounded-xl" />
      </div>
    ))}
  </div>
);

export const NavbarSkeleton = () => (
  <div className="h-16 glass-nav fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6">
    <Skeleton className="h-6 w-28" />
    <div className="hidden md:flex gap-8">
      {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-4 w-16" />)}
    </div>
    <div className="flex gap-3">
      <Skeleton className="h-9 w-9 rounded-full" />
      <Skeleton className="h-9 w-9 rounded-full" />
    </div>
  </div>
);

export const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.35 }}
          className="card-premium p-5 space-y-3"
        >
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-3 w-16" />
        </motion.div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Skeleton className="h-72 rounded-2xl" />
      <Skeleton className="h-72 rounded-2xl" />
    </div>
  </div>
);

export default Skeleton;
