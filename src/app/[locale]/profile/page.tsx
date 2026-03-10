'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { NavHeader } from '@/components/layout/NavHeader';
import { ProgressBar, StarRating, Card, Button } from '@/components/ui';
import { useProgressStore } from '@/store/progressStore';
import { buildProgressMap, getLevelsCompleted, getOperationStars } from '@/engine/progression';
import { GALAXIES, BADGE_KEYS, OPERATION_ORDER } from '@/lib/constants';
import { formatTime } from '@/lib/utils';
import type { Locale, Operation } from '@/lib/types';

export default function ProfilePage() {
  const t = useTranslations('profile');
  const tRanks = useTranslations('ranks');
  const tBadges = useTranslations('badges');
  const locale = useLocale() as Locale;
  const router = useRouter();
  const { data: session } = useSession();

  const levels = useProgressStore((s) => s.levels);
  const badges = useProgressStore((s) => s.badges);
  const totalStars = useProgressStore((s) => s.totalStars);
  const astronautRank = useProgressStore((s) => s.astronautRank);
  const longestStreak = useProgressStore((s) => s.longestStreak);

  const progress = buildProgressMap(
    Object.entries(levels).map(([key, v]) => {
      const [op, lStr] = key.split('-');
      return { operation: op as Operation, levelNumber: parseInt(lStr, 10), ...v };
    })
  );

  const totalProblems = Object.values(levels).reduce((sum, l) => sum + (l.attempts * 20), 0);
  const totalPlayTime = Object.values(levels).reduce(
    (sum, l) => sum + (l.bestTimeMs ?? 0) * l.attempts,
    0
  );

  return (
    <div className="min-h-screen flex flex-col bg-space">
      <NavHeader
        title={t('title')}
        backHref={`/${locale}/galaxy`}
        rightContent={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/${locale}/settings`)}
          >
            ⚙️
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-lg mx-auto w-full space-y-4">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="text-center py-6">
            <div className="text-6xl mb-3">👨‍🚀</div>
            <h2 className="font-heading font-bold text-white text-2xl">
              {session?.user?.name ?? 'Astronaut'}
            </h2>
            <p className="text-white/60 text-sm">
              {t('rank', { rank: tRanks(astronautRank) })}
            </p>
            <div className="flex justify-center mt-2">
              <StarRating stars={Math.min(totalStars / 20, 4)} maxStars={4} size="md" />
            </div>
            <p className="text-star-filled font-bold text-xl mt-1">
              {t('totalStars', { count: totalStars })}
            </p>
          </Card>
        </motion.div>

        {/* Progress */}
        <Card>
          <h3 className="font-heading font-bold text-white mb-3">📊 {t('progress')}</h3>
          <div className="space-y-3">
            {OPERATION_ORDER.map((op) => {
              const completed = getLevelsCompleted(op, progress);
              const stars = getOperationStars(op, progress);
              const galaxy = GALAXIES.find((g) => g.operation === op);
              return (
                <div key={op}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/70">{galaxy?.name[locale]}</span>
                    <span className="text-star-filled text-xs">⭐ {stars}</span>
                  </div>
                  <ProgressBar value={(completed / 20) * 100} height="sm" />
                  <p className="text-white/40 text-xs mt-0.5">{completed}/20 levels</p>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Stats */}
        <Card>
          <h3 className="font-heading font-bold text-white mb-3">📈 {t('stats')}</h3>
          <div className="grid grid-cols-2 gap-3">
            <StatItem label={t('problemsSolved')} value={totalProblems.toLocaleString()} />
            <StatItem label={t('bestStreak')} value={`${longestStreak} 🔥`} />
            <StatItem label={t('playTime')} value={formatTime(totalPlayTime)} />
          </div>
        </Card>

        {/* Badges */}
        <Card>
          <h3 className="font-heading font-bold text-white mb-3">
            🏅 {t('badges')} ({badges.length}/{BADGE_KEYS.length})
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {BADGE_KEYS.map((key) => {
              const earned = badges.includes(key);
              return (
                <motion.div
                  key={key}
                  whileHover={{ scale: 1.05 }}
                  className={`rounded-xl p-2 text-center text-xs ${
                    earned
                      ? 'bg-star-filled/20 border border-star-filled/40'
                      : 'bg-white/5 border border-white/10 opacity-50'
                  }`}
                  title={tBadges(key)}
                >
                  <div className="text-2xl">{earned ? '🏅' : '🔒'}</div>
                  <div className="text-white/60 text-[10px] leading-tight mt-0.5 truncate">
                    {tBadges(key)}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Card>

        {/* Account */}
        {session && (
          <Card>
            <h3 className="font-heading font-bold text-white mb-3">👤 Account</h3>
            <p className="text-white/60 text-sm mb-3">{session.user?.email}</p>
            <Button variant="danger" size="sm" onClick={() => signOut()} className="w-full">
              Sign Out
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/5 rounded-xl p-3 text-center">
      <div className="font-bold text-white text-lg">{value}</div>
      <div className="text-white/50 text-xs">{label}</div>
    </div>
  );
}
