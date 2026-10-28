import React from 'react';
import { motion } from 'framer-motion';
import { profile } from '../data/profile';

const About: React.FC = () => {
  return (
    <section id="about" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24" aria-label="About me">
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-white/75 dark:bg-slate-900/75 px-6 py-5 backdrop-blur-sm md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-slate-200 lg:sr-only">About</h2>
      </div>
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex justify-center"
        >
          <motion.img
            src="/assets/ai_engineer.webp"
            alt="AI Engineer Illustration"
            className="h-96 w-auto rounded-lg object-contain opacity-90 hover:opacity-100 transition-opacity duration-300 mix-blend-multiply dark:mix-blend-normal"
            animate={{ y: [0, -15, 0] }}
            transition={{
              repeat: Infinity,
              duration: 4,
              ease: "easeInOut"
            }}
          />
        </motion.div>
        {profile.about.map((paragraph, index) => (
          <p key={index} className={`${index < profile.about.length - 1 ? 'mb-6 ' : ''}text-lg leading-relaxed text-slate-600 dark:text-slate-400`}>
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
};

export default About;