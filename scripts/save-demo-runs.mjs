// Runs every demo document through the deployed /api/extract function and saves
// the results to data/demoRuns.ts, so the demo can show a real run instantly.
// Run: npm run demo:save   (set BASE_URL to use a deploy preview instead)
import { writeFileSync } from 'node:fs';
import { demoSamples } from '../data/demo.ts';

const BASE_URL = process.env.BASE_URL || 'https://oguzakkas.com';
const DELAY_MS = 21_000; // the function allows 3 runs a minute per visitor

const runs = {};
for (const [index, sample] of demoSamples.entries()) {
  if (index > 0) await new Promise(resolve => setTimeout(resolve, DELAY_MS));
  const res = await fetch(`${BASE_URL}/api/extract`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sampleId: sample.id }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.result) {
    console.error(`${sample.id}: failed with ${res.status}`, data?.error ?? '');
    process.exit(1);
  }
  runs[sample.id] = data;
  console.log(`${sample.id}: ${data.model}, ${(data.ms / 1000).toFixed(1)} s, ${data.inputTokens + data.outputTokens} tokens`);
}

writeFileSync(
  new URL('../data/demoRuns.ts', import.meta.url),
  `// Saved results from real runs of /api/extract, shown until a visitor runs a
// document live. Regenerate from the live site with: npm run demo:save
import type { DemoRun } from './demo';

export const savedRuns: Record<string, DemoRun> = ${JSON.stringify(runs, null, 2)};
`,
);
console.log('Wrote data/demoRuns.ts');
