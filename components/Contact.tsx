import React from 'react';

const REPO = 'https://github.com/oakkas/oguzakkas.com';
const link =
  'font-medium text-slate-700 underline decoration-slate-300 underline-offset-2 hover:text-sky-700 hover:decoration-sky-500 dark:text-slate-300 dark:decoration-slate-600 dark:hover:text-sky-300';

const Contact: React.FC = () => {
  return (
    <footer className="max-w-md pb-16 text-sm text-slate-500 sm:pb-0 dark:text-slate-400">
        <p>
            Designed and built by me in Visual Studio Code, with help from Claude Code. Made with React, Tailwind CSS, and Vite,
            deployed with Netlify. The design is inspired by modern web portfolios, and all text is set in the Inter typeface.
            The source is on{' '}
            <a href={REPO} target="_blank" rel="noreferrer noopener" className={link}>
                GitHub<span className="sr-only"> (opens in a new tab)</span>
            </a>
            .
        </p>
    </footer>
  );
};

export default Contact;
