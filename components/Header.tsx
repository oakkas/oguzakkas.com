import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="lg:hidden p-4 bg-white/75 dark:bg-slate-900/75 backdrop-blur-sm sticky top-0 z-50">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Oguz Akkas</h1>
      <h2 className="text-lg text-slate-600 dark:text-slate-400">ML & Data Engineer</h2>
    </header>
  );
};

export default Header;