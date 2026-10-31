import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DataEngineerIcon, DataScienceIcon, MLEngineeringIcon, MLOpsIcon, DataOpsIcon } from './Icons';
import NeuralScene from './NeuralScene';

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

// The scroll story needs room and motion: below 1280px wide the stage text
// wraps too much to stay put. Narrower or shorter screens and reduced motion
// get the tabs instead.
const STORY_QUERY = '(min-width: 1280px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)';

const useStoryMode = () => {
  const [enabled, setEnabled] = useState(() => window.matchMedia(STORY_QUERY).matches);
  useEffect(() => {
    const media = window.matchMedia(STORY_QUERY);
    const update = () => setEnabled(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return enabled;
};

const ToolList: React.FC<{ tools: string[] }> = ({ tools }) => (
  <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tools">
    {tools.map(tool => (
      <li key={tool} className="rounded-full bg-sky-400/10 px-3 py-1 text-xs font-medium text-sky-600 dark:text-sky-300">{tool}</li>
    ))}
  </ul>
);

// A tall runway with a pinned stage: scrolling through it steps through the
// stages, and the 3D network turns to the matching layer
const STAGE_SCROLL_VH = 55;

const StageStory: React.FC = () => {
  const runwayRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const runway = runwayRef.current;
      if (!runway) return;
      const rect = runway.getBoundingClientRect();
      const distance = rect.height - window.innerHeight;
      setProgress(Math.min(1, Math.max(0, -rect.top / distance)));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  const active = Math.min(stages.length - 1, Math.floor(progress * stages.length));
  const stage = stages[active];

  // Scroll to the middle of a stage's stretch of the runway
  const goTo = (index: number) => {
    const runway = runwayRef.current;
    if (!runway) return;
    const top = runway.getBoundingClientRect().top + window.scrollY;
    const distance = runway.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + ((index + 0.5) / stages.length) * distance });
  };

  return (
    <div ref={runwayRef} className="relative" style={{ height: `calc(100vh + ${stages.length * STAGE_SCROLL_VH}vh)` }}>
      <div className="sticky top-0 flex h-screen items-center py-12">
        <div className="grid w-full grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-center gap-10">
          <div>
            <ol className="space-y-0.5" aria-label="Stages of an ML system">
              {stages.map((s, index) => {
                const fill = Math.min(1, Math.max(0, progress * stages.length - index));
                return (
                  <li key={s.title}>
                    <button
                      type="button"
                      aria-current={index === active ? 'step' : undefined}
                      onClick={() => goTo(index)}
                      className="group flex w-full items-center gap-3 rounded-md py-1.5 text-left"
                    >
                      <span className="w-5 text-xs font-semibold tabular-nums text-slate-400 dark:text-slate-500">0{index + 1}</span>
                      <span className="relative h-1 w-10 shrink-0 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700" aria-hidden="true">
                        <span className="absolute inset-y-0 left-0 rounded-full bg-sky-500" style={{ width: `${fill * 100}%` }}></span>
                      </span>
                      <span
                        className={`text-sm font-semibold transition-colors ${
                          index === active ? 'text-slate-900 dark:text-white' : 'text-slate-500 group-hover:text-slate-800 dark:text-slate-400 dark:group-hover:text-slate-200'
                        }`}
                      >
                        {s.title}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>

            <div className="relative mt-8 min-h-[23rem]" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={stage.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="text-xs font-bold uppercase tracking-widest text-sky-700 dark:text-sky-400">
                    Step {active + 1} of {stages.length}
                  </p>
                  <h3 className="mt-2 text-3xl font-medium tracking-tight text-slate-900 dark:text-white">{stage.title}</h3>
                  <p className="mt-3 text-lg leading-snug text-slate-600 dark:text-slate-300">{stage.summary}</p>
                  <p className="mt-3 text-slate-700 dark:text-slate-300">{stage.detail}</p>
                  <ToolList tools={stage.tools} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="relative h-[min(62vh,34rem)] overflow-hidden rounded-3xl border border-slate-200 bg-linear-to-br from-white via-slate-50 to-sky-50 shadow-sm dark:border-slate-700/80 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
            <NeuralScene focus={active} />
          </div>
        </div>
      </div>
    </div>
  );
};

const StageTabs: React.FC = () => {
  const [selected, setSelected] = useState(0);
  const stage = stages[selected];

  return (
    <>
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
        <ToolList tools={stage.tools} />
      </div>
    </>
  );
};

const HowIWork: React.FC = () => {
  const story = useStoryMode();

  return (
    <section id="how-i-work" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24" aria-label="How I work">
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-white/75 dark:bg-slate-900/75 px-6 py-5 backdrop-blur-sm md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-slate-200 lg:sr-only">How I work</h2>
      </div>
      <p className="mb-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
        How I take machine learning systems from raw data to production.{' '}
        {story ? 'Scroll through the five stages, or pick one.' : "Pick a stage to see what I've built there."}
      </p>
      {story ? <StageStory /> : <StageTabs />}
    </section>
  );
};

export default HowIWork;
