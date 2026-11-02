import React from 'react';
import { motion } from 'framer-motion';
import { experiences, leadership, scopeLevels, testimonials } from '../data/profile';
import { BuildTeamIcon, MigrateIcon, PeopleIcon, PresentIcon } from './Icons';

const pillarIcons = [<BuildTeamIcon />, <PeopleIcon />, <MigrateIcon />, <PresentIcon />];

// "APR 2024 — PRESENT" -> "2024 – now"
const years = (date: string) =>
  date
    .split(' — ')
    .map(part => (part === 'PRESENT' ? 'now' : part.split(' ')[1]))
    .join(' – ');

// Oldest first, so the bars grow down the chart the way the scope did
const roles = [...experiences].reverse();

// The first sentence of the recommendation that speaks to leading
const leaderQuote = testimonials.find(t => t.name === 'Matthew Cintron')!;
const leaderLine = leaderQuote.quote.split(/(?<=\.)\s/)[0];

const card = 'rounded-2xl border border-slate-200 bg-white/80 shadow-xs dark:border-slate-700 dark:bg-slate-800/50';
const columns = 'sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-6';

const Leadership: React.FC = () => {
  return (
    <section id="leadership" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24" aria-label="How I lead">
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-white/75 dark:bg-slate-900/75 px-6 py-5 backdrop-blur-sm md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-slate-200 lg:sr-only">How I lead</h2>
      </div>
      <p className="mb-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
        In my last two roles I led the engineering team, and as Head of Data / AI at FlyteHealth I built the data & AI/ML
        team from the ground up. My scope has grown from my own models, to platforms other teams use, to leading and
        building teams.
      </p>

      <div className={`${card} rounded-3xl p-6 sm:p-8`}>
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">How my scope grew</h3>
        <div className={`mt-5 grid ${columns}`} aria-hidden="true">
          <div className="hidden sm:block"></div>
          <div className="grid grid-cols-4 text-[11px] font-semibold leading-tight text-slate-500 dark:text-slate-400">
            {scopeLevels.map(level => (
              <span key={level} className="border-l border-slate-200 pl-2 pr-1 dark:border-slate-700">{level}</span>
            ))}
          </div>
        </div>
        <ol className="mt-4 space-y-5">
          {roles.map((role, index) => (
            <li key={`${role.company}-${role.date}`} className={`grid gap-2 sm:items-center ${columns}`}>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{years(role.date)}</p>
                <p className="font-medium leading-snug text-slate-900 dark:text-slate-200">{role.company}</p>
                <p className="text-xs leading-snug text-slate-500 dark:text-slate-400">{role.title}</p>
              </div>
              <div>
                <div className="relative h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700/60" aria-hidden="true">
                  <motion.div
                    className="absolute inset-y-0 left-0 origin-left rounded-full bg-linear-to-r from-sky-500 to-emerald-400"
                    style={{ width: `${role.scope.level * 25}%` }}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.9, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
                  />
                  {[1, 2, 3].map(step => (
                    <span key={step} className="absolute inset-y-0 w-0.5 bg-white dark:bg-slate-800" style={{ left: `${step * 25}%` }}></span>
                  ))}
                </div>
                <p className="mt-1.5 text-sm leading-snug">
                  <span className="sr-only">Scope: {scopeLevels[role.scope.level - 1]}. </span>
                  {role.scope.note}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <ul className="mt-4 grid gap-4 sm:grid-cols-2">
        {leadership.map((pillar, index) => (
          <motion.li
            key={pillar.title}
            className={`${card} p-6`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: (index % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-sky-400/10 text-sky-700 dark:text-sky-300">
              {pillarIcons[index]}
            </span>
            <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">{pillar.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed">{pillar.text}</p>
          </motion.li>
        ))}
      </ul>

      <figure className="mt-8 border-l-2 border-sky-500 pl-5">
        <blockquote className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
          <p>“{leaderLine}”</p>
        </blockquote>
        <figcaption className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {leaderQuote.name}, {leaderQuote.headline} ·{' '}
          <a
            href="#recommendations"
            className="font-medium text-slate-700 underline decoration-slate-300 underline-offset-2 hover:text-sky-700 hover:decoration-sky-500 dark:text-slate-300 dark:decoration-slate-600 dark:hover:text-sky-300"
          >
            More recommendations
          </a>
        </figcaption>
      </figure>
    </section>
  );
};

export default Leadership;
