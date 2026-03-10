'use client';

import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import type { HintContent, Locale } from '@/lib/types';
import { Button } from '@/components/ui';

interface HintOverlayProps {
  hint: HintContent;
  onClose: () => void;
}

const MAX_VISUAL_BLOCKS = 20;

function BlocksVisual({ count, color }: { count: number; color: string }) {
  const clamped = Math.min(count, MAX_VISUAL_BLOCKS);
  return (
    <div className="flex flex-wrap gap-1 justify-center">
      {Array.from({ length: clamped }, (_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.03, type: 'spring', stiffness: 400 }}
          className="w-6 h-6 rounded-md"
          style={{ backgroundColor: color }}
        />
      ))}
      {count > MAX_VISUAL_BLOCKS && (
        <span className="text-white/50 text-xs self-center">...+{count - MAX_VISUAL_BLOCKS}</span>
      )}
    </div>
  );
}

export function HintOverlay({ hint, onClose }: HintOverlayProps) {
  const locale = useLocale() as Locale;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.85)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8 }}
        className="w-full max-w-sm bg-space-card border border-primary/30 rounded-3xl p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-3xl mb-3">💡</div>
        <p className="text-white font-body mb-4">{hint.description[locale]}</p>

        {/* Visual */}
        <div className="mb-4 space-y-2">
          {hint.type === 'blocks' && hint.visual.group1 != null && hint.visual.group2 != null && (
            <>
              <BlocksVisual count={hint.visual.group1} color="#3B82F6" />
              <div className="text-white/50 text-xl">+</div>
              <BlocksVisual count={hint.visual.group2} color="#10B981" />
            </>
          )}
          {hint.type === 'blocks' && hint.visual.removed != null && hint.visual.remaining != null && (
            <>
              <div className="text-white/50 text-sm mb-1">Take away {hint.visual.removed}</div>
              <BlocksVisual count={hint.visual.remaining ?? 0} color="#10B981" />
            </>
          )}
          {hint.type === 'groups' && hint.visual.groups != null && hint.visual.itemsPerGroup != null && (
            <div className="flex flex-wrap gap-2 justify-center">
              {Array.from({ length: Math.min(hint.visual.groups, 10) }, (_, g) => (
                <div key={g} className="border border-primary/30 rounded-lg p-1">
                  <BlocksVisual count={hint.visual.itemsPerGroup ?? 0} color="#A855F7" />
                </div>
              ))}
            </div>
          )}
          {hint.type === 'splitting' && hint.visual.perGroup != null && hint.visual.groups != null && (
            <div className="flex flex-wrap gap-2 justify-center">
              {Array.from({ length: Math.min(hint.visual.groups, 10) }, (_, g) => (
                <div key={g} className="border border-warning/30 rounded-lg p-1 flex flex-col items-center">
                  <BlocksVisual count={hint.visual.perGroup ?? 0} color="#F59E0B" />
                </div>
              ))}
            </div>
          )}
        </div>

        <Button variant="primary" size="sm" onClick={onClose} className="w-full">
          Got it! ✓
        </Button>
      </motion.div>
    </motion.div>
  );
}
