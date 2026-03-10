'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number; // 0-100
  label?: string;
  className?: string;
  height?: 'sm' | 'md' | 'lg';
}

const heightClasses = {
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4',
};

function getBarColor(value: number): string {
  if (value >= 80) return '#10B981'; // green
  if (value >= 50) return '#F59E0B'; // amber
  return '#EF4444'; // red
}

export function ProgressBar({ value, label, className, height = 'md' }: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const color = getBarColor(clampedValue);

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="flex justify-between text-sm text-white/60 mb-1">
          <span>{label}</span>
          <span>{Math.round(clampedValue)}%</span>
        </div>
      )}
      <div className={cn('w-full rounded-full bg-white/10', heightClasses[height])}>
        <motion.div
          className="rounded-full h-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${clampedValue}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
