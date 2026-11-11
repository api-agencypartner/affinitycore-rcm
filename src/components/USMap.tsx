/**
 * US map (Albers USA, 975 × 610). Every state has its own page: hover shows its name, click opens it.
 * Hover or focus shows a label. Paths come from us-atlas, see data/usMap.ts.
 */
import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { US_STATES, US_BORDERS, US_VIEWBOX } from '../data/usMap';
import { STATES } from '../data/states';
import { go } from '../router';

export function USMap({ active, onActive }: { active?: string | null; onActive?: (id: string | null) => void }) {
  const [hover, setHover] = useState<string | null>(null);
  const page = useMemo(() => Object.fromEntries(STATES.map((s) => [s.id, s])), []);
  const hot = hover ?? active ?? null;
  const set = (id: string | null) => { setHover(id); onActive?.(id); };
  const lab = hot ? US_STATES.find((s) => s.id === hot) : null;
  return (
    <div className="usm [&_svg]:[display:block] [&_svg]:[width:100%] [&_svg]:[height:auto] [&_svg]:[overflow:visible]">
      <svg viewBox={US_VIEWBOX} role="img" aria-label="Map of the United States. Every state links to its billing page.">
        <g className="usm__states">
          {US_STATES.map((s) => {
            const p = page[s.id];
            return (
              <path key={s.id} d={s.d}
                className={String.raw`usm__st [fill:#ddd3ff] [transition:fill_0.3s] [outline:none] [&:hover]:[fill:#c4b5ff] [&.is-hot]:[fill:#c4b5ff] [&.is-page]:[fill:#d9cfff] [&.is-page]:[cursor:pointer] [&.is-page]:[transition:fill_0.35s_cubic-bezier(.22,1,.36,1)] [&.is-page:hover]:[fill:var(--purple)] [&.is-page.is-hot]:[fill:var(--purple)] [&.is-page:focus-visible]:[fill:var(--purple)] [&.is-page:focus-visible]:[stroke:#140b30] [&.is-page:focus-visible]:[stroke-width:2] ${p ? String.raw`is-page [.stf\_\_legend_i&]:[background:var(--purple)]` : ''} ${hot === s.id ? 'is-hot' : ''}`}
                tabIndex={p ? 0 : -1} role={p ? 'link' : undefined} aria-label={p ? `${s.name} billing` : undefined}
                onMouseEnter={() => set(s.id)} onMouseLeave={() => set(null)} onFocus={() => set(s.id)} onBlur={() => set(null)}
                onClick={() => p && go(`/states/${p.slug}`)} onKeyDown={(e) => { if (p && e.key === 'Enter') go(`/states/${p.slug}`); }} />
            );
          })}
        </g>
        <path className="usm__borders [fill:none] [stroke:#fff] [stroke-width:1] [stroke-linejoin:round] [pointer-events:none]" d={US_BORDERS} />
        {lab && (
          <g transform={`translate(${lab.cx} ${lab.cy - 22})`} pointerEvents="none" className="usm__tip [&_rect]:[fill:#140b30] [&_text]:[fill:#fff] [&_text]:[font-family:var(--f-sans)] [&_text]:[font-size:13px] [&_text]:[font-weight:500]">
            <rect x={-((lab.name.length * 7.6 + (page[lab.id] ? 44 : 0)) / 2) - 12} y="-30" width={lab.name.length * 7.6 + (page[lab.id] ? 44 : 0) + 24} height="30" rx="15" />
            <text y="-10" textAnchor="middle">{lab.name}{page[lab.id] ? '  →' : ''}</text>
          </g>
        )}
      </svg>
    </div>
  );
}

/** One state's outline, cropped to its own bounds (hero card on a state page). */
export function StateShape({ id, className }: { id: string; className?: string }) {
  const s = US_STATES.find((x) => x.id === id);
  const box = useMemo(() => {
    if (!s) return '0 0 10 10';
    const nums = s.d.match(/-?\d+(\.\d+)?/g)!.map(Number);
    const xs = nums.filter((_, i) => i % 2 === 0), ys = nums.filter((_, i) => i % 2 === 1);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const pad = Math.max(x1 - x0, y1 - y0) * 0.06;
    return `${x0 - pad} ${y0 - pad} ${x1 - x0 + pad * 2} ${y1 - y0 + pad * 2}`;
  }, [s]);
  if (!s) return null;
  return (
    <svg className={className} viewBox={box} aria-hidden preserveAspectRatio="xMidYMid meet">
      <motion.path d={s.d} initial={{ pathLength: 0, fillOpacity: 0 }} animate={{ pathLength: 1, fillOpacity: 1 }} transition={{ pathLength: { duration: 1.6, ease: 'easeInOut' }, fillOpacity: { duration: 0.8, delay: 1.2 } }} />
    </svg>
  );
}
