/**
 * Interactive featured cover for the CMS prior-auth article: a dial that runs the payer's decision clock
 * (urgent 72 hours / standard 7 days), with play/pause and a scrubber. Pauses off screen and for reduced motion.
 */
import { useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import type { Article } from '../data/insights';

export function PaClock({ a }: { a: Article }) {
  const [mode, setMode] = useState<'u' | 's'>('u');
  const [h, setH] = useState(0);
  const [playing, setPlaying] = useState(true);
  const vis = useRef(true);
  const box = useRef<HTMLDivElement>(null);
  const D = mode === 'u' ? 72 : 168;

  useEffect(() => {
    const el = box.current; if (!el || typeof IntersectionObserver === 'undefined') return;
    const o = new IntersectionObserver(([x]) => { vis.current = x.isIntersecting; }, { threshold: 0.1 });
    o.observe(el); return () => o.disconnect();
  }, []);
  useEffect(() => {
    let rm = false; try { rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { /* ignore */ }
    if (rm) { setH(Math.round(D * 0.62)); return; }
    if (!playing) return;
    let raf = 0, last = performance.now(), acc = 0;
    const CYC = 7000, HOLD = 2600;
    const step = (t: number) => {
      const dt = t - last; last = t;
      if (vis.current && !document.hidden) { acc += dt; const c = acc % (CYC + HOLD); setH(Math.min(1, c / CYC) * D); }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [mode, playing, D]);

  const fr = Math.min(1, h / D), left = Math.max(0, D - h), done = fr >= 0.999;
  const R = 56, C = 2 * Math.PI * R, ang = fr * 2 * Math.PI - Math.PI / 2;
  const kx = 70 + R * Math.cos(ang), ky = 70 + R * Math.sin(ang);
  const fmt = mode === 'u' ? `${Math.ceil(left)}h` : left >= 24 ? `${Math.floor(left / 24)}d ${Math.round(left % 24)}h` : `${Math.ceil(left)}h`;
  const stage = done ? 2 : fr < 0.1 ? 0 : 1;
  const stop = (x: React.SyntheticEvent) => x.stopPropagation();
  const ticks = mode === 'u' ? 24 : 28, major = mode === 'u' ? 6 : 4;

  return (
    <div ref={box} className="bc bc--big pa-art" role="group" aria-label="Interactive: how the prior authorization decision clock runs">
      <div className="pa-art__top">
        <span className="pa-art__kick"><i />Try it · {a.topic}</span>
        <div className="pa-art__seg" role="radiogroup" aria-label="Request type" onClick={stop}>
          {([['u', 'Urgent · 72 hrs'], ['s', 'Standard · 7 days']] as const).map(([k, l]) => (
            <button key={k} type="button" role="radio" aria-checked={mode === k} className={mode === k ? 'is-on' : ''}
              onClick={(x) => { x.stopPropagation(); setMode(k); setH(0); setPlaying(true); }}>{l}</button>
          ))}
        </div>
      </div>
      <div className="pa-art__dial">
        <svg viewBox="0 0 140 140" aria-hidden>
          <defs><linearGradient id="paGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#8a6bff" /><stop offset="1" stopColor="#6a41f9" /></linearGradient></defs>
          <circle cx="70" cy="70" r="67" className="pa-art__face" />
          {Array.from({ length: ticks }, (_, i) => {
            const t = (i / ticks) * 2 * Math.PI - Math.PI / 2, big = i % (ticks / major) === 0, r1 = big ? 44 : 46.5;
            return <line key={i} x1={70 + r1 * Math.cos(t)} y1={70 + r1 * Math.sin(t)} x2={70 + 49 * Math.cos(t)} y2={70 + 49 * Math.sin(t)}
              className={`pa-art__tick ${big ? 'is-major' : ''} ${i / ticks <= fr ? 'is-past' : ''}`} />;
          })}
          <circle cx="70" cy="70" r={R} className="pa-art__track" />
          <circle cx="70" cy="70" r={R} className="pa-art__arc" strokeDasharray={C} strokeDashoffset={C * (1 - fr)} />
          <circle cx={kx} cy={ky} r="6" className="pa-art__knob" />
        </svg>
        <div className="pa-art__c">
          {done ? <>
            <span className="pa-art__ok"><Check size={22} strokeWidth={3} /></span>
            <b className="pa-art__b--sm">Decision due</b>
            <small>with a specific reason if denied</small>
          </> : <>
            <small>Payer must decide in</small>
            <b>{fmt}</b>
            <small>{mode === 'u' ? 'urgent request' : 'standard request'}</small>
          </>}
        </div>
      </div>
      <ol className="pa-art__steps" aria-hidden>
        {['Request sent', 'Payer review', 'Decision'].map((l, i) => <li key={l} className={i === stage ? 'is-on' : i < stage ? 'is-done' : ''}>{l}</li>)}
      </ol>
      <div className="pa-art__scrub" onClick={stop} onPointerDown={stop}>
        <button type="button" className="pa-art__play" aria-label={playing ? 'Pause' : 'Play'} onClick={(x) => { x.stopPropagation(); setPlaying(!playing); }}>{playing ? '❚❚' : '▶'}</button>
        <input type="range" min={0} max={D} step={1} value={Math.round(h)} aria-label="Hours since the request was sent" onChange={(x) => { setPlaying(false); setH(+x.target.value); }} />
      </div>
      <p className="pa-art__src">CMS-0057-F · Medicare Advantage, Medicaid &amp; CHIP · since Jan 1, 2026</p>
    </div>
  );
}
