'use client';

import { useEffect } from 'react';

interface UseKeyboardProps {
  onDigit: (digit: number) => void;
  onBackspace: () => void;
  onSubmit: () => void;
  active: boolean;
}

export function useKeyboard({ onDigit, onBackspace, onSubmit, active }: UseKeyboardProps) {
  useEffect(() => {
    if (!active) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        onDigit(parseInt(e.key, 10));
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        onBackspace();
      } else if (e.key === 'Enter') {
        onSubmit();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [active, onDigit, onBackspace, onSubmit]);
}
