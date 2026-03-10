'use client';

import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { GALAXIES } from '@/lib/constants';
import { ProgressBar, Card } from '@/components/ui';
import type { ProgressMap, Locale } from '@/lib/types';
import { getLevelsCompleted, getOperationStars, isLevelUnlocked } from '@/engine/progression';

interface GalaxyMapProps {
  progress: ProgressMap;
  locale: Locale;
}

export function GalaxyMap({ progress, locale }: GalaxyMapProps) {
  const t = useTranslations();
  const router = useRouter();
  const currentLocale = useLocale();

  return (
    <div className="space-y-4">
      {GALAXIES.map((galaxy, idx) => {
        const unlocked = isLevelUnlocked(galaxy.operation, 1, progress);
        const levelsCompleted = getLevelsCompleted(galaxy.operation, progress);
        const stars = getOperationStars(galaxy.operation, progress);
        const progressPercent = (levelsCompleted / 20) * 100;

        return (
          <motion.div
            key={galaxy.id}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card
              variant={unlocked ? 'interactive' : 'locked'}
              glowColor={unlocked ? galaxy.theme.primary : undefined}
              onClick={() => {
                if (!unlocked) return;
                router.push(`/${currentLocale}/galaxy/${galaxy.operation}`);
              }}
              className="relative overflow-hidden"
            >
              {/* Background glow */}
              {unlocked && (
                <div
                  className="absolute inset-0 opacity-10 rounded-2xl"
                  style={{
                    background: `radial-gradient(ellipse at top left, ${galaxy.theme.primary}, transparent)`,
                  }}
                />
              )}

              <div className="relative flex items-start gap-4">
                <div className="text-4xl" aria-hidden="true">
                  {idx === 0 ? '🌍' : idx === 1 ? '🌌' : idx === 2 ? '✨' : '🌀'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-heading font-bold text-white text-lg">
                      {galaxy.name[locale]}
                    </h3>
                    {unlocked ? (
                      <span className="text-star-filled text-sm">⭐ {stars}</span>
                    ) : (
                      <span className="text-white/40">🔒 {t('galaxies.locked')}</span>
                    )}
                  </div>
                  <p className="text-white/50 text-sm mb-2">
                    {t(`operations.${galaxy.operation}`)} ·{' '}
                    {unlocked
                      ? `${levelsCompleted}/20 ${t('profile.levelsCompleted', { count: levelsCompleted, total: 20 })}`
                      : t('galaxies.locked')}
                  </p>
                  {unlocked && (
                    <ProgressBar value={progressPercent} height="sm" />
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
