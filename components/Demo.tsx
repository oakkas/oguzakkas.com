import React, { useEffect, useRef, useState } from 'react';
import { demoSamples, scoreExtraction, type DemoRun, type Score } from '../data/demo';
import { savedRuns } from '../data/demoRuns';
import { CheckIcon, CloseIcon, CrossIcon } from './Icons';

// The write-up about how the demo works
const WRITEUP_URL = '/notes/live-demo';

const steps = [
  { title: 'Document image', text: 'A synthetic lab report or clinical note, as a photo, scan, or fax would arrive.' },
  { title: 'Gemini reads it', text: 'The image and instructions go to Gemini, which must answer in a fixed JSON schema.' },
  { title: 'Validate', text: 'A Netlify Function checks the JSON and returns it with timing and token counts.' },
  { title: 'Score', text: 'Every field is compared with the answer key, so formatting like "1 g" vs "1000 mg" still counts.' },
];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const ScoreBadge: React.FC<{ score: Score }> = ({ score }) => {
  const percent = Math.round((score.correct / score.total) * 100);
  const color = percent === 100
    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
    : percent >= 80
      ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
      : 'bg-red-500/15 text-red-700 dark:text-red-300';
  return (
    <span className={`rounded-full px-3 py-1 text-sm font-bold ${color}`}>
      {score.correct}/{score.total} fields correct ({percent}%)
    </span>
  );
};

const ResultTables: React.FC<{ score: Score }> = ({ score }) => (
  <div className="space-y-5">
    {score.groups.map(group => (
      <div key={group.title}>
        <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">{group.title}</h4>
        <div className="relative overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900/60 dark:text-slate-400">
              <tr>{group.columns.map(column => <th key={column} className="whitespace-nowrap px-3 py-2 font-semibold">{column}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {group.rows.map(row => (
                <tr key={row.label}>
                  <td className="whitespace-nowrap px-3 py-2 font-medium text-slate-900 dark:text-slate-100">
                    {row.label}
                    {!row.found && <span className="ml-2 text-xs font-normal text-red-600 dark:text-red-400">not found</span>}
                  </td>
                  {row.fields.map(field => (
                    <td key={field.field} className="px-3 py-2 align-top">
                      <span className={`flex items-center gap-1.5 whitespace-nowrap ${field.ok ? 'text-slate-700 dark:text-slate-200' : 'text-red-700 dark:text-red-300'}`}>
                        <span className={field.ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}>
                          {field.ok ? <CheckIcon /> : <CrossIcon />}
                        </span>
                        {field.actual || '—'}
                        <span className="sr-only">{field.ok ? '(correct)' : `(incorrect, expected ${field.expected})`}</span>
                      </span>
                      {!field.ok && (
                        <span className="mt-0.5 block whitespace-nowrap text-[11px] text-slate-500 dark:text-slate-400" aria-hidden="true">
                          expected {field.expected}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {group.extra.length > 0 && (
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Also extracted, not in the answer key: {group.extra.join(', ')}
          </p>
        )}
      </div>
    ))}
    {score.notes.length > 0 && (
      <div>
        <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Handwritten notes found (not scored)</h4>
        <ul className="flex flex-wrap gap-2">
          {score.notes.map(note => (
            <li key={note} className="rounded-md bg-sky-400/10 px-2.5 py-1 text-sm text-sky-800 dark:text-sky-200">“{note}”</li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

const DemoContent: React.FC = () => {
  const [selectedId, setSelectedId] = useState(demoSamples[0].id);
  const [liveRuns, setLiveRuns] = useState<Record<string, DemoRun>>({});
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [blockedUntil, setBlockedUntil] = useState(0);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (blockedUntil <= Date.now()) return;
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [blockedUntil]);

  const sample = demoSamples.find(s => s.id === selectedId) ?? demoSamples[0];
  const liveRun = liveRuns[sample.id];
  const run = liveRun ?? savedRuns[sample.id];
  const score = run ? scoreExtraction(sample, run.result) : null;
  const secondsLeft = Math.ceil((blockedUntil - now) / 1000);
  const isBlocked = secondsLeft > 0;

  const runLive = async () => {
    setIsRunning(true);
    setError(null);
    try {
      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sampleId: sample.id }),
      });
      const data = await res.json().catch(() => null);
      if (res.status === 429) {
        const wait = Number(res.headers.get('Retry-After')) || Number(data?.retryAfter) || 60;
        setBlockedUntil(Date.now() + wait * 1000);
        setNow(Date.now());
      } else if (res.ok && data?.result) {
        setLiveRuns(runs => ({ ...runs, [sample.id]: data }));
      } else {
        setError(data?.error ?? 'Sorry, the live run failed. Please try again in a moment.');
      }
    } catch {
      setError('Sorry, the live run failed. Please try again in a moment.');
    } finally {
      setIsRunning(false);
    }
  };

  return (
      <div className="p-5 pt-6 md:p-8">
        <p className="text-xs font-bold uppercase tracking-widest text-sky-600 dark:text-sky-400">Live demo</p>
        <h3 id="live-demo-title" className="mt-1 pr-10 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Clinical documents → structured data</h3>
        <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">
          A small re-creation of the OCR and LLM extraction pipelines I build. Gemini reads a document image and returns
          structured data, which is checked against an answer key. Every document here is synthetic.
        </p>

        <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3" role="tablist" aria-label="Sample documents">
          {demoSamples.map(s => (
            <button
              key={s.id}
              role="tab"
              aria-selected={s.id === sample.id}
              aria-controls="demo-panel"
              onClick={() => {
                setSelectedId(s.id);
                setError(null);
              }}
              className={`group overflow-hidden rounded-lg border text-left transition-colors ${
                s.id === sample.id
                  ? 'border-sky-500 ring-2 ring-sky-500/30'
                  : 'border-slate-200 hover:border-slate-400 dark:border-slate-700 dark:hover:border-slate-500'
              }`}
            >
              <img src={s.thumbnail} alt="" loading="lazy" className="h-20 w-full object-cover object-top sm:h-28" />
              <span className={`block px-2 py-2 text-xs font-semibold leading-tight sm:px-3 sm:text-sm ${
                s.id === sample.id ? 'text-sky-700 dark:text-sky-300' : 'text-slate-700 dark:text-slate-300'
              }`}>
                {s.title}
              </span>
            </button>
          ))}
        </div>

        <div id="demo-panel" role="tabpanel" className="mt-6 grid gap-6 lg:grid-cols-5">
          <figure className="min-w-0 lg:col-span-2">
            <a href={sample.image} target="_blank" rel="noreferrer noopener" className="block overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-900">
              <img src={sample.image} alt={sample.alt} className="w-full" width={1000} height={1294} />
            </a>
            <figcaption className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              {sample.description} <a href={sample.image} target="_blank" rel="noreferrer noopener" className="underline hover:text-sky-600 dark:hover:text-sky-300">Open full size</a>
            </figcaption>
          </figure>

          <div className="min-w-0 lg:col-span-3">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              {score && <ScoreBadge score={score} />}
              <button
                onClick={runLive}
                disabled={isRunning || isBlocked}
                className="rounded-full bg-sky-700 px-4 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isRunning ? 'Reading the document…' : isBlocked ? `Run again in ${secondsLeft}s` : run ? 'Run it live again' : 'Run it live'}
              </button>
            </div>
            {run && (
              <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
                {liveRun ? 'Live run just now' : `Saved run from ${formatDate(run.ranAt)}`} · {run.model} · {(run.ms / 1000).toFixed(1)} s ·{' '}
                {(run.inputTokens + run.outputTokens).toLocaleString()} tokens
              </p>
            )}
            {isBlocked && (
              <p className="mb-4 text-sm text-amber-700 dark:text-amber-400" role="status">
                Live runs are limited to 3 a minute per visitor.
              </p>
            )}
            {error && <p className="mb-4 text-sm text-red-600 dark:text-red-400" role="alert">{error}</p>}

            <div className={`transition-opacity ${isRunning ? 'opacity-40' : ''}`} aria-busy={isRunning}>
              {score ? (
                <ResultTables score={score} />
              ) : (
                <p className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-600 dark:text-slate-400">
                  No saved run for this document yet. Run it live to see what Gemini extracts.
                </p>
              )}
            </div>
          </div>
        </div>

        <ol className="mt-8 grid gap-3 border-t border-slate-200 pt-6 sm:grid-cols-2 lg:grid-cols-4 dark:border-slate-700">
          {steps.map((step, index) => (
            <li key={step.title} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-500/15 text-sm font-bold text-sky-700 dark:text-sky-300">
                {index + 1}
              </span>
              <span className="text-sm">
                <span className="block font-semibold text-slate-900 dark:text-slate-100">{step.title}</span>
                <span className="text-slate-600 dark:text-slate-400">{step.text}</span>
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          There are no uploads on purpose: real medical documents don't belong on a portfolio site. The faxed note follows
          the n2c2 2018 medication and adverse drug event extraction task (
          <a href="https://github.com/oakkas/n2c2_2018_task2_llm" target="_blank" rel="noreferrer noopener" className="underline hover:text-sky-600 dark:hover:text-sky-300">
            my notebook on GitHub
          </a>
          ). <a href={WRITEUP_URL} className="underline hover:text-sky-600 dark:hover:text-sky-300">How I built this demo</a>.
        </p>
      </div>
  );
};

// Opening the demo is a link to #live-demo, so any link on the page (or a shared URL) can open it
const DEMO_HASH = '#live-demo';

const Demo: React.FC = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const openFromHash = () => {
      const dialog = dialogRef.current;
      if (window.location.hash !== DEMO_HASH || !dialog || dialog.open) return;
      dialog.showModal();
      setIsOpen(true);
      document.documentElement.style.overflow = 'hidden';
    };
    openFromHash();
    window.addEventListener('hashchange', openFromHash);
    return () => window.removeEventListener('hashchange', openFromHash);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    document.documentElement.style.overflow = '';
    if (window.location.hash === DEMO_HASH) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  return (
    <section id="demo" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24" aria-label="Live demo">
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-white/75 dark:bg-slate-900/75 px-6 py-5 backdrop-blur-sm md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-slate-200 lg:sr-only">Demo</h2>
      </div>

      <div className="group flex flex-col gap-6 overflow-hidden rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:flex-row sm:items-center md:p-8 dark:border-slate-700 dark:bg-slate-800/60">
        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-widest text-sky-600 dark:text-sky-400">Live demo</p>
          <h3 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Clinical documents → structured data</h3>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Watch Gemini read a synthetic lab report or clinical note, then see every extracted field checked against an answer key.
          </p>
          <ul className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
            {['3 synthetic documents', 'Scored field by field', 'A few seconds per run'].map(fact => (
              <li key={fact} className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-700/60">{fact}</li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
            <a
              href={DEMO_HASH}
              className="inline-flex items-center gap-2 rounded-full bg-sky-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-800"
            >
              Open the live demo <span aria-hidden="true">→</span>
            </a>
            <a
              href={WRITEUP_URL}
              className="text-sm font-semibold text-slate-700 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-sky-700 hover:decoration-sky-500 dark:text-slate-300 dark:decoration-slate-600 dark:hover:text-sky-300"
            >
              How I built it
            </a>
          </div>
        </div>
        <a href={DEMO_HASH} tabIndex={-1} aria-hidden="true" className="relative mx-auto h-40 w-56 shrink-0 sm:mx-0 sm:h-44">
          {demoSamples.map((s, index) => (
            <img
              key={s.id}
              src={s.card}
              alt=""
              loading="lazy"
              className={`absolute top-2 h-36 w-28 rounded-md border border-slate-200 object-cover object-top shadow-lg transition-transform duration-300 dark:border-slate-600 ${
                [
                  'left-0 -rotate-6 group-hover:-translate-x-2 group-hover:-rotate-12',
                  'left-14 z-10 group-hover:-translate-y-2',
                  'left-28 rotate-6 group-hover:translate-x-2 group-hover:rotate-12',
                ][index]
              }`}
            />
          ))}
        </a>
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby="live-demo-title"
        onClose={handleClose}
        onClick={event => {
          // A click on the dimmed backdrop lands on the dialog element itself
          if (event.target === dialogRef.current) dialogRef.current?.close();
        }}
        className="m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto bg-white p-0 text-slate-600 backdrop:bg-slate-950/70 backdrop:backdrop-blur-sm sm:m-auto sm:h-auto sm:max-h-[92dvh] sm:w-[min(72rem,94vw)] sm:rounded-2xl sm:shadow-2xl dark:bg-slate-900 dark:text-slate-300"
      >
        {isOpen && (
          <>
            <div className="sticky top-0 z-10 flex h-0 justify-end">
              <button
                onClick={() => dialogRef.current?.close()}
                className="mr-3 mt-3 h-fit rounded-full bg-white/90 p-2 text-slate-500 shadow-sm transition-colors hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-800/90 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
                aria-label="Close the demo"
              >
                <CloseIcon />
              </button>
            </div>
            <DemoContent />
          </>
        )}
      </dialog>
    </section>
  );
};

export default Demo;
