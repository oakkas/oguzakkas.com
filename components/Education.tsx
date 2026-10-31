import React from 'react';
import { education, publications } from '../data/profile';
import { ArrowUpRightIcon } from './Icons';

const Education: React.FC = () => {
  return (
    <section id="education" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24" aria-label="Education and publications">
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-white/75 dark:bg-slate-900/75 px-6 py-5 backdrop-blur-sm md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-slate-200 lg:sr-only">Education</h2>
      </div>

      <div className="grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Education</h3>
          <ol className="space-y-4 border-l-2 border-sky-500/30 pl-5">
            {education.map(item => (
              <li key={item.degree} className="relative">
                <span className="absolute -left-[27px] top-1.5 h-3 w-3 rounded-full border-2 border-sky-500 bg-white dark:bg-slate-900" aria-hidden="true"></span>
                <p className="font-medium text-slate-900 dark:text-slate-200">
                  {item.degree}
                  {item.note && <span className="ml-1 text-xs font-normal text-slate-500 dark:text-slate-400">({item.note.toLowerCase()})</span>}
                </p>
                <p className="text-sm">{item.school} · {item.year}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="lg:col-span-3">
          <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Publications</h3>
          <p className="mb-4 text-sm">
            Peer-reviewed research from UW–Madison on measuring work exposure and driver behavior from video with computer vision.
          </p>
          <ol className="space-y-4">
            {publications.map(pub => (
              <li key={pub.url}>
                <a
                  href={pub.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group/link font-medium leading-snug text-slate-900 hover:text-sky-500 dark:text-slate-200 dark:hover:text-sky-300"
                  aria-label={`${pub.title} (opens in a new tab)`}
                >
                  {pub.title} <ArrowUpRightIcon />
                </a>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {pub.authors} · <span className="italic">{pub.venue}</span>, {pub.year}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default Education;
