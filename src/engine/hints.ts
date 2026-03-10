import type { HintContent, MathProblem } from '@/lib/types';

export function generateHint(problem: MathProblem): HintContent {
  switch (problem.operation) {
    case 'addition':
      return {
        type: 'blocks',
        description: {
          en: `Count ${problem.operand1} blocks, then add ${problem.operand2} more`,
          es: `Cuenta ${problem.operand1} bloques, luego agrega ${problem.operand2} más`,
        },
        visual: {
          group1: problem.operand1,
          group2: problem.operand2,
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
