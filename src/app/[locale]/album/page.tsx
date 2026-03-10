'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { NavHeader } from '@/components/layout/NavHeader';
import { Modal } from '@/components/ui';
import { GALAXIES } from '@/lib/constants';
import { useProgressStore } from '@/store/progressStore';
import type { DestinationInfo, Locale } from '@/lib/types';

export default function AlbumPage() {
  const t = useTranslations('album');
  const locale = useLocale() as Locale;
  const [selectedDest, setSelectedDest] = useState<DestinationInfo | null>(null);
  const levels = useProgressStore((s) => s.levels);

  const allDestinations = GALAXIES.flatMap((g) => g.destinations);
  const visited = allDestinations.filter((d) => {
    const op = GALAXIES.find((g) => g.destinations.includes(d))?.operation;
    if (!op) return false;
    const key = `${op}-${d.levelNumber}`;
    return (levels[key]?.stars ?? 0) > 0;
  });

  return (
    <div className="min-h-screen flex flex-col bg-space">
      <NavHeader title={t('title')} backHref={`/${locale}/profile`} />

      <div className="px-4 py-3 text-center text-white/60 text-sm">
        {t('visited', { count: visited.length, total: allDestinations.length })}
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6">
        {GALAXIES.map((galaxy) => (
          <div key={galaxy.id} className="mb-6">
            <h3 className="font-heading font-bold text-white mb-3">{galaxy.name[locale]}</h3>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {galaxy.destinations.map((dest) => {
                const key = `${galaxy.operation}-${dest.levelNumber}`;
                const isVisited = (levels[key]?.stars ?? 0) > 0;
                return (
                  <motion.button
                    key={dest.levelNumber}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => isVisited && setSelectedDest(dest)}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-1 border transition-colors ${
                      isVisited
                        ? 'border-white/20 cursor-pointer hover:border-white/40'
                        : 'border-white/5 cursor-default opacity-40'
                    }`}
                    style={{
                      background: isVisited ? `${dest.color}22` : '#1E293B',
                    }}
                    aria-label={isVisited ? dest.name[locale] : t('notVisited')}
                    disabled={!isVisited}
                  >
                    <div className="text-2xl">{isVisited ? '🪐' : '❓'}</div>
                    <div className="text-[9px] text-white/50 truncate w-full text-center leading-tight mt-0.5">
                      {isVisited ? dest.name[locale] : '???'}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Detail modal */}
      <Modal open={!!selectedDest} onClose={() => setSelectedDest(null)} size="sm">
        <AnimatePresence mode="wait">
          {selectedDest && (
            <div className="p-6 text-center">
              <div className="text-5xl mb-3">🪐</div>
              <h3 className="font-heading font-bold text-white text-xl mb-2">
                {selectedDest.name[locale]}
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                {selectedDest.funFact[locale]}
              </p>
              <button
                onClick={() => setSelectedDest(null)}
                className="mt-4 text-white/40 text-xs hover:text-white"
              >
                Close
              </button>
            </div>
          )}
        </AnimatePresence>
      </Modal>
    </div>
  );
}
