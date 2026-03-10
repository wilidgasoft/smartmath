'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface StreakCounterProps {
  streak: number;
}

function getStreakColor(streak: number): string {
  if (streak >= 10) return 'text-[#A855F7]';
  if (streak >= 5) return 'text-[#EF4444]';
  if (streak >= 3) return 'text-[#F97316]';
  return 'text-white';
}

export function StreakCounter({ streak }: StreakCounterProps) {
  const t = useTranslations('game');
  const colorClass = getStreakColor(streak);

  return (
    <div className="flex items-center gap-1" aria-label={t('streak', { count: streak })}>
      <AnimatePresence mode="wait">
        <motion.span
          key={streak}
          initial={{ scale: streak > 0 ? 1.5 : 1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          className={`font-heading font-bold text-lg ${colorClass}`}
        >
          {streak >= 3 ? '🔥' : '✨'} {streak}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
