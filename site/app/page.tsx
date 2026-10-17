import Hero from '@/components/Hero';
import Nav from '@/components/Nav';
import { Approach, Build, Company, Contact, Footer, Principles, Problem, Process, Roadmap } from '@/components/Sections';

export default function Home() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <div id="top" />
      <Nav />
      <main id="main">
        <Hero />
        <Problem />
        <Approach />
        <Process />
        <Build />
        <Principles />
        <Roadmap />
        <Company />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
