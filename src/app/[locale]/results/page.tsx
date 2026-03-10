'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { StarRating, Button } from '@/components/ui';
import { ConfettiParticles } from '@/components/game/ConfettiParticles';
import { SpaceScene } from '@/components/game/SpaceScene';
import { GALAXIES } from '@/lib/constants';
import { formatTime } from '@/lib/utils';
import type { Operation, Locale } from '@/lib/types';

export default function ResultsPage() {
  const t = useTranslations('results');
  const locale = useLocale() as Locale;
  const router = useRouter();
  const params = useSearchParams();

  const operation = (params.get('operation') ?? 'addition') as Operation;
  const levelNumber = parseInt(params.get('level') ?? '1', 10);
  const stars = parseInt(params.get('stars') ?? '0', 10);
  const accuracy = parseFloat(params.get('accuracy') ?? '0');
  const timeMs = parseInt(params.get('time') ?? '0', 10);
  const streak = parseInt(params.get('streak') ?? '0', 10);
  const passed = params.get('passed') === 'true';

  const galaxy = GALAXIES.find((g) => g.operation === operation);
  const destination = galaxy?.destinations.find((d) => d.levelNumber === levelNumber);

  return (
    <main className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0">
        <SpaceScene />
      </div>
      {passed && <ConfettiParticles />}

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative z-10 w-full max-w-sm bg-space-card border border-white/20 rounded-3xl p-6 text-center shadow-2xl"
      >
        <div className="text-5xl mb-3">{passed ? '🎉' : '😅'}</div>

        <h1 className="font-heading font-bold text-white text-2xl mb-2">
          {passed ? t('missionComplete') : t('missionFailed')}
        </h1>

        {destination && passed && (
          <div className="mb-4">
            <p className="text-white/70 text-sm">
              {t('youReached', { destination: destination.name[locale] })}
            </p>
            <p className="text-white/40 text-xs mt-1 italic px-2">
              {destination.funFact[locale]}
            </p>
          </div>
        )}

        <div className="flex justify-center mb-4">
          <StarRating stars={stars} size="lg" animate />
        </div>

        <div className="grid grid-cols-2 gap-2 mb-5 text-sm">
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-white font-bold text-lg">{Math.round(accuracy)}%</div>
            <div className="text-white/50 text-xs">{t('accuracy', { percent: '' }).replace('%', '')}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-white font-bold text-lg">{formatTime(timeMs)}</div>
            <div className="text-white/50 text-xs">Time</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 col-span-2">
            <div className="text-white font-bold text-lg">{streak} 🔥</div>
            <div className="text-white/50 text-xs">{t('bestStreak', { count: '' }).replace(': ', '')}</div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1"
            onClick={() => router.push(`/${locale}/galaxy/${operation}/${levelNumber}`)}
          >
            {t('retry')} ↺
          </Button>
          {passed && (
            <Button
              variant="primary"
              size="sm"
              className="flex-1"
              onClick={() => router.push(`/${locale}/galaxy/${operation}/${Math.min(levelNumber + 1, 20)}`)}
            >
              {t('next')} ▶
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={() => router.push(`/${locale}/galaxy/${operation}`)}
          >
            Map 🗺
          </Button>
        </div>
      </motion.div>
    </main>
  );
}
