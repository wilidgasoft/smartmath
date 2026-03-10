'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSound } from '@/hooks/useSound';

interface CountdownLaunchProps {
  onComplete: () => void;
}

export function CountdownLaunch({ onComplete }: CountdownLaunchProps) {
  const t = useTranslations('game');
  const [step, setStep] = useState<number | 'launch' | 'done'>(3);
  const { playCountdown, playLaunch } = useSound();

  useEffect(() => {
    playCountdown(); // beep on 3
    const timers: NodeJS.Timeout[] = [];
    timers.push(setTimeout(() => { setStep(2); playCountdown(); }, 800));
    timers.push(setTimeout(() => { setStep(1); playCountdown(); }, 1600));
    timers.push(setTimeout(() => { setStep('launch'); playLaunch(); }, 2400));
    timers.push(setTimeout(() => { setStep('done'); onComplete(); }, 3200));
    return () => timers.forEach(clearTimeout);
  }, [onComplete]); // eslint-disable-line react-hooks/exhaustive-deps

  if (step === 'done') return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={String(step)}
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ background: 'rgba(15,23,42,0.9)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.2, opacity: 0 }}
          animate={{ scale: [0.2, 1.4, 1], opacity: [0, 1, 0.8] }}
          exit={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center select-none"
        >
          {step === 'launch' ? (
            <div>
              <div
                className="font-heading font-bold text-white"
                style={{ fontSize: 'clamp(3rem,10vw,7rem)', textShadow: '0 0 40px #3B82F6, 0 0 80px #3B82F6' }}
              >
                {t('launch')}
              </div>
              <motion.div
                className="text-8xl mt-2"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                🚀
              </motion.div>
            </div>
          ) : (
            <div
              className="font-heading font-bold text-white"
              style={{ fontSize: 'clamp(5rem,20vw,12rem)', textShadow: '0 0 60px rgba(251,191,36,0.8)' }}
            >
              {step}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
