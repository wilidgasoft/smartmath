'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

const COLORS = ['#FBBF24', '#3B82F6', '#10B981', '#A855F7', '#F59E0B', '#EC4899'];

export function ConfettiParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
        size: 6 + Math.random() * 8,
        rotation: Math.random() * 360,
      })),
    []
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50" aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: '-20px',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
          }}
          initial={{ y: -20, rotate: p.rotation, opacity: 1 }}
          animate={{
            y: '110vh',
            rotate: p.rotation + 360 * (Math.random() > 0.5 ? 1 : -1),
            opacity: [1, 1, 0],
            x: [(Math.random() - 0.5) * 100, (Math.random() - 0.5) * 200],
          }}
          transition={{
            delay: p.delay,
            duration: p.duration,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}
