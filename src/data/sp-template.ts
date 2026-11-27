/**
 * Content for the specialty page template (the folds in components/CardiologyV2):
 * the services grid, the six process steps, the EHR line and, optionally, hand-written related cards.
 * Icon names are lucide-react exports, mapped in the component.
 */
import { TEMPLATE_A } from './sp-template-a';
import { TEMPLATE_B } from './sp-template-b';

export type TplService = [icon: string, title: string, desc: string];
/** [description, two illustrative output chips, optional title override] */
export type TplStep = [desc: string, art: [string, string], title?: string];
export type SpecialtyTemplate = {
  lines: [string, string];
  intro: string;
  /** finishes "…your EHR and practice management system, " */
  ehr: string;
  services: TplService[];
  steps: TplStep[];
  /** [slug, why it pairs]; when left out, the specialty's related list and its short line are used */
  related?: [string, string][];
};

export const STEP_TITLES = ['Verify and authorize', 'Capture every charge', 'Code to the payer’s rules', 'Scrub and submit same day', 'Work denials and A/R', 'Report every month'];

const ALL: Record<string, SpecialtyTemplate> = { ...TEMPLATE_A, ...TEMPLATE_B };
export const getTemplate = (slug: string): SpecialtyTemplate | undefined => ALL[slug];
