/**
 * Featured-card artwork for the blog hub: an editorial desk scene made of UI pieces, not tied to one article.
 * A guide page with a highlighted line, a denial letter stamped "Fixed", a magnifier over a code,
 * a reading-progress card and topic chips that drift. Pure CSS/SVG, gentle float, still for reduced motion.
 */
import { motion, useReducedMotion } from 'motion/react';
import { BookOpen, Check, Search } from 'lucide-react';

const CHIPS: [string, string, string, number][] = [
  ['Prior auth', '8%', '14%', 0], ['Coding', '70%', '9%', 0.6], ['Denials', '40%', '6%', 1.2], ['A/R', '6%', '58%', 1.8], ['Credentialing', '40%', '91%', 2.4],
];

export function BlogArt() {
  const still = useReducedMotion();
  const float = (d: number, y = 8) => (still ? {} : { animate: { y: [0, -y, 0] }, transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' as const, delay: d } });
  return (
    <div className="bc bc--big ba" aria-hidden>
      <span className="ba__rings" />
      {/* back sheet: the guide */}
      <motion.div className="ba__sheet" initial={{ opacity: 0, rotate: -10, y: 30 }} animate={{ opacity: 1, rotate: -6, y: 0 }} transition={{ duration: 1.1, delay: 0.3 }}>
        <motion.div {...float(0, 6)}>
          <span className="ba__kick"><BookOpen size={13} /> Guide · 6 min</span>
          <b className="ba__h">Billing, explained in plain English.</b>
          <i className="ba__l" style={{ width: '92%' }} /><i className="ba__l" style={{ width: '84%' }} />
          <i className="ba__l ba__l--hi" style={{ width: '70%' }} />
          <i className="ba__l" style={{ width: '88%' }} /><i className="ba__l" style={{ width: '60%' }} />
          <span className="ba__mini"><i /><i /><i /><i /><i /></span>
        </motion.div>
      </motion.div>
      {/* front-left: denial letter, fixed */}
      <motion.div className="ba__letter" initial={{ opacity: 0, x: -30, rotate: 2 }} animate={{ opacity: 1, x: 0, rotate: 5 }} transition={{ duration: 1, delay: 0.55 }}>
        <motion.div {...float(1, 7)}>
          <small>Remittance advice</small>
          <span className="ba__code">CO-197</span>
          <i className="ba__l" style={{ width: '90%' }} /><i className="ba__l" style={{ width: '64%' }} />
          <motion.span className="ba__stamp" initial={{ scale: 1.6, opacity: 0, rotate: -18 }} animate={{ scale: 1, opacity: 1, rotate: -12 }} transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 1.5 }}><Check size={14} strokeWidth={3} /> Fixed</motion.span>
        </motion.div>
      </motion.div>
      {/* magnifier */}
      <motion.div className="ba__lens" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.9 }}>
        <motion.div {...float(0.4, 10)} className="ba__lens-in"><span>25</span><small>modifier</small><Search className="ba__lens-ic" size={18} /></motion.div>
      </motion.div>
      {/* reading progress */}
      <motion.div className="ba__prog" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.75 }}>
        <motion.div {...float(1.6, 6)}>
          <small>This month’s reading</small>
          <b>4 new guides</b>
          <span className="ba__bar"><motion.i initial={{ width: 0 }} animate={{ width: '72%' }} transition={{ duration: 1.6, delay: 1.2, ease: [0.16, 1, 0.3, 1] }} /></span>
        </motion.div>
      </motion.div>
      {CHIPS.map(([t, x, y, d]) => (
        <motion.span key={t} className="ba__chip" style={{ left: x, top: y }} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.6 + d * 0.2 }}>
          <motion.span {...float(d, 5)} style={{ display: 'inline-block' }}>{t}</motion.span>
        </motion.span>
      ))}
    </div>
  );
}
