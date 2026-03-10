'use client';

import { useCallback, useEffect } from 'react';
import { useGameStore, selectCurrentProblem, selectProgressCurrent, selectProgressTotal } from '@/store/gameStore';
import { useProgressStore } from '@/store/progressStore';
import { useSettingsStore } from '@/store/settingsStore';
import { generateProblems } from '@/engine/problems';
import { calculateScore } from '@/engine/scoring';
import { generateHint } from '@/engine/hints';
import type { Operation, LevelResult } from '@/lib/types';
import { GALAXIES } from '@/lib/constants';

export function useGame(operation: Operation, levelNumber: number) {
  const store = useGameStore();
  // Only subscribe to the fields we actually read reactively
  const { inputMode, ageGroup } = useSettingsStore();

  const isMultipleChoice = inputMode === 'multiple_choice' || (inputMode === 'auto' && ageGroup === 'young');

  // Initialize on mount
  useEffect(() => {
    const problems = generateProblems(operation, levelNumber, isMultipleChoice);
    store.startLevel(operation, levelNumber, problems);
  }, [operation, levelNumber]); // eslint-disable-line react-hooks/exhaustive-deps

  const currentProblem = useGameStore(selectCurrentProblem);
  const progressCurrent = useGameStore(selectProgressCurrent);
  const progressTotal = useGameStore(selectProgressTotal);
  const progress = { current: progressCurrent, total: progressTotal };

  const submitAnswer = useCallback(
    (answer: number, timeMs: number) => {
      return store.submitAnswer(answer, timeMs);
    },
    [store]
  );

  const getHint = useCallback(() => {
    if (!currentProblem || store.hintsRemaining <= 0) return null;
    store.useHint();
    return generateHint(currentProblem);
  }, [currentProblem, store]);

  const advance = useCallback(() => {
    store.nextProblem();
  }, [store]);

  const getResult = useCallback((): LevelResult | null => {
    if (store.gameState !== 'complete') return null;
    const elapsed = Date.now() - store.startedAt;
    const scoreResult = calculateScore(store.answers, elapsed, ageGroup);

    // Use getState() to avoid subscribing: calling progressStore actions inside a
    // useCallback that lists progressStore as a dep causes an update → dep change →
    // callback recreated → useEffect re-fires → infinite loop.
    const ps = useProgressStore.getState();

    ps.updateLevelProgress(operation, levelNumber, {
      stars: scoreResult.stars,
      bestAccuracy: scoreResult.accuracy,
      bestTimeMs: scoreResult.passed ? scoreResult.totalTimeMs : null,
      attempts: 1,
      completedAt: scoreResult.passed ? new Date().toISOString() : null,
    });

    const newBadges: string[] = [];
    if (levelNumber === 1 && operation === 'addition' && !ps.badges.includes('first_flight')) {
      ps.earnBadge('first_flight');
      newBadges.push('first_flight');
    }
    if (scoreResult.stars === 4 && !ps.badges.includes('speed_demon')) {
      ps.earnBadge('speed_demon');
      newBadges.push('speed_demon');
    }
    if (scoreResult.accuracy === 100 && !ps.badges.includes('perfect_launch')) {
      ps.earnBadge('perfect_launch');
      newBadges.push('perfect_launch');
    }

    ps.addPendingSync({
      type: 'session_complete',
      data: {
        operation,
        levelNumber,
        stars: scoreResult.stars,
        bestAccuracy: scoreResult.accuracy,
        bestTimeMs: scoreResult.totalTimeMs,
        passed: scoreResult.passed,
        maxStreak: store.maxStreak,
        totalTimeMs: elapsed,
        totalProblems: store.answers.length,
      },
    });

    return {
      ...scoreResult,
      operation,
      levelNumber,
      maxStreak: store.maxStreak,
      newBadges,
    };
  }, [store, ageGroup, operation, levelNumber]); // progressStore intentionally omitted

  const getDestination = useCallback(() => {
    const galaxy = GALAXIES.find((g) => g.operation === operation);
    return galaxy?.destinations.find((d) => d.levelNumber === levelNumber) ?? null;
  }, [operation, levelNumber]);

  return {
    currentProblem,
    progress,
    gameState: store.gameState,
    streak: store.streak,
    hintsRemaining: store.hintsRemaining,
    isMultipleChoice,
    submitAnswer,
    getHint,
    advance,
    getResult,
    getDestination,
    pauseGame: store.pauseGame,
    resumeGame: store.resumeGame,
    resetLevel: store.resetLevel,
    setGameState: store.setGameState,
  };
}
