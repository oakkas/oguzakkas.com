import React, { useState, useEffect } from 'react';
import { GitHubIcon, LinkedInIcon, EmailIcon, ChatIcon } from './Icons';
import ThemeToggle from './ThemeToggle';
import { motion } from 'framer-motion';
import { profile } from '../data/profile';
import { OPEN_CHAT_EVENT } from './ChatWidget';

const navLinks = [
  { id: 'about', name: 'About' },
  { id: 'demo', name: 'Demo' },
  { id: 'experience', name: 'Experience' },
  { id: 'projects', name: 'Projects' },
  { id: 'how-i-work', name: 'How I work' },
  { id: 'skills', name: 'Skills' },
  { id: 'education', name: 'Education' },
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

  const subtitle = profile.title;

  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        <div className="flex items-center gap-4">
          <img src={profile.photo} alt="" width={64} height={64} className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-sky-500/40" />
          <h1 className="text-5xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-5xl xl:text-6xl">
            {profile.name}
          </h1>
        </div>
        <h2 className="mt-4 text-xl font-medium tracking-tight text-slate-900 dark:text-white sm:text-2xl h-8" aria-label={subtitle}>
          {subtitle.split("").map((char, index) => (
            <motion.span
              aria-hidden="true"
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
          {profile.tagline}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            onClick={() => window.dispatchEvent(new Event(OPEN_CHAT_EVENT))}
            className="inline-flex items-center gap-1.5 rounded-full bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-sky-500"
          >
            <ChatIcon /> Ask AI about me
          </button>
          <a
            href="#demo"
            className="inline-flex items-center rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 transition-colors hover:border-sky-500 hover:text-sky-600 dark:border-slate-600 dark:text-slate-200 dark:hover:border-sky-400 dark:hover:text-sky-300"
          >
            See the demo
          </a>
        </div>
        <nav className="hidden lg:block mt-10" aria-label="In-page jump links">
          <ul className="w-max">
            {navLinks.map(link => (
              <li key={link.id}>
                <a className="group flex items-center py-2" href={`#${link.id}`}>
                  <span className={`nav-indicator mr-4 h-px w-8 bg-slate-400 dark:bg-slate-600 transition-all group-hover:w-16 group-hover:bg-slate-900 dark:group-hover:bg-slate-200 motion-reduce:transition-none ${activeSection === link.id ? 'w-16 bg-slate-900! dark:bg-white!' : ''}`}></span>
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
            <a className="block hover:text-slate-900 dark:hover:text-slate-200" href={profile.github} target="_blank" rel="noreferrer noopener" aria-label="GitHub (opens in a new tab)">
              <span className="sr-only">GitHub</span>
              <GitHubIcon />
            </a>
          </li>
          <li className="mr-5 text-xs shrink-0">
            <a className="block hover:text-slate-900 dark:hover:text-slate-200" href={profile.linkedin} target="_blank" rel="noreferrer noopener" aria-label="LinkedIn (opens in a new tab)">
              <span className="sr-only">LinkedIn</span>
              <LinkedInIcon />
            </a>
          </li>
          <li className="mr-5 text-xs shrink-0">
            <a className="block hover:text-slate-900 dark:hover:text-slate-200" href={`mailto:${profile.email}`} aria-label={`Email ${profile.name}`}>
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