import React from 'react';

export const GitHubIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-6 w-6" aria-hidden="true">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path>
  </svg>
);

export const LinkedInIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden="true">
    <path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2ZM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 1 1 8.25 6.5 1.75 1.75 0 0 1 6.5 8.25ZM19 19h-3v-4.75c0-1.4-1.2-2.5-2.5-2.5S11 12.85 11 14.25V19h-3v-9h2.9v1.3a3.11 3.11 0 0 1 2.6-1.4c2.5 0 4.5 2.2 4.5 5.1V19z"></path>
  </svg>
);

export const EmailIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden="true">
        <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"></path>
    </svg>
);

export const ArrowUpRightIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="inline-block h-4 w-4 shrink-0 transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1 group-focus-visible/link:-translate-y-1 group-focus-visible/link:translate-x-1 motion-reduce:transition-none ml-1 translate-y-px" aria-hidden="true">
        <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0V4.5a.75.75 0 00-.75-.75H8.25a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd"></path>
    </svg>
);

export const DataOpsIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 80 48" strokeWidth="1.5" className="w-24 h-14 text-sky-500 dark:text-sky-300" aria-hidden="true">
      <style>{`
        .data-dot {
          animation: data-flow 3s linear infinite;
          fill: currentColor;
          stroke: none;
          offset-path: path('M24 24 H 64');
        }
        @keyframes data-flow {
          from { offset-distance: 0%; }
          to { offset-distance: 100%; }
        }
      `}</style>
      <path stroke="currentColor" className="text-slate-400 dark:text-slate-500" strokeLinecap="round" strokeLinejoin="round" d="M20 18h-12c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2z" />
      <path stroke="currentColor" className="text-slate-400 dark:text-slate-500" strokeLinecap="round" strokeLinejoin="round" d="M6 20v8" />
      <path stroke="currentColor" className="text-slate-400 dark:text-slate-500" strokeLinecap="round" strokeLinejoin="round" d="M14 18v12" />
      <path stroke="currentColor" className="text-slate-400 dark:text-slate-500" strokeLinecap="round" strokeLinejoin="round" d="M22 20v8" />
      <path d="M24 24 H 64" strokeDasharray="4 2" stroke="currentColor" className="text-slate-500 dark:text-slate-600" />
      <rect x="64" y="16" width="8" height="16" rx="1" stroke="currentColor" className="text-slate-400 dark:text-slate-500" />
      <circle r="2.5" className="data-dot" style={{ animationDelay: '0s' }} />
      <circle r="2.5" className="data-dot" style={{ animationDelay: '-0.75s' }} />
      <circle r="2.5" className="data-dot" style={{ animationDelay: '-1.5s' }} />
      <circle r="2.5" className="data-dot" style={{ animationDelay: '-2.25s' }} />
    </svg>
);

export const MLOpsIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" className="w-20 h-20 text-sky-500 dark:text-sky-300" aria-hidden="true">
    <style>{`
      .ml-dot {
        fill: currentColor;
        stroke: none;
        animation: ml-cycle 6s linear infinite;
        offset-path: path('M32,8 A24,24 0 1,1 31.99,8');
      }
      .ml-icon-group:nth-child(2) .ml-icon-bg { animation: icon-pulse-dark 6s linear infinite 0s; }
      .ml-icon-group:nth-child(3) .ml-icon-bg { animation: icon-pulse-dark 6s linear infinite -1.5s; }
      .ml-icon-group:nth-child(4) .ml-icon-bg { animation: icon-pulse-dark 6s linear infinite -3s; }
      .ml-icon-group:nth-child(5) .ml-icon-bg { animation: icon-pulse-dark 6s linear infinite -4.5s; }
      .dark .ml-icon-group:nth-child(2) .ml-icon-bg { animation-name: icon-pulse-dark; }
      .dark .ml-icon-group:nth-child(3) .ml-icon-bg { animation-name: icon-pulse-dark; }
      .dark .ml-icon-group:nth-child(4) .ml-icon-bg { animation-name: icon-pulse-dark; }
      .dark .ml-icon-group:nth-child(5) .ml-icon-bg { animation-name: icon-pulse-dark; }
      html:not(.dark) .ml-icon-group:nth-child(2) .ml-icon-bg { animation: icon-pulse-light 6s linear infinite 0s; }
      html:not(.dark) .ml-icon-group:nth-child(3) .ml-icon-bg { animation: icon-pulse-light 6s linear infinite -1.5s; }
      html:not(.dark) .ml-icon-group:nth-child(4) .ml-icon-bg { animation: icon-pulse-light 6s linear infinite -3s; }
      html:not(.dark) .ml-icon-group:nth-child(5) .ml-icon-bg { animation: icon-pulse-light 6s linear infinite -4.5s; }
      @keyframes ml-cycle {
        from { offset-distance: 0%; }
        to { offset-distance: 100%; }
      }
      @keyframes icon-pulse-dark {
        0%, 100%, 10%, 40% { fill: #1E293B; }
        25% { fill: #0ea5e9; }
      }
      @keyframes icon-pulse-light {
        0%, 100%, 10%, 40% { fill: #f1f5f9; }
        25% { fill: #0ea5e9; }
      }
    `}</style>
    <circle cx="32" cy="32" r="24" stroke="currentColor" strokeDasharray="5 3" className="text-slate-500 dark:text-slate-600" strokeWidth="1.5"/>
    <g transform="translate(24, 2)" className="ml-icon-group">
      <circle cx="8" cy="6" r="8" className="ml-icon-bg fill-slate-100 dark:fill-slate-800" />
      <path d="M10.5 7.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 5V3m0 10v-2m-5-3H1m10 0h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </g>
    <g transform="translate(50, 24)" className="ml-icon-group">
      <circle cx="8" cy="8" r="8" className="ml-icon-bg fill-slate-100 dark:fill-slate-800" />
      <path d="M4.5 11.5l7-7m-7 0h7v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
    <g transform="translate(24, 50)" className="ml-icon-group">
      <circle cx="8" cy="8" r="8" className="ml-icon-bg fill-slate-100 dark:fill-slate-800" />
      <path d="M4 12h2v-4h2v4h2v-6h2v6h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </g>
    <g transform="translate(2, 24)" className="ml-icon-group">
      <circle cx="8" cy="8" r="8" className="ml-icon-bg fill-slate-100 dark:fill-slate-800" />
      <path d="M7 5l-4 4 4 4m6-8l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </g>
    <circle r="3" className="ml-dot" />
  </svg>
);

export const MLEngineeringIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" className="w-20 h-20 text-sky-500 dark:text-sky-300" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 25.5l5.25 3.375-5.25 3.375m6-6.75l5.25 3.375-5.25 3.375" className="text-slate-400 dark:text-slate-500" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 32.25l-5.25-3.375m5.25 3.375l-5.25 3.375" className="text-slate-400 dark:text-slate-500" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M28 32c0 5.523-4.477 10-10 10S8 37.523 8 32 12.477 22 18 22s10 4.477 10 10z" className="text-slate-400 dark:text-slate-500" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M48 32c0 5.523-4.477 10-10 10S28 37.523 28 32s4.477-10 10-10 10 4.477 10 10z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M56 32c0 2.21-.896 4.21-2.343 5.657M32 56c-2.21 0-4.21-.896-5.657-2.343" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M32 8c2.21 0 4.21.896 5.657 2.343M8 32c0-2.21.896-4.21 2.343-5.657" />
    </svg>
);

export const DataScienceIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" className="w-20 h-20 text-sky-500 dark:text-sky-300" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <circle cx="26" cy="26" r="14" />
        <path strokeLinecap="round" d="M36 36l10 10" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 20h4v12h-4z" className="text-slate-400 dark:text-slate-500" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M28 16h4v16h-4z" className="text-slate-400 dark:text-slate-500" />
    </svg>
);

export const DataEngineerIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" className="w-20 h-20 text-sky-500 dark:text-sky-300" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <ellipse cx="32" cy="16" rx="16" ry="6" />
        <path d="M16 16v32c0 3.314 7.163 6 16 6s16-2.686 16-6V16" />
        <ellipse cx="32" cy="32" rx="16" ry="6" />
        <ellipse cx="32" cy="48" rx="16" ry="6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 24h6m-3-3v6" className="text-slate-400 dark:text-slate-500" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M54 40h-6m3 3v-6" className="text-slate-400 dark:text-slate-500" />
    </svg>
);


export const SunIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
    </svg>
);

export const MoonIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
    </svg>
);