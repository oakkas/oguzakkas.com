import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Contact from './components/Contact';
import OpsComparison from './components/OpsComparison';

const App: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-sans leading-relaxed selection:bg-sky-300 selection:text-sky-900">
      <div 
        className="pointer-events-none fixed inset-0 z-30 transition duration-300 lg:absolute"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(29, 78, 216, 0.15), transparent 80%)`
        }}
      ></div>
      <Header />
      <main className="container mx-auto max-w-screen-2xl px-6 py-12 font-sans md:px-12 md:py-20 lg:px-12 lg:py-0">
        <div className="lg:grid lg:grid-cols-4 lg:gap-12">
          <div className="lg:sticky lg:top-0 lg:col-span-1 lg:flex lg:max-h-screen lg:flex-col lg:justify-between lg:py-24">
            <Hero />
          </div>
          <div className="pt-24 lg:col-span-3 lg:py-24">
            <About />
            <Skills />
            <OpsComparison />
            <Experience />
            <Projects />
            <Contact />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;