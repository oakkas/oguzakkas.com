import React from 'react';
import { ArrowUpRightIcon } from './Icons';

const projects = [
  {
    title: 'Flyte Bot Conversational AI',
    description: 'Developed a conversational interface leveraging Langchain, OpenAI, Gemini, Anthropic, and Bedrock to enhance user engagement at FlyteHealth.',
    technologies: ['Langchain', 'OpenAI', 'Gemini', 'LLMs'],
    link: 'https://github.com/oakkas',
  },
  {
    title: 'Automated Data Extraction Pipeline',
    description: 'Engineered OCR and LLM-based data extraction pipelines for patient ID and lab test documents, aligning with robust feature engineering practices.',
    technologies: ['OCR', 'LLMs', 'Python', 'AWS'],
    link: 'https://github.com/oakkas',
  },
  {
    title: 'High-Throughput Commercial Data Pipeline',
    description: "Redesigned a commercial production tool's data pipeline by integrating custom LLMs and the GPT-4 API, reducing processing time from weeks to hours and optimizing resource allocation at Verana Health.",
    technologies: ['LLMs', 'GPT-4', 'MLOps', 'Data Pipelines'],
    link: 'https://github.com/oakkas',
  },
   {
    title: 'Automated ML Model Training & Deployment',
    description: 'Created text-based ML model training and deployment templates using PyTorch and HuggingFace, with CI/CD powered by Terraform and GitHub Actions.',
    technologies: ['PyTorch', 'HuggingFace', 'Terraform', 'CI/CD'],
    link: 'https://github.com/oakkas',
  },
];

const ProjectCard: React.FC<{ project: typeof projects[0] }> = ({ project }) => {
  return (
    <li className="mb-12">
      <div className="group relative grid gap-4 pb-1 transition-all lg:hover:!opacity-100 lg:group-hover/list:opacity-50">
        <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-slate-100/50 dark:lg:group-hover:bg-slate-800/50 lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover:drop-shadow-lg"></div>
        <div className="z-10">
          <h3>
             <a className="inline-flex items-baseline font-medium leading-tight text-slate-900 dark:text-slate-200 hover:text-sky-500 dark:hover:text-sky-300 focus-visible:text-sky-500 dark:focus-visible:text-sky-300 group/link text-base" href={project.link} target="_blank" rel="noreferrer noopener" aria-label={`${project.title} (opens in a new tab)`}>
              <span className="absolute -inset-x-4 -inset-y-2.5 hidden rounded md:-inset-x-6 md:-inset-y-4 lg:block"></span>
              <span>{project.title} <ArrowUpRightIcon /> </span>
             </a>
          </h3>
          <p className="mt-2 text-sm leading-normal">{project.description}</p>
          <ul className="mt-2 flex flex-wrap" aria-label="Technologies used">
            {project.technologies.map(tech => (
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


const Projects: React.FC = () => {
  return (
    <section id="projects" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24" aria-label="Selected projects">
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-white/75 dark:bg-slate-900/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-slate-200 lg:sr-only">Projects</h2>
      </div>
      <div>
        <ul className="group/list">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Projects;