import React, { useState } from 'react';
import { DataEngineerIcon, DataScienceIcon, MLEngineeringIcon, MLOpsIcon, DataOpsIcon } from './Icons';

const stages = [
  {
    title: 'Ingest & store',
    icon: <DataEngineerIcon />,
    summary: 'Pipelines that move raw data into data lakes and warehouses, cleaned and ready to use.',
    detail: 'Built and maintained a data lake and data warehouse on S3 and Redshift at FlyteHealth, and Spark and Airflow pipelines at Verana Health and Pinnacol Assurance.',
    tools: ['Apache Spark', 'Airflow', 'Prefect', 'S3', 'Redshift', 'PostgreSQL', 'BigQuery', 'Databricks'],
  },
  {
    title: 'Label & extract',
    icon: <DataScienceIcon />,
    summary: 'Turning documents, free text, and unlabeled data into training data and features.',
    detail: 'Engineered OCR and LLM-based extraction for patient ID and lab test documents at FlyteHealth, and an automated data labeling pipeline with SageMaker Ground Truth at Verana Health.',
    tools: ['OCR', 'LLMs', 'SageMaker Ground Truth', 'spaCy', 'Feature engineering'],
  },
  {
    title: 'Train & track',
    icon: <MLEngineeringIcon />,
    summary: 'Experiments that are reproducible and easy to compare.',
    detail: 'Created PyTorch and HuggingFace training and deployment templates at Verana Health, and manage the model lifecycle with MLflow.',
    tools: ['PyTorch', 'HuggingFace', 'scikit-learn', 'XGBoost', 'MLflow', 'Databricks'],
  },
  {
    title: 'Deploy & automate',
    icon: <MLOpsIcon />,
    summary: 'Models and LLM apps behind reliable services, with infrastructure as code and CI/CD.',
    detail: 'Built a self-service model deployment pipeline with automated checks and performance tests at Verana Health, shipped Flyte Bot on several LLM providers at FlyteHealth, and automated infrastructure with Terraform and GitHub Actions.',
    tools: ['SageMaker', 'Docker', 'Kubernetes', 'AWS Batch', 'Bedrock', 'Terraform', 'GitHub Actions'],
  },
  {
    title: 'Monitor & improve',
    icon: <DataOpsIcon />,
    summary: 'Watching models in production and measuring LLM output against answer keys.',
    detail: 'Monitored deployed models with SageMaker Model Monitor at Verana Health, and built pipelines that alert people when results need attention. The demo on this page scores every LLM extraction field by field.',
    tools: ['SageMaker Model Monitor', 'LLM evaluation', 'Alerting'],
  },
];

const HowIWork: React.FC = () => {
  const [selected, setSelected] = useState(0);
  const stage = stages[selected];

  return (
    <section id="how-i-work" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24" aria-label="How I work">
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-white/75 dark:bg-slate-900/75 px-6 py-5 backdrop-blur-sm md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-slate-200 lg:sr-only">How I work</h2>
      </div>
      <p className="mb-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
        How I take machine learning systems from raw data to production. Pick a stage to see what I've built there.
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5" role="tablist" aria-label="Stages of an ML system">
        {stages.map((s, index) => (
          <button
            key={s.title}
            role="tab"
            aria-selected={index === selected}
            aria-controls="how-i-work-panel"
            onClick={() => setSelected(index)}
            className={`flex flex-col items-center gap-1 rounded-xl border p-3 text-center transition-colors ${
              index === selected
                ? 'border-sky-500 bg-sky-500/10 ring-2 ring-sky-500/20'
                : 'border-slate-200 bg-slate-100/50 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-slate-500'
            }`}
          >
            <span className="hidden h-16 items-center justify-center sm:flex [&>svg]:h-14 [&>svg]:w-14">{s.icon}</span>
            <span className="text-xs font-bold text-sky-600 dark:text-sky-400">Step {index + 1}</span>
            <span className="text-sm font-bold leading-tight text-slate-900 dark:text-white">{s.title}</span>
          </button>
        ))}
      </div>

      <div
        id="how-i-work-panel"
        role="tabpanel"
        className="mt-4 rounded-xl border border-slate-200 bg-white/70 p-5 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/60"
      >
        <h3 className="font-bold text-slate-900 dark:text-white">{stage.title}</h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{stage.summary}</p>
        <p className="mt-3 text-slate-700 dark:text-slate-300">{stage.detail}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tools">
          {stage.tools.map(tool => (
            <li key={tool} className="rounded-full bg-sky-400/10 px-3 py-1 text-xs font-medium text-sky-600 dark:text-sky-300">{tool}</li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default HowIWork;
