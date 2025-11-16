// app/frontend/utils/motionVariants.ts

import { Variants, Transition } from 'framer-motion';

/**
 * Motion personality guidelines:
 * - User-triggered actions: Snappy & responsive (0.4-0.5s, stiffness: 200)
 * - Auto-updates: Softer & subtle (0.3-0.4s, stiffness: 150)
 */

// Easing curves
export const EASING = {
  snappy: [0.25, 0.46, 0.45, 0.94] as const,
  subtle: [0.33, 0.52, 0.55, 0.91] as const,
};

// Spring configurations
export const SPRING = {
  snappy: { stiffness: 200, damping: 20 },
  subtle: { stiffness: 150, damping: 22 },
};

// Transitions
export const TRANSITION = {
  snappy: { duration: 0.5, ease: EASING.snappy } as Transition,
  subtle: { duration: 0.3, ease: EASING.subtle } as Transition,
};

// Common animation variants
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

export const popIn: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
};

// Stagger container variants
export const staggerContainer = (staggerChildren: number = 0.08): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren },
  },
});

// Message animation (auto-update, subtle)
export const messageSlide: Variants = {
  hidden: { y: 10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: TRANSITION.subtle,
  },
};

// Site card animation (user-triggered, snappy)
export const siteCardSlide: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: TRANSITION.snappy,
  },
};

// Agent step animation (auto-update, subtle with height)
export const agentStepReveal: Variants = {
  hidden: { opacity: 0, x: -10, height: 0 },
  visible: {
    opacity: 1,
    x: 0,
    height: 'auto',
    transition: TRANSITION.subtle,
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.2 },
  },
};

// Sidebar slide (user-triggered, snappy with spring)
export const sidebarSlide = (direction: 'left' | 'right'): Variants => ({
  hidden: { x: direction === 'left' ? '-100%' : '100%' },
  visible: {
    x: 0,
    transition: { type: 'spring', ...SPRING.snappy },
  },
});

// Map marker pop-in (auto-update, snappy with rotation)
export const markerPopIn: Variants = {
  hidden: { scale: 0, rotate: -180, opacity: 0 },
  visible: {
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: { type: 'spring', ...SPRING.snappy },
  },
  exit: {
    scale: 0,
    rotate: 180,
    opacity: 0,
    transition: { duration: 0.3 },
  },
};

// Shake animation for errors
export const shake: Variants = {
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.5 },
  },
};

// Helper: Get transition with reduced motion support
export function getTransition(
  baseTransition: Transition,
  shouldReduceMotion: boolean
): Transition {
  return shouldReduceMotion ? { duration: 0.01 } : baseTransition;
}
