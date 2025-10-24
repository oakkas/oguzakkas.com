import React from 'react';

const skillsData = [
  {
    category: 'Programming Languages',
    skills: ['Python', 'SQL', 'JavaScript/TypeScript', 'Scala']
  },
  {
    category: 'Cloud Platforms',
    skills: ['AWS', 'GCP', 'Databricks']
  },
  {
    category: 'ML Frameworks & Libraries',
    skills: ['PyTorch', 'TensorFlow', 'scikit-learn', 'Langchain', 'HuggingFace']
  },
  {
    category: 'Data Processing & Databases',
    skills: ['Apache Spark', 'PostgreSQL', 'Redshift', 'Airflow', 'Pandas']
  },
  {
    category: 'DevOps & MLOps',
    skills: ['Docker', 'Kubernetes', 'Terraform', 'MLFlow', 'GitHub Actions']
  },
  {
    category: 'Web Technologies',
    skills: ['React', 'Node.js', 'Tailwind CSS', 'HTML/CSS']
  }
];

const Skills: React.FC = () => {
  return (
    <section id="skills" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24" aria-label="Technical Skills">
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-white/75 dark:bg-slate-900/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-slate-200 lg:sr-only">Skills</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {skillsData.map(({ category, skills }) => (
          <div key={category} className="p-4 rounded-lg bg-slate-100/50 dark:bg-slate-800/50 shadow-sm">
            <h3 className="text-md font-bold text-slate-900 dark:text-white mb-3">{category}</h3>
            <ul className="space-y-2">
              {skills.map(skill => (
                <li key={skill} className="flex items-center text-sm">
                  <svg className="w-3 h-3 mr-2 text-sky-500 dark:text-sky-400 flex-shrink-0" fill="currentColor" viewBox="0 0 8 8">
                    <circle cx="4" cy="4" r="3" />
                  </svg>
                  <span>{skill}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
