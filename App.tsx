import React from 'react';
import { MotionConfig } from 'framer-motion';
import Hero from './components/Hero';
import About from './components/About';
import Demo from './components/Demo';
import ExperienceMap from './components/ExperienceMap';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import HowIWork from './components/HowIWork';
import Education from './components/Education';
import Contact from './components/Contact';
import ChatWidget from './components/ChatWidget';

const App: React.FC = () => {
  return (
    <MotionConfig reducedMotion="user">
      <div className="bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-sans leading-relaxed selection:bg-sky-300 selection:text-sky-900 relative">
        <div className="page-grain fixed inset-0 z-0 opacity-[0.06] dark:opacity-[0.09] pointer-events-none" aria-hidden="true"></div>
        <main className="container mx-auto max-w-screen-2xl px-6 py-12 font-sans md:px-12 md:py-20 lg:px-12 lg:py-0">
          <div className="lg:grid lg:grid-cols-4 lg:gap-12">
            <div className="lg:sticky lg:top-0 lg:col-span-1 lg:flex lg:max-h-screen lg:flex-col lg:justify-between lg:overflow-y-auto lg:py-16">
              <Hero />
            </div>
            <div className="pt-24 lg:col-span-3 lg:py-24">
              <About />
              <Demo />
              <ExperienceMap />
              <Experience />
              <Projects />
              <HowIWork />
              <Skills />
              <Education />
              <Contact />
            </div>
          </div>
        </main>
        <ChatWidget />
      </div>
    </MotionConfig>
  );
};

export default App;
