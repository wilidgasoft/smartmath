import { describe, it, expect } from 'vitest';
import { calculateScore } from '../../src/engine/scoring';
import type { UserAnswer } from '../../src/lib/types';

function makeAnswers(correctCount: number, total = 20): UserAnswer[] {
  return Array.from({ length: total }, (_, i) => ({
    problemId: `p-${i}`,
    userAnswer: i < correctCount ? 42 : 99,
    isCorrect: i < correctCount,
    timeMs: 1500,
    hintUsed: false,
    attemptNumber: 1,
  }));
}

describe('calculateScore', () => {
  it('0 correct → 0 stars, not passed', () => {
    const result = calculateScore(makeAnswers(0), 60000, 'medium');
    expect(result.stars).toBe(0);
    expect(result.passed).toBe(false);
    expect(result.accuracy).toBe(0);
  });

  it('16/20 (80%) → 1 star, passed', () => {
    const result = calculateScore(makeAnswers(16), 60000, 'medium');
    expect(result.stars).toBe(1);
    expect(result.passed).toBe(true);
  });

  it('15/20 (75%) → 0 stars, not passed', () => {
    const result = calculateScore(makeAnswers(15), 60000, 'medium');
    expect(result.stars).toBe(0);
    expect(result.passed).toBe(false);
  });

  it('18/20 (90%) → 2 stars', () => {
    const result = calculateScore(makeAnswers(18), 60000, 'medium');
    expect(result.stars).toBe(2);
    expect(result.passed).toBe(true);
  });

  it('20/20 (100%) → 3 stars', () => {
    const result = calculateScore(makeAnswers(20), 60000, 'medium');
    expect(result.stars).toBe(3);
  });

  it('20/20 + time bonus → 4 stars for young (60s limit)', () => {
    const result = calculateScore(makeAnswers(20), 30000, 'young'); // 30s < 60s limit
    expect(result.stars).toBe(4);
    expect(result.timeBonus).toBe(true);
  });

  it('20/20 but over time → 3 stars (no bonus)', () => {
    const result = calculateScore(makeAnswers(20), 90000, 'young'); // 90s > 60s limit
    expect(result.stars).toBe(3);
    expect(result.timeBonus).toBe(false);
  });

  it('time bonus thresholds: medium 40s', () => {
    const under = calculateScore(makeAnswers(20), 35000, 'medium');
    const over = calculateScore(makeAnswers(20), 50000, 'medium');
    expect(under.timeBonus).toBe(true);
    expect(over.timeBonus).toBe(false);
  });

  it('time bonus thresholds: advanced 30s', () => {
    const under = calculateScore(makeAnswers(20), 25000, 'advanced');
    const over = calculateScore(makeAnswers(20), 35000, 'advanced');
    expect(under.timeBonus).toBe(true);
    expect(over.timeBonus).toBe(false);
  });

  it('handles empty answers array', () => {
    const result = calculateScore([], 0, 'medium');
    expect(result.totalCorrect).toBe(0);
    expect(result.passed).toBe(false);
  });

  it('accuracy is correct percentage', () => {
    const result = calculateScore(makeAnswers(16, 20), 60000, 'medium');
    expect(result.accuracy).toBeCloseTo(80);
  });
});
