import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Contact from './components/Contact';
import OpsComparison from './components/OpsComparison';
import VideoGenerator from './components/VideoGenerator';

const App: React.FC = () => {
  return (
    <div className="bg-slate-900 text-slate-300 font-sans leading-relaxed selection:bg-sky-300 selection:text-sky-900">
      <Header />
      <main className="container mx-auto max-w-screen-xl px-6 py-12 font-sans md:px-12 md:py-20 lg:px-24 lg:py-0">
        <div className="lg:flex lg:justify-between lg:gap-4">
          <div className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-1/2 lg:flex-col lg:justify-between lg:py-24">
            <Hero />
          </div>
          <div className="pt-24 lg:w-1/2 lg:py-24">
            <About />
            <OpsComparison />
            <Experience />
            <Projects />
            <VideoGenerator />
            <Contact />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
