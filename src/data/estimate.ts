/**
 * Carries the visitor's number from a page's top calculator down to its assessment form,
 * so a service page asks once ("Your estimate: $31,680 a year") instead of running two calculators.
 */
import { useSyncExternalStore } from 'react';

let current = '';
const subs = new Set<() => void>();
export const setEstimate = (v: string) => { if (v !== current) { current = v; subs.forEach((f) => f()); } };
export const useCarriedEstimate = () => useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f); }, () => current);
