'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NumberPad } from '@/components/ui';

interface NumericInputProps {
  onSubmit: (answer: number) => void;
  disabled?: boolean;
  feedback?: 'correct' | 'wrong' | null;
}

export function NumericInput({ onSubmit, disabled, feedback }: NumericInputProps) {
  const [value, setValue] = useState('');

  const handleDigit = (digit: number) => {
    if (disabled) return;
    setValue((v) => (v.length < 4 ? v + digit : v));
  };

  const handleBackspace = () => {
    if (disabled) return;
    setValue((v) => v.slice(0, -1));
  };

  const handleSubmit = () => {
    if (disabled || !value) return;
    onSubmit(parseInt(value, 10));
    setValue('');
  };

  // Keyboard support
  useEffect(() => {
    if (disabled) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') handleDigit(parseInt(e.key, 10));
      else if (e.key === 'Backspace') handleBackspace();
      else if (e.key === 'Enter') handleSubmit();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  const displayClass =
    feedback === 'correct'
      ? 'border-success text-success'
      : feedback === 'wrong'
        ? 'border-warning text-warning'
        : 'border-white/30 text-white';

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={feedback ?? 'input'}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className={`w-full max-w-[180px] h-16 rounded-2xl border-2 bg-white/5 flex items-center justify-center font-mono font-bold text-3xl transition-colors duration-200 ${displayClass}`}
          aria-live="polite"
          aria-label={`Current input: ${value || 'empty'}`}
        >
          {value || <span className="text-white/30">__</span>}
        </motion.div>
      </AnimatePresence>

      {/* Number pad */}
      <NumberPad
        onDigit={handleDigit}
        onBackspace={handleBackspace}
        onSubmit={handleSubmit}
        disabled={disabled}
        className="w-full max-w-[220px]"
      />
    </div>
  );
}
