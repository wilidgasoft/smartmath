import type { AgeGroup, ScoreResult, UserAnswer } from '@/lib/types';
import { PASS_THRESHOLD, STAR_THRESHOLDS, TIME_BONUS_MS } from '@/lib/constants';

export function calculateScore(
  answers: UserAnswer[],
  totalTimeMs: number,
  ageGroup: AgeGroup
): ScoreResult {
  if (answers.length === 0) {
    return {
      totalCorrect: 0,
      totalWrong: 0,
      accuracy: 0,
      stars: 0,
      passed: false,
      timeBonus: false,
      totalTimeMs,
    };
  }

  const totalCorrect = answers.filter((a) => a.isCorrect).length;
  const totalWrong = answers.length - totalCorrect;
  const accuracy = (totalCorrect / answers.length) * 100;
  const accuracyRate = totalCorrect / answers.length;
  const passed = accuracyRate >= PASS_THRESHOLD;

  let stars = 0;
  if (accuracyRate >= STAR_THRESHOLDS[3]) {
    stars = 3;
  } else if (accuracyRate >= STAR_THRESHOLDS[2]) {
    stars = 2;
  } else if (accuracyRate >= STAR_THRESHOLDS[1]) {
    stars = 1;
  }

  const timeBonus = passed && totalTimeMs > 0 && totalTimeMs <= TIME_BONUS_MS[ageGroup];
  if (timeBonus) stars = 4;

  return { totalCorrect, totalWrong, accuracy, stars, passed, timeBonus, totalTimeMs };
}
