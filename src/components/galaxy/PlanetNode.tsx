'use client';

import { motion } from 'framer-motion';
import { StarRating } from '@/components/ui';
import type { DestinationInfo, LocalLevelProgress } from '@/lib/types';
import { cn } from '@/lib/utils';
import type { Locale } from '@/lib/types';

interface PlanetNodeProps {
  destination: DestinationInfo;
  progress?: LocalLevelProgress;
  isUnlocked: boolean;
  isCurrent: boolean;
  locale: Locale;
  onClick?: () => void;
}

export function PlanetNode({
  destination,
  progress,
  isUnlocked,
  isCurrent,
  locale,
  onClick,
}: PlanetNodeProps) {
  const isCompleted = (progress?.stars ?? 0) > 0;

  return (
    <div className="flex flex-col items-center gap-1">
      <motion.button
        onClick={onClick}
        disabled={!isUnlocked}
        whileHover={{ scale: isUnlocked ? 1.1 : 1 }}
        whileTap={{ scale: isUnlocked ? 0.95 : 1 }}
        animate={isCurrent ? { scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 2 } } : {}}
        aria-label={`Level ${destination.levelNumber}: ${destination.name[locale]}${!isUnlocked ? ' (locked)' : ''}`}
        className={cn(
          'w-14 h-14 rounded-full flex items-center justify-center font-heading font-bold text-sm border-2 transition-colors relative',
          isCompleted
            ? 'border-star-filled text-white cursor-pointer'
            : isCurrent
              ? 'border-primary text-white cursor-pointer animate-pulse-slow'
              : isUnlocked
                ? 'border-white/30 text-white cursor-pointer hover:border-white/60'
                : 'border-white/10 text-white/30 cursor-not-allowed'
        )}
        style={{
          backgroundColor: isCompleted ? `${destination.color}44` : isUnlocked ? '#1E293B' : '#0F172A',
          boxShadow: isCurrent ? `0 0 20px ${destination.color}88` : isCompleted ? `0 0 10px ${destination.color}44` : 'none',
        }}
      >
        {!isUnlocked ? '🔒' : <span style={{ fontSize: '1.5rem' }}>{getEmoji(destination)}</span>}
      </motion.button>

      {/* Level number */}
      <span className={cn('text-xs font-body', isUnlocked ? 'text-white/70' : 'text-white/30')}>
        {destination.levelNumber}
      </span>

      {/* Stars */}
      {isCompleted && (
        <StarRating stars={progress!.stars} maxStars={4} size="sm" />
      )}
    </div>
  );
}

function getEmoji(dest: DestinationInfo): string {
  const emojiMap: Record<string, string> = {
    station: '🛸',
    moon: '🌙',
    planet: getPlanetEmoji(dest.imageKey),
    star: '⭐',
    nebula: '🌌',
    galaxy: '🌀',
    object: '💫',
    cluster: '✨',
  };
  return emojiMap[dest.type] ?? '🪐';
}

function getPlanetEmoji(imageKey: string): string {
  const map: Record<string, string> = {
    venus: '🟡',
    mercury: '⚪',
    mars: '🔴',
    jupiter: '🟠',
    saturn: '🪐',
    uranus: '🔵',
    neptune: '💙',
    pluto: '🟣',
    ceres: '⚫',
  };
  return map[imageKey] ?? '🪐';
}
