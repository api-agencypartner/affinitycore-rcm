'use client';
import { useReady } from '../ready';
import { SHOW_STATES } from '../data/states';
import { Hero } from '../sections/Hero';
import { About } from '../sections/About';
import { Specialities } from '../sections/Specialities';
import { Process } from '../sections/Process';
import { Services } from '../sections/Services';
import { Platforms } from '../sections/Platforms';
import { Testimonials } from '../sections/Testimonials';
import { StatesFold } from '../sections/StatesFold';
import { Assessment } from '../sections/Assessment';
import { FAQ, CTA } from '../sections/Closing';

export function HomePage() {
  const ready = useReady();
  return (
    <main>
      <Hero show={ready} />
      <About />
      <Specialities />
      <Process />
      <Services />
      <Platforms />
      <Testimonials />
      {SHOW_STATES && <StatesFold />}
      <Assessment />
      <FAQ />
      <CTA />
    </main>
  );
}

/** Hubs whose heroes animate in: rendered in the HTML for search engines, re-mounted once the loader hands off. */
export function AfterLoader({ children }: { children: React.ReactNode }) {
  const ready = useReady();
  return <div key={ready ? 'r' : 'w'} style={ready ? undefined : { visibility: 'hidden' }}>{children}</div>;
}
