import { describe, it, expect } from 'vitest';
import { isLevelUnlocked, getNextLevel, buildProgressMap } from '../../src/engine/progression';
import type { LevelProgress } from '../../src/lib/types';

function makeProgress(entries: { operation: string; level: number; stars: number }[]) {
  return buildProgressMap(
    entries.map((e) => ({
      operation: e.operation as LevelProgress['operation'],
      levelNumber: e.level,
      stars: e.stars,
      bestAccuracy: 80,
      bestTimeMs: null,
      attempts: 1,
      completedAt: e.stars > 0 ? new Date().toISOString() : null,
    }))
  );
}

describe('isLevelUnlocked', () => {
  it('addition level 1 is always unlocked', () => {
    expect(isLevelUnlocked('addition', 1, new Map())).toBe(true);
  });

  it('addition level 2 requires addition level 1 completed', () => {
    const noProgress = new Map();
    expect(isLevelUnlocked('addition', 2, noProgress)).toBe(false);

    const withLevel1 = makeProgress([{ operation: 'addition', level: 1, stars: 1 }]);
    expect(isLevelUnlocked('addition', 2, withLevel1)).toBe(true);
  });

  it('subtraction level 1 requires addition level 10', () => {
    const noProgress = new Map();
    expect(isLevelUnlocked('subtraction', 1, noProgress)).toBe(false);

    const withAdd10 = makeProgress([{ operation: 'addition', level: 10, stars: 2 }]);
    expect(isLevelUnlocked('subtraction', 1, withAdd10)).toBe(true);
  });

  it('multiplication level 1 requires subtraction level 10', () => {
    const noSub10 = makeProgress([{ operation: 'addition', level: 10, stars: 2 }]);
    expect(isLevelUnlocked('multiplication', 1, noSub10)).toBe(false);

    const withSub10 = makeProgress([
      { operation: 'addition', level: 10, stars: 2 },
      { operation: 'subtraction', level: 10, stars: 1 },
    ]);
    expect(isLevelUnlocked('multiplication', 1, withSub10)).toBe(true);
  });

  it('division level 1 requires multiplication level 10', () => {
    const withMul10 = makeProgress([{ operation: 'multiplication', level: 10, stars: 1 }]);
    expect(isLevelUnlocked('division', 1, withMul10)).toBe(true);
  });

  it('higher levels within same operation require previous completion', () => {
    const withLevel9 = makeProgress([{ operation: 'multiplication', level: 9, stars: 2 }]);
    expect(isLevelUnlocked('multiplication', 10, withLevel9)).toBe(true);
    expect(isLevelUnlocked('multiplication', 11, withLevel9)).toBe(false);
  });
});

describe('getNextLevel', () => {
  it('within a galaxy: returns next level number', () => {
    const progress = makeProgress([{ operation: 'addition', level: 5, stars: 2 }]);
    const next = getNextLevel('addition', 5, progress);
    expect(next).toEqual({ operation: 'addition', level: 6 });
  });

  it('at level 20 of addition: returns subtraction level 1 if unlocked', () => {
    const progress = makeProgress([
      { operation: 'addition', level: 10, stars: 3 },
      { operation: 'addition', level: 20, stars: 1 },
    ]);
    const next = getNextLevel('addition', 20, progress);
    expect(next).toEqual({ operation: 'subtraction', level: 1 });
  });

  it('returns null when division level 20 is completed (game done)', () => {
    const progress = makeProgress([{ operation: 'division', level: 20, stars: 1 }]);
    const next = getNextLevel('division', 20, progress);
    expect(next).toBeNull();
  });
});

describe('buildProgressMap', () => {
  it('creates a map with correct keys', () => {
    const map = makeProgress([
      { operation: 'addition', level: 1, stars: 3 },
      { operation: 'multiplication', level: 5, stars: 2 },
    ]);
    expect(map.has('addition-1')).toBe(true);
    expect(map.has('multiplication-5')).toBe(true);
    expect(map.has('subtraction-1')).toBe(false);
  });

  it('stores correct star counts', () => {
    const map = makeProgress([{ operation: 'addition', level: 3, stars: 4 }]);
    expect(map.get('addition-3')?.stars).toBe(4);
  });
});
