'use client';

import { useState, useEffect, useCallback, useRef, use } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { notFound } from 'next/navigation';
import { SpaceScene } from '@/components/game/SpaceScene';
import { Spaceship } from '@/components/game/Spaceship';
import { CountdownLaunch } from '@/components/game/CountdownLaunch';
import { ProblemDisplay } from '@/components/game/ProblemDisplay';
import { MultipleChoice } from '@/components/game/MultipleChoice';
import { NumericInput } from '@/components/game/NumericInput';
import { StreakCounter } from '@/components/game/StreakCounter';
import { HintOverlay } from '@/components/game/HintOverlay';
import { LevelComplete } from '@/components/game/LevelComplete';
import { ProgressBar, Button, Modal } from '@/components/ui';
import { useGame } from '@/hooks/useGame';
import { useTimer } from '@/hooks/useTimer';
import { useSound } from '@/hooks/useSound';
import { GALAXIES, OPERATION_ORDER } from '@/lib/constants';
import { isLevelUnlocked, buildProgressMap } from '@/engine/progression';
import { useProgressStore } from '@/store/progressStore';
import { useGameStore } from '@/store/gameStore';
import type { Operation, HintContent, LevelResult } from '@/lib/types';
import { formatTime } from '@/lib/utils';

interface Props {
  params: Promise<{ operationId: string; levelId: string }>;
}

export default function GamePage({ params }: Props) {
  const { operationId, levelId } = use(params);
  const locale = useLocale();
  const router = useRouter();

  // Validate params
  if (!OPERATION_ORDER.includes(operationId as Operation)) notFound();
  const levelNumber = parseInt(levelId, 10);
  if (isNaN(levelNumber) || levelNumber < 1 || levelNumber > 20) notFound();

  const operation = operationId as Operation;
  const galaxy = GALAXIES.find((g) => g.operation === operation);

  // Check unlock status
  const levels = useProgressStore((s) => s.levels);
  const isUnlocked = isLevelUnlocked(
    operation,
    levelNumber,
    buildProgressMap(
      Object.entries(levels).map(([key, v]) => {
        const [op, lStr] = key.split('-');
        return { operation: op as Operation, levelNumber: parseInt(lStr, 10), ...v };
      })
    )
  );

  // Redirect must happen in an effect, never during render
  useEffect(() => {
    if (!isUnlocked) {
      router.replace(`/${locale}/galaxy/${operation}`);
    }
  }, [isUnlocked, router, locale, operation]);

  if (!isUnlocked) return null;

  return <GameScreen operation={operation} levelNumber={levelNumber} galaxy={galaxy} />;
}

function GameScreen({
  operation,
  levelNumber,
  galaxy,
}: {
  operation: Operation;
  levelNumber: number;
  galaxy: (typeof GALAXIES)[0] | undefined;
}) {
  const t = useTranslations('game');
  const locale = useLocale();
  const router = useRouter();

  const {
    currentProblem,
    progress,
    gameState,
    streak,
    hintsRemaining,
    isMultipleChoice,
    submitAnswer,
    getHint,
    advance,
    getResult,
    getDestination,
    resumeGame,
    resetLevel,
    setGameState,
  } = useGame(operation, levelNumber);

  const { elapsed, reset: resetTimer } = useTimer(gameState === 'playing');
  const { playCorrect, playWrong, playLaunch, playCountdown, playStreak } = useSound();

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [hintContent, setHintContent] = useState<HintContent | null>(null);
  const [result, setResult] = useState<LevelResult | null>(null);
  const resultComputedRef = useRef(false);
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [wrongAnimation, setWrongAnimation] = useState(false);
  const [problemStartTime, setProblemStartTime] = useState(Date.now());

  // Start timer on first problem
  useEffect(() => {
    if (gameState === 'playing') {
      setProblemStartTime(Date.now());
    }
  }, [currentProblem, gameState]);

  // Collect result when level completes — guard prevents re-running if getResult
  // identity changes after the store update triggered inside it.
  useEffect(() => {
    if (gameState === 'complete' && !resultComputedRef.current) {
      resultComputedRef.current = true;
      const r = getResult();
      setResult(r);
    }
  }, [gameState, getResult]);

  const handleAnswer = useCallback(
    (answer: number) => {
      if (gameState !== 'playing') return;
      const timeMs = Date.now() - problemStartTime;
      const isCorrect = submitAnswer(answer, timeMs);
      setSelectedAnswer(answer);
      setFeedback(isCorrect ? 'correct' : 'wrong');

      if (isCorrect) {
        playCorrect();
        // streak value is updated in the store after submitAnswer, read it from store
        const newStreak = useGameStore.getState().streak;
        playStreak(newStreak);
      } else {
        playWrong();
        setWrongAnimation(true);
      }

      // Auto-advance
      setTimeout(
        () => {
          setSelectedAnswer(null);
          setFeedback(null);
          setWrongAnimation(false);
          advance();
        },
        isCorrect ? 800 : 1500
      );
    },
    [gameState, problemStartTime, submitAnswer, advance, playCorrect, playWrong, playStreak]
  );

  const handleHint = () => {
    if (hintsRemaining <= 0) return;
    const hint = getHint();
    if (hint) setHintContent(hint);
  };

  const shipProgress = (progress.current / progress.total) * 100;

  if (gameState === 'countdown') {
    return <CountdownLaunch onComplete={() => setGameState('playing')} />;
  }

  return (
    <div
      className="fixed inset-0 flex flex-col"
      style={{ background: galaxy?.theme.bg ?? '#0F172A' }}
    >
      {/* Space scene - top 35% */}
      <div className="relative flex-shrink-0" style={{ height: '35vh' }}>
        <SpaceScene streak={streak} bgColor={galaxy?.theme.bg} className="absolute inset-0" />

        {/* Destination planet */}
        <div
          className="absolute right-4 top-1/2 -translate-y-1/2 text-5xl"
          aria-hidden="true"
          style={{ filter: `drop-shadow(0 0 20px ${galaxy?.theme.primary ?? '#3B82F6'})` }}
        >
          🪐
        </div>

        {/* Spaceship */}
        <div className="absolute inset-0">
          <Spaceship
            progress={10 + shipProgress * 0.75}
            streak={streak}
            onWrongAnimation={wrongAnimation}
            color={galaxy?.theme.primary ?? '#3B82F6'}
            className="top-1/2 -translate-y-1/2"
          />
        </div>
      </div>

      {/* Game HUD */}
      <div className="px-4 py-2 bg-space-card/80 backdrop-blur-sm border-y border-white/10">
        <div className="flex items-center justify-between mb-1">
          <span className="text-white/60 text-sm font-body">
            {t('level', { number: levelNumber })} · {t('problemProgress', { current: progress.current, total: progress.total })}
          </span>
          <div className="flex items-center gap-3">
            <StreakCounter streak={streak} />
            <span className="text-white/40 text-sm">{formatTime(elapsed)}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowQuitModal(true)}
              className="!min-h-[32px] !px-2 text-xs"
            >
              ✕
            </Button>
          </div>
        </div>
        <ProgressBar value={(progress.current / progress.total) * 100} height="sm" />
      </div>

      {/* Problem area */}
      <div className="flex-1 overflow-y-auto flex flex-col justify-center px-4 py-4 gap-4">
        {currentProblem && (
          <>
            <ProblemDisplay problem={currentProblem} feedback={feedback} />

            {/* Answer input */}
            {isMultipleChoice ? (
              <MultipleChoice
                choices={currentProblem.choices ?? []}
                correctAnswer={currentProblem.correctAnswer}
                selectedAnswer={selectedAnswer}
                onSelect={handleAnswer}
                disabled={feedback !== null}
              />
            ) : (
              <NumericInput
                onSubmit={handleAnswer}
                disabled={feedback !== null}
                feedback={feedback}
              />
            )}

            {/* Hint button */}
            <div className="flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleHint}
                disabled={hintsRemaining <= 0 || feedback !== null}
              >
                💡 {t('hints', { count: hintsRemaining })}
              </Button>
            </div>
          </>
        )}

        {/* Feedback message */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`text-center font-heading font-bold text-lg ${
                feedback === 'correct' ? 'text-success' : 'text-warning'
              }`}
            >
              {feedback === 'correct' ? t('correct') : t('tryAgain', { answer: currentProblem?.correctAnswer ?? '' })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hint overlay */}
      <AnimatePresence>
        {hintContent && (
          <HintOverlay hint={hintContent} onClose={() => setHintContent(null)} />
        )}
      </AnimatePresence>

      {/* Level complete overlay */}
      {result && (
        <LevelComplete
          result={result}
          destination={getDestination() ?? undefined}
          onRetry={() => {
            resultComputedRef.current = false;
            setResult(null);
            setFeedback(null);
            setSelectedAnswer(null);
            resetTimer();
            resetLevel();
          }}
          onNext={() => {
            router.push(`/${locale}/galaxy/${operation}/${Math.min(levelNumber + 1, 20)}`);
          }}
          onBackToMap={() => router.push(`/${locale}/galaxy/${operation}`)}
        />
      )}

      {/* Quit confirmation */}
      <Modal open={showQuitModal} onClose={() => setShowQuitModal(false)} size="sm">
        <div className="p-6 text-center">
          <div className="text-3xl mb-3">🛸</div>
          <p className="text-white font-body mb-4">{t('quitConfirm')}</p>
          <div className="flex gap-2">
            <Button
              variant="danger"
              size="sm"
              className="flex-1"
              onClick={() => router.push(`/${locale}/galaxy/${operation}`)}
            >
              {t('yes')}
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="flex-1"
              onClick={() => { setShowQuitModal(false); resumeGame(); }}
            >
              {t('no')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
