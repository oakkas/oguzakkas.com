// Single source for the site's content. The page renders it, and the chat
// assistant (netlify/functions/chat.ts) answers questions from it.

export const profile = {
  name: 'Oguz Akkas',
  title: 'ML & Data Engineer',
  tagline: 'I design and deploy scalable machine learning models and data pipelines, with expertise in NLP and distributed processing.',
  email: 'oakkas84@gmail.com',
  github: 'https://github.com/oakkas',
  linkedin: 'https://www.linkedin.com/in/oguz-akkas-ph-d-2947a836/',
  photo: '/assets/oguz.webp',
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
    date: 'MAR 2022 — SEP 2023',
    title: 'Senior ML / MLOps Engineer',
    company: 'Verana Health',
    description: 'Architected an ML platform where teams could experiment with, test, and deploy models. Built an automated data labeling pipeline with SageMaker Ground Truth, PyTorch and HuggingFace training templates, and a self-service deployment pipeline with automated checks, performance tests, and model monitoring.',
    technologies: ['AWS SageMaker', 'Ground Truth', 'Lambda', 'PyTorch', 'HuggingFace', 'Terraform', 'GitHub Actions', 'Airflow', 'Spark', 'Docker'],
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

// Roles before 2019, shown in a collapsed list. Source: Oguz's 2023 résumé.
export const earlierExperiences = [
  {
    date: 'SEP 2018 — SEP 2019',
    title: 'Principal Scientist',
    company: 'CDC / NIOSH (via Synergy America)',
    description: 'Built text-based machine learning models that assign occupational injury classification codes from injury narratives, and ran epidemiological analyses of injury data.',
    technologies: ['NLP', 'Machine Learning', 'SAS'],
  },
  {
    date: 'JAN 2017 — SEP 2018',
    title: 'Senior Research Scientist',
    company: 'Blankenheim Services',
    description: 'Developed and validated injury risk assessment models from ergonomic job analyses, and advised clients on safer work environments.',
    technologies: ['Risk Modeling', 'Ergonomics'],
  },
  {
    date: 'JAN 2016 — JAN 2017',
    title: 'Machine Learning Specialist (contract)',
    company: 'Augment',
    description: 'Built TensorFlow and Keras deep learning models for converting XML to HTML, using Gensim Doc2Vec to vectorize markup.',
    technologies: ['TensorFlow', 'Keras', 'Gensim'],
  },
  {
    date: 'MAY 2012 — JAN 2017',
    title: 'Research Scientist',
    company: 'Occupational Ergonomics and Biomechanics Lab, UW–Madison',
    description: 'Used computer vision and machine learning to measure worker hand activity and driver distraction from video. Mentored 2 graduate and 5 undergraduate students.',
    technologies: ['Computer Vision', 'Machine Learning'],
  },
];

export const education = [
  { degree: 'Ph.D. (ABD), Industrial and Systems Engineering', note: 'All but dissertation', school: 'University of Wisconsin–Madison', year: '2017' },
  { degree: 'M.S., Industrial and Systems Engineering', school: 'University of Wisconsin–Madison', year: '2013' },
  { degree: 'MBA', school: 'Istanbul University', year: '2010' },
  { degree: 'B.A., Management (Quantitative Methods)', school: 'Istanbul University', year: '2008' },
];

// Peer-reviewed papers from the UW–Madison research, verified on PubMed
export const publications = [
  {
    year: 2023,
    title: 'Comparison of the observer, single-frame video and computer vision hand activity levels',
    authors: 'Radwin RG, Hu YH, Akkas O, Bao S, Harris-Adamson C, Lin JH, Meyers AR, Rempel D',
    venue: 'Ergonomics 66(8)',
    url: 'https://doi.org/10.1080/00140139.2022.2136407',
  },
  {
    year: 2017,
    title: 'Measuring exertion time, duty cycle and hand activity level for industrial tasks using computer vision',
    authors: 'Akkas O, Lee CH, Hu YH, Harris Adamson C, Rempel D, Radwin RG',
    venue: 'Ergonomics 60(12)',
    url: 'https://doi.org/10.1080/00140139.2017.1346208',
  },
  {
    year: 2017,
    title: 'Driver movement patterns indicate distraction and engagement',
    authors: 'Radwin RG, Lee JD, Akkas O',
    venue: 'Human Factors 59(5)',
    url: 'https://doi.org/10.1177/0018720817696496',
  },
  {
    year: 2016,
    title: 'Measuring elemental time and duty cycle using automated video processing',
    authors: 'Akkas O, Lee CH, Hu YH, Yen TY, Radwin RG',
    venue: 'Ergonomics 59(11)',
    url: 'https://doi.org/10.1080/00140139.2016.1146347',
  },
  {
    year: 2015,
    title: 'A hand speed–duty cycle equation for estimating the ACGIH hand activity level rating',
    authors: 'Akkas O, Azari DP, Chen CH, Hu YH, Ulin SS, Armstrong TJ, Rempel D, Radwin RG',
    venue: 'Ergonomics 58(2)',
    url: 'https://doi.org/10.1080/00140139.2014.966155',
  },
];

// A link is optional: work projects at former employers have no public page
export const projects: { title: string; description: string; technologies: string[]; link?: string }[] = [
  {
    title: 'Clinical Document Extraction Demo',
    description: 'The live demo on this page: Gemini reads synthetic lab reports and clinical notes and returns structured data, scored field by field against an answer key.',
    technologies: ['Gemini', 'React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Netlify Functions'],
    link: '#demo',
  },
  {
    title: 'Flyte Bot Conversational AI',
    description: 'Developed a conversational interface leveraging Langchain, OpenAI, Gemini, Anthropic, and Bedrock to enhance user engagement at FlyteHealth.',
    technologies: ['Langchain', 'OpenAI', 'Gemini', 'LLMs'],
  },
  {
    title: 'Automated Data Extraction Pipeline',
    description: 'Engineered OCR and LLM-based data extraction pipelines for patient ID and lab test documents, aligning with robust feature engineering practices.',
    technologies: ['OCR', 'LLMs', 'Python', 'AWS'],
  },
  {
    title: 'High-Throughput Commercial Data Pipeline',
    description: "Redesigned a commercial production tool's data pipeline by integrating custom LLMs and the GPT-4 API, reducing processing time from weeks to hours and optimizing resource allocation at Verana Health.",
    technologies: ['LLMs', 'GPT-4', 'MLOps', 'Data Pipelines'],
  },
  {
    title: 'Automated ML Model Training & Deployment',
    description: 'Created text-based ML model training and deployment templates using PyTorch and HuggingFace, with CI/CD powered by Terraform and GitHub Actions.',
    technologies: ['PyTorch', 'HuggingFace', 'Terraform', 'CI/CD'],
  },
  {
    title: 'Medication & Adverse Drug Event Extraction (n2c2 2018)',
    description: 'Groundwork for LLM-based extraction of medications and adverse drug events from discharge summaries in the n2c2 2018 Track 2 clinical NLP dataset.',
    technologies: ['Clinical NLP', 'LLMs', 'Python', 'Jupyter'],
    link: 'https://github.com/oakkas/n2c2_2018_task2_llm',
  },
  {
    title: 'Computer Vision for Work Exposure',
    description: 'Algorithms that measure hand activity, duty cycle, and exertion time from factory video, published in Ergonomics during research at UW–Madison.',
    technologies: ['Computer Vision', 'Machine Learning', 'Video Analysis'],
    link: 'https://doi.org/10.1080/00140139.2017.1346208',
  },
];
