import type { Operation } from '@/lib/types';

/**
 * Generate 3 plausible but incorrect distractors for a given correct answer.
 * Distractors are always non-negative and never equal to the correct answer.
 */
export function generateDistractors(correctAnswer: number, operation: Operation): number[] {
  const distractors = new Set<number>();

  // Strategy 1: Close neighbors (±1, ±2)
  const offsets = [-2, -1, 1, 2];
  for (const offset of offsets) {
    const d = correctAnswer + offset;
    if (d >= 0 && d !== correctAnswer) {
      distractors.add(d);
    }
  }

  // Strategy 2: Operation-specific common mistakes
  if (operation === 'multiplication' || operation === 'division') {
    const pct15 = Math.max(1, Math.floor(correctAnswer * 0.15));
    const d1 = correctAnswer + pct15;
    const d2 = correctAnswer - pct15;
    if (d1 !== correctAnswer) distractors.add(d1);
    if (d2 >= 0 && d2 !== correctAnswer) distractors.add(d2);
  }

  if (operation === 'subtraction') {
    // Common mistake: adding instead of subtracting
    const d = correctAnswer + 2;
    if (d !== correctAnswer) distractors.add(d);
  }

  // Strategy 3: Fill with random nearby values if needed
  let attempts = 0;
  while (distractors.size < 6 && attempts < 50) {
    attempts++;
    const range = Math.max(5, Math.floor(correctAnswer * 0.3));
    const d = correctAnswer + Math.floor(Math.random() * range * 2) - range;
    if (d >= 0 && d !== correctAnswer) {
      distractors.add(d);
    }
  }

  // Return exactly 3, removing any that are too close to duplicates
  const sorted = Array.from(distractors).filter((d) => d !== correctAnswer);
  return sorted.slice(0, 3);
}

/**
 * Returns 4 shuffled choices: [correct, ...3 distractors]
 */
export function generateChoices(correctAnswer: number, operation: Operation): number[] {
  const distractors = generateDistractors(correctAnswer, operation);
  // Ensure we always have exactly 4 choices
  while (distractors.length < 3) {
    let fallback = correctAnswer + distractors.length + 1;
    while (distractors.includes(fallback) || fallback === correctAnswer) {
      fallback++;
    }
    distractors.push(fallback);
  }
  const choices = [correctAnswer, ...distractors.slice(0, 3)];
  // Fisher-Yates shuffle
  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [choices[i], choices[j]] = [choices[j], choices[i]];
  }
  return choices;
}
