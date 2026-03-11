import type { MathProblem, Operation } from '@/lib/types';
import { OPERATION_SYMBOLS, PROBLEMS_PER_LEVEL } from '@/lib/constants';
import { generateChoices } from './distractors';

// Fisher-Yates shuffle — random order to avoid predictable sequences
function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

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

// ── Addition: Level N → N + M for M = 1..20 (random order) ──

export function generateAddition(level: number): MathProblem[] {
  const ms = shuffle([...Array(PROBLEMS_PER_LEVEL)].map((_, i) => i + 1));
  return ms.map((m, idx) => ({
    id: `add-${level}-${m}-${idx}`,
    operand1: level,
    operand2: m,
    operation: 'addition',
    correctAnswer: level + m,
    displayText: `${level} ${OPERATION_SYMBOLS.addition} ${m}`,
  }));
}

// ── Subtraction: Level N → (N + i) − N = i for i = 0..19 (random order) ──
// Results are always 0–19 (never negative)

export function generateSubtraction(level: number): MathProblem[] {
  const is_ = shuffle([...Array(PROBLEMS_PER_LEVEL)].map((_, i) => i));
  return is_.map((i, idx) => {
    const minuend = level + i;
    return {
      id: `sub-${level}-${i}-${idx}`,
      operand1: minuend,
      operand2: level,
      operation: 'subtraction',
      correctAnswer: i,
      displayText: `${minuend} ${OPERATION_SYMBOLS.subtraction} ${level}`,
    };
  });
}

// ── Multiplication: Level N → N × M for M = 1..20 (random order) ──

export function generateMultiplication(level: number): MathProblem[] {
  const ms = shuffle([...Array(PROBLEMS_PER_LEVEL)].map((_, i) => i + 1));
  return ms.map((m, idx) => ({
    id: `mul-${level}-${m}-${idx}`,
    operand1: level,
    operand2: m,
    operation: 'multiplication',
    correctAnswer: level * m,
    displayText: `${level} ${OPERATION_SYMBOLS.multiplication} ${m}`,
  }));
}

// ── Division: Level N → (N × M) ÷ N = M for M = 1..20 (random order) ──
// All answers are whole numbers

export function generateDivision(level: number): MathProblem[] {
  const ms = shuffle([...Array(PROBLEMS_PER_LEVEL)].map((_, i) => i + 1));
  return ms.map((m, idx) => {
    const dividend = level * m;
    return {
      id: `div-${level}-${m}-${idx}`,
      operand1: dividend,
      operand2: level,
      operation: 'division',
      correctAnswer: m,
      displayText: `${dividend} ${OPERATION_SYMBOLS.division} ${level}`,
    };
  });
}
