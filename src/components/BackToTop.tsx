'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUp } from 'lucide-react';

/** Appears after 1.5 screens of scrolling; smooth-scrolls home (Lenis listens to native scroll). */
export function BackToTop({ onTop }: { onTop: () => void }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > window.innerHeight * 1.5);
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.button type="button" aria-label="Back to top" onClick={onTop}
          className="to-top [position:fixed] [right:3.2rem] [bottom:3.2rem] [z-index:80] [width:5.6rem] [height:5.6rem] [border-radius:50%] [display:grid] [place-items:center] [border:0] [cursor:pointer] [color:#fff] [background:var(--grad)] [box-shadow:0_1.2rem_3rem_rgba(106,_65,_249,_0.35)] [@media(max-width:_1279px)]:[width:48px] [@media(max-width:_1279px)]:[height:48px] [@media(max-width:_1279px)]:[right:16px] [@media(max-width:_1279px)]:[bottom:16px]"
          initial={{ opacity: 0, scale: 0.6, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.6, y: 20 }}
          whileHover={{ y: -4 }} whileTap={{ scale: 0.92 }} transition={{ type: 'spring', stiffness: 380, damping: 24 }}>
          <ArrowUp size={20} strokeWidth={2.2} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
