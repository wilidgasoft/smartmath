import { describe, it, expect } from 'vitest';
import {
  generateProblems,
  generateAddition,
  generateSubtraction,
  generateMultiplication,
  generateDivision,
} from '../../src/engine/problems';
import { generateDistractors, generateChoices } from '../../src/engine/distractors';

describe('generateAddition', () => {
  it('generates exactly 20 problems per level', () => {
    for (const level of [1, 5, 10, 20]) {
      const problems = generateAddition(level);
      expect(problems).toHaveLength(20);
    }
  });

  it('produces correct answers at level 1', () => {
    const problems = generateAddition(1);
    expect(problems[0].correctAnswer).toBe(2); // 1+1
    expect(problems[19].correctAnswer).toBe(21); // 1+20
  });

  it('produces correct answers at level 10', () => {
    const problems = generateAddition(10);
    expect(problems[0].correctAnswer).toBe(11); // 10+1
    expect(problems[19].correctAnswer).toBe(30); // 10+20
  });

  it('all answers are non-negative', () => {
    for (let level = 1; level <= 20; level++) {
      generateAddition(level).forEach((p) => {
        expect(p.correctAnswer).toBeGreaterThanOrEqual(0);
      });
    }
  });
});

describe('generateSubtraction', () => {
  it('generates exactly 20 problems per level', () => {
    for (const level of [1, 5, 10, 20]) {
      const problems = generateSubtraction(level);
      expect(problems).toHaveLength(20);
    }
  });

  it('NEVER produces negative answers', () => {
    for (let level = 1; level <= 20; level++) {
      generateSubtraction(level).forEach((p) => {
        expect(p.correctAnswer).toBeGreaterThanOrEqual(0);
      });
    }
  });

  it('results are always 0-19', () => {
    for (let level = 1; level <= 20; level++) {
      generateSubtraction(level).forEach((p) => {
        expect(p.correctAnswer).toBeGreaterThanOrEqual(0);
        expect(p.correctAnswer).toBeLessThanOrEqual(19);
      });
    }
  });

  it('level 1 starts with 1-1=0', () => {
    const problems = generateSubtraction(1);
    expect(problems[0].operand1).toBe(1);
    expect(problems[0].operand2).toBe(1);
    expect(problems[0].correctAnswer).toBe(0);
  });

  it('level 5 starts with 5-5=0', () => {
    const problems = generateSubtraction(5);
    expect(problems[0].correctAnswer).toBe(0);
    expect(problems[19].correctAnswer).toBe(19);
  });
});

describe('generateMultiplication', () => {
  it('generates exactly 20 problems per level', () => {
    for (const level of [1, 5, 10, 20]) {
      expect(generateMultiplication(level)).toHaveLength(20);
    }
  });

  it('level 5 answers are 5×1 through 5×20', () => {
    const problems = generateMultiplication(5);
    expect(problems[0].correctAnswer).toBe(5);
    expect(problems[19].correctAnswer).toBe(100);
  });

  it('level 1 all answers equal the operand2', () => {
    const problems = generateMultiplication(1);
    problems.forEach((p, i) => {
      expect(p.correctAnswer).toBe(i + 1);
    });
  });
});

describe('generateDivision', () => {
  it('generates exactly 20 problems per level', () => {
    for (const level of [1, 5, 10, 20]) {
      expect(generateDivision(level)).toHaveLength(20);
    }
  });

  it('ALWAYS produces whole number answers', () => {
    for (let level = 1; level <= 20; level++) {
      generateDivision(level).forEach((p) => {
        expect(Number.isInteger(p.correctAnswer)).toBe(true);
      });
    }
  });

  it('answers are always 1-20', () => {
    for (let level = 1; level <= 20; level++) {
      generateDivision(level).forEach((p) => {
        expect(p.correctAnswer).toBeGreaterThanOrEqual(1);
        expect(p.correctAnswer).toBeLessThanOrEqual(20);
      });
    }
  });

  it('level 10: 10÷10=1, 200÷10=20', () => {
    const problems = generateDivision(10);
    expect(problems[0].operand1).toBe(10);
    expect(problems[0].correctAnswer).toBe(1);
    expect(problems[19].operand1).toBe(200);
    expect(problems[19].correctAnswer).toBe(20);
  });
});

describe('generateDistractors', () => {
  it('never includes the correct answer', () => {
    for (let answer = 0; answer <= 50; answer++) {
      const distractors = generateDistractors(answer, 'addition');
      expect(distractors).not.toContain(answer);
    }
  });

  it('returns exactly 3 distractors', () => {
    for (const answer of [0, 5, 20, 100]) {
      const distractors = generateDistractors(answer, 'multiplication');
      expect(distractors).toHaveLength(3);
    }
  });

  it('all distractors are non-negative', () => {
    for (let answer = 0; answer <= 20; answer++) {
      generateDistractors(answer, 'subtraction').forEach((d) => {
        expect(d).toBeGreaterThanOrEqual(0);
      });
    }
  });
});

describe('generateChoices', () => {
  it('always returns exactly 4 choices', () => {
    for (const answer of [0, 1, 10, 50]) {
      expect(generateChoices(answer, 'addition')).toHaveLength(4);
    }
  });

  it('always includes the correct answer', () => {
    for (const answer of [0, 5, 17, 42]) {
      expect(generateChoices(answer, 'multiplication')).toContain(answer);
    }
  });
});

describe('generateProblems (dispatcher)', () => {
  it('generates 20 problems for each operation', () => {
    const ops = ['addition', 'subtraction', 'multiplication', 'division'] as const;
    ops.forEach((op) => {
      expect(generateProblems(op, 5)).toHaveLength(20);
    });
  });

  it('includes choices when multipleChoice=true', () => {
    const problems = generateProblems('addition', 1, true);
    problems.forEach((p) => {
      expect(p.choices).toBeDefined();
      expect(p.choices).toHaveLength(4);
    });
  });
});
