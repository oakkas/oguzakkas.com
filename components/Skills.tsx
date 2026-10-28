import React, { useState } from 'react';
import { skillsData, experiences, earlierExperiences, projects } from '../data/profile';

// Technology tags on the page that count as using a skill, when they aren't the skill's own name
const skillTags: Record<string, string[]> = {
  'JavaScript/TypeScript': ['javascript', 'typescript'],
  AWS: ['aws', 's3', 'redshift', 'sagemaker', 'bedrock', 'lambda', 'ground truth'],
  'Apache Spark': ['spark'],
  'scikit-learn': ['sklearn', 'scikit-learn'],
};

const usesSkill = (skill: string, technologies: string[]) => {
  const tags = skillTags[skill] ?? [skill.toLowerCase()];
  return technologies.some(tech => tags.some(tag => tech.toLowerCase().includes(tag)));
};

const Skills: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);

  const roles = selected ? [...experiences, ...earlierExperiences].filter(e => usesSkill(selected, e.technologies)) : [];
  const relatedProjects = selected ? projects.filter(p => usesSkill(selected, p.technologies)) : [];

  return (
    <section id="skills" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24" aria-label="Technical Skills">
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-white/75 dark:bg-slate-900/75 px-6 py-5 backdrop-blur-sm md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-slate-200 lg:sr-only">Skills</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {skillsData.map(({ category, skills }) => (
          <div key={category} className="p-4 rounded-lg bg-slate-100/50 dark:bg-slate-800/50 shadow-xs">
            <h3 className="text-md font-bold text-slate-900 dark:text-white mb-3">{category}</h3>
            <ul className="flex flex-wrap gap-1.5">
              {skills.map(skill => (
                <li key={skill}>
                  <button
                    onClick={() => setSelected(current => (current === skill ? null : skill))}
                    aria-pressed={selected === skill}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      selected === skill
                        ? 'bg-sky-600 text-white'
                        : 'bg-sky-400/10 text-sky-700 hover:bg-sky-400/25 dark:text-sky-300'
                    }`}
                  >
                    {skill}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-4 min-h-12 rounded-lg border border-dashed border-slate-300 p-4 text-sm dark:border-slate-600" aria-live="polite">
        {!selected && <p className="text-slate-500 dark:text-slate-400">Select a skill to see where I've used it.</p>}
        {selected && roles.length === 0 && relatedProjects.length === 0 && (
          <p className="text-slate-500 dark:text-slate-400">No role or project on this page is tagged with {selected} yet.</p>
        )}
        {selected && (roles.length > 0 || relatedProjects.length > 0) && (
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">Where I've used {selected}</p>
            <ul className="mt-2 space-y-1">
              {roles.map(role => (
                <li key={`${role.company}-${role.date}`}>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{role.title}</span> · {role.company}{' '}
                  <span className="text-xs text-slate-500">({role.date.toLowerCase().replace(/\b[a-z]/g, c => c.toUpperCase())})</span>
                </li>
              ))}
              {relatedProjects.map(project => (
                <li key={project.title}>
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Project</span>{' '}
                  <span className="font-medium text-slate-800 dark:text-slate-200">{project.title}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;
