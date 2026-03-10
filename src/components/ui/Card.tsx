'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type CardVariant = 'default' | 'interactive' | 'locked';

interface CardProps {
  variant?: CardVariant;
  glowColor?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  'aria-label'?: string;
}

export function Card({ variant = 'default', glowColor, children, className, onClick, style, 'aria-label': ariaLabel }: CardProps) {
  const isInteractive = variant === 'interactive';
  const isLocked = variant === 'locked';

  const baseClasses = cn(
    'bg-space-card border rounded-2xl p-4 backdrop-blur-sm',
    isLocked ? 'border-white/10 opacity-60' : 'border-white/15',
    glowColor
      ? `shadow-[0_0_30px_${glowColor}33]`
      : 'shadow-[0_4px_20px_rgba(0,0,0,0.4)]',
    className
  );

  if (isInteractive) {
    return (
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={cn(baseClasses, 'cursor-pointer select-none')}
        onClick={onClick}
        style={style}
        aria-label={ariaLabel}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={baseClasses} style={style} aria-label={ariaLabel}>
      {children}
    </div>
  );
}
