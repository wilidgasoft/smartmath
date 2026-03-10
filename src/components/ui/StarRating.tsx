'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  stars: number; // 0-4
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
  className?: string;
}

const sizeMap = { sm: 16, md: 24, lg: 32 };

export function StarRating({
  stars,
  maxStars = 4,
  size = 'md',
  animate = false,
  className,
}: StarRatingProps) {
  const px = sizeMap[size];

  return (
    <div className={cn('flex gap-1 items-center', className)} aria-label={`${stars} out of ${maxStars} stars`}>
      {Array.from({ length: maxStars }, (_, i) => {
        const filled = i < stars;
        return (
          <motion.span
            key={i}
            initial={animate ? { scale: 0, rotate: -180 } : undefined}
            animate={animate ? { scale: 1, rotate: 0 } : undefined}
            transition={
              animate
                ? { delay: i * 0.2, type: 'spring', stiffness: 300, damping: 15 }
                : undefined
            }
            style={{ width: px, height: px, display: 'inline-block', lineHeight: 1, fontSize: px }}
          >
            {filled ? '⭐' : '☆'}
          </motion.span>
        );
      })}
    </div>
  );
}
