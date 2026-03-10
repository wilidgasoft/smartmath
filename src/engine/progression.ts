import type { Operation, ProgressMap } from '@/lib/types';
import { OPERATION_ORDER } from '@/lib/constants';

export function isLevelUnlocked(
  operation: Operation,
  level: number,
  progress: ProgressMap
): boolean {
  // Level 1 of addition is always unlocked
  if (operation === 'addition' && level === 1) return true;

  // Within same operation: previous level must be completed (stars > 0)
  if (level > 1) {
    const prevKey = `${operation}-${level - 1}`;
    const prev = progress.get(prevKey);
    return prev !== undefined && prev.stars > 0;
  }

  // First level of a new operation: need level 10 of previous operation
  const opIndex = OPERATION_ORDER.indexOf(operation);
  if (opIndex === 0) return true;

  const prevOp = OPERATION_ORDER[opIndex - 1];
  const gateKey = `${prevOp}-10`;
  const gate = progress.get(gateKey);
  return gate !== undefined && gate.stars > 0;
}

export function getNextLevel(
  currentOp: Operation,
  currentLevel: number,
  progress: ProgressMap
): { operation: Operation; level: number } | null {
  // Try next level in same operation
  if (currentLevel < 20) {
    return { operation: currentOp, level: currentLevel + 1 };
  }

  // Try first level of next operation
  const opIndex = OPERATION_ORDER.indexOf(currentOp);
  if (opIndex < OPERATION_ORDER.length - 1) {
    const nextOp = OPERATION_ORDER[opIndex + 1];
    if (isLevelUnlocked(nextOp, 1, progress)) {
      return { operation: nextOp, level: 1 };
    }
  }

  return null; // Game complete!
}

/**
 * Returns how many levels are completed (stars > 0) for a given operation.
 */
export function getLevelsCompleted(operation: Operation, progress: ProgressMap): number {
  let count = 0;
  for (let level = 1; level <= 20; level++) {
    const key = `${operation}-${level}`;
    const prog = progress.get(key);
    if (prog && prog.stars > 0) count++;
  }
  return count;
}

/**
 * Returns the total stars earned for a given operation.
 */
export function getOperationStars(operation: Operation, progress: ProgressMap): number {
  let total = 0;
  for (let level = 1; level <= 20; level++) {
    const key = `${operation}-${level}`;
    const prog = progress.get(key);
    if (prog) total += prog.stars;
  }
  return total;
}

/**
 * Converts an array of LevelProgress into a ProgressMap (key = "operation-level").
 */
export function buildProgressMap(
  levelProgress: Array<{ operation: Operation; levelNumber: number; stars: number; bestAccuracy: number; bestTimeMs: number | null; attempts: number; completedAt: string | null }>
): ProgressMap {
  const map: ProgressMap = new Map();
  for (const lp of levelProgress) {
    const key = `${lp.operation}-${lp.levelNumber}`;
    map.set(key, {
      id: '',
      profileId: '',
      operation: lp.operation,
      levelNumber: lp.levelNumber,
      stars: lp.stars,
      bestAccuracy: lp.bestAccuracy,
      bestTimeMs: lp.bestTimeMs,
      attempts: lp.attempts,
      completedAt: lp.completedAt,
      lastPlayedAt: new Date().toISOString(),
    });
  }
  return map;
}
