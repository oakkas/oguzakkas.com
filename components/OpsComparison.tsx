import React from 'react';
import { DataOpsIcon, MLOpsIcon, MLEngineeringIcon, DataScienceIcon, DataEngineerIcon } from './Icons';
import { motion } from 'framer-motion';

const disciplines = [
    {
        icon: <DataOpsIcon />,
        title: 'Data Ops',
        description: 'Focuses on automating and managing the data lifecycle to deliver reliable data to the business faster.',
        principles: [
            'Data Sourcing & Ingestion',
            'ETL/ELT Pipelines',
            'Data Quality & Governance',
            'Data Warehousing & Lakes',
            'Automation & Orchestration'
        ]
    },
    {
        icon: <MLOpsIcon />,
        title: 'ML Ops',
        description: 'Applies DevOps principles to machine learning systems to streamline the continuous delivery of high-performing models.',
        principles: [
            'Experiment Tracking',
            'Model Training & Versioning',
            'CI/CD for Models',
            'Model Deployment & Serving',
            'Monitoring & Retraining'
        ]
    },
    {
        icon: <MLEngineeringIcon />,
        title: 'ML Engineering',
        description: 'Builds and maintains production-level ML systems, bridging the gap between model prototyping and scalable deployment.',
        principles: [
            'Model Serving & API Development',
            'Scalable System Architecture',
            'Resource Management & Optimization',
            'CI/CD for ML Systems',
            'Software Engineering Best Practices'
        ]
    },
    {
        icon: <DataScienceIcon />,
        title: 'Data Science',
        description: 'Uses scientific methods, algorithms, and systems to extract knowledge and insights from structured and unstructured data.',
        principles: [
            'Exploratory Data Analysis (EDA)',
            'Statistical Modeling',
            'Hypothesis Testing',
            'Feature Engineering',
            'Model Prototyping & Evaluation'
        ]
    },
    {
        icon: <DataEngineerIcon />,
        title: 'Data Engineering',
        description: 'Designs and builds systems for collecting, storing, and analyzing data at scale, laying the groundwork for analytics.',
        principles: [
            'Data Modeling & Architecture',
            'ETL/ELT Pipeline Development',
            'Database Management',
            'Data Warehousing & Data Lakes',
            'Stream & Batch Processing'
        ]
    }
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

const OpsComparison: React.FC = () => {
    return (
        <section id="ops-comparison" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24" aria-label="Technical Disciplines">
            <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-white/75 dark:bg-slate-900/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-slate-200 lg:sr-only">Technical Disciplines</h2>
            </div>
            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
            >
                {disciplines.map((discipline) => (
                    <motion.div
                        key={discipline.title}
                        className="group p-4 rounded-lg bg-slate-100/50 dark:bg-slate-800/50 shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] drop-shadow-lg flex flex-col"
                        variants={item}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <div className="flex justify-center mb-4 h-20 items-center transform transition-transform duration-300 group-hover:scale-105">
                            {discipline.icon}
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white text-center mb-3">{discipline.title}</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-5 text-sm text-center flex-grow">
                            {discipline.description}
                        </p>
                        <ul className="space-y-2">
                            {discipline.principles.map(principle => (
                                <li key={principle} className="flex items-start gap-2">
                                    <svg className="w-4 h-4 text-sky-500 dark:text-sky-300 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                    <span className="text-sm">{principle}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
};

export default OpsComparison;