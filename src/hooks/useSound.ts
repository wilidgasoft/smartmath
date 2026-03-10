'use client';

import { useRef, useCallback } from 'react';
import { useSettingsStore } from '@/store/settingsStore';
import type { SoundEffect } from '@/store/audioStore';

const SOUND_PATHS: Record<SoundEffect, string> = {
  correct: '/sounds/effects/correct.mp3',
  wrong: '/sounds/effects/wrong.mp3',
  launch: '/sounds/effects/launch.mp3',
  landing: '/sounds/effects/landing.mp3',
  click: '/sounds/effects/click.mp3',
  'streak-3': '/sounds/effects/streak-3.mp3',
  'streak-5': '/sounds/effects/streak-5.mp3',
  'streak-10': '/sounds/effects/streak-10.mp3',
  badge: '/sounds/effects/badge.mp3',
  countdown: '/sounds/effects/countdown.mp3',
  star: '/sounds/effects/star.mp3',
};

export function useSound() {
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const audioRefs = useRef<Map<SoundEffect, HTMLAudioElement>>(new Map());

  // Preload sounds on first interaction
  const preload = useCallback(() => {
    Object.entries(SOUND_PATHS).forEach(([key, path]) => {
      if (!audioRefs.current.has(key as SoundEffect)) {
        const audio = new Audio(path);
        audio.preload = 'auto';
        audioRefs.current.set(key as SoundEffect, audio);
      }
    });
  }, []);

  const playEffect = useCallback(
    (effect: SoundEffect) => {
      if (!soundEnabled) return;
      preload();
      const audio = audioRefs.current.get(effect);
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {
          // Autoplay blocked — ignore, user didn't interact yet
        });
      }
    },
    [soundEnabled, preload]
  );

  const playCorrect = useCallback(() => playEffect('correct'), [playEffect]);
  const playWrong = useCallback(() => playEffect('wrong'), [playEffect]);
  const playLaunch = useCallback(() => playEffect('launch'), [playEffect]);
  const playClick = useCallback(() => playEffect('click'), [playEffect]);
  const playBadge = useCallback(() => playEffect('badge'), [playEffect]);
  const playCountdown = useCallback(() => playEffect('countdown'), [playEffect]);

  const playStreak = useCallback(
    (streak: number) => {
      if (streak >= 10) playEffect('streak-10');
      else if (streak >= 5) playEffect('streak-5');
      else if (streak >= 3) playEffect('streak-3');
    },
    [playEffect]
  );

  return { playCorrect, playWrong, playLaunch, playClick, playBadge, playCountdown, playStreak, playEffect };
}
