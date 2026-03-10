'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NumberPadProps {
  onDigit: (digit: number) => void;
  onBackspace: () => void;
  onSubmit: () => void;
  disabled?: boolean;
  className?: string;
}

export function NumberPad({ onDigit, onBackspace, onSubmit, disabled, className }: NumberPadProps) {
  const keys = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    ['⌫', 0, '✓'],
  ] as const;

  return (
    <div className={cn('grid gap-2', className)} style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
      {keys.flat().map((key) => {
        const isAction = key === '⌫' || key === '✓';
        return (
          <motion.button
            key={String(key)}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            disabled={disabled}
            aria-label={key === '⌫' ? 'Backspace' : key === '✓' ? 'Submit' : String(key)}
            onClick={() => {
              if (key === '⌫') onBackspace();
              else if (key === '✓') onSubmit();
              else onDigit(key as number);
            }}
            className={cn(
              'min-h-[56px] min-w-[56px] rounded-2xl font-heading font-bold text-xl',
              'flex items-center justify-center select-none',
              'transition-colors duration-100 disabled:opacity-50',
              isAction
                ? key === '✓'
                  ? 'bg-success text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'bg-white/10 text-white/80'
                : 'bg-space-card border border-white/15 text-white hover:bg-white/10'
            )}
          >
            {String(key)}
          </motion.button>
        );
      })}
    </div>
  );
}
