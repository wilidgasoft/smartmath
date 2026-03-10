import type { MathProblem } from '@/lib/types';
import { generateProblems } from './problems';

interface ProblemHistoryEntry {
  problemText: string;
  isCorrect: boolean;
  operation: 'addition' | 'subtraction' | 'multiplication' | 'division';
  levelNumber: number;
}

/**
 * Analyze problem history and return the problems with the highest error rate.
 * Used for the review/practice mode.
 */
export function getWeakProblems(
  problemHistory: ProblemHistoryEntry[],
  limit = 20
): MathProblem[] {
  // Group by problem text
  const stats = new Map<
    string,
    { total: number; wrong: number; operation: ProblemHistoryEntry['operation']; level: number }
  >();

  for (const log of problemHistory) {
    const key = log.problemText;
    const existing = stats.get(key) ?? {
      total: 0,
      wrong: 0,
      operation: log.operation,
      level: log.levelNumber,
    };
    existing.total++;
    if (!log.isCorrect) existing.wrong++;
    stats.set(key, existing);
  }

  // Sort by error rate descending
  const sorted = Array.from(stats.entries())
    .filter(([, s]) => s.wrong > 0)
    .sort(([, a], [, b]) => b.wrong / b.total - a.wrong / a.total);

  // Reconstruct MathProblem objects from the problem text keys
  const weakProblems: MathProblem[] = [];
  for (const [, stat] of sorted.slice(0, limit)) {
    const levelProblems = generateProblems(stat.operation, stat.level);
    // Find the matching problem by display text
    const match = levelProblems.find(
      (p) =>
        p.displayText ===
        // Try to match — fallback to first problem if not found
        sorted[0][0]
    );
    if (match) weakProblems.push(match);
  }

  return weakProblems;
}
