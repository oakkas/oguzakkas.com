import type { Config } from '@netlify/functions';
import { demoSamples, type DemoTask } from '../../data/demo.ts';
import { busyResponse, callGemini } from '../../lib/gemini.ts';

const MODEL = process.env.GEMINI_EXTRACT_MODEL || process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';

const BUSY_MESSAGE = 'Live runs are busy right now. Please try again shortly.';
const ERROR_MESSAGE = 'Sorry, the live run failed. Please try again in a moment.';

const PROMPTS: Record<DemoTask, string> = {
  lab: [
    'This image is a laboratory report. Extract every test result row exactly as printed.',
    'For each row give: test (the name as printed), value (the result), unit, referenceRange (as printed), and flag ("H" if marked high, "L" if marked low, empty if not flagged).',
    'Do not include section titles or column headers as tests.',
    'Also list any handwritten notes, one string per note, or an empty list if there are none.',
    "If you can't read something, leave it empty rather than guessing.",
  ].join('\n'),
  meds: [
    'This image is a clinical note. List every medication mentioned, including ones started, stopped, held, or prescribed at discharge, once each.',
    'For each give: drug (generic name as written), dose (amount with unit, e.g. "500 mg"), route (e.g. "PO", "IV"), and frequency (as written, e.g. "daily", "twice daily", "every 6 hours as needed").',
    'If a drug is mentioned more than once, use its most complete mention.',
    'Also list adverse drug events: the drug that caused the reaction, and the reaction.',
    "If something isn't stated, leave it empty rather than guessing.",
  ].join('\n'),
};

const text = { type: 'STRING' };
const SCHEMAS: Record<DemoTask, unknown> = {
  lab: {
    type: 'OBJECT',
    properties: {
      results: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: { test: text, value: text, unit: text, referenceRange: text, flag: text },
          required: ['test', 'value', 'unit', 'referenceRange', 'flag'],
          propertyOrdering: ['test', 'value', 'unit', 'referenceRange', 'flag'],
        },
      },
      handwrittenNotes: { type: 'ARRAY', items: text },
    },
    required: ['results', 'handwrittenNotes'],
  },
  meds: {
    type: 'OBJECT',
    properties: {
      medications: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: { drug: text, dose: text, route: text, frequency: text },
          required: ['drug', 'dose', 'route', 'frequency'],
          propertyOrdering: ['drug', 'dose', 'route', 'frequency'],
        },
      },
      adverseEvents: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: { drug: text, reaction: text },
          required: ['drug', 'reaction'],
        },
      },
    },
    required: ['medications', 'adverseEvents'],
  },
};

export default async (req: Request) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY is not set');
    return Response.json({ error: ERROR_MESSAGE }, { status: 500 });
  }

  // Visitors pick one of the built-in samples; uploads aren't accepted
  let sampleId: unknown;
  try {
    sampleId = (await req.json())?.sampleId;
  } catch {
    // Falls through to the 400 below
  }
  const sample = demoSamples.find(s => s.id === sampleId);
  if (!sample) {
    return Response.json({ error: 'Unknown sample.' }, { status: 400 });
  }

  let image: string;
  try {
    const res = await fetch(new URL(sample.image, req.url));
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    image = Buffer.from(await res.arrayBuffer()).toString('base64');
  } catch (error) {
    console.error('Could not load sample image', sample.image, error);
    return Response.json({ error: ERROR_MESSAGE }, { status: 502 });
  }

  const outcome = await callGemini(apiKey, MODEL, {
    contents: [{
      role: 'user',
      parts: [{ inlineData: { mimeType: 'image/webp', data: image } }, { text: PROMPTS[sample.task] }],
    }],
    generationConfig: {
      maxOutputTokens: 4096,
      responseMimeType: 'application/json',
      responseSchema: SCHEMAS[sample.task],
    },
  }, 25_000);
  if (outcome.kind === 'busy') return busyResponse(BUSY_MESSAGE, outcome.retryAfter);
  if (outcome.kind !== 'ok') return Response.json({ error: ERROR_MESSAGE }, { status: 502 });

  let result: unknown;
  try {
    result = JSON.parse(outcome.text);
  } catch {
    console.error('Gemini returned non-JSON output', outcome.text.slice(0, 500));
    return Response.json({ error: ERROR_MESSAGE }, { status: 502 });
  }
  if (!result || typeof result !== 'object') {
    return Response.json({ error: ERROR_MESSAGE }, { status: 502 });
  }

  return Response.json({
    result,
    model: MODEL,
    ms: outcome.ms,
    inputTokens: outcome.inputTokens,
    outputTokens: outcome.outputTokens,
    ranAt: new Date().toISOString(),
  });
};

export const config: Config = {
  path: '/api/extract',
  method: 'POST',
  // Per visitor IP: at most 3 live runs a minute, since each sends a whole image. Demo mirrors this.
  rateLimit: { windowLimit: 3, windowSize: 60, aggregateBy: ['ip', 'domain'] },
};
