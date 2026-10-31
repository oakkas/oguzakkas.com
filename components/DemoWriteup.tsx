import React from 'react';
import { profile } from '../data/profile';
import { demoSamples, scoreExtraction } from '../data/demo';
import { savedRuns } from '../data/demoRuns';
import { ArrowUpRightIcon } from './Icons';

// "How I built the live demo": a write-up served at /notes/live-demo. The scores,
// timings and documents come from the demo's own data, so they stay in sync with
// the saved runs. The rate limits are set in netlify/functions/*.ts.

const REPO = 'https://github.com/oakkas/oguzakkas.com';
const N2C2_REPO = 'https://github.com/oakkas/n2c2_2018_task2_llm';

const results = demoSamples.map(sample => {
  const run = savedRuns[sample.id];
  const score = scoreExtraction(sample, run.result);
  const notes = 'handwrittenNotes' in run.result ? run.result.handwrittenNotes?.length ?? 0 : 0;
  return { sample, run, score, notes };
});
const runDate = new Date(results[0].run.ranAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

const flow = [
  { who: 'Your browser', what: 'Sends only the document’s ID', detail: '{ "sampleId": "lab-report-photo" }', mono: true },
  { who: 'Netlify Function', what: 'Loads that image from this site', detail: 'At most 3 live runs a minute per visitor' },
  { who: 'Gemini 3.5 Flash-Lite', what: 'Reads the image', detail: 'A short prompt and a JSON schema the answer must follow' },
  { who: 'Your browser', what: 'Checks every field', detail: 'Against the answer key, and shows what matched' },
];

const H2: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="mb-4 mt-14 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">{children}</h2>
);
const P: React.FC<{ children: React.ReactNode }> = ({ children }) => <p className="mb-5">{children}</p>;
const Code: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.85em] text-slate-800 dark:bg-slate-800 dark:text-slate-200">{children}</code>
);
const Block: React.FC<{ children: string; label: string }> = ({ children, label }) => (
  <figure className="mb-6">
    <pre className="overflow-x-auto rounded-xl bg-slate-900 p-4 font-mono text-[13px] leading-relaxed text-slate-100 ring-1 ring-slate-800 dark:bg-slate-950">
      <code>{children}</code>
    </pre>
    <figcaption className="mt-2 text-xs text-slate-500 dark:text-slate-400">{label}</figcaption>
  </figure>
);
const Source: React.FC<{ path: string; children?: React.ReactNode }> = ({ path, children }) => (
  <a href={`${REPO}/blob/main/${path}`} target="_blank" rel="noreferrer noopener" className="text-sky-700 underline decoration-sky-300 underline-offset-2 hover:decoration-sky-600 dark:text-sky-300 dark:decoration-sky-700">
    {children ?? path}
  </a>
);
const Bullets: React.FC<{ items: React.ReactNode[] }> = ({ items }) => (
  <ul className="mb-5 list-disc space-y-2 pl-5 marker:text-slate-400">
    {items.map((item, index) => <li key={index}>{item}</li>)}
  </ul>
);

const DemoWriteup: React.FC = () => {
  return (
    <div className="font-sans text-slate-700 dark:text-slate-300">
      <nav className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-6" aria-label="Page">
        <a href="/" className="text-sm font-semibold text-slate-600 transition-colors hover:text-sky-700 dark:text-slate-300 dark:hover:text-sky-300">
          ← {profile.name}
        </a>
        <a href="/#live-demo" className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-500">
          Try the live demo
        </a>
      </nav>

      <main className="mx-auto max-w-3xl px-6 pb-24 text-[17px] leading-relaxed">
        <header className="mb-10 mt-6">
          <p className="text-xs font-bold uppercase tracking-widest text-sky-700 dark:text-sky-400">Notes · October 2026 · 5 min read</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl dark:text-white">How I built the live demo</h1>
          <p className="mt-5 text-xl leading-relaxed text-slate-600 dark:text-slate-400">
            The demo on my homepage has Gemini read lab reports and a clinical note, return structured data, and then checks every field
            against an answer key. Here’s how it works, what keeps it free and safe, and what I’d change for production.
          </p>
        </header>

        <H2>Why build it</H2>
        <P>
          At work I build OCR and LLM pipelines that pull structured data out of patient documents. That work can’t be shown in public, so I
          built a small, open version of it for this site, with four rules:
        </P>
        <Bullets
          items={[
            <><strong className="font-semibold text-slate-900 dark:text-white">Real runs.</strong> A real model reads every document, with nothing faked or tuned per document.</>,
            <><strong className="font-semibold text-slate-900 dark:text-white">No uploads.</strong> Visitors pick from built-in synthetic documents, so nobody can send real health data.</>,
            <><strong className="font-semibold text-slate-900 dark:text-white">Scored, not just shown.</strong> Every field is checked against an answer key, so the demo shows its accuracy instead of claiming it.</>,
            <><strong className="font-semibold text-slate-900 dark:text-white">Free to run.</strong> It had to fit in free tiers, with no server to look after.</>,
          ]}
        />

        <H2>How a run works</H2>
        <ol className="mb-6 grid gap-3 md:grid-cols-4" aria-label="Steps of a live run">
          {flow.map((step, index) => (
            <li key={step.what} className="relative rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-700 dark:bg-slate-800/60">
              <span className="text-xs font-bold text-sky-700 dark:text-sky-400">{index + 1} · {step.who}</span>
              <span className="mt-1 block font-semibold text-slate-900 dark:text-white">{step.what}</span>
              <span className={`mt-1 block text-slate-500 dark:text-slate-400 ${step.mono ? 'break-all font-mono text-xs' : ''}`}>{step.detail}</span>
              {index < flow.length - 1 && (
                <span className="absolute left-1/2 top-full z-10 -translate-x-1/2 text-slate-400 md:left-full md:top-1/2 md:-translate-y-1/2 md:translate-x-[-1px]" aria-hidden="true">
                  <span className="md:hidden">↓</span>
                  <span className="hidden md:inline">→</span>
                </span>
              )}
            </li>
          ))}
        </ol>
        <P>
          The browser never sends an image or the API key. The function can only send one of three known images to the model, and the key
          stays in Netlify’s environment. Code: <Source path="netlify/functions/extract.ts" />.
        </P>

        <H2>Synthetic documents that look real</H2>
        <P>Three documents, each harder to read than the last:</P>
        <Bullets
          items={demoSamples.map(sample => (
            <><strong className="font-semibold text-slate-900 dark:text-white">{sample.title}:</strong> {sample.description}</>
          ))}
        />
        <P>
          Each one starts as an HTML page that headless Chrome turns into an image. The “photo” is a report tilted in 3D with CSS
          (<Code>perspective(1600px) rotateX(5deg) rotateZ(-2.2deg)</Code>), slightly blurred, with notes in a handwriting font. The fax is
          grayscale, high-contrast and blurred, with a noise texture on top. Every document is stamped as synthetic, and none contains real
          patient data. The note follows the style of the n2c2 2018 medication extraction challenge, which I’ve also explored in{' '}
          <a href={N2C2_REPO} target="_blank" rel="noreferrer noopener" className="text-sky-700 underline decoration-sky-300 underline-offset-2 hover:decoration-sky-600 dark:text-sky-300 dark:decoration-sky-700">a separate project</a>.
        </P>

        <H2>Make the model answer in a fixed shape</H2>
        <P>
          Free-form answers are hard to check. Gemini supports structured output: you send a JSON schema, and the response has to match it.
          For lab reports, every row has the same five fields:
        </P>
        <Block label="The lab report schema, shortened. The clinical note uses medications { drug, dose, route, frequency } and adverseEvents { drug, reaction }.">
{`responseMimeType: 'application/json',
responseSchema: {
  type: 'OBJECT',
  properties: {
    results: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: { test, value, unit, referenceRange, flag },   // all strings
        required: ['test', 'value', 'unit', 'referenceRange', 'flag'],
      },
    },
    handwrittenNotes: { type: 'ARRAY', items: { type: 'STRING' } },
  },
}`}
        </Block>
        <P>
          The prompts are short and specific: extract every row exactly as printed, don’t treat section titles as tests, mark high and low
          flags, and <em>“If you can’t read something, leave it empty rather than guessing.”</em> In clinical data an empty field is easy to
          send to a person to check. A confident wrong value is not.
        </P>

        <H2>Scoring: same meaning, different formatting</H2>
        <P>
          Exact string matching would fail correct answers. The same blood count unit can come back as <Code>x10E3/uL</Code> or{' '}
          <Code>×10³/µL</Code>, 1 g of ceftriaxone is 1000 mg, and “twice daily” means BID. So each kind of field has a small normalizer that
          maps equivalent answers to the same key: units, reference ranges, flags, doses, routes and frequencies.
        </P>
        <Block label="How frequencies are compared, from data/demo.ts.">
{`const frequencyKey = (s: string) => {
  const t = s.toLowerCase();
  const asNeeded = /\\bprn\\b|as needed/.test(t);
  let base = squash(t);
  if (/q\\s*6\\s*h|every\\s*(6|six)\\s*hours?/.test(t)) base = 'q6h';
  else if (/\\bbid\\b|twice|(2|two) times|q\\s*12\\s*h|every\\s*12\\s*hours?/.test(t)) base = 'bid';
  else if (/daily|\\bqd\\b|once a day|every day|q\\s*24\\s*h|every\\s*24\\s*hours?/.test(t)) base = 'daily';
  return asNeeded ? \`\${base}+prn\` : base;
};`}
        </Block>
        <P>
          Rows are matched by test name, with aliases such as HGB for Hemoglobin. An exact alias match wins over a partial one, so
          “Hemoglobin” is never mistaken for “Hemoglobin A1c”. The scoring code is in <Source path="data/demo.ts" />.
        </P>

        <H2>Results</H2>
        <div className="mb-3 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
              <tr>
                <th scope="col" className="px-4 py-2.5 font-semibold">Document</th>
                <th scope="col" className="px-4 py-2.5 font-semibold">Fields correct</th>
                <th scope="col" className="px-4 py-2.5 font-semibold">Time</th>
              </tr>
            </thead>
            <tbody>
              {results.map(({ sample, run, score, notes }) => (
                <tr key={sample.id} className="border-t border-slate-200 dark:border-slate-700">
                  <th scope="row" className="px-4 py-2.5 font-medium text-slate-900 dark:text-white">{sample.title}</th>
                  <td className="px-4 py-2.5 tabular-nums">
                    {score.correct} / {score.total}
                    {notes > 0 && <span className="text-slate-500 dark:text-slate-400"> + {notes} handwritten notes</span>}
                  </td>
                  <td className="px-4 py-2.5 tabular-nums">{(run.ms / 1000).toFixed(1)} s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
          Real runs of <Code>{results[0].run.model}</Code> on {runDate}, saved so the demo can show results instantly. Run it live for a
          fresh result; answers can vary a little from run to run.
        </p>

        <H2>Keeping it free and safe</H2>
        <Bullets
          items={[
            <><strong className="font-semibold text-slate-900 dark:text-white">Free tiers.</strong> Gemini’s free API tier and Netlify Functions. There is no server to run or pay for.</>,
            <><strong className="font-semibold text-slate-900 dark:text-white">Rate limits.</strong> Netlify allows each visitor 3 live demo runs and 6 chat messages a minute. When you hit a limit, the page counts down until you can try again, and it does the same when Gemini itself asks callers to wait.</>,
            <><strong className="font-semibold text-slate-900 dark:text-white">Saved runs.</strong> The demo opens on the last saved real run, so most visitors never trigger a model call.</>,
            <><strong className="font-semibold text-slate-900 dark:text-white">No uploads, no personal data.</strong> Only built-in synthetic documents ever reach the model.</>,
          ]}
        />

        <H2>The chatbot uses the same pieces</H2>
        <P>
          “Ask about Oguz” runs on the same Gemini setup, with three guardrails (<Source path="netlify/functions/chat.ts" />):
        </P>
        <Bullets
          items={[
            <>The model answers in a fixed shape, <Code>{'{ onTopic, answer }'}</Code>. If <Code>onTopic</Code> isn’t true, the server sends a fixed reply instead of the model’s text.</>,
            <>Along with the new question, the model sees only the visitor’s three previous questions. Earlier answers live in the browser, where they could be edited, so they’re never sent back.</>,
            <>Answers are capped at 1,200 characters, and anything blocked for safety gets the fixed reply.</>,
          ]}
        />

        <H2>What I’d change for production</H2>
        <Bullets
          items={[
            <><strong className="font-semibold text-slate-900 dark:text-white">A real evaluation set.</strong> Hundreds of de-identified documents, not three, with per-field accuracy tracked over time.</>,
            <><strong className="font-semibold text-slate-900 dark:text-white">Confidence and review.</strong> Send empty or low-confidence fields to a person instead of straight into a database.</>,
            <><strong className="font-semibold text-slate-900 dark:text-white">Proper handling of health data.</strong> A model endpoint covered by a business associate agreement, no logging of document content, and tight access controls.</>,
            <><strong className="font-semibold text-slate-900 dark:text-white">Pinned, monitored models.</strong> Track accuracy, latency and cost per document, and rerun the evaluation before moving to a new model version.</>,
            <><strong className="font-semibold text-slate-900 dark:text-white">Evaluation in CI.</strong> So a prompt or schema change can’t quietly lower accuracy.</>,
            <><strong className="font-semibold text-slate-900 dark:text-white">OCR and page splitting first</strong> for long or messy scans, before the LLM step.</>,
          ]}
        />

        <H2>Stack</H2>
        <P>
          React, TypeScript, Tailwind CSS and Vite; Netlify Functions; Gemini 3.5 Flash-Lite through its REST API; headless Chrome for the
          documents. Built with help from Claude Code. The whole site is open source on{' '}
          <a href={REPO} target="_blank" rel="noreferrer noopener" className="inline-flex items-baseline text-sky-700 underline decoration-sky-300 underline-offset-2 hover:decoration-sky-600 dark:text-sky-300 dark:decoration-sky-700">
            GitHub<ArrowUpRightIcon />
          </a>
          .
        </P>

        <div className="mt-14 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-8 dark:border-slate-700">
          <a href="/#live-demo" className="rounded-full bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-500">
            Try the live demo
          </a>
          <a href="/" className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:border-sky-500 hover:text-sky-700 dark:border-slate-600 dark:text-slate-200 dark:hover:border-sky-400 dark:hover:text-sky-300">
            Back to {profile.name}
          </a>
        </div>
      </main>
    </div>
  );
};

export default DemoWriteup;
