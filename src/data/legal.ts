/**
 * Privacy policy and terms copy. Written as a sound starting point for a US medical billing
 * company's marketing site; have counsel review before relying on it.
 */
export type LegalBlock = { h: string; id: string; body: (string | string[])[] };
export type LegalDoc = { eyebrow: string; title: string; intro: string; updated: string; sections: LegalBlock[] };

const CONTACT = 'Affinity Core, 5830 Granite Pkwy, STE 100 - 219, Plano, TX 75024 · info@affinitycore.co · 214-851-2698';

export const PRIVACY: LegalDoc = {
  eyebrow: '/ Privacy policy',
  title: 'How we handle your information.',
  intro: 'This policy explains what we collect when you use affinitycorebillers.com, why we collect it and the choices you have. Patient information we handle for clients is covered separately, by HIPAA and the Business Associate Agreement we sign with each practice.',
  updated: 'November 17, 2026',
  sections: [
    { h: 'Who we are', id: 'who-we-are', body: [
      'Affinity Core (“Affinity Core”, “we”, “us”) provides medical billing, coding and revenue cycle management services to healthcare practices in the United States. We are based in Plano, Texas.',
      'This policy applies to this website and to the forms on it. It does not apply to third-party sites we link to.',
    ] },
    { h: 'Information we collect', id: 'information-we-collect', body: [
      'Information you give us when you request an assessment, contact us or apply for a job:',
      ['Your name, work email and phone number', 'Your practice name, specialty, state and approximate monthly collections', 'Anything you type in a message field', 'Your résumé and application details, if you apply for a role'],
      'Information collected automatically when you browse:',
      ['Device and browser type, pages viewed, referring page and approximate location from your IP address', 'Cookies and similar technologies, described below'],
      'Please don’t send patient information through this website. Our forms are not built to receive protected health information (PHI).',
    ] },
    { h: 'How we use it', id: 'how-we-use-it', body: [
      ['To respond to your request and prepare your free revenue assessment', 'To schedule calls and send information you asked for', 'To review job applications', 'To understand how the site is used and improve it', 'To keep the site secure and prevent fraud', 'To meet legal obligations'],
      'We don’t sell your personal information, and we don’t share it for cross-context behavioral advertising.',
    ] },
    { h: 'Patient information and HIPAA', id: 'hipaa', body: [
      'When a practice becomes a client, we act as its Business Associate under HIPAA. We sign a Business Associate Agreement (BAA) before we access any record, and we use and disclose PHI only as that agreement and the law allow.',
      'PHI is handled inside the client’s own systems or in secured environments, limited to the staff who need it and logged. If you’re a patient with a question about your records, please contact your healthcare provider directly.',
    ] },
    { h: 'Cookies and analytics', id: 'cookies', body: [
      'We use essential cookies so the site works, and analytics cookies to see which pages are useful. You can block or delete cookies in your browser settings; the site will still work, though some features may not.',
      'Where we use third-party analytics, those providers process data on our behalf under their own terms and privacy policies.',
    ] },
    { h: 'Who we share it with', id: 'sharing', body: [
      'We share information only with:',
      ['Service providers who help us run the site, our CRM, email and scheduling, under contracts that limit their use of it', 'Professional advisers such as lawyers and accountants', 'Authorities, when the law requires it or to protect our rights and safety', 'A buyer or successor, if our business is reorganized or sold, under this policy'],
    ] },
    { h: 'How long we keep it', id: 'retention', body: [
      'We keep enquiry and assessment details for as long as we need them to respond and follow up, and then for a reasonable period for our records, usually no longer than three years. Job applications are kept for up to two years unless you ask us to delete them sooner.',
    ] },
    { h: 'Security', id: 'security', body: [
      'We use administrative, technical and physical safeguards to protect information, including encryption in transit, access controls and staff training. No method of transmission or storage is completely secure, so we can’t guarantee absolute security.',
    ] },
    { h: 'Your choices and rights', id: 'your-rights', body: [
      'Depending on where you live, including under the Texas Data Privacy and Security Act, you may have the right to:',
      ['Know what personal information we hold about you', 'Correct it', 'Delete it', 'Get a copy of it', 'Opt out of marketing emails at any time, using the link in the email'],
      'To make a request, email info@affinitycore.co. We’ll confirm your request and respond within the time the law requires. We won’t discriminate against you for exercising your rights.',
    ] },
    { h: 'Children', id: 'children', body: [
      'This site is meant for healthcare professionals and job seekers. It isn’t directed to children under 13, and we don’t knowingly collect their information.',
    ] },
    { h: 'Changes to this policy', id: 'changes', body: [
      'We may update this policy from time to time. When we do, we’ll change the date at the top of this page. If a change is significant, we’ll make it clear on the site.',
    ] },
    { h: 'Contact us', id: 'contact', body: [`Questions about this policy or your information: ${CONTACT}.`] },
  ],
};

export const TERMS: LegalDoc = {
  eyebrow: '/ Terms and conditions',
  title: 'The terms for using this website.',
  intro: 'These terms apply to your use of affinitycorebillers.com. By using the site, you agree to them. Our billing services are provided under a separate written services agreement and BAA, which take precedence over these terms.',
  updated: 'November 17, 2026',
  sections: [
    { h: 'Using this site', id: 'using-this-site', body: [
      'You may use this site to learn about our services, request an assessment, contact us and apply for jobs. You agree not to:',
      ['Use the site for anything unlawful or misleading', 'Try to gain unauthorized access to the site or its systems', 'Interfere with how the site works, including by sending malware or automated traffic', 'Copy or scrape the site’s content at scale', 'Submit patient information or anyone else’s personal information without the right to do so'],
    ] },
    { h: 'No professional advice', id: 'no-advice', body: [
      'Content on this site, including articles, payer rules, state guides and estimates, is general information. It isn’t legal, tax, compliance or medical advice, and payer rules change. Check current rules with the payer or your advisers before acting on them.',
    ] },
    { h: 'Estimates and assessments', id: 'estimates', body: [
      'Calculators and figures on this site are illustrative and based on averages. Your free revenue assessment is based on the data you share with us and is offered without obligation. Neither creates a contract or guarantees a result.',
      'Statistics we publish, such as clean claim rates or days in A/R, are averages across active clients and are not a promise of the results any one practice will see.',
    ] },
    { h: 'Our services', id: 'services', body: [
      'We provide billing services only under a signed services agreement and Business Associate Agreement. Pricing, scope, service levels and responsibilities are set out in those documents, not on this site.',
    ] },
    { h: 'Intellectual property', id: 'intellectual-property', body: [
      'The site and its content, including text, graphics, logos and design, belong to Affinity Core or its licensors and are protected by law. You may view and print pages for your own, non-commercial use. Other use needs our written permission.',
      'Third-party names, payer names and logos are the property of their owners and are used to identify them. Their use doesn’t imply endorsement or affiliation.',
    ] },
    { h: 'Links to other sites', id: 'links', body: [
      'We link to payer, government and other sites for convenience. We don’t control them and aren’t responsible for their content or practices.',
    ] },
    { h: 'Disclaimers', id: 'disclaimers', body: [
      'The site is provided “as is” and “as available”. To the fullest extent the law allows, we disclaim all warranties, express or implied, including fitness for a particular purpose and non-infringement, and we don’t promise the site will be uninterrupted or error-free.',
    ] },
    { h: 'Limitation of liability', id: 'liability', body: [
      'To the fullest extent the law allows, Affinity Core won’t be liable for any indirect, incidental, special or consequential damages, or lost profits or revenue, arising from your use of this website. Our total liability for any claim relating to the site is limited to one hundred US dollars ($100).',
    ] },
    { h: 'Indemnity', id: 'indemnity', body: [
      'You agree to indemnify Affinity Core against claims, losses and costs arising from your misuse of the site or breach of these terms.',
    ] },
    { h: 'Governing law', id: 'governing-law', body: [
      'These terms are governed by the laws of the State of Texas, without regard to conflict-of-law rules. Disputes will be handled in the state or federal courts located in Collin County, Texas.',
    ] },
    { h: 'Changes to these terms', id: 'changes', body: [
      'We may update these terms. The date at the top shows when they last changed. Continuing to use the site after a change means you accept the updated terms.',
    ] },
    { h: 'Contact us', id: 'contact', body: [`Questions about these terms: ${CONTACT}.`] },
  ],
};
