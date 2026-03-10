'use client';

import { motion, useAnimationControls } from 'framer-motion';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SpaceshipProps {
  progress: number; // 0-100
  streak?: number;
  onWrongAnimation?: boolean;
  color?: string;
  className?: string;
}

function getFlameColor(streak: number): string {
  if (streak >= 10) return '#A855F7'; // purple supernova
  if (streak >= 5) return '#EF4444';  // red turbo
  if (streak >= 3) return '#F97316';  // orange fire
  return '#F59E0B';                   // default amber
}

export function Spaceship({ progress, streak = 0, onWrongAnimation = false, color = '#3B82F6', className }: SpaceshipProps) {
  const controls = useAnimationControls();
  const clampedProgress = Math.min(100, Math.max(0, progress));

  useEffect(() => {
    if (onWrongAnimation) {
      controls.start({
        x: [0, -8, 8, -6, 6, -4, 4, 0],
        transition: { duration: 0.4, ease: 'easeInOut' },
      });
    }
  }, [onWrongAnimation, controls]);

  const flameColor = getFlameColor(streak);
  const flameSize = 1 + Math.min(streak * 0.1, 1);

  return (
    <motion.div
      className={cn('absolute', className)}
      style={{ left: `${clampedProgress}%`, transform: 'translateX(-50%)' }}
      animate={{ left: `${clampedProgress}%` }}
      transition={{ type: 'spring', stiffness: 60, damping: 15 }}
    >
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.div animate={controls}>
          {/* Engine trail */}
          <motion.div
            className="absolute right-full top-1/2 -translate-y-1/2"
            style={{ width: 40 * flameSize, height: 12 * flameSize }}
            animate={{ scaleX: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            <svg viewBox="0 0 40 12" className="w-full h-full" aria-hidden="true">
              <defs>
                <linearGradient id="trail" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={flameColor} stopOpacity="0" />
                  <stop offset="100%" stopColor={flameColor} stopOpacity="0.8" />
                </linearGradient>
              </defs>
              <ellipse cx="20" cy="6" rx="20" ry="6" fill="url(#trail)" />
            </svg>
          </motion.div>

          {/* Rocket SVG */}
          <svg
            width="56"
            height="56"
            viewBox="0 0 56 56"
            fill="none"
            aria-label="Spaceship"
            role="img"
          >
            {/* Body */}
            <ellipse cx="28" cy="26" rx="10" ry="18" fill={color} />
            {/* Nose cone */}
            <path d="M18 20 L28 4 L38 20 Z" fill={color} />
            {/* Window */}
            <circle cx="28" cy="22" r="5" fill="#E0F2FE" />
            <circle cx="28" cy="22" r="3" fill="#BAE6FD" />
            {/* Left fin */}
            <path d="M18 36 L12 44 L18 40 Z" fill={color} opacity="0.8" />
            {/* Right fin */}
            <path d="M38 36 L44 44 L38 40 Z" fill={color} opacity="0.8" />
            {/* Engines */}
            <rect x="21" y="42" width="6" height="6" rx="2" fill="#1E293B" />
            <rect x="29" y="42" width="6" height="6" rx="2" fill="#1E293B" />
            {/* Streak glow */}
            {streak >= 3 && (
              <ellipse cx="28" cy="44" rx="12" ry="4" fill={flameColor} opacity="0.4" />
            )}
          </svg>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
