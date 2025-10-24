import React from 'react';
import { GitHubIcon, LinkedInIcon, EmailIcon } from './Icons';

const Hero: React.FC = () => {
  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
          Oguz Akkas
        </h1>
        <h2 className="mt-4 text-xl font-medium tracking-tight text-white sm:text-2xl">
          ML & Data Engineer
        </h2>
        <p className="mt-6 max-w-sm text-lg leading-relaxed text-slate-400">
          I design and deploy scalable machine learning models and data pipelines, with expertise in NLP and distributed processing.
        </p>
        <nav className="hidden lg:block mt-16" aria-label="In-page jump links">
          <ul className="w-max">
            <li>
              <a className="group flex items-center py-3 active" href="#about">
                <span className="nav-indicator mr-4 h-px w-8 bg-slate-600 transition-all group-hover:w-16 group-hover:bg-slate-200 group-focus-visible:w-16 group-focus-visible:bg-slate-200 motion-reduce:transition-none"></span>
                <span className="nav-text text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-200 group-focus-visible:text-slate-200">About</span>
              </a>
            </li>
             <li>
              <a className="group flex items-center py-3" href="#ops-comparison">
                <span className="nav-indicator mr-4 h-px w-8 bg-slate-600 transition-all group-hover:w-16 group-hover:bg-slate-200 group-focus-visible:w-16 group-focus-visible:bg-slate-200 motion-reduce:transition-none"></span>
                <span className="nav-text text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-200 group-focus-visible:text-slate-200">Ops Comparison</span>
              </a>
            </li>
            <li>
              <a className="group flex items-center py-3" href="#experience">
                <span className="nav-indicator mr-4 h-px w-8 bg-slate-600 transition-all group-hover:w-16 group-hover:bg-slate-200 group-focus-visible:w-16 group-focus-visible:bg-slate-200 motion-reduce:transition-none"></span>
                <span className="nav-text text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-200 group-focus-visible:text-slate-200">Experience</span>
              </a>
            </li>
            <li>
              <a className="group flex items-center py-3" href="#projects">
                <span className="nav-indicator mr-4 h-px w-8 bg-slate-600 transition-all group-hover:w-16 group-hover:bg-slate-200 group-focus-visible:w-16 group-focus-visible:bg-slate-200 motion-reduce:transition-none"></span>
                <span className="nav-text text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-200 group-focus-visible:text-slate-200">Projects</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <ul className="ml-1 mt-8 flex items-center" aria-label="Social media">
        <li className="mr-5 text-xs shrink-0">
          <a className="block hover:text-slate-200" href="https://github.com/oakkas" target="_blank" rel="noreferrer noopener" aria-label="GitHub (opens in a new tab)">
            <span className="sr-only">GitHub</span>
            <GitHubIcon />
          </a>
        </li>
        <li className="mr-5 text-xs shrink-0">
          <a className="block hover:text-slate-200" href="https://www.linkedin.com/in/oguz-akkas-ph-d-2947a836/" target="_blank" rel="noreferrer noopener" aria-label="LinkedIn (opens in a new tab)">
            <span className="sr-only">LinkedIn</span>
            <LinkedInIcon />
          </a>
        </li>
        <li className="mr-5 text-xs shrink-0">
          <a className="block hover:text-slate-200" href="mailto:oakkas84@gmail.com" aria-label="Email Oguz Akkas">
            <span className="sr-only">Email</span>
            <EmailIcon />
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Hero;