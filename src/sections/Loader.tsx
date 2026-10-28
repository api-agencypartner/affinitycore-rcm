import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { motion, animate, useMotionValue } from 'motion/react';
import { LOADER, ease } from '../motion';

/**
 * Loading screen — rebuilt from Figma Motion (node 374:24085).
 * Keyframe times are the Figma `times` arrays × 4s; curves are the Figma beziers.
 * At LOADER.handoff the prompt-bar "shell" (layoutId="shell") is handed to the Nav,
 * so Motion morphs it into the navigation bar while the purple curtain lifts.
 */
const T = LOADER.total;
const t = (f: number) => f * T;

/** Spread N words across the same Figma rhythm (first and last word land at the same times). */
function startsFor(n: number) {
  if (n === LOADER.words.length) return LOADER.wordStarts;
  const a = LOADER.wordStarts[0], b = LOADER.wordStarts[LOADER.wordStarts.length - 1];
  return Array.from({ length: n }, (_, i) => (n === 1 ? a : a + ((b - a) * i) / (n - 1)));
}

export function Loader({ onHandoff, words = LOADER.words }: { onHandoff: () => void; words?: string[] }) {
  const starts = useMemo(() => startsFor(words.length), [words.length]);
  const caretX = useMotionValue(0);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const textRef = useRef<HTMLDivElement>(null);

  // Caret jumps to the end of each word as it lands (Figma "|" x keyframes)
  useLayoutEffect(() => {
    const end = (i: number) => { const el = wordRefs.current[i]; return el ? el.offsetLeft + el.offsetWidth : 0; };
    caretX.set(-8);
    const timers = starts.map((s, i) =>
      setTimeout(() => animate(caretX, end(i) + 6, { duration: 0.12, ease: 'easeOut' }), t(s + 0.02) * 1000),
    );
    return () => timers.forEach(clearTimeout);
  }, [caretX, starts]);

  useEffect(() => {
    const id = setTimeout(onHandoff, t(LOADER.handoff) * 1000);
    return () => clearTimeout(id);
  }, [onHandoff]);

  return (
    <motion.div className="loader" aria-label="Loading" role="status"
      initial={{ y: 0 }} exit={{ y: '-100%', transition: { duration: 1, ease: ease.curtain, delay: 0.15 } }}>
      {/* Ellipse 21 — soft glow drifting right */}
      <motion.div className="loader__glow"
        initial={{ x: '-22rem' }} animate={{ x: '22.3rem' }} transition={{ duration: t(0.5525), ease: 'linear' }} />

      {/* "Main" — the camera: starts zoomed 2.9× on the first words, pulls back to 1× */}
      <motion.div className="loader__main"
        initial={{ scale: 2.9, x: '170.78rem', y: 0 }}
        animate={{ scale: [2.9, 2.9, 1], x: ['170.78rem', '170.78rem', '0rem'] }}
        transition={{
          scale: { duration: t(0.6508), times: [0, 0.4575 / 0.6508, 1], ease: ['linear', ease.figmaZoom] },
          x: { duration: t(0.5525), times: [0, 0.0995 / 0.5525, 1], ease: ['linear', 'easeIn'] },
        }}>
        <motion.div layoutId="shell" className="loader__bar" transition={{ duration: 1, ease: ease.curtain }}
          style={{ borderRadius: 6 }}>
          <motion.div className="loader__content" exit={{ opacity: 0, transition: { duration: 0.2 } }}>
            {/* iconsax-add: spins in -180° → 0° */}
            <motion.svg className="loader__plus" viewBox="0 0 24 24" fill="none" initial={{ rotate: -180 }} animate={{ rotate: 0 }}
              transition={{ duration: t(0.105), ease: 'easeOut' }}>
              <path d="M6 12h12M12 18V6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
            </motion.svg>

            <div className="loader__text" ref={textRef}>
              {/* Rectangle 24 — selection highlight sweeping behind the words */}
              <motion.span className="loader__select"
                initial={{ clipPath: 'inset(0 100% 0 0)' }}
                animate={{ clipPath: ['inset(0 100% 0 0)', 'inset(0 0% 0 0)', 'inset(0 0% 0 100%)'] }}
                transition={{ delay: t(0.105), duration: t(0.5096 - 0.105), times: [0, (0.4575 - 0.105) / (0.5096 - 0.105), 1], ease: [ease.figmaSelect, 'linear'] }} />
              {words.map((w, i) => (
                <motion.span key={w + i} ref={(el) => { wordRefs.current[i] = el; }} className="loader__word"
                  initial={{ opacity: 0, x: '4.46rem' }} animate={{ opacity: 1, x: 0 }}
                  transition={{
                    opacity: { delay: t(starts[i]), duration: t(0.025), ease: ease.figmaWord },
                    x: { delay: t(starts[i]), duration: t(LOADER.wordTravel), ease: ease.figmaWord },
                  }}>
                  {w}
                </motion.span>
              ))}
              {/* "|" caret — follows words, then blinks */}
              <motion.span className="loader__caret" style={{ x: caretX }}
                animate={{ opacity: [1, 1, 0, 1, 0, 1, 0, 1] }}
                transition={{ duration: t(0.84), times: [0, 0.6, 0.66, 0.72, 0.78, 0.84, 0.9, 1], ease: ease.figmaSelect }}>|</motion.span>
            </div>

            <svg className="loader__icon" viewBox="0 0 24 24" fill="none" aria-hidden><path d="m6 9 6 6 6-6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <svg className="loader__icon" viewBox="0 0 24 24" fill="none" aria-hidden><rect x="9" y="3" width="6" height="11" rx="3" stroke="#fff" strokeWidth="1.5" /><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
