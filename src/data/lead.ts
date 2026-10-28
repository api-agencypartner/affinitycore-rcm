/**
 * Carries a contact typed in a child-page hero ("email or phone") down to the
 * assessment form, so step 1 opens pre-filled and the visitor never types it twice.
 * Step 1 of the form (name, phone, email) is captured on its own via `saveStep1`,
 * so sales can reach the visitor even if step 2 is never finished.
 */
import { useSyncExternalStore } from 'react';

export type Lead = { name?: string; email?: string; phone?: string };
let lead: Lead = {};
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());

export const isEmail = (v: string) => /\S+@\S+\.\S+/.test(v);
export const isPhone = (v: string) => v.replace(/\D/g, '').length >= 10;

export const prefillLead = (contact: string) => {
  const v = contact.trim();
  lead = { ...lead, ...(isEmail(v) ? { email: v } : { phone: v }) };
  emit();
};
export const useLead = () => useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f); }, () => lead);

/** Partial-lead hook point: wire to GoHighLevel / CRM in production. */
export const saveStep1 = (data: Lead & { source?: string }) => {
  lead = { ...lead, ...data }; emit();
  try { window.dispatchEvent(new CustomEvent('ac:lead-step1', { detail: data })); } catch { /* noop */ }
};
