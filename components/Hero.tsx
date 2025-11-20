import React, { useState, useEffect } from 'react';
import { GitHubIcon, LinkedInIcon, EmailIcon } from './Icons';
import ThemeToggle from './ThemeToggle';
import { motion } from 'framer-motion';

const navLinks = [
  { id: 'about', name: 'About' },
  { id: 'skills', name: 'Skills' },
  { id: 'ops-comparison', name: 'Disciplines' },
  { id: 'experience', name: 'Experience' },
  { id: 'projects', name: 'Projects' },
];

const Hero: React.FC = () => {
  const [activeSection, setActiveSection] = useState('about');

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

  const subtitle = "ML & Data Engineer";

  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        <h1 className="text-5xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
          Oguz Akkas
        </h1>
        <h2 className="mt-4 text-xl font-medium tracking-tight text-slate-900 dark:text-white sm:text-2xl h-8">
          {subtitle.split("").map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.1,
                delay: index * 0.05,
              }}
            >
              {char}
            </motion.span>
          ))}
        </h2>
        <p className="mt-6 max-w-sm text-lg leading-relaxed text-slate-600 dark:text-slate-400">
          I design and deploy scalable machine learning models and data pipelines, with expertise in NLP and distributed processing.
        </p>
        <nav className="hidden lg:block mt-16" aria-label="In-page jump links">
          <ul className="w-max">
            {navLinks.map(link => (
              <li key={link.id}>
                <a className="group flex items-center py-3" href={`#${link.id}`}>
                  <span className={`nav-indicator mr-4 h-px w-8 bg-slate-400 dark:bg-slate-600 transition-all group-hover:w-16 group-hover:bg-slate-900 dark:group-hover:bg-slate-200 motion-reduce:transition-none ${activeSection === link.id ? 'w-16 !bg-slate-900 dark:!bg-white' : ''}`}></span>
                  <span className={`nav-text text-xs font-bold uppercase tracking-widest transition-colors group-hover:text-slate-900 dark:group-hover:text-slate-200 ${activeSection === link.id ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>{link.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="flex items-center">
        <ul className="ml-1 mt-8 flex items-center" aria-label="Social media">
          <li className="mr-5 text-xs shrink-0">
            <a className="block hover:text-slate-900 dark:hover:text-slate-200" href="https://github.com/oakkas" target="_blank" rel="noreferrer noopener" aria-label="GitHub (opens in a new tab)">
              <span className="sr-only">GitHub</span>
              <GitHubIcon />
            </a>
          </li>
          <li className="mr-5 text-xs shrink-0">
            <a className="block hover:text-slate-900 dark:hover:text-slate-200" href="https://www.linkedin.com/in/oguz-akkas-ph-d-2947a836/" target="_blank" rel="noreferrer noopener" aria-label="LinkedIn (opens in a new tab)">
              <span className="sr-only">LinkedIn</span>
              <LinkedInIcon />
            </a>
          </li>
          <li className="mr-5 text-xs shrink-0">
            <a className="block hover:text-slate-900 dark:hover:text-slate-200" href="mailto:oakkas84@gmail.com" aria-label="Email Oguz Akkas">
              <span className="sr-only">Email</span>
              <EmailIcon />
            </a>
          </li>
        </ul>
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Hero;