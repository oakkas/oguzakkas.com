import React, { useState, useEffect } from 'react';
import { GitHubIcon, LinkedInIcon, EmailIcon, ResumeIcon } from './Icons';
import ThemeToggle from './ThemeToggle';
import { AnimatePresence, motion } from 'framer-motion';
import { profile } from '../data/profile';

const [firstName, ...otherNames] = profile.name.split(' ');
const lastName = otherNames.join(' ');

const focusAreas = ['LLM pipelines', 'NLP systems', 'data platforms', 'MLOps'];

const navLinks = [
  { id: 'about', name: 'About' },
  { id: 'demo', name: 'Demo' },
  { id: 'experience-map', name: 'Experience map' },
  { id: 'experience', name: 'Experience' },
  { id: 'recommendations', name: 'Recommendations' },
  { id: 'projects', name: 'Projects' },
  { id: 'how-i-work', name: 'How I work' },
  { id: 'skills', name: 'Skills' },
  { id: 'education', name: 'Education' },
];

const Hero: React.FC = () => {
  const [activeSection, setActiveSection] = useState('about');
  const [focus, setFocus] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const interval = window.setInterval(() => setFocus(f => (f + 1) % focusAreas.length), 2600);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      let current = 'about';
      for (const link of navLinks) {
        const section = document.getElementById(link.id);
        if (section) {
          const sectionTop = section.offsetTop;
          if (window.scrollY >= sectionTop - 100) { // 100px offset for better accuracy
            current = section.id;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        <div className="flex items-center gap-4">
          <span className="shrink-0 rounded-full bg-linear-to-br from-sky-500 to-emerald-400 p-[3px] shadow-lg shadow-sky-500/20">
            <img src={profile.photo} alt="" width={64} height={64} className="h-16 w-16 rounded-full border-2 border-white object-cover dark:border-slate-900" />
          </span>
          <h1 className="text-5xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-4xl xl:text-[3.5rem]/none 2xl:text-6xl">
            {firstName}{' '}
            <span className="bg-linear-to-r from-sky-600 to-emerald-500 bg-clip-text text-transparent dark:from-sky-400 dark:to-emerald-400">{lastName}</span>
          </h1>
        </div>
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 text-xl font-medium tracking-tight text-slate-900 dark:text-white sm:text-2xl"
        >
          {profile.title}
        </motion.h2>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
          <span className="sr-only">Building {focusAreas.join(', ')}</span>
          <span aria-hidden="true">
            Building{' '}
            <span className="relative inline-flex overflow-hidden align-bottom font-semibold text-sky-700 dark:text-sky-300">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={focusAreas[focus]}
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: '-100%', opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="inline-block"
                >
                  {focusAreas[focus]}
                </motion.span>
              </AnimatePresence>
            </span>
          </span>
        </p>
        <nav className="hidden lg:block mt-12" aria-label="In-page jump links">
          <ul className="w-max">
            {navLinks.map(link => (
              <li key={link.id}>
                <a className="group flex items-center py-2" href={`#${link.id}`}>
                  <span className={`nav-indicator mr-4 h-px w-8 bg-slate-400 dark:bg-slate-600 transition-all group-hover:w-16 group-hover:bg-slate-900 dark:group-hover:bg-slate-200 motion-reduce:transition-none ${activeSection === link.id ? 'w-16 bg-slate-900! dark:bg-white!' : ''}`}></span>
                  <span className={`nav-text text-xs font-bold uppercase tracking-widest transition-colors group-hover:text-slate-900 dark:group-hover:text-slate-200 ${activeSection === link.id ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>{link.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="flex items-center">
        <ul className="ml-1 mt-8 flex items-center" aria-label="Social media">
          <li className="mr-5 text-xs shrink-0 lg:mr-3 xl:mr-5">
            <a className="block hover:text-slate-900 dark:hover:text-slate-200" href={profile.github} target="_blank" rel="noreferrer noopener" aria-label="GitHub (opens in a new tab)">
              <span className="sr-only">GitHub</span>
              <GitHubIcon />
            </a>
          </li>
          <li className="mr-5 text-xs shrink-0 lg:mr-3 xl:mr-5">
            <a className="block hover:text-slate-900 dark:hover:text-slate-200" href={profile.linkedin} target="_blank" rel="noreferrer noopener" aria-label="LinkedIn (opens in a new tab)">
              <span className="sr-only">LinkedIn</span>
              <LinkedInIcon />
            </a>
          </li>
          <li className="mr-5 text-xs shrink-0 lg:mr-3 xl:mr-5">
            <a className="block hover:text-slate-900 dark:hover:text-slate-200" href={`mailto:${profile.email}`} aria-label={`Email ${profile.name}`}>
              <span className="sr-only">Email</span>
              <EmailIcon />
            </a>
          </li>
          <li className="mr-5 text-xs shrink-0 lg:mr-3 xl:mr-5">
            <a className="block hover:text-slate-900 dark:hover:text-slate-200" href="/resume" aria-label="Résumé" title="Résumé">
              <ResumeIcon />
            </a>
          </li>
        </ul>
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Hero;