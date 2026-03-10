import type { Variants } from 'framer-motion';

// ── Page transitions ──
export const pageVariants: Variants = {
  initial: { opacity: 0, x: 20 },
  enter: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2, ease: 'easeIn' } },
};

// ── Fade in ──
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

// ── Scale up ──
export const scaleUp: Variants = {
  initial: { scale: 0.8, opacity: 0 },
  enter: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 25 } },
  exit: { scale: 0.9, opacity: 0 },
};

// ── Slide up from bottom ──
export const slideUp: Variants = {
  initial: { y: 40, opacity: 0 },
  enter: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 25 } },
  exit: { y: 20, opacity: 0 },
};

// ── Stagger children ──
export const staggerContainer: Variants = {
  enter: { transition: { staggerChildren: 0.08 } },
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 400, damping: 25 } },
};

// ── Star fill ──
export const starFill: Variants = {
  initial: { scale: 0, rotate: -180 },
  enter: {
    scale: 1,
    rotate: 0,
    transition: { type: 'spring', stiffness: 300, damping: 15 },
  },
};

// ── Badge reveal (3D flip) ──
export const badgeFlip: Variants = {
  initial: { rotateY: 180, opacity: 0 },
  enter: {
    rotateY: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

// ── Pulse ring ──
export const pulseRing = {
  animate: {
    scale: [1, 1.15, 1],
    opacity: [0.6, 0.2, 0.6],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  },
};

// ── Toast slide in ──
export const toastVariants: Variants = {
  initial: { y: -60, opacity: 0 },
  enter: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 400, damping: 25 } },
  exit: { y: -60, opacity: 0, transition: { duration: 0.2 } },
};
