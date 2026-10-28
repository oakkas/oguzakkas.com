import React from 'react';
import { profile, skillsData, experiences, earlierExperiences, education, publications, projects } from '../data/profile';

// A printable résumé built from the same data as the main page. It prints to two
// US Letter pages, and `npm run resume:pdf` saves it as the PDF linked below.

export const RESUME_PDF = '/oguz-akkas-resume.pdf';
const SITE = 'https://oguzakkas.com';

const [firstName, ...otherNames] = profile.name.split(' ');
// How the papers list this author, e.g. "Akkas O"
const citationName = `${otherNames.join(' ')} ${firstName[0]}`;

const displayUrl = (url: string) => url.replace(/^(https?:\/\/(www\.)?|mailto:)/, '').replace(/\/$/, '');
const formatDates = (date: string) => date.toLowerCase().replace(/\b[a-z]/g, c => c.toUpperCase()).replace(' — ', ' – ');
// One bullet per sentence
const sentences = (text: string) => text.split(/(?<=\.)\s+(?=[A-Z])/);

// Open projects with a public page. The work projects already appear under
// Experience, and the computer vision work under Publications.
const openProjects = projects
  .filter(p => p.link?.startsWith('#') || p.link?.startsWith('https://github.com/'))
  .map(p => ({ ...p, url: p.link!.startsWith('#') ? `${SITE}/${p.link}` : p.link! }));

const contacts = [
  { label: displayUrl(SITE), href: SITE },
  { label: profile.email, href: `mailto:${profile.email}` },
  { label: displayUrl(profile.github), href: profile.github },
  { label: displayUrl(profile.linkedin), href: profile.linkedin },
];

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="mt-5" aria-label={title}>
    <h2 className="mb-2 break-after-avoid border-b border-slate-300 pb-1 text-[8.5pt] font-bold uppercase tracking-[0.14em] text-sky-800">{title}</h2>
    {children}
  </section>
);

const RoleHeader: React.FC<{ title: string; company: string; date: string }> = ({ title, company, date }) => (
  <header className="flex flex-wrap items-baseline justify-between gap-x-4">
    <h3 className="font-semibold text-slate-900">
      {title} <span className="font-normal text-slate-600">· {company}</span>
    </h3>
    <p className="text-[8.5pt] text-slate-500 tabular-nums">{formatDates(date)}</p>
  </header>
);

const Resume: React.FC = () => {
  return (
    <>
      <nav className="mx-auto flex max-w-[8.5in] flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-0 print:hidden" aria-label="Résumé actions">
        <a href="/" className="text-sm font-semibold text-slate-600 transition-colors hover:text-sky-700 dark:text-slate-300 dark:hover:text-sky-300">
          ← oguzakkas.com
        </a>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition-colors hover:border-sky-500 hover:text-sky-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-sky-400 dark:hover:text-sky-300"
          >
            Print
          </button>
          <a href={RESUME_PDF} download="Oguz-Akkas-Resume.pdf" className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-500">
            Download PDF
          </a>
        </div>
      </nav>

      <main className="mx-auto mb-10 max-w-[8.5in] bg-white px-5 py-8 text-[14px] leading-[1.45] text-slate-700 shadow-xl shadow-slate-900/10 ring-1 ring-slate-200 sm:px-[0.6in] sm:py-[0.5in] sm:text-[9.5pt] dark:ring-slate-800 print:m-0 print:max-w-none print:p-0 print:shadow-none print:ring-0">
        <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
          <div>
            <h1 className="text-[22pt] font-bold leading-none tracking-tight text-slate-900">{profile.name}</h1>
            <p className="mt-1.5 text-[11pt] font-medium text-sky-800">{profile.title}</p>
          </div>
          <ul className="text-[8.5pt] leading-snug text-slate-600 sm:text-right">
            {contacts.map(contact => (
              <li key={contact.href}>
                <a href={contact.href} className="hover:text-sky-700">{contact.label}</a>
              </li>
            ))}
          </ul>
        </header>

        <p className="mt-4">{profile.summary}</p>

        <Section title="Skills">
          <ul className="grid gap-x-6 gap-y-0.5 sm:grid-cols-2">
            {skillsData.map(group => (
              <li key={group.category}>
                <span className="font-semibold text-slate-900">{group.category}:</span> {group.skills.join(', ')}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Experience">
          {experiences.map(role => (
            <article key={`${role.company}-${role.date}`} className="mb-3 break-inside-avoid">
              <RoleHeader title={role.title} company={role.company} date={role.date} />
              <ul className="mt-0.5 list-disc pl-4 marker:text-slate-400">
                {sentences(role.description).map(sentence => (
                  <li key={sentence}>{sentence}</li>
                ))}
              </ul>
              <p className="mt-0.5 text-[8.5pt] text-slate-500">
                <span className="font-medium text-slate-600">Tools:</span> {role.technologies.join(', ')}
              </p>
            </article>
          ))}

          <h3 className="mb-1.5 mt-4 break-after-avoid text-[8.5pt] font-semibold uppercase tracking-wide text-slate-500">Earlier roles</h3>
          {earlierExperiences.map(role => (
            <article key={`${role.company}-${role.date}`} className="mb-2 break-inside-avoid">
              <RoleHeader title={role.title} company={role.company} date={role.date} />
              <p className="mt-0.5">{role.description}</p>
            </article>
          ))}
        </Section>

        <Section title="Open projects">
          {openProjects.map(project => (
            <article key={project.title} className="mb-2 break-inside-avoid">
              <header className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h3 className="font-semibold text-slate-900">{project.title}</h3>
                <a href={project.url} className="text-[8.5pt] text-sky-800 hover:underline">{displayUrl(project.url)}</a>
              </header>
              <p className="mt-0.5">{project.description}</p>
            </article>
          ))}
        </Section>

        <Section title="Education">
          <ul className="space-y-0.5">
            {education.map(item => (
              <li key={item.degree} className="flex flex-wrap items-baseline justify-between gap-x-4">
                <p>
                  <span className="font-semibold text-slate-900">{item.degree}</span>, {item.school}
                </p>
                <p className="text-[8.5pt] text-slate-500 tabular-nums">{item.year}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Publications">
          <ol className="space-y-1">
            {publications.map(pub => (
              <li key={pub.url} className="break-inside-avoid">
                {pub.authors.split(new RegExp(`(${citationName})`)).map((part, index) =>
                  part === citationName ? <strong key={index} className="font-semibold text-slate-900">{part}</strong> : part
                )}{' '}
                ({pub.year}). {pub.title}. <i>{pub.venue}</i>.{' '}
                <a href={pub.url} className="text-sky-800 hover:underline">{displayUrl(pub.url)}</a>
              </li>
            ))}
          </ol>
        </Section>
      </main>
    </>
  );
};

export default Resume;
