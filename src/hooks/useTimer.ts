'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export function useTimer(active: boolean) {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef<number | null>(null);
  const pausedRef = useRef<number>(0);
  const rafRef = useRef<number>(0);

  const tick = useCallback(() => {
    if (startRef.current !== null) {
      setElapsed(Date.now() - startRef.current);
    }
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (active) {
      if (startRef.current === null) {
        startRef.current = Date.now() - pausedRef.current;
      }
      rafRef.current = requestAnimationFrame(tick);
    } else {
      if (startRef.current !== null) {
        pausedRef.current = Date.now() - startRef.current;
      }
      cancelAnimationFrame(rafRef.current);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, tick]);

  const reset = useCallback(() => {
    startRef.current = null;
    pausedRef.current = 0;
    setElapsed(0);
  }, []);

  return { elapsed, reset };
}
