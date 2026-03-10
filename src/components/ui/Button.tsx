'use client';

import { motion } from 'framer-motion';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<ComponentPropsWithoutRef<'button'>, 'onDrag' | 'onDragEnd' | 'onDragStart' | 'onAnimationStart'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary hover:bg-primary-hover text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]',
  secondary: 'bg-space-card border border-white/20 text-white hover:bg-white/10',
  success: 'bg-success hover:bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]',
  warning: 'bg-warning hover:bg-amber-600 text-white shadow-[0_0_20px_rgba(245,158,11,0.4)]',
  ghost: 'bg-transparent border border-white/20 text-white/80 hover:bg-white/5 hover:text-white',
  danger: 'bg-red-600 hover:bg-red-700 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'min-h-[40px] px-4 py-2 text-sm rounded-xl',
  md: 'min-h-[52px] px-6 py-3 text-base rounded-2xl',
  lg: 'min-h-[64px] px-8 py-4 text-lg rounded-2xl',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className,
  disabled,
  onClick,
  type,
  ...rest
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={cn(
        'relative inline-flex items-center justify-center gap-2 font-heading font-semibold transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed select-none',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      {...(rest as object)}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon
      )}
      {children}
    </motion.button>
  );
}
