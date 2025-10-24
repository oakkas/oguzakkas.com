import React from 'react';

const About: React.FC = () => {
  return (
    <section id="about" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24" aria-label="About me">
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-white/75 dark:bg-slate-900/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-slate-200 lg:sr-only">About</h2>
      </div>
      <div>
        <p className="mb-6 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
          As an experienced ML & Data Engineer, I have a proven record of designing and deploying machine learning models and feature engineering pipelines for production environments. My expertise spans Natural Language Processing (NLP), distributed data processing with Spark, and comprehensive model lifecycle management using MLFlow.
        </p>
        <p className="mb-6 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
          I hold advanced degrees in Industrial Engineering from the University of Wisconsin-Madison and have a track record of delivering scalable, real-time AI solutions across diverse sectors. I thrive on architecting robust systems and leading teams to turn complex technical challenges into impactful products.
        </p>
        <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
          Throughout my career, I've worked with a wide array of tools and technologies, from foundational deep learning frameworks like TensorFlow and PyTorch to modern LLMs from OpenAI, Google, and Anthropic. I'm adept at cloud computing in both AWS and GCP, and I leverage infrastructure-as-code tools like Terraform to build efficient and reproducible environments.
        </p>
      </div>
    </section>
  );
};

export default About;