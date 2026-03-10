'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { StarRating, Button } from '@/components/ui';
import type { LevelResult } from '@/lib/types';
import type { DestinationInfo } from '@/lib/types';
import { formatTime } from '@/lib/utils';
import { useLocale } from 'next-intl';
import type { Locale } from '@/lib/types';
import { ConfettiParticles } from './ConfettiParticles';
import { useSound } from '@/hooks/useSound';

interface LevelCompleteProps {
  result: LevelResult;
  destination?: DestinationInfo;
  onRetry: () => void;
  onNext: () => void;
  onBackToMap: () => void;
}

export function LevelComplete({
  result,
  destination,
  onRetry,
  onNext,
  onBackToMap,
}: LevelCompleteProps) {
  const t = useTranslations('results');
  const locale = useLocale() as Locale;
  const { playEffect } = useSound();

  // Play star sounds staggered as they animate in
  useEffect(() => {
    const delays = [400, 700, 1000, 1300];
    const timers = delays
      .slice(0, result.stars)
      .map((ms) => setTimeout(() => playEffect('star'), ms));
    if (result.newBadges.length > 0) {
      timers.push(setTimeout(() => playEffect('badge'), 1600));
    }
    return () => timers.forEach(clearTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-40 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.95)' }}
    >
      {result.passed && <ConfettiParticles />}
      <motion.div
        initial={{ scale: 0.8, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="w-full max-w-sm bg-space-card border border-white/20 rounded-3xl p-6 text-center shadow-2xl"
      >
        {/* Header */}
        <div className="text-4xl mb-2">{result.passed ? '🎉' : '😅'}</div>
        <h2 className="font-heading text-2xl font-bold text-white mb-1">
          {result.passed ? t('missionComplete') : t('missionFailed')}
        </h2>

        {/* Destination */}
        {destination && result.passed && (
          <div className="mb-4">
            <p className="text-white/70 text-sm">
              {t('youReached', { destination: destination.name[locale] })}
            </p>
            <p className="text-white/50 text-xs mt-1 italic">
              {destination.funFact[locale]}
            </p>
          </div>
        )}

        {/* Stars */}
        <div className="flex justify-center mb-4">
          <StarRating stars={result.stars} size="lg" animate />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
          <div className="bg-white/5 rounded-xl p-2">
            <div className="text-white font-bold">
              {result.totalCorrect}/{result.totalCorrect + result.totalWrong}
            </div>
            <div className="text-white/50">Correct</div>
          </div>
          <div className="bg-white/5 rounded-xl p-2">
            <div className="text-white font-bold">{Math.round(result.accuracy)}%</div>
            <div className="text-white/50">Accuracy</div>
          </div>
          <div className="bg-white/5 rounded-xl p-2">
            <div className="text-white font-bold">{formatTime(result.totalTimeMs)}</div>
            <div className="text-white/50">Time</div>
          </div>
          <div className="bg-white/5 rounded-xl p-2">
            <div className="text-white font-bold">{result.maxStreak} 🔥</div>
            <div className="text-white/50">Best Streak</div>
          </div>
        </div>

        {result.timeBonus && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-star-filled/20 border border-star-filled/30 rounded-xl p-2 mb-4 text-star-filled text-sm font-bold"
          >
            ⚡ {t('timeBonus')}
          </motion.div>
        )}

        {/* New badges */}
        {result.newBadges.map((badge) => (
          <motion.div
            key={badge}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-primary/20 border border-primary/30 rounded-xl p-2 mb-2 text-primary text-sm"
          >
            🏅 {t('newBadge', { name: badge })}
          </motion.div>
        ))}

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <Button variant="ghost" size="sm" onClick={onRetry} className="flex-1">
            {t('retry')} ↺
          </Button>
          {result.passed ? (
            <Button variant="primary" size="sm" onClick={onNext} className="flex-1">
              {t('next')} ▶
            </Button>
          ) : (
            <Button variant="secondary" size="sm" onClick={onBackToMap} className="flex-1">
              {t('backToMap')}
            </Button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
