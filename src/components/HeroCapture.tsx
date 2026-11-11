/**
 * Child-page hero CTA (services, specialties, states): one field that takes an email or a phone,
 * plus the primary "Get a free revenue assessment" button. On submit the contact is carried into
 * step 1 of the assessment form and the page scrolls there, so nothing is typed twice.
 */
import { useLayoutEffect, useRef, useState } from 'react';
import { ArrowRight, Mail, ShieldCheck, Clock } from 'lucide-react';
import { prefillLead, isEmail, isPhone } from '../data/lead';
import { goAnchor } from '../router';

export function HeroCapture({ source }: { source?: string }) {
  const [v, setV] = useState('');
  const [err, setErr] = useState(false);
  const inp = useRef<HTMLInputElement>(null);
  // Edge case: shrink the type for very long emails so the whole address stays visible (desktop/tablet only)
  useLayoutEffect(() => {
    const el = inp.current; if (!el) return;
    el.style.removeProperty('--fs');
    if (window.innerWidth <= 640) return;
    const base = parseFloat(getComputedStyle(el).fontSize);
    let fs = base;
    while (el.scrollWidth > el.clientWidth + 1 && fs > Math.max(11.5, base * 0.8)) { fs -= 0.5; el.style.setProperty('--fs', `${fs}px`); }
  }, [v]);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (v.trim() && !isEmail(v) && !isPhone(v)) { setErr(true); return; }
    if (v.trim()) prefillLead(v);
    goAnchor('assessment');
    window.setTimeout(() => (document.getElementById('f-name') as HTMLInputElement | null)?.focus({ preventScroll: true }), 900);
  };
  return (
    <form className="hcap [width:100%] [max-width:640px] [&_input]:[flex:1] [&_input]:[min-width:0] [&_input]:[height:5.2rem] [&_input]:[border:0] [&_input]:[outline:none] [&_input]:[background:transparent] [&_input]:[font-family:inherit] [&_input]:[font-weight:inherit] [&_input]:[font-style:inherit] [&_input]:[line-height:inherit] [&_input]:[font-size:var(--fs,_max(13.5px,_1.55rem))] [&_input]:[color:var(--ink-2)] [&_input::placeholder]:[color:#9a98ab] [@media(max-width:_640px)]:[&_input]:[font-size:16px]" onSubmit={submit} data-source={source}>
      <div className={String.raw`hcap__row [display:flex] [align-items:center] [gap:0.6rem] [padding:0.6rem_0.6rem_0.6rem_2rem] [border-radius:10rem] [background:#fff] [border:1px_solid_var(--lav-border,_#e4e0f2)] [box-shadow:0_1.2rem_3.2rem_rgba(106,_65,_249,_0.08)] [transition:border-color_0.3s,_box-shadow_0.3s] [&:focus-within]:[border-color:var(--purple)] [&:focus-within]:[box-shadow:0_0_0_0.4rem_rgba(106,_65,_249,_0.12),_0_1.2rem_3.2rem_rgba(106,_65,_249,_0.1)] [&.is-err]:[border-color:#e5484d] [@media(max-width:_640px)]:[flex-direction:column] [@media(max-width:_640px)]:[align-items:stretch] [@media(max-width:_640px)]:[padding:0.6rem] [@media(max-width:_640px)]:[border-radius:2rem] ${err ? 'is-err' : ''}`}>
        <span className="hcap__field [flex:1] [min-width:0] [display:flex] [align-items:center] [gap:1rem] [@media(max-width:_640px)]:[padding-left:1.4rem]">
          <Mail size={20} className="hcap__ic [flex:none] [color:var(--purple)]" aria-hidden />
          <input ref={inp} type="text" inputMode="email" autoComplete="email" aria-label="Work email or phone number" placeholder="Work email or phone"
            value={v} onChange={(e) => { setV(e.target.value); setErr(false); }} />
        </span>
        <button type="submit" className="hcap__btn [flex:none] [display:inline-flex] [align-items:center] [gap:0.8rem] [height:5.6rem] [padding-inline:2.6rem_2.2rem] [border-radius:10rem] [background:var(--purple)] [color:#fff] [font-weight:500] [font-size:1.7rem] [white-space:nowrap] [transition:background_0.3s] [&:hover]:[background:#5a33e6] [&_svg]:[transition:transform_0.4s_cubic-bezier(.16,1,.3,1)] [&:hover_svg]:[transform:translateX(0.4rem)] [@media(max-width:_640px)]:[justify-content:center] [@media(max-width:_640px)]:[font-size:16px]">Get a free revenue assessment <ArrowRight size={18} /></button>
      </div>
      <p className="hcap__fine [display:flex] [flex-wrap:wrap] [gap:0.4rem_1.6rem] [margin-top:1.2rem] [padding-left:2rem] [font-size:1.4rem] [color:#6b6f7c] [&_span]:[display:inline-flex] [&_span]:[align-items:center] [&_span]:[gap:0.5rem] [&_svg]:[color:var(--purple)] [@media(max-width:_640px)]:[padding-left:0.4rem] [@media(max-width:_640px)]:[font-size:13px]">
        {err ? <span className="hcap__err [.hcap\_\_fine_&]:[color:#e5484d]">Enter a valid email or a 10-digit US phone number.</span> : (
          <><span><ShieldCheck size={14} /> HIPAA-compliant, no spam</span><span><Clock size={14} /> Free, takes 20 seconds</span></>
        )}
      </p>
    </form>
  );
}
