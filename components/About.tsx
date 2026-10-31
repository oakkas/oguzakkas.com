import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { profile, experiences, publications } from '../data/profile';
import NeuralScene from './NeuralScene';
import { OPEN_CHAT_EVENT } from './ChatWidget';
import { ChatIcon } from './Icons';

const current = experiences[0];

const textLink =
  'text-sm font-semibold text-slate-700 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-sky-700 hover:decoration-sky-500 dark:text-slate-300 dark:decoration-slate-600 dark:hover:text-sky-300';

// The hero's pieces rise out of a soft blur one after another. MotionConfig in
// App drops the rise for visitors who prefer reduced motion.
const reveal: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};
const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1.2, ease: 'easeOut' } },
};

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
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
        initial="hidden"
        animate="show"
        className="@container relative mb-12 overflow-hidden rounded-3xl border border-slate-200 bg-linear-to-br from-white via-slate-50 to-sky-50 shadow-sm dark:border-slate-700/80 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800"
      >
        <div className="relative z-10 px-6 pt-6 sm:px-8 sm:pt-8 md:px-10 md:pt-10 lg:px-12 lg:pt-12">
          <motion.p variants={reveal} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:hidden"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            Now: {current.title} at {current.company}
          </motion.p>
          {/* Sized to the card, so each hand-broken line fits on wider screens; lines flow on phones */}
          <motion.h2
            variants={reveal}
            className="mt-5 text-[clamp(2.25rem,6.6cqw,4.25rem)] font-medium leading-[1.04] tracking-[-0.035em] text-slate-900 dark:text-white"
          >
            I turn messy data into <br className="max-md:hidden" />
            <span className="bg-linear-to-r from-sky-600 to-emerald-500 bg-clip-text text-transparent dark:from-sky-400 dark:to-emerald-400">
              ML and LLM systems
            </span>{' '}
            <br className="max-md:hidden" />
            that run in production.
          </motion.h2>
        </div>

        <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
          <div className="relative z-10 px-6 pb-6 pt-5 sm:px-8 sm:pb-8 md:px-10 md:pb-10 md:pt-6 lg:px-12 lg:pb-12">
            <motion.p variants={reveal} className="max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              From OCR and LLM extraction pipelines to data platforms and MLOps, for healthcare, insurance, and software teams.
              Before industry, I published computer vision research at UW–Madison.
            </motion.p>
            <motion.div variants={reveal} className="mt-7 flex flex-wrap items-center gap-3">
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
              <span className="flex items-center gap-4">
                <a href={`mailto:${profile.email}`} className={textLink}>Email me</a>
                <a href="/resume" className={textLink}>Résumé</a>
              </span>
            </motion.div>
            <motion.p variants={reveal} className="mt-6 text-sm text-slate-500 dark:text-slate-400">
              Previously at Verana Health, Wind River, Pinnacol Assurance, and CDC / NIOSH.
            </motion.p>
          </div>

          <motion.div variants={fadeIn} className="relative -mt-4 h-52 xl:mt-0 xl:h-auto xl:min-h-64">
            <NeuralScene />
            <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/5 bg-linear-to-r from-slate-50 to-transparent xl:block dark:from-slate-900" aria-hidden="true"></div>
          </motion.div>
        </div>

        <motion.dl variants={reveal} className="relative z-10 grid grid-cols-3 gap-3 border-t border-slate-200/80 bg-white/60 px-6 py-5 backdrop-blur-sm sm:gap-6 sm:px-8 md:px-10 lg:px-12 dark:border-slate-700/80 dark:bg-slate-900/50">
          {highlights.map(item => (
            <div key={item.label} className="flex flex-col-reverse justify-end">
              <dt className="text-xs leading-snug text-slate-500 dark:text-slate-400">{item.label}</dt>
              <dd className="whitespace-nowrap text-sm font-bold text-slate-900 sm:text-xl dark:text-white">{item.value}</dd>
            </div>
          ))}
        </motion.dl>
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
