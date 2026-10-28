import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Form, XrayReadout } from './ClaimXray';
import { go } from '../router';
import { BOX } from './ClaimXray';

/**
 * Service-page hero: a close-up of the same CMS-1500 used on the Services overview.
 * The camera pans across the form between the boxes this service owns, with the x-ray lens on each.
 * Hover pauses the camera; the lens then follows the cursor and the readout names any box.
 */
export const SERVICE_BOXES: Record<string, string[]> = {
  credentialing: ['33', '24J', '25', '32'],
  'charge-entry': ['24F', '24A', '24G', '28'],
  'medical-coding': ['24D', '21', '14'],
  'medical-billing': ['1a', '23', '24B', '11'],
  'payment-posting': ['29', '28'],
  'denial-management': ['22', '24D', '23'],
  'ar-recovery': ['26', '29'],
  'medical-billing-audits': ['24E', '21', '31'],
  'revenue-cycle-management': ['*', '33', '24D', '29'],
  'peer-to-peer-review': ['23', '21', '24D'],
};

/** What each service does with its own boxes (shown while the camera tours them). */
const L: Record<string, Record<string, string>> = {
  credentialing: { '33': 'If this NPI isn’t enrolled with the payer, nothing on this form gets paid.', '24J': 'The rendering provider has to be enrolled too, not just the group.', '25': 'Tax ID and NPI have to match the payer’s enrollment file exactly.', '32': 'Every location you bill from has to be on the payer’s file.' },
  'charge-entry': { '24F': 'Every service on the superbill becomes a charged line.', '24A': 'Each charge gets the date it actually happened.', '24G': 'Units entered to match what was actually done.', '28': 'Totals reconciled to the superbill before the claim moves on.' },
  'payment-posting': { '28': 'Billed against paid, line by line: the gap is where underpayments hide.' },
  'denial-management': { '24D': 'When a line is denied for a code or modifier, it’s corrected here and resubmitted.', '23': 'No auth on file is a top denial reason. We request retro-auth and appeal.' },
  'ar-recovery': { '29': 'Still $0.00 after 30 days? The claim goes on the follow-up list.' },
  'peer-to-peer-review': { '23': 'Denied as not medically necessary? The approval number lands here once the call turns it around.', '21': 'The diagnosis has to carry the case: we match it to the criteria the plan cited.', '24D': 'The exact service denied, with the chart evidence that supports it.' },
  'medical-billing-audits': { '21': 'Audits check that every diagnosis supports the lines that point to it.' },
  'revenue-cycle-management': { '33': 'Enrollment handled by the same team that bills.', '24D': 'Coding by the same team, so fixes travel upstream.', '29': 'Posted and followed up until every line is paid.' },
};

function local(f: HTMLElement, id: string) {
  if (id === '*') return { x: f.offsetWidth / 2, y: f.offsetHeight / 2, r: Math.hypot(f.offsetWidth, f.offsetHeight) / 2 + 20 };
  const el = f.querySelector<HTMLElement>(`[data-box="${id}"]`); if (!el) return null;
  let x = el.offsetWidth / 2, y = el.offsetHeight / 2, n: HTMLElement | null = el;
  while (n && n !== f) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent as HTMLElement | null; }
  return { x, y, r: Math.max(80, Math.min(140, el.offsetWidth * 0.7)) };
}

export function ClaimFocus({ slug }: { slug: string }) {
  const boxes = SERVICE_BOXES[slug] ?? ['*'];
  const stageRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const [active, setActive] = useState(boxes[0]);
  const [hover, setHover] = useState(false);
  const [typed, setTyped] = useState(false);
  const [size, setSize] = useState({ w: 0, h: 0 });

  const camX = useSpring(useMotionValue(0), { stiffness: 60, damping: 18, mass: 1 });
  const camY = useSpring(useMotionValue(0), { stiffness: 60, damping: 18, mass: 1 });
  const camZ = useSpring(useMotionValue(1), { stiffness: 60, damping: 18, mass: 1 });
  const lx = useSpring(useMotionValue(0), { stiffness: 170, damping: 24, mass: 0.6 });
  const ly = useSpring(useMotionValue(0), { stiffness: 170, damping: 24, mass: 0.6 });
  const lr = useSpring(useMotionValue(0), { stiffness: 120, damping: 20 });
  const clip = useTransform([lx, ly, lr], ([x, y, r]: number[]) => `circle(${r}px at ${x}px ${y}px)`);
  const ringS = useTransform(lr, (r) => r * 2);

  useLayoutEffect(() => {
    const m = () => setSize({ w: stageRef.current?.offsetWidth ?? 0, h: stageRef.current?.offsetHeight ?? 0 });
    m(); window.addEventListener('resize', m); return () => window.removeEventListener('resize', m);
  }, []);
  useEffect(() => { const t = setTimeout(() => setTyped(true), 300); return () => clearTimeout(t); }, []);

  // Camera + lens for the current stop
  useEffect(() => {
    const f = formRef.current; if (!f || !size.w) return;
    const id = boxes[i]; const c = local(f, id); if (!c) return;
    const fw = f.offsetWidth, fh = f.offsetHeight;
    const narrow = size.w < 700;
    let z: number, x: number, y: number;
    if (id === '*') { z = Math.min(size.w / fw, size.h / fh) * 0.92; x = (size.w - fw * z) / 2; y = (size.h - fh * z) / 2; }
    else { z = narrow ? 0.62 : 1.12; x = size.w * 0.55 - c.x * z; y = size.h * 0.42 - c.y * z; }
    camX.set(x); camY.set(y); camZ.set(z);
    if (!hover) { lx.set(c.x); ly.set(c.y); lr.set(id === '*' ? c.r : c.r); setActive(id); }
  }, [i, size, hover, boxes, camX, camY, camZ, lx, ly, lr]);

  const inView = useInView(stageRef, { amount: 0.15 }); // perf: tour pauses off-screen
  useEffect(() => {
    if (hover || !typed || boxes.length < 2 || !inView) return;
    const t = setInterval(() => setI((v) => (v + 1) % boxes.length), 3200);
    return () => clearInterval(t);
  }, [hover, typed, boxes.length, inView]);

  // Hover: lens follows the pointer (re-read every frame while the camera settles)
  const ptr = useRef<{ x: number; y: number } | null>(null);
  const dirty = useRef(true);
  useEffect(() => {
    if (!hover) return;
    let raf = 0;
    const settleUntil = performance.now() + 1300; // camera still moving
    const onScroll = () => { dirty.current = true; };
    window.addEventListener('scroll', onScroll, { passive: true });
    const tick = () => {
      const f = formRef.current; const p = ptr.current;
      if (f && p && (dirty.current || performance.now() < settleUntil)) {
        dirty.current = false;
        const rect = f.getBoundingClientRect(); const k = rect.width / f.offsetWidth;
        lx.set((p.x - rect.left) / k); ly.set((p.y - rect.top) / k); lr.set(100);
        const hit = (document.elementFromPoint(p.x, p.y) as Element | null)?.closest('[data-box]')?.getAttribute('data-box');
        if (hit) setActive((a) => (a === hit ? a : hit));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); };
  }, [hover, lx, ly, lr]);

  return (
    <div className="cf" ref={stageRef}
      onPointerEnter={(e) => { if (e.pointerType !== 'touch') setHover(true); }}
      onPointerLeave={() => { setHover(false); ptr.current = null; }}
      onPointerMove={(e) => { if (e.pointerType !== 'touch') { ptr.current = { x: e.clientX, y: e.clientY }; dirty.current = true; } }}>
      <motion.div className="cf-cam" style={{ x: camX, y: camY, scale: camZ, transformOrigin: '0 0' }}
        onClick={(e) => {
          const hit = (e.target as Element).closest('[data-box]')?.getAttribute('data-box');
          if (!hit) return;
          if (hover) { const target = BOX[hit].slug; if (target !== slug) go(`/services/${target}`); }
          else { const k = boxes.indexOf(hit); if (k >= 0) setI(k); }
        }}>
        <div className="cx-paper" ref={formRef}>
          <Form active={active} typed={typed} />
          <motion.div className="cx-xwrap" style={{ clipPath: clip, WebkitClipPath: clip }} aria-hidden><Form xray active={active} typed /></motion.div>
          <motion.span className="cx-ring" style={{ x: lx, y: ly, width: ringS, height: ringS }} aria-hidden />
        </div>
      </motion.div>
      <XrayReadout className="cf-read" active={active} stop={i} hover={hover} steps={boxes} label="X-ray · the boxes we own"
        override={!hover && boxes.includes(active) ? { title: BOX[active].title, slug, line: L[slug]?.[active] ?? BOX[active].line } : undefined} />
    </div>
  );
}
