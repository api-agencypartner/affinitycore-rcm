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
    <div className="ghl" style={{ minHeight }}>
      <AnimatePresence>
        {!loaded && (
          <motion.div className="ghl__skel" aria-hidden exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
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
        <p className="ghl__fallback">
          The form is taking a while to load.{' '}
          <a href={SRC} target="_blank" rel="noopener noreferrer">Open it in a new tab <ExternalLink size={14} /></a>{' '}
          or <a href="tel:+12148512698"><Phone size={14} /> call 214-851-2698</a>.
        </p>
      )}
    </div>
  );
}
