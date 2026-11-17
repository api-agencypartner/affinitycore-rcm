import { BASE } from '../router';

/** State flag (SVG in /public/flags), cropped to a 3:2 tile. Decorative: the state name always sits beside it. */
export function StateFlag({ abbr, className = '' }: { abbr: string; className?: string }) {
  return (
    <span className={`state-flag [display:inline-block] [flex:none] [overflow:hidden] [aspect-ratio:3/2] [border-radius:0.5rem] [box-shadow:0_0_0_1px_rgba(20,_11,_48,_0.12)] [background:#f3efff] ${className}`}>
      <img src={`${BASE}/flags/${abbr.toLowerCase()}.svg`} alt="" aria-hidden loading="lazy" decoding="async" className="[display:block] [width:100%] [height:100%] [object-fit:cover]" />
    </span>
  );
}
