import React from 'react';
import { DataPipelineIcon, MLOpsIcon } from './Icons';

const dataOpsPrinciples = [
    'Data Sourcing & Ingestion',
    'ETL/ELT Pipelines',
    'Data Quality & Governance',
    'Data Warehousing & Lakes',
    'Automation & Orchestration'
];

const mlOpsPrinciples = [
    'Experiment Tracking',
    'Model Training & Versioning',
    'CI/CD for Models',
    'Model Deployment & Serving',
    'Monitoring & Retraining'
];

const OpsComparison: React.FC = () => {
  return (
    <section id="ops-comparison" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24" aria-label="Ops Comparison">
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-white/75 dark:bg-slate-900/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-slate-200 lg:sr-only">Data Ops vs. ML Ops</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Data Ops Column */}
        <div className="p-8 rounded-lg bg-slate-100/50 dark:bg-slate-800/50 shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] drop-shadow-lg">
          <div className="flex justify-center mb-8">
            <DataPipelineIcon />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-4">Data Ops</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6 text-base text-center">
            Focuses on automating and managing the entire data lifecycle, from source to value, to deliver reliable data to the business faster.
          </p>
          <ul className="space-y-2">
            {dataOpsPrinciples.map(principle => (
              <li key={principle} className="flex items-center gap-2">
                <svg className="w-4 h-4 text-sky-500 dark:text-sky-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                <span className="text-base">{principle}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ML Ops Column */}
        <div className="p-8 rounded-lg bg-slate-100/50 dark:bg-slate-800/50 shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] drop-shadow-lg">
          <div className="flex justify-center mb-8">
            <MLOpsIcon />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-4">ML Ops</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6 text-base text-center">
            Applies DevOps principles to machine learning systems, aiming to unify ML development with operations to standardize and streamline the continuous delivery of high-performing models.
          </p>
          <ul className="space-y-2">
            {mlOpsPrinciples.map(principle => (
              <li key={principle} className="flex items-center gap-2">
                 <svg className="w-4 h-4 text-sky-500 dark:text-sky-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                <span className="text-base">{principle}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default OpsComparison;