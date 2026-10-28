/**
 * Child-page hero CTA (services, specialties, states): one field that takes an email or a phone,
 * plus the primary "Get a free revenue assessment" button. On submit the contact is carried into
 * step 1 of the assessment form and the page scrolls there, so nothing is typed twice.
 */
import { useState } from 'react';
import { ArrowRight, Mail, ShieldCheck, Clock } from 'lucide-react';
import { prefillLead, isEmail, isPhone } from '../data/lead';
import { goAnchor } from '../router';

export function HeroCapture({ source }: { source?: string }) {
  const [v, setV] = useState('');
  const [err, setErr] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (v.trim() && !isEmail(v) && !isPhone(v)) { setErr(true); return; }
    if (v.trim()) prefillLead(v);
    goAnchor('assessment');
    window.setTimeout(() => (document.getElementById('f-name') as HTMLInputElement | null)?.focus({ preventScroll: true }), 900);
  };
  return (
    <form className="hcap" onSubmit={submit} data-source={source}>
      <div className={`hcap__row ${err ? 'is-err' : ''}`}>
        <span className="hcap__field">
          <Mail size={20} className="hcap__ic" aria-hidden />
          <input type="text" inputMode="email" autoComplete="email" aria-label="Work email or phone number" placeholder="Work email or phone"
            value={v} onChange={(e) => { setV(e.target.value); setErr(false); }} />
        </span>
        <button type="submit" className="hcap__btn">Get a free revenue assessment <ArrowRight size={18} /></button>
      </div>
      <p className="hcap__fine">
        {err ? <span className="hcap__err">Enter a valid email or a 10-digit US phone number.</span> : (
          <><span><ShieldCheck size={14} /> HIPAA-compliant, no spam</span><span><Clock size={14} /> Free, takes 20 seconds</span></>
        )}
      </p>
    </form>
  );
}
