import { Variants } from 'framer-motion';

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
};

export const exerciseEnterExit: Variants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } },
  exit: { opacity: 0, x: -40, transition: { duration: 0.15 } },
};

export const feedbackBarVariants: Variants = {
  hidden: { y: '100%', opacity: 0 },
  visible: { y: '0%', opacity: 1, transition: { type: 'spring', stiffness: 400, damping: 30 } },
};

export const modalPop: Variants = {
  hidden: { scale: 0.85, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 400, damping: 25 } },
  exit: { scale: 0.9, opacity: 0, transition: { duration: 0.15 } },
};

export const pulseGlow: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    boxShadow: [
      '0 0 0px rgba(88, 204, 2, 0)',
      '0 0 15px rgba(88, 204, 2, 0.6)',
      '0 0 0px rgba(88, 204, 2, 0)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};
