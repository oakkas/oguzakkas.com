import React from 'react';
import { motion } from 'framer-motion';
import { profile, experiences, publications } from '../data/profile';
import NeuralScene from './NeuralScene';
import { OPEN_CHAT_EVENT } from './ChatWidget';
import { ChatIcon } from './Icons';

const current = experiences[0];

const highlights = [
  { value: 'Since 2012', label: 'building ML and computer vision systems' },
  { value: String(publications.length), label: 'peer-reviewed papers' },
  { value: 'LLMs', label: 'in production in healthcare' },
];

const About: React.FC = () => {
  return (
    <section id="about" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24" aria-label="About me">
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-white/75 dark:bg-slate-900/75 px-6 py-5 backdrop-blur-sm md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-slate-200 lg:sr-only">About</h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative mb-12 flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-linear-to-br from-white via-slate-50 to-sky-50 shadow-sm dark:border-slate-700/80 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800"
      >
        <div className="order-2 relative -mt-4 h-52 md:absolute md:mt-0 md:inset-y-0 md:right-0 md:order-none md:h-auto md:w-[48%]">
          <NeuralScene />
          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/5 bg-linear-to-r from-slate-50 to-transparent md:block dark:from-slate-900" aria-hidden="true"></div>
        </div>

        <div className="order-1 relative z-10 p-6 sm:p-8 md:max-w-[56%] md:p-10 lg:p-12">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:hidden"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            Now: {current.title} at {current.company}
          </p>
          <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl 2xl:text-5xl dark:text-white">
            I turn messy data into{' '}
            <span className="bg-linear-to-r from-sky-600 to-emerald-500 bg-clip-text text-transparent dark:from-sky-400 dark:to-emerald-400">
              ML and LLM systems
            </span>{' '}
            that run in production.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            From OCR and LLM extraction pipelines to data platforms and MLOps, for healthcare, insurance, and software teams.
            Before industry, I published computer vision research at UW–Madison.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href="#live-demo"
              className="inline-flex items-center rounded-full bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-500"
            >
              Try the live demo
            </a>
            <button
              onClick={() => window.dispatchEvent(new Event(OPEN_CHAT_EVENT))}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white/70 px-5 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:border-sky-500 hover:text-sky-700 dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:border-sky-400 dark:hover:text-sky-300"
            >
              <ChatIcon /> Ask AI about me
            </button>
            <a
              href={`mailto:${profile.email}`}
              className="text-sm font-semibold text-slate-700 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-sky-700 hover:decoration-sky-500 dark:text-slate-300 dark:decoration-slate-600 dark:hover:text-sky-300"
            >
              Email me
            </a>
          </div>
          <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
            Previously at Verana Health, Wind River, Pinnacol Assurance, and CDC / NIOSH.
          </p>
        </div>

        <dl className="order-3 relative z-10 grid grid-cols-3 gap-3 border-t border-slate-200/80 bg-white/60 px-6 py-5 backdrop-blur-sm sm:gap-6 sm:px-8 md:px-10 lg:px-12 dark:border-slate-700/80 dark:bg-slate-900/50">
          {highlights.map(item => (
            <div key={item.label} className="flex flex-col-reverse justify-end">
              <dt className="text-xs leading-snug text-slate-500 dark:text-slate-400">{item.label}</dt>
              <dd className="whitespace-nowrap text-sm font-bold text-slate-900 sm:text-xl dark:text-white">{item.value}</dd>
            </div>
          ))}
        </dl>
      </motion.div>

      {profile.about.map((paragraph, index) => (
        <p key={index} className={`${index < profile.about.length - 1 ? 'mb-6 ' : ''}text-lg leading-relaxed text-slate-600 dark:text-slate-400`}>
          {paragraph}
        </p>
      ))}
    </section>
  );
};

export default About;
