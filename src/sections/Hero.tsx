import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { CountUp, SplitWords, UsFlag } from '../components/ui';
import { HeroCarousel } from './HeroCarousel';
import { ease } from '../motion';
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
    <section className="hero [--media:min(72rem,_calc(100svh_-_19rem))] [position:relative] [display:grid] [grid-template-columns:minmax(0,_1fr)_var(--media)] [gap:6rem] [align-items:center] [padding:16.4rem_var(--gutter)_4rem] [@media(max-width:_1279px)]:[height:auto] [@media(max-width:_1279px)]:[--media:calc(100vw_-_4rem)] [@media(max-width:_1279px)]:[padding:12rem_2rem_0] [@media(max-width:_1279px)]:[min-height:0] [@media(max-width:_1279px)]:[gap:4rem] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)] [@media(min-width:_768px)_and_(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)_minmax(0,_0.9fr)] [@media(min-width:_768px)_and_(max-width:_1279px)]:[align-items:center] [@media(min-width:_768px)_and_(max-width:_1279px)]:[padding-top:14rem] [@media(min-width:_1280px)]:[min-height:100svh] [@media(min-width:_1280px)]:[padding-top:10.8rem] [@media(min-width:_1280px)]:[padding-bottom:2.4rem] [@media(min-width:_1280px)]:[align-content:center] [@media(min-width:_1280px)]:[align-items:center] [@media(min-width:_1280px)]:[box-sizing:border-box]" id="top" ref={ref}>
      <motion.div className="hero__content [display:flex] [flex-direction:column] [align-items:flex-start] [@media(max-width:_1279px)]:[padding-top:2rem] [will-change:transform] [&>div:has(>.hcap)]:[align-self:stretch] [&>div:has(>.hcap)]:[max-width:640px] [@media(min-width:_1280px)]:[justify-content:center]" style={{ y: contentY, opacity: contentO }}>
        <div className="hero__copy [display:flex] [flex-direction:column] [@media(max-width:_1279px)]:[margin-top:0] [gap:0] [margin-bottom:4.8rem] [@media(max-width:_1279px)]:[margin-bottom:3.6rem]">
          <motion.p className="eyebrow hero__eyebrow [font-family:var(--f-mono)] [font-size:1.6rem] [line-height:1.4] [text-transform:uppercase] [color:var(--ink)] [letter-spacing:0.02em] [.hero\_\_copy_&]:[margin-bottom:1.2rem] [display:flex] [align-items:center] [gap:1rem] [.stmac\_\_intro_&]:[grid-column:1_/_-1]" {...up(0.1)}><UsFlag className="hero__flag [width:2.2rem]" />/ Revenue cycle management for U.S. practices</motion.p>
          <SplitWords as="h1" className="hero__title [font-weight:500] [font-size:6.12rem] [line-height:1.06] [letter-spacing:-0.18rem] [color:var(--ink-3)] [@media(max-width:_1279px)]:[font-size:4.32rem] [@media(max-width:_1279px)]:[overflow-wrap:anywhere] [@media(max-width:_640px)]:[font-size:4rem]" animateNow={show} delay={d + 0.2} stagger={0.06}
            lines={['You care for patients.', 'We make sure you get paid.']} bold={['paid.']} />
          <motion.p className="hero__sub [font-size:1.8rem] [line-height:1.55] [color:#4a4f63] [max-width:58rem] [.hero\_\_copy_&]:[margin-top:2rem] [@media(max-width:_1279px)]:[font-size:16px]! [@media(max-width:_1279px)]:[line-height:1.6]" {...up(0.55)}>
            US-based certified coders, billers and A/R specialists who work inside your EHR, in your time zone, to cut denials, speed up payments and give your staff their time back.
          </motion.p>
          <div className="hero__stats [display:flex] [align-items:center] [gap:4rem] [@media(max-width:_1279px)]:[flex-wrap:wrap] [@media(max-width:_1279px)]:[gap:2.4rem] [.hero\_\_copy_&]:[margin-top:4rem] [@media(max-width:_1279px)]:[.hero\_\_copy_&]:[margin-top:3.2rem]">
            <motion.div className="hero__stat [display:flex] [flex-direction:column] [gap:0.2rem] [&>span:not(.hero\_\_num)]:[font-size:1.53rem] [&>span:not(.hero\_\_num)]:[color:#4a4f63] [@media(max-width:_1279px)]:[&>span:not(.hero\_\_num)]:[font-size:16px]! [@media(max-width:_1279px)]:[&>span:not(.hero\_\_num)]:[line-height:1.6]" {...up(0.7)}>
              <CountUp className="hero__num [.hero\_\_stat_&]:[display:block] [.hero\_\_stat_&]:[font-family:'Instrument_Sans',_var(--f-sans)] [.hero\_\_stat_&]:[font-weight:600] [.hero\_\_stat_&]:[font-size:4.03rem] [.hero\_\_stat_&]:[line-height:1] [.hero\_\_stat_&]:[letter-spacing:-0.09rem] [.hero\_\_stat_&]:[color:var(--ink)] [@media(max-width:_1279px)]:[.hero\_\_stat_&]:[font-size:2.88rem]" prefix="$" value={20} suffix="B+" start={show} delay={d + 0.8} duration={1.8} />
              <span>Collections managed annually</span>
            </motion.div>
            <motion.div className="hero__stat [display:flex] [flex-direction:column] [gap:0.2rem] [&>span:not(.hero\_\_num)]:[font-size:1.53rem] [&>span:not(.hero\_\_num)]:[color:#4a4f63] [@media(max-width:_1279px)]:[&>span:not(.hero\_\_num)]:[font-size:16px]! [@media(max-width:_1279px)]:[&>span:not(.hero\_\_num)]:[line-height:1.6]" {...up(0.8)}>
              <CountUp className="hero__num [.hero\_\_stat_&]:[display:block] [.hero\_\_stat_&]:[font-family:'Instrument_Sans',_var(--f-sans)] [.hero\_\_stat_&]:[font-weight:600] [.hero\_\_stat_&]:[font-size:4.03rem] [.hero\_\_stat_&]:[line-height:1] [.hero\_\_stat_&]:[letter-spacing:-0.09rem] [.hero\_\_stat_&]:[color:var(--ink)] [@media(max-width:_1279px)]:[.hero\_\_stat_&]:[font-size:2.88rem]" value={40} suffix="+" start={show} delay={d + 0.9} duration={1.8} />
              <span>Years of RCM experience</span>
            </motion.div>
          </div>
        </div>
        <motion.div {...up(1)}><HeroCapture source="home" /></motion.div>
        <motion.div className="hero__trusted [display:flex] [flex-direction:column] [&_img]:[width:27.8rem] [margin-top:7.2rem] [gap:1.2rem] [@media(max-width:_1279px)]:[margin-top:5.6rem] [@media(min-width:_1280px)]:[margin-top:5.6rem]" {...up(1.2)}>
          <p className="eyebrow [font-family:var(--f-mono)] [font-size:1.6rem] [line-height:1.4] [text-transform:uppercase] [color:var(--ink)] [letter-spacing:0.02em] [.hero\_\_copy_&]:[margin-bottom:1.2rem] [.stmac\_\_intro_&]:[grid-column:1_/_-1]">Certified by</p>
          <div className="hero__certs [display:flex] [align-items:center] [flex-wrap:wrap] [gap:1.6rem_3.2rem]">
            <div className="hero__certi [display:flex] [align-items:center] [gap:1.4rem]"><span className="hero__badge [display:grid] [place-items:center] [padding:0.9rem_1.62rem] [border:1px_solid_#ebe7f7] [border-radius:1.44rem] [background:#fff] [box-shadow:0_0.8rem_2.4rem_rgba(40,_20,_120,_0.06)] [&_img]:[height:5.6rem] [&_img]:[width:auto]"><img src={hipaa} alt="" className="hero__hipaa [width:10.08rem] [height:5.58rem] [object-fit:contain]" /></span><span className="hero__cert [display:flex] [flex-direction:column] [gap:0.2rem] [&_b]:[font-weight:500] [&_b]:[font-size:1.6rem] [&_b]:[color:var(--ink-2)] [&_small]:[font-size:1.3rem] [&_small]:[color:#6b6f7c]"><b>HIPAA compliant</b><small>BAA signed with every client</small></span></div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div className="hero__media [position:relative] [width:var(--media)] [height:var(--media)] [will-change:transform,_clip-path] [@media(max-width:_1279px)]:[width:100%] [@media(max-width:_1279px)]:[height:auto] [@media(max-width:_1279px)]:[aspect-ratio:1] [@media(min-width:_768px)_and_(max-width:_1279px)]:[aspect-ratio:4_/_5]" style={{ y: mediaY }}
        initial={{ clipPath: 'inset(8% 8% 8% 8% round 2.4rem)', opacity: 0 }}
        animate={show ? { clipPath: 'inset(0% 0% 0% 0% round 2.4rem)', opacity: 1 } : {}}
        transition={{ duration: 1.3, ease: ease.curtain, delay: d }}>
        <HeroCarousel play={show} />
      </motion.div>
    </section>
  );
}
