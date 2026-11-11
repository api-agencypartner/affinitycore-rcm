/**
 * Homepage fold: where we bill. A US map (every state clickable through to its own page) beside short copy,
 * the three state links with each state's Medicare contractor, and a line for everyone else.
 */
import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, MapPin } from 'lucide-react';
import { Eyebrow, Reveal, SplitWords } from '../components/ui';
import { USMap } from '../components/USMap';
import { STATES, FEATURED } from '../data/states';
import { Link } from '../router';
import { ease, vp } from '../motion';

export function StatesFold() {
  const [active, setActive] = useState<string | null>(null);
  return (
    <section className="stf container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [padding-top:14rem] [@media(max-width:_1279px)]:[padding-top:10rem]" id="states">
      <div className="stf__panel [display:grid] [grid-template-columns:minmax(0,_0.9fr)_minmax(0,_1.1fr)] [gap:5.6rem] [align-items:center] [padding:6.4rem] [border-radius:4rem] [background:linear-gradient(160deg,_#f6f2ff_0%,_#fbfaff_60%,_#f1ecff_100%)] [border:1px_solid_#eee9ff] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1279px)]:[gap:4rem] [@media(max-width:_1279px)]:[padding:4.8rem_3.2rem] [@media(max-width:_1279px)]:[border-radius:3.2rem] [@media(max-width:_640px)]:[padding:3.2rem_1.8rem]">
        <div className="stf__copy [display:flex] [flex-direction:column] [gap:1.6rem] [min-width:0]">
          <Eyebrow>/ States we serve</Eyebrow>
          <SplitWords className="h-56 [font-weight:500] [font-size:5.6rem] [line-height:1.08] [letter-spacing:-0.12rem] [color:var(--ink-2)] [text-wrap:balance] [@media(max-width:_1279px)]:[font-size:3.8rem] [@media(max-width:_640px)]:[font-size:3.4rem]" lines={['Billing in all 50 states,', 'by people who know each one.']} stagger={0.04} />
          <Reveal as="p" className="stf__p [font-size:1.8rem] [line-height:1.6] [color:#4a4f63] [max-width:58rem]">
            Every state has its own Medicare contractor, Medicaid plans and prompt-pay deadline. We bill practices across the US from our Plano, Texas office, in your time zone, with each state’s rules built into the work.
          </Reveal>
          <ul className="stf__list [display:flex] [flex-direction:column] [gap:1rem] [margin-top:1.2rem]">
            {FEATURED.slice(0, 3).map((slug) => STATES.find((x) => x.slug === slug)!).map((s, i) => (
              <motion.li key={s.slug} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 0.6, ease: ease.out, delay: 0.1 + i * 0.08 }}>
                <Link to={`/states/${s.slug}`} className={String.raw`stf__st [display:grid] [grid-template-columns:5.2rem_minmax(0,_1fr)_2rem] [gap:1.6rem] [align-items:center] [padding:1.4rem_1.8rem_1.4rem_1.4rem] [border-radius:1.8rem] [background:#fff] [border:1px_solid_#ece8fa] [transition:border-color_0.3s,_box-shadow_0.4s,_transform_0.4s_cubic-bezier(.16,1,.3,1)] [&:hover]:[border-color:var(--purple)] [&:hover]:[box-shadow:0_1.6rem_4rem_rgba(106,_65,_249,_0.14)] [&:hover]:[transform:translateX(0.4rem)] [&.is-on]:[border-color:var(--purple)] [&.is-on]:[box-shadow:0_1.6rem_4rem_rgba(106,_65,_249,_0.14)] [&.is-on]:[transform:translateX(0.4rem)] [@media(max-width:_640px)]:[grid-template-columns:4.4rem_minmax(0,_1fr)_1.8rem] [@media(max-width:_640px)]:[padding:1.2rem] ${active === s.id ? String.raw`is-on [.assess\_\_steps_span&]:[color:var(--navy)] [.assess\_\_steps_span&_b]:[background:var(--purple)] [.assess\_\_steps_span&_b]:[border-color:var(--purple)] [.assess\_\_steps_span&_b]:[color:#fff] [.assess\_\_steps_i&::after]:[transform:scaleX(1)] [.cx-read\_\_n_i&]:[width:2.4rem] [.cx-read\_\_n_i&]:[background:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [.sg\_\_toc_button&]:[color:var(--purple)] [.sg\_\_toc_button&]:[border-left-color:var(--purple)] [.pg\_\_toc_button&]:[color:#fff] [.pg\_\_toc_button&_small]:[color:rgba(255,_255,_255,_0.7)] [.pg\_\_dots_i&]:[width:2.4rem] [.pg\_\_dots_i&]:[background:var(--purple)] [.stfd\_\_tabs_button&]:[color:#fff] [.se\_\_dots_i&]:[width:6.4rem] [.sw-anes\_\_bar_i&]:[background:var(--grad)] [.sw-body_circle&]:[fill:var(--purple)] [.sw-vial\_\_body_i&]:[background:var(--grad)] [.sw-vial\_\_body_i&_small]:[color:#fff] [.sw-wound\_\_grid_i&]:[background:#c9b8ff] [.sw-wound\_\_grid_i&]:[border-color:transparent] [.sw-cal_i&]:[background:var(--purple)] [.sw-cal_i&]:[color:#fff] [.sw-wells_i&]:[background:#e2d9ff] [.sw-wells_i&]:[border-color:#c9b8ff] [.sw-shot_i&]:[background:var(--purple)] [.sw-shot_i&]:[border-color:var(--purple)] [.lf\_\_seg_button&]:[color:#fff] [.tc\_\_why_li&]:[opacity:1] [.sl\_\_tabs_button&]:[color:#fff] [.ar\_\_toc_a&]:[color:var(--ink-2)] [.ct-needs_button&]:[color:#fff] [.wa\_\_zones_li&]:[background:var(--grad)] [.wa\_\_zones_li&]:[border-color:transparent] [.wa\_\_zones_li&_small]:[color:#fff] [.wa\_\_zones_li&_b]:[color:#fff] [.wa\_\_zones_li&_em]:[color:#fff] [.se\_\_dots_i&]:[background:var(--purple)] [.ct-needs_button&]:[background:var(--grad)] [.ct-needs_button&]:[border-color:transparent] [.sc-cal_i&]:[background:var(--purple)] [.sc-cal_i&]:[color:#fff] [.ccp_button&]:[background:var(--purple)] [.ccp_button&]:[color:#fff] [.pa-art\_\_seg_button&]:[background:var(--grad)] [.pa-art\_\_seg_button&]:[color:#fff] [.pa-art\_\_steps_li&]:[background:var(--purple)] [.pa-art\_\_steps_li&]:[border-color:var(--purple)] [.pa-art\_\_steps_li&]:[color:#fff] [.ab-orbit\_\_rings_line&]:[stroke:var(--purple)] [.ab-orbit\_\_rings_line&]:[stroke-width:2]` : ''}`}
                  onMouseEnter={() => setActive(s.id)} onMouseLeave={() => setActive(null)} onFocus={() => setActive(s.id)} onBlur={() => setActive(null)}>
                  <span className="stf__abbr [width:5.2rem] [height:5.2rem] [border-radius:1.4rem] [display:grid] [place-items:center] [background:var(--grad)] [color:#fff] [font-family:var(--f-mono)] [font-weight:600] [font-size:1.7rem] [@media(max-width:_640px)]:[width:4.4rem] [@media(max-width:_640px)]:[height:4.4rem] [@media(max-width:_640px)]:[font-size:1.5rem]">{s.abbr}</span>
                  <span className="stf__t [&_b]:[display:block] [&_b]:[font-weight:500] [&_b]:[font-size:2rem] [&_b]:[color:var(--ink-2)] [&_small]:[display:block] [&_small]:[margin-top:0.2rem] [&_small]:[font-size:1.4rem] [&_small]:[color:#6b6f7c] [&_small]:[white-space:nowrap] [&_small]:[overflow:hidden] [&_small]:[text-overflow:ellipsis]"><b>{s.name}</b><small>{s.chips.map(([, v]) => v).join(' · ')}</small></span>
                  <ArrowRight className="stf__go [color:var(--purple)]" size={18} />
                </Link>
              </motion.li>
            ))}
          </ul>
          <p className="stf__more [display:flex] [flex-wrap:wrap] [align-items:center] [gap:0.8rem] [margin-top:0.8rem] [font-size:1.6rem] [color:#5b5f72] [&_svg]:[color:var(--purple)] [@media(max-width:_1279px)]:[font-size:16px]! [@media(max-width:_1279px)]:[line-height:1.6]"><MapPin size={16} /> Every state has its own page. <Link to="/states" className="text-link [display:inline-flex] [align-items:center] [gap:0.8rem] [font-weight:500] [font-size:1.8rem] [color:var(--purple)] [&_svg]:[transition:transform_0.4s_cubic-bezier(.16,1,.3,1)] [&:hover_svg]:[transform:translateX(0.5rem)] [.est\_\_carried_&]:[margin-top:0.6rem] [.est\_\_carried_&]:[font-size:1.5rem] [.est\_\_carried_&]:[color:#fff] [.est\_\_carried_&]:[text-decoration:underline] [.est\_\_carried_&]:[text-underline-offset:0.3em] [.est\_\_carried_&]:[opacity:0.85]">See all 50 states <ArrowRight size={16} /></Link></p>
        </div>
        <motion.div className="stf__map [position:relative] [min-width:0] [@media(max-width:_1279px)]:[order:-1]" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 1, ease: ease.out }}>
          <USMap active={active} onActive={setActive} />
          <p className="stf__hint [margin-top:1.6rem] [text-align:center] [font-size:1.4rem] [color:#6b6f7c]">Hover any state, click to open its page.</p>
        </motion.div>
      </div>
    </section>
  );
}
