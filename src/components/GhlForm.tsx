import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, ExternalLink } from 'lucide-react';

/**
 * The live GoHighLevel (LeadConnector) form used on rcm.affinitycore.co.
 * Same form ID as the production contact page, so submissions land in the client's GHL pipeline.
 * form_embed.js auto-resizes the iframe; we also show a skeleton while it loads and a fallback
 * (call / open form in a new tab) if it is blocked.
 */
export const GHL_FORM_ID = 'kqH0bBYXUvdSDkNhyt0a';
const SRC = `https://api.leadconnectorhq.com/widget/form/${GHL_FORM_ID}`;
const SCRIPT = 'https://link.msgsndr.com/js/form_embed.js';

export function GhlForm({ title = 'Request a call back', minHeight = 640 }: { title?: string; minHeight?: number }) {
  const [loaded, setLoaded] = useState(false);
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    if (!document.querySelector(`script[src="${SCRIPT}"]`)) {
      const s = document.createElement('script'); s.src = SCRIPT; s.async = true; document.body.appendChild(s);
    }
    const t = setTimeout(() => setSlow(true), 9000);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="ghl [position:relative] [border-radius:1.6rem] [background:#fff] [&_iframe]:[display:block] [.assess\_\_form_&]:[margin:0_-0.8rem]" style={{ minHeight }}>
      <AnimatePresence>
        {!loaded && (
          <motion.div className="ghl__skel [position:absolute] [inset:0] [padding:2.4rem] [display:flex] [flex-direction:column] [gap:1.6rem] [border-radius:1.6rem] [background:#fff] [pointer-events:none] [&_i]:[display:block] [&_i]:[height:5.2rem] [&_i]:[border-radius:1.2rem] [&_i]:[background:linear-gradient(90deg,_#f1edff_0%,_#e6dfff_40%,_#f1edff_80%)] [&_i]:[background-size:200%_100%]! [&_i]:[animation:ghl-sh_1.4s_ease-in-out_infinite] [&_b]:[display:block] [&_b]:[height:5.6rem] [&_b]:[margin-top:auto] [&_b]:[border-radius:6rem] [&_b]:[background:var(--grad-x)]! [&_b]:[opacity:0.35]" aria-hidden exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            {[0, 1, 2, 3, 4].map((i) => <i key={i} style={{ animationDelay: `${i * 0.12}s` }} />)}
            <b />
          </motion.div>
        )}
      </AnimatePresence>
      <iframe
        src={SRC}
        id={`inline-${GHL_FORM_ID}`}
        title={title}
        style={{ width: '100%', height: minHeight, border: 'none', borderRadius: '1.6rem', opacity: loaded ? 1 : 0, transition: 'opacity .5s' }}
        data-layout="{'id':'INLINE'}"
        data-trigger-type="alwaysShow"
        data-activation-type="alwaysActivated"
        data-deactivation-type="neverDeactivate"
        data-form-name="Free Medical Billing Audit"
        data-height={minHeight}
        data-layout-iframe-id={`inline-${GHL_FORM_ID}`}
        data-form-id={GHL_FORM_ID}
        onLoad={() => setLoaded(true)}
      />
      {!loaded && slow && (
        <p className="ghl__fallback [position:absolute] [left:2.4rem] [right:2.4rem] [bottom:10rem] [z-index:2] [padding:1.4rem_1.8rem] [border-radius:1.2rem] [background:#f6f3ff] [font-size:1.5rem] [color:#4a4f63] [line-height:1.6] [&_a]:[color:var(--purple)] [&_a]:[font-weight:500] [&_a]:[display:inline-flex] [&_a]:[align-items:center] [&_a]:[gap:0.4rem]">
          The form is taking a while to load.{' '}
          <a href={SRC} target="_blank" rel="noopener noreferrer">Open it in a new tab <ExternalLink size={14} /></a>{' '}
          or <a href="tel:+12148512698"><Phone size={14} /> call 214-851-2698</a>.
        </p>
      )}
    </div>
  );
}
