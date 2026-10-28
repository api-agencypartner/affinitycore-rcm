/**
 * Motion tokens — every timing/easing on the page lives here so it can be tuned
 * in one place (and copied 1:1 into Framer code components / Framer transitions).
 */
import type { Transition, Variants } from 'motion/react';

export const ease = {
  /** Default UI ease — quick start, soft landing */
  out: [0.16, 1, 0.3, 1] as const, // expo-out: long, silky settle
  /** Symmetric, for loops / scrubs */
  inOut: [0.65, 0, 0.35, 1] as const,
  /** Curtain / large surfaces */
  curtain: [0.76, 0, 0.24, 1] as const,
  /** From Figma loader: word slide-in curve */
  figmaWord: [1, 0.603, 1, 1] as const,
  /** From Figma loader: camera pull-back */
  figmaZoom: [0.816, -0.015, 1, 1] as const,
  /** From Figma loader: selection highlight */
  figmaSelect: [0.5, 0, 0.5, 1] as const,
};

export const dur = { xs: 0.3, sm: 0.55, md: 0.95, lg: 1.2, xl: 1.6 };

export const spring = {
  pop: { type: 'spring', stiffness: 380, damping: 26 } as Transition,
  soft: { type: 'spring', stiffness: 140, damping: 22 } as Transition,
};

/** Loader (Figma node 374:24085) — 4s timeline, played once. */
export const LOADER = {
  total: 4,
  words: ['Medical', 'Billing', 'Service', 'That', 'Gets', 'You', 'Paid', 'Faster'],
  /** start time (as fraction of 4s) for each word, straight from the Figma keyframes */
  wordStarts: [0.105, 0.1554, 0.2059, 0.2563, 0.3059, 0.3559, 0.4059, 0.4559],
  wordTravel: 0.0755, // fraction of 4s each word takes to settle
  /** fraction when the page curtain starts lifting (hand-off to homepage) */
  handoff: 0.84,
};

/** Hero carousel */
export const HERO = { slideDuration: 6 };

/** Shared reveal variants */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: dur.md, ease: ease.out } },
};

export const stagger = (s = 0.08, d = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: s, delayChildren: d } },
});

/** Default viewport for whileInView reveals */
export const vp = { once: true, amount: 0.25 } as const;

/** Lenis smooth-scroll feel (Framer: Smooth Scroll component, intensity ≈ 10) */
// lerp 0.12 + 1:1 wheel: still smooth, but follows the wheel closely (0.085 felt heavy)
export const SMOOTH = { lerp: 0.12, wheelMultiplier: 1 };
