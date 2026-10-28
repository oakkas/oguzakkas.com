// Single source for the site's content. The page renders it, and the chat
// assistant (netlify/functions/chat.ts) answers questions from it.

export const profile = {
  name: 'Oguz Akkas',
  title: 'ML & Data Engineer',
  tagline: 'I design and deploy scalable machine learning models and data pipelines, with expertise in NLP and distributed processing.',
  email: 'oakkas84@gmail.com',
  github: 'https://github.com/oakkas',
  linkedin: 'https://www.linkedin.com/in/oguz-akkas-ph-d-2947a836/',
  about: [
    "As an experienced ML & Data Engineer, I have a proven record of designing and deploying machine learning models and feature engineering pipelines for production environments. My expertise spans Natural Language Processing (NLP), distributed data processing with Spark, and comprehensive model lifecycle management using MLFlow.",
    "I hold advanced degrees in Industrial Engineering from the University of Wisconsin-Madison and have a track record of delivering scalable, real-time AI solutions across diverse sectors. I thrive on architecting robust systems and leading teams to turn complex technical challenges into impactful products.",
    "Throughout my career, I've worked with a wide array of tools and technologies, from foundational deep learning frameworks like TensorFlow and PyTorch to modern LLMs from OpenAI, Google, and Anthropic. I'm adept at cloud computing in both AWS and GCP, and I leverage infrastructure-as-code tools like Terraform to build efficient and reproducible environments.",
  ],
};

// Facts the chat assistant may use that the page doesn't show, such as your
// location, your pronouns, the roles you're open to, or your PhD research.
// One fact per string.
export const extraFacts: string[] = [];

export const skillsData = [
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

export const experiences = [
  {
    date: 'APR 2024 — PRESENT',
    title: 'Lead Data / ML Engineer',
    company: 'FlyteHealth',
    description: 'Developed Flyte Bot, a conversational interface using Langchain, OpenAI, Gemini, and more. Engineered OCR and LLM-based data extraction pipelines. Built and maintained a Data Lake and Data Warehouse on S3/Redshift, and automated CI/CD processes with Terraform.',
    technologies: ['Langchain', 'OpenAI', 'Gemini', 'Anthropic', 'Bedrock', 'S3', 'Redshift', 'PostgreSQL', 'AWS Batch', 'Terraform'],
    link: 'https://www.flytehealth.com/'
  },
  {
    date: 'OCT 2023 — MAR 2024',
    title: 'Senior Tech Lead',
    company: 'Verana Health',
    description: "Redesigned a commercial production tool's data pipeline with custom LLMs and GPT-4, reducing processing time from weeks to hours. Led efforts in defining, architecting, and developing a machine learning platform and mentored junior engineers.",
    technologies: ['LLMs', 'GPT-4', 'MLOps', 'Databricks', 'PySpark', 'Airflow', 'AWS SageMaker', 'Terraform', 'Docker'],
    link: 'https://www.veranahealth.com/'
  },
  {
    date: 'APR 2021 — MAR 2022',
    title: 'Senior Machine Learning Software Engineer',
    company: 'Wind River',
    description: "Led the design, development, and integration of the data science platform. Contributed to ETL and data extraction processes designed for distributed and parallel efficiency, and wrangled data to build and deploy analytical models.",
    technologies: ['Python', 'ETL', 'Cloud Analytics', 'Data Science', 'ML Platform'],
    link: 'https://www.windriver.com/'
  },
   {
    date: 'SEP 2019 — APR 2021',
    title: 'NLP Engineer / Data Scientist',
    company: 'Pinnacol Assurance',
    description: "Performed EDA and applied various machine learning and deep learning models. Created end-to-end machine learning pipelines using Sklearn, Airflow, PySpark, and Prefect. Automated workflows with Docker, Kubernetes, and Google Cloud products.",
    technologies: ['Python', 'sklearn', 'pandas', 'Airflow', 'PySpark', 'Prefect', 'Docker', 'Kubernetes', 'GCP'],
    link: 'https://www.pinnacol.com/'
  }
];

export const projects = [
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
