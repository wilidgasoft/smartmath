'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { MathProblem } from '@/lib/types';

interface ProblemDisplayProps {
  problem: MathProblem;
  feedback?: 'correct' | 'wrong' | null;
}

export function ProblemDisplay({ problem, feedback }: ProblemDisplayProps) {
  const bgFlash =
    feedback === 'correct'
      ? 'bg-success/20 border-success/40'
      : feedback === 'wrong'
        ? 'bg-warning/20 border-warning/40'
        : 'bg-white/5 border-white/10';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={problem.id}
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -60, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`border rounded-2xl p-6 text-center transition-colors duration-200 ${bgFlash}`}
      >
        <div
          className="font-mono font-bold text-white"
          style={{ fontSize: 'clamp(2rem,8vw,3.5rem)' }}
          aria-live="polite"
          aria-label={`${problem.displayText} = ?`}
        >
          {problem.displayText} = <span className="text-primary">?</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
