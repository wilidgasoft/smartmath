import type { MathProblem, Operation } from '@/lib/types';
import { OPERATION_SYMBOLS, PROBLEMS_PER_LEVEL } from '@/lib/constants';
import { generateChoices } from './distractors';

// ── Core dispatcher ──

export function generateProblems(
  operation: Operation,
  level: number,
  multipleChoice = false
): MathProblem[] {
  let problems: MathProblem[];

  switch (operation) {
    case 'addition':
      problems = generateAddition(level);
      break;
    case 'subtraction':
      problems = generateSubtraction(level);
      break;
    case 'multiplication':
      problems = generateMultiplication(level);
      break;
    case 'division':
      problems = generateDivision(level);
      break;
  }

  if (multipleChoice) {
    return problems.map((p) => ({
      ...p,
      choices: generateChoices(p.correctAnswer, operation),
    }));
  }

  return problems;
}

// ── Addition: Level N → N + M for M = 1..20 ──

export function generateAddition(level: number): MathProblem[] {
  const problems: MathProblem[] = [];
  for (let m = 1; m <= PROBLEMS_PER_LEVEL; m++) {
    problems.push({
      id: `add-${level}-${m}`,
      operand1: level,
      operand2: m,
      operation: 'addition',
      correctAnswer: level + m,
      displayText: `${level} ${OPERATION_SYMBOLS.addition} ${m}`,
    });
  }
  return problems;
}

// ── Subtraction: Level N → (N + i) − N = i for i = 0..19 ──
// Results are always 0–19 (never negative)

export function generateSubtraction(level: number): MathProblem[] {
  const problems: MathProblem[] = [];
  for (let i = 0; i < PROBLEMS_PER_LEVEL; i++) {
    const minuend = level + i;
    problems.push({
      id: `sub-${level}-${i}`,
      operand1: minuend,
      operand2: level,
      operation: 'subtraction',
      correctAnswer: i,
      displayText: `${minuend} ${OPERATION_SYMBOLS.subtraction} ${level}`,
    });
  }
  return problems;
}

// ── Multiplication: Level N → N × M for M = 1..20 ──

export function generateMultiplication(level: number): MathProblem[] {
  const problems: MathProblem[] = [];
  for (let m = 1; m <= PROBLEMS_PER_LEVEL; m++) {
    problems.push({
      id: `mul-${level}-${m}`,
      operand1: level,
      operand2: m,
      operation: 'multiplication',
      correctAnswer: level * m,
      displayText: `${level} ${OPERATION_SYMBOLS.multiplication} ${m}`,
    });
  }
  return problems;
}

// ── Division: Level N → (N × M) ÷ N = M for M = 1..20 ──
// All answers are whole numbers

export function generateDivision(level: number): MathProblem[] {
  const problems: MathProblem[] = [];
  for (let m = 1; m <= PROBLEMS_PER_LEVEL; m++) {
    const dividend = level * m;
    problems.push({
      id: `div-${level}-${m}`,
      operand1: dividend,
      operand2: level,
      operation: 'division',
      correctAnswer: m,
      displayText: `${dividend} ${OPERATION_SYMBOLS.division} ${level}`,
    });
  }
  return problems;
}
