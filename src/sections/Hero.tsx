import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { CountUp, SplitWords, UsFlag } from '../components/ui';
import { HeroCarousel } from './HeroCarousel';
import { ease } from '../motion';
import { Users, BadgeCheck } from 'lucide-react';
import { HeroCapture } from '../components/HeroCapture';
import hipaa from '../assets/hipaa-badge.png';

export function Hero({ show }: { show: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-18%']);
  const contentO = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const mediaY = useTransform(scrollYProgress, [0, 1], ['0rem', '12rem']);

  const d = 0.55; // base delay after the curtain starts lifting
  const up = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: show ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.8, ease: ease.out, delay: d + delay },
  });

  return (
    <section className="hero" id="top" ref={ref}>
      <motion.div className="hero__content" style={{ y: contentY, opacity: contentO }}>
        <div className="hero__copy">
          <motion.p className="eyebrow hero__eyebrow" {...up(0.1)}><UsFlag className="hero__flag" />/ Revenue cycle management for U.S. practices</motion.p>
          <SplitWords as="h1" className="hero__title" animateNow={show} delay={d + 0.2} stagger={0.06}
            lines={['You care for patients.', 'We make sure you get paid.']} bold={['paid.']} />
          <motion.p className="hero__sub" {...up(0.55)}>
            US-based certified coders, billers and A/R specialists who work inside your EHR, in your time zone, to cut denials, speed up payments and give your staff their time back.
          </motion.p>
          <div className="hero__stats">
            <motion.div className="hero__stat" {...up(0.7)}>
              <CountUp className="hero__num" prefix="$" value={20} suffix="B+" start={show} delay={d + 0.8} duration={1.8} />
              <span>Collections managed annually</span>
            </motion.div>
            <motion.div className="hero__stat" {...up(0.8)}>
              <CountUp className="hero__num" value={40} suffix="+" start={show} delay={d + 0.9} duration={1.8} />
              <span>Years of RCM experience</span>
            </motion.div>
          </div>
        </div>
        <motion.div {...up(1)}><HeroCapture source="home" /></motion.div>
        <motion.div className="hero__trusted" {...up(1.2)}>
          <p className="eyebrow">Certified by</p>
          <div className="hero__certs">
            <div className="hero__certi"><span className="hero__badge"><img src={hipaa} alt="" className="hero__hipaa" /></span><span className="hero__cert"><b>HIPAA compliant</b><small>BAA signed with every client</small></span></div>
            <div className="hero__certi"><span className="hero__badge hero__badge--ic"><Users /></span><span className="hero__cert"><b>30+ US-based</b><small>billers and coders</small></span></div>
            <div className="hero__certi"><span className="hero__badge hero__badge--ic"><BadgeCheck /></span><span className="hero__cert"><b>Certified coders</b><small>CPC, CCS and specialty credentials</small></span></div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div className="hero__media" style={{ y: mediaY }}
        initial={{ clipPath: 'inset(8% 8% 8% 8% round 2.4rem)', opacity: 0 }}
        animate={show ? { clipPath: 'inset(0% 0% 0% 0% round 2.4rem)', opacity: 1 } : {}}
        transition={{ duration: 1.3, ease: ease.curtain, delay: d }}>
        <HeroCarousel play={show} />
      </motion.div>
    </section>
  );
}
