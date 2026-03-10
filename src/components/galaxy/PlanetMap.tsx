'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import type { GalaxyInfo, ProgressMap, Locale } from '@/lib/types';
import { isLevelUnlocked } from '@/engine/progression';
import { PlanetNode } from './PlanetNode';

interface PlanetMapProps {
  galaxy: GalaxyInfo;
  progress: ProgressMap;
}

export function PlanetMap({ galaxy, progress }: PlanetMapProps) {
  const router = useRouter();
  const locale = useLocale() as Locale;
  const currentRef = useRef<HTMLDivElement>(null);

  // Find the current (next playable) level
  const currentLevel = (() => {
    for (let l = 1; l <= 20; l++) {
      const key = `${galaxy.operation}-${l}`;
      const prog = progress.get(key);
      if (!prog || prog.stars === 0) return l;
    }
    return 20;
  })();

  useEffect(() => {
    currentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  // Arrange destinations in rows of 4 (left-right-left-right zigzag)
  const rows: (typeof galaxy.destinations)[] = [];
  for (let i = 0; i < galaxy.destinations.length; i += 4) {
    rows.push(galaxy.destinations.slice(i, i + 4));
  }

  return (
    <div className="px-4 py-6 space-y-6">
      {rows.map((row, rowIdx) => {
        const isEven = rowIdx % 2 === 0;
        return (
          <div
            key={rowIdx}
            className={`flex justify-around items-center ${isEven ? '' : 'flex-row-reverse'}`}
          >
            {row.map((dest) => {
              const key = `${galaxy.operation}-${dest.levelNumber}`;
              const levelProgress = progress.get(key);
              const unlocked = isLevelUnlocked(galaxy.operation, dest.levelNumber, progress);
              const isCurrent = dest.levelNumber === currentLevel;

              return (
                <div
                  key={dest.levelNumber}
                  ref={isCurrent ? currentRef : undefined}
                >
                  <PlanetNode
                    destination={dest}
                    progress={levelProgress ? {
                      stars: levelProgress.stars,
                      bestAccuracy: levelProgress.bestAccuracy,
                      bestTimeMs: levelProgress.bestTimeMs,
                      attempts: levelProgress.attempts,
                      completedAt: levelProgress.completedAt,
                    } : undefined}
                    isUnlocked={unlocked}
                    isCurrent={isCurrent}
                    locale={locale}
                    onClick={() => {
                      if (unlocked) {
                        router.push(`/${locale}/galaxy/${galaxy.operation}/${dest.levelNumber}`);
                      }
                    }}
                  />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
