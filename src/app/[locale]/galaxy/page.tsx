'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { SpaceScene } from '@/components/game/SpaceScene';
import { GalaxyMap } from '@/components/galaxy/GalaxyMap';
import { NavHeader } from '@/components/layout/NavHeader';
import { useProgressStore } from '@/store/progressStore';
import { buildProgressMap } from '@/engine/progression';
import type { Locale } from '@/lib/types';

export default function GalaxyPage() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const { data: session } = useSession();
  const levels = useProgressStore((s) => s.levels);
  const totalStars = useProgressStore((s) => s.totalStars);

  const progress = buildProgressMap(
    Object.entries(levels).map(([key, v]) => {
      const [operation, levelStr] = key.split('-');
      return {
        operation: operation as 'addition' | 'subtraction' | 'multiplication' | 'division',
        levelNumber: parseInt(levelStr, 10),
        ...v,
      };
    })
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Space background */}
      <div className="fixed inset-0 -z-10">
        <SpaceScene />
      </div>

      <NavHeader
        title={t('nav.galaxy')}
        backHref={`/${locale}`}
        rightContent={
          <div className="flex items-center gap-3 text-sm">
            <span className="text-star-filled">⭐ {totalStars}</span>
            {session?.user?.name && (
              <span className="text-white/60">👨‍🚀 {session.user.name}</span>
            )}
          </div>
        }
      />

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 overflow-y-auto px-4 py-6 max-w-lg mx-auto w-full"
      >
        <h2 className="font-heading font-bold text-white text-xl mb-6 text-center">
          🌌 Choose Your Galaxy
        </h2>
        <GalaxyMap progress={progress} locale={locale} />
      </motion.main>
    </div>
  );
}
