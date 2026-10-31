import React from 'react';
import { ArrowUpRightIcon } from './Icons';
import { profile, testimonials } from '../data/profile';

const initials = (name: string) =>
  name
    .split(/[\s,]+/)
    .filter(part => /^[A-Z]/.test(part) && part !== 'PhD')
    .slice(0, 2)
    .map(part => part[0])
    .join('');

const QuoteMark: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" className="h-7 w-7 text-sky-500/50 dark:text-sky-400/50" aria-hidden="true">
    <path d="M13 8c-4.4 1.2-8 5-8 10.5V24h8v-8H9c.3-2.9 2.2-5 4.6-5.9L13 8Zm14 0c-4.4 1.2-8 5-8 10.5V24h8v-8h-4c.3-2.9 2.2-5 4.6-5.9L27 8Z" />
  </svg>
);

const Testimonials: React.FC = () => {
  return (
    <section id="recommendations" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24" aria-label="Recommendations">
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-white/75 dark:bg-slate-900/75 px-6 py-5 backdrop-blur-sm md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-slate-200 lg:sr-only">Recommendations</h2>
      </div>
      <p className="mb-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
        What managers and teammates wrote about working with me, from my LinkedIn recommendations.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {testimonials.map((item, index) => (
          <figure
            key={item.name}
            className={`flex flex-col rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-xs dark:border-slate-700 dark:bg-slate-800/50 ${index === 0 ? 'sm:col-span-2' : ''}`}
          >
            <QuoteMark />
            <blockquote
              className={`mt-3 grow leading-relaxed text-slate-700 dark:text-slate-300 ${index === 0 ? 'text-lg sm:text-xl sm:leading-relaxed' : ''}`}
            >
              <p>“{item.quote}”</p>
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-sky-600 to-emerald-500 text-sm font-semibold text-white"
                aria-hidden="true"
              >
                {initials(item.name)}
              </span>
              <span className="text-sm leading-snug">
                <span className="block font-semibold text-slate-900 dark:text-white">{item.name}</span>
                <span className="block text-slate-500 dark:text-slate-400">{item.headline}</span>
                <span className="block text-xs text-slate-500 dark:text-slate-400">
                  {item.relationship} · {item.year}
                </span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-8">
        <a
          className="group/link inline-flex items-center font-medium leading-tight text-slate-900 dark:text-slate-200"
          href={`${profile.linkedin}details/recommendations/`}
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Read the full recommendations on LinkedIn (opens in a new tab)"
        >
          <span className="border-b border-transparent pb-px transition group-hover/link:border-sky-500 motion-reduce:transition-none dark:group-hover/link:border-sky-300">
            Read the full recommendations on LinkedIn
          </span>
          <ArrowUpRightIcon />
        </a>
      </div>
    </section>
  );
};

export default Testimonials;
