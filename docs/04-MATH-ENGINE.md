# 04 - Math Engine

## 1. Overview

The math engine is a collection of pure functions that generate problems, validate answers, compute scores, and manage level progression. It runs entirely on the client with zero server dependency.

## 2. Problem Generation

### 2.1 Core Function

```typescript
function generateProblems(operation: Operation, level: number): MathProblem[]
```

Returns an array of 20 `MathProblem` objects for the given operation and level.

### 2.2 Addition Problems

**Rule:** Level N → `N + M` for M = 1, 2, 3, ..., 20

```typescript
function generateAddition(level: number): MathProblem[] {
  const problems: MathProblem[] = [];
  for (let m = 1; m <= 20; m++) {
    problems.push({
      id: `add-${level}-${m}`,
      operand1: level,
      operand2: m,
      operation: 'addition',
      correctAnswer: level + m,
      displayText: `${level} + ${m}`,
    });
  }
  return problems;
}
```

**Examples:**
| Level | Problem Set | Answer Range |
|-------|-------------|-------------|
| 1 | 1+1 through 1+20 | 2 to 21 |
| 5 | 5+1 through 5+20 | 6 to 25 |
| 10 | 10+1 through 10+20 | 11 to 30 |
| 20 | 20+1 through 20+20 | 21 to 40 |

### 2.3 Subtraction Problems

**Rule:** Level N → `(N + i) - N = i` for i = 0, 1, 2, ..., 19

This means: subtract N from numbers N through N+19. Results are always 0 through 19 (never negative).

```typescript
function generateSubtraction(level: number): MathProblem[] {
  const problems: MathProblem[] = [];
  for (let i = 0; i < 20; i++) {
    const minuend = level + i;  // the number being subtracted from
    problems.push({
      id: `sub-${level}-${i}`,
      operand1: minuend,
      operand2: level,
      operation: 'subtraction',
      correctAnswer: i,
      displayText: `${minuend} - ${level}`,
    });
  }
  return problems;
}
```

**Examples:**
| Level | Problem Set | Minuend Range | Answer Range |
|-------|-------------|--------------|-------------|
| 1 | 1-1, 2-1, 3-1 ... 20-1 | 1 to 20 | 0 to 19 |
| 5 | 5-5, 6-5, 7-5 ... 24-5 | 5 to 24 | 0 to 19 |
| 10 | 10-10, 11-10, 12-10 ... 29-10 | 10 to 29 | 0 to 19 |
| 20 | 20-20, 21-20, 22-20 ... 39-20 | 20 to 39 | 0 to 19 |

**Pedagogical rationale:**
- All results are non-negative (safe for young children)
- Each level focuses on "subtracting N" — a single skill to master
- The connection to addition is clear: if you know 5+7=12, you know 12-5=7
- Results are always 0-19, keeping answers manageable
- Starting from X-X=0 gives an easy confidence-building first problem

### 2.4 Multiplication Problems

**Rule:** Level N → `N × M` for M = 1, 2, 3, ..., 20

```typescript
function generateMultiplication(level: number): MathProblem[] {
  const problems: MathProblem[] = [];
  for (let m = 1; m <= 20; m++) {
    problems.push({
      id: `mul-${level}-${m}`,
      operand1: level,
      operand2: m,
      operation: 'multiplication',
      correctAnswer: level * m,
      displayText: `${level} × ${m}`,
    });
  }
  return problems;
}
```

**Examples:**
| Level | Problem Set | Answer Range |
|-------|-------------|-------------|
| 1 | 1×1 through 1×20 | 1 to 20 |
| 5 | 5×1 through 5×20 | 5 to 100 |
| 10 | 10×1 through 10×20 | 10 to 200 |
| 12 | 12×1 through 12×20 | 12 to 240 |
| 20 | 20×1 through 20×20 | 20 to 400 |

### 2.5 Division Problems

**Rule:** Level N → `(N × M) ÷ N = M` for M = 1, 2, 3, ..., 20

All answers are whole numbers. This is the inverse of the multiplication table.

```typescript
function generateDivision(level: number): MathProblem[] {
  const problems: MathProblem[] = [];
  for (let m = 1; m <= 20; m++) {
    const dividend = level * m;
    problems.push({
      id: `div-${level}-${m}`,
      operand1: dividend,
      operand2: level,
      operation: 'division',
      correctAnswer: m,
      displayText: `${dividend} ÷ ${level}`,
    });
  }
  return problems;
}
```

**Examples:**
| Level | Problem Set | Dividend Range | Answer Range |
|-------|-------------|---------------|-------------|
| 1 | 1÷1, 2÷1, 3÷1 ... 20÷1 | 1 to 20 | 1 to 20 |
| 2 | 2÷2, 4÷2, 6÷2 ... 40÷2 | 2 to 40 | 1 to 20 |
| 5 | 5÷5, 10÷5, 15÷5 ... 100÷5 | 5 to 100 | 1 to 20 |
| 10 | 10÷10, 20÷10 ... 200÷10 | 10 to 200 | 1 to 20 |
| 20 | 20÷20, 40÷20 ... 400÷20 | 20 to 400 | 1 to 20 |

**Pedagogical rationale:**
- Every answer is a whole number (no decimals or remainders)
- Directly maps to multiplication: if child knows 5×4=20, they can solve 20÷5
- Reinforces the inverse relationship between multiplication and division

## 3. Distractor Generation (Multiple Choice)

When in multiple choice mode, generate 3 wrong answers that are plausible but incorrect.

```typescript
function generateDistractors(correctAnswer: number, operation: Operation): number[] {
  const distractors = new Set<number>();

  // Strategy 1: Close neighbors (±1, ±2)
  const offsets = [-2, -1, 1, 2];
  for (const offset of offsets) {
    const d = correctAnswer + offset;
    if (d >= 0 && d !== correctAnswer) {
      distractors.add(d);
    }
  }

  // Strategy 2: Common mistake patterns
  if (operation === 'multiplication') {
    // Off-by-one multiplicand: e.g., 7×6=42, distractor: 7×5=35 or 7×7=49
    distractors.add(correctAnswer + Math.floor(correctAnswer * 0.15));
    distractors.add(correctAnswer - Math.floor(correctAnswer * 0.15));
  }

  if (operation === 'subtraction') {
    // Swapped operands mistake
    distractors.add(correctAnswer + 2);
  }

  // Strategy 3: Random nearby values
  while (distractors.size < 6) {
    const range = Math.max(5, Math.floor(correctAnswer * 0.3));
    const d = correctAnswer + Math.floor(Math.random() * range * 2) - range;
    if (d >= 0 && d !== correctAnswer) {
      distractors.add(d);
    }
  }

  // Pick 3 distractors, shuffle with correct answer
  const selected = Array.from(distractors).slice(0, 3);
  return selected;
}

function generateChoices(correctAnswer: number, operation: Operation): number[] {
  const distractors = generateDistractors(correctAnswer, operation);
  const choices = [correctAnswer, ...distractors];
  // Fisher-Yates shuffle
  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [choices[i], choices[j]] = [choices[j], choices[i]];
  }
  return choices;
}
```

## 4. Scoring System

```typescript
interface ScoreResult {
  totalCorrect: number;
  totalWrong: number;
  accuracy: number;         // 0-100
  stars: number;            // 0-4
  passed: boolean;
  timeBonus: boolean;
}

const PASS_THRESHOLD = 0.8;           // 80% = 16/20
const STAR_THRESHOLDS = [0, 0.8, 0.9, 1.0];  // 1★=80%, 2★=90%, 3★=100%

const TIME_BONUS_MS: Record<AgeGroup, number> = {
  young: 60000,      // 60s total (3s per problem)
  medium: 40000,     // 40s total (2s per problem)
  advanced: 30000,   // 30s total (1.5s per problem)
};

function calculateScore(
  answers: UserAnswer[],
  totalTimeMs: number,
  ageGroup: AgeGroup
): ScoreResult {
  const totalCorrect = answers.filter(a => a.isCorrect).length;
  const totalWrong = answers.length - totalCorrect;
  const accuracy = (totalCorrect / answers.length) * 100;
  const passed = accuracy / 100 >= PASS_THRESHOLD;

  let stars = 0;
  if (accuracy / 100 >= STAR_THRESHOLDS[3]) stars = 3;
  else if (accuracy / 100 >= STAR_THRESHOLDS[2]) stars = 2;
  else if (accuracy / 100 >= STAR_THRESHOLDS[1]) stars = 1;

  const timeBonus = passed && totalTimeMs <= TIME_BONUS_MS[ageGroup];
  if (timeBonus) stars = 4;

  return { totalCorrect, totalWrong, accuracy, stars, passed, timeBonus };
}
```

## 5. Progression Logic

```typescript
function isLevelUnlocked(
  operation: Operation,
  level: number,
  progress: Map<string, LevelProgress>
): boolean {
  // Level 1 of addition is always unlocked
  if (operation === 'addition' && level === 1) return true;

  // Within same operation: previous level must be completed
  if (level > 1) {
    const prevKey = `${operation}-${level - 1}`;
    const prev = progress.get(prevKey);
    if (!prev || prev.stars === 0) return false;
    return true;
  }

  // First level of a new operation: need level 10 of previous operation
  const operationOrder: Operation[] = [
    'addition', 'subtraction', 'multiplication', 'division'
  ];
  const opIndex = operationOrder.indexOf(operation);
  if (opIndex === 0) return true;

  const prevOp = operationOrder[opIndex - 1];
  const gateKey = `${prevOp}-10`;
  const gate = progress.get(gateKey);
  return gate !== undefined && gate.stars > 0;
}

function getNextLevel(
  currentOp: Operation,
  currentLevel: number,
  progress: Map<string, LevelProgress>
): { operation: Operation; level: number } | null {
  // Try next level in same operation
  if (currentLevel < 20) {
    return { operation: currentOp, level: currentLevel + 1 };
  }

  // Try first level of next operation
  const operationOrder: Operation[] = [
    'addition', 'subtraction', 'multiplication', 'division'
  ];
  const opIndex = operationOrder.indexOf(currentOp);
  if (opIndex < 3) {
    const nextOp = operationOrder[opIndex + 1];
    if (isLevelUnlocked(nextOp, 1, progress)) {
      return { operation: nextOp, level: 1 };
    }
  }

  return null; // Game complete!
}
```

## 6. Review Mode (Weak Spot Analysis)

```typescript
function getWeakProblems(
  problemHistory: ProblemLog[],
  limit: number = 20
): MathProblem[] {
  // Group by problem text, calculate error rate
  const stats = new Map<string, { total: number; wrong: number; problem: MathProblem }>();

  for (const log of problemHistory) {
    const key = log.problemText;
    const existing = stats.get(key) || { total: 0, wrong: 0, problem: log };
    existing.total++;
    if (!log.isCorrect) existing.wrong++;
    stats.set(key, existing);
  }

  // Sort by error rate descending, then by recency
  const sorted = Array.from(stats.values())
    .filter(s => s.wrong > 0)
    .sort((a, b) => (b.wrong / b.total) - (a.wrong / a.total));

  return sorted.slice(0, limit).map(s => s.problem);
}
```

## 7. Hint Content

Hints provide visual breakdowns appropriate to each operation:

```typescript
interface HintContent {
  type: 'blocks' | 'groups' | 'number_line' | 'splitting';
  description: { en: string; es: string };
  visual: HintVisual;
}

function generateHint(problem: MathProblem): HintContent {
  switch (problem.operation) {
    case 'addition':
      return {
        type: 'blocks',
        description: {
          en: `Count ${problem.operand1} blocks, then add ${problem.operand2} more`,
          es: `Cuenta ${problem.operand1} bloques, luego agrega ${problem.operand2} más`,
        },
        visual: {
          group1: problem.operand1,  // render N colored blocks
          group2: problem.operand2,  // render M colored blocks (different color)
          total: problem.correctAnswer,
        },
      };

    case 'subtraction':
      return {
        type: 'blocks',
        description: {
          en: `Start with ${problem.operand1} blocks, take away ${problem.operand2}`,
          es: `Empieza con ${problem.operand1} bloques, quita ${problem.operand2}`,
        },
        visual: {
          total: problem.operand1,
          removed: problem.operand2,
          remaining: problem.correctAnswer,
        },
      };

    case 'multiplication':
      return {
        type: 'groups',
        description: {
          en: `${problem.operand1} groups of ${problem.operand2}`,
          es: `${problem.operand1} grupos de ${problem.operand2}`,
        },
        visual: {
          groups: problem.operand1,
          itemsPerGroup: problem.operand2,
          total: problem.correctAnswer,
        },
      };

    case 'division':
      return {
        type: 'splitting',
        description: {
          en: `Split ${problem.operand1} into ${problem.operand2} equal groups`,
          es: `Divide ${problem.operand1} en ${problem.operand2} grupos iguales`,
        },
        visual: {
          total: problem.operand1,
          groups: problem.operand2,
          perGroup: problem.correctAnswer,
        },
      };
  }
}
```
