'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MultipleChoiceProps {
  choices: number[];
  correctAnswer: number;
  selectedAnswer: number | null;
  onSelect: (answer: number) => void;
  disabled?: boolean;
}

export function MultipleChoice({
  choices,
  correctAnswer,
  selectedAnswer,
  onSelect,
  disabled,
}: MultipleChoiceProps) {
  return (
    <div className="grid grid-cols-2 gap-3" role="group" aria-label="Answer choices">
      {choices.map((choice, i) => {
        const isSelected = selectedAnswer === choice;
        const isCorrect = selectedAnswer !== null && choice === correctAnswer;
        const isWrong = isSelected && choice !== correctAnswer;

        let buttonClass = 'bg-space-card border border-white/20 text-white hover:bg-primary/20 hover:border-primary/50';
        if (isCorrect) buttonClass = 'bg-success/30 border-success text-white';
        else if (isWrong) buttonClass = 'bg-warning/30 border-warning text-white';

        return (
          <motion.button
            key={`${choice}-${i}`}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
            whileHover={{ scale: disabled ? 1 : 1.03 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            onClick={() => !disabled && onSelect(choice)}
            disabled={disabled}
            aria-label={`Answer: ${choice}`}
            aria-pressed={isSelected}
            className={cn(
              'min-h-[72px] rounded-2xl font-heading font-bold transition-colors duration-200 select-none',
              'text-2xl md:text-3xl',
              buttonClass,
              disabled && !isSelected && !isCorrect && 'opacity-60',
              disabled ? 'cursor-not-allowed' : 'cursor-pointer'
            )}
          >
            {choice}
            {isCorrect && <span className="ml-2">✓</span>}
            {isWrong && <span className="ml-2">✗</span>}
          </motion.button>
        );
      })}
    </div>
  );
}
