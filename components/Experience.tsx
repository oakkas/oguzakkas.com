import React from 'react';
import { ArrowUpRightIcon } from './Icons';
import { experiences } from '../data/profile';

const ExperienceCard: React.FC<{ experience: typeof experiences[0] }> = ({ experience }) => {
  return (
    <li className="mb-12">
      <div className="group relative grid pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:opacity-100! lg:group-hover/list:opacity-50">
        <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-slate-100/50 dark:lg:group-hover:bg-slate-800/50 lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover:drop-shadow-lg"></div>
        <header className="z-10 mb-2 mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:col-span-2" aria-label={experience.date}>{experience.date}</header>
        <div className="z-10 sm:col-span-6">
          <h3 className="font-medium leading-snug text-slate-200">
            <div>
              <a className="inline-flex items-baseline font-medium leading-tight text-slate-900 dark:text-slate-200 hover:text-sky-500 dark:hover:text-sky-300 focus-visible:text-sky-500 dark:focus-visible:text-sky-300 group/link text-base" href={experience.link} target="_blank" rel="noreferrer noopener" aria-label={`${experience.title} at ${experience.company} (opens in a new tab)`}>
                <span className="absolute -inset-x-4 -inset-y-2.5 hidden rounded-sm md:-inset-x-6 md:-inset-y-4 lg:block"></span>
                <span>{experience.title} · <span className="inline-block">{experience.company}</span></span>
              </a>
            </div>
          </h3>
          <p className="mt-2 text-sm leading-normal">{experience.description}</p>
          <ul className="mt-2 flex flex-wrap" aria-label="Technologies used">
            {experience.technologies.map(tech => (
              <li key={tech} className="mr-1.5 mt-2">
                <div className="flex items-center rounded-full bg-sky-400/10 px-3 py-1 text-xs font-medium leading-5 text-sky-600 dark:text-sky-300">{tech}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  );
};

const Experience: React.FC = () => {
  return (
    <section id="experience" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24" aria-label="Work experience">
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-white/75 dark:bg-slate-900/75 px-6 py-5 backdrop-blur-sm md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-slate-200 lg:sr-only">Experience</h2>
      </div>
      <div>
        <ol className="group/list">
          {experiences.map((exp, index) => (
            <ExperienceCard key={index} experience={exp} />
          ))}
        </ol>
        <div className="mt-12">
            <a className="inline-flex items-center font-medium leading-tight text-slate-900 dark:text-slate-200 group" href="/resume.pdf" target="_blank" rel="noreferrer noopener" aria-label="View Full Résumé (opens in a new tab)">
                <span>
                <span className="border-b border-transparent pb-px transition group-hover:border-sky-500 dark:group-hover:border-sky-300 motion-reduce:transition-none">View Full </span>
                <span className="whitespace-nowrap">
                    Résumé
                    <ArrowUpRightIcon />
                </span>
                </span>
            </a>
        </div>
      </div>
    </section>
  );
};

export default Experience;