import { create } from 'zustand';
import type { GameSession, GameState, MathProblem, Operation, UserAnswer } from '@/lib/types';
import { HINTS_PER_LEVEL } from '@/lib/constants';

interface GameStore extends GameSession {
  gameState: GameState;
  retryQueue: MathProblem[];
  currentStartTime: number | null;

  // Actions
  startLevel: (operation: Operation, levelNumber: number, problems: MathProblem[]) => void;
  submitAnswer: (answer: number | null, timeMs: number) => boolean;
  useHint: () => void;
  markHintUsed: () => void;
  nextProblem: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  completeLevel: () => void;
  resetLevel: () => void;
  setGameState: (state: GameState) => void;
}

const initialGameSession: GameSession = {
  operation: 'addition',
  levelNumber: 1,
  problems: [],
  currentIndex: 0,
  answers: [],
  streak: 0,
  maxStreak: 0,
  hintsRemaining: HINTS_PER_LEVEL,
  startedAt: 0,
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialGameSession,
  gameState: 'countdown',
  retryQueue: [],
  currentStartTime: null,

  startLevel: (operation, levelNumber, problems) => {
    set({
      ...initialGameSession,
      operation,
      levelNumber,
      problems,
      startedAt: Date.now(),
      gameState: 'countdown',
      retryQueue: [],
      currentStartTime: null,
      answers: [],
    });
  },

  submitAnswer: (answer, timeMs) => {
    const { problems, currentIndex, answers, streak, maxStreak, retryQueue } = get();
    const currentProblem = problems[currentIndex];
    if (!currentProblem) return false;

    const isCorrect = answer === currentProblem.correctAnswer;
    const existingAttempts = answers.filter((a) => a.problemId === currentProblem.id).length;

    const userAnswer: UserAnswer = {
      problemId: currentProblem.id,
      userAnswer: answer,
      isCorrect,
      timeMs,
      hintUsed: false, // will be set by markHintUsed
      attemptNumber: existingAttempts + 1,
    };

    const newStreak = isCorrect ? streak + 1 : 0;
    const newMaxStreak = Math.max(maxStreak, newStreak);

    // If wrong, add to retry queue (only once per problem)
    const alreadyInQueue = retryQueue.some((p) => p.id === currentProblem.id);
    const newRetryQueue =
      !isCorrect && !alreadyInQueue ? [...retryQueue, currentProblem] : retryQueue;

    set((state) => ({
      answers: [...state.answers, userAnswer],
      streak: newStreak,
      maxStreak: newMaxStreak,
      retryQueue: newRetryQueue,
      gameState: 'feedback',
    }));

    return isCorrect;
  },

  useHint: () => {
    set((state) => ({
      hintsRemaining: Math.max(0, state.hintsRemaining - 1),
    }));
  },

  markHintUsed: () => {
    set((state) => {
      const answers = [...state.answers];
      if (answers.length > 0) {
        answers[answers.length - 1] = { ...answers[answers.length - 1], hintUsed: true };
      }
      return { answers };
    });
  },

  nextProblem: () => {
    const { currentIndex, problems, retryQueue } = get();
    const nextIndex = currentIndex + 1;

    if (nextIndex >= problems.length) {
      // All original problems answered — check if retries remain
      if (retryQueue.length > 0) {
        const nextProblems = [...problems, ...retryQueue];
        set({ problems: nextProblems, retryQueue: [], currentIndex: nextIndex, gameState: 'playing' });
      } else {
        set({ gameState: 'complete' });
      }
    } else {
      set({ currentIndex: nextIndex, gameState: 'playing' });
    }
  },

  pauseGame: () => set({ gameState: 'paused' }),
  resumeGame: () => set({ gameState: 'playing' }),
  completeLevel: () => set({ gameState: 'complete' }),

  resetLevel: () => {
    const { operation, levelNumber, problems } = get();
    set({
      ...initialGameSession,
      operation,
      levelNumber,
      problems: problems.slice(0, 20), // reset to original 20
      startedAt: Date.now(),
      gameState: 'countdown',
      retryQueue: [],
      answers: [],
    });
  },

  setGameState: (state) => set({ gameState: state }),
}));

// Selectors
export const selectCurrentProblem = (state: GameStore) =>
  state.problems[state.currentIndex] ?? null;

// Return primitives to avoid infinite loop (objects create new refs every render)
export const selectProgressCurrent = (state: GameStore) => state.currentIndex + 1;
export const selectProgressTotal = (state: GameStore) => Math.max(20, state.problems.length);
