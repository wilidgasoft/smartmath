'use client';

import { useTranslations, useLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { use } from 'react';
import { SpaceScene } from '@/components/game/SpaceScene';
import { PlanetMap } from '@/components/galaxy/PlanetMap';
import { NavHeader } from '@/components/layout/NavHeader';
import { useProgressStore } from '@/store/progressStore';
import { buildProgressMap } from '@/engine/progression';
import { GALAXIES, OPERATION_ORDER } from '@/lib/constants';
import type { Locale, Operation } from '@/lib/types';

interface Props {
  params: Promise<{ operationId: string }>;
}

export default function GalaxyDetailPage({ params }: Props) {
  const { operationId } = use(params);
  const t = useTranslations('operations');
  const locale = useLocale() as Locale;

  // Validate operation
  if (!OPERATION_ORDER.includes(operationId as Operation)) {
    notFound();
  }

  const operation = operationId as Operation;
  const galaxy = GALAXIES.find((g) => g.operation === operation);
  if (!galaxy) notFound();

  const levels = useProgressStore((s) => s.levels);
  const totalStars = useProgressStore((s) => s.totalStars);

  const progress = buildProgressMap(
    Object.entries(levels).map(([key, v]) => {
      const [op, levelStr] = key.split('-');
      return {
        operation: op as Operation,
        levelNumber: parseInt(levelStr, 10),
        ...v,
      };
    })
  );

  return (
    <div className="min-h-screen flex flex-col" style={{ background: galaxy.theme.bg }}>
      <div className="fixed inset-0 -z-10">
        <SpaceScene bgColor={galaxy.theme.bg} />
      </div>

      <NavHeader
        title={galaxy.name[locale]}
        backHref={`/${locale}/galaxy`}
        rightContent={<span className="text-star-filled text-sm">⭐ {totalStars}</span>}
      />

      <div className="px-4 py-2 bg-space-card/50 text-center">
        <span className="text-white/60 text-sm">{t(operation)}</span>
      </div>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 overflow-y-auto"
      >
        <PlanetMap galaxy={galaxy} progress={progress} />
      </motion.main>
    </div>
  );
}
